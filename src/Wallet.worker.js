import Promise, { promisifyAll } from 'bluebird'

import request from 'browser-request'
import PouchDB from 'pouchdb'


export default class GitTokenWalletWorker {
  constructor({ ethereumProvider, torvaldsProvider }) {
    this.db = new PouchDB('gittoken_wallet')

    this.db.info().then((info) => {
      console.log('info', info)
    }).catch((error) => {
      console.log('error', error)
    })



    this.listen()
  }

  listen() {
    console.log('GitToken Wallet Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      const { event, payload } = JSON.parse(msg.data)
      switch(event) {
        // case 'WALLET_CREATE_KEYSTORE':
        //   const { password } = payload
        //   console.log('password', password)
        //   this.createKeystore({ password }).then((addresses) => {
        //     postMessage(JSON.stringify({
        //       event: 'WALLET_ADDRESSES',
        //       payload: addresses
        //     }))
        //   }).catch((error) => this.handleErrorMessage({ error }))
        //   break;
        default:
          this.handleErrorMessage({
            error: `Invalid Event: ${event}`
          })
      }
    })
  }

  setConfig(config) {
    console.log('GitTokenWalletWorker::setConfig::config', config)
    postMessage(JSON.stringify({
      event: 'configured',
      payload: { configured: true }
    }))
  }

  handleErrorMessage({ error }) {
    console.log('error', error)
    postMessage(JSON.stringify({
      error: error ? error : 'Unhandled Error'
    }))
  }

}

const worker = new GitTokenWalletWorker({})
