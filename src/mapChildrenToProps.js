import React from "react";
import {convertReactPropstoHtmlAttributes, warn} from "./HelmetUtils.js";
import {TAG_NAMES, VALID_TAG_NAMES} from "./HelmetConstants.js";

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
export default mapChildrenToProps;
