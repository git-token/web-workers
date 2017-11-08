'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegistryWorker = exports.WalletWorker = exports.VotingWorker = exports.AdminWorker = exports.AuctionWorker = undefined;

var _AuctionWorker = require('./Auction.worker.js');

var _AuctionWorker2 = _interopRequireDefault(_AuctionWorker);

var _AdminWorker = require('./Admin.worker.js');

var _AdminWorker2 = _interopRequireDefault(_AdminWorker);

var _VotingWorker = require('./Voting.worker.js');

var _VotingWorker2 = _interopRequireDefault(_VotingWorker);

var _RegistryWorker = require('./Registry.worker.js');

var _RegistryWorker2 = _interopRequireDefault(_RegistryWorker);

var _WalletWorker = require('./Wallet.worker.js');

var _WalletWorker2 = _interopRequireDefault(_WalletWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.AuctionWorker = _AuctionWorker2.default;
exports.AdminWorker = _AdminWorker2.default;
exports.VotingWorker = _VotingWorker2.default;
exports.WalletWorker = _WalletWorker2.default;
exports.RegistryWorker = _RegistryWorker2.default;