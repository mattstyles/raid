"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scroll = exports.actions = void 0;

var _most = require("most");

var actions = {
  scroll: '@@element/scroll'
};
exports.actions = actions;

var scroll = function scroll() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$el = _ref.el,
      el = _ref$el === void 0 ? window : _ref$el,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? actions.scroll : _ref$type;

  return (0, _most.fromEvent)('scroll', el).map(function (event) {
    return {
      type: type,
      payload: {
        raw: event,
        left: el.scrollLeft || el.scrollX,
        top: el.scrollTop || el.scrollY,
        timeStamp: event.timeStamp
      }
    };
  });
};

exports.scroll = scroll;