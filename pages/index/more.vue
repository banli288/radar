<template>
  <view class="content">
    <view class="title">
      <image class="img_class" src="@/static/0.jpg" mode="heightFix"></image>
      <view style="font-size: 20px; margin-bottom: 5px;">{{toolInfo}}</view>
      <view>{{prodInfo}}</view>
    </view>
    <view class="_label">
      <view class="label_item" v-for="(item,index) in pageList" :key="index" @tap="more_opa(index)">
        <view class="label_title">{{item}}</view>
        <image class="title_icon" src="@/static/threeangle.png"></image>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    updatePageTitle,
    changeLanguage
  } from '@/common/in18-helper.js'
  import store from '@/store/index.js'
  export default {
    data() {
      return {

      }
    },
    computed: {
      pageList() {
        return [
          this.$t("more.advancedConfig"),
          this.$t("more.binUpdate"),
          this.$t("more.remote"),
          this.$t("more.commamd"),
          this.$t("more.userSheet"),
          this.$t("more.userProtocol"),
          //this.$t("more.langSwitch"),
        ]
      },
      toolInfo() {
        return this.$t("more.toolInfo")
      },
      prodInfo() {
        return this.$t("more.prodInfo")
      },
    },
    onLoad() {
      updatePageTitle()
    },
    onShow() {
      updatePageTitle()

      uni.setKeepScreenOn({
        keepScreenOn: true,
        success() {
          console.log("set_keep_screen_on")
        }
      })
    },
    methods: {
      //点击对应的页面文字进行跳转
      more_opa(index) {
        let that = this
        if (index == 0) {
          uni.showModal({
            title: this.$t("modal.notice"),
            content: this.$t("more.advancedCont"),
            confirmText: this.$t("modal.confirmText"),
            cancelText: this.$t("modal.cancelText"),
            success(res) {
              //跳转高级设置
              if (res.confirm) {
                that.$u.route({
                  url: '/pages/more/advanced'
                })
              }
            }
          })
        } else if (index == 1) {

        } else if (index == 2) {

        } else if (index == 3) {
          that.$u.route({
            //跳转调试页面
            url: '/pages/more/debug'
          })
        } else if (index == 4) {
          //加载说明书
          this.downloadAndOpenPdf()
        } else if (index == 5) {

        } else if (index == 6) {

          this.$i18n.locale === 'zh' ? changeLanguage('en') : changeLanguage('zh')
        }
      },
      downloadAndOpenPdf() {
        let that = this
        uni.showLoading({
          title: that.$t("more.download")
        })
        //说明书的网址
        const fileUrl =
          'https://gitee.com/chuan0125/leida/raw/master/MW60%20%E4%BA%A7%E5%93%81%E8%AF%B4%E6%98%8E%E4%B9%A62025-09-12A.pdf';
        uni.downloadFile({
          url: fileUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              //下载成功后打开
              uni.openDocument({
                filePath: res.tempFilePath,
                fileType: 'pdf',
                success: () => console.log('打开文档成功'),
                fail: (err) => console.error('打开文档失败:', err)
              });
            } else {
              console.error('下载失败，状态码：', res.statusCode);
            }
          },
          fail: (err) => console.error('下载文件失败：', err),
          complete: (res) => {
            uni.hideLoading()
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    flex-direction: column;
  }

  .img_class {
    height: 120px;
    margin: 0 auto !important;
  }

  .title {
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ._label {
    margin: 20px 0px;
    // display: flex;
    // flex-direction: column;
    // padding: 0rpx 0rpx;

    .label_item {
      //border: 1px solid #000000;
      font-size: 16px;
      padding: 10px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label_title {
        padding: 0px;
      }

      .title_icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
</style>