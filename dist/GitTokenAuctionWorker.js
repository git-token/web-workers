'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GitTokenAuctionWorker = function () {
  function GitTokenAuctionWorker(_ref) {
    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, GitTokenAuctionWorker);

    this.listen();
  }

  _createClass(GitTokenAuctionWorker, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      console.log('GitToken Auction Web Worker Listening for Events');
      addEventListener('message', function (msg) {
        var _JSON$parse = JSON.parse(msg.data),
            event = _JSON$parse.event,
            values = _JSON$parse.values;

        switch (event) {
          case 'highestBid':
            _this.highestBid({ bids: values });
            break;
          default:
            _this.handleErrorMessage({
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
    }
  }, {
    key: 'highestBid',
    value: function highestBid(_ref3) {
      var bids = _ref3.bids;

      console.log('highestBid::bids', bids);
    }
  }]);

  return GitTokenAuctionWorker;
}();

exports.default = GitTokenAuctionWorker;