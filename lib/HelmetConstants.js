"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.keys");

exports.__esModule = true;
exports.HELMET_ATTRIBUTE = exports.SELF_CLOSING_TAGS = exports.HTML_TAG_MAP = exports.HELMET_PROPS = exports.REACT_TAG_MAP = exports.TAG_PROPERTIES = exports.VALID_TAG_NAMES = exports.TAG_NAMES = exports.ATTRIBUTE_NAMES = void 0;
var ATTRIBUTE_NAMES = {
  BODY: "bodyAttributes",
  HTML: "htmlAttributes",
  TITLE: "titleAttributes"
};
exports.ATTRIBUTE_NAMES = ATTRIBUTE_NAMES;
var TAG_NAMES = {
  BASE: "base",
  BODY: "body",
  HEAD: "head",
  HTML: "html",
  LINK: "link",
  META: "meta",
  NOSCRIPT: "noscript",
  SCRIPT: "script",
  STYLE: "style",
  TITLE: "title"
};
exports.TAG_NAMES = TAG_NAMES;
var VALID_TAG_NAMES = Object.keys(TAG_NAMES).map(function (name) {
  return TAG_NAMES[name];
});
exports.VALID_TAG_NAMES = VALID_TAG_NAMES;
var TAG_PROPERTIES = {
  CHARSET: "charset",
  CSS_TEXT: "cssText",
  HREF: "href",
  HTTPEQUIV: "http-equiv",
  INNER_HTML: "innerHTML",
  ITEM_PROP: "itemprop",
  NAME: "name",
  PROPERTY: "property",
  REL: "rel",
  SRC: "src"
};
exports.TAG_PROPERTIES = TAG_PROPERTIES;
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
exports.REACT_TAG_MAP = REACT_TAG_MAP;
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate"
};
exports.HELMET_PROPS = HELMET_PROPS;
var HTML_TAG_MAP = Object.keys(REACT_TAG_MAP).reduce(function (obj, key) {
  obj[REACT_TAG_MAP[key]] = key;
  return obj;
}, {});
exports.HTML_TAG_MAP = HTML_TAG_MAP;
var SELF_CLOSING_TAGS = [TAG_NAMES.NOSCRIPT, TAG_NAMES.SCRIPT, TAG_NAMES.STYLE];
exports.SELF_CLOSING_TAGS = SELF_CLOSING_TAGS;
var HELMET_ATTRIBUTE = "data-react-helmet";
exports.HELMET_ATTRIBUTE = HELMET_ATTRIBUTE;