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
          return this.handleErrorMessage({
            error: `Invalid Event: ${event}`
          })
      }
    })
  }

  handleErrorMessage({ error }) {
    postMessage(JSON.stringify({
      error: error ? error : 'Unhandled Error'
    }))
    return null;
  }

  getProfile({ url }) {
    axios({ method: 'GET', url }).then((result) => {
      postMessage(JSON.stringify({
        event: 'GET_PROFILE',
        payload: result
      }))
      return null;
    }).catch((error) => {
      return this.handleErrorMessage({
        error: `Invalid Event: ${event}`
      })
    })
  }

}

const worker = new GitTokenAccountWorker({})
