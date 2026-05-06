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
					<view :style="dynamicFontStyle" class="_text">{{$t("config.text2")}}</view>
					<view :style="dynamicFontStyle" class="_text" style="font-size: 22rpx;">{{$t("config.text2_dis")}}</view>
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
	export default {
		data() {
			return {
				pole_value: 5,
				car_value: 1,
				dect_range: 1.0,
				img_url: "",
				study_entry: 0,

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
					  {value: 4,text: this.$t("config.poleType.type4")},
					  {value: 5,text: this.$t("config.poleType.type5")},
					  {value: 6,text: this.$t("config.poleType.type6")},
					  {value: 7,text: this.$t("config.poleType.type7")},
					]
				} else {
					return [
					  {value: 0,text: this.$t("config.poleType.type0")},
					  {value: 1,text: this.$t("config.poleType.type1")},
					  {value: 2,text: this.$t("config.poleType.type2")},
					  {value: 3,text: this.$t("config.poleType.type3")},
					  {value: 4,text: this.$t("config.poleType.type4")},
					  {value: 5,text: this.$t("config.poleType.type5")},
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
				let that = this
				
				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readfail")})}, 1000)
				uni.showLoading({title: that.$t("modal.reading"), mask: true})
				
				bt.send("77020201", 0x77).then(res => {
					if (!res.error) {
            let pole = res.payload[1]
            this.dect_range = res.payload[0] / 10
            this.car_value = res.payload[2]

            if (store.state.product_info.sf > 1.6) {
              bt.send("98020201", 0x98).then(res => {
                if (!res.error) {
                  if (res.payload.length == 10) {
										clearTimeout(timer)
										uni.showToast({title: this.$t("modal.readSuccess")})
										
                    if (pole < 4) {
                      this.pole_value = pole
                    } else if (pole == 4) {
                      if (res.payload[9] == 0) this.pole_value = 4
                      else this.pole_value = 6
                    } else if (pole == 5) {
                      if (res.payload[9] == 0) this.pole_value = 5
                      else this.pole_value = 7
                    }

                    for (let i = 0; i < 10; i++) this.aera_sensi[i].value = res.payload[i]

                    this.img_url = this.imgs[this.pole_value]
										
                    log_upload('read', {
                      'dect_range': this.dect_range,
                      'car_value': this.car_value,
                      'pole_value': pole,
                      '98020201': res.payload
                    })
                  } 
                }
              })
            } else {
              this.pole_value = pole
              this.img_url = this.imgs[this.pole_value]
							
							clearTimeout(timer)
							uni.showToast({title: this.$t("modal.readSuccess")})

              log_upload('read', {
                  'dect_range': this.dect_range,
                  'car_value': this.car_value,
                  'pole_value': this.pole_value
              })
            }
					}
				})
			},
			//保存参数接口
			radar_save() {
				let that = this
				let _str = '76'
				let pole = 0

				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
				uni.showLoading({title: that.$t("modal.saving"), mask: true})

				if (that.pole_value == 6) pole = 4
				else if (that.pole_value == 7) pole = 5
				else pole = that.pole_value

				_str = _str + int_to2hex((that.dect_range * 10) & 0x00000000000000ff) +
					int_to2hex(pole & 0x00000000000000ff) + int_to2hex(that.car_value)
				
        bt.send(_str, 0x76).then(res => {
					if (!res.error) {
						clearTimeout(timer)
						uni.hideLoading()
						
            if (store.state.product_info.sf > 1.6) {
              let conf_str = '88'

							for (let i = 0; i < 9; i++) that.aera_sensi[i].value = 0x0A

              if (that.pole_value == 4 || that.pole_value == 5) {
								that.aera_sensi[9].value = 0
							}
              else if(that.pole_value == 6 || that.pole_value == 7)  {
								that.aera_sensi[2].value = 0x2A
								that.aera_sensi[9].value = 1
							}

              for (let i = 0; i < 10; i++) conf_str = conf_str + int_to2hex(that.aera_sensi[i].value & 0xFF)

							timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 3000)
							uni.showLoading({title: that.$t("modal.saving"), mask: true})

              bt.send(conf_str, 0x88).then(res => {
                if (!res.error) {
                  bt.send('77020201', 0x77).then(res => {
                    if (!res.error) {
                      let _data = res.payload
                      bt.send("98020201", 0x98).then(res => {
                        if (!res.error) {
                          if (res.payload.length == 10) {
														clearTimeout(timer)
														uni.hideLoading()
														
                            log_upload('read', {
                              '77020201': _data,
                              '98020201': res.payload,
                            })

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
                          }
                        }
                      })
                    }
                  })
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
								  'pole_value': that.pole_value,
								  'car_value': that.car_value
								})
            }
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
										let timer = setTimeout(() => {uni.showToast({title: that.$t("config.btnCont.btnUp")})}, 1000)
										uni.showLoading({title: that.$t("config.studyCont.text3"), mask: true})
										
										bt.send('660A0A06', 0x66).then(res => {
											if (!res.error) {
												clearTimeout(timer)
												setTimeout(() => {
													let timer = setTimeout(() => {uni.showToast({title: that.$t("config.btnCont.btnUp")})}, 1000)
										      bt.send('66020204', 0xFF).then(res => {
										        if (!res.error) {
															clearTimeout(timer)
															uni.hideLoading()
															
															log_upload('read', {'type': 'env para', 'data': bytesToAsciiString(res.payload)})
															
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
										      })
												}, 2000)
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
				let timer = null
				
				that.study_entry = 0
				
				uni.showModal({
					title: that.$t("modal.notice"),
					content: that.$t("config.studyCont.text6"),
					confirmText: that.$t("modal.confirmText"),
					cancelText: that.$t("modal.cancelText"),
					success(res) {
						if (res.confirm) {
							timer = setTimeout(() => {uni.showToast({title: that.$t("config.studyCont.text11")})}, 1000)
							uni.showLoading({title: that.$t("config.studyCont.text7"), mask: true})

							bt.send('660A0A04', 0x66).then(res => {
								if (!res.error) {
									clearTimeout(timer)
									
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
																	let timer = setTimeout(() => {uni.showToast({title: that.$t("config.studyCont.text11")})}, 1000)
																	uni.showLoading({title: that.$t("config.studyCont.text7"), mask: true})

																	bt.send('66181800', 0x66).then(res => {
																		if (!res.error) {
																			clearTimeout(timer)
																			
																			setTimeout(() => {
																				uni.hideLoading()
																				uni.showModal({
																					title: that.$t("modal.studyFinish"),
																					confirmText: that.$t("modal.confirmText"),
																					cancelText: that.$t("modal.cancelText"),
                                          success:(res)=>{
                                            if(res.confirm) {
																							let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
																							
                                              bt.send("87020201", 0x87).then(res => {
                                                if (!res.error) {
																									if (res.payload.length == 10) {
																										clearTimeout(timer)

																										let Human_Vehicle = res.payload[0]
																										let Traffic_Direction = res.payload[1]
																										let Relay_Status = res.payload[2]
																										
																										let radarSensitivity = res.payload[3]
																										let delayDropTime = res.payload[4]/10
																										let proximityNoDetect = res.payload[5]/10
																										let leftNoDetectWidth = res.payload[6]/10
																										let rightNoDetectWidth = res.payload[7]/10
																										let leftDetectWidth = res.payload[8]/10
																										let rightDetectWidth = res.payload[9]/10

																										if ((leftNoDetectWidth + rightNoDetectWidth) > 1.0) {
																										  uni.showModal({
																										    title: that.$t("config.studyEndNotice"),
																										    confirmText: that.$t("modal.confirmText"),
																										    cancelText: that.$t("modal.cancelText"),
																										  });
																										}
																										
																									  log_upload('read', {
																									    'Human/Vehicle Distinction': Human_Vehicle,
																									    'Traffic Direction': Traffic_Direction,
																									    'Relay Status': Relay_Status,
																									
																									    'radarSensitivity': radarSensitivity,
																									    'delayDropTime': delayDropTime,
																									    'proximityNoDetect': proximityNoDetect,
																									    'leftNoDetectWidth': leftNoDetectWidth,
																									    'rightNoDetectWidth': rightNoDetectWidth,
																									    'leftDetectWidth': leftDetectWidth,
																									    'rightDetectWidth': rightDetectWidth,
																									  })

																										if (that.pole_value == 0 || that.pole_value == 1) {
																											let _str = '86'
																											
																											_str = _str + int_to2hex((Human_Vehicle) & 0x00000000000000ff)
																											_str = _str + int_to2hex((Traffic_Direction) & 0x00000000000000ff)
																											_str = _str + int_to2hex((Relay_Status) & 0x00000000000000ff)
																											
																											_str = _str + int_to2hex((radarSensitivity) & 0x00000000000000ff)
																											_str = _str + int_to2hex((delayDropTime * 10) & 0x00000000000000ff)
																											_str = _str + int_to2hex((proximityNoDetect * 10) & 0x00000000000000ff)
																											
																											if (that.pole_value == 0) {
																												_str = _str + int_to2hex((0 * 10) & 0x00000000000000ff)
																												_str = _str + int_to2hex((0.3 * 10) & 0x00000000000000ff)
																											} else if (that.pole_value == 1) {
																												_str = _str + int_to2hex((0.3 * 10) & 0x00000000000000ff)
																												_str = _str + int_to2hex((0 * 10) & 0x00000000000000ff)
																											}
																											
																											_str = _str + int_to2hex((leftDetectWidth * 10) & 0x00000000000000ff)
																											_str = _str + int_to2hex((rightDetectWidth * 10) & 0x00000000000000ff)
																											
																											bt.send(_str, 0x86).then(res => {
																												if (timer) clearTimeout(timer)
																											})
																										}
																									}
                                                }
                                              })
                                            }
                                          },
																				});
																			}, 2000)
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
								}
							})
						}
					}
				})
			},
			radar_reset() {
				let that = this
				uni.showModal({
					title: that.$t("aconfig.modal.notice"),
					confirmText: that.$t("aconfig.modal.confirm"),
					cancelText: that.$t("aconfig.modal.cancel"),
					content: that.$t("aconfig.modal.restore"),
					success(res) {
						if (res.confirm) {
			        let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
			        uni.showLoading({title: that.$t("aconfig.modal.setting"), mask: true})
							
							bt.send("66020202", 0x66).then(res => {
								if (!res.error) {
									clearTimeout(timer)
									uni.showToast({title: that.$t("aconfig.modal.restoresuccess")})
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