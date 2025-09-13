<template>
  <view>
    <view>
      <view style="margin: 5px; padding: 5px 5px; display: flex; justify-content: space-between; align-items: center;">
        <view>{{$t("debug.recv")}}</view>
        <view style="display: flex; flex-direction: row; align-items: center;">
          <view style="margin-right: 10px;">{{$t("debug.format")}}</view>
          <uni-data-checkbox :localdata="recv_format_box" v-model="recv_format"></uni-data-checkbox>
        </view>
      </view>

      <scroll-view scroll-y="true" class="scroll_view1" :scroll-top="scrollTop">
        <text id="scrollContainer" selectable="true" class="view_text">{{recv_text}}</text>
      </scroll-view>

      <view style="margin: 5px; padding: 5px 5px; display: flex; justify-content: space-between; align-items: center;">
        <view>{{$t("debug.send")}}</view>
        <view style="display: flex; flex-direction: row; align-items: center;">
          <view style="margin-right: 10px;">{{$t("debug.format")}}</view>
          <uni-data-checkbox :localdata="send_format_box" v-model="send_format"></uni-data-checkbox>
        </view>
      </view>

      <scroll-view scroll-y="true" class="scroll_view2" :scroll-top="0">
        <textarea v-model="send_text" class="view_text">{{send_text}}</textarea>
      </scroll-view>

      <view style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
        <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
          @tap="send_btn">{{$t("debug.btnSend")}}</button>
        <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
          @tap="recv_clear">{{$t("debug.btnClearSend")}}</button>
        <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
          @tap="send_clear">{{$t("debug.btnClearRecv")}}</button>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getCurrentTimeStr,
    send_data,
    extractWithWrapper,
    hexStringToByteArray,
    radar_recv,
    str_arr_toascii
  } from "@/tools/send.js"
  import store from '@/store/index.js'
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        recv_text: "",
        recv_format: 0,
        recv_format_box: [{
            text: "HEX",
            value: 0
          },
          {
            text: "ASCII",
            value: 1
          },
        ],

        send_text: "56AB89020201715AA5",
        send_format: 0,
        send_format_box: [{
            text: "HEX",
            value: 0
          },
          {
            text: "ASCII",
            value: 1
          },
        ],

        scrollTop: 0
      }
    },
    onShow() {
      this.timer = setTimeout(this.timer_handle, 100)

      uni.setKeepScreenOn({
        keepScreenOn: true,
        success() {
          console.log("set_keep_screen_on")
        },
      })
    },
    onHide() {
      clearTimeout(this.timer)
    },
    onUnload() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    computed: {
      ...mapState(['connect_state']),

      disSend() {
        return this.$t("debug.disSend")
      },
      disRecv() {
        return this.$t("debug.disRecv")
      },
    },
    methods: {
      scrollToBottom() {
        uni.createSelectorQuery()
          .in(this)
          .select('#scrollContainer')
          .boundingClientRect(res => {
            this.scrollTop = res.height // 将scrollTop设置为内容高度
            //console.log("height:", this.scrollTop)
          })
          .exec()
      },
      send_btn() {
        let str = this.send_text.replace(" ", "")
        this.recv_add_data(str, this.disSend)

        if (this.send_format == 1) {
          this.send_cmd_ascii(str)
        }

        this.send_cmd(str)
      },
      send_clear() {
        this.send_text = ""
      },
      recv_clear() {
        this.recv_text = ""
      },
      recv_add_data(str, dir) {
        let tmp = str

        if (this.recv_format == 1) {
          tmp = str_arr_toascii(str)
        }

        this.recv_text += getCurrentTimeStr() + dir + ":\n" + tmp + '\n'
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      timer_handle() {
        this.recv_handle()
        this.recv_handle()

        this.systick++
        this.timer = setTimeout(() => {
          this.timer_handle()
        }, 100)
      },
      tout_handle() {

      },
      recv_handle() {
        let recv_buf_tmp = '';

        if (store.state.time_out > 0) {
          store.commit('sub_time_out');
        } else {
          recv_buf_tmp = store.state.recv_buf;
          store.commit('clear_recv_buf')
        }

        if ((recv_buf_tmp != "") && (recv_buf_tmp != null)) {
          console.log('<dara:>', recv_buf_tmp)

          let data_mid = extractWithWrapper(recv_buf_tmp, "ab", "5a")
          if ((data_mid != "") && (data_mid != null)) {
            let recv_data = radar_recv(data_mid)

            console.log('<res:>', recv_data, data_mid)

            this.recv_add_data(recv_buf_tmp, this.disRecv)
          }
        }
      },
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
      send_cmd_ascii(cmd) {
        var data = {
          deviceId: store.state.device_info.deviceId,
          serviceId: store.state.device_info.serviceId,
          characteristicId: store.state.device_info.w_characteristicId,
          mode: 'str',
          dat: cmd,
        }
        send_data(data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll_view1 {
    height: 400px;
    background: #f9f9f9;
    border: 1px solid #ccc;
  }

  .scroll_view2 {
    height: 150px;
    background: #f9f9f9;
    border: 1px solid #ccc;
  }

  .view_text {
    white-space: normal;
    word-break: break-word;
  }

  .btn {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 16px;
    width: 25%;
    background-color: #3478f6;
    color: white;
  }

  .btn_hov {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 16px;
    width: 25%;
    background-color: #95c0ff;
    color: white;
  }
</style>