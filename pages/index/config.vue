<template>
	<view class="">
		<view class="img_box">
			<image class="img_content" :src="img_url"></image>
		</view>

		<view class="car">
			<view :style="dynamicFontStyle" class="_text">{{$t("config.text1")}}</view>
			<uni-data-select class="public_style" v-model="car_value" :localdata="car_type" :clear="false"
				@change="change_car"></uni-data-select>
		</view>
		<view class="car">
			<view :style="dynamicFontStyle" class="_text">{{$t("config.text2")}}</view>
			<uni-data-select class="public_style" v-model="pole_value" :localdata="pole_type" :clear="false"
				@change="change_pole"></uni-data-select>
		</view>
		<view class="car">
			<view :style="dynamicFontStyle" class="_text">{{$t("config.text3")}}</view>
			<slider style="width: 58%;" :value="dect_range" :min="0" :max="6" step="0.1" block-size="28" @change="change"
				activeColor="#3478f6" inactiveColor="#ffff7f" showValue="" block-color="#2979ff" :block-size="15"></slider>
		</view>
		<view class="first_btn">
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_read()">{{$t("config.btnRead")}}</button>
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_save()">{{$t("config.btnSave")}}</button>
		</view>
		<view class="second_btn">
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_up_study()">{{$t("config.btnUpStudy")}}</button>
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
				@tap="radar_down_study()">{{$t("config.btnDownStudy")}}</button>
		</view>
	</view>
</template>

<script>
	import {int_to2hex} from '@/tools/send.js'
	import {
		updatePageTitle
	} from '@/common/in18-helper.js'
	import store from '@/store/index.js'
	import bt from "@/tools/BluetoothManager.js"
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				pole_value: 5,
				car_value: 1,

				dect_range: 1.0,

				img_url: "",
			}
		},
		computed: {
			//该页面需要动态刷新的变量，根据名字判断对应的意义
			...mapState(['connect_state']),
			isEnglish() {
				return this.$i18n.locale === 'en'
			},
			dynamicFontStyle() {
				return {
					fontSize: this.isEnglish ? '14px' : '18px',
					lineHeight: this.isEnglish ? '1.8' : '1.8'
				}
			},
			imgs() {
				if (this.$i18n.locale === 'zh') {
					return [
						"https://gitee.com/chuan0125/leida/raw/master/images/2.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/1.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/6.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/5.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/4.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3.jpg"
					];
				} else {
					return [
						"https://gitee.com/chuan0125/leida/raw/master/images/2_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/1_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/6_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/5_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/4_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3_en.jpg"
					];
				}
			},
			pole_type() {
				return [{
						value: 0,
						text: this.$t("config.poleType.type0")
					},
					{
						value: 1,
						text: this.$t("config.poleType.type1")
					},
					{
						value: 2,
						text: this.$t("config.poleType.type2")
					},
					{
						value: 3,
						text: this.$t("config.poleType.type3")
					},
					{
						value: 4,
						text: this.$t("config.poleType.type4")
					},
					{
						value: 5,
						text: this.$t("config.poleType.type5")
					},
				]
			},
			car_type() {
				return [{
						value: 0,
						text: this.$t("config.carType.type0")
					},
					{
						value: 1,
						text: this.$t("config.carType.type1")
					},
					{
						value: 2,
						text: this.$t("config.carType.type2")
					},
				]
			},
		},
		onLoad() {
			updatePageTitle()
		},
		onShow() {
			updatePageTitle()

			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {}
			})

			this.img_url = this.imgs[this.pole_value]

			if (store.state.connect_state == true) {
				setTimeout(() => {
					this.radar_read()
				}, 200)
			}
		},
		onHide() {
			uni.hideLoading()
		},
		onUnload() {
			uni.hideLoading()
		},
		methods: {
			change(e) {
				this.dect_range = e.detail.value
			},
			change_pole(e) {
				this.pole_value = e
				this.img_url = this.imgs[this.pole_value]
			},
			change_car(e) {
				this.car_value = e
			},
			//读取参数接口，实质上就是根据协议向蓝牙写指令
			radar_read() {
				uni.showLoading({
					title: this.$t("modal.reading")
				})
				bt.send("77020201", 0x77).then(res => {
					if (!res.error) {
						this.dect_range = res.payload[0] / 10
						this.pole_value = res.payload[1]
						this.car_value = res.payload[2]
						this.img_url = this.imgs[this.pole_value]
						uni.showToast({
							title: this.$t("modal.readSuccess")
						})
					} else {
						uni.showModal({
							title: this.$t("modal.notice"),
							confirmText: this.$t("modal.confirmText"),
							cancelText: this.$t("modal.cancelText"),
							content: this.$t("config.btnCont.btnRead"),
						})
					}
				})
			},
			//保存参数接口
			radar_save() {
				let that = this
				let _str = '76'
				uni.showLoading({
					title: that.$t("modal.saving")
				})
				_str = _str + int_to2hex((that.dect_range * 10) & 0x00000000000000ff) +
					int_to2hex(that.pole_value & 0x00000000000000ff) + int_to2hex(that.car_value)
					
				bt.send(_str, 0x76).then(res => {
					uni.hideLoading()
					if (!res.error) {
						uni.showModal({
							title: that.$t("modal.notice"),
							confirmText: that.$t("modal.confirmText"),
							cancelText: that.$t("modal.cancelText"),
							content: that.$t("config.studyCont.text5"),
							success(res) {
								if (res.confirm) {
									that.radar_up_study()
								}
							}
						})
					} else {
						uni.showModal({
							title: that.$t("modal.notice"),
							confirmText: that.$t("modal.confirmText"),
							cancelText: that.$t("modal.cancelText"),
							content: that.$t("config.btnCont.btnSave"),
						})
					}
				})
			},
			//抬杆学习
			radar_up_study() {
				let that = this
				uni.showModal({
					title: that.$t("modal.notice"),
					content: that.$t("config.studyCont.text1"),
					confirmText: that.$t("modal.confirmText"),
					cancelText: that.$t("modal.cancelText"),
					success(res) {
						if (res.confirm) {
							uni.showModal({
								title: that.$t("modal.notice"),
								content: that.$t("config.studyCont.text2"),
								confirmText: that.$t("modal.confirmText"),
								cancelText: that.$t("modal.cancelText"),
								success(res) {
									if (res.confirm) {
										uni.showLoading({
											title: that.$t("config.studyCont.text3"),
											mask: true,
											success() {
												bt.send('660A0A06', 0x66).then(res => {
													if (!res.error) {
														setTimeout(() => {
															uni.hideLoading()
															that.radar_down_study()
														}, 2000)
													} else {
														uni.showModal({
															title: that.$t("config.studyCont.text4"),
															confirmText: that.$t("modal.confirmText"),
															cancelText: that.$t("modal.cancelText"),
														});
													}
												})
											}
										})
									}
								}
							})
						}
					}
				})
			},
			//落杆学习指令
			radar_down_study() {
				let that = this
				uni.showModal({
					title: that.$t("modal.notice"),
					content: that.$t("config.studyCont.text6"),
					confirmText: that.$t("modal.confirmText"),
					cancelText: that.$t("modal.cancelText"),
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: that.$t("config.studyCont.text7")
							})
							
							bt.send('660A0A04', 0x66).then(res => {
								if (!res.error) {
									setTimeout(() => {
										uni.hideLoading()
										uni.showModal({
											title: that.$t("config.studyCont.text7"),
											content: that.$t("config.studyCont.text8"),
											confirmText: that.$t("modal.confirmText1"),
											cancelText: that.$t("modal.cancelText"),
											success(res) {
												if (res.confirm) {
													uni.showLoading({
														title: that.$t("config.studyCont.text7")
													})
													setTimeout(() => {
														uni.hideLoading()
														uni.showModal({
															title: that.$t("modal.notice"),
															content: that.$t("config.studyCont.text9"),
															confirmText: that.$t("modal.confirmText1"),
															cancelText: that.$t("modal.cancelText"),
															success(res) {
																if (res.confirm) {
																	uni.showLoading({
																		title: that.$t("config.studyCont.text7")
																	})
																	bt.send('66181800', 0x66).then(res => {
																		if (!res.error) {
																			setTimeout(() => {
																				uni.hideLoading()
																				uni.showModal({
																					title: that.$t("modal.studyFinish"),
																					confirmText: that.$t("modal.confirmText"),
																					cancelText: that.$t("modal.cancelText"),
																				});
																			}, 2000)
																		} else {
																			uni.showModal({
																				title: that.$t("config.studyCont.text11"),
																				confirmText: that.$t("modal.confirmText"),
																				cancelText: that.$t("modal.cancelText"),
																			});
																		}
																	})
																}
															}
														})
													}, 2000)
												}
											}
										})
									}, 2000)
								} else {
									uni.showModal({
										title: that.$t("config.studyCont.text11"),
										confirmText: that.$t("modal.confirmText"),
										cancelText: that.$t("modal.cancelText"),
									});
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
	.img_box {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 10px;

		.img_content {
			width: 96%;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
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
		padding: 0rpx 35rpx;
		display: flex;
		justify-content: space-between;

		button[disabled] {
			background-color: #999999 !important;
			color: white !important;
		}
	}

	.car {
		display: flex;
		align-items: center;
		padding: 0rpx 35rpx;
		margin-bottom: 15px;

		.public_style {
			flex: 1;
		}
	}

	._text {
		width: 40%;
		margin-right: 10px;
		align-items: center;
	}
</style>