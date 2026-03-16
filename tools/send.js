import store from '../store'

export function ab2hex(hex) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(hex),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
  return hexArr.join('')
}

export function hex2int(hex) {
  var len = hex.length,
    a = new Array(len),
    code;
  for (var i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }

  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}

export function int_to2hex(byte) {
  return byte.toString(16).length % 2 == 0 ? byte.toString(16) : '0' + byte.toString(16)
}

export function check_sum(arr, offset) {
  var crc_num = 0
  for (var i = 0; i < arr.length / 2 - offset; i++) {
    crc_num += hex2int(arr[2 * offset + i * 2] + arr[2 * offset + i * 2 + 1])
  }
  crc_num &= 0x00000000000000ff
  return crc_num.toString(16).length % 2 == 0 ? crc_num.toString(16) : '0' + crc_num.toString(16)
}

export function str_arr_toascii(arr) {
  var s = ''
  for (var i = 0; i < arr.length; i++) {
    s += String.fromCharCode(hex2int(arr[i]))
  }
  return s
}

export function radar_crc(arr) {
  let crc_num = 0

  if ((arr.length < 2) || ((arr.length % 2) != 0)) {
    return -1
  } else {
    for (let i = 0; i < arr.length / 2; i++) {
      crc_num += hex2int(arr[i * 2] + arr[i * 2 + 1])
    }
    crc_num &= 0x00000000000000ff

    return crc_num
  }
}

export function radar_recv(arr) {
  let res = ""
  let crc_num = ""

  if ((arr == "") || (arr == null)) {
    return res
  }

  if (arr.length > 8) {
    crc_num = radar_crc(arr.slice(0, arr.length - 6))
    //crc_num += 0x56
    crc_num & 0x00000000000000ff
  }

  if (((0x100 - crc_num) & 0x00000000000000ff) == hex2int(arr[arr.length - 6] + arr[arr.length - 5])) {
    res = arr.slice(4, arr.length - 6)
  }

  return res
}

export function radar_tx_data(arr) {
  let crc_num = 0
  let res = ""

  crc_num = radar_crc(arr) + 0x56 + 0xab
  crc_num &= 0x00000000000000ff
  crc_num = 0x100 - crc_num
  crc_num &= 0x00000000000000ff

  res = "56ab" + arr + int_to2hex(crc_num) + "5aa5"

  return res
}

//将16进制字符串转成10进制数组
export function hexStringToByteArray(hexStr) {
  const result = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    const byte = hexStr.slice(i, i + 2);
    result.push(parseInt(byte, 16));
  }
  return result;
}

export function extractWithWrapper(str, startTag, endTag) {
  const regex = new RegExp(`${escapeRegExp(startTag)}[^]*?${escapeRegExp(endTag)}`);
  const match = str.match(regex);
  return match ? match[0] : null;
}

// 工具函数：转义特殊字符（比如 [ 或 (）
export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function bufferToHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function bytesToHexString(bytes) {
  const byteArray = new Uint8Array(bytes);
  return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function bytesToAsciiString(bytes) {
  const byteArray = new Uint8Array(bytes);
  return Array.from(byteArray)
    .map(b => {
      // 可打印 ASCII
      if (b >= 32 && b <= 126) {
        return String.fromCharCode(b);
      }
      // 不可打印的用点或转义
      return '.';
    })
    .join('');
}

export function hexStringToAscii(hexStr) {
  // 去掉空格、换行
  const clean = hexStr.replace(/\s+/g, '').toUpperCase();

  if (clean.length % 2 !== 0) {
    throw new Error('hex string length must be even');
  }

  let result = '';

  for (let i = 0; i < clean.length; i += 2) {
    const byte = parseInt(clean.substr(i, 2), 16);

    if (byte >= 32 && byte <= 126) {
      result += String.fromCharCode(byte);
    } else {
      result += '.'
    }
  }

  return result;
}

export function getCurrentTimeStr() {
  const now = new Date()
  const pad = n => n.toString().padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

export function hexToAscii(hexStr) {
  let result = ''

  for (let i = 0; i < hexStr.length; i += 2) {
    let hexByte = hexStr.substr(i, 2)
    let code = parseInt(hexByte, 16)

    // 只保留 ASCII 范围内的字符（0x20 ~ 0x7E 可见字符，或换行/回车/制表符）
    if (
      (code >= 0x20 && code <= 0x7E) || // 可见 ASCII
      code === 0x0A || code === 0x0D || // 换行 / 回车
      code === 0x09 // 制表符
    ) {
      result += String.fromCharCode(code)
    }
    // 其他的直接跳过
  }

  return result
}

export function safeCall(tag, fn) {
  return function (...args) {
    try {
      return fn.apply(this, args)
    } catch (e) {
      jlog('ERROR', 'tag', tag, 'e', e, 'args', args)
      throw e // 保证全局 errorHandler 还能捕获
    }
  }
}

export function log_upload(type, data) {
  let json_data = {
    'device_id': store.state.product_info.SN,
    'payload': {
      'type': type,
      'data': data,
      'time': new Date()
    }
  }

  uni.request({
    url: 'https://teal-magpie-315941.hostingersite.com/api/upload',
    //url: 'http://10.127.234.242:3000/api/upload',
    data: json_data,
    method: 'POST',
    timeout: 2000,
    success: (res) => {
      //jlog('LOG', res.data.res);
    },
    fail(err) {
      //jlog('LOG', err);
    }
  });
}

function getLocationAsync() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'wgs84',
      success: resolve,
      fail: reject
    })
  })
}

function getAddress(latitude, longitude) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://nominatim.openstreetmap.org/reverse',
      method: 'GET',
      timeout: 5000,
      data: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 18,
        addressdetails: 1
      },
      header: {
        // 非常重要：Nominatim 要求必须带 User-Agent
        'User-Agent': 'uniapp-test/1.0'
      },
      success: resolve,
      fail: reject
    })
  })
}

export async function reportOnline() {
  try {
    const location = await getLocationAsync()
    store.commit('get_location', {
      'latitude': location.latitude,
      'longitude': location.longitude,
      'address': ''
    })

    try {
      const address = await getAddress(location.latitude, location.longitude)

      if (address.statusCode === 200) {
        const address_name = address.data.display_name

        store.commit('get_location', {
          'latitude': location.latitude,
          'longitude': location.longitude,
          'address': address_name
        })

        // jlog('LOG', 'location', JSON.stringify(store.state.location))
      }
    } catch (e) {
      store.commit('get_location', {
        'latitude': location.latitude,
        'longitude': location.longitude,
        'address': JSON.stringify(e)
      })
    }

    // jlog('LOG', 'state', { 'status': 'online', 'location': store.state.location })
  } catch (e) {
    //log_upload('state', { 'status': 'online', 'location': JSON.stringify(e) })
    jlog('LOG', 'location error', e)
  }
}

// tools/logger.js
export function jlog(tag, ...args) {
  const msg = `[${tag}] ` + args.map(v => {
    try {
      return typeof v === 'object' ? JSON.stringify(v) : String(v)
    } catch (e) {
      return String(v)
    }
  }).join(' ')

  // 1️⃣ JS 控制台（HBuilder / AndroidStudio debug）
  console.log(msg)

  // 2️⃣ 强制打到 native log（关键）
  if (typeof plus !== 'undefined' && plus.android) {
    try {
      const Log = plus.android.importClass('android.util.Log')
      Log.e('UNI-JS', msg)   // 用 E，adb 默认就能看到
    } catch (e) { }
  }

  // 3️⃣（可选）线上日志
  // log_upload('jslog', { msg })
}

