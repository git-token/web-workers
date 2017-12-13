import axios from 'axios'

export default class GitTokenAccountWorker {
  constructor({ }) {
    this.listen()
  }

  listen() {
    console.log('GitToken Account Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      console.log('msg', msg)
      console.log('typeof msg', typeof msg)

      const { data: { type, value } } = msg

      console.log('type', type)
      console.log('value', value)

      switch(type) {
        case 'GET_PROFILE':
          return this.getProfile({ url: value })
          break;
        case 'webpackOk':
          console.log('Webpack setup')
          break;
        default:
          throw new Error(`Invalid Type for Web Worker: ${type}`)
      }
    })
  }

  getProfile({ url }) {
    axios({ method: 'GET', url }).then((result) => {
      postMessage({
        type: 'SET_ACCOUNT_DETAILS',
        id: 'profile',
        value: result
      })
      return null;
    }).catch((error) => {
      console.log('error', error)
      throw error
    })
  }

}

const worker = new GitTokenAccountWorker({})
