'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _browserRequest = require('browser-request');

var _browserRequest2 = _interopRequireDefault(_browserRequest);

var _pouchdb = require('pouchdb');

var _pouchdb2 = _interopRequireDefault(_pouchdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GitTokenWalletWorker = function () {
  function GitTokenWalletWorker(_ref) {
    var ethereumProvider = _ref.ethereumProvider,
        torvaldsProvider = _ref.torvaldsProvider;

    _classCallCheck(this, GitTokenWalletWorker);

    this.db = new _pouchdb2.default('gittoken_wallet');

    this.db.info().then(function (info) {
      console.log('info', info);
    }).catch(function (error) {
      console.log('error', error);
    });

    this.listen();
  }

  _createClass(GitTokenWalletWorker, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      console.log('GitToken Wallet Web Worker Listening for Events');
      addEventListener('message', function (msg) {
        var _msg$data = msg.data,
            event = _msg$data.event,
            payload = _msg$data.payload;

        switch (event) {
          case 'SAVE_KEYSTORE':
            _this.db.put({
              _id: 'keystore',
              serialized: payload['serialized']
            }).then(function () {
              return _this.db.get('keystore');
            }).then(function (ks) {
              console.log('ks', ks);
              postMessage({
                event: 'KEYSTORE_SAVED',
                payload: { keystore: ks }
              });
            }).catch(function (error) {
              return _this.handleErrorMessage({ error: error });
            });
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
      postMessage({
        event: 'configured',
        payload: { configured: true }
      });
    }
  }, {
    key: 'handleErrorMessage',
    value: function handleErrorMessage(_ref2) {
      var error = _ref2.error;

      console.log('error', error);
      postMessage({
        error: error ? error : 'Unhandled Error'
      });
    }
  }]);

  return GitTokenWalletWorker;
}();

exports.default = GitTokenWalletWorker;


var worker = new GitTokenWalletWorker({});