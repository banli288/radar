<template>
	<view class="page">
		<view class="card img_box">
			<image class="img_content" :src="img_url"></image>
		</view>

		<view class="col">
			<view class="card row">
				<view :style="dynamicFontStyle" class="_text" style="width: 40%; justify-content: space-between;">{{$t("config.text1")}}</view>
				<uni-data-select style="width: 60%;" v-model="car_value" :localdata="car_type" :clear="false"
					@change="change_car"></uni-data-select>
			</view>
			<view class="card row">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view :style="dynamicFontStyle" class="_text">{{$t("config.fixation_text")}}</view>
					<view :style="dynamicFontStyle" class="_text" style="font-size: 22rpx;">{{$t("config.text2_dis")}}</view>
				</view>
				
				<radio-group class="radio-row" @change="radioChange">
					<label class="radio-item" style="margin-right: 20px;" v-for="item in fixation_items" :key="item.value">
						<radio :value="item.value" :checked="item.value === fixation_value" color="#007AFF" />
						<text class="radio-text">{{ item.name }}</text>
					</label>
				</radio-group>
				<!-- <uni-data-select style="width: 60%;" v-model="fixation_value" :localdata="fixation" :clear="false"
					@change="change_fixation"></uni-data-select> -->
			</view>
			<view class="card row">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view :style="dynamicFontStyle" class="_text">{{$t("config.text2")}}</view>
				</view>
				<uni-data-select style="width: 60%;" v-model="pole_value" :localdata="pole_type" :clear="false"
					@change="change_pole"></uni-data-select>
			</view>
			<view class="card row">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view :style="dynamicFontStyle" class="_text">{{$t("config.text3")}}</view>
					<view :style="dynamicFontStyle" class="_text">{{$t("config.text3_dis")}}</view>
				</view>
				<slider style="width: 60%;" :value="dect_range" :min="0" :max="6" step="0.1" block-size="28" @change="change"
					activeColor="#3478f6" inactiveColor="#ffff7f" showValue="" block-color="#2979ff" :block-size="15"></slider>
			</view>
		</view>

    <!-- <scroll-view scroll-y="true" style="height: 100px; margin-left: 35rpx;">
      <view v-for="(item, index) in aera_sensi" style="display: flex;">
          <view style="font-size: 16px; width: 40%;">区域{{index}}</view>
          <uni-number-box style="" v-model="item.value" :min="item.min" :max="item.max" :step="item.step"></uni-number-box>
      </view>
    </scroll-view>

    <scroll-view scroll-y="true" style="padding: 35rpx;">
      <view style="display: flex;">
        <view style="font-size: 16px; width: 40%;">特殊杆子类型</view>
        <uni-number-box style="" v-model="pole_type_1.value" :min="pole_type_1.min" :max="pole_type_1.max" :step="pole_type_1.step"></uni-number-box>
      </view>
    </scroll-view> -->

		<view class="card col">
			<view class="row" style="margin-bottom: 10rpx;">
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_read()">{{$t("config.btnRead")}}</button>
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_save()">{{$t("config.btnSave")}}</button>
			</view>
			<view class="row">
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_up_study()">{{$t("config.btnUpStudy")}}</button>
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_down_study()">{{$t("config.btnDownStudy")}}</button>
			</view>
		</view>
		
		<view class="card">
			<button class="btn" hover-class="btn_hover" style="width: 100%;" :disabled="!connect_state" @tap="radar_reset">{{$t("aconfig.btnRestore")}}</button>
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
  import { bytesToAsciiString, bytesToHexString, hex2int, hexStringToByteArray, jlog, log_upload } from '../../tools/send'
	import { getConfig, setConfig, get_radar_sensi, set_radar_sensi, advanced_read, advanced_write, param_env_read,
	 studyStep1, studyStep2, studyStep3, restore} from '../../tools/radar_port'
	export default {
		data() {
			return {
				pole_value: 0, // display
				pole_index: 0, // real
				car_value: 1,
				dect_range: 1.0,
				img_url: "",
				study_entry: 0,
				fixation_value: 0,
					
        aera_sensi: [
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 42, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 1, step: 1},
        ],
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
						"https://gitee.com/chuan0125/leida/raw/master/images/3.jpg",
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
						"https://gitee.com/chuan0125/leida/raw/master/images/3_en.jpg",
            "https://gitee.com/chuan0125/leida/raw/master/images/4_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3_en.jpg"
					];
				}
			},
			pole_type() {
				if (store.state.product_info.sf > 1.6) {
					return [
					  {value: 0,text: this.$t("config.poleType.type0")},
					  {value: 1,text: this.$t("config.poleType.type1")},
					  {value: 2,text: this.$t("config.poleType.type2")},
					  {value: 3,text: this.$t("config.poleType.type3")},
					  // {value: 4,text: this.$t("config.poleType.type4")},
					  // {value: 5,text: this.$t("config.poleType.type5")},
					  // {value: 6,text: this.$t("config.poleType.type6")},
					  // {value: 7,text: this.$t("config.poleType.type7")},
					]
				} else {
					return [
					  {value: 0,text: this.$t("config.poleType.type0")},
					  {value: 1,text: this.$t("config.poleType.type1")},
					  {value: 2,text: this.$t("config.poleType.type2")},
					  // {value: 3,text: this.$t("config.poleType.type3")},
					  // {value: 4,text: this.$t("config.poleType.type4")},
					  // {value: 5,text: this.$t("config.poleType.type5")},
					]
				}
			},
			car_type() {
				return [
				  {value: 0,text: this.$t("config.carType.type0")},
				  {value: 1,text: this.$t("config.carType.type1")},
				  {value: 2,text: this.$t("config.carType.type2")}, 
				]
			},
			fixation() {
				return [
					{value: 1,text: this.$t("config.fixation_right")},
				  {value: 0,text: this.$t("config.fixation_left")},
				]
			},
			fixation_items() {
				return [
					{ value: 1, name: this.$t("config.fixation_left") },
					{ value: 0, name: this.$t("config.fixation_right") }
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
			radioChange(e) {
				this.fixation_value = Number(e.detail.value);
				this.update_image()
			},
			change(e) {
				this.dect_range = e.detail.value
			},
			change_pole(e) {
				this.pole_value = e
				this.update_image()
			},
			change_car(e) {
				this.car_value = e
			},
			change_fixation(e) {
				this.fixation_value = e
				this.update_image()
			},
			update_image() {
				let that = this
				let image_index = 0
				// 0: right 1: left
				if (that.fixation_value == 1) {
					if (that.pole_value == 0) {
						image_index = 1 // 直杆
					} else if (that.pole_value == 1) {
						image_index = 3 // 栅栏杆
					} else if (that.pole_value == 2) {
						image_index = 5 // 广告杆
					} else if (that.pole_value == 3) {
						image_index = 7 // 空降杆
					}
				} else {
					if (that.pole_value == 0) {
						image_index = 0
					} else if (that.pole_value == 1) {
						image_index = 2
					} else if (that.pole_value == 2) {
						image_index = 4
					} else if (that.pole_value == 3) {
						image_index = 6 // 空降杆
					}
				}
				this.img_url = this.imgs[image_index]
			},
			//读取参数接口，实质上就是根据协议向蓝牙写指令
			async radar_read() {
				let that = this
				
				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readfail")})}, 1000)
				uni.showLoading({title: that.$t("modal.reading"), mask: true})
				
				let pole = 0
				const config = await getConfig()
				if (config) {
					pole = config.pole
					this.dect_range = config.range
					this.car_value = config.carType
					
					pole % 2 == 0 ? that.fixation_value = 0 : that.fixation_value = 1; // 0: right 1: left
					
					if (store.state.product_info.sw_ver > 1.6) {
						const sensi = await get_radar_sensi()
						if (sensi) {
							clearTimeout(timer)
							uni.showToast({title: this.$t("modal.readSuccess")})
							
							if (pole <= 1) {
								that.pole_value = 0 // 直杆
							} else if (pole <= 3) {
								that.pole_value = 1 // 栅栏干
							} else if (pole <= 5) {
								sensi.pole == 0 ? that.pole_value = 2 : that.pole_value = 3 // byte 10: 0: 广告杆 1: 空降杆
							} 
							
							if (pole < 4) {
							  this.pole_index = pole
							} else if (pole == 4) {
							  if (sensi.pole == 0) this.pole_index = 4
							  else this.pole_index = 6
							} else if (pole == 5) {
							  if (sensi.pole == 0) this.pole_index = 5
							  else this.pole_index = 7
							}
							
							for (let i = 0; i < 9; i++) this.aera_sensi[i].value = sensi.sensi[i]
							this.aera_sensi[9] = sensi.pole
							
							this.img_url = this.imgs[this.pole_index]
							
							log_upload('read', {
							  'dect_range': this.dect_range,
							  'car_value': this.car_value,
							  'pole_value': pole,
							  '98020201': sensi
							})
						}
					} else {
						this.pole_index = pole
						this.img_url = this.imgs[this.pole_index]
						
						if (pole <= 1) {
							that.pole_value = 0 // 直杆
						} else if (pole <= 3) {
							that.pole_value = 1 // 栅栏栏
						} else if (pole <= 5) {
							that.pole_value = 2 // 广告杆
						} 
						
						clearTimeout(timer)
						uni.showToast({title: this.$t("modal.readSuccess")})
						
						log_upload('read', {
						    'dect_range': this.dect_range,
						    'car_value': this.car_value,
						    'pole_value': pole
						})
					}
				}
			},
			//保存参数接口
			async radar_save() {
				let that = this
				let pole = 0

				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
				uni.showLoading({title: that.$t("modal.saving"), mask: true})

				// 0: right 1: left
				if (that.fixation_value == 1) {
					if (that.pole_value == 0) {
						that.pole_index = 1 // 直杆
					} else if (that.pole_value == 1) {
						that.pole_index = 3 // 栅栏杆
					} else if (that.pole_value == 2 || that.pole_value == 3) {
						that.pole_index = 5 // 广告杆/空降杆
					}
				} else {
					if (that.pole_value == 0) {
						that.pole_index = 0
					} else if (that.pole_value == 1) {
						that.pole_index = 2
					} else if (that.pole_value == 2 || that.pole_value == 3) {
						that.pole_index = 4
					}
				}

				pole = that.pole_index

				const param = {
					pole: pole,
					range: that.dect_range,
					carType: that.car_value
				}

				const res_save = await setConfig(param)
				if (!res_save) return;
				
				clearTimeout(timer)
				uni.hideLoading()
				
				if (store.state.product_info.sw_ver > 1.6) {
					timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 3000)
					uni.showLoading({title: that.$t("modal.saving"), mask: true})
					
					for (let i = 0; i < 9; i++) that.aera_sensi[i].value = 0x0A
					
					// 2: 广告杆 3: 空降杆
					if (that.pole_value == 2) {
						that.aera_sensi[9].value = 0 
					}
					else if(that.pole_value == 3)  {
						that.aera_sensi[2].value = 0x2A
						that.aera_sensi[9].value = 1
					}
					
					let sensi = []
					for (let i = 0; i < 9; i++) sensi.push(that.aera_sensi[i].value)
					
					const res_sensi = await set_radar_sensi(sensi, that.aera_sensi[9].value)
					if (!res_sensi) return;
					
					const res_getConfig = await getConfig()
					if (!res_getConfig) return;
					
					const res_getSensi = await get_radar_sensi()
					if (!res_getSensi) return;
					
					clearTimeout(timer)
					uni.hideLoading()
					
					log_upload('read', { '77020201': res_getConfig, '98020201': res_getSensi})
						
					uni.showModal({
					  title: that.$t("modal.notice"),
					  confirmText: that.$t("modal.confirmText"),
					  cancelText: that.$t("modal.cancelText"),
					  content: that.$t("config.studyCont.text5"),
					  success(res) {
					    if (res.confirm) {
								that.radar_up_study()
								that.study_entry = 1
							}
					  }
					})
				} else {
					uni.showModal({
					  title: that.$t("modal.notice"),
					  confirmText: that.$t("modal.confirmText"),
					  cancelText: that.$t("modal.cancelText"),
					  content: that.$t("config.studyCont.text5"),
					  success(res) {
					    if (res.confirm) {
					    	that.radar_up_study()
					    	that.study_entry = 1
					    }
					  }
					})
					
					log_upload('write', {
					  'dect_range': that.dect_range * 10,
					  'pole_value': that.pole_index,
					  'car_value': that.car_value
					})
				}
			},
			//抬杆学习
			async radar_up_study() {
				let that = this
				uni.showModal({
					title: that.$t("modal.notice"),
					content: that.$t("config.studyCont.text1"),
					confirmText: that.$t("modal.confirmText"),
					cancelText: that.$t("modal.cancelText"),
					async success(res) {
						if (res.confirm) {
							uni.showModal({
								title: that.$t("modal.notice"),
								content: that.$t("config.studyCont.text2"),
								confirmText: that.$t("modal.confirmText"),
								cancelText: that.$t("modal.cancelText"),
								async success(res) {
									if (res.confirm) {
										let timer = setTimeout(() => {uni.showToast({title: that.$t("config.btnCont.btnUp")})}, 2000)
										uni.showLoading({title: that.$t("config.studyCont.text3"), mask: true})
										
										const resStep1 = await studyStep1()
										if (!resStep1) return;
										
										const resEnv = await param_env_read()
										if (!resEnv) return;
										
										clearTimeout(timer)
										uni.hideLoading()
										
										log_upload('read', {'type': 'env para', 'data': bytesToAsciiString(resEnv)})
										
										uni.showModal({
											title: that.$t("modal.notice"),
											confirmText: that.$t("modal.confirmText"),
											cancelText: that.$t("modal.cancelText"),
											content: that.$t("config.studyCont.upend"),
											success(res) {
												if (res.confirm) {
													if (that.study_entry == 1) {
														that.radar_down_study()
														that.study_entry = 0
													}
												}
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
			async radar_down_study() {
				let that = this
				let timer = null
				
				that.study_entry = 0
				
				uni.showModal({
					title: that.$t("modal.notice"),
					content: that.$t("config.studyCont.text6"),
					confirmText: that.$t("modal.confirmText"),
					cancelText: that.$t("modal.cancelText"),
					async success(res) {
						if (res.confirm) {
							timer = setTimeout(() => {uni.showToast({title: that.$t("config.studyCont.text11")})}, 1000)
							uni.showLoading({title: that.$t("config.studyCont.text7"), mask: true})

							const resStep2 = await studyStep2()
							if (!resStep2) return;

							clearTimeout(timer)
							
							setTimeout(() => {
								uni.hideLoading()
								uni.showModal({
									title: that.$t("config.studyCont.text7"),
									content: that.$t("config.studyCont.text8"),
									confirmText: that.$t("modal.confirmText1"),
									cancelText: that.$t("modal.cancelText"),
									async success(res) {
										if (res.confirm) {
											uni.showLoading({title: that.$t("config.studyCont.text7")})
											setTimeout(() => {
												uni.hideLoading()
												uni.showModal({
													title: that.$t("modal.notice"),
													content: that.$t("config.studyCont.text9"),
													confirmText: that.$t("modal.confirmText1"),
													cancelText: that.$t("modal.cancelText"),
													async success(res) {
														if (res.confirm) {
															let timer = setTimeout(() => {uni.showToast({title: that.$t("config.studyCont.text11")})}, 1000)
															uni.showLoading({title: that.$t("config.studyCont.text7"), mask: true})
							
															const resStep3 = await studyStep3()
															if (!resStep3) return;
															
															clearTimeout(timer)
																																		
															setTimeout(() => {
																uni.hideLoading()
																uni.showModal({
																	title: that.$t("modal.studyFinish"),
																	confirmText: that.$t("modal.confirmText"),
																	cancelText: that.$t("modal.cancelText"),
																	async success(res) {
																		if(res.confirm) {
																			let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
																			
																			const advanced = await advanced_read()
																			if (!advanced) return;
																			
																			if ((advanced.leftNoDetectWidth + advanced.rightNoDetectWidth) > 1.0) {
																				uni.showModal({
																					title: that.$t("config.studyEndNotice"),
																					confirmText: that.$t("modal.confirmText"),
																					cancelText: that.$t("modal.cancelText"),
																				});
																			}
																			
																			log_upload('read', advanced)
																			
																			if (that.pole_value == 0 || that.pole_value == 1) {
																				if (that.pole_value == 0) {
																					advanced.leftNoDetectWidth = 0
																					advanced.rightNoDetectWidth = 0.5
																				} else if (that.pole_value == 1) {
																					advanced.leftNoDetectWidth = 0.5
																					advanced.rightNoDetectWidth = 0
																				}
																				
																				const advSave = await advanced_write(advanced)
																				if (!advSave) return;
																				
																				clearTimeout(timer)
																			}
																		}
																	},
																});
															}, 2000)
														}
													}
												})
											}, 2000)
										}
									}
								})
							}, 2000)
						}
					}
				})
			},
			async radar_reset() {
				let that = this
				uni.showModal({
					title: that.$t("aconfig.modal.notice"),
					confirmText: that.$t("aconfig.modal.confirm"),
					cancelText: that.$t("aconfig.modal.cancel"),
					content: that.$t("aconfig.modal.restore"),
					async success(res) {
						if (res.confirm) {
			        let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
			        uni.showLoading({title: that.$t("aconfig.modal.setting"), mask: true})
							
							const res_restore = await restore()
							if (res_restore) {
								clearTimeout(timer)
								uni.showToast({title: that.$t("aconfig.modal.restoresuccess")})
							}
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../common.scss";
	
	.img_box {
		display: flex;
		justify-content: center;
		align-items: center;

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

	._text {
		align-items: center;
	}
</style>