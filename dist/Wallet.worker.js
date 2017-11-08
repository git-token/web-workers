'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _browserRequest = require('browser-request');

var _browserRequest2 = _interopRequireDefault(_browserRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import Web3 from 'web3'

var GitTokenWalletWorker = function () {
  function GitTokenWalletWorker(_ref) {
    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, GitTokenWalletWorker);

    this.db = indexDB.open('gittoken-wallet');

    console.log('this.db', this.db);

    this.listen();
  }

  _createClass(GitTokenWalletWorker, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      console.log('GitToken Wallet Web Worker Listening for Events');
      addEventListener('message', function (msg) {
        var _JSON$parse = JSON.parse(msg.data),
            event = _JSON$parse.event,
            payload = _JSON$parse.payload;

        switch (event) {
          case 'save_data':
            var key = payload.key,
                value = payload.value;

            break;
          default:
            _this.handleErrorMessage({
              error: 'Invalid Event: ' + event
            });
        }
      });
    }
  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      console.log('GitTokenWalletWorker::setConfig::config', config);
      postMessage(JSON.stringify({
        event: 'configured',
        payload: { configured: true }
      }));
    }
  }, {
    key: 'handleErrorMessage',
    value: function handleErrorMessage(_ref2) {
      var error = _ref2.error;

      postMessage(JSON.stringify({
        error: error ? error : 'Unhandled Error'
      }));
    }
  }]);

  return GitTokenWalletWorker;
}();

exports.default = GitTokenWalletWorker;


var worker = new GitTokenWalletWorker({});