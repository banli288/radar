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
            <view :style="dynamicFontStyle" class="unit_size">{{item.limit[5 - item.value].text}}
            </view>
            <view :style="dynamicFontStyle" class="unit_size" style="margin-right: 10px;">{{item.unit}}</view>
            <view :style="dynamicFontStyle" class="ld_content">
              <uni-data-select class="unselect" v-model="item.value" :localdata="item.limit" :clear="false"
                @change="chagnge_lmd"></uni-data-select>
            </view>
          </view>
        </view>
        <view class="content" v-else>
          <view :style="dynamicFontStyle" class="name_size">{{item.name}}</view>
          <view :style="dynamicFontStyle" class="config2_unit_v1">
            <view :style="dynamicFontStyle" class="unit_size">{{item.text}}</view>
            <view :style="dynamicFontStyle" class="unit_size">{{item.value}}</view>
            <view :style="dynamicFontStyle" class="unit_size" style="margin-right: 10px;">{{item.unit}}</view>
            <view class="big-nb">
              <uni-number-box v-model="item.value" background="#0055ff" color="#fff" :min="item.limit[0]" width="25"
                :max="item.limit[1]" :step="item.step">
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
  export default {
    data() {
      return {
        cfg1_value: [5, 0, 0],

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
      this.timer = setTimeout(this.timer_handle, 100)

      uni.setKeepScreenOn({
        keepScreenOn: true,
        success() {
          console.log("set_keep_screen_on")
        }
      })

      if (store.state.connect_state == true) {
        setTimeout(() => {
          this.para_read_enable = true
        }, 500)
      }
    },
    onHide() {
      clearTimeout(this.timer)
    },
    onUnload() {
      clearTimeout(this.timer)
    },
    methods: {
      chagnge_lmd(e) {
        this.config2[0].value = e
      },
      //读取参数指令
      radar_read() {
        let that = this

        this.send_cmd(radar_tx_data("87020201"))
        this.set_cmd_id(1)
        uni.showLoading({
          title: that.$t("aconfig.modal.reading")
        })
      },
      //保存参数指令，将变量的指根据协议组帧送给蓝牙发送
      radar_save() {
        let that = this
        let _str = '86'

        // _str = _str + int_to2hex((this.config1[0].value) & 0x00000000000000ff)
        // _str = _str + int_to2hex((this.config1[1].value) & 0x00000000000000ff)
        // _str = _str + int_to2hex((this.config1[2].value) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.cfg1_value[0]) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.cfg1_value[1]) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.cfg1_value[2]) & 0x00000000000000ff)

        _str = _str + int_to2hex((this.config2[0].value) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.config2[1].value * 10) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.config2[2].value * 10) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.config2[3].value * 10) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.config2[4].value * 10) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.config2[5].value * 10) & 0x00000000000000ff)
        _str = _str + int_to2hex((this.config2[6].value * 10) & 0x00000000000000ff)

        this.send_cmd(radar_tx_data(_str))
        this.set_cmd_id(2)
        uni.showLoading({
          title: that.$t("aconfig.modal.saving")
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
              that.send_cmd(radar_tx_data("66141400"))
              that.set_cmd_id(3)
              uni.showLoading({
                title: that.$t("aconfig.modal.restarting")
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
              that.send_cmd(radar_tx_data("66020202"))
              that.set_cmd_id(4)
              uni.showLoading({
                title: that.$t("aconfig.modal.restoring"),
              })
            }
          }
        })
      },
      //更新指令id，用于该id响应的超时判断
      set_cmd_id(cmd) {
        this.cmd_id = cmd
        this.cmd_tout = 30
      },
      //清除指令id，超时将不在判断，用于收到响应后执行
      clear_cmd_id() {
        uni.hideLoading()
        this.cmd_id = 0
        this.cmd_tout = 0
      },
      //定时任务，同其他页面
      timer_handle() {
        let recv_buf_tmp = '';
        let that = this

        if (this.para_read_enable == true) {
          this.radar_read()
          this.para_read_enable = false
        }

        //指令响应的超时判断
        if (this.cmd_tout > 1) {
          this.cmd_tout--
        } else if (this.cmd_tout == 1) {
          uni.hideLoading()
          switch (this.cmd_id) {
            case 1:
              uni.showModal({
                title: that.$t("aconfig.modal.notice"),
                confirmText: that.$t("aconfig.modal.confirm"),
                cancelText: that.$t("aconfig.modal.cancel"),
                content: that.$t("aconfig.modal.readingTout"),
              })
              break;
            case 2:
              uni.showModal({
                title: that.$t("aconfig.modal.notice"),
                confirmText: that.$t("aconfig.modal.confirm"),
                cancelText: that.$t("aconfig.modal.cancel"),
                content: that.$t("aconfig.modal.savingTout"),
              })
              break;
            case 3:
              uni.showModal({
                title: that.$t("aconfig.modal.notice"),
                confirmText: that.$t("aconfig.modal.confirm"),
                cancelText: that.$t("aconfig.modal.cancel"),
                content: that.$t("aconfig.modal.restartingTout"),
              })
              break;
            case 4:
              uni.showModal({
                title: that.$t("aconfig.modal.notice"),
                confirmText: that.$t("aconfig.modal.confirm"),
                cancelText: that.$t("aconfig.modal.cancel"),
                content: that.$t("aconfig.modal.restoreingTout"),
              })
              break;
          }
          this.clear_cmd_id()
        }

        if (store.state.time_out > 0) {
          store.commit('sub_time_out');
        } else {
          recv_buf_tmp = store.state.recv_buf;
          store.commit('clear_recv_buf')
        }

        if ((recv_buf_tmp != "") && (recv_buf_tmp != null)) {
          console.log('<data:>', recv_buf_tmp)

          let data_mid = extractWithWrapper(recv_buf_tmp, "ab", "5a")
          if ((data_mid != "") && (data_mid != null)) {
            let recv_data = radar_recv(data_mid)

            console.log('<res:>', recv_data, data_mid)

            if (recv_data.length >= 2 && (recv_data.length % 2 == 0)) {
              let int_arr = hexStringToByteArray(recv_data)

              //读取雷达高级参数返回
              if (int_arr[0] == 0x87) {
                if (int_arr.length == 11) {
                  // this.config1[0].value = int_arr[1]
                  // this.config1[1].value = int_arr[2]
                  // this.config1[2].value = int_arr[3]
                  this.cfg1_value[0] = int_arr[1]
                  this.cfg1_value[1] = int_arr[2]
                  this.cfg1_value[2] = int_arr[3]

                  this.config2[0].value = int_arr[4]
                  this.config2[1].value = int_arr[5] / 10
                  this.config2[2].value = int_arr[6] / 10
                  this.config2[3].value = int_arr[7] / 10
                  this.config2[4].value = int_arr[8] / 10
                  this.config2[5].value = int_arr[9] / 10
                  this.config2[6].value = int_arr[10] / 10

                  this.clear_cmd_id()
                  uni.showToast({
                    title: that.$t("aconfig.modal.readsuccess"),
                  })
                } else {
                  uni.showModal({
                    title: that.$t("aconfig.modal.notice"),
                    confirmText: that.$t("aconfig.modal.confirm"),
                    cancelText: that.$t("aconfig.modal.cancel"),
                    content: that.$t("aconfig.modal.readfail"),
                  })
                }
              }
              //收到保存成功指令的响应，给弹窗提示
              else if (recv_data == "864f4b") {
                this.clear_cmd_id()
                uni.showToast({
                  title: that.$t("aconfig.modal.savesuccess"),
                })
              }
              //收到重启成功指令的响应，给弹窗提示
              else if (recv_data == "664f4b") {
                if (this.cmd_id == 3) {
                  this.clear_cmd_id()
                  uni.showToast({
                    title: that.$t("aconfig.modal.restartsuccess"),
                  })
                }
                ////收到恢复出厂成功指令的响应，给弹窗提示
                else if (this.cmd_id == 4) {
                  this.clear_cmd_id()
                  uni.showToast({
                    title: that.$t("aconfig.modal.restoresuccess"),
                  })
                }
              }
            }
          }
        }

        this.systick++
        this.timer = setTimeout(() => {
          this.timer_handle()
        }, 100)
      },
      //发送接口
      send_cmd(cmd) {
        var data = {
          deviceId: store.state.device_info.deviceId,
          serviceId: store.state.device_info.serviceId,
          characteristicId: store.state.device_info.w_characteristicId,
          mode: 'hex',
          dat: cmd,
        }
        send_data(data)
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
        width: 246rpx;
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
    font-size: 12px;
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
    font-size: 20rpx !important;
  }

  /* 左右按钮 */
  .big-nb::v-deep .uni-numbox__minus,
  .big-nb::v-deep .uni-numbox__plus {
    width: 80rpx !important;
    height: 60rpx !important;
    line-height: 60rpx !important;
    font-size: 20rpx !important;
  }

  /* 中间输入框 */
  .big-nb::v-deep .uni-numbox__value {
    height: 60rpx !important;
    /* 高度 */
    line-height: 60rpx !important;
    /* 让文字垂直居中 */
    font-size: 20rpx !important;
    /* 字体大小 */
  }
</style>