import axios from 'axios'

export default class GitTokenAccountWorker {
  constructor({ }) {
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

  getProfile({ url }) {
    axios({ method: 'GET', url }).then((result) => {
      console.log('result', result)
      postMessage(JSON.stringify({
        type: 'SET_ACCOUNT_DETAILS',
        id: 'profile',
        value: result
      }))
      return null;
    }).catch((error) => {
      console.error(error)
    })
  }

}

const worker = new GitTokenAccountWorker({})
