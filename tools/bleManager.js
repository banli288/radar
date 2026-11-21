/**
 * 蓝牙连接状态统一管理
 *
 * 背景：微信/系统层 BLE 断开是异步的，uni.closeBLEConnection 的 success 回调
 * 只代表 API 调用成功，不代表底层链路真正断开（Android 上偶发 success 后
 * 设备端仍保持连接）。若此时界面谎报"已断开"，用户再次连接时
 * createBLEConnection 会因系统层残留连接而挂起直至超时。
 *
 * 本模块优先以 onBLEConnectionStateChange 的 connected:false 事件确认断开；
 * 若事件不来，则用 getBLEConnectedDevices 主动查询系统真实连接列表确认，
 * 避免 App 环境主动断开后事件不回调导致的"假断开"误判。
 */
import store from '@/store/index.js'
import { jlog } from './send.js'

let pendingDeviceId = ''      // 正在连接流程中的设备（device_info 尚未写入）
let disconnectWaiter = null   // 等待"确认断开"事件的对象 { deviceId, done }
let disconnecting = false     // 主动断开进行中（屏蔽迟到的 connected 事件）
let connectSession = 0        // 连接会话编号：每次发起连接/断开时自增

export function newConnectSession() {
  return ++connectSession
}

export function isSessionActive(session) {
  return session === connectSession
}

function currentDeviceId() {
  return pendingDeviceId || store.state.device_info.deviceId
}

export function setPendingDeviceId(id) {
  pendingDeviceId = id
}

export function clearPendingDeviceId(id) {
  if (!id || pendingDeviceId === id) pendingDeviceId = ''
}

export function getPendingDeviceId() {
  return pendingDeviceId
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
      // 断开发生：使此前所有连接会话失效，其后续回调一律忽略
      connectSession++
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
 *
 * 策略：不依赖 closeBLEConnection 的 success 回调（App 上 success 不代表
 * 链路真正断开），也不单纯依赖 connected:false 事件（部分机型主动断开时
 * 不回调）。而是：
 *   close -> 等 1.5s -> getBLEConnectedDevices 查真实状态
 *   若仍在连接列表 -> 再 close -> 等 1.5s -> 再查一次
 *   最终以第二次查询结果为准
 *
 * @param {string} deviceId
 * @returns {Promise<boolean>} true=已确认断开；false=确认仍连接或查询失败
 */
export function disconnectDevice(deviceId) {
  return new Promise((resolve) => {
    if (disconnectWaiter) {
      jlog('BLE', 'disconnect already in progress, ignore')
      resolve(false)
      return
    }

    disconnecting = true
    connectSession++   // 主动断开开始：立即使进行中的连接会话失效
    let settled = false

    const done = (ok) => {
      if (settled) return
      settled = true
      disconnectWaiter = null
      disconnecting = false
      store.commit('ble_con_state_update', false)
      jlog('BLE', 'disconnect done, confirmed=', ok)
      resolve(ok)
    }

    const queryConnected = () => {
      return new Promise((res) => {
        if (typeof uni.getBLEConnectedDevices !== 'function') {
          jlog('BLE', 'getBLEConnectedDevices not available')
          res(null)
          return
        }
        uni.getBLEConnectedDevices({
          success(r) {
            const list = r.devices || []
            const still = list.some((d) => d.deviceId === deviceId)
            jlog('BLE', 'query connected:', JSON.stringify(list), 'still=', still)
            res(still)
          },
          fail(e) {
            jlog('BLE', 'query connected fail', e)
            res(null)
          },
        })
      })
    }

    disconnectWaiter = { deviceId, done }
    jlog('BLE', 'disconnect start', deviceId)
    uni.closeBLEConnection({ deviceId })

    // 第一次查询：1.5s 后
    setTimeout(async () => {
      if (settled) return
      const still = await queryConnected()
      if (settled) return
      if (still === false) {
        done(true)
        return
      }
      if (still === true) {
        // 仍连接，再关一次
        jlog('BLE', 'still connected, close again')
        uni.closeBLEConnection({ deviceId })
      }
      // 第二次查询（或第一次查询失败时的兜底）：再 1.5s 后
      setTimeout(async () => {
        if (settled) return
        const still2 = await queryConnected()
        if (settled) return
        // 查询失败(null)时按未断开处理，提示用户；确认不在列表才算成功
        done(still2 === false)
      }, 1500)
    }, 1500)
  })
}
