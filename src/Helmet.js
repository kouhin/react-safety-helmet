import React, {
    createContext,
    useLayoutEffect,
    useEffect,
    useCallback,
    useMemo,
    useContext,
    useRef
} from "react";
import ExecutionEnvironment from "exenv";
import PropTypes from "prop-types";
import deepEqual from "react-fast-compare";

import {
    convertReactPropstoHtmlAttributes,
    handleClientStateChange,
    mapStateOnServer,
    reducePropsToState,
    warn
} from "./HelmetUtils";
import {TAG_NAMES, VALID_TAG_NAMES} from "./HelmetConstants";
import rootReducer, {addProps, removeProps} from "./modules";

const HelmetContext = createContext();
HelmetContext.displayName = "HelmetContext";

const createHelmetStore = subscribe => {
    const store = {
        state: rootReducer()
    };
    store.peek = () => {
        if (
            !store.peekCache ||
            !store.peekCache.key ||
            store.peekCache.key !== store.state
        ) {
            store.peekCache = {
                key: store.state,
                value: reducePropsToState(store.state.propsList)
            };
        }
        return store.peekCache.value;
    };
    store.renderStatic = () => mapStateOnServer(store.peek());
    store.setState = (state, action) => {
        if (state !== store.state) {
            store.state = state;
            if (subscribe) subscribe(action);
            return true;
        }
        return false;
    };
    return store;
};

function HelmetProvider({
    canUseDOM = ExecutionEnvironment.canUseDOM,
    children,
    store = createHelmetStore()
}) {
    const dispatch = useCallback(
        action => {
            const nextState = rootReducer(store.state, action);
            if (store.setState(nextState, action)) {
                if (canUseDOM) {
                    handleClientStateChange(
                        reducePropsToState(store.state.propsList)
                    );
                }
            }
            return nextState;
        },
        [canUseDOM, store]
    );
    return (
        <HelmetContext.Provider value={dispatch}>
            {children}
        </HelmetContext.Provider>
    );
}

if (process.env.NODE_ENV !== "production") {
    HelmetProvider.propTypes = {
        canUseDOM: PropTypes.bool,
        children: PropTypes.node,
        store: PropTypes.shape({
            current: PropTypes.object,
            peek: PropTypes.func,
            renderStatic: PropTypes.func,
            subscribe: PropTypes.func
        })
    };
}

function mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
        return null;
    }

    switch (child.type) {
        case TAG_NAMES.SCRIPT:
        case TAG_NAMES.NOSCRIPT:
            return {
                innerHTML: nestedChildren
            };

        case TAG_NAMES.STYLE:
            return {
                cssText: nestedChildren
            };
    }

    throw new Error(
        `<${
            child.type
        } /> elements are self-closing and can not contain children. Refer to our API for more information.`
    );
}

function flattenArrayTypeChildren({
    child,
    arrayTypeChildren,
    newChildProps,
    nestedChildren
}) {
    return {
        ...arrayTypeChildren,
        [child.type]: [
            ...(arrayTypeChildren[child.type] || []),
            {
                ...newChildProps,
                ...mapNestedChildrenToProps(child, nestedChildren)
            }
        ]
    };
}

function warnOnInvalidChildren(child, nestedChildren) {
    if (process.env.NODE_ENV !== "production") {
        if (!VALID_TAG_NAMES.some(name => child.type === name)) {
            if (typeof child.type === "function") {
                return warn(
                    `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.`
                );
            }

            return warn(
                `Only elements types ${VALID_TAG_NAMES.join(
                    ", "
                )} are allowed. Helmet does not support rendering <${
                    child.type
                }> elements. Refer to our API for more information.`
            );
        }

        if (
            nestedChildren &&
            typeof nestedChildren !== "string" &&
            (!Array.isArray(nestedChildren) ||
                nestedChildren.some(
                    nestedChild => typeof nestedChild !== "string"
                ))
        ) {
            throw new Error(
                `Helmet expects a string as a child of <${
                    child.type
                }>. Did you forget to wrap your children in braces? ( <${
                    child.type
                }>{\`\`}</${
                    child.type
                }> ) Refer to our API for more information.`
            );
        }
    }
    return true;
}

function mapObjectTypeChildren({
    child,
    newProps,
    newChildProps,
    nestedChildren
}) {
    switch (child.type) {
        case TAG_NAMES.TITLE:
            return {
                ...newProps,
                [child.type]: nestedChildren,
                titleAttributes: {...newChildProps}
            };

        case TAG_NAMES.BODY:
            return {
                ...newProps,
                bodyAttributes: {...newChildProps}
            };

        case TAG_NAMES.HTML:
            return {
                ...newProps,
                htmlAttributes: {...newChildProps}
            };
    }

    return {
        ...newProps,
        [child.type]: {...newChildProps}
    };
}

function mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = {...newProps};

    Object.keys(arrayTypeChildren).forEach(arrayChildName => {
        newFlattenedProps = {
            ...newFlattenedProps,
            [arrayChildName]: arrayTypeChildren[arrayChildName]
        };
    });

    return newFlattenedProps;
}

function mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};

    React.Children.forEach(children, child => {
        if (!child || !child.props) {
            return;
        }

        const {children: nestedChildren, ...childProps} = child.props;
        const newChildProps = convertReactPropstoHtmlAttributes(childProps);

        warnOnInvalidChildren(child, nestedChildren);

        switch (child.type) {
            case TAG_NAMES.LINK:
            case TAG_NAMES.META:
            case TAG_NAMES.NOSCRIPT:
            case TAG_NAMES.SCRIPT:
            case TAG_NAMES.STYLE:
                arrayTypeChildren = flattenArrayTypeChildren({
                    child,
                    arrayTypeChildren,
                    newChildProps,
                    nestedChildren
                });
                break;

            default:
                newProps = mapObjectTypeChildren({
                    child,
                    newProps,
                    newChildProps,
                    nestedChildren
                });
                break;
        }
    });

    newProps = mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
    return newProps;
}

function generateUniqueString() {
    return (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15)
    );
}

function useHelmet(props) {
    const instance = useMemo(() => generateUniqueString(), []);
    const dispatch = useContext(HelmetContext);
    const called = useRef(false);
    const prevProps = useRef();
    const sideEffect = useCallback(() => {
        if (prevProps.current && deepEqual(prevProps.current, props)) {
            return;
        }
        prevProps.current = props;
        const {children, ...restProps} = props;
        let newProps = {...restProps};
        if (children) {
            newProps = mapChildrenToProps(children, newProps);
        }
        dispatch(addProps(instance, newProps));
    }, [dispatch, instance, props]);
    useLayoutEffect(() => {
        // componentDidMount, componentDidUpdate
        if (called.current) {
            sideEffect();
        }
        called.current = true;
    });
    useEffect(() => {
        return () => {
            // componentWillUnmount
            called.current = false;
            dispatch(removeProps(instance));
        };
    }, [dispatch, instance]);
    sideEffect();
}

const Helmet = props => {
    useHelmet(props);
    return null;
};

Helmet.displayName = "Helmet";

Helmet.defaultProps = {
    defer: true,
    encodeSpecialCharacters: true
};

if (process.env.NODE_ENV !== "production") {
    /**
     * @param {Object} base: {"target": "_blank", "href": "http://mysite.com/"}
     * @param {Object} bodyAttributes: {"className": "root"}
     * @param {String} defaultTitle: "Default Title"
     * @param {Boolean} defer: true
     * @param {Boolean} encodeSpecialCharacters: true
     * @param {Object} htmlAttributes: {"lang": "en", "amp": undefined}
     * @param {Array} link: [{"rel": "canonical", "href": "http://mysite.com/example"}]
     * @param {Array} meta: [{"name": "description", "content": "Test description"}]
     * @param {Array} noscript: [{"innerHTML": "<img src='http://mysite.com/js/test.js'"}]
     * @param {Function} onChangeClientState: "(newState) => console.log(newState)"
     * @param {Array} script: [{"type": "text/javascript", "src": "http://mysite.com/js/test.js"}]
     * @param {Array} style: [{"type": "text/css", "cssText": "div { display: block; color: blue; }"}]
     * @param {String} title: "Title"
     * @param {Object} titleAttributes: {"itemprop": "name"}
     * @param {String} titleTemplate: "MySite.com - %s"
     */
    Helmet.propTypes = {
        base: PropTypes.object,
        bodyAttributes: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        defaultTitle: PropTypes.string,
        defer: PropTypes.bool,
        encodeSpecialCharacters: PropTypes.bool,
        htmlAttributes: PropTypes.object,
        link: PropTypes.arrayOf(PropTypes.object),
        meta: PropTypes.arrayOf(PropTypes.object),
        noscript: PropTypes.arrayOf(PropTypes.object),
        onChangeClientState: PropTypes.func,
        script: PropTypes.arrayOf(PropTypes.object),
        style: PropTypes.arrayOf(PropTypes.object),
        title: PropTypes.string,
        titleAttributes: PropTypes.object,
        titleTemplate: PropTypes.string
    };
}

export {createHelmetStore, useHelmet, Helmet, HelmetProvider, mapStateOnServer};
