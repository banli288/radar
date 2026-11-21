<script>
  import store from './store'
	import { log_upload, reportOnline, jlog } from './tools/send'
	import wsManager from './tools/wsManager'
	import { initBleListener } from './tools/bleManager'
  export default {
    onLaunch() {
			reportOnline()
			wsManager.connect('ws://localhost/ws')

      // 连接状态监听只在启动时注册一次，避免每次 onShow 重复叠加监听器
      initBleListener()
    },
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