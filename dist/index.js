'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GitTokenVotingWorker = exports.GitTokenAdminWorker = exports.GitTokenAuctionWorker = undefined;

var _GitTokenAuctionWorker = require('./GitTokenAuctionWorker.js');

var _GitTokenAuctionWorker2 = _interopRequireDefault(_GitTokenAuctionWorker);

var _GitTokenAdminWorker = require('./GitTokenAdminWorker.js');

var _GitTokenAdminWorker2 = _interopRequireDefault(_GitTokenAdminWorker);

var _GitTokenVotingWorker = require('./GitTokenVotingWorker.js');

var _GitTokenVotingWorker2 = _interopRequireDefault(_GitTokenVotingWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.GitTokenAuctionWorker = _GitTokenAuctionWorker2.default;
exports.GitTokenAdminWorker = _GitTokenAdminWorker2.default;
exports.GitTokenVotingWorker = _GitTokenVotingWorker2.default;