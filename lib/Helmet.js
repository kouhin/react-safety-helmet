"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.join");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

exports.__esModule = true;
exports.createHelmetStore = createHelmetStore;
exports.default = exports.HelmetProvider = exports.Helmet = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactReffect = _interopRequireDefault(require("react-reffect"));

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

var _HelmetUtils = require("./HelmetUtils.js");

var _HelmetConstants = require("./HelmetConstants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Helmet = function Helmet(Component) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(HelmetWrapper, _React$Component);

    function HelmetWrapper() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = HelmetWrapper.prototype;

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
      return !(0, _reactFastCompare.default)(this.props, nextProps);
    };

    _proto.mapNestedChildrenToProps = function mapNestedChildrenToProps(child, nestedChildren) {
      if (!nestedChildren) {
        return null;
      }

      switch (child.type) {
        case _HelmetConstants.TAG_NAMES.SCRIPT:
        case _HelmetConstants.TAG_NAMES.NOSCRIPT:
          return {
            innerHTML: nestedChildren
          };

        case _HelmetConstants.TAG_NAMES.STYLE:
          return {
            cssText: nestedChildren
          };
      }

      throw new Error("<" + child.type + " /> elements are self-closing and can not contain children. Refer to our API for more information.");
    };

    _proto.flattenArrayTypeChildren = function flattenArrayTypeChildren(_ref) {
      var _objectSpread2;

      var child = _ref.child,
          arrayTypeChildren = _ref.arrayTypeChildren,
          newChildProps = _ref.newChildProps,
          nestedChildren = _ref.nestedChildren;
      return _objectSpread({}, arrayTypeChildren, (_objectSpread2 = {}, _objectSpread2[child.type] = [].concat(arrayTypeChildren[child.type] || [], [_objectSpread({}, newChildProps, {}, this.mapNestedChildrenToProps(child, nestedChildren))]), _objectSpread2));
    };

    _proto.mapObjectTypeChildren = function mapObjectTypeChildren(_ref2) {
      var _objectSpread3, _objectSpread4;

      var child = _ref2.child,
          newProps = _ref2.newProps,
          newChildProps = _ref2.newChildProps,
          nestedChildren = _ref2.nestedChildren;

      switch (child.type) {
        case _HelmetConstants.TAG_NAMES.TITLE:
          return _objectSpread({}, newProps, (_objectSpread3 = {}, _objectSpread3[child.type] = nestedChildren, _objectSpread3.titleAttributes = _objectSpread({}, newChildProps), _objectSpread3));

        case _HelmetConstants.TAG_NAMES.BODY:
          return _objectSpread({}, newProps, {
            bodyAttributes: _objectSpread({}, newChildProps)
          });

        case _HelmetConstants.TAG_NAMES.HTML:
          return _objectSpread({}, newProps, {
            htmlAttributes: _objectSpread({}, newChildProps)
          });
      }

      return _objectSpread({}, newProps, (_objectSpread4 = {}, _objectSpread4[child.type] = _objectSpread({}, newChildProps), _objectSpread4));
    };

    _proto.mapArrayTypeChildrenToProps = function mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
      var newFlattenedProps = _objectSpread({}, newProps);

      Object.keys(arrayTypeChildren).forEach(function (arrayChildName) {
        var _objectSpread5;

        newFlattenedProps = _objectSpread({}, newFlattenedProps, (_objectSpread5 = {}, _objectSpread5[arrayChildName] = arrayTypeChildren[arrayChildName], _objectSpread5));
      });
      return newFlattenedProps;
    };

    _proto.warnOnInvalidChildren = function warnOnInvalidChildren(child, nestedChildren) {
      if (process.env.NODE_ENV !== "production") {
        if (!_HelmetConstants.VALID_TAG_NAMES.some(function (name) {
          return child.type === name;
        })) {
          if (typeof child.type === "function") {
            return (0, _HelmetUtils.warn)("You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.");
          }

          return (0, _HelmetUtils.warn)("Only elements types " + _HelmetConstants.VALID_TAG_NAMES.join(", ") + " are allowed. Helmet does not support rendering <" + child.type + "> elements. Refer to our API for more information.");
        }

        if (nestedChildren && typeof nestedChildren !== "string" && (!Array.isArray(nestedChildren) || nestedChildren.some(function (nestedChild) {
          return typeof nestedChild !== "string";
        }))) {
          throw new Error("Helmet expects a string as a child of <" + child.type + ">. Did you forget to wrap your children in braces? ( <" + child.type + ">{``}</" + child.type + "> ) Refer to our API for more information.");
        }
      }

      return true;
    };

    _proto.mapChildrenToProps = function mapChildrenToProps(children, newProps) {
      var _this = this;

      var arrayTypeChildren = {};

      _react.default.Children.forEach(children, function (child) {
        if (!child || !child.props) {
          return;
        }

        var _child$props = child.props,
            nestedChildren = _child$props.children,
            childProps = _objectWithoutPropertiesLoose(_child$props, ["children"]);

        var newChildProps = (0, _HelmetUtils.convertReactPropstoHtmlAttributes)(childProps);

        _this.warnOnInvalidChildren(child, nestedChildren);

        switch (child.type) {
          case _HelmetConstants.TAG_NAMES.LINK:
          case _HelmetConstants.TAG_NAMES.META:
          case _HelmetConstants.TAG_NAMES.NOSCRIPT:
          case _HelmetConstants.TAG_NAMES.SCRIPT:
          case _HelmetConstants.TAG_NAMES.STYLE:
            arrayTypeChildren = _this.flattenArrayTypeChildren({
              child: child,
              arrayTypeChildren: arrayTypeChildren,
              newChildProps: newChildProps,
              nestedChildren: nestedChildren
            });
            break;

          default:
            newProps = _this.mapObjectTypeChildren({
              child: child,
              newProps: newProps,
              newChildProps: newChildProps,
              nestedChildren: nestedChildren
            });
            break;
        }
      });

      newProps = this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
      return newProps;
    };

    _proto.render = function render() {
      var _this$props = this.props,
          children = _this$props.children,
          props = _objectWithoutPropertiesLoose(_this$props, ["children"]);

      var newProps = _objectSpread({}, props);

      if (children) {
        newProps = this.mapChildrenToProps(children, newProps);
      }

      return _react.default.createElement(Component, newProps);
    };

    _createClass(HelmetWrapper, null, [{
      key: "canUseDOM",

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
      set: function set(canUseDOM) {
        Component.canUseDOM = canUseDOM;
      }
    }]);

    return HelmetWrapper;
  }(_react.default.Component), _defineProperty(_class, "propTypes", {
    base: _propTypes.default.object,
    bodyAttributes: _propTypes.default.object,
    children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]),
    defaultTitle: _propTypes.default.string,
    defer: _propTypes.default.bool,
    encodeSpecialCharacters: _propTypes.default.bool,
    htmlAttributes: _propTypes.default.object,
    link: _propTypes.default.arrayOf(_propTypes.default.object),
    meta: _propTypes.default.arrayOf(_propTypes.default.object),
    noscript: _propTypes.default.arrayOf(_propTypes.default.object),
    onChangeClientState: _propTypes.default.func,
    script: _propTypes.default.arrayOf(_propTypes.default.object),
    style: _propTypes.default.arrayOf(_propTypes.default.object),
    title: _propTypes.default.string,
    titleAttributes: _propTypes.default.object,
    titleTemplate: _propTypes.default.string
  }), _defineProperty(_class, "defaultProps", {
    defer: true,
    encodeSpecialCharacters: true
  }), _temp;
};

var NullComponent = function NullComponent() {
  return null;
};

var _createSideEffect = (0, _reactReffect.default)(_HelmetUtils.reducePropsToState, _HelmetUtils.handleClientStateChange)(NullComponent),
    Provider = _createSideEffect.Provider,
    Consumer = _createSideEffect.Consumer,
    createStore = _createSideEffect.createStore;

exports.HelmetProvider = Provider;
var HelmetExport = Helmet(Consumer);
exports.Helmet = HelmetExport;

function createHelmetStore() {
  var store = createStore.apply(void 0, arguments);
  return _objectSpread({}, store, {
    renderStatic: function renderStatic() {
      return (0, _HelmetUtils.mapStateOnServer)(store.peek());
    }
  });
}

var _default = HelmetExport;
exports.default = _default;