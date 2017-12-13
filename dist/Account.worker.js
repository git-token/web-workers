'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GitTokenAccountWorker = function () {
  function GitTokenAccountWorker(_ref) {
    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, GitTokenAccountWorker);

    this.listen();
  }

  _createClass(GitTokenAccountWorker, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      console.log('GitToken Account Web Worker Listening for Events');
      addEventListener('message', function (msg) {
        console.log('msg', msg);
        console.log('typeof msg', typeof msg === 'undefined' ? 'undefined' : _typeof(msg));

        var _msg$data = msg.data,
            type = _msg$data.type,
            value = _msg$data.value;


        console.log('type', type);
        console.log('value', value);

        switch (type) {
          case 'GET_PROFILE':
            return _this.getProfile({ url: value });
            break;
          case 'webpackOk':
            console.log('Webpack setup');
            break;
          default:
            throw new Error('Invalid Type for Web Worker: ' + type);
        }
      });
    }
  }, {
    key: 'getProfile',
    value: function getProfile(_ref2) {
      var url = _ref2.url;

      (0, _axios2.default)({ method: 'GET', url: url }).then(function (result) {
        postMessage({
          type: 'SET_ACCOUNT_DETAILS',
          id: 'profile',
          value: result
        });
        return null;
      }).catch(function (error) {
        console.log('error', error);
        throw error;
      });
    }
  }]);

  return GitTokenAccountWorker;
}();

exports.default = GitTokenAccountWorker;


var worker = new GitTokenAccountWorker({});