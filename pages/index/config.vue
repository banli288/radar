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
  import {
    updatePageTitle
  } from '@/common/in18-helper.js'
  import store from '@/store/index.js'
  import {
    hex2int,
    int_to2hex,
    radar_recv,
    radar_tx_data,
    send_data,
    hexStringToByteArray,
    extractWithWrapper
  } from '@/tools/send.js'
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        pole_value: 5,
        car_value: 1,

        dect_range: 1.0,

        // connect_state: false,
        study_step: 0,

        img_url: "",

        timer1: null,
        timer2: null,

        study_master: 1, //1:保存参数；2：抬杆背景学习；3：杆起落学习

        cmd_tout_id: 0, //1-读取参数，2-保存参数，3-抬杆背景，4-杆起落超时
        cmd_tout_cnt: 0,
        para_read_enable: false,
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
        success() {
        }
      })

      this.timer = setTimeout(this.timer_handle, 100)
      this.img_url = this.imgs[this.pole_value]

      if (store.state.connect_state == true) {
        setTimeout(() => {
          this.para_read_enable = true
        }, 200)
      }
    },
    onHide() {
	 clearTimeout(this.timer)
    },
    onUnload() {
	 clearTimeout(this.timer)
    },
    methods: {
      set_tout(id, cnt) {
        this.cmd_tout_id = id
        this.cmd_tout_cnt = cnt
      },
      clear_tout_id() {
        this.cmd_tout_id = 0
      },
      clear_tout_cnt() {
        uni.hideLoading()
        this.cmd_tout_cnt = 0
      },
      clear_tout() {
        this.clear_tout_id()
        this.clear_tout_cnt()
      },
      //超时判断，同首页，此处不做详细注释
      run_tout() {
        if (this.cmd_tout_cnt > 1) {
          this.cmd_tout_cnt--
        } else if (this.cmd_tout_cnt == 1) {
          this.clear_tout_cnt()

          switch (this.cmd_tout_id) {
            case 1: {
              uni.showModal({
                title: this.$t("modal.notice"),
                content: this.$t("config.btnCont.btnRead"),
                confirmText: this.$t("modal.confirmText"),
                cancelText: this.$t("modal.cancelText"),
              })
              this.clear_tout_id()
            }
            break;
            case 2: {
              uni.showModal({
                title: this.$t("modal.notice"),
                content: this.$t("config.btnCont.btnSave"),
                confirmText: this.$t("modal.confirmText"),
                cancelText: this.$t("modal.cancelText"),
              })
              this.clear_tout_id()
            }
            break;
            case 3: {
              uni.showModal({
                title: this.$t("modal.notice"),
                content: this.$t("config.btnCont.btnUp"),
                confirmText: this.$t("modal.confirmText"),
                cancelText: this.$t("modal.cancelText"),
              })
              this.clear_tout_id()
            }
            break;
            case 4: {
              uni.showModal({
                title: this.$t("modal.notice"),
                content: this.$t("config.btnCont.btnDown"),
                confirmText: this.$t("modal.confirmText"),
                cancelText: this.$t("modal.cancelText"),
              })
              this.clear_tout_id()
            }
            break;
          }
        }
      },
      change(e) {
        this.dect_range = e.detail.value
      },
      change_pole(e) {
        console.log('ces', e)
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
        this.send_cmd(radar_tx_data('77020201'))
        this.set_tout(1, 30)
      },
      //保存参数接口
      radar_save() {
        let _str = '76'
        uni.showLoading({
          title: this.$t("modal.saving")
        })
        _str = _str + int_to2hex((this.dect_range * 10) & 0x00000000000000ff) +
          int_to2hex(this.pole_value & 0x00000000000000ff) + int_to2hex(this.car_value)
        console.log(_str)
        this.send_cmd(radar_tx_data(_str))
        this.study_step = 0
        this.set_tout(2, 30)
      },
      //抬杆学习
      radar_up_study() {
        this.study_master = 2
        this.radar_study()
      },
      //赶起落学习指令
      radar_down_study() {
        this.study_master = 3
        this.radar_study2()
      },
      //定时任务，轮询蓝牙接收数据，解析和更新显示
      timer_handle() {
        let recv_buf_tmp = '';

        //这是页面刷新是para_read_enable置为true，定时器启动读取一次参数
        if (this.para_read_enable == true) {
          this.radar_read()
          this.para_read_enable = false
        }

        //超时判断
        this.run_tout()

        //以下与首页同理，后面的页面定时器任务都是这个框架
        if (store.state.time_out > 0) {
          store.commit('sub_time_out');
        } else {
          recv_buf_tmp = store.state.recv_buf;
          store.commit('clear_recv_buf')
        }

        if ((recv_buf_tmp != "") && (recv_buf_tmp != null)) {
          let data_mid = extractWithWrapper(recv_buf_tmp, "ab", "5a")
          if ((data_mid != "") && (data_mid != null)) {
            let recv_data = radar_recv(data_mid)

            console.log('<res>', recv_data, data_mid)

            if (recv_data.length >= 2 && (recv_data.length % 2 == 0)) {
              let int_arr = hexStringToByteArray(recv_data)

              //保存成功，进行背景学习
              if ((recv_data == '764f4b') && (this.study_step == 0)) {
                this.clear_tout()
                this.study_master = 1
                this.radar_study1()
              }
              //收到抬杆学习完成指令，进行起落学习
              else if ((recv_data == '664f4b') && (this.study_step == 1)) {
                console.log('step1', this.study_step, 'finish')
                this.clear_tout_id()
                if (this.study_master == 1) {
                  setTimeout(() => {
                    clearTimeout(this.timer1)
                    uni.hideLoading()
                    this.radar_study2()
                  }, 4000)
                } else if (this.study_master == 2) {
                  this.study_step = 0
                  this.study_master = 1
                  setTimeout(() => {
                    clearTimeout(this.timer1)
                    uni.hideLoading()
                    uni.showToast({
                      title: this.$t("modal.upStudyFinish")
                    })
                  }, 5000)
                }
              }
              //收到起落学习完成指令，结束学习
              else if ((recv_data == '664f4b') && (this.study_step == 2)) {
                console.log('step2', this.study_step, 'finish')
                this.clear_tout_id()
              } else if ((recv_data == '664f4b') && (this.study_step == 3)) {
                console.log('step3', this.study_step, 'finish')
                this.clear_tout_id()
                this.study_step = 0

                if (this.study_master == 1) {
                  setTimeout(() => {
                    clearTimeout(this.timer2)
                    uni.hideLoading()
                    uni.showToast({
                      title: this.$t("modal.studyFinish")
                    })
                  }, 5000)
                } else if (this.study_master == 3) {
                  setTimeout(() => {
                    clearTimeout(this.timer2)
                    uni.hideLoading()
                    uni.showToast({
                      title: this.$t("modal.dnstudyFinish")
                    })
                  }, 5000)
                }
              }
              //没有学习指令，解析参数读取
              else if (int_arr[0] == 0x77) {
                this.dect_range = int_arr[1] / 10
                this.pole_value = int_arr[2]
                this.car_value = int_arr[3]
                this.img_url = this.imgs[this.pole_value]
                this.clear_tout()
                uni.showToast({
                  title: this.$t("modal.readSuccess")
                })
              }
			  this.$forceUpdate()
            }
          }
        }

        this.systick++
        this.timer = setTimeout(() => {
          this.timer_handle()
        }, 100)
      },
      //启动背景学习，参考协议文档
      radar_study() {
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
                        that.study_step = 1
                        that.send_cmd(radar_tx_data('660A0A06'))
                        that.timer1 = setTimeout(() => {
                          if (that.study_step == 0) {
                            uni.hideLoading()
                            uni.showModal({
                              title: that.$t("config.studyCont.text4"),
                              confirmText: that.$t("modal.confirmText"),
                              cancelText: that.$t("modal.cancelText"),
                            });
                          }
                        }, 40000)
                      }
                    })
                  }
                }
              })
            }
          }
        })
      },
      //背景学习阶段1，参考协议文档
      radar_study1() {
        let that = this
        uni.showModal({
          title: that.$t("modal.notice"),
          content: that.$t("config.studyCont.text5"),
          confirmText: that.$t("modal.confirmText"),
          cancelText: that.$t("modal.cancelText"),
          success(res) {
            if (res.confirm) {
              that.radar_study()
            }
          }
        })
      },
      //背景学习阶段2，参考协议文档
      radar_study2() {
        let that = this
        uni.showModal({
          title: that.$t("modal.notice"),
          content: that.$t("config.studyCont.text6"),
          confirmText: that.$t("modal.confirmText"),
          cancelText: that.$t("modal.cancelText"),
          success(res) {
            if (res.confirm) {
              that.study_step = 2
              that.send_cmd(radar_tx_data('660A0A04'))
              uni.showLoading({
                title: that.$t("config.studyCont.text7")
              })
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
                        that.radar_study3()
                      }, 2000)
                    }
                  }
                })
              }, 2000)
            }
          }
        })
      },
      //背景学习阶段3，参考协议文档
      radar_study3() {
        let that = this
        uni.showModal({
          title: that.$t("modal.notice"),
          content: that.$t("config.studyCont.text9"),
          confirmText: that.$t("modal.confirmText1"),
          cancelText: that.$t("modal.cancelText"),
          success(res) {
            if (res.confirm) {
              that.send_cmd(radar_tx_data('66181800'))
              that.study_step = 3
              uni.showLoading({
                title: that.$t("config.studyCont.text10"),
                mask: true,
                success() {
                  that.timer2 = setTimeout(() => {
                    if (that.study_step == 3) {
                      that.study_step = 0
                      uni.hideLoading()
                      uni.showModal({
                        title: that.$t("config.studyCont.text11"),
                        confirmText: that.$t("modal.confirmText"),
                        cancelText: that.$t("modal.cancelText"),
                      });
                    }
                  }, 40000)
                }
              })
            }
          }
        })
      },
      //数据发送接口
      send_cmd(cmd) {
        var data = {
          deviceId: store.state.device_info.deviceId,
          serviceId: store.state.device_info.serviceId,
          characteristicId: store.state.device_info.w_characteristicId,
          mode: 'hex',
          dat: cmd,
        }
        send_data(data)
      }
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