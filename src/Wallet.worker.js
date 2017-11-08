import Promise, { promisifyAll } from 'bluebird'

import Tx from 'ethereumjs-tx'
import { ecsign, sha3 } from 'ethereumjs-util'
import keythereum from 'keythereum/dist/keythereum'
import request from 'browser-request'
import PouchDB from 'pouchdb'

// import Web3 from 'web3'

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

  createKeystore({ password }) {
    return new Promise((resolve, reject) => {
      try {
        keythereum.create({ keyBytes: 64, ivBytes: 32 }, (dk) => {
          console.log('dk', dk)
          keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, {}, (keyObject) => {
            console.log('keyObject', keyObject)
            resolve(keyObject)
          })
        })
      } catch(error) {
        console.log('error', error)
        reject(error)
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
    })
  }

  listen() {
    console.log('GitToken Wallet Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      const { event, payload } = JSON.parse(msg.data)
      switch(event) {
        case 'WALLET_CREATE_KEYSTORE':
          const { password } = payload
          console.log('password', password)
          this.createKeystore({ password }).then((addresses) => {
            postMessage(JSON.stringify({
              event: 'WALLET_ADDRESSES',
              payload: addresses
            }))
          }).catch((error) => this.handleErrorMessage({ error }))
          break;
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
    postMessage(JSON.stringify({
      error: error ? error : 'Unhandled Error'
    }))
  }

}

const worker = new GitTokenWalletWorker({})
