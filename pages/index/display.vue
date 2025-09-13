<template>
  <view>
    <!-- <view style="height: 50vh;">
			<qiun-data-charts type="scatter" :opts="opts" :chartData="chartData" loadingType="0" animation="false"/>
		</view> -->
    <view style="font-size: 16px; margin-bottom: 10px; margin-top: 10px; margin-left: 2px;">{{$t("display.text1")}}
    </view>
    <scroll-view scroll-y="true" class="scroll_view1" :scroll-top="scrollTop">
      <text id="scrollContainer" selectable="true" class="view_text">{{recv_text}}</text>
    </scroll-view>

    <view style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
        @tap="map_init('open')">{{$t("display.btnStartDis")}}</button>
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
        @tap="map_init('close')">{{$t("display.btnStopDis")}}</button>
      <button class="btn" hover-class="btn_hov" :disabled="!connect_state"
        @tap="map_init('save')">{{$t("display.ClearDis")}}</button>
    </view>
  </view>
</template>

<script>
  import {
    updatePageTitle
  } from '@/common/in18-helper.js'
  import store from '@/store/index.js'
  import {
    mapState
  } from 'vuex'
  import {
    send_data,
    radar_recv,
    radar_tx_data,
    hexToAscii,
    extractWithWrapper
  } from "@/tools/send.js"
  export default {
    data() {
      return {
        chartData: {},
        opts: {
          color: ["#00aa00", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
          padding: [15, 15, 0, 15],
          dataLabel: false,
          enableScroll: false,
          legend: {},
          animation: false,
          update: true,
          duration: 0,
          xAxis: {
            disableGrid: false,
            gridType: "dash",
            splitNumber: 8,
            boundaryGap: "justify",
            min: -2,
            max: 2
          },
          yAxis: {
            disableGrid: false,
            gridType: "dash",
            splitNumber: 10,
            data: [{
              position: 'center',
              min: 0.0,
              max: 10.0,
            }],
          }
        },
        timer: null,
        texts: [],
        texts_ptr: 0,
        res: {
          series: [{
            name: "目标点:单位(米)",
            data: []
          }],
        },
        scrollTop: 0,
        recv_text: "",
        recv_cnt: 0,
      };
    },
    onLoad() {
      updatePageTitle()
    },
    onReady() {
      this.chartData = JSON.parse(JSON.stringify(this.res))
    },
    onShow() {
      updatePageTitle()

      uni.setKeepScreenOn({
        keepScreenOn: true,
        success() {
          console.log("set_keep_screen_on")
        }
      })

      this.timer = setTimeout(this.timer_handle, 50)
    },
    onHide() {
      clearTimeout(this.timer)
      this.map_init('close')
    },
    onUnload() {
      clearTimeout(this.timer)
      this.map_init('close')
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    computed: {
      ...mapState(['connect_state']),
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
      timer_handle() {
        var recv_buf_tmp = '';

        if (store.state.time_out > 0) {
          store.commit('sub_time_out');
          recv_buf_tmp = store.state.recv_buf;
          store.commit('clear_recv_buf')
        }

        if ((recv_buf_tmp != "") && (recv_buf_tmp != null)) {
          let data_mid = extractWithWrapper(recv_buf_tmp, "ab", "5a")

          //收到了协议内容，必定是开启/关闭坐标指令的响应，直接在text中显示”OK“
          if ((data_mid != "") && (data_mid != null)) {
            let recv_data = radar_recv(data_mid)

            console.log('<res>', recv_data, data_mid)

            this.recv_text += "OK\n"
          }
          //没过协议，说明是坐标点，直接按照ASCII显示到text中
          else {
            this.recv_text += hexToAscii(recv_buf_tmp)
            //保持数据一直在最新的位置
            this.$nextTick(() => {
              this.scrollToBottom()
            })

            //数据行数太多，防止卡顿进行清空
            if (this.recv_cnt < 500) {
              this.recv_cnt += 1
            } else {
              this.recv_cnt = 0
              this.recv_text = ""
            }
          }
        }

        this.timer = setTimeout(() => {
          this.timer_handle()
        }, 10)
      },
      //开启/关闭坐标显示指令
      map_init(mode) {
        var cmd = ''

        if (mode == 'open') {
          cmd = '66010109'
        } else if (mode == 'close') {
          cmd = '66010100'
        } else if (mode == 'save') {
          this.recv_text = ""
        }

        if (store.state.connect_state == true) {
          this.send_cmd(radar_tx_data(cmd))
        }
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
    },
  }
</script>


<style lang="scss" scoped>
  .scroll_view1 {
    height: 500px;
    background: #f9f9f9;
    border: 1px solid #ccc;
  }

  .btn {
    height: 80rpx;
    line-height: 80rpx;
    width: 25%;
    font-size: 14px;
    background-color: #3478f6;
    color: white;
  }

  .btn_hov {
    height: 80rpx;
    line-height: 80rpx;
    width: 25%;
    font-size: 14px;
    background-color: #95c0ff;
    color: white;
  }
</style>