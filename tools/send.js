import store from '../store'

export function send_data(obj) {
  if (store.state.connect_state != true) {
    console.log('BLE Send Err, Disconnect')
    return
  }

  if (obj.mode == 'hex') {
    var tmp = new Uint8Array(obj.dat.match(/[\da-f]{2}/gi).map(function(h) {
      return parseInt(h, 16)
    }));
    uni.writeBLECharacteristicValue({
      deviceId: obj.deviceId,
      serviceId: obj.serviceId,
      characteristicId: obj.characteristicId,
      value: tmp.buffer,
      success(res) {
        console.log('<send:>', obj.dat)
      },
      fail(res) {
        uni.showModal({
          content: "BLE Send Err",
          confirmText: "Confirm",
          cancelText: "Cancel"
        })
        console.log(res, obj)
      }
    })
  } else if (obj.mode == 'str') {
    uni.writeBLECharacteristicValue({
      deviceId: obj.deviceId,
      serviceId: obj.serviceId,
      characteristicId: obj.characteristicId,
      value: obj.dat,
      success() {
        console.log('<send:>', obj.dat)
      },
      fail() {
        uni.showModal({
          content: "BLE Send Err",
          confirmText: "Confirm",
          cancelText: "Cancel"
        })
        console.log(res, obj)
      }
    })
  }
}

export function ab2hex(hex) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(hex),
    function(bit) {
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

  return a.reduce(function(acc, c) {
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

export function get_dat_bldc(str) {
  var tmp = str.split(',')
  var real_arr = []
  var real_arr_len = 0
  var step = 0
  var dat = []

  tmp.pop()
  for (var i = 0; i < tmp.length; i++) {
    switch (step) {
      case 0:
        if (tmp[i] == 'aa') {
          real_arr[0] = 'aa';
          step = 1;
        }
        break;
      case 1:
        if (tmp[i] == '55') {
          real_arr[1] = '55';
          step = 2;
          real_arr_len = 2;
        } else step = 0;
        break;
      case 2:
        real_arr[real_arr_len++] = tmp[i];
        break;
    }
  }
  if (step != 2) return dat
  var data_len = hex2int(real_arr[3] + real_arr[2]) + 1
  var crc_str = ''
  for (var i = 0; i < data_len - 1; i++) crc_str += real_arr[i]

  if (real_arr[data_len - 1] == check_sum(crc_str, 2) && real_arr[data_len] == 'ff') {
    for (var i = 0; i < data_len - 6; i++) dat[i] = real_arr[i + 5]
    return dat
  } else console.log(real_arr)
}

export function get_data_leda(str, len) {
  var tmp = str.split(',')
  var real_arr = []
  var real_arr_len = 0
  var step = 0

  tmp.pop()
  for (var i = 0; i < tmp.length; i++) {
    switch (step) {
      case 0:
        if (tmp[i] == '55') {
          real_arr[0] = '55';
          step = 1;
        }
        break;
      case 1:
        if (tmp[i] == '55') {
          real_arr[1] = '55';
          step = 2;
          real_arr_len = 2;
        } else step = 0;
        break;
      case 2:
        real_arr[real_arr_len++] = tmp[i];
        break;
    }
  }
  var data_len = hex2int(real_arr[7] + real_arr[6]) + 10
  var crc_str = ''
  for (var i = 0; i < data_len - 2; i++) crc_str += real_arr[i]

  if (crc_r04(crc_str) == real_arr[data_len - 2] && real_arr[data_len - 1] == 'aa' && real_arr[data_len] == 'aa') {
    var dat = []
    for (var i = 0; i < len; i++) {
      dat[i] = real_arr[i + 8]
    }
    return dat
  }
}

export function str_arr_toascii(arr) {
  var s = ''
  for (var i = 0; i < arr.length; i++) {
    s += String.fromCharCode(hex2int(arr[i]))
  }
  return s
}

export function crc_r04(dat) {
  var crc8_table = [
    0x93, 0x98, 0xE4, 0x46, 0xEB, 0xBA, 0x04, 0x4C,
    0xFA, 0x40, 0xB8, 0x96, 0x0E, 0xB2, 0xB7, 0xC0,
    0x0C, 0x32, 0x9B, 0x80, 0xFF, 0x30, 0x7F, 0x9D,
    0xB3, 0x81, 0x58, 0xE7, 0xF1, 0x19, 0x7E, 0xB6,
    0xCD, 0xF7, 0xB4, 0xCB, 0xBC, 0x5C, 0xD6, 0x09,
    0x20, 0x0A, 0xE0, 0x37, 0x51, 0x67, 0x24, 0x95,
    0xE1, 0x62, 0xF8, 0x5E, 0x38, 0x15, 0x54, 0x77,
    0x63, 0x57, 0x6D, 0xE9, 0x89, 0x76, 0xBE, 0x41,
    0x5D, 0xF9, 0xB1, 0x4D, 0x6C, 0x53, 0x9C, 0xA2,
    0x23, 0xC4, 0x8E, 0xC8, 0x05, 0x42, 0x61, 0x71,
    0xC5, 0x00, 0x18, 0x6F, 0x5F, 0xFB, 0x7B, 0x11,
    0x65, 0x2D, 0x8C, 0xED, 0x14, 0xAB, 0x88, 0xD5,
    0xD9, 0xC2, 0x36, 0x34, 0x7C, 0x5B, 0x3C, 0xF6,
    0x48, 0x0B, 0xEE, 0x02, 0x83, 0x79, 0x17, 0xE6,
    0xA8, 0x78, 0xF5, 0xD3, 0x4E, 0x50, 0x52, 0x91,
    0xD8, 0xC6, 0x22, 0xEC, 0x3B, 0xE5, 0x3F, 0x86,
    0x06, 0xCF, 0x2B, 0x2F, 0x3D, 0x59, 0x1C, 0x87,
    0xEF, 0x4F, 0x10, 0xD2, 0x7D, 0xDA, 0x72, 0xA0,
    0x9F, 0xDE, 0x6B, 0x75, 0x56, 0xBD, 0xC7, 0xC1,
    0x70, 0x1D, 0x25, 0x92, 0xA5, 0x31, 0xE2, 0xD7,
    0xD0, 0x9A, 0xAF, 0xA9, 0xC9, 0x97, 0x08, 0x33,
    0x5A, 0x99, 0xC3, 0x16, 0x84, 0x82, 0x8A, 0xF3,
    0x4A, 0xCE, 0xDB, 0x29, 0x0F, 0xAE, 0x6E, 0xE3,
    0x8B, 0x07, 0x3A, 0x74, 0x47, 0xB0, 0xBB, 0xB5,
    0x7A, 0xAA, 0x2C, 0xD4, 0x03, 0x3E, 0x1A, 0xA7,
    0x27, 0x64, 0x06, 0xBF, 0x55, 0x73, 0x1E, 0xFE,
    0x49, 0x01, 0x39, 0x28, 0xF4, 0x26, 0xDF, 0xDD,
    0x44, 0x0D, 0x21, 0xF2, 0x85, 0xB9, 0xEA, 0x4B,
    0xDC, 0x6A, 0xCA, 0xAC, 0x12, 0xFC, 0x2E, 0x2A,
    0xA3, 0xF0, 0x66, 0xE8, 0x60, 0x45, 0xA1, 0x8D,
    0x68, 0x35, 0xFD, 0x8F, 0x9E, 0x1F, 0x13, 0xD1,
    0xAD, 0x69, 0xCC, 0xA4, 0x94, 0x90, 0x1B, 0x43,
  ]

  var crc = 0;
  for (var i = 0; i < dat.length / 2 - 2; i++) {
    crc = crc8_table[crc ^ hex2int(dat[4 + i * 2] + dat[5 + i * 2])]
  }
  return crc.toString(16).length % 2 == 0 ? crc.toString(16) : '0' + crc.toString(16)
}

export function radar_crc(arr) {
  let crc_num = 0

  //console.log(arr.slice(0, 4), arr.slice(arr.length-4, arr.length))

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

  if (arr.length > 6) {
    crc_num = radar_crc(arr.slice(0, arr.length - 4))
    crc_num += 0x56
    crc_num & 0x00000000000000ff
  }

  if (((0x100 - crc_num) & 0x00000000000000ff) == hex2int(arr[arr.length - 4] + arr[arr.length - 3])) {
    res = arr.slice(2, arr.length - 4)
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

  //console.log(1,radar_crc(arr))

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

export function bytesToHexString(byteArray) {
  return byteArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
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
  return function(...args) {
    try {
      return fn.apply(this, args)
    } catch (e) {
      console.error(`[${tag}] 执行出错:`, e, args)
      throw e // 保证全局 errorHandler 还能捕获
    }
  }
}