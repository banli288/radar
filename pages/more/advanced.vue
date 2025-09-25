<template>
	<view>
		<view class="config1">
			<view class="config1_unit" v-for="(item, index) in config1" v-if="index != 1" :key="index">
				<view class="config1_unit_v1" style="width: 50%;">
					<view :style="dynamicFontStyle" class="name_size">{{item.name}}</view>
					<view :style="dynamicFontStyle" class="dis_size">{{item.description}}</view>
				</view>
				<view class="ld_content">
					<uni-data-select class="unselect" :localdata="item.checkbox" mode="tag" v-model="cfg1_value[index]"
						:clear="false"></uni-data-select>
				</view>
			</view>
		</view>
		<view class=" config2">
			<view class="config2_unit" v-for="(item, index) in config2" :key="index">
				<view v-if="item.name === $t('aconfig2.items.radarSensitivity.name')" class='ldlmd'>
					<view :style="dynamicFontStyle" class="name_size">{{item.name}}</view>
					<view class="config2_unit_v1">
						<view :style="dynamicFontStyle" class="unit_size">{{item.text}}</view>
						<view :style="dynamicFontStyle" class="unit_size">{{item.limit[5 - cfg2_value[index]].text}}
						</view>
						<view :style="dynamicFontStyle" class="unit_size" style="margin-right: 10px;">{{item.unit}}
						</view>
						<view :style="dynamicFontStyle" class="ld_content">
							<uni-data-select class="unselect" v-model="cfg2_value[index]" :localdata="item.limit"
								:clear="false" @change=""></uni-data-select>
						</view>
					</view>
				</view>
				<view class="content" v-else>
					<view :style="dynamicFontStyle" class="name_size">{{item.name}}</view>
					<view :style="dynamicFontStyle" class="config2_unit_v1">
						<view :style="dynamicFontStyle" class="unit_size">{{item.text}}</view>
						<view :style="dynamicFontStyle" class="unit_size">{{cfg2_value[index]}}</view>
						<view :style="dynamicFontStyle" class="unit_size" style="margin-right: 10px;">{{item.unit}}
						</view>
						<view class="big-nb">
							<uni-number-box v-model="cfg2_value[index]" background="#0055ff" color="#fff"
								:min="item.limit[0]" :max="item.limit[1]" :step="item.step">
							</uni-number-box>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="first_btn" style="margin-top: 10px;">
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_read()">{{$t("aconfig.btnRead")}}</button>
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_save()">{{$t("aconfig.btnSave")}}</button>
		</view>
		<view class="second_btn">
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_restart()">{{$t("aconfig.btnRestart")}}</button>
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_reset()">{{$t("aconfig.btnRestore")}}</button>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	import {
		mapState
	} from 'vuex'
	import {
		hex2int,
		int_to2hex,
		radar_recv,
		radar_tx_data,
		send_data,
		hexStringToByteArray,
		extractWithWrapper
	} from '@/tools/send.js'
	import bt from "@/tools/BluetoothManager.js"
	export default {
		data() {
			return {
				cfg1_value: [5, 0, 0],
				cfg2_value: [4, 0.5, 0.1, 0.3, 0, 0.6, 0.6],

				timer: null,
				cmd_id: 0, //0-空闲 1-都参数 2-写参数 3-重启 4-恢复出厂
				cmd_tout: 0,

				para_read_enable: false,
			}
		},
		computed: {
			...mapState(['connect_state']),
			isEnglish() {
				return this.$i18n.locale === 'en'
			},
			dynamicFontStyle() {
				return {
					fontSize: this.isEnglish ? '12px' : '16px',
					lineHeight: this.isEnglish ? '1.8' : '1.8'
				}
			},
			config1() {
				return [{
						name: this.$t("aconfig.name1"),
						description: this.$t("aconfig.description1"),
						value: 0,
						checkbox: [{
								text: this.$t("aconfig.checkbox1.close"),
								value: 0
							},
							{
								text: this.$t("aconfig.checkbox1.Strong"),
								value: 1
							}, {
								text: this.$t("aconfig.checkbox1.Medium_strong"),
								value: 2
							}, {
								text: this.$t("aconfig.checkbox1.Medium"),
								value: 3
							}, {
								text: this.$t("aconfig.checkbox1.Medium_weak"),
								value: 4
							}, {
								text: this.$t("aconfig.checkbox1.Weak"),
								value: 5
							},
						],
					},
					{
						name: this.$t("aconfig.name2"),
						description: this.$t("aconfig.description2"),
						value: 0,
						checkbox: [{
								text: this.$t("aconfig.checkbox2.left"),
								value: 1
							},
							{
								text: this.$t("aconfig.checkbox2.both"),
								value: 0
							},
							{
								text: this.$t("aconfig.checkbox2.right"),
								value: 2
							},
						],
					},
					{
						name: this.$t("aconfig.name3"),
						description: this.$t("aconfig.description3"),
						value: 0,
						checkbox: [{
								text: this.$t("aconfig.checkbox3.open"),
								value: 0
							},
							{
								text: this.$t("aconfig.checkbox3.close"),
								value: 1
							},
							{
								text: this.$t("aconfig.checkbox3.disable"),
								value: 2
							},
						],
					},
				]
			},
			config2() {
				return [{
						name: this.$t('aconfig2.items.radarSensitivity.name'),
						text: this.$t('aconfig2.items.radarSensitivity.text'),
						unit: this.$t('aconfig2.items.radarSensitivity.unit'),
						value: 4,
						limit: [{
								value: 5,
								text: this.$t('aconfig2.items.radarSensitivity.limits.5')
							},
							{
								value: 4,
								text: this.$t('aconfig2.items.radarSensitivity.limits.4')
							},
							{
								value: 3,
								text: this.$t('aconfig2.items.radarSensitivity.limits.3')
							},
							{
								value: 2,
								text: this.$t('aconfig2.items.radarSensitivity.limits.2')
							},
							{
								value: 1,
								text: this.$t('aconfig2.items.radarSensitivity.limits.1')
							},
						]
					},
					{
						name: this.$t('aconfig2.items.delayDropTime.name'),
						text: this.$t('aconfig2.items.delayDropTime.text'),
						unit: this.$t('aconfig2.items.units.second'),
						value: 0.5,
						step: 0.1,
						limit: [0.1, 25.5],
					},
					{
						name: this.$t('aconfig2.items.proximityNoDetect.name'),
						text: this.$t('aconfig2.items.proximityNoDetect.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0.1,
						step: 0.1,
						limit: [0.0, 1.0],
					},
					{
						name: this.$t('aconfig2.items.leftNoDetectWidth.name'),
						text: this.$t('aconfig2.items.leftNoDetectWidth.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0.3,
						step: 0.1,
						limit: [0.0, 2],
					},
					{
						name: this.$t('aconfig2.items.rightNoDetectWidth.name'),
						text: this.$t('aconfig2.items.rightNoDetectWidth.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0,
						step: 0.1,
						limit: [0.0, 2],
					},
					{
						name: this.$t('aconfig2.items.leftDetectWidth.name'),
						text: this.$t('aconfig2.items.leftDetectWidth.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0.6,
						step: 0.1,
						limit: [0.5, 2],
					},
					{
						name: this.$t('aconfig2.items.rightDetectWidth.name'),
						text: this.$t('aconfig2.items.rightDetectWidth.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0.6,
						step: 0.1,
						limit: [0.5, 2],
					},
				]
			},
		},
		onShow() {
			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {}
			})

			if (store.state.connect_state == true) {
				setTimeout(() => {
					this.radar_read()
				}, 500)
			}
		},
		onHide() {},
		onUnload() {},
		methods: {
			chagnge_lmd(e) {
				this.config2[0].value = e
			},
			//读取参数指令
			radar_read() {
				let that = this

				uni.showLoading({
					title: that.$t("aconfig.modal.reading")
				})

				bt.send("87020201", 0x87).then(res => {
					if (!res.error) {
						if (res.payload.length == 10) {
							this.cfg1_value[0] = res.payload[0]
							this.cfg1_value[1] = res.payload[1]
							this.cfg1_value[2] = res.payload[2]
						
							this.cfg2_value[0] = res.payload[3]
							this.cfg2_value[1] = res.payload[4] / 10
							this.cfg2_value[2] = res.payload[5] / 10
							this.cfg2_value[3] = res.payload[6] / 10
							this.cfg2_value[4] = res.payload[7] / 10
							this.cfg2_value[5] = res.payload[8] / 10
							this.cfg2_value[6] = res.payload[9] / 10
						
							this.$forceUpdate()
						
							uni.showToast({
								title: that.$t("aconfig.modal.readsuccess"),
							})
						} else {
							uni.hideLoading()
							uni.showModal({
								title: that.$t("aconfig.modal.notice"),
								confirmText: that.$t("aconfig.modal.confirm"),
								cancelText: that.$t("aconfig.modal.cancel"),
								content: that.$t("aconfig.modal.readingTout"),
							})
						}
					} else {
						uni.hideLoading()
						uni.showModal({
							title: that.$t("modal.notice"),
							confirmText: that.$t("modal.confirmText"),
							cancelText: that.$t("modal.cancelText"),
							content: that.$t("modal.readTineout"),
						})
					}
				})
			},
			//保存参数指令，将变量的指根据协议组帧送给蓝牙发送
			radar_save() {
				let that = this
				let _str = '86'

				_str = _str + int_to2hex((this.cfg1_value[0]) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg1_value[1]) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg1_value[2]) & 0x00000000000000ff)

				_str = _str + int_to2hex((this.cfg2_value[0]) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg2_value[1] * 10) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg2_value[2] * 10) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg2_value[3] * 10) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg2_value[4] * 10) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg2_value[5] * 10) & 0x00000000000000ff)
				_str = _str + int_to2hex((this.cfg2_value[6] * 10) & 0x00000000000000ff)

				uni.showLoading({
					title: that.$t("aconfig.modal.saving")
				})
				
				bt.send(_str, 0x86).then(res => {
					if (!res.error) {
						uni.showToast({
							title: that.$t("aconfig.modal.savesuccess"),
						})
					} else {
						uni.hideLoading()
						uni.showModal({
							title: that.$t("aconfig.modal.notice"),
							confirmText: that.$t("aconfig.modal.confirm"),
							cancelText: that.$t("aconfig.modal.cancel"),
							content: that.$t("aconfig.modal.savingTout"),
						})
					}
				})
			},
			//重启指令
			radar_restart() {
				let that = this
				uni.showModal({
					title: that.$t("aconfig.modal.notice"),
					confirmText: that.$t("aconfig.modal.confirm"),
					cancelText: that.$t("aconfig.modal.cancel"),
					content: that.$t("aconfig.modal.radarRestart"),
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: that.$t("aconfig.modal.restarting")
							})
							
							bt.send("66141400", 0x66).then(res => {
								if (!res.error) {
									uni.showToast({
										title: that.$t("aconfig.modal.restartsuccess"),
									})
								} else {
									uni.hideLoading()
									uni.showModal({
										title: that.$t("aconfig.modal.notice"),
										confirmText: that.$t("aconfig.modal.confirm"),
										cancelText: that.$t("aconfig.modal.cancel"),
										content: that.$t("aconfig.modal.restartingTout"),
									})
								}
							})
						}
					}
				})
			},
			//恢复出厂设置指令
			radar_reset() {
				let that = this
				uni.showModal({
					title: that.$t("aconfig.modal.notice"),
					confirmText: that.$t("aconfig.modal.confirm"),
					cancelText: that.$t("aconfig.modal.cancel"),
					content: that.$t("aconfig.modal.restore"),
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: that.$t("aconfig.modal.restoring"),
							})
							
							bt.send("66020202", 0x66).then(res => {
								if (!res.error) {
									uni.showToast({
										title: that.$t("aconfig.modal.restoresuccess"),
									})
								} else {
									uni.hideLoading()
									uni.showModal({
										title: that.$t("aconfig.modal.notice"),
										confirmText: that.$t("aconfig.modal.confirm"),
										cancelText: that.$t("aconfig.modal.cancel"),
										content: that.$t("aconfig.modal.restoreingTout"),
									})
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.config1 {
		display: flex;
		flex-direction: column;

		.config1_unit {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-right: 10px;

			.config1_unit_v1 {
				display: flex;
				flex-direction: column;
				margin: 10px;
			}

			.ld_content,
			.unselect {
				width: 250rpx;
				font-size: 6px;
			}
		}
	}

	.config2 {
		display: flex;
		flex-direction: column;

		.ldlmd {}

		.content,
		.ldlmd {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 10px;

			.config2_unit_v1 {
				width: 65%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;

				.ld_content,
				.unselect {
					width: 250rpx;
					font-size: 6px;
				}
			}
		}
	}

	.name_size {
		width: 45%;
	}

	.dis_size {
		font-size: 12px
	}

	.unit_size {
		font-size: 20rpx;
		color: #0055ff;
	}

	.btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 16px;
		margin: 0px;
		width: 48%;
		background-color: #3478f6;
		color: white;
	}

	.btn_hover {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 16px;
		margin: 0px;
		width: 48%;
		background-color: #00ffff;
		color: white;
	}

	.first_btn {
		margin-bottom: 20rpx;
	}

	.first_btn,
	.second_btn {
		padding: 0rpx 10px;
		display: flex;
		justify-content: space-between;

		button[disabled] {
			background-color: #999999 !important;
			color: white !important;
		}
	}

	/* 外层容器整体高度 */
	.big-nb::v-deep .uni-numbox {
		height: 60rpx !important;
		font-size: 30rpx !important;
	}

	/* 左右按钮 */
	.big-nb::v-deep .uni-numbox__minus,
	.big-nb::v-deep .uni-numbox__plus {
		width: 70rpx !important;
		height: 60rpx !important;
		line-height: 60rpx !important;
		font-size: 30rpx !important;
	}

	.big-nb::v-deep .uni-numbox__value {
		height: 60rpx !important;
		line-height: 60rpx !important;
	}
</style>