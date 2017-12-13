import axios from 'axios'

export default class GitTokenAccountWorker {
  constructor({ }) {
    this.listen()
  }

  listen() {
    console.log('GitToken Account Web Worker Listening for Events')
    addEventListener('message', (msg) => {
      const { data: { event, payload } } = msg
      switch(event) {
        case 'GET_PROFILE':
          return this.getProfile({ url: payload })
          break;
        default:
          throw new Error('Invalid Event for Web Worker')
      }
    })
  }

  getProfile({ url }) {
    axios({ method: 'GET', url }).then((result) => {
      postMessage(JSON.stringify({
        event: 'GET_PROFILE',
        payload: result
      }))
      return null;
    }).catch((error) => {
      throw error
    })
  }

}

const worker = new GitTokenAccountWorker({})
