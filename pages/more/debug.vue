<template>
	<view>
		<view>
			<view style="margin: 5px; padding: 5px 5px; display: flex; justify-content: space-between; align-items: center;">
				<view>{{$t("debug.recv")}}</view>
				<view style="display: flex; flex-direction: row; align-items: center;">
					<view style="margin-right: 10px;">{{$t("debug.format")}}</view>
					<uni-data-checkbox :localdata="recv_format_box" v-model="recv_format"></uni-data-checkbox>
				</view>
			</view>

			<scroll-view scroll-y="true" class="scroll_view1" :scroll-top="scrollTop">
				<text id="scrollContainer" selectable="true" class="view_text">{{recv_text}}</text>
			</scroll-view>

			<view style="margin: 5px; padding: 5px 5px; display: flex; justify-content: space-between; align-items: center;">
				<view>{{$t("debug.send")}}</view>
				<view style="display: flex; flex-direction: row; align-items: center;">
					<view style="margin-right: 10px;">{{$t("debug.format")}}</view>
					<uni-data-checkbox :localdata="send_format_box" v-model="send_format"></uni-data-checkbox>
				</view>
			</view>

			<scroll-view scroll-y="true" class="scroll_view2" :scroll-top="0">
				<textarea v-model="send_text" class="view_text">{{send_text}}</textarea>
			</scroll-view>

			<view style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
				<button class="btn" hover-class="btn_hov" :disabled="!connect_state"
					@tap="send_btn">{{$t("debug.btnSend")}}</button>
				<button class="btn" hover-class="btn_hov" :disabled="!connect_state"
					@tap="recv_clear">{{$t("debug.btnClearSend")}}</button>
				<button class="btn" hover-class="btn_hov" :disabled="!connect_state"
					@tap="send_clear">{{$t("debug.btnClearRecv")}}</button>
			</view>
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
	export default {
		data() {
			return {
				recv_text: "",
				recv_format: 0,
				recv_format_box: [{
						text: "HEX",
						value: 0
					},
					{
						text: "ASCII",
						value: 1
					},
				],

				send_text: "56AB89020201715AA5",
				send_format: 0,
				send_format_box: [{
						text: "HEX",
						value: 0
					},
					{
						text: "ASCII",
						value: 1
					},
				],

				scrollTop: 0
			}
		},
		onShow() {
			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {},
			})
			
			bt.onRawData(res => {
			  this.recv_add_data(bufferToHex(res), this.disRecv)
			})
		},
		onHide() {
		},
		onUnload() {
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
			scrollToBottom() {
				uni.createSelectorQuery()
					.in(this)
					.select('#scrollContainer')
					.boundingClientRect(res => {
						this.scrollTop = res.height // 将scrollTop设置为内容高度
					})
					.exec()
			},
			//将发送文本框内的数据组帧发送出去
			send_btn() {
				let str = this.send_text.replace(" ", "")
				this.recv_add_data(str, this.disSend)

				if (this.send_format == 1) {
					this.send_cmd_ascii(str)
					bt.send_data(str, 'str')
				} else {
					bt.send_data(str, 'hex')
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
				let tmp = data

				if (this.recv_format == 1) {
					tmp = str_arr_toascii(str)
				}

				this.recv_text += getCurrentTimeStr() + dir + ":\n" + tmp + '\n'
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scroll_view1 {
		height: 400px;
		background: #f9f9f9;
		border: 1px solid #ccc;
	}

	.scroll_view2 {
		height: 150px;
		background: #f9f9f9;
		border: 1px solid #ccc;
	}

	.view_text {
		white-space: normal;
		word-break: break-word;
	}

	.btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 15rpx;
		width: 25%;
		background-color: #3478f6;
		color: white;
	}

	.btn_hov {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 15rpx;
		width: 25%;
		background-color: #95c0ff;
		color: white;
	}
</style>