'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _ethereumjsUtil = require('ethereumjs-util');

var _keythereum = require('keythereum/dist/keythereum');

var _keythereum2 = _interopRequireDefault(_keythereum);

var _browserRequest = require('browser-request');

var _browserRequest2 = _interopRequireDefault(_browserRequest);

var _pouchdb = require('pouchdb');

var _pouchdb2 = _interopRequireDefault(_pouchdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import Web3 from 'web3'

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
    key: 'createKeystore',
    value: function createKeystore(_ref2) {
      var password = _ref2.password;

      return new _bluebird2.default(function (resolve, reject) {
        try {
          _keythereum2.default.create({ keyBytes: 64, ivBytes: 32 }, function (dk) {
            console.log('dk', dk);
            _keythereum2.default.dump(password, dk.privateKey, dk.salt, dk.iv, {}, function (keyObject) {
              console.log('keyObject', keyObject);
              resolve(keyObject);
            });
          });
        } catch (error) {
          console.log('error', error);
          reject(error);
        }

        // keystore.createVault({ password }, (error, ks) => {
        //   if (error) { reject(error) }
        //   ks.keyFromPassword(password, (error, derivedKey) => {
        //     if (error) { reject(error) }
        //     ks.generateNewAddress(derivedKey, 3);
        //     this.db.bulkDocs([
        //       { _id: 'keystore', keystore: ks.serialize() },
        //       { _id: 'addresses', addresses: ks.getAddresses() },
        //     ]).then(() => {
        //       return this.db.get('addresses')
        //     }).then((doc) => {
        //       console.log('doc', doc)
        //       resolve(doc.addresses)
        //     }).catch((error) => {
        //       reject(error)
        //     })
        //   })
        // })
      });
    }
  }, {
    key: 'listen',
    value: function listen() {
      var _this = this;

      console.log('GitToken Wallet Web Worker Listening for Events');
      addEventListener('message', function (msg) {
        var _JSON$parse = JSON.parse(msg.data),
            event = _JSON$parse.event,
            payload = _JSON$parse.payload;

        switch (event) {
          case 'WALLET_CREATE_KEYSTORE':
            var password = payload.password;

            console.log('password', password);
            _this.createKeystore({ password: password }).then(function (addresses) {
              postMessage(JSON.stringify({
                event: 'WALLET_ADDRESSES',
                payload: addresses
              }));
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
      postMessage(JSON.stringify({
        event: 'configured',
        payload: { configured: true }
      }));
    }
  }, {
    key: 'handleErrorMessage',
    value: function handleErrorMessage(_ref3) {
      var error = _ref3.error;

      postMessage(JSON.stringify({
        error: error ? error : 'Unhandled Error'
      }));
    }
  }]);

  return GitTokenWalletWorker;
}();

exports.default = GitTokenWalletWorker;


var worker = new GitTokenWalletWorker({});