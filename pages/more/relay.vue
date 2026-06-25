<template>
  <view class="page">
		<view class="col">
			<view v-for="(item, index) in aera_para_list" class="card row" style="justify-content: space-around;">
			  <view style="width: 60%; font-size: 14px;">{{item.name}}</view>
			  <view class="row" style="width: 40%;">
					<!-- <image src="@/static/-.png" mode="aspectFit" style="width: 35%; height: 70rpx;" @tap="para_sub(index)"></image> -->
					<input v-model="item.value" style="text-align: center; width: 30%;"/>
					<!-- <image src="@/static/+.png" mode="aspectFit" style="width: 35%; height: 70rpx;" @tap="para_add(index)"></image> -->
				</view>
			</view>
			<view v-for="(item, index) in state_list" class="card row" style="justify-content: space-around;">
				<view style="width: 60%; font-size: 14px;">{{item.name}}</view>
				<view style="width: 40%;">
					<uni-data-select v-model="item.value" :localdata="item.box" :clear="false" @change=""></uni-data-select>
				</view>
			</view>
		</view>
		
		<view class="card row">
			<button class="btn" hover-class="btn_hover" :disabled="!connect_state" @tap="para_read()">{{$t("relay.read")}}</button>
		  <button class="btn" hover-class="btn_hover" :disabled="!connect_state" @tap="para_write()">{{$t("relay.write")}}</button>
		</view>
	</view>
</template>

<script>
import store from '@/store/index.js'
import { mapState } from 'vuex'
import { int_to2hex, jlog } from '@/tools/send.js'
import bt from "@/tools/BluetoothManager.js"
import { log_upload } from '../../tools/send';
import { relay_read, relay_write } from '../../tools/radar_port';
export default {
  data() {
    return {
			aera_para_list: [
				{name: this.$t("relay.para1"), value: 0, min: -60, max: 60, step: 1},
				{name: this.$t("relay.para2"), value: 0, min: -60, max: 60, step: 1},
				{name: this.$t("relay.para3"), value: 0, min: 0, max: 60, step: 1},
				{name: this.$t("relay.para4"), value: 0, min: 0, max: 60, step: 1},
			],
			state_list: [
				{
					name: this.$t("relay.para5"),
					value: 0,
					box: [
						{text: this.$t("relay.relay_state.state0"), value: 0},
						{text: this.$t("relay.relay_state.state1"), value: 1},
						{text: this.$t("relay.relay_state.state2"), value: 2},
					]
				},
				{
					name: this.$t("relay.para6"),
					value: 0,
					box: [
						{text: this.$t("relay.aera_state.state0"), value: 0},
						{text: this.$t("relay.aera_state.state1"), value: 1},
					]
				},
			],
		}
  },
	computed: {
		...mapState(['connect_state']),
	},
	methods: {
		para_add(index) {
			if (this.aera_para_list[index].value < this.aera_para_list[index].max)
				this.aera_para_list[index].value += this.aera_para_list[index].step
		},
		para_sub(index) {
			if (this.aera_para_list[index].value > this.aera_para_list[index].min)
				this.aera_para_list[index].value -= this.aera_para_list[index].step
		},
		async para_read() {
			let that = this
			
			let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.readTineout")})}, 1000)
			uni.showLoading({title: that.$t("modal.reading"), mask:true})
			
			const res = await relay_read()
			if (res) {
				clearTimeout(timer)
				uni.showToast({title: that.$t("modal.readSuccess")})
										
				that.aera_para_list[0].value = res.param1
				that.aera_para_list[1].value = res.param2
				that.aera_para_list[2].value = res.param3
				that.aera_para_list[3].value = res.param4
				that.state_list[0].value = res.param5
				that.state_list[1].value = res.param6
			}
		},
		async para_write() {
			let that = this
			
			let timer = setTimeout(() => {uni.showToast({title: that.$t("modal.savingTout")})}, 1000)
			uni.showLoading({title: that.$t("modal.saving"), mask:true})
			
			let param = {
				param1: that.aera_para_list[0].value,
				param2: that.aera_para_list[1].value,
				param3: that.aera_para_list[2].value,
				param4: that.aera_para_list[3].value,
				param5: that.state_list[0].value,
				param6: that.state_list[1].value,
			}
			
			const res = await relay_write(param)
			if (res) {
				clearTimeout(timer)
				uni.showToast({title: that.$t("modal.saved")})
			}
		}
	}
}
</script>

<style lang="scss">
@import '../common.scss';
</style>