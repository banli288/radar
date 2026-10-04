<template>
	<view class="page">
		<view class="card img_box">
			<image mode="aspectFit" :src="img_url"></image>
		</view>

		<view class="col">
			<view class="card row" style="height: auto">
				<view class="_text" style="width: 40%; justify-content: space-between;">{{$t("config.text1")}}</view>
				<uni-data-select style="width: 60%;" v-model="pole_value" :localdata="pole_type" :clear="false"
					@change="change_pole"></uni-data-select>
			</view>
			
			<view class="card row" style="height: auto;">
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
			<view class="card row" style="height: auto;">
				<view class="col" style="width: 40%; justify-content: space-between;">
					<view class="_text">{{$t("config.fixation_text")}}</view>
					<!-- <view class="_text" style="font-size: 22rpx;">{{$t("config.text2_dis")}}</view> -->
				</view>

				<view class="option-group" style="width: 60%;">
					<view class="option-item" :class="{ active: selectedValue === 1 }" @click="change_fixation(1)">{{$t("config.fixation_left")}}</view>
					<view class="option-item" :class="{ active: selectedValue === 0 }" @click="change_fixation(0)">{{$t("config.fixation_right")}}</view>
				</view>
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
				<view style="width: 40%; font-size: 14px;">{{$t("index.text10")}}</view>
				<view style="width: 60%; font-size: 14px; text-align: center;">{{radarSwVer}}</view>
			</view>
			
			<view class="card row">
				<view :style="dynamicFontStyle" class="_text" style="width: 40%; justify-content: space-between; ">{{$t("index.text11")}}</view>
				<view style="width: 60%; font-size: 20rpx;">{{radarInfo}}</view>
			</view>
		</view>
		<view class="card col">
			<view class="row" style="margin-bottom: 10rpx;">
				<button class="btn" hover-class="btn_hover" :disabled="!btn_en"
					@tap="radar_read()">{{$t("config.btnRead")}}</button>
					<button class="btn" hover-class="btn_hover" :disabled="!btn_en"
						@tap="setStep(1)">{{$t("config.btnStudy")}}</button>
			</view>
			<view class="row">
				<button class="btn" hover-class="btn_hover" :disabled="!btn_en"
					@tap="radar_save()">{{$t("config.btnSave")}}</button>
					<button class="btn" hover-class="btn_hover" :disabled="!btn_en"
						@tap="radar_reset">{{$t("aconfig.btnRestore")}}</button>
			</view>
		</view>
		<view class="win" v-if="imageLeft">
			<view class="content">
				<view class="title">{{$t("config.selLeft")}}</view>
				<image mode="aspectFit" style="width: 100%;" src="@/static/left2.jpg"/>
				<button class="discenter" style="height:80rpx; width: 100%;" @tap="imageLeft = false">{{$t("modal.confirmText")}}</button>
			</view>
		</view>
		
		<view class="win" v-if="imageRight">
			<view class="content">
				<view class="title">{{$t("config.selRight")}}</view>
				<image mode="aspectFit" style="width: 100%;" src="@/static/right2.jpg"/>
				<button class="discenter" style="height:80rpx; width: 100%;" @tap="imageRight = false">{{$t("modal.confirmText")}}</button>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step1.enable">
			<view class="content">
				<view class="title">{{studyStep.step1.title}}</view>
				<view class="head">{{studyStep.step1.head}}</view>
        <view class="winSize">{{studyStep.step1.content}}</view>
				<view class="row" style="width: 100%;">
					<button class="discenter" style="height:80rpx; width: 50%;" @tap="setStep(2)">{{studyStep.nextStep}}</button>
					<button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(1)">{{studyStep.cancel}}</button>
				</view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step2.enable">
			<view class="content">
				<view class="title">{{studyStep.step2.title}}</view>
        <view class="head">{{studyStep.step2.head}}</view>
				<view class="winSize">{{studyStep.step2.content}}</view>
        <view class="row" style="width: 100%;">
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step2.btnEnable" @tap="setStep(3)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(2)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step3.enable">
			<view class="content">
				<view class="title">{{studyStep.step3.title}}</view>
        <view class="head">{{studyStep.step3.head}}</view>
				<view class="winSize">{{studyStep.step3.content}}</view>
        <view class="row" style="width: 100%;">
				  <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step3.btnEnable" @tap="setStep(4)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(3)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step4.enable">
			<view class="content">
				<view class="title">{{studyStep.step4.title}}</view>
        <view class="head">{{studyStep.step4.head}}</view>
				<view class="winSize">{{studyStep.step4.content}}</view>
        <view class="row" style="width: 100%;">
				  <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step4.btnEnable" @tap="setStep(5)">{{studyStep.nextStep}}</button>
          <button class="discenter" style="height:80rpx; width: 50%;" :disabled="studyStep.step1.btnEnable" @tap="studyStep1Cancel(4)">{{studyStep.cancel}}</button>
        </view>
			</view>
		</view>
		
		<view class="win" v-if="studyStep.step5.enable">
			<view class="content">
				<view class="title">{{studyStep.step5.title}}</view>
        <view class="head">{{studyStep.step5.head}}</view>
				<view class="winSize">{{studyStep.step5.content}}</view>
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
				win_status: true,
				
				imageLeft: false,
				imageRight: false,
				
				studyStep: {
					nextStep: this.$t("config.confirmText1"),
					cancel: this.$t("config.cancelText"),
					finished: this.$t("config.finished"),
					
					step1: {
						enable: false,
						btnEnable: false,
						title: this.$t("study.step1"),
						head: this.$t("study.head1"),
						content: this.$t("study.line1"),
					},
					step2: {
						enable: false,
						btnEnable: true,
						title: this.$t("study.step2"),
						head: this.$t("study.head2"),
						content: this.$t("study.line2"),
					},
					step3: {
						enable: false,
						btnEnable: true,
						title: this.$t("study.step3"),
						head: this.$t("study.head3"),
						content: this.$t("study.line3"),
					},
					step4: {
						enable: false,
						btnEnable: true,
						title: this.$t("study.step4"),
						head: this.$t("study.head4"),
						content: this.$t("study.line4"),
					},
					step5: {
						enable: false,
						btnEnable: true,
						title: this.$t("study.step5"),
						head: this.$t("study.head5"),
						content: this.$t("study.line5"),
					},
					stepFinish: {
						enable: false,
						btnEnable: false,
						title: this.$t("study.stepFinish"),
						content: this.$t("study.lineFinish"),
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
				
				polyType: {name: this.$t("config.t_poleLen"), value: 0, min: 0, max: 6, step: 0.1},
				
				param_list: [
					{name: this.$t("config.t_leftDect"), value: 1.0, min: 0.0, max: 1.5, step: 0.1},
					{name: this.$t("config.t_rightDect"), value: 1.0, min: 0.0, max: 1.5, step: 0.1},
					{name: this.$t("config.t_delay"), value: 0.0, min: 0.0, max: 25.5, step: 0.5},
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
			btn_en() {
				return this.win_status && this.connect_state
			},
			imgs() {
				if (this.$i18n.locale === 'zh') {
					return [
						"/static/r1.jpg",
						"/static/l1.jpg",
						"/static/r3.jpg",
						"/static/l3.jpg",
						"/static/r2.jpg",
						"/static/l2.jpg",
						"/static/r3.jpg",
						"/static/l3.jpg",
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
				const ver = store.state.product_info.sw_ver.split('.').map(Number)
				if (ver[0] > 1 || ver[1] > 6) {
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
					  {value: 3,text: this.$t("config.poleType.type3")},
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
			},
			radarInfo() {
				return `${store.state.radar_info.version} ${store.state.radar_info.advanced}`
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
							that.win_status = true;
							uni.showTabBar()
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
				
				that.win_status = true;
				uni.showTabBar()
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
								that.win_status = true;
								uni.showTabBar()
								
                const advanced = await advanced_read()
                if (!advanced) {
                  that.studyErr()
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
                
                if (that.pole_index == 0 || that.pole_index == 1) {
                  if (that.pole_index == 0) {
                    advanced.leftNoDetectWidth = 0
                    advanced.rightNoDetectWidth = 0.5
                  } else if (that.pole_index == 1) {
                    advanced.leftNoDetectWidth = 0.5
                    advanced.rightNoDetectWidth = 0
                  }
                  
                  const advSave = await advanced_write(advanced)
                  if (!advSave) {
                    that.studyErr()
                    return
                  }
                }
								
								const sensi = await get_radar_sensi();
								if (!sensi) return;
								
								for (let i = 0; i < 9; i++) sensi.sensi[i] = 10;
								
								// 区域4、5的灵敏度从10设置为20，也就是0.8-2.2m的灵敏度调为现在的中低
								sensi.sensi[3] = 20;
								sensi.sensi[4] = 20;
								
								console.log(sensi)
								
								const sensi_wr_res = await set_radar_sensi(sensi.sensi, sensi.pole);
								if (!sensi) return;
								
								that.radar_read(); // 学习完成回读参数
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
						
						this.win_status = false
						uni.hideTabBar()
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
			async get_radar_param() {
				let pole = 0
				const config = await getConfig()
				if (!config) return null;
				
				pole = config.pole
				this.dect_range = +(config.range.toFixed(1))
				
				const advacned = await advanced_read()
				if (!advacned) return null;
				
				this.param_list[0].value = advacned.leftDetectWidth
				this.param_list[1].value = advacned.rightDetectWidth
				this.param_list[2].value = advacned.delayDropTime
				
				 // 0: right 1: left
				if (pole % 2 == 0) {
					this.fixation_value = 0
					this.selectedValue = 0
				} else {
					this.fixation_value = 1
					this.selectedValue = 1
				}
				
				const ver = store.state.product_info.sw_ver.split('.').map(Number)
				if (ver[0] > 1 || ver[1] > 6) {
					const sensi = await get_radar_sensi()
					if (!sensi) return null;
					
					if (pole <= 1) {
						this.pole_value = 0 // 直杆
					} else if (pole <= 3) {
						this.pole_value = 1 // 栅栏干
					} else if (pole <= 5) {
						sensi.pole == 0 ? this.pole_value = 2 : this.pole_value = 3 // byte 10: 0: 广告杆 1: 空降杆
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
					
					// this.car_value = 	this.pole_value === 0 ? 0 : 1
					
					for (let i = 0; i < 9; i++) this.aera_sensi[i].value = sensi.sensi[i]
					this.aera_sensi[9].value = sensi.pole
					
					this.img_url = this.imgs[this.pole_index]
					
					log_upload('read', {
						'dect_range': this.dect_range,
						// 'car_value': this.car_value,
						'pole_value': pole,
						'98020201': sensi
					})
				} else {
					this.pole_index = pole
					this.img_url = this.imgs[this.pole_index]
					
					if (pole <= 1) {
						this.pole_value = 0 // 直杆
					} else if (pole <= 3) {
						this.pole_value = 1 // 栅栏栏
					} else if (pole <= 5) {
						this.pole_value = 2 // 广告杆
					} 
					
					log_upload('read', {
							'dect_range': this.dect_range,
							'car_value': this.car_value,
							'pole_value': pole
					})
				}
				
				return {status: "success"}
			},
			async set_radar_param() {
				let pole = 0
				// 0: right 1: left
				if (this.fixation_value == 1) {
					if (this.pole_value == 0) {
						this.pole_index = 1 // 直杆
					} else if (this.pole_value == 1) {
						this.pole_index = 3 // 栅栏杆
					} else if (this.pole_value == 2 || this.pole_value == 3) {
						this.pole_index = 5 // 广告杆/空降杆
					}
				} else {
					if (this.pole_value == 0) {
						this.pole_index = 0
					} else if (this.pole_value == 1) {
						this.pole_index = 2
					} else if (this.pole_value == 2 || this.pole_value == 3) {
						this.pole_index = 4
					}
				}
				
				// if ((this.pole_index > 1) || (this.car_value !==0)) {
				// 	uni.showModal({content: "请设置直杆，不支持其他杆!!!"})
				// 	return null
				// }
				
				const advanced = await advanced_read()
				if (!advanced) return null;
				
				advanced.leftDetectWidth = this.param_list[0].value
				advanced.rightDetectWidth = this.param_list[1].value
				advanced.delayDropTime = this.param_list[2].value
				
				const resAdvSave = await advanced_write(advanced)
				if (!resAdvSave) return null;
				
				pole = this.pole_index
				
				const param = {
					pole: pole,
					range: this.dect_range,
					carType: this.car_value
				}
				
				const res_save = await setConfig(param)
				if (!res_save) return null;
			
				const ver = store.state.product_info.sw_ver.split('.').map(Number)
				if (ver[0] > 1 || ver[1] > 6) {
					for (let i = 0; i < 9; i++) this.aera_sensi[i].value = 0x0A
					
					// 2: 广告杆 3: 空降杆
					if (this.pole_value == 2) {
						this.aera_sensi[9].value = 0 
					}
					else if(this.pole_value == 3)  {
						this.aera_sensi[2].value = 0x2A
						this.aera_sensi[9].value = 1
					}
					
					let sensi = []
					for (let i = 0; i < 9; i++) sensi.push(this.aera_sensi[i].value)
					
					const res_sensi = await set_radar_sensi(sensi, this.aera_sensi[9].value)
					if (!res_sensi) return null;
					
					const res_getConfig = await getConfig()
					if (!res_getConfig) return null;
					
					const res_getSensi = await get_radar_sensi()
					if (!res_getSensi) return null;
					
					log_upload('read', { '77020201': res_getConfig, '98020201': res_getSensi})
				} else {
					log_upload('write', {
					  'dect_range': this.dect_range * 10,
					  'pole_value': this.pole_index,
					  'car_value': this.car_value
					})
				}
				
				if (!this.get_radar_param()) return null;
				
				return {status: "success"}
			},
			async radar_read() {
				let timer = setTimeout(() => {uni.showToast({title: "读取超时"})}, 10000)
				uni.showLoading({title: "读取中", mask: true})
				
				const res = await this.get_radar_param()
				clearTimeout(timer)
				if (res != null) {
					uni.showToast({title: "读取成功"})
				} else {
					uni.showToast({title: "读取失败"})
				}
			},
			async radar_save() {
				let timer = setTimeout(() => {uni.showToast({title: "保存超时"})}, 10000)
				uni.showLoading({title: "保存中", mask: true})
				
				const res = await this.set_radar_param()
				clearTimeout(timer)
				if (res != null) {
					uni.showToast({title: "保存成功"})
				} else {
					uni.showToast({title: "保存失败"})
				}
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