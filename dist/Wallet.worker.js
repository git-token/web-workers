'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
            _this.saveKeystore(_extends({}, payload));
            break;
          case 'RETRIEVE_KEYSTORE':
            _this.retrieveKeystore();
            break;
          default:
            _this.handleErrorMessage({
              error: 'Invalid Event: ' + event
            });
        }
      });
    }
  }, {
    key: 'saveKeystore',
    value: function saveKeystore(_ref2) {
      var _this2 = this;

      var serialized = _ref2.serialized;

      this.db.put({
        _id: 'keystore',
        serialized: serialized
      }).then(function () {
        return _this2.db.get('keystore');
      }).then(function (ks) {
        postMessage({
          event: 'KEYSTORE_SAVED',
          payload: { keystore: ks }
        });
        return null;
      }).catch(function (error) {
        _this2.handleErrorMessage({ error: error });
      });
    }
  }, {
    key: 'retrieveKeystore',
    value: function retrieveKeystore() {
      var _this3 = this;

      this.db.get('keystore').then(function (ks) {
        postMessage({
          event: 'SERIALIZED_KEYSTORE',
          payload: {
            serialized: ks
          }
        });
        return null;
      }).catch(function (error) {
        _this3.handleErrorMessage({ error: error });
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
    value: function handleErrorMessage(_ref3) {
      var error = _ref3.error;

      console.log('error', error);
      postMessage({
        event: 'WALLET_WORKER_ERROR',
        payload: {
          error: error ? error : 'Unhandled Error'
        }
      });
      return null;
    }
  }]);

  return GitTokenWalletWorker;
}();

exports.default = GitTokenWalletWorker;


var worker = new GitTokenWalletWorker({});