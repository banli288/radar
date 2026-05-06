export default {
  statusBar: {
    title: "道闸雷达",
    advCfg: "高级设置",
    cmdDebug: "指令调试"
  },
  tabBar: {
    home: "连接",
    config: "配置",
    display: "目标图",
    more: "更多"
  },
	index: {
	  text1: "远程连接",
	  text2: "产品型号",
	  text3: "产品编码",
	  text4: "硬件版本",
	  text5: "固件版本",
	  text6: "30分钟无操作蓝牙自动关闭,雷达断电重启后\n蓝牙重新启动,成功连接后蓝灯亮起",
	  text7: "搜索中",
	  text8: "刷新列表",
	  text9: "关闭雷达蓝牙,调试下一个雷达",
	
	  bleBtnName: {
	    connect: "连接蓝牙设备",
	    disconnect: "断开蓝牙设备",
	  }
	},
  more: {
    advancedConfig: "高级设置",
    binUpdate: "固件升级",
    remote: "远程支持",
    commamd: "指令调试",
    userSheet: "雷达用户手册",
    userProtocol: "用户协议",
    langSwitch: "中英文切换",
    toolInfo: "道闸雷达",
    prodInfo: "版本1.1.20",
    advancedCont: "请在专业人士指导下操作，否则将有砸车风险！，确认要继续操作吗",
    download: "加载中",
    opensuccess: "打开成功",
    openfailed: "打开失败",
    downFailed: "下载失败，请检查网络",
		relay: "继电器区域设置",
		relay_win: "当前设备版本不支持",
  },
  display: {
    text1: "目标点显示 ：",
    btnStartDis: "开启显示",
    btnStopDis: "关闭显示",
    ClearDis: "清空显示"
  },
  modal: {
    notice: "提示",
    reading: "读取中",
    saving: "保存中",
    setting: "设置中",
    seted: "设置完成",
		saved: "保存成功",
    readSuccess: "读取成功",
    upStudyFinish: "抬杆背景学习完成",
    dnstudyFinish: "杆起落学习完成",
    studyFinish: "学习完成",
    confirmText: "确定",
    confirmText1: "下一步",
    cancelText: "取消",
    readTineout: "读取超时",
		savingTout: "保存超时",
    conSuccess: "连接成功",
    disconBle: "确定断开蓝牙连接?",
    searchingDev: "正在搜索设备",
    openBleErr: "蓝牙打开失败，请检查手机是否打开蓝牙",
    connecting: "正在连接",
    closeBle: "蓝牙已断开连接",
    connectErr: "连接失败，请重试",
    Bleconnected: "蓝牙已连接",
    CloseRadarBLE: "需要断电重启后，才能重新使用当前雷达蓝牙，是否关闭？",
  },
  config: {
    text1: "过车类型:",
    text2: "杆子类型:",
		text2_dis: "背对雷达，杆子在雷达哪边，为固定方向",
    text3: "纵向检测距离(米):",
		text3_dis: "杆长减0.5m以上",
    btnRead: "读取参数",
    btnSave: "保存参数",
    btnUpStudy: "抬杆背景学习",
    btnDownStudy: "杆起落学习",
    studyEndNotice: "有风险，请调整安装位置、杆子类型等。",

    poleType: {
      type0: "直杆右固定",
      type1: "直杆左固定",
      type2: "栅栏杆右固定",
      type3: "栅栏杆左固定",
      type4: "广告杆右固定",
      type5: "广告杆左固定",
      type6: "空降杆右固定",
      type7: "空降杆左固定",
    },
    carType: {
      type0: "小弯过车(小于10度)",
      type1: "直进直出",
      type2: "弯道过车(小于25度)",
    },
    btnCont: {
      btnRead: "读取参数超时",
      btnSave: "保存参数超时",
      btnUp: "抬杆背景学习超时",
      btnDown: "杆起落学习超时",
    },
    studyCont: {
      text1: "请先用遥控把杆抬起，再点击下一步",
      text2: "请确认杆处于起杆状态",
      text3: "请保持杆抬起状态，人车不要进入杆左右2米范围内",
      text4: "起杆学习超时，请重试",
      text5: "保存配置完成，请进行杆学习？",
      text6: "点击确定后,请用遥控控制杆起落5次以上",
      text7: "杆起落学习中",
      text8: "请用遥控起落杆至少5次，人车不要进入杆左右2米范围内，起落完成后点击下一步",
      text9: "请先用遥控把杆落下，再点击下一步",
      text10: "杆落地学习中，人车不要进入杆左右2米范围内",
      text11: "起杆学习超时，请重试",
			upend: "抬杆背景学习完成"
    }
  },
  debug: {
    recv: "调试区",
    send: "发送区",
    format: "显示格式:",
    btnSend: "发送指令",
    btnClearSend: "清除调试区",
    btnClearRecv: "清除发送区",
    disSend: "发送",
    disRecv: "接收",
		aera: "区域",
		sensitivity: "灵敏度",
		poletype: "杆子类型",
		cmd1: "用户自定义指令",
		cmd2: "一键读取雷达所有参数", 
		// cmd2: "读取环境参数指令",
		cmd3: "读取全部参数指令",
		cmd4: "读取人车区分参数指令",
		cmd5: "读取噪声参数指令",
		readsensitivity: "读取灵敏度",
		writesensitivity: "设置灵敏度",
  },
  aconfig: {
    btnRead: "读取雷达配置",
    btnSave: "保存雷达配置",
    btnRestart: "重启雷达",
    btnRestore: "恢复出厂配置",
		btnBleAutoConnect: "取消蓝牙自动关闭",

    name1: "人车区分",
    name2: "行车方向",
    name3: "继电器状态",

    description1: "区分人和车，打开后，检测到车后13秒内检测人",
    description2: "从雷达左侧或者右侧进入",
    description3: "",

    checkbox1: {
      close: "关闭",
      Strong: "强区分",
      Medium_strong: "中强区分",
      Medium: "中区分",
      Medium_weak: "中弱区分",
      Weak: "弱区分(推荐)",
    },
    checkbox2: {
      left: "左",
      both: "双向",
      right: "右",
    },
    checkbox3: {
      open: "常开",
      close: "常闭",
      disable: "失效"
    },
    modal: {
      reading: "读取中",
      saving: "保存中",
      notice: "提示",
      radarRestart: "确定重启雷达?",
      restarting: "重启中",
      restore: "确定恢复出厂设置?",
      restoring: "恢复出厂配置中",
      readingTout: "读取参数超时，请重试",
      savingTout: "保存参数超时，请重试",
      restartingTout: "重启雷达超时，请重试",
      restoreingTout: "恢复出厂超时，请重试",
      readsuccess: "读取成功",
      readfail: "读取失败",
      savesuccess: "保存成功",
      restartsuccess: "重启成功",
      restoresuccess: "恢复出厂配置成功",
      confirm: "确定",
      cancel: "取消"
    },
  },
  aconfig2: {
    items: {
      radarSensitivity: {
        name: "雷达灵敏度",
        text: "当前级别",
        unit: "级",
        limits: {
					10: "极低(不建议)",
          5: "低",
          4: "中低",
          3: "中",
          2: "中高",
          1: "高"
        }
      },
      delayDropTime: {
        name: "延迟落杆时间",
        text: "当前为 "
      },
      proximityNoDetect: {
        name: "临近不检测距离",
        text: "当前为 "
      },
      leftNoDetectWidth: {
        name: "左侧不检测距离宽度",
        text: "当前为 "
      },
      rightNoDetectWidth: {
        name: "右侧不检测距离宽度",
        text: "当前为 "
      },
      leftDetectWidth: {
        name: "左侧检测区域宽度",
        text: "当前为 "
      },
      rightDetectWidth: {
        name: "右侧检测区域宽度",
        text: "当前为 "
      },
      units: {
        second: "秒",
        meter: "米"
      }
    }
  },
	relay: {
		read: "读取",
		write: "写入",
		para1: "启动区域x左分米",
		para2: "启动区域x右分米",
		para3: "启动区域y临近不检测距离",
		para4: "启动区域y最大距离",
		para5: "启动继电器状态",
		para6: "启动区域状态",
		relay_state: {
			state0: "常开",
			state1: "常闭",
			state2: "失效",
		},
		aera_state: {
			state0: "关闭启动区域",
			state1: "开启启动区域",
		}
	},
}