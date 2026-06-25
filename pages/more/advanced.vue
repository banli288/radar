<template>
	<view class="page">
		<view class="col">
			<view class="card row" v-for="(item, index) in config1" v-if="index != 1" :key="index">
				<view class="col" style="width: 65%;">
					<view :style="dynamicFontStyle">{{item.name}}</view>
					<view :style="dynamicFontStyle" style="width: 80%; font-size: 20rpx;">{{item.description}}</view>
				</view>
				<view style="width: 35%;">
					<uni-data-select :localdata="item.checkbox" mode="tag" v-model="cfg1_value[index]"
						:clear="false"></uni-data-select>
				</view>
			</view>
		</view>
		
		<view class="card row">
			<view class="row" style="width: 65%;">
				<view :style="dynamicFontStyle" style="width: 40%;">{{radarSensitivity[0].name}}</view>
				<!-- <view :style="dynamicFontStyle" style="width: 25%;">{{radarSensitivity[0].text}}</view>
				<view :style="dynamicFontStyle" style="width: 25%; text-align: center;" v-if="radarSensitivity_level === 10">
					{{radarSensitivity[0].limit[5].text}}</view>
				<view :style="dynamicFontStyle" style="width: 25%; text-align: center;" v-else>
					{{radarSensitivity[0].limit[5 - radarSensitivity_level].text}}</view>
				<view :style="dynamicFontStyle" style="width: 10%;">{{radarSensitivity[0].unit}}</view> -->
			</view>
			<view :style="dynamicFontStyle" style="width: 35%">
				<uni-data-select v-model="radarSensitivity_level" :localdata="radarSensitivity[0].limit"
					:clear="false" @change=""></uni-data-select>
			</view>
		</view>
		
		<view class="col">
			<view class="card row" v-for="(item, index) in config2" :key="index">
				<view class="row" style="width: 100vw;">
					<view class="row" style="width: 65%;">
						<view :style="dynamicFontStyle" style="width: 60%;">{{item.name}}</view>
					<!-- 	<view :style="dynamicFontStyle" style="width: 20%;">{{item.text}}</view>
						<view :style="dynamicFontStyle" style="width: 10%; text-align: center;">{{cfg2_value[index]}}</view>
						<view :style="dynamicFontStyle" style="width: 10%;">{{item.unit}}</view> -->
					</view>
					<view class="row" style="width: 35%">
					    <view class="view_btn" @tap="para_sub(index)">-</view>
					    <input type="number" maxlength="4" :value="cfg2_value[index]" @input="onInputChange(index, $event)"
								style="text-align: center; flex: 1"/>
					    <view class="view_btn" @tap="para_add(index)">+</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="card col">
			<view class="row" style="margin-bottom: 20rpx;">
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_read()">读取参数</button>
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_restart()">{{$t("aconfig.btnRestart")}}</button>
			</view>
			<view class="row">
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_save()">保存参数</button>
				<button class="btn" hover-class="btn_hover" :disabled="!connect_state"
					@tap="radar_reset()">恢复出厂设置</button>
			</view>
			<!-- <view class="card">
				<button class="btn" hover-class="btn_hover" style="width: 100%;" :disabled="!connect_state"
					@tap="ble_dis_con()">{{$t("aconfig.btnBleAutoConnect")}}</button>
			</view> -->
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	import { mapState } from 'vuex'
	import { int_to2hex, jlog } from '@/tools/send.js'
	import bt from "@/tools/BluetoothManager.js"
  import { log_upload } from '../../tools/send';
import { advanced_read, advanced_write, close_ble_auto_poweroff, restart, restore } from '../../tools/radar_port';
	export default {
		data() {
			return {
				cfg1_value: [5, 0, 0],
				cfg2_value: [0.5, 0.1, 0.3, 0, 0.6, 0.6],
				radarSensitivity_level: 4,
				cfg2_limit: [
					{min: 0.0, max: 2.0, step: 0.1},
					{min: 0.0, max: 25.5, step: 0.1},
					{min: 0.0, max: 25.5, step: 0.1},
					{min: 0.0, max: 25.5, step: 0.1},
					{min: 0.5, max: 25.5, step: 0.1},
					{min: 0.5, max: 25.5, step: 0.1},
				],

				timer: null,
				cmd_id: 0, //0-空闲 1-都参数 2-写参数 3-重启 4-恢复出厂
				cmd_tout: 0,

				para_read_enable: false,
			}
		},
		computed: {
			...mapState(['connect_state']),
			isEnglish() {
				return this.$i18n.locale === 'en'
			},
			dynamicFontStyle() {
				return {
					fontSize: this.isEnglish ? '12px' : '18px',
					lineHeight: this.isEnglish ? '1.8' : '2.0'
				}
			},
			radarSensitivity() {
				if (store.state.product_info.sf < 1.7) {
					return[
						{
							name: this.$t('aconfig2.items.radarSensitivity.name'),
							text: this.$t('aconfig2.items.radarSensitivity.text'),
							unit: this.$t('aconfig2.items.radarSensitivity.unit'),
							value: 4,
							limit: [
								{
									value: 5,
									text: this.$t('aconfig2.items.radarSensitivity.limits.5')
								},
								{
									value: 4,
									text: this.$t('aconfig2.items.radarSensitivity.limits.4')
								},
								{
									value: 3,
									text: this.$t('aconfig2.items.radarSensitivity.limits.3')
								},
								{
									value: 2,
									text: this.$t('aconfig2.items.radarSensitivity.limits.2')
								},
								{
									value: 1,
									text: this.$t('aconfig2.items.radarSensitivity.limits.1')
								},
							]
						}
					]
				} else {
					return [
						{
							name: this.$t('aconfig2.items.radarSensitivity.name'),
							text: this.$t('aconfig2.items.radarSensitivity.text'),
							unit: this.$t('aconfig2.items.radarSensitivity.unit'),
							value: 4,
							limit: [
								{
									value: 5,
									text: this.$t('aconfig2.items.radarSensitivity.limits.5')
								},
								{
									value: 4,
									text: this.$t('aconfig2.items.radarSensitivity.limits.4')
								},
								{
									value: 3,
									text: this.$t('aconfig2.items.radarSensitivity.limits.3')
								},
								{
									value: 2,
									text: this.$t('aconfig2.items.radarSensitivity.limits.2')
								},
								{
									value: 1,
									text: this.$t('aconfig2.items.radarSensitivity.limits.1')
								},
								{
									value: 10,
									text: this.$t('aconfig2.items.radarSensitivity.limits.10')
								},
							],
						}
					]
				}
			},
			config1() {
				return [
					{
						name: this.$t("aconfig.name1"),
						description: this.$t("aconfig.description1"),
						value: 0,
						checkbox: [
							{
								text: this.$t("aconfig.checkbox1.close"),
								value: 0
							},
							{
								text: this.$t("aconfig.checkbox1.Strong"),
								value: 1
							}, {
								text: this.$t("aconfig.checkbox1.Medium_strong"),
								value: 2
							}, {
								text: this.$t("aconfig.checkbox1.Medium"),
								value: 3
							}, {
								text: this.$t("aconfig.checkbox1.Medium_weak"),
								value: 4
							}, {
								text: this.$t("aconfig.checkbox1.Weak"),
								value: 5
							},
						],
					},
					{
						name: this.$t("aconfig.name2"),
						description: this.$t("aconfig.description2"),
						value: 0,
						checkbox: [{
								text: this.$t("aconfig.checkbox2.left"),
								value: 1
							},
							{
								text: this.$t("aconfig.checkbox2.both"),
								value: 0
							},
							{
								text: this.$t("aconfig.checkbox2.right"),
								value: 2
							},
						],
					},
					{
						name: this.$t("aconfig.name3"),
						description: this.$t("aconfig.description3"),
						value: 0,
						checkbox: [{
								text: this.$t("aconfig.checkbox3.open"),
								value: 0
							},
							{
								text: this.$t("aconfig.checkbox3.close"),
								value: 1
							},
							{
								text: this.$t("aconfig.checkbox3.disable"),
								value: 2
							},
						],
					},
				]
			},
			config2() {
				return [
					// {
					// 	name: this.$t('aconfig2.items.delayDropTime.name'),
					// 	text: this.$t('aconfig2.items.delayDropTime.text'),
					// 	unit: this.$t('aconfig2.items.units.second'),
					// 	value: 0.5,
					// 	step: 0.1,
					// 	limit: [0.1, 25.5],
					// },
					{
						name: this.$t('aconfig2.items.proximityNoDetect.name'),
						text: this.$t('aconfig2.items.proximityNoDetect.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0.1,
						step: 0.1,
						limit: [0.0, 2.0],
					},
					{
						name: this.$t('aconfig2.items.leftNoDetectWidth.name'),
						text: this.$t('aconfig2.items.leftNoDetectWidth.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0.3,
						step: 0.1,
						limit: [0.0, 25.5],
					},
					{
						name: this.$t('aconfig2.items.rightNoDetectWidth.name'),
						text: this.$t('aconfig2.items.rightNoDetectWidth.text'),
						unit: this.$t('aconfig2.items.units.meter'),
						value: 0,
						step: 0.1,
						limit: [0.0, 25.5],
					},
					// {
					// 	name: this.$t('aconfig2.items.leftDetectWidth.name'),
					// 	text: this.$t('aconfig2.items.leftDetectWidth.text'),
					// 	unit: this.$t('aconfig2.items.units.meter'),
					// 	value: 0.6,
					// 	step: 0.1,
					// 	limit: [0.5, 25.5],
					// },
					// {
					// 	name: this.$t('aconfig2.items.rightDetectWidth.name'),
					// 	text: this.$t('aconfig2.items.rightDetectWidth.text'),
					// 	unit: this.$t('aconfig2.items.units.meter'),
					// 	value: 0.6,
					// 	step: 0.1,
					// 	limit: [0.5, 25.5],
					// },
				]
			},
		},
		onShow() {
			uni.setKeepScreenOn({
				keepScreenOn: true,
				success() {}
			})

			if (store.state.connect_state == true) {
				setTimeout(() => {
					this.radar_read()
				}, 500)
			}
		},
		onHide() {},
		onUnload() {},
		methods: {
			para_add(idx) {
					if (this.cfg2_value[idx] < this.cfg2_limit[idx].max) {
							let newVal = this.cfg2_value[idx] + this.cfg2_limit[idx].step
							// 使用 $set 确保响应式更新
							this.$set(this.cfg2_value, idx, Number(newVal.toFixed(1))) // 保留一位小数
					}
			},
			
			para_sub(idx) {
					if (this.cfg2_value[idx] > this.cfg2_limit[idx].min) {
							let newVal = this.cfg2_value[idx] - this.cfg2_limit[idx].step
							// 同样使用 $set 确保响应式
							this.$set(this.cfg2_value, idx, Number(newVal.toFixed(1)))
					}
			},
			
			onInputChange(index, event) {
					let val = parseFloat(event.detail.value)
					if (isNaN(val)) return
					
					// 限制在范围内
					const min = this.cfg2_limit[index].min
					const max = this.cfg2_limit[index].max
					if (val < min) val = min
					if (val > max) val = max
					
					// 保留一位小数
					val = Math.round(val * 10) / 10
					
					this.$set(this.cfg2_value, index, val)
			},
			chagnge_lmd(e) {
				this.config2[0].value = e
			},
			async radar_read() {
				let that = this

				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
				uni.showLoading({title: that.$t("aconfig.modal.reading"), mask:true})

				const res = await advanced_read();
				console.log(res)
				if (res) {
					clearTimeout(timer)

					this.cfg1_value[0] = res.HumanVehicleDistinction
					this.cfg1_value[1] = res.TrafficDirection
					this.cfg1_value[2] = res.RelayStatus
				
					this.radarSensitivity_level = res.radarSensitivity
					
					// this.cfg2_value[0] = res.delayDropTime
					this.cfg2_value[0] = res.proximityNoDetect
					this.cfg2_value[1] = res.leftNoDetectWidth
					this.cfg2_value[2] = res.rightNoDetectWidth
					// this.cfg2_value[4] = res.leftDetectWidth
					// this.cfg2_value[5] = res.rightDetectWidth
					
					this.$forceUpdate()
					log_upload('read', res)
					uni.showToast({title: that.$t("aconfig.modal.readsuccess"),})
				}
			},
			async ble_dis_con() {
				const res = await close_ble_auto_poweroff();
				if (res) {
					uni.showToast({title: this.$t("aconfig.modal.savesuccess")})
				}
			},
			async radar_save() {
				let that = this

				let param = {
          HumanVehicleDistinction: this.cfg1_value[0],
          TrafficDirection: this.cfg1_value[1],
          RelayStatus: this.cfg1_value[2],

          radarSensitivity: this.radarSensitivity_level,
					
          // delayDropTime: this.cfg2_value[0],
          proximityNoDetect: this.cfg2_value[0],
          leftNoDetectWidth: this.cfg2_value[1],
          rightNoDetectWidth: this.cfg2_value[2],
          // leftDetectWidth: this.cfg2_value[4],
          // rightDetectWidth: this.cfg2_value[5],
        }

        log_upload('write', param)

				let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
				uni.showLoading({title: that.$t("aconfig.modal.saving"), mask: true})
				
				const res_write = await advanced_write(param)
				if (!res_write) return;
				
				uni.showToast({title: that.$t("aconfig.modal.savesuccess")})
				const res_read = await advanced_read()
				if (res_read) {
					clearTimeout(timer)
					this.cfg1_value[0] = res_read.HumanVehicleDistinction
					this.cfg1_value[1] = res_read.TrafficDirection
					this.cfg1_value[2] = res_read.RelayStatus
				
					this.radarSensitivity_level = res_read.radarSensitivity
					
					// this.cfg2_value[0] = res_read.delayDropTime
					this.cfg2_value[0] = res_read.proximityNoDetect
					this.cfg2_value[1] = res_read.leftNoDetectWidth
					this.cfg2_value[2] = res_read.rightNoDetectWidth
					// this.cfg2_value[4] = res_read.leftDetectWidth
					// this.cfg2_value[5] = res_read.rightDetectWidth
								
					this.$forceUpdate()
					log_upload('read', res_read)
				}
				
				that.radar_read()
			},
			async radar_restart() {
				let that = this
				uni.showModal({
					title: that.$t("aconfig.modal.notice"),
					confirmText: that.$t("aconfig.modal.confirm"),
					cancelText: that.$t("aconfig.modal.cancel"),
					content: that.$t("aconfig.modal.radarRestart"),
					async success(res) {
						if (res.confirm) {
							let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
							uni.showLoading({title: that.$t("aconfig.modal.restarting"), mask: true})
							
							const res_restart = await restart();
							if (res_restart) {
								clearTimeout(timer)
								uni.showToast({title: that.$t("aconfig.modal.restartsuccess")})
							}
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
							
							const res_reset = await restore();
							if (res_reset) {
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

<style lang="scss">
	@import '../common.scss';

	/* 外层容器整体高度 */
	.big-nb::v-deep .uni-numbox {
		height: 60rpx !important;
		font-size: 30rpx !important;
	}

	/* 左右按钮 */
	.big-nb::v-deep .uni-numbox__minus,
	.big-nb::v-deep .uni-numbox__plus {
		width: 70rpx !important;
		height: 60rpx !important;
		line-height: 60rpx !important;
		font-size: 30rpx !important;
	}

	.big-nb::v-deep .uni-numbox__value {
		height: 60rpx !important;
		line-height: 60rpx !important;
	}
</style>