<template>
	<view class="page" style="width: 100%;">
    <view class="card row" style="justify-content: space-around;">
      <view>{{$t("debug.recv")}}</view>
      <view style="display: flex; flex-direction: row; align-items: center;">
        <view style="margin-right: 10px;">{{$t("debug.format")}}</view>
        <uni-data-checkbox :localdata="recv_format_box" v-model="recv_format"></uni-data-checkbox>
      </view>
    </view>

    <view class="card">
			<scroll-view scroll-y="true" class="scroll_view1" :scroll-top="scrollTop">
			  <text id="scrollContainer" selectable="true" class="view_text">{{recv_text}}</text>
			</scroll-view>
			<view class="row" style="margin-top: 10rpx;">
				<view style="width: 75%;"></view>
				<button class="btn" hover-class="btn_hov" style="width: 25%; font-size: 25rpx;" :disabled="!connect_state"
					@tap="copyAll()">复制</button>
			</view>
		</view>

    <view class="card row" style="justify-content: space-around;">
      <view>{{$t("debug.send")}}</view>
      <view style="display: flex; flex-direction: row; align-items: center;">
        <view style="margin-right: 10px;">{{$t("debug.format")}}</view>
        <uni-data-checkbox :localdata="send_format_box" v-model="send_format"></uni-data-checkbox>
      </view>
    </view>

		<view class="card">
			<scroll-view scroll-y="true" class="scroll_view2" :scroll-top="0">
				<textarea v-model="send_text" class="view_text">{{send_text}}</textarea>
			</scroll-view>
		</view>
    
		<view class="card">
			<view style="margin-bottom: 10rpx;">
			  <uni-data-select class="unselect" v-model="debug_index" :localdata="debug_arr" :clear="false" @change=""></uni-data-select>
			</view>
			
			<view class="row">
			  <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
			    @tap="send_btn">{{$t("debug.btnSend")}}</button>
			  <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
			    @tap="recv_clear">{{$t("debug.btnClearSend")}}</button>
			</view>
		</view>

		<view class="card">
			<scroll-view scroll-y="true" style="height: 80px; margin: 10px;">
			  <view v-for="(item, index) in aera_sensi" style="display: flex; flex-direction: row; align-items: center; padding: 5px;">
			    <view style="min-width: 120px; font-size: 14px;">{{ `${$t("debug.area")} ${index+1} ${$t("debug.sensitivity")}` }}</view>
			    <view style="margin-left: 100px; font-size: 30px;" @tap="sub_sensi(index)">-</view>
			    <view style="margin-left: 40px;">{{item.value}}</view>
			    <view style="margin-left: 40px; font-size: 30px;" @tap="add_sensi(index)">+</view>
			  </view>
			</scroll-view>
			
			<view style="display: flex; flex-direction: row; align-items: center; padding: 5px; margin: 10px;">
			  <view style="min-width: 120px; font-size: 14px;">{{$t("debug.poletype")}}</view>
			  <view style="margin-left: 100px; font-size: 30px;" @tap="sub_pole_type">-</view>
			  <view style="margin-left: 40px;">{{pole_type.value}}</view>
			  <view style="margin-left: 40px; font-size: 30px;" @tap="add_pole_type">+</view>
			</view>
			
			<view class="row">
				<button class="btn" hover-class="btn_hov" :disabled="!connect_state"
				  @tap="get_sensi">{{$t("debug.readsensitivity")}}</button>
				<button class="btn" hover-class="btn_hov" :disabled="!connect_state"
					@tap="set_sensi">{{$t("debug.writesensitivity")}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { getCurrentTimeStr, int_to2hex } from "@/tools/send.js"
	import bt from "@/tools/BluetoothManager.js"
	import {
		mapState
	} from 'vuex'
import { bytesToAsciiString, bytesToHexString, hexStringToAscii, jlog, log_upload } from "../../tools/send";
import { get_radar_sensi, param_all_read, param_env_read, param_humcar_read, param_noise_read, user_send } from "../../tools/radar_port";
	export default {
		data() {
			return {
				recv_text: "",
				recv_format: 1,
				recv_format_box: [
          {text: "HEX",value: 0},
					{text: "ASCII",value: 1},
				],

				send_text: "",
				send_format: 0,
				send_format_box: [
          {text: "HEX",value: 0},
          {text: "ASCII",value: 1},
				],

        debug_index: 0,
        debug_arr: [
          {value: 0 ,text: this.$t("debug.cmd2")},
          {value: 1 ,text: this.$t("debug.cmd1")},
          // {value: 2 ,text: this.$t("debug.cmd3")},
          // {value: 3 ,text: this.$t("debug.cmd4")},
          // {value: 4 ,text: this.$t("debug.cmd5")},
        ],
        debug_cmd: [
          '',
          '66020204',
          '66020205',
          '66020206',
          '66020207',
        ],

				scrollTop: 0,

        aera_sensi: [
          {value: 10, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1},
          {value: 42, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1},
          {value: 10, min: 0, max: 255, step: 1}
        ],
        pole_type: {value: 0, min: 0, max: 1, step: 1},
			}
		},
		onShow() {
			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {},
			})
			
			bt.onRawData(res => {
        let data = ''
        
        if (this.recv_format == 1) data = bytesToAsciiString(res)
        else data = bytesToHexString(res)

        this.recv_add_data(data, this.disRecv)
        log_upload('debug-recv', data)
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

			disSend() {
				return this.$t("debug.disSend")
			},
			disRecv() {
				return this.$t("debug.disRecv")
			},
		},
		methods: {
			copyAll() {
				uni.setClipboardData({
					data: this.recv_text,
					fail: () => {uni.showToast({title: '复制失败',icon: 'none'})}
				})
			},
      add_sensi(idx) {
        if (this.aera_sensi[idx].value < this.aera_sensi[idx].max) 
          this.aera_sensi[idx].value += this.aera_sensi[idx].step
      },
      sub_sensi(idx) {
        if (this.aera_sensi[idx].value > this.aera_sensi[idx].min) 
          this.aera_sensi[idx].value -= this.aera_sensi[idx].step
      },
      add_pole_type() {
        if (this.pole_type.value < this.pole_type.max) 
          this.pole_type.value += this.pole_type.step
      },
      sub_pole_type() {
        if (this.pole_type.value > this.pole_type.min) 
          this.pole_type.value -= this.pole_type.step
      },
			async get_sensi() {
				const res = await get_radar_sensi();
				if (res) {
					for (let i = 0; i < 9; i++) this.aera_sensi[i].value = res.sensi[i]
					this.pole_type.value = res.pole					
					uni.showToast({title: this.$t("modal.readSuccess")})
				} else uni.showToast({title: this.$t("modal.readfail")})
			},
      async set_sensi() {
        let sensi = []
				let pole = 0
				
        for (let i = 0; i < 9; i++) sensi.push(this.aera_sensi[i].value)
        pole = this.pole_type.value

				const res = await get_radar_sensi()
				if (res) {
					uni.showToast({title: this.$t("modal.seted")})
					
					log_upload('write', {
					  'aera_sensi': this.aera_sensi,
					  'pole_type': this.pole_type
					})
				}
      },
			scrollToBottom() {
				uni.createSelectorQuery()
					.in(this)
					.select('#scrollContainer')
					.boundingClientRect(res => {
						this.scrollTop = res.height // 将scrollTop设置为内容高度
					})
					.exec()
			},

			async send_btn() {
        if (this.debug_index === 0) {
					const res1 = await param_env_read();
					if (res1) {
						let env_param = bytesToAsciiString(res1.payload)
						if (this.recv_format == 1) this.recv_add_data(env_param, this.disRecv)
						else this.recv_add_data(bytesToHexString(res1.payload), this.disRecv)
						log_upload('debug-recv', env_param)
					}
					
					const res2 = await param_all_read();
					if (res2) {
						let all_param = bytesToAsciiString(res2.payload)
						if (this.recv_format == 1) this.recv_add_data(all_param, this.disRecv)
						else this.recv_add_data(bytesToHexString(res2.payload), this.disRecv)
						log_upload('debug-recv', all_param)
					}
					
					const res3 = await param_humcar_read();
					if (res3) {
						let car_param = bytesToAsciiString(res3.payload)
						if (this.recv_format == 1) this.recv_add_data(car_param, this.disRecv)
						else this.recv_add_data(bytesToHexString(res3.payload), this.disRecv)
						log_upload('debug-recv', car_param)
					}
					
					const res4 = await param_noise_read();
					if (res4) {
						let noise_param = bytesToAsciiString(res4.payload)		
						if (this.recv_format == 1) this.recv_add_data(noise_param, this.disRecv)
						else this.recv_add_data(bytesToHexString(res4.payload), this.disRecv)
						log_upload('debug-recv', noise_param)
					}
        } else {
          let str = this.send_text.replace(" ", "")

          log_upload('debug-send', str)

          if (this.send_format == 1) this.recv_add_data(hexStringToAscii(str), this.disSend)
          else this.recv_add_data(str, this.disSend)

          if (this.send_format == 1) user_send(str, 'str')
          else user_send(str, 'hex')
        }
			},
			//清除发送框
			send_clear() {
				this.send_text = ""
			},
			//清除接收框
			recv_clear() {
				this.recv_text = ""
			},
			//接收数据，显示在接收返回框
			recv_add_data(data, dir) {
				this.recv_text += getCurrentTimeStr() + dir + ":\n" + data + '\n'
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../common.scss";
	
  .unselect { height: 80rpx; font-size: 8px;}
	.scroll_view1 {
		height: 250px;
		background: #f9f9f9;
		border: 1px solid #ccc;
	}

	.scroll_view2 {
		height: 80px;
		background: #f9f9f9;
		border: 1px solid #ccc;
    margin-bottom: 10px;
	}

	.view_text {
		white-space: normal;
		word-break: break-word;
	}
</style>