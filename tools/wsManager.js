import eventBus from './eventBus'

class WSManager {
  constructor() {
    this.ws = null
    this.url = ''
    this.connected = false
    this.heartbeatTimer = null
    this.reconnectTimer = null
  }

  connect(url) {
    if (this.ws) return

    this.url = url
    this.ws = uni.connectSocket({
			url: url,
			fail(res) {
				console.log('websocket connect fail', res)
			}
		})

    const socket = this.ws

    socket.onOpen(() => {
      console.log('WS connected')
      this.connected = true
      this.startHeartbeat()
			this.send({ 'device_id': 'dev01', 'payload': { 'type': 'para', 'data': { 'sw': '1.0.0', 'hw': '1.0.1' }}})
    })

    socket.onMessage(res => {
      let data = res.data
      try {
        data = JSON.parse(data)
      } catch (e) {}
      eventBus.emit('ws:message', data)
    })

    socket.onClose(() => {
      this.cleanup()
      this.reconnect()
    })

    socket.onError(() => {
      this.cleanup()
      this.reconnect()
    })
  }

  send(data) {
    if (!this.connected) return
    const msg = typeof data === 'string' ? data : JSON.stringify(data)
    this.ws.send({ data: msg })
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ 'device_id': 'dev01', 'payload': { 'type': 'heart', 'data': {}}})
    }, 30000)
  }

  reconnect() {
    if (this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.ws = null
      this.connect(this.url)
      this.reconnectTimer = null
    }, 3000)
  }

  cleanup() {
    this.connected = false
    clearInterval(this.heartbeatTimer)
  }
}

//export default new WSManager()
