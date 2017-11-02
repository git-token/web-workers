'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GitTokenRegistry = require('gittoken-contracts/build/contracts/GitTokenRegistry.json');

var _GitTokenRegistry2 = _interopRequireDefault(_GitTokenRegistry);

var _githubApi = require('github-api');

var _githubApi2 = _interopRequireDefault(_githubApi);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import Web3 from 'web3'

var GitTokenRegistryWorker = function () {
  function GitTokenRegistryWorker(_ref) {
    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, GitTokenRegistryWorker);

    this.listen();
  }

  _createClass(GitTokenRegistryWorker, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      console.log('GitToken Registry Web Worker Listening for Events');
      addEventListener('message', function (msg) {
        var _JSON$parse = JSON.parse(msg.data),
            event = _JSON$parse.event,
            payload = _JSON$parse.payload;

        switch (event) {
          case 'verify_organization':
            return _this.verifyOrganization(payload);
            break;
          case 'set_config':
            return _this.setConfig(payload);
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
    value: function setConfig(_ref2) {
      var registryAPI = _ref2.registryAPI;

      this.registryAPI = this.registryAPI;
      postMessage(JSON.stringify({ msg: 'configured' }));
    }
  }, {
    key: 'validateAdmin',
    value: function validateAdmin(_ref3) {
      var username = _ref3.username,
          token = _ref3.token,
          organization = _ref3.organization;

      return new Promise(function (resolve, reject) {
        // console.log('username, token, organization', username, token, organization)
        var github = new _githubApi2.default({ username: username, token: token });
        var user = github.getUser();
        var org = github.getOrganization(organization);
        var profile = void 0;
        Promise.resolve(user.getProfile()).then(function (_ref4) {
          var data = _ref4.data;

          profile = data;
          return org.listMembers({ role: 'admin' });
        }).then(function (_ref5) {
          var data = _ref5.data;

          return data;
        }).map(function (member) {
          if (member.login == profile.login) {
            resolve(true);
          } else {
            return null;
          }
        }).then(function () {
          resolve(false);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'verifyOrganization',
    value: function verifyOrganization(details) {
      var _this2 = this;

      var organization = details.organization;

      this.validateAdmin(details).then(function (validated) {
        console.log('validated', validated);
        return (0, _axios.post)(_this2.registryAPI + '/verify/' + organization, details);
      }).then(function (verified) {
        postMessage(JSON.stringify({ verified: verified }));
      }).catch(function (error) {
        console.log('error', error);
      });
    }
  }, {
    key: 'handleErrorMessage',
    value: function handleErrorMessage(_ref6) {
      var error = _ref6.error;

      postMessage(JSON.stringify({
        error: error ? error : 'Unhandled Error'
      }));
    }
  }]);

  return GitTokenRegistryWorker;
}();

exports.default = GitTokenRegistryWorker;


var worker = new GitTokenRegistryWorker({});