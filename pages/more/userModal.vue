<template>
  <!-- 遮罩层，点击可关闭 -->
  <view v-if="visible" class="modal-mask" @click="handleMaskClick">
    <!-- 弹窗内容，阻止冒泡防止点击内容区也关闭 -->
    <view class="modal-container" @click.stop>
      <image class="modal-image" :src="imageUrl" mode="widthFix"></image>
      <view class="modal-title">{{ title }}</view>
      <view class="modal-content">{{ content }}</view>
      <view class="modal-buttons">
        <button v-if="showCancelBtn" class="btn-cancel" @click="handleCancel">{{ cancelText }}</button>
        <button class="btn-confirm" @click="handleConfirm">{{ confirmText }}</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      resolvePromise: null,
      rejectPromise: null,
      imageUrl: '',
      title: '',
      content: '',
      confirmText: '确定',
      cancelText: '取消',
      showCancelBtn: true
    };
  },
  methods: {
    // 核心方法：显示弹窗，返回 Promise
    show(options = {}) {
      this.imageUrl = options.imageUrl || '';
      this.title = options.title || '';
      this.content = options.content || '';
      this.confirmText = options.confirmText || '确定';
      this.cancelText = options.cancelText || '取消';
      this.showCancelBtn = options.showCancelBtn !== false;
      this.visible = true;
      
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    handleMaskClick() {
      if (!this.showCancelBtn) return;
      this.close('cancel');
    },
    handleConfirm() {
      this.close('confirm');
    },
    handleCancel() {
      this.close('cancel');
    },
    close(type) {
      this.visible = false;
      if (type === 'confirm' && this.resolvePromise) {
        this.resolvePromise({ confirm: true });
      } else if (this.rejectPromise) {
        this.rejectPromise({ cancel: true });
      }
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-container {
  width: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  text-align: center;
}
.modal-image {
  width: 100%;
  height: auto;
}
.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  margin: 30rpx 30rpx 10rpx;
}
.modal-content {
  font-size: 28rpx;
  color: #666;
  margin: 0 30rpx 30rpx;
}
.modal-buttons {
  display: flex;
  border-top: 1px solid #eee;
}
.btn-cancel, .btn-confirm {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 32rpx;
  background: #fff;
  border-radius: 0;
}
.btn-cancel {
  color: #666;
  border-right: 1px solid #eee;
}
.btn-confirm {
  color: #2979ff;
}
</style>