import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    device_info: {
      serviceId: '',
      deviceId: '',
      r_characteristicId: '',
      w_characteristicId: ''
    },

    product_info: {
      type: 0,
      SN: '',
      hd_ver: 0,
      sw_ver: "0",
    },

    recv_buf: '',
    time_out: 0,

    connect_state: false,

    location: null,
		
		active_page: "",
  },
  mutations: {
    $uStore(state, payload) { },
    set_device_info(state, obj) {
      if (obj.deviceId != null) state.device_info.deviceId = obj.deviceId
      if (obj.serviceId != null) state.device_info.serviceId = obj.serviceId
      if (obj.r_characteristicId != null) state.device_info.r_characteristicId = obj.r_characteristicId
      if (obj.w_characteristicId != null) state.device_info.w_characteristicId = obj.w_characteristicId
    },
    add_recv_buf(state, arr) {
      state.recv_buf += arr
      state.time_out = 1
    },
    clear_recv_buf(state) {
      state.recv_buf = ''
    },
    sub_time_out(state) {
      state.time_out -= 1
    },
    writeVersion(state) {
      state.hardware_version = true
    },
    ble_con_state_update(state, con_state) {
      state.connect_state = con_state
    },
    get_location(state, location) {
      state.location = location
    },
    set_product(state, prod) {
      state.product_info.type = prod.type
      state.product_info.SN = prod.SN
      state.product_info.hd_ver = prod.hd_ver
      state.product_info.sw_ver = prod.sw_ver
    },
    setLang(state, lang) {
      state.lang = lang
      // 保存到本地缓存
      uni.setStorageSync('lang', lang)
    },
		set_active_page(state, page) {
			state.active_page = page
		},
  },
  actions: {
    changeLanguage({
      commit
    }, lang) {
      commit('setLang', lang)
      // 触发全局语言变化事件
      uni.$emit('languageChanged')

      // 同时更新所有tabBar文字
      this.dispatch('updateTabBar')
    },

    updateTabBar({
      state
    }) {
      // 获取当前i18n实例
      const i18n = Vue.prototype.$i18n

      // 更新每个tab的文字
      const tabBarConfig = [{
        index: 0,
        key: 'tabBar.home'
      },
      {
        index: 1,
        key: 'tabBar.config'
      },
      {
        index: 2,
        key: 'tabBar.display'
      },
      {
        index: 3,
        key: 'tabBar.more'
      }
      ]

      tabBarConfig.forEach(item => {
        uni.setTabBarItem({
          index: item.index,
          text: i18n.t(item.key)
        })
      })
    }
  }
})

export default store