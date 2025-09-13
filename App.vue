<script>
  import store from './store'
  export default {
    onLaunch() {

    },
    onShow() {
      uni.onBLEConnectionStateChange(function(res) {
        let id = res.deviceId
        if (res.connected == false) {
          uni.closeBLEConnection({
            deviceId: id
          })

          store.commit('ble_con_state_update', false)
        } else {
          store.commit('ble_con_state_update', true)
        }
        console.log('BLE Connect State, Store State', res.connected, store.state.connect_state)
      })
    }
  }
</script>

<style lang="scss">
  @import "uview-ui/index.scss";
  @import "common/demo.scss";

  page {
    width: 100%;
    height: 100% !important;
  }

  .wx-uni-toast {
    width: 50% !important;
  }
</style>