<template>
	<view class="page">
		<!-- <view style="height: 50vh;">
			<qiun-data-charts type="scatter" :opts="opts" :chartData="chartData" loadingType="0" animation="false"/>
		</view> -->
		
		<view class="card">{{$t("display.text1")}}</view>
		<view class="card">
			<scroll-view scroll-y="true" class="scroll_view1" :scroll-top="scrollTop">
				<text id="scrollContainer" selectable="true" class="view_text">{{recv_text}}</text>
			</scroll-view>
		</view>

		<view class="card row" style="justify-content: space-between;">
			<button class="btn" hover-class="btn_hov" style="width: 25%; font-size: 25rpx;" :disabled="!connect_state"
				@tap="map_init('open')">{{$t("display.btnStartDis")}}</button>
			<button class="btn" hover-class="btn_hov" style="width: 25%; font-size: 25rpx;" :disabled="!connect_state"
				@tap="map_init('close')">{{$t("display.btnStopDis")}}</button>
			<button class="btn" hover-class="btn_hov" style="width: 25%; font-size: 25rpx;" :disabled="!connect_state"
				@tap="map_init('clear')">{{$t("display.ClearDis")}}</button>
		</view>
	</view>
</template>

<script>
	import {
		hexToAscii,
		bufferToHex
	} from "@/tools/send.js"
	import {
		updatePageTitle
	} from '@/common/in18-helper.js'
	import store from '@/store/index.js'
	import bt from "@/tools/BluetoothManager.js"
	import {
		mapState
	} from 'vuex'
	import { log_upload } from "../../tools/send"
	import { display_en } from "../../tools/radar_port"
	export default {
		data() {
			return {
				chartData: {},
				opts: {
					color: ["#00aa00", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 15],
					dataLabel: false,
					enableScroll: false,
					legend: {},
					animation: false,
					update: true,
					duration: 0,
					xAxis: {
						disableGrid: false,
						gridType: "dash",
						splitNumber: 8,
						boundaryGap: "justify",
						min: -2,
						max: 2
					},
					yAxis: {
						disableGrid: false,
						gridType: "dash",
						splitNumber: 10,
						data: [{
							position: 'center',
							min: 0.0,
							max: 10.0,
						}],
					}
				},
				timer: null,
				texts: [],
				texts_ptr: 0,
				res: {
					series: [{
						name: "目标点:单位(米)",
						data: []
					}],
				},
				scrollTop: 0,
				recv_text: "",
				recv_cnt: 0,
			};
		},
		onLoad() {
			updatePageTitle()
		},
		onReady() {
			// this.chartData = JSON.parse(JSON.stringify(this.res))
		},
		onShow() {
			store.commit("set_active_page", "display")
		
			updatePageTitle()

			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {}
			})

			bt.onRawData(res => {
				let dat = hexToAscii(bufferToHex(res))

				this.recv_text += dat
				//保持数据一直在最新的位置
				this.$nextTick(() => {
				  this.scrollToBottom()
				})
				
				//数据行数太多，防止卡顿进行清空
				if (this.recv_cnt < 500) {
				  this.recv_cnt += 1
				} else {
				  this.recv_cnt = 0
				  this.recv_text = ""
				}
			})
		},
		onHide() {
			this.map_init('close')
      bt.offRawData()
			store.commit("set_active_page", "")
		},
		onUnload() {
			this.map_init('close')
      bt.offRawData()
			store.commit("set_active_page", "")
		},
		computed: {
			...mapState(['connect_state']),
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
			//开启/关闭坐标显示指令
			async map_init(mode) {
				var cmd = false
				let that = this

				if (mode == 'open') {
					cmd = true
				} else if (mode == 'close') {
					cmd = false
				} else if (mode == 'clear') {
					this.recv_text = ""
					return
				}

				if (store.state.connect_state == true) {
					const res = await display_en(cmd);
					if (res) {
						this.recv_text += "OK\n"
						log_upload('debug', {'display_set': mode})
					} else {
						uni.showModal({
						  title: that.$t("modal.notice"),
						  confirmText: that.$t("modal.confirmText"),
						  cancelText: that.$t("modal.cancelText"),
						  content: that.$t("modal.readTineout"),
						})
					}
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "../common.scss";
	
	.scroll_view1 {
		height: 500px;
		background: #f9f9f9;
		border: 1px solid #ccc;
	}
</style>