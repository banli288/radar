<template>
	<view class="content">
		<view class="img_box">
			<image class="img_class" src="@/static/0.jpg"></image>
			<button class="zh_btn" :class="{ active: isZhActive }" @click="swLang('zh')">中文</button>
			<button class="en_btn" :class="{ active: isEnActive }" @click="swLang('en')">English</button>
		</view>

		<view class="_row2">
			<view :style="dynamicFontStyle" class="_row2_left">{{$t("index.text2")}}</view>
			<view :style="dynamicFontStyle" class="_row2_right">MW60S</view>
		</view>
		<view class="_row2">
			<view :style="dynamicFontStyle" class="_row2_left">{{$t("index.text3")}}</view>
			<view :style="dynamicFontStyle" class="_row2_right">{{product_SN}}</view>
		</view>
		<view class="_row2">
			<view :style="dynamicFontStyle" class="_row2_left">{{$t("index.text4")}}</view>
			<view :style="dynamicFontStyle" class="_row2_right">V{{product_hd}}</view>
		</view>
		<view class="_row2">
			<view :style="dynamicFontStyle" class="_row2_left">{{$t("index.text5")}}</view>
			<view :style="dynamicFontStyle" class="_row2_right">V{{product_sf}}</view>
		</view>

		<view class="_center">
			<button class="btn" hover-class="btn_hover" @click="btn_press()">{{bleConName}}</button>
		</view>
		<view class="_center">
			<view class="_herf">{{$t("index.text6")}}</view>
		</view>
		<!-- 弹窗 -->
		<view class="dialog" v-if="showDialog" @click="closeDialog">
			<view class="dialog_content" @click.stop="">
				<view class="title">{{$t("index.text7")}}</view>
				<view class="list_item">
					<view class="_item" v-for="(item, index) in ble_name_list" :key="index" @tap="ble_connect(index)">
						<view>{{item}}</view>
						<view>{{ble_rssi_list[index]}}</view>
						<view>{{ble_con_state_list[index]}}</view>
					</view>
				</view>
				<view class="title" @tap="ble_list_refresh">{{$t("index.text8")}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updatePageTitle,
		updateTabBar,
		changeLanguage
	} from '../../common/in18-helper.js'
	import store from '@/store/index.js'
	import bt from "@/tools/BluetoothManager.js"
	export default {
		data() {
			return {
				showDialog: false,
				product_type: 0,
				product_SN: "",
				product_hd: 1.01,
				product_sf: 1.01,

				ble_list: [],
				ble_name_list: [],
				ble_rssi_list: [],
				ble_con_state_list: [],
				ble_btn_name: "connect",

				currentLang: this.$i18n.locale
			}
		},
		onLoad() {
			//更新标题栏
			updatePageTitle()

			//更新工具栏
			if (this.$mp.page.route === 'pages/index/index') {
				updateTabBar()
			}
		},
		onShow() {
			//设置不息屏
			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {
				}
			})

			updatePageTitle()

			//更新显示按钮名称
			if (store.state.connect_state == true) {
				this.ble_btn_name = "disconnect"
			} else {
				this.ble_btn_name = "connect"
			}
		},
		onUnload() {
		},
		onHide() {
			uni.hideLoading()
			
			//离开首页关闭蓝牙发现
			uni.stopBluetoothDevicesDiscovery({
				success() {
				}
			})
		},
		computed: {
			//动态获取国际化变量，样式
			bleConName() {
				return this.$t(`index.bleBtnName.${this.ble_btn_name}`)
			},
			isZhActive() {
				return this.$i18n.locale === 'zh'
			},
			isEnActive() {
				return this.$i18n.locale === 'en'
			},
			isEnglish() {
				return this.$i18n.locale === 'en'
			},
			dynamicFontStyle() {
				return {
					fontSize: this.isEnglish ? '17px' : '20px',
					lineHeight: this.isEnglish ? '1.8' : '1.8'
				}
			},
		},
		methods: {
			//切换语言
			swLang(lang) {
				changeLanguage(lang)
				this.currentLang = lang
			},

			//刷新蓝牙列表
			ble_list_refresh() {
				this.ble_list = []
				this.ble_name_list = []
				this.ble_rssi_list = []
				this.ble_con_state_list = []
				this.btn_press()
			},

			//读取版本信息
			read_product() {
				bt.send("66010100", 0x66).then(res => {
					if (!res.error) {
						bt.send("89020201", 0x89).then(res => {
							if (!res.error) {
								this.product_type = res.payload[0]
								this.product_SN = res.payload[1].toString(16) + res.payload[2].toString(16) +
									res.payload[3].toString(16) + res.payload[4].toString(16) + res.payload[5].toString(16)
								this.product_hd = res.payload[6] + res.payload[7] / 10
								this.product_sf = res.payload[8] + res.payload[9] / 10

								//弹窗提示读取成功--链接成功
								uni.hideLoading()
								uni.showToast({
									title: this.$t("modal.conSuccess")
								})

								//改变按钮名字
								this.ble_btn_name = "disconnect"

								//更新蓝牙列表的连接状态
								this.ble_con_state_list[this.ble_list.indexOf(store.state.device_info.deviceId)] = 'connected'
							} else {
								uni.hideLoading()
								uni.showModal({
								  title: this.$t("modal.notice"),
								  confirmText: this.$t("modal.confirmText"),
								  cancelText: this.$t("modal.cancelText"),
								  content: this.$t("modal.readTineout"),
								})
							}
						})
					} else {
						uni.hideLoading()
						uni.showModal({
						  title: this.$t("modal.notice"),
						  confirmText: this.$t("modal.confirmText"),
						  cancelText: this.$t("modal.cancelText"),
						  content: this.$t("modal.readTineout"),
						})
					}
				})
			},
			// 关闭弹窗
			closeDialog() {
				this.showDialog = false
			},
			//按钮按钮，判断连接状态，执行搜索设备或者断开连接
			btn_press() {
				let that = this
				if (store.state.connect_state == false) {
					that.ble_search()
				} else {
					uni.showModal({
						title: that.$t("modal.notice"),
						content: that.$t("modal.disconBle"),
						confirmText: that.$t("modal.confirmText"),
						cancelText: that.$t("modal.cancelText"),
						success(res) {
							if (res.confirm) {
								uni.closeBLEConnection({
									deviceId: store.state.device_info.deviceId,
									complete() {
										store.commit('ble_con_state_update', false)
										that.ble_btn_name = "connect"

										uni.showToast({
											title: that.$t("modal.closeBle"),
										})
									}
								})
							}
						}
					})
				}
			},
			//搜索蓝牙设备
			ble_search() {
				var that = this
				uni.showLoading({
					title: that.$t("modal.searchingDev"),
					mask: true,
					success() {
						setTimeout(() => {
							uni.openBluetoothAdapter({
								success() {
									that.showDialog = true
									uni.startBluetoothDevicesDiscovery({
										allowDuplicatesKey: true,
										success() {
											uni.hideLoading()
											uni.onBluetoothDeviceFound(function(res) {
												//发现新的蓝牙设备
												if (that.ble_list.indexOf(res.devices[0].deviceId) == -1) {
													//根据名字匹配雷达设备
													if (res.devices[0].name.indexOf("XHJ") != -1) {
														//加入设备列表
														that.ble_list.push(res.devices[0].deviceId)
														that.ble_name_list.push(res.devices[0].name)
														that.ble_rssi_list.push(res.devices[0].RSSI)
														that.ble_con_state_list.push('disconnected')
													}
												}
											})
										},
										fail(res) {
											uni.hideLoading()
											console.log("discov err", res)
										}
									})
								},
								fail() {
									uni.hideLoading()
									uni.showModal({
										title: that.$t("modal.openBleErr"),
										confirmText: that.$t("modal.confirmText"),
										cancelText: that.$t("modal.cancelText"),
									});
								}
							})
						}, 1000)
					}
				})
			},
			//连接设备
			ble_connect(index) {
				let that = this
				let deviceId = this.ble_list[index]
				uni.showLoading({
					title: that.$t("modal.connecting"),
					mask: true,
					success() {
						uni.createBLEConnection({
							deviceId: deviceId,
							timeout: 10000,
							success() {
								uni.stopBluetoothDevicesDiscovery({
									success() {
										uni.getBLEDeviceServices({
											deviceId: deviceId,
											success(res) {
												//遍历服务id
												for (let item of res.services) {
													if (item.isPrimary) {
														let serviceId = item.uuid
														//找到蓝牙IC的指定服务ID
														if (item.uuid.indexOf('0000AE3') != -1) {
															//获取特征ID
															uni.getBLEDeviceCharacteristics({
																deviceId: deviceId,
																serviceId: serviceId,
																success(res) {
																	//遍历特征ID，目的是查找读写ID
																	for (let item of res.characteristics) {
																		//找到监听ID，直接开启监听
																		if (item.properties.notify) {
																			let characteristicId = item.uuid;
																			uni.notifyBLECharacteristicValueChange({
																				deviceId: deviceId,
																				serviceId: serviceId,
																				characteristicId: characteristicId,
																				state: true,
																				success() {
																					that.showDialog = false

																					//存储ID信息
																					let obj = {
																						deviceId: deviceId,
																						serviceId: serviceId,
																						r_characteristicId: characteristicId
																					}

																					//遍历查找写ID
																					for (let item of res.characteristics) {
																						if (item.properties.write) {
																							obj.w_characteristicId = item.uuid
																							store.commit('set_device_info', obj)
																							console.log('device_info:', store.state.device_info)
																							
																							//找到写ID，延时500ms通过写ID写入读取版本信息指令
																							setTimeout(() => {
																								that.read_product()
																							}, 500)
																						}
																					}
																				}
																			})
																		}
																	}
																},
																fail() {
																	console.log('read character fail')
																}
															})
														}
													}
												}
											}
										})
									}
								})
							},
							fail(res) {
								console.log(res)
								uni.hideLoading()
								if (store.state.connect_state == false) {
									uni.showModal({
										title: that.$t("modal.notice"),
										content: that.$t("modal.connectErr"),
										confirmText: that.$t("modal.confirmText"),
										cancelText: that.$t("modal.cancelText"),
									})
								} else {
									uni.showModal({
										title: that.$t("modal.notice"),
										content: that.$t("modal.Bleconnected"),
										confirmText: that.$t("modal.confirmText"),
										cancelText: that.$t("modal.cancelText"),
									})
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		position: relative;
	}

	// 弹窗样式
	.dialog {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(129, 129, 129, 0.5);

		.dialog_content {
			width: 80%;
			height: 900rpx;
			background-color: white;
			position: relative;
			z-index: 1;
			/* 可选：确保在视觉上覆盖 A 背景 */
			border-radius: 6px;
			display: flex;
			flex-direction: column;

			.title {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 50px;
				background-color: #077fff;
				font-size: 20px;
			}

			.list_item {
				flex: 1;
				overflow-y: auto;
			}

			._item {
				display: flex;
				justify-content: space-between;
				height: 50px;
				padding: 30rpx 30rpx;
			}
		}
	}

	.img_box {
		// border: 1px solid #000;
		display: flex;
		justify-content: center;
		margin-bottom: 20rpx;
		position: relative;

		.img_class {
			width: 50%;
			margin: 0 auto !important;
			// border: 1px solid #000;
		}

		.zh_btn {
			position: absolute;
			top: 26rpx;
			right: 30rpx;
			width: 80rpx;
			font-size: 20rpx;
			font-weight: 400;
			padding: 0;
			background-color: #7c868a;
			color: white;
			height: 26px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.zh_btn.active {
			position: absolute;
			top: 26rpx;
			right: 30rpx;
			width: 80rpx;
			font-size: 20rpx;
			font-weight: 400;
			padding: 0;
			background-color: #0055ff;
			color: white;
			height: 26px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.en_btn {
			position: absolute;
			top: 26rpx;
			right: 120rpx;
			width: 80rpx;
			font-size: 20rpx;
			font-weight: 400;
			padding: 0;
			background-color: #7c868a;
			color: white;
			height: 26px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.en_btn.active {
			position: absolute;
			top: 26rpx;
			right: 120rpx;
			width: 80rpx;
			font-size: 20rpx;
			font-weight: 400;
			padding: 0;
			background-color: #0055ff;
			color: white;
			height: 26px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	._row2_left {
		width: 40%;
		margin-right: 30px;
		margin-left: 20px;
	}

	._row2_right {
		font-size: 16p x;
	}

	._row2 {
		display: flex;
		align-items: center;
		padding: 0rpx 35rpx;
		margin-bottom: 25px;
	}

	.btn {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 20px;
		margin: 0px;
		width: 65%;
		background-color: #3478f6;
		color: white;
	}

	.btn_hover {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 20px;
		margin: 0px;
		width: 65%;
		background-color: #95c0ff;
		color: white;
	}

	._center {
		display: flex;
		justify-content: center;
		margin-top: 10px;
	}

	._herf {
		font-size: 16px;
		color: #0055ff;
	}
</style>