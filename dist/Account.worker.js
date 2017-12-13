'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            return _this.handleErrorMessage({
              error: 'Invalid Event: ' + event
            });
        }
      });
    }
  }, {
    key: 'handleErrorMessage',
    value: function handleErrorMessage(_ref2) {
      var error = _ref2.error;

      postMessage(JSON.stringify({
        error: error ? error : 'Unhandled Error'
      }));
      return null;
    }
  }, {
    key: 'getProfile',
    value: function getProfile(_ref3) {
      var _this2 = this;

      var url = _ref3.url;

      axios({ method: 'GET', url: url }).then(function (result) {
        postMessage(JSON.stringify({
          event: 'GET_PROFILE',
          payload: result
        }));
        return null;
      }).catch(function (error) {
        return _this2.handleErrorMessage({
          error: 'Invalid Event: ' + event
        });
      });
    }
  }]);

  return GitTokenAccountWorker;
}();

exports.default = GitTokenAccountWorker;


var worker = new GitTokenAccountWorker({});