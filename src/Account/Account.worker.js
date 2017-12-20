import axios from 'axios'

import {
  accountVerified,
  verifyAccount,
  getProfile
} from './gittoken/index'

export default class GitTokenAccountWorker {
  constructor({ }) {

    /* Bind Methods */ 
    this.accountVerified = accountVerified.bind(this)
    this.verifyAccount = verifyAccount.bind(this)
    this.getProfile = getProfile.bind(this)

    this.listen()
  }

  listen() {
    console.log('GitToken Account Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      const { type, value } = msg.data
      if (type) {
        switch(type) {
          case 'GET_PROFILE':
            return this.getProfile({ url: value })
            break;
          case 'webpackOk':
            break;
          default:
            console.error(new Error(`Invalid Type for Web Worker: ${type}`))
        }
      }
    })
  }


}

const worker = new GitTokenAccountWorker({})
