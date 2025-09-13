import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// 导入语言包
import Chinese from './lang/zh.js'
import English from './lang/en.js'

// 初始化i18n实例
const i18n = new VueI18n({
  locale: uni.getStorageSync('lang') || 'zh', // 默认语言
  messages: {
    'zh': Chinese,
    'en': English
  }
})

export default i18n