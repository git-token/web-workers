'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Registry = require('gittoken-contracts/build/contracts/Registry.json');

var _Registry2 = _interopRequireDefault(_Registry);

var _githubApi = require('github-api');

var _githubApi2 = _interopRequireDefault(_githubApi);

var _browserRequest = require('browser-request');

var _browserRequest2 = _interopRequireDefault(_browserRequest);

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
          case 'configure':
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
      postMessage(JSON.stringify({
        event: 'configured',
        payload: { configured: true }
      }));
    }
  }, {
    key: 'validateAdmin',
    value: function validateAdmin(_ref3) {
      var username = _ref3.username,
          token = _ref3.token,
          organization = _ref3.organization;

      return new _bluebird2.default(function (resolve, reject) {
        // console.log('username, token, organization', username, token, organization)
        var github = new _githubApi2.default({ username: username, token: token });
        var user = github.getUser();
        var org = github.getOrganization(organization);
        var profile = void 0;
        _bluebird2.default.resolve(user.getProfile()).then(function (_ref4) {
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
      console.log('verifyOrganization::details', details);
      var username = details.username,
          token = details.token,
          organization = details.organization,
          uri = details.uri;

      this.validateAdmin({ username: username, token: token, organization: organization }).then(function (validated) {
        console.log('validated', validated);
        return (0, _browserRequest2.default)({
          method: 'POST',
          uri: uri,
          body: details,
          json: true
        }, function (error, result) {
          if (error) {
            throw error;
          }
          console.log('result', result);
          postMessage(JSON.stringify({
            event: 'organization_verified',
            payload: result
          }));
        });
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