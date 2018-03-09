'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  
 */

/**
 * CharacterStream implements a stream of character tokens given a source text.
 * The API design follows that of CodeMirror.StringStream.
 *
 * Required:
 *
 *      sourceText: (string), A raw GraphQL source text. Works best if a line
 *        is supplied.
 *
 */

var CharacterStream = function () {
  function CharacterStream(sourceText) {
    var _this = this;

    _classCallCheck(this, CharacterStream);

    this.getStartOfToken = function () {
      return _this._start;
    };

    this.getCurrentPosition = function () {
      return _this._pos;
    };

    this.eol = function () {
      return _this._sourceText.length === _this._pos;
    };

    this.sol = function () {
      return _this._pos === 0;
    };

    this.peek = function () {
      return _this._sourceText.charAt(_this._pos) ? _this._sourceText.charAt(_this._pos) : null;
    };

    this.next = function () {
      var char = _this._sourceText.charAt(_this._pos);
      _this._pos++;
      return char;
    };

    this.eat = function (pattern) {
      var isMatched = _this._testNextCharacter(pattern);
      if (isMatched) {
        _this._start = _this._pos;
        _this._pos++;
        return _this._sourceText.charAt(_this._pos - 1);
      }
      return undefined;
    };

    this.eatWhile = function (match) {
      var isMatched = _this._testNextCharacter(match);
      var didEat = false;

      // If a match, treat the total upcoming matches as one token
      if (isMatched) {
        didEat = isMatched;
        _this._start = _this._pos;
      }

      while (isMatched) {
        _this._pos++;
        isMatched = _this._testNextCharacter(match);
        didEat = true;
      }

      return didEat;
    };

    this.eatSpace = function () {
      return _this.eatWhile(/[\s\u00a0]/);
    };

    this.skipToEnd = function () {
      _this._pos = _this._sourceText.length;
    };

    this.skipTo = function (position) {
      _this._pos = position;
    };

    this.match = function (pattern) {
      var consume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var caseFold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var token = null;
      var match = null;

      if (typeof pattern === 'string') {
        var regex = new RegExp(pattern, caseFold ? 'i' : 'g');
        match = regex.test(_this._sourceText.substr(_this._pos, pattern.length));
        token = pattern;
      } else if (pattern instanceof RegExp) {
        match = _this._sourceText.slice(_this._pos).match(pattern);
        token = match && match[0];
      }

      if (match != null) {
        if (typeof pattern === 'string' || match instanceof Array &&
        // String.match returns 'index' property, which flow fails to detect
        // for some reason. The below is a workaround, but an easier solution
        // is just checking if `match.index === 0`
        _this._sourceText.startsWith(match[0], _this._pos)) {
          if (consume) {
            _this._start = _this._pos;
            if (token && token.length) {
              _this._pos += token.length;
            }
          }
          return match;
        }
      }

      // No match available.
      return false;
    };

    this.backUp = function (num) {
      _this._pos -= num;
    };

    this.column = function () {
      return _this._pos;
    };

    this.indentation = function () {
      var match = _this._sourceText.match(/\s*/);
      var indent = 0;
      if (match && match.length === 0) {
        var whitespaces = match[0];
        var pos = 0;
        while (whitespaces.length > pos) {
          if (whitespaces.charCodeAt(pos) === 9) {
            indent += 2;
          } else {
            indent++;
          }
          pos++;
        }
      }

      return indent;
    };

    this.current = function () {
      return _this._sourceText.slice(_this._start, _this._pos);
    };

    this._start = 0;
    this._pos = 0;
    this._sourceText = sourceText;
  }

  _createClass(CharacterStream, [{
    key: '_testNextCharacter',
    value: function _testNextCharacter(pattern) {
      var character = this._sourceText.charAt(this._pos);
      var isMatched = false;
      if (typeof pattern === 'string') {
        isMatched = character === pattern;
      } else {
        isMatched = pattern instanceof RegExp ? pattern.test(character) : pattern(character);
      }
      return isMatched;
    }
  }]);

  return CharacterStream;
}();

exports.default = CharacterStream;