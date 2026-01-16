import {
  extractWithWrapper,
  radar_tx_data,
  radar_recv,
  hexStringToByteArray,
  bufferToHex,
  log_upload
} from "./send.js"
import store from "../store/index.js"

class BluetoothManager {
  constructor() {
    this.listeners = {} // { cmd: [callback1, callback2] }
    this.pendingRequests = {} // 请求-响应映射 {reqId: resolve}

    uni.onBLECharacteristicValueChange((res) => {
      let data = this.parsePacket(res.value)

      if (data == null) {
        this._rawHandler && this._rawHandler(res.value)
        return
      }

      // 如果是响应，先匹配请求
      if (data.reqId && this.pendingRequests[data.reqId]) {
        this.pendingRequests[data.reqId](data) // 触发 Promise resolve
        delete this.pendingRequests[data.reqId]
        // 再分发到监听者
        this.notify(data.cmd, data)
      } else {
        // --- 主动推送 ---
        this._rawHandler && this._rawHandler(res.value)
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
    let tmp = bufferToHex(buffer)

    console.log("<listen>", tmp)

    //log_upload('read', { 'data': tmp })

    if ((tmp != "") && (tmp != null)) {
      let data_mid = extractWithWrapper(tmp, "ab", "5a")
      if ((data_mid != "") && (data_mid != null)) {
        let recv_data = radar_recv(data_mid)

        console.log('<recv>', recv_data, data_mid)

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

  // 发送指令，带响应
  send(cmd, reqId, {
    waitResponse = true
  } = {}) {
    return new Promise((resolve) => {
      let buffer = this.buildPacket(cmd)
      if (waitResponse) {
        this.pendingRequests[reqId] = resolve
        // 超时保护
        setTimeout(() => {
          if (this.pendingRequests[reqId]) {
            delete this.pendingRequests[reqId]
            resolve({
              error: 'timeout'
            })
          }
        }, 3000)
      }

      var tmp = new Uint8Array(buffer.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }));

      uni.writeBLECharacteristicValue({
        deviceId: store.state.device_info.deviceId,
        serviceId: store.state.device_info.serviceId,
        characteristicId: store.state.device_info.w_characteristicId,
        value: tmp.buffer,
        success: (res) => {
          if (!waitResponse) resolve({
            ok: true
          })
          console.log("<send>", buffer)
          //log_upload('write', {'res': 'success', 'data': buffer})
        },
        fail: (res) => {
          //log_upload('write', {'res': 'fail', 'data': buffer, 'err': JSON.stringify(res)})
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
      tmp = data
    }

    uni.writeBLECharacteristicValue({
      deviceId: store.state.device_info.deviceId,
      serviceId: store.state.device_info.serviceId,
      characteristicId: store.state.device_info.w_characteristicId,
      value: tmp,
      success(res) {
        console.log('<send>', tmp)
        //log_upload('write', {'res': 'success', 'data': bufferToHex(tmp)})
      },
      fail(res) {
        uni.showModal({
          content: "BLE Send Err",
          confirmText: "Confirm",
          cancelText: "Cancel"
        })
        console.log(res, tmp)
        //log_upload('write', {'res': 'fail', 'data': bufferToHex(tmp), 'err': JSON.stringify(res)})
      }
    })
  }
}

export default new BluetoothManager()