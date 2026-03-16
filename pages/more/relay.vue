<template>
  <view class="page">
		<view class="col">
			<view v-for="(item, index) in aera_para_list" class="card row" style="justify-content: space-around;">
			  <view style="width: 60%; font-size: 14px;">{{item.name}}</view>
			  <view class="row" style="width: 40%;">
					<image src="@/static/-.png" mode="aspectFit" style="width: 35%; height: 70rpx;"></image>
					<input v-model="item.value" style="text-align: center; width: 30%;"/>
					<image src="@/static/+.png" mode="aspectFit" style="width: 35%; height: 70rpx;"></image>
				</view>
			</view>
		</view>
		
		<view class="card row">
			<button class="btn" hover-class="btn_hover">读取</button>
		  <button class="btn" hover-class="btn_hover">写入</button>
		</view>
	</view>
</template>

<script>
export default {

  data() {
    return {
			aera_para_list: [
				{name:"启动区域x左的正负标志", value: 0},
				{name:"启动区域x左分米", value: 0},
				{name:"启动区域x右的正负标志", value: 0},
				{name:"启动区域x右分米", value: 0},
				{name:"启动区域y临近不检测距离", value: 0},
				{name:"启动区域y最大距离", value: 0}
			],

      menu: [
        {name:'考勤打卡',icon:'/static/icon1.png'},
        {name:'合同签署',icon:'/static/icon2.png'},
        {name:'个人信息',icon:'/static/icon3.png'},
        {name:'资格证书',icon:'/static/icon4.png'},
      ],

      menu2: [
        {name:'信息安全',icon:'/static/icon5.png'},
        {name:'员工访谈',icon:'/static/icon6.png'},
        {name:'员工培训',icon:'/static/icon7.png'},
        {name:'员工关怀',icon:'/static/icon8.png'},
      ]

    }
  }

}
</script>

<style lang="scss">
@import '../common.scss';
</style>