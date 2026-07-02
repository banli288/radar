<template>
	<view class="page">
		<view class="card img_box">
			<image mode="'aspectFit'" :src="img_url"></image>
		</view>

		<view class="col">
			<view class="card row" style="height: 40px;">
				<view class="_text" style="width: 40%; justify-content: space-between;">{{$t("config.text1")}}</view>
				<uni-data-select style="width: 60%;" v-model="car_value_1" :localdata="car_type" :clear="false"
					@change="change_car"></uni-data-select>
			</view>
			
			<view class="card row" style="height: 40px;">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view class="_text">{{$t("config.text3_dis")}}</view>
				</view>
				<view class="row" style="width: 60%; justify-content: space-around;">
					<view class="view_btn" @tap="pole_sub()">-</view>
					<slider style="flex: 1;" :value="dect_range" :min="0.5" :max="6" step="0.1" block-size="28" @change="change"
						activeColor="#3478f6" inactiveColor="#ffff7f" showValue="" block-color="#2979ff" :block-size="15"></slider>
					<view class="view_btn" @tap="pole_add()">+</view>
				</view>
			</view>
			<view class="card row" style="height: 40px;">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view class="_text">{{$t("config.fixation_text")}}</view>
					<!-- <view class="_text" style="font-size: 22rpx;">{{$t("config.text2_dis")}}</view> -->
				</view>

				<view class="option-group" style="width: 60%;">
					<view class="option-item" :class="{ active: selectedValue === 1 }" @click="change_fixation(1)">{{$t("config.fixation_left")}}</view>
					<view class="option-item" :class="{ active: selectedValue === 0 }" @click="change_fixation(0)">{{$t("config.fixation_right")}}</view>
				</view>
				
				<!-- <radio-group class="radio-row" @change="radioChange">
					<label class="radio-item" style="margin-right: 20px;" v-for="item in fixation_items" :key="item.value">
						<radio :value="item.value" :checked="item.value === fixation_value" color="#007AFF" />
						<text class="radio-text">{{ item.name }}</text>
					</label>
				</radio-group> -->
				<!-- <uni-data-select style="width: 60%;" v-model="fixation_value" :localdata="fixation" :clear="false"
					@change="change_fixation"></uni-data-select> -->
			</view>
			
			<view v-for="(item, index) in param_list" class="card row" style="justify-content: space-between; height: 40px;">
			  <view style="width: 40%; font-size: 14px;">{{item.name}}</view>
			  <view class="row" style="width: 60%;">
					<view class="view_btn" @tap="para_sub(index)">-</view>
					<view style="text-align: center; flex: 1;">{{item.value.toFixed(1)}}</view>
					<view class="view_btn" @tap="para_add(index)">+</view>
				</view>
			</view>
			
			<view class="card row" style="height: 40px;">
				<view style="width: 40%; font-size: 14px;">雷达版本</view>
				<view style="width: 60%; font-size: 14px; text-align: center;">{{radarSwVer}}</view>
			</view>
			
			<!-- <view class="card row" style="height: 40px;">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view :style="dynamicFontStyle" class="_text">{{$t("config.text2")}}</view>
				</view>
				<uni-data-select style="width: 60%;" v-model="pole_value" :localdata="pole_type" :clear="false"
					@change="change_pole"></uni-data-select>
			</view> -->
			
		</view>

<!--    <scroll-view scroll-y="true" style="height: 100px; margin-left: 35rpx;">
      <view v-for="(item, index) in aera_sensi" style="display: flex;">
          <view style="font-size: 16px; width: 40%;">区域{{index}}</view>
          <uni-number-box style="" v-model="item.value" :min="item.min" :max="item.max" :step="item.step"></uni-number-box>
      </view>
    </scroll-view> -->

<!--    <scroll-view scroll-y="true" style="padding: 35rpx;">
      <view style="display: flex;">
        <view style="font-size: 16px; width: 40%;">特殊杆子类型</view>
        <uni-number-box style="" v-model="pole_type_1.value" :min="pole_type_1.min" :max="pole_type_1.max" :step="pole_type_1.step"></uni-number-box>
      </view>
    </scroll-view> -->

		<view class="card col">
			<view class="row" style="margin-bottom: 10rpx;">
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_read()">{{$t("config.btnRead")}}</button>
				<!-- <button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_up_study()">学习场景</button> -->
					<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
						@tap="setStep(1)">学习场景</button>
			</view>
			<view class="row">
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_save()">{{$t("config.btnSave")}}</button>
					<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
						@tap="radar_reset">{{$t("aconfig.btnRestore")}}</button>
			</view>
		</view>
		
		<!-- <view class="card">
			<button class="btn" hover-class="btn_hover" style="width: 100%;" :disabled="!connect_state" @tap="radar_reset">{{$t("aconfig.btnRestore")}}</button>
		</view> -->
		
		<view class="win" v-if="imageLeft">
			<view class="content">
				<!-- <view class="title">选择左固定</view> -->
				<image mode="aspectFit" src="https://gitee.com/chuan0125/leida/raw/master/images/left2.jpg"/>
				<button class="discenter" style="height:80rpx; width: 100%;" @tap="imageLeft = false">确定</button>
			</view>
		</view>
		
		<view class="win" v-if="imageRight">
			<view class="content">
				<!-- <view class="title">选择右固定</view> -->
				<image mode="'aspectFit'" src="https://gitee.com/chuan0125/leida/raw/master/images/right2.jpg"/>
				<button class="discenter" style="height:80rpx; width: 100%;" @tap="imageRight = false">确定</button>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step1.enable">
			<view class="content">
				<view class="title">{{studyStep.step1.title}}</view>
				<view class="head">按遥控器把道闸杆抬杆，并保持抬杆状态！</view>
        <view class="winSize">注意：将车道内所有杂物移除，雷达学习过程中,确保无车辆、行人或其它物体进入雷达感应区左/右两侧3米范围内干扰雷达学习场景。</view>
				<view class="row" style="width: 100%;">
					<button class="discenter" style="height:80rpx; width: 50%;" @tap="setStep(2)">{{studyStep.nextStep}}</button>
					<button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(1)">{{studyStep.cancel}}</button>
				</view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step2.enable">
			<view class="content">
				<view class="title">{{studyStep.step2.title}}</view>
        <view class="head">正在学习开闸场景!</view>
				<view class="winSize">注意:雷达学习过程中，确保无车辆、行人或其它物体进入雷达感应区左/右两侧3米范围内干扰雷达学习场景。</view>
        <view class="row" style="width: 100%;">
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step2.btnEnable" @tap="setStep(3)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(2)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step3.enable">
			<view class="content">
				<view class="title">{{studyStep.step3.title}}</view>
        <view class="head">动态学习，按遥控器起落道闸杆3到5次!</view>
				<view class="winSize">注意:雷达学习过程中，确保无车辆、行人或其它物体进入雷达感应区左/右两侧3米范围内干扰雷达学习场景。</view>
        <view class="row" style="width: 100%;">
				  <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step3.btnEnable" @tap="setStep(4)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(3)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step4.enable">
			<view class="content">
				<view class="title">{{studyStep.step4.title}}</view>
        <view class="head">按遥控器把道闸杆落下，并保持落杆状态!</view>
				<view class="winSize">注意:雷达学习过程中，确保无车辆、行人或其它物体进入雷达感应区左/右两侧3米范围内干扰雷达学习场景。</view>
        <view class="row" style="width: 100%;">
				  <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step4.btnEnable" @tap="setStep(5)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(4)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step5.enable">
			<view class="content">
				<view class="title">{{studyStep.step5.title}}</view>
        <view class="head">正在学习关闸场景!</view>
				<view class="winSize">注意:雷达学习过程中，确保无车辆、行人或其它物体进入雷达感应区左/右两侧3米范围内干扰雷达学习场景。</view>
        <view class="row" style="width: 100%;">
				  <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step5.btnEnable" @tap="setStep(6)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(5)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.stepFinish.enable">
			<view class="content">
				<view class="title">{{studyStep.stepFinish.title}}</view>
				<view class="winSize">{{studyStep.stepFinish.content}}</view>
				<button class="discenter" style="height:80rpx; width: 100%;" :disabled="studyStep.finished.btnEnable" @tap="setStep(0)">{{studyStep.finished}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import userModal from '../more/userModal.vue'
	import {updatePageTitle} from '@/common/in18-helper.js'
	import store from '@/store/index.js'
	import bt from "@/tools/BluetoothManager.js"
	import {mapState} from 'vuex'
  import { bytesToAsciiString, bytesToHexString, hex2int, hexStringToByteArray, jlog, log_upload } from '../../tools/send'
	import { getConfig, setConfig, get_radar_sensi, set_radar_sensi, advanced_read, advanced_write, param_env_read,
	 studyStep1, studyStep2, studyStep3, restore} from '@/tools/radar_port'
	export default {
		components: {userModal},
		data() {
			return {
				imageLeft: false,
				imageRight: false,
				
				studyStep: {
					nextStep: "下一步",
					cancel: "取消",
					finished: "完成",
					
					step1: {
						enable: false,
						btnEnable: false,
						title: "第一步",
						content: "按遥控器把道闸杆保持在落杆状态；注意：先将车道所有杂物移除，在雷达学习过程中，确保无车辆及行人等干扰目标！（雷达感应区左右两侧3米内）",
					},
					step2: {
						enable: false,
						btnEnable: true,
						title: "第二步",
						content: "正在学习关闸场景，请稍后.....",
					},
					step3: {
						enable: false,
						btnEnable: true,
						title: "第三步",
						content: "动态学习\n按遥控器把道闸杆起落各五次，操作完成后点击下一步！注意：确保无车辆及行人等干扰目标！（雷达感应区左右两侧三米内）",
					},
					step4: {
						enable: false,
						btnEnable: true,
						title: "第四步",
						content: "按遥控器把道闸杆保持在抬杆状态！操作完成后点击下一步",
					},
					step5: {
						enable: false,
						btnEnable: true,
						title: "第五步",
						content: "静态学习场景，请稍后....\n注意：雷达在学习过程中，确保无车辆及行人等干扰目标！（雷达感应区左右两侧三米内）",
					},
					stepFinish: {
						enable: false,
						btnEnable: false,
						title: "场景学习完成",
						content: "恭喜您，雷达学习完毕，请使用！",
					},
				},
				
				selectedValue: 0, // 当前选中项，默认选A
				pole_value: 0, // display
				pole_index: 0, // real
				car_value: 0,
        car_value_1: 0,
				dect_range: 1.0,
				img_url: "",
				study_entry: 0,
				fixation_value: 0,
				
				polyType: {name: "杆长(米)", value: 0, min: 0, max: 6, step: 0.1},
				
				param_list: [
					{name: "左侧检测范围(米)", value: 0.6, min: 0.0, max: 1.5, step: 0.1},
					{name: "右侧检测范围(米)", value: 0.6, min: 0.0, max: 1.5, step: 0.1},
					{name: "延时设置(秒)", value: 0.5, min: 0.0, max: 25.5, step: 0.5},
				],
	
        aera_sensi: [
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 42, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 10, step: 1},
          {value: 0, min: 0, max: 1, step: 1},
        ],
			}
		},
		computed: {
			//该页面需要动态刷新的变量，根据名字判断对应的意义
			...mapState(['connect_state']),
			isEnglish() {
				return this.$i18n.locale === 'en'
			},
			imgs() {
				if (this.$i18n.locale === 'zh') {
					return [
						"https://gitee.com/chuan0125/leida/raw/master/images/right1.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/left1.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/6.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/5.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/4.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3.jpg",
            "https://gitee.com/chuan0125/leida/raw/master/images/4.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3.jpg"
					];
				} else {
					return [
						"https://gitee.com/chuan0125/leida/raw/master/images/2_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/1_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/6_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/5_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/4_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3_en.jpg",
            "https://gitee.com/chuan0125/leida/raw/master/images/4_en.jpg",
						"https://gitee.com/chuan0125/leida/raw/master/images/3_en.jpg"
					];
				}
			},
			pole_type() {
				if (store.state.product_info.sf > 1.6) {
					return [
					  {value: 0,text: this.$t("config.poleType.type0")},
					  {value: 1,text: this.$t("config.poleType.type1")},
					  {value: 2,text: this.$t("config.poleType.type2")},
					  {value: 3,text: this.$t("config.poleType.type3")},
					  // {value: 4,text: this.$t("config.poleType.type4")},
					  // {value: 5,text: this.$t("config.poleType.type5")},
					  // {value: 6,text: this.$t("config.poleType.type6")},
					  // {value: 7,text: this.$t("config.poleType.type7")},
					]
				} else {
					return [
					  {value: 0,text: this.$t("config.poleType.type0")},
					  {value: 1,text: this.$t("config.poleType.type1")},
					  {value: 2,text: this.$t("config.poleType.type2")},
					  // {value: 3,text: this.$t("config.poleType.type3")},
					  // {value: 4,text: this.$t("config.poleType.type4")},
					  // {value: 5,text: this.$t("config.poleType.type5")},
					]
				}
			},
			car_type() {
				return [
				  {value: 0,text: this.$t("config.carType.type0")},
					// {value: 1,text: "不支持该类型杆子"},
				  // {value: 1,text: this.$t("config.carType.type1")},
				  // {value: 2,text: this.$t("config.carType.type2")}, 
				]
			},
			fixation() {
				return [
					{value: 1,text: this.$t("config.fixation_right")},
				  {value: 0,text: this.$t("config.fixation_left")},
				]
			},
			fixation_items() {
				return [
					{ value: 1, name: this.$t("config.fixation_left") },
					{ value: 0, name: this.$t("config.fixation_right") }
				]
			},
			radarSwVer() {
				return store.state.product_info.sw_ver
			}
		},
		onLoad() {
			updatePageTitle()
		},
		onShow() {
			updatePageTitle()

			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {}
			})

			this.img_url = this.imgs[this.pole_value]

			if (store.state.connect_state == true) {
				setTimeout(() => {
					this.radar_read()
				}, 200)
			}
		},
		onHide() {
			uni.hideLoading()
		},
		onUnload() {
			uni.hideLoading()
		},
		methods: {
      studyStep1Cancel(index) {
        let that = this
        uni.showModal({
          content:'确定要关闭雷达学习场景吗？一旦关闭雷达将终止学习功能',
          success:(res)=>{
            if (res.confirm) {
              if (index == 1) that.studyStep.step1.enable = false
              else if (index == 2) that.studyStep.step2.enable = false
              else if (index == 3) that.studyStep.step3.enable = false
              else if (index == 4) that.studyStep.step4.enable = false
              else if (index == 5) that.studyStep.step5.enable = false
            }
          },
        })
      },
			async studyErr() {
				this.studyStep.step1.enable = false;
				this.studyStep.step2.enable = false; 
				this.studyStep.step3.enable = false; 
				this.studyStep.step4.enable = false; 
				this.studyStep.step5.enable = false; 
				this.studyStep.stepFinish.enable = false; 
				
				uni.showModal({content: "学习失败，雷达无响应"})
			},
			async setStep(step) {
        let that = this
				switch (step) {
					case 0:
						this.studyStep.step1.enable = false;
						this.studyStep.step2.enable = false; 
						this.studyStep.step3.enable = false; 
						this.studyStep.step4.enable = false; 
						this.studyStep.step5.enable = false; 
						this.studyStep.stepFinish.enable = false; 
            uni.showModal({title: "雷达学习场景完成", showCancel: false, async success(res) {
              if (res.confirm) {
                const advanced = await advanced_read()
                if (!advanced) {
                  this.studyErr()
                  return
                }
                
                if ((advanced.leftNoDetectWidth + advanced.rightNoDetectWidth) > 1.0) {
                  uni.showModal({
                    title: that.$t("config.studyEndNotice"),
                    confirmText: that.$t("modal.confirmText"),
                    cancelText: that.$t("modal.cancelText"),
                  });
                }
                
                log_upload('read', advanced)
                
                if (that.pole_value == 0 || that.pole_value == 1) {
                  if (that.pole_value == 0) {
                    advanced.leftNoDetectWidth = 0
                    advanced.rightNoDetectWidth = 0.5
                  } else if (that.pole_value == 1) {
                    advanced.leftNoDetectWidth = 0.5
                    advanced.rightNoDetectWidth = 0
                  }
                  
                  const advSave = await advanced_write(advanced)
                  if (!advSave) {
                    this.studyErr()
                    return
                  }
                }
              }
            }})
            
					break;
					case 1: 
						this.studyStep.step1.enable = true; 
						this.studyStep.step2.enable = false; 
						this.studyStep.step3.enable = false; 
						this.studyStep.step4.enable = false; 
						this.studyStep.step5.enable = false; 
						this.studyStep.stepFinish.enable = false; 
						
						this.studyStep.step2.btnEnable = true
					break;
					case 2:
						this.studyStep.step1.enable = false;
						this.studyStep.step2.enable = true; 
						this.studyStep.step3.enable = false; 
						this.studyStep.step4.enable = false; 
						this.studyStep.step5.enable = false; 
						this.studyStep.stepFinish.enable = false; 
						
						const resStep1 = await studyStep1();
						if (!resStep1) {
							this.studyErr()
							return;
						}
						
						setTimeout(() => { 
							this.studyStep.step2.btnEnable = false
							this.studyStep.step3.btnEnable = true
              this.setStep(3)
						}, 5000)
					break;
					case 3:
						this.studyStep.step1.enable = false;
						this.studyStep.step2.enable = false; 
						this.studyStep.step3.enable = true; 
						this.studyStep.step4.enable = false; 
						this.studyStep.step5.enable = false; 
						this.studyStep.stepFinish.enable = false; 
						
						const resStep2 = await studyStep2()
						if (!resStep2) {
							this.studyErr()
							return;
						}
						
						setTimeout(() => {
							this.studyStep.step3.btnEnable = false
							this.studyStep.step4.btnEnable = false
						}, 8000)
					break;
					case 4:
						this.studyStep.step1.enable = false;
						this.studyStep.step2.enable = false; 
						this.studyStep.step3.enable = false; 
						this.studyStep.step4.enable = true; 
						this.studyStep.step5.enable = false; 
						this.studyStep.stepFinish.enable = false; 
						
						setTimeout(() => {
							this.studyStep.step4.btnEnable = false
							this.studyStep.step5.btnEnable = true
						}, 8000)
					break;
					case 5:
						this.studyStep.step1.enable = false;
						this.studyStep.step2.enable = false; 
						this.studyStep.step3.enable = false; 
						this.studyStep.step4.enable = false; 
						this.studyStep.step5.enable = true; 
						this.studyStep.stepFinish.enable = false; 
						
						const resStep3 = await studyStep3()
						if (!resStep3) {
							this.studyErr()
							return;
						}
						
						setTimeout(async () => {
							this.studyStep.step5.btnEnable = false
							this.studyStep.stepFinish.btnEnable = false
							
							let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
							
							const advanced = await advanced_read()
							if (!advanced) return;
							
							clearTimeout(timer)
							
							if ((advanced.leftNoDetectWidth + advanced.rightNoDetectWidth) > 1.0) {
								uni.showModal({
									title: that.$t("config.studyEndNotice"),
									confirmText: that.$t("modal.confirmText"),
									cancelText: that.$t("modal.cancelText"),
								});
							}
							
							log_upload('read', advanced)
							
							console.log(that.pole_index)
							
							if (that.pole_index == 0 || that.pole_index == 1) {
								if (that.pole_index == 0) {
									advanced.leftNoDetectWidth = 0
									advanced.rightNoDetectWidth = 0.5
									console.log('w 0')
								} else if (that.pole_index == 1) {
									advanced.leftNoDetectWidth = 0.5
									advanced.rightNoDetectWidth = 0
									console.log('w 1')
								}
								
								timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
								
								const advSave = await advanced_write(advanced)
								if (!advSave) return;
								
								clearTimeout(timer)
							}
							
              this.setStep(0)
						}, 5000)
					break;
					case 6:
						this.studyStep.step1.enable = false;
						this.studyStep.step2.enable = false; 
						this.studyStep.step3.enable = false; 
						this.studyStep.step4.enable = false; 
						this.studyStep.step5.enable = false; 
						this.studyStep.stepFinish.enable = false; 
					break;
				}
			},
			pole_sub() {
				if (this.dect_range > 0.5) {
					this.dect_range -= 0.1
					this.dect_range = +(this.dect_range.toFixed(1))
				}
			},
			pole_add() {
				if (this.dect_range < 6) {
					this.dect_range += 0.1
					this.dect_range = +(this.dect_range.toFixed(1))
				}
			},
			para_add(index) {
				if (this.param_list[index].value < this.param_list[index].max)
					this.param_list[index].value += this.param_list[index].step
				if (this.param_list[index].value > this.param_list[index].max)
					this.param_list[index].value = this.param_list[index].max
        this.param_list[index].value = +(this.param_list[index].value.toFixed(1)) //将0.99999或者1.0000001强行转成1，不会加/减超出范围，下同
			},
			para_sub(index) {
				if (this.param_list[index].value > this.param_list[index].min)
					this.param_list[index].value -= this.param_list[index].step
				if (this.param_list[index].value < this.param_list[index].min)
					this.param_list[index].value = this.param_list[index].min
        this.param_list[index].value = +(this.param_list[index].value.toFixed(1))
			},
			radioChange(e) {
				this.fixation_value = Number(e.detail.value);
				this.update_image()
			},
			change(e) {
				this.dect_range = e.detail.value
			},
			change_pole(e) {
				this.pole_value = e
				this.update_image()
			},
			change_car(e) {
				this.car_value = e
			},
			change_fixation(e) {
				this.fixation_value = e
				this.selectedValue = e
				this.update_image()
				
				if (this.selectedValue === 0) this.imageRight = true
				else this.imageLeft = true
			},
			update_image() {
				let that = this
				let image_index = 0
				// 0: right 1: left
				if (that.fixation_value == 1) {
					if (that.pole_value == 0) {
						image_index = 1 // 直杆
					} else if (that.pole_value == 1) {
						image_index = 3 // 栅栏杆
					} else if (that.pole_value == 2) {
						image_index = 5 // 广告杆
					} else if (that.pole_value == 3) {
						image_index = 7 // 空降杆
					}
				} else {
					if (that.pole_value == 0) {
						image_index = 0
					} else if (that.pole_value == 1) {
						image_index = 2
					} else if (that.pole_value == 2) {
						image_index = 4
					} else if (that.pole_value == 3) {
						image_index = 6 // 空降杆
					}
				}
				this.img_url = this.imgs[image_index]
			},
			//读取参数接口，实质上就是根据协议向蓝牙写指令
			async radar_read() {
				let that = this
				
				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readfail")})}, 1000)
				uni.showLoading({title: that.$t("modal.reading"), mask: true})
				
				let pole = 0
				const config = await getConfig()
				if (!config) return;
				
				pole = config.pole
				this.dect_range = +(config.range.toFixed(1))
				// this.car_value = config.carType
				
				const advacned = await advanced_read()
				if (!advacned) return;
				
				this.param_list[0].value = advacned.leftDetectWidth
				this.param_list[1].value = advacned.rightDetectWidth
				this.param_list[2].value = advacned.delayDropTime
				
				pole % 2 == 0 ? that.fixation_value = 0 : that.fixation_value = 1; // 0: right 1: left
				
				const ver = store.state.product_info.sw_ver.split('.').map(Number)
				if (ver[0] > 1 || ver[1] > 6) {
					const sensi = await get_radar_sensi()
					if (sensi) {
						clearTimeout(timer)
						uni.showToast({title: this.$t("modal.readSuccess")})
						
						if (pole <= 1) {
							that.pole_value = 0 // 直杆
						} else if (pole <= 3) {
							that.pole_value = 1 // 栅栏干
						} else if (pole <= 5) {
							sensi.pole == 0 ? that.pole_value = 2 : that.pole_value = 3 // byte 10: 0: 广告杆 1: 空降杆
						} 
						
						if (pole < 4) {
							this.pole_index = pole
						} else if (pole == 4) {
							if (sensi.pole == 0) this.pole_index = 4
							else this.pole_index = 6
						} else if (pole == 5) {
							if (sensi.pole == 0) this.pole_index = 5
							else this.pole_index = 7
						}
						
						this.car_value = 	that.pole_value === 0 ? 0 : 1
						
						for (let i = 0; i < 9; i++) this.aera_sensi[i].value = sensi.sensi[i]
						this.aera_sensi[9] = sensi.pole
						
						this.img_url = this.imgs[this.pole_index]
						this.selectedValue = this.pole_index
						
						log_upload('read', {
							'dect_range': this.dect_range,
							'car_value': this.car_value,
							'pole_value': pole,
							'98020201': sensi
						})
					}
				} else {
					this.pole_index = pole
					this.img_url = this.imgs[this.pole_index]
					
					if (pole <= 1) {
						that.pole_value = 0 // 直杆
					} else if (pole <= 3) {
						that.pole_value = 1 // 栅栏栏
					} else if (pole <= 5) {
						that.pole_value = 2 // 广告杆
					} 
					
					clearTimeout(timer)
					uni.showToast({title: this.$t("modal.readSuccess")})
					
					log_upload('read', {
							'dect_range': this.dect_range,
							'car_value': this.car_value,
							'pole_value': pole
					})
				}
			},
			//保存参数接口
			async radar_save() {
				let that = this
				let pole = 0

				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
				uni.showLoading({title: that.$t("modal.saving"), mask: true})

				// 0: right 1: left
				if (that.fixation_value == 1) {
					if (that.pole_value == 0) {
						that.pole_index = 1 // 直杆
					} else if (that.pole_value == 1) {
						that.pole_index = 3 // 栅栏杆
					} else if (that.pole_value == 2 || that.pole_value == 3) {
						that.pole_index = 5 // 广告杆/空降杆
					}
				} else {
					if (that.pole_value == 0) {
						that.pole_index = 0
					} else if (that.pole_value == 1) {
						that.pole_index = 2
					} else if (that.pole_value == 2 || that.pole_value == 3) {
						that.pole_index = 4
					}
				}

				if ((that.pole_index > 1) || (that.car_value !==0)) {
					uni.showModal({content: "请设置直杆，不支持其他杆!!!"})
					return
				}

				const advanced = await advanced_read()
				advanced.leftDetectWidth = that.param_list[0].value
				advanced.rightDetectWidth = that.param_list[1].value
				advanced.delayDropTime = that.param_list[2].value
				
				const resAdvSave = await advanced_write(advanced)
				if (!resAdvSave) {
					uni.showToast({title: that.$t("modal.savingTout")})
				}

				pole = that.pole_index

				const param = {
					pole: pole,
					range: that.dect_range,
					carType: that.car_value
				}

				const res_save = await setConfig(param)
				if (!res_save) return;
				
				clearTimeout(timer)
				uni.hideLoading()
				
				const ver = store.state.product_info.sw_ver.split('.').map(Number)
				if (ver[0] > 1 || ver[1] > 6) {
					timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 3000)
					uni.showLoading({title: that.$t("modal.saving"), mask: true})
					
					for (let i = 0; i < 9; i++) that.aera_sensi[i].value = 0x0A
					
					// 2: 广告杆 3: 空降杆
					if (that.pole_value == 2) {
						that.aera_sensi[9].value = 0 
					}
					else if(that.pole_value == 3)  {
						that.aera_sensi[2].value = 0x2A
						that.aera_sensi[9].value = 1
					}
					
					let sensi = []
					for (let i = 0; i < 9; i++) sensi.push(that.aera_sensi[i].value)
					
					const res_sensi = await set_radar_sensi(sensi, that.aera_sensi[9].value)
					if (!res_sensi) return;
					
					const res_getConfig = await getConfig()
					if (!res_getConfig) return;
					
					const res_getSensi = await get_radar_sensi()
					if (!res_getSensi) return;
					
					clearTimeout(timer)
					uni.hideLoading()
					
					log_upload('read', { '77020201': res_getConfig, '98020201': res_getSensi})
						
					// uni.showModal({
					//   title: that.$t("modal.notice"),
					//   confirmText: that.$t("modal.confirmText"),
					//   cancelText: that.$t("modal.cancelText"),
					// 	content: "保存成功",
					//   // content: that.$t("config.studyCont.text5"),
					//   // success(res) {
					//   //   if (res.confirm) {
					// 		// 	that.radar_up_study()
					// 		// 	that.study_entry = 1
					// 		// }
					//   // }
					// })
          uni.showToast({title: "保存成功"})
				} else {
					// uni.showModal({
					//   title: that.$t("modal.notice"),
					//   confirmText: that.$t("modal.confirmText"),
					//   cancelText: that.$t("modal.cancelText"),
					//   // content: that.$t("config.studyCont.text5"),
					// 	content: "保存成功",
					//   // success(res) {
					//   //   if (res.confirm) {
					//   //   	that.radar_up_study()
					//   //   	that.study_entry = 1
					//   //   }
					//   // }
					// })
					
          uni.showToast({title: "保存成功"})

					log_upload('write', {
					  'dect_range': that.dect_range * 10,
					  'pole_value': that.pole_index,
					  'car_value': that.car_value
					})
				}
				that.radar_read()
			},
			//抬杆学习
			async radar_up_study() {
				let that = this
				uni.showModal({
					title: that.$t("modal.notice"),
					content: "按遥控器把道闸杆保持在落杆状态；注意：先将车道所有杂物移除，在雷达学习过程中，确保无车辆及行人等干扰目标！（雷达感应区左右两侧3米内）",
					confirmText: "下一步",
					cancelText: "取消",
					async success(res) {
						if (res.confirm) {
							uni.showModal({
								title: "第二步",
								content: "正在学习关闸场景，请稍后.....",
								confirmText: "下一步",
								async success(res) {
									if (res.confirm) {
										let timer = setTimeout(() => {uni.showToast({title: that.$t("config.btnCont.btnUp")})}, 2000)
										uni.showLoading({title: that.$t("config.studyCont.text3"), mask: true})
										
										const resStep1 = await studyStep1()
										if (!resStep1) return;
										
										const resEnv = await param_env_read()
										if (!resEnv) return;
										
										clearTimeout(timer)
										uni.hideLoading()
										
										log_upload('read', {'type': 'env para', 'data': bytesToAsciiString(resEnv)})
										
										uni.showModal({
											title: "动态学习",
											content: "按遥控器把道闸杆起落各五次，操作完成后点击下一步！注意：确保无车辆及行人等干扰目标！（雷达感应区左右两侧三米内）",
											cancelText: "下一步",
											success(res) {
												if (res.confirm) {
													if (that.study_entry == 1) {
														that.radar_down_study()
														that.study_entry = 0
													}
												}
											}
										})
									}
								}
							})
						}
					}
				})
			},
			//落杆学习指令
			async radar_down_study() {
				let that = this
				let timer = null
				
				that.study_entry = 0
				
				uni.showModal({
					title: "第四步",
					content: "按遥控器把道闸杆保持在抬杆状态！操作完成后点击下一步",
					confirmText: "下一步",
					async success(res) {
						if (res.confirm) {
							timer = setTimeout(() => {uni.showToast({title: that.$t("config.studyCont.text11")})}, 1000)
							uni.showLoading({title: that.$t("config.studyCont.text7"), mask: true})

							const resStep2 = await studyStep2()
							if (!resStep2) return;

							clearTimeout(timer)
							
							setTimeout(() => {
								uni.hideLoading()
								uni.showModal({
									title: "第五步",
									content: "静态学习场景，请稍后....\n注意：雷达在学习过程中，确保无车辆及行人等干扰目标！（雷达感应区左右两侧三米内）",
									confirmText: "下一步",
									async success(res) {
										if (res.confirm) {
											uni.showLoading({title: that.$t("config.studyCont.text7")})
											setTimeout(() => {
												uni.hideLoading()
												uni.showLoading({title: "学习中", mask: true})

												// const resStep3 = await studyStep3()
												// if (!resStep3) return;
												
												clearTimeout(timer)
										
												setTimeout(() => {
													uni.hideLoading()
													uni.showModal({
														title: that.$t("modal.studyFinish"),
														confirmText: that.$t("modal.confirmText"),
														cancelText: that.$t("modal.cancelText"),
														async success(res) {
															if(res.confirm) {
																let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
																
																const advanced = await advanced_read()
																if (!advanced) return;
																
																if ((advanced.leftNoDetectWidth + advanced.rightNoDetectWidth) > 1.0) {
																	uni.showModal({
																		title: that.$t("config.studyEndNotice"),
																		confirmText: that.$t("modal.confirmText"),
																		cancelText: that.$t("modal.cancelText"),
																	});
																}
																
																log_upload('read', advanced)
																
																console.log(that.pole_index)
																if (that.pole_index == 0 || that.pole_index == 1) {
																	if (that.pole_index == 0) {
																		advanced.leftNoDetectWidth = 0
																		advanced.rightNoDetectWidth = 0.5
																	} else if (that.pole_index == 1) {
																		advanced.leftNoDetectWidth = 0.5
																		advanced.rightNoDetectWidth = 0
																	}
																	
																	const advSave = await advanced_write(advanced)
																	if (!advSave) return;
																	
																	clearTimeout(timer)
																}
															}
														},
													});
												}, 2000)
												// uni.showModal({
												// 	title: that.$t("modal.notice"),
												// 	content: that.$t("config.studyCont.text9"),
												// 	confirmText: that.$t("modal.confirmText1"),
												// 	cancelText: that.$t("modal.cancelText"),
												// 	async success(res) {
												// 		if (res.confirm) {
												// 			let timer = setTimeout(() => {uni.showToast({title: that.$t("config.studyCont.text11")})}, 1000)
															
												// 		}
												// 	}
												// })
											}, 2000)
										}
									}
								})
							}, 2000)
						}
					}
				})
			},
			async radar_reset() {
				let that = this
				uni.showModal({
					title: that.$t("aconfig.modal.notice"),
					confirmText: that.$t("aconfig.modal.confirm"),
					cancelText: that.$t("aconfig.modal.cancel"),
					content: that.$t("aconfig.modal.restore"),
					async success(res) {
						if (res.confirm) {
			        let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
			        uni.showLoading({title: that.$t("aconfig.modal.setting"), mask: true})
							
							const res_restore = await restore()
							if (res_restore) {
								clearTimeout(timer)
								uni.showToast({title: that.$t("aconfig.modal.restoresuccess")})
								that.radar_read()
							}
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../common.scss";
	
	.img_box {
		display: flex;
		justify-content: center;
		align-items: center;

		.img_content {
			width: 96%;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
	}

	._text {
		align-items: center;
	}
	
	.option-group {
	  display: flex;
	  flex-direction: row;
	  background-color: #f5f5f5;
	  border-radius: 5rpx;
	  padding: 4rpx;
	}
	
	.option-item {
	  flex: 1;
	  text-align: center;
	  padding: 16rpx 0;
	  border-radius: 5rpx;
	  font-size: 28rpx;
	  transition: all 0.3s ease;
	  /* 未激活样式：白底深色字 */
	  background-color: #ffffff;
	  color: #333333;
	}
	
	/* 激活样式：蓝底白字 */
	.option-item.active {
	  background-color: #2979ff;
	  color: #ffffff;
	  box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.2);
	}
	
  .head {
		width: 90%;
		padding: 20rpx;
		font-size: 32rpx; 
		background-color: #ffffff;
    display: flex;
    text-align: center;
    justify-content: center;
  }

	.winSize {
		width: 98%;
		height: 300rpx;
		line-height: 50rpx;
		font-size: 32rpx; 
		background-color: #ffffff;
    color: red;
	}
</style>