import bt from "@/tools/BluetoothManager.js"
import store from '@/store/index.js'
import { int_to2hex, jlog } from '@/tools/send.js'

export async function get_production() {
	const res66 = await bt.send("66010100", 0x66);
	if (res66.error) return null;
	
	const res89 = await bt.send("89020201", 0x89);
	if (res89.error) return null;
	
	let product = {
		type: res89.payload[0],
		SN: res89.payload[1].toString(16) + res89.payload[2].toString(16) + res89.payload[3].toString(16) + res89.payload[4].toString(16) + res89.payload[5].toString(16),
		hd_ver: res89.payload[6] + res89.payload[7] / 10,
		sw_ver: res89.payload[8] + res89.payload[9] / 10,
	}
	
	return product
}

export async function close_ble() {
	const res = await bt.send("661B1B00", 0x66);
	if (res.error) return null;
	return res;
}

export async function display_en(enable) {
	const cmd = enable ? '66010109' : '66010100'
	const res = await bt.send(cmd, 0x66);
	if (res.error) return null;
	return res;
}

export async function restore(enable) {
	const res = await bt.send("66020202", 0x66);
	if (res.error) return null;
	return res;
}

export async function restart(enable) {
	const res = await bt.send("66141400", 0x66);
	if (res.error) return null;
	return res;
}

export async function advanced_read() {
	const res = await bt.send("87020201", 0x87);
	if (res.error) return null;
	
	if (res.payload.length == 10) {
		return {
			HumanVehicleDistinction: res.payload[0],
			TrafficDirection: res.payload[1],
			RelayStatus: res.payload[2],
			
			radarSensitivity: res.payload[3],
			
			delayDropTime: res.payload[4] / 10,
			proximityNoDetect: res.payload[5] / 10,
			leftNoDetectWidth: res.payload[6] / 10,
			rightNoDetectWidth: res.payload[7] / 10,
			leftDetectWidth: res.payload[8] / 10,
			rightDetectWidth: res.payload[9] / 10,
		}
	}
	
	return null;
}

export async function advanced_write(param) {
	let _str = '86'
	
	_str = _str + int_to2hex((param.HumanVehicleDistinction) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.TrafficDirection) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.RelayStatus) & 0x00000000000000ff)
	
	_str = _str + int_to2hex((param.radarSensitivity) & 0x00000000000000ff)
	
	_str = _str + int_to2hex((param.delayDropTime * 10) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.proximityNoDetect * 10) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.leftNoDetectWidth * 10) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.rightNoDetectWidth * 10) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.leftDetectWidth * 10) & 0x00000000000000ff)
	_str = _str + int_to2hex((param.rightDetectWidth * 10) & 0x00000000000000ff)
	
	const res = await bt.send(_str, 0x86);
	if (res.error) return null;
	return res;
}

export async function close_ble_auto_poweroff() {
	const res = await bt.send("661b1b02", 0x66);
	if (res.error) return null;
	return res;
}

export async function param_env_read() {
	const res = await bt.send("66020204", 0xFF);
	if (res.error) return null;
	return res;
}

export async function param_all_read() {
	const res = await bt.send("66020205", 0xFF);
	if (res.error) return null;
	return res;
}

export async function param_humcar_read() {
	const res = await bt.send("66020206", 0xFF);
	if (res.error) return null;
	return res;
}

export async function param_noise_read() {
	const res = await bt.send("66020207", 0xFF);
	if (res.error) return null;
	return res;
}

export async function user_send(data, mode) {
	const res = await bt.send_data(data, mode);
	if (res.error) return null;
	return res;
}

export async function get_radar_sensi() {
	const res = await bt.send("98020201", 0x98);
	if (res.error) return null;
	
	if (res.payload.length == 10) {
		let data = {
			sensi: res.payload.slice(0, 9),
			pole: res.payload[9]
		}
	  return data
	}
	
	return null;
}

export async function set_radar_sensi(sensi, pole) {
	let conf_str = '88'
	
	for (let i = 0; i < 9; i++) conf_str = conf_str + int_to2hex(sensi[i] & 0xFF)
	conf_str += int_to2hex(pole & 0xFF)
	
	const res = await bt.send(conf_str, 0x88);
	if (res.error) return null;
	return res;
}

export async function relay_read() {
	const res = await bt.send("99020201", 0x99);
	if (res.error) return null;
	
	if (res.payload.length == 10) {
		return {
			param1: (res.payload[0] == 1) ? (-1 * res.payload[1]) : res.payload[1],
			param2: (res.payload[2] == 1) ? (-1 * res.payload[3]) : res.payload[3],
			param3: res.payload[4],
			param4: res.payload[5],
			param5: res.payload[6],
			param6: res.payload[7]
		}
	}
	
	return null;
}

export async function relay_write(param) {
	let _str = '9a'
	
	if (param.param1 >= 0) {
		_str += int_to2hex(2 & 0x00000000000000ff)
		_str += int_to2hex(param.param1 & 0x00000000000000ff)
	} else {
		_str += int_to2hex(1 & 0x00000000000000ff)
		_str += int_to2hex((-1 * param.param1) & 0x00000000000000ff)
	}
	
	if (param.param2 >= 0) {
		_str += int_to2hex(2 & 0x00000000000000ff)
		_str += int_to2hex(param.param2 & 0x00000000000000ff)
	}
	else {
		_str += int_to2hex(1 & 0x00000000000000ff)
		_str += int_to2hex((-1 * param.param2) & 0x00000000000000ff)
	}
	
	_str += int_to2hex(param.param3 & 0x00000000000000ff)
	_str += int_to2hex(param.param5 & 0x00000000000000ff)
	_str += int_to2hex(param.param5 & 0x00000000000000ff)
	_str += int_to2hex(param.param6 & 0x00000000000000ff)
		
	_str = _str + int_to2hex((9) & 0x00000000000000ff)
	_str = _str + int_to2hex((1) & 0x00000000000000ff)
	
	const res = await bt.send(_str, 0x9A);
	if (res.error) return null;
	
	return res;
}

export async function getConfig() {
	const res = await bt.send("77020201", 0x77);
	if (res.error) return null;
	
	return {
		pole: res.payload[1],
		range: res.payload[0] / 10,
		carType: res.payload[2]
	}
}

export async function setConfig(param) {
	let _str = '76' + int_to2hex((param.range * 10) & 0x00000000000000ff) + int_to2hex(param.pole & 0x00000000000000ff) + int_to2hex(param.carType)
	const res = await bt.send(_str, 0x76);
	if (res.error) return null;
	return res
}

export async function studyStep1() {
	const res = await bt.send('660A0A06', 0x66);
	if (res.error) return null;
	return res
}

export async function studyStep2() {
	const res = await bt.send('660A0A04', 0x66);
	if (res.error) return null;
	return res
}

export async function studyStep3() {
	const res = await bt.send('66181800', 0x66);
	if (res.error) return null;
	return res
}