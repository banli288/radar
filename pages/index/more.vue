<template>
  <view class="page">
    <view class="card title">
      <image class="img_class" src="@/static/0.jpg" mode="heightFix"></image>
      <view style="font-size: 20px;">{{toolInfo}}</view>
      <view>{{prodInfo}}</view>
    </view>
    <view class="_label">
      <view class="card label_item" v-for="(item,index) in pageList" :key="index" @tap="more_opa(index)">
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
				if (store.state.product_info.sw_ver < 2.0) {
					return [
					  this.$t("more.advancedConfig"),
					  this.$t("more.commamd"),
					  this.$t("more.userSheet"),
					]
				}
				else {
					return [
					  this.$t("more.advancedConfig"),
					  this.$t("more.commamd"),
						this.$t("more.relay"),
					  this.$t("more.userSheet"),
					]
				}
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
              if (res.confirm) {
                that.$u.route({
                  url: '/pages/more/advanced'
                })
              }
            }
          })
        } else if (index == 1) {
          that.$u.route({url: '/pages/more/debug'})
        } else if (index == 2) {
					if (store.state.product_info.sw_ver < 2.0) {
						this.downloadAndOpenPdf()
					} else {
						that.$u.route({url: '/pages/more/relay'})
					}
				 } else if (index == 3) {
          this.downloadAndOpenPdf()
        }
      },
      downloadAndOpenPdf() {
        let that = this
        uni.showLoading({
          title: that.$t("more.download")
        })
        //说明书的网址
        const fileUrl =
          'https://gitee.com/chuan0125/leida/raw/master/MW60%20%E4%BA%A7%E5%93%81%E8%AF%B4%E6%98%8E%E4%B9%A62025-09-23A.pdf';
        uni.downloadFile({
          url: fileUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              //下载成功后打开
              uni.openDocument({
                filePath: res.tempFilePath,
                fileType: 'pdf',
                success: () => {
									uni.hideLoading()
								},
                fail: (err) => {
									uni.hideLoading()
									uni.showModal({
										title: that.$t("modal.notice"),
										content: that.$t("more.openfailed"),
										confirmText: that.$t("modal.confirmText"),
										cancelText: that.$t("modal.cancelText"),
									})
								}
              });
            } else {
							uni.hideLoading()
              uni.showModal({
              	title: that.$t("modal.notice"),
              	content: that.$t("more.downFailed"),
              	confirmText: that.$t("modal.confirmText"),
              	cancelText: that.$t("modal.cancelText"),
              })
            }
          },
          fail: (err) => {
						uni.hideLoading()
						uni.showModal({
							title: that.$t("modal.notice"),
							content: that.$t("more.downFailed"),
							confirmText: that.$t("modal.confirmText"),
							cancelText: that.$t("modal.cancelText"),
						})
					},
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
	@import "../common.scss";
	
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
    .label_item {
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