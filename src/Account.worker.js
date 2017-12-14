import axios from 'axios'

export default class GitTokenAccountWorker {
  constructor({ }) {
    this.listen()
  }

  listen() {
    console.log('GitToken Account Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      const { type, value } = JSON.parse(msg.data)

      switch(type) {
        case 'GET_PROFILE':
          return this.getProfile({ url: value })
          break;
        case 'webpackOk':
          break;
        default:
          throw new Error(`Invalid Type for Web Worker: ${type}`)
      }
    })
  }

  getProfile({ url }) {
    axios({ method: 'GET', url }).then((result) => {
      postMessage(JSON.stringify({
        type: 'SET_ACCOUNT_DETAILS',
        id: 'profile',
        value: result
      }))
      return null;
    }).catch((error) => {
      console.log('error', error)
      throw error
    })
  }

}

const worker = new GitTokenAccountWorker({})
