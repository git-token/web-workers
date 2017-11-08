import Promise, { promisifyAll } from 'bluebird'
import request from 'browser-request'
import leveljs from 'level-js'
import levelup from 'levelup'

// import Web3 from 'web3'

export default class GitTokenWalletWorker {
  constructor({ }) {
    this.db = levelup('gittoken-wallet', { db: leveljs })

    this.dbWriteStream = this.db.createWriteStream()
    this.dbReadStream  = this.db.createReadStream()

    this.dbReadStream.on('data', (data) => {
      console.log('GitTokenWalletWorker::Wrote Data to DB', data)
      postMessage(JSON.stringify({
        event: 'data_saved',
        payload: { data }
      }))
    })

    this.listen()
  }

  listen() {
    console.log('GitToken Wallet Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      const { event, payload } = JSON.parse(msg.data)
      switch(event) {
        case 'save_data':
          const { key, value } = payload
          this.dbWriteStream.write({ key, value })
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
