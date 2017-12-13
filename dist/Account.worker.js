'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
        var _msg$data = msg.data,
            event = _msg$data.event,
            payload = _msg$data.payload;

        switch (event) {
          case 'GET_PROFILE':
            return _this.getProfile({ url: payload });
            break;
          default:
            throw new Error('Invalid Event for Web Worker');
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