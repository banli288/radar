/**
 * 蓝牙连接状态统一管理
 *
 * 背景：微信/系统层 BLE 断开是异步的，uni.closeBLEConnection 的 success 回调
 * 只代表 API 调用成功，不代表底层链路真正断开（Android 上偶发 success 后
 * 设备端仍保持连接）。若此时界面谎报"已断开"，用户再次连接时
 * createBLEConnection 会因系统层残留连接而挂起直至超时。
 *
 * 本模块以 onBLEConnectionStateChange 的 connected:false 事件作为
 * "真正断开"的唯一判据，断开流程带超时兜底：重试关闭 -> 重置蓝牙适配器。
 */
import store from '@/store/index.js'
import { jlog } from './send.js'

let pendingDeviceId = ''      // 正在连接流程中的设备（device_info 尚未写入）
let disconnectWaiter = null   // 等待"确认断开"事件的对象 { deviceId, done }
let disconnecting = false     // 主动断开进行中（屏蔽迟到的 connected 事件）

function currentDeviceId() {
  return pendingDeviceId || store.state.device_info.deviceId
}

export function setPendingDeviceId(id) {
  pendingDeviceId = id
}

export function clearPendingDeviceId(id) {
  if (!id || pendingDeviceId === id) pendingDeviceId = ''
}

export function isDisconnecting() {
  return disconnecting
}

/**
 * 全局只注册一次连接状态监听。
 * - 按设备 ID 过滤事件，避免无关设备污染状态
 * - 主动断开期间忽略迟到的 connected 事件
 */
export function initBleListener() {
  uni.onBLEConnectionStateChange(function (res) {
    const id = res.deviceId
    if (id !== currentDeviceId()) return

    jlog('BLE', 'state event', JSON.stringify(res))

    if (res.connected === false) {
      if (disconnectWaiter && disconnectWaiter.deviceId === id) {
        const w = disconnectWaiter
        disconnectWaiter = null
        w.done(true)
      }
      disconnecting = false
      store.commit('ble_con_state_update', false)
    } else {
      // 主动断开过程中可能收到迟到的 connected 事件，忽略以免状态被翻回
      if (disconnecting) return
      store.commit('ble_con_state_update', true)
    }
  })
}

/**
 * 可靠断开指定设备。
 * @param {string} deviceId
 * @returns {Promise<boolean>} true=已确认断开；false=等待超时，已重置蓝牙适配器兜底
 */
export function disconnectDevice(deviceId, timeout = 4000) {
  return new Promise((resolve) => {
    if (disconnectWaiter) {
      // 已有进行中的断开流程，避免重复点击叠加
      resolve(false)
      return
    }

    disconnecting = true
    let settled = false
    let timer = null

    const done = (ok) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      disconnectWaiter = null
      disconnecting = false
      // 如实回到未连接状态：确认断开自不必说；断开异常时链路状态
      // 以系统层事件为准，界面不能停留在"已连接"
      store.commit('ble_con_state_update', false)
      resolve(ok)
    }

    disconnectWaiter = { deviceId, done }
    uni.closeBLEConnection({ deviceId })

    // 超时未收到 connected:false 事件：底层链路可能未真正断开，重试一次关闭。
    // 注意：不能调用 closeBluetoothAdapter 兜底——重置适配器会清掉
    // onBluetoothDeviceFound 等已注册的蓝牙监听（uni-app 下不可恢复），
    // 导致之后再也搜索不到设备。残留连接由连接流程的
    // "createBLEConnection 失败 -> 关闭 -> 重试"逻辑自愈。
    timer = setTimeout(() => {
      jlog('BLE', 'disconnect no event, retry close', deviceId)
      uni.closeBLEConnection({
        deviceId,
        complete: () => {
          // 再给底层 2s 完成断开；若事件仍未来，如实上报断开异常
          setTimeout(() => {
            if (!settled) {
              jlog('BLE', 'disconnect retry still no event', deviceId)
              done(false)
            }
          }, 2000)
        },
      })
    }, timeout)
  })
}
