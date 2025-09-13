import i18n from "."

/**
 * 更新页面标题（状态栏标题）
 */
export function updatePageTitle() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const route = currentPage.route || ''

  let titleKey = 'statusBar.title'

  switch (route) {
    case 'pages/index/index':
      titleKey = 'statusBar.title'
      break
    case 'pages/index/config':
      titleKey = 'statusBar.title'
      break
    case 'pages/index/display':
      titleKey = 'statusBar.title'
      break
    case 'pages/index/more':
      titleKey = 'statusBar.title'
      break
  }

  uni.setNavigationBarTitle({
    title: i18n.t(titleKey)
  })
}

/**
 * 更新底部导航栏（tabBar）文本
 */
export function updateTabBar() {
  const tabBar = uni.getStorageSync('tabBarConfig') || []

  if (tabBar.length > 0) {
    tabBar.forEach((item, index) => {
      if (item.textKey) {
        uni.setTabBarItem({
          index,
          text: i18n.t(item.textKey)
        })
      }
    })
  } else {
    const defaultTabBar = [{
        index: 0,
        textKey: 'tabBar.home'
      },
      {
        index: 1,
        textKey: 'tabBar.config'
      },
      {
        index: 2,
        textKey: 'tabBar.display'
      },
      {
        index: 3,
        textKey: 'tabBar.more'
      }
    ]

    defaultTabBar.forEach(item => {
      uni.setTabBarItem({
        index: item.index,
        text: i18n.t(item.textKey)
      })
    })

    uni.setStorageSync('tabBarConfig', defaultTabBar)
  }
}

/**
 * 切换语言
 * @param {String} lang 语言代码，如'zh-CN'、'en-US'
 */
export function changeLanguage(lang) {
  i18n.locale = lang
  uni.setStorageSync('lang', lang)

  updatePageTitle()
  updateTabBar()
}