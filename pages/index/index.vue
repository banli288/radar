<template>
  <view class="page">
    <view class="card img_box" style="margin-top: 20rpx">
      <!-- <image class="img_class" src="@/static/0.jpg"></image> -->
      <image mode="aspectFit" src="@/static/index1.png" />
      <button
        class="zh_btn"
        :class="{ active: isZhActive }"
        @click="swLang('zh')"
      >
        中文
      </button>
      <button
        class="en_btn"
        :class="{ active: isEnActive }"
        @click="swLang('en')"
      >
        English
      </button>
    </view>

    <view class="card row info">
      <view class="_row2_left">{{ $t("index.text1") }}</view>
      <view class="_row2_right">{{ isConnected ? "ZRD-803" : " " }}</view>
    </view>
    <view class="card row info">
      <view class="_row2_left">{{ $t("index.text2") }}</view>
      <view class="_row2_right">{{ isConnected ? "防砸雷达" : " " }}</view>
    </view>
    <view class="card row info">
      <view class="_row2_left">{{ $t("index.text3") }}</view>
      <view class="_row2_right">{{ isConnected ? prodSN : " " }}</view>
    </view>

    <view class="_center" style="margin-top: 30rpx">
      <button class="btn" hover-class="btn_hover" @click="btn_press()">
        {{ bleConName }}
      </button>
    </view>

    <view class="_center" v-if="isConnected">
      <button class="btn_close_ble" @click="close_radar_ble()">
        {{ $t("index.text9") }}
      </button>
    </view>

    <view class="_center">
      <view class="multiline-text">{{ $t("index.text6") }}</view>
    </view>

    <!-- 使用说明弹窗 -->
    <view class="notes" v-if="showNotes">
      <view class="notes_content" @click.stop="">
        <view class="card title">{{ $t("index.Notes.title") }}</view>
        <view class="list_item">
          <view
            style="padding: 5rpx; margin-bottom: 5rpx"
            v-for="(item, index) in notes"
            >{{ item }}</view
          >
        </view>
        <button style="width: 100%; color: blue" @tap="closeNotes">
          {{ $t("index.Notes.confirm") }}
        </button>
      </view>
    </view>

    <!-- 扫描蓝牙弹窗 -->
    <view class="dialog" v-if="showDialog" @click="closeDialog">
      <view class="dialog_content" @click.stop="">
        <view class="card title">{{ $t("index.text7") }}</view>
        <view class="list_item">
          <view
            class="card row"
            style="height: 75rpx; display: flex; justify-content: space-between"
            v-for="(item, index) in ble_name_list"
            :key="index"
            @tap="ble_connect(index)"
          >
            <view>{{ item }}</view>
            <view>{{ ble_rssi_list[index] }}</view>
          </view>
        </view>
        <view class="card">
          <button style="width: 100%" @tap="ble_list_refresh">
            {{ $t("index.text8") }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  updatePageTitle,
  updateTabBar,
  changeLanguage,
} from "../../common/in18-helper.js";
import store from "@/store/index.js";
import bt from "@/tools/BluetoothManager.js";
import eventBus from "../../tools/eventBus.js";
import { jlog, log_upload } from "../../tools/send.js";
import { get_production, close_ble } from "../../tools/radar_port.js";
import wsManager from "../../tools/wsManager.js";
export default {
  data() {
    return {
      showDialog: false,
      showNotes: true,

      product: {
        type: 0,
        SN: "",
        hd_ver: 1.01,
        sw_ver: 1.01,
      },

      ble_list: [],
      ble_name_list: [],
      ble_rssi_list: [],
      ble_con_state_list: [],

      currentLang: this.$i18n.locale,
    };
  },
  onLoad() {
    if (this.$mp.page.route === "pages/index/index") {
      updateTabBar();
    }
  },
  onShow() {
    uni.setKeepScreenOn({
      keepScreenOn: true, //设置不息屏
      success() {},
    });
    eventBus.on("ws:message", this.ws_recv_handler);
    updatePageTitle();
  },
  onUnload() {},
  onHide() {
    uni.hideLoading();
    uni.stopBluetoothDevicesDiscovery({});
    eventBus.off("ws:message", this.ws_recv_handler);
  },
  computed: {
    bleConName() {
      return this.$t(`index.bleBtnName.${this.getSearchBtnName}`);
    },
    isZhActive() {
      return this.$i18n.locale === "zh";
    },
    isEnActive() {
      return this.$i18n.locale === "en";
    },
    isEnglish() {
      return this.$i18n.locale === "en";
    },
    isConnected() {
      return store.state.connect_state;
    },
    prodSN() {
      return store.state.product_info.SN;
    },
    getSearchBtnName() {
      if (this.isConnected) return "disconnect";
      else return "connect";
    },
    radarType() {
      if (this.isConnected) {
        return this.$t("index.text0");
      } else return " ";
    },
    notes() {
      return [
        this.$t("index.Notes.line1"),
        this.$t("index.Notes.line2"),
        this.$t("index.Notes.line3"),
        this.$t("index.Notes.line4"),
        this.$t("index.Notes.line5"),
        this.$t("index.Notes.line6"),
        this.$t("index.Notes.line7"),
        this.$t("index.Notes.line8"),
        this.$t("index.Notes.line9"),
      ];
    },
  },
  methods: {
    ws_recv_handler(data) {
      if (data.msg.cmd == "read") {
        wsManager.send({
          type: "p2p",
          toUserId: data.fromUserId,
          msg: { param: "123312" },
        });
      }
    },
    swLang(lang) {
      changeLanguage(lang);
      this.currentLang = lang;
    },

    ble_list_refresh() {
      this.ble_list = [];
      this.ble_name_list = [];
      this.ble_rssi_list = [];
      this.ble_con_state_list = [];
      this.btn_press();
    },

    async read_product() {
      const res = await get_production();
      if (!res) return null;

      this.product = res;
      this.ble_con_state_list[
        this.ble_list.indexOf(store.state.device_info.deviceId)
      ] = "connected";

      store.commit("set_product", res);

      // wsManager.connect('ws://localhost/ws')

      log_upload("read", {
        product_type: store.state.product_info.type,
        product_SN: store.state.product_info.SN,
        product_hd: store.state.product_info.hd_ver,
        product_sf: store.state.product_info.sw_ver,
        MAC: store.state.device_info.deviceId,
        location: store.state.location,
      });

      return { status: "success" };
    },
    closeDialog() {
      this.showDialog = false;
    },
    closeNotes() {
      this.showNotes = false;
    },
    async close_radar_ble() {
      let that = this;
      uni.showModal({
        title: that.$t("modal.notice"),
        content: that.$t("modal.CloseRadarBLE"),
        confirmText: that.$t("modal.confirmText"),
        cancelText: that.$t("modal.cancelText"),
        async success(res) {
          if (res.confirm) {
            uni.showLoading({
              title: that.$t("modal.setting"),
            });
            const res_close = await close_ble();
            uni.hideLoading();
            if (res_close) {
              uni.showToast({ title: that.$t("modal.seted") });
            } else {
              if (that.isConnected == false) {
                uni.showToast({ title: that.$t("modal.seted") });
              }
            }
          }
        },
      });
    },
    //按钮按钮，判断连接状态，执行搜索设备或者断开连接
    btn_press() {
      let that = this;
      if (store.state.connect_state == false) {
        that.ble_search();
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
                  store.commit("ble_con_state_update", false);
                  uni.showToast({
                    title: that.$t("modal.closeBle"),
                  });
                },
              });
            }
          },
        });
      }
    },
    //搜索蓝牙设备
    ble_search() {
      var that = this;
      that.ble_list = [];
      that.ble_name_list = [];
      that.ble_rssi_list = [];
      that.ble_con_state_list = [];
      uni.showLoading({
        title: that.$t("modal.searchingDev"),
        mask: true,
        success() {
          let timer = setTimeout(() => {
            uni.hideLoading();
            // uni.showModal({title: "搜索超时，暂未发现雷达设备，正在后台继续搜索"})
          }, 5000);
          setTimeout(() => {
            uni.openBluetoothAdapter({
              success() {
                uni.startBluetoothDevicesDiscovery({
                  allowDuplicatesKey: true,
                  success() {
                    uni.onBluetoothDeviceFound(function (res) {
                      //根据名字匹配雷达设备
                      if (
                        res.devices[0].name.indexOf("XHJ") != -1 ||
                        res.devices[0].name.indexOf("MW60S") != -1 ||
                        res.devices[0].name.indexOf("ZRD") != -1
                      ) {
                        uni.hideLoading();
                        clearTimeout(timer);
                        if (
                          that.ble_list.indexOf(res.devices[0].deviceId) == -1
                        ) {
                          that.showDialog = true;
                          //发现新的蓝牙设备,加入设备列表
                          that.ble_list.push(res.devices[0].deviceId);
                          // that.ble_name_list.push(res.devices[0].name)
                          // that.ble_name_list.push('ZRD-803-' + res.devices[0].deviceId)
                          that.ble_name_list.push("ZRD-803");
                          that.ble_rssi_list.push(res.devices[0].RSSI);
                          that.ble_con_state_list.push("disconnected");
                        }
                      }
                    });
                  },
                  fail(res) {
                    uni.hideLoading();
                    jlog("discov err", res);
                  },
                });
              },
              fail(res) {
                uni.hideLoading();
                uni.showModal({
                  title: that.$t("modal.openBleErr"),
                  content: JSON.stringify(res),
                  confirmText: that.$t("modal.confirmText"),
                  cancelText: that.$t("modal.cancelText"),
                  success(res) {
                    if (res.confirm) {
                      uni.reLaunch({
                        url: "/pages/index/index",
                      });
                    }
                  },
                });
              },
            });
          }, 100);
        },
      });
    },
    //连接设备
    async ble_connect(index) {
      let that = this;
      let deviceId = this.ble_list[index];

      let timer = setTimeout(() => {
        uni.showModal({ content: "连接超时" });
      }, 10000);
      uni.showLoading({ title: that.$t("modal.connecting"), mask: true });

      uni.createBLEConnection({
        deviceId: deviceId,
        timeout: 10000,
        async success() {
          setTimeout(() => {
            uni.stopBluetoothDevicesDiscovery({
              async success() {
                uni.getBLEDeviceServices({
                  deviceId: deviceId,
                  async success(res) {
                    for (let item of res.services) {
                      if (item.isPrimary) {
                        let serviceId = item.uuid;
                        if (item.uuid.indexOf("0000AE3") != -1) {
                          uni.getBLEDeviceCharacteristics({
                            deviceId: deviceId,
                            serviceId: serviceId,
                            async success(res) {
                              for (let item of res.characteristics) {
                                if (item.properties.notify) {
                                  let characteristicId = item.uuid;
                                  uni.notifyBLECharacteristicValueChange({
                                    deviceId: deviceId,
                                    serviceId: serviceId,
                                    characteristicId: characteristicId,
                                    state: true,
                                    async success() {
                                      that.showDialog = false;

                                      //存储ID信息
                                      let obj = {
                                        deviceId: deviceId,
                                        serviceId: serviceId,
                                        r_characteristicId: characteristicId,
                                      };

                                      //遍历查找写ID
                                      for (let item of res.characteristics) {
                                        if (item.properties.write) {
                                          obj.w_characteristicId = item.uuid;
                                          store.commit("set_device_info", obj);
                                          // jlog('LOG', 'device_info:', store.state.device_info)

                                          //找到写ID，延时500ms通过写ID写入读取版本信息指令
                                          setTimeout(async () => {
                                            clearTimeout(timer);

                                            const res =
                                              await that.read_product();
                                            if (res != null) {
                                              uni.showToast({
                                                title: that.$t("index.text12"),
                                              });
                                            } else {
                                              uni.showModal({
                                                title: this.$t("modal.notice"),
                                                confirmText:
                                                  this.$t("modal.confirmText"),
                                                cancelText:
                                                  this.$t("modal.cancelText"),
                                                content:
                                                  this.$t("modal.readTineout"),
                                              });
                                            }
                                          }, 500);
                                        }
                                      }
                                    },
                                  });
                                }
                              }
                            },
                            fail() {
                              jlog("read character fail");
                            },
                          });
                        }
                      }
                    }
                  },
                });
              },
            });
          }, 2000);
        },
        fail(res) {
          jlog(res);
          uni.hideLoading();
          if (store.state.connect_state == false) {
            uni.showModal({
              title: that.$t("modal.notice"),
              content: that.$t("modal.connectErr"),
              confirmText: that.$t("modal.confirmText"),
              cancelText: that.$t("modal.cancelText"),
            });
          } else {
            uni.showModal({
              title: that.$t("modal.notice"),
              content: that.$t("modal.Bleconnected"),
              confirmText: that.$t("modal.confirmText"),
              cancelText: that.$t("modal.cancelText"),
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../common.scss";

.info {
  padding: 20rpx;
  font-size: 35rpx;
}

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
    background: linear-gradient(180deg, #3478f6, #ffffff);
    position: relative;
    z-index: 1;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35rpx;
      background-color: #6cff78;
      font-size: 24rpx;
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

.notes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(129, 129, 129, 0.5);

  .notes_content {
    width: 85%;
    height: 1130rpx;
    background: linear-gradient(180deg, #ffffff, #ffffff);
    position: relative;
    z-index: 1;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60rpx;
      font-size: 36rpx;
      border-bottom: 1px solid #000000; /* 设置横线的粗细、样式和颜色 */
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
    width: 100%;
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

.btn_close_ble {
  height: 60rpx;
  line-height: 60rpx;
  font-size: 14px;
  margin: 0px;
  width: 60%;
  background-color: #aaaaff;
  color: white;
}

._center {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

._herf {
  font-size: 24rpx;
  color: #3478f6;
}
</style>