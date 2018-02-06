import React from "react";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";
import {STORE_KEY} from "./HelmetConstants";
import {addHelmetProps, removeHelmetProps} from "./modules";
import mapChildrenToProps from "./mapChildrenToProps";

class Helmet extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.store = props[STORE_KEY] || context[STORE_KEY];
    }

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
    static propTypes = {
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

    static contextTypes = {
        [STORE_KEY]: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired
        })
    };

    static defaultProps = {
        defer: true,
        encodeSpecialCharacters: true
    };

    shouldComponentUpdate(nextProps) {
        return !deepEqual(this.props, nextProps);
    }

    componentWillUnmount() {
        if (this.store) {
            this.store.dispatch(removeHelmetProps(this));
        }
    }

    render() {
        const {children, ...props} = this.props;
        let newProps = {...props};
        if (children) {
            newProps = mapChildrenToProps(children, newProps);
        }
        if (this.store) {
            this.store.dispatch(addHelmetProps(this, newProps));
        }
        return null;
    }
}

export default Helmet;
