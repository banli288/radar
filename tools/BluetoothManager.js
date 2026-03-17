import {
  extractWithWrapper,
  radar_tx_data,
  radar_recv,
  hexStringToByteArray,
  bufferToHex,
  log_upload,
  jlog,
  bytesToHexString,
  bytesToAsciiString
} from "./send.js"
import store from "../store/index.js"

class BluetoothManager {
  constructor() {
    this.listeners = {} // { cmd: [callback1, callback2] }
    this.pendingRequests = {} // 请求-响应映射 {reqId: resolve}
    this.recvBuffer = new Uint8Array(0);
    this.recvTimer = null;

    this.RECV_TIMEOUT_MS = 100;

    uni.onBLECharacteristicValueChange((res) => {
      const chunk = new Uint8Array(res.value);

      // 追加数据
      this.recvBuffer = this.appendBuffer(this.recvBuffer, chunk);
			
			jlog('BLE CHUNK', this.recvBuffer)

      // 重置超时定时器
      if (this.recvTimer) {
        clearTimeout(this.recvTimer);
      }

			if (store.state.active_page === "display") {
				// 如果是FF直接原数据返回，否则解析再返回
				if (this.pendingRequests[0xFF]) {
					this.pendingRequests[0xFF]({ reqId: 0xFF, payload: this.recvBuffer })
					delete this.pendingRequests[0xFF]
				} else {
					let data = this.parsePacket(this.recvBuffer) // 正常解码
					//jlog('decode', data)
					if (data != null) {
					// 如果是响应，先匹配请求
					if (data.reqId && this.pendingRequests[data.reqId]) {
						this.pendingRequests[data.reqId](data) // 触发 Promise resolve
						delete this.pendingRequests[data.reqId]
						this.notify(data.cmd, data) // 再分发到监听者
					} else {
						this._rawHandler?.(this.recvBuffer)
					}
					} else { this._rawHandler?.(this.recvBuffer) }
				}
				
				this.recvBuffer = new Uint8Array(0); // 清空状态
			} else {
				// 超时，认为一包结束
				this.recvTimer = setTimeout(() => {
					// 如果是FF直接原数据返回，否则解析再返回
					jlog('BLE', this.recvBuffer)
					
					if (this.pendingRequests[0xFF]) {
						this.pendingRequests[0xFF]({ reqId: 0xFF, payload: this.recvBuffer })
						delete this.pendingRequests[0xFF]
					} else {
						let data = this.parsePacket(this.recvBuffer) // 正常解码
						// jlog('DECODE', data)
						if (data != null) {
						// 如果是响应，先匹配请求
						if (data.reqId && this.pendingRequests[data.reqId]) {
							this.pendingRequests[data.reqId](data) // 触发 Promise resolve
							delete this.pendingRequests[data.reqId]
							jlog('DEL ID', data)
							this.notify(data.cmd, data) // 再分发到监听者
						} else {
							this._rawHandler?.(this.recvBuffer)
						}
						} else { this._rawHandler?.(this.recvBuffer) }
					}
					
					this.recvBuffer = new Uint8Array(0); // 清空状态
					
					this.recvTimer = null;
				}, this.RECV_TIMEOUT_MS);
			}
    })
  }

  onRawData(cb) {
    this._rawHandler = cb
  }

  offRawData() {
    this._rawHandler = null
  }

  // 构造发送数据包
  buildPacket(cmd) {
    return radar_tx_data(cmd)
  }

  // 解析接收数据
  parsePacket(buffer) {
    let tmp = bytesToHexString(buffer)

    if ((tmp != "") && (tmp != null)) {
      let data_mid = extractWithWrapper(tmp, "56ab", "5aa5")
      if ((data_mid != "") && (data_mid != null)) {
        let recv_data = radar_recv(data_mid)

        if (recv_data.length >= 2 && (recv_data.length % 2 == 0)) {
          int_arr = recv_data
          let int_arr = hexStringToByteArray(recv_data)
          return {
            reqId: int_arr[0],
            payload: int_arr.slice(1)
          }
        }
      }
    }

    return null
  }

  appendBuffer(oldBuf, newBuf) {
    const tmp = new Uint8Array(oldBuf.length + newBuf.length);
    tmp.set(oldBuf, 0);
    tmp.set(newBuf, oldBuf.length);
    return tmp;
  }

  // 注册监听某个 cmd 的数据
  subscribe(cmd, callback) {
    if (!this.listeners[cmd]) this.listeners[cmd] = []
    this.listeners[cmd].push(callback)
  }

  unsubscribe(cmd, callback) {
    if (!this.listeners[cmd]) return
    this.listeners[cmd] = this.listeners[cmd].filter(cb => cb !== callback)
  }

  notify(cmd, data) {
    if (this.listeners[cmd]) {
      this.listeners[cmd].forEach(cb => cb(data))
    }
  }

  send(cmd, reqId, {
    waitResponse = true
  } = {}) {
    return new Promise((resolve) => {
      let buffer = this.buildPacket(cmd)
      if (waitResponse) {
        this.pendingRequests[reqId] = resolve
        setTimeout(() => {
          if (this.pendingRequests[reqId]) {
            delete this.pendingRequests[reqId]
            resolve({
              error: 'timeout'
            })
          }
        }, 2000)
      }

      var tmp = new Uint8Array(buffer.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }));

      jlog('SEND', bytesToHexString(tmp))

      uni.writeBLECharacteristicValue({
        deviceId: store.state.device_info.deviceId,
        serviceId: store.state.device_info.serviceId,
        characteristicId: store.state.device_info.w_characteristicId,
        value: tmp.buffer,
        success: (res) => {
          if (!waitResponse) resolve({
            ok: true
          })
        },
        fail: (res) => {
          resolve({
            error: 'send fail'
          })
        },
      })
    })
  }

  send_data(data, type) {
    let tmp = null
    if (type == 'hex') {
      let arr = new Uint8Array(data.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }));
      tmp = arr.buffer
    } else {
      const arr = new Uint8Array(data.length);

      for (let i = 0; i < data.length; i++) {
        arr[i] = data.charCodeAt(i);
      }

      tmp = arr.buffer
    }

    uni.writeBLECharacteristicValue({
      deviceId: store.state.device_info.deviceId,
      serviceId: store.state.device_info.serviceId,
      characteristicId: store.state.device_info.w_characteristicId,
      value: tmp,
      success(res) {
        //jlog('BLE', '<send>', tmp)
        //log_upload('write', {'res': 'success', 'data': bufferToHex(tmp)})
      },
      fail(res) {
        uni.showModal({
          content: "BLE Send Err",
          confirmText: "Confirm",
          cancelText: "Cancel"
        })
        jlog('BLE', 'res', res, 'data', tmp)
        //log_upload('write', {'res': 'fail', 'data': bufferToHex(tmp), 'err': JSON.stringify(res)})
      }
    })
  }
}

export default new BluetoothManager()