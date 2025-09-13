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
  import {
    ab2hex,
    radar_crc,
    radar_tx_data,
    radar_recv,
    int_to2hex,
    bytesToHexString,
    extractWithWrapper,
    bufferToHex,
    send_data,
    hexStringToByteArray
  } from '@/tools/send.js'
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

        cmd_id: 0,
        cmd_tout: 20,

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
    onUnload() {
      //离开页面清除定时器
      clearTimeout(this.timer)
    },
    onShow() {
      //设置不息屏
      uni.setKeepScreenOn({
        keepScreenOn: true,
        success() {
          console.log("set_keep_screen_on")
        }
      })

      //启动定时器任务
      this.timer = setTimeout(this.timer_handle, 100)
      updatePageTitle()

      //更新显示按钮名称
      if (store.state.connect_state == true) {
        this.ble_btn_name = "disconnect"
      } else {
        this.ble_btn_name = "connect"
      }
    },
    onHide() {
      //离开首页清除定时器并关闭蓝牙发现
      clearTimeout(this.timer)
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

      //蓝牙发送接口
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
      //定时器任务，查询蓝牙接收数据，并进行协议解析和显示更新
      timer_handle() {
        let recv_buf_tmp = '';

        //根据命令id进行超时判断，例如发送了一条指令A，超时未收到响应弹窗超时
        if (this.cmd_id != 0) {
          if (this.cmd_tout > 1) {
            this.cmd_tout--
          } else if (this.cmd_tout == 1) {
            uni.hideLoading()
            uni.showModal({
              title: this.$t("modal.notice"),
              content: this.$t("modal.readTineout"),
              confirmText: this.$t("modal.confirmText"),
              cancelText: this.$t("modal.cancelText"),
            })

            this.cmd_tout = 0
            this.cmd_id = 0
          }
        }

        //判断蓝牙是否接收到了数据
        if (store.state.time_out > 0) {
          store.commit('sub_time_out');
        } else {
          recv_buf_tmp = store.state.recv_buf;
          store.commit('clear_recv_buf')
        }

        //收到数据
        if ((recv_buf_tmp != "") && (recv_buf_tmp != null)) {
          //根据协议头尾定位数据帧
          let data_mid = extractWithWrapper(recv_buf_tmp, "ab", "5a")
          //收到了符合协议的数据
          if ((data_mid != "") && (data_mid != null)) {
            //校验数据并返回有效数据
            let recv_data = radar_recv(data_mid)

            console.log('<res:>', recv_data, data_mid)

            //收到的数据单位一定是字节
            if (recv_data.length >= 2 && (recv_data.length % 2 == 0)) {
              let int_arr = hexStringToByteArray(recv_data)

              //这是关闭坐标显示的指令响应，应对链接的设备之前开了坐标显示影响接收其他数据
              if (recv_data == "664f4b") {
                //关闭坐标显示成功返回，读取版本信息指令
                this.cmd_id = 2
                this.cmd_tout = 20
                this.send_cmd(radar_tx_data('89020201'))
              }

              //收到版本读取指令的响应--版本信息，根据协议解析并赋值页面变量更新显示
              if (int_arr[0] == 0x89) {
                this.cmd_id = 0
                this.cmd_tout = 0

                this.product_type = int_arr[1]
                this.product_SN = int_arr[2].toString(16) + int_arr[3].toString(16) +
                  int_arr[4].toString(16) + int_arr[5].toString(16) + int_arr[6].toString(16)
                this.product_hd = int_arr[7] + int_arr[8] / 10
                this.product_sf = int_arr[9] + int_arr[10] / 10

                //弹窗提示读取成功--链接成功
                uni.hideLoading()
                uni.showToast({
                  title: this.$t("modal.conSuccess")
                })

                //改变按钮名字
                this.ble_btn_name = "disconnect"

                //更新蓝牙列表的连接状态
                this.ble_con_state_list[this.ble_list.indexOf(store.state.device_info.deviceId)] = 'connected'
              }
            }
          }
        }

        //心跳
        this.systick++
        this.timer = setTimeout(() => {
          this.timer_handle()
        }, 100)
      },
      //读取版本信息
      read_product() {
        this.send_cmd(radar_tx_data('66010100'))
        this.cmd_id = 1
        this.cmd_tout = 20
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
                                              console.log('device_info:', store.state
                                                .device_info)

                                              //找到写ID，延时500ms通过写ID写入读取版本信息指令
                                              setTimeout(() => {
                                                that.read_product()
                                              }, 500)
                                            }
                                          }

                                          //注册蓝牙监听事件
                                          uni.onBLECharacteristicValueChange(function(res) {
                                            let tmp = bufferToHex(res.value)
                                            store.commit('add_recv_buf', tmp)
                                            console.log('<listen>:', tmp)
                                          })
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