<template>
	<view class="col">
    <view class="row">
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state" @tap="read(1)">{{$t("b_readEnvParam")}}</button>
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state" @tap="read(2)">{{$t("b_readAllParam")}}</button>
    </view>
    <view class="row">
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state" @tap="read(3)">{{$t("b_readCarParam")}}</button>
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state" @tap="read(4)">{{$t("b_readBkgParam")}}</button>
    </view>
	</view>
</template>

<script>
	import {
		bufferToHex,
		getCurrentTimeStr,
		str_arr_toascii
	} from "@/tools/send.js"
	import bt from "@/tools/BluetoothManager.js"
	import store from '@/store/index.js'
	import {
		mapState
	} from 'vuex'
import { jlog, log_upload } from "../../tools/send";
	export default {
		data() {
			return {

			}
		},
		onShow() {
			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {},
			})
			
			bt.onRawData(res => {
			  jlog('BLE', 'listen', res)
			})
		},
		onHide() {
      bt.offRawData()
		},
		onUnload() {
      bt.offRawData()
		},
		computed: {
			...mapState(['connect_state']),
		},
		methods: {
			read(para) {
        let cmd = '66020204'

        if (para == 1) cmd = '66020204'
        else if (para == 2) cmd = '66020205'
        else if (para == 3) cmd = '66020206'
        else if (para == 4) cmd = '66020207'

        bt.send(cmd, 0x66).then(res => {
          if (!res.error) {
            
          }
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
  .row {display: flex; flex-direction: row; align-items: center; padding: 5px; margin-bottom: 10px;}
  .col {display: flex; flex-direction: column; padding: 5px;}

	.btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 14px;
		width: 25%;
		background-color: #3478f6;
		color: white;
	}

	.btn_hov {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 14px;
		width: 25%;
		background-color: #95c0ff;
		color: white;
	}
</style>