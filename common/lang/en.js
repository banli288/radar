export default {
  statusBar: {
    title: "60GHz Barrier Gate Radar",
    advCfg: "Advanced Settings",
    cmdDebug: "Command Debugging"
  },
  tabBar: {
    home: "Connect",
    config: "Configuration",
    display: "Target Graph",
    more: "More"
  },
  more: {
    advancedConfig: "Advanced Settings",
    binUpdate: "Firmware upgrade function",
    remote: "Remote Support",
    commamd: "Command Debugging",
    userSheet: "Radar User Manual",
    userProtocol: "User Agreement",
    langSwitch: "Language Switch",
    toolInfo: "60GHz Barrier Gate Radar",
    prodInfo: "Version 1.1.7",
    advancedCont: "Operation requires professional guidance. Risk of vehicle damage! Confirm to proceed?",
    download: "Please Waitting Download",
    opensuccess: "Open Successfull",
    openfailed: "Open Failed",
    downFailed: "Download failed. Please check your network connection.",
		relay: "relay aera setting"
  },
  display: {
    text1: "Target Points:",
    btnStartDis: "Display objects",
    btnStopDis: "Stop Display objects",
    ClearDis: "Clear"
  },
  modal: {
    notice: "Notice",
    reading: "Reading...",
    saving: "Saving...",
    setting: "Setting...",
    seted: "Set Successfull",
    readSuccess: "Read Successfully",
    upStudyFinish: "Raise Pole Calibration Complete",
    dnstudyFinish: "Pole Movement Calibration Complete",
    studyFinish: "Calibration Complete",
    confirmText: "Confirm",
    confirmText1: "Next",
    cancelText: "Cancel",
    readTineout: "Read Timeout, Please Retry",
    conSuccess: "Connection Successful",
    disconBle: "Disconnect Bluetooth?",
    searchingDev: "Searching for Devices",
    openBleErr: "Bluetooth Failed - Please Enable Bluetooth",
    connecting: "Connecting...",
    closeBle: "Bluetooth Disconnected",
    connectErr: "Connection Failed, Please Retry",
    Bleconnected: "Bluetooth Connected",
    CloseRadarBLE: "The current radar Bluetooth can only be used again after a power-off and restart. Do you want to turn it off?",
  },
  config: {
    text1: "Vehicle Passing:",
    text2: "Pole Type:",
    text3: "Pole Length(m):",
    btnRead: "Read Radar Basic Parameters",
    btnSave: "Save Basic Parameters",
    btnUpStudy: "Raise Pole Calibration",
    btnDownStudy: "Pole Movement Calibration",
    studyEndNotice: "There is a risk involved. Please adjust the installation location, pole type, etc.",

    poleType: {
      type0: "Right-fixed straight pole",
      type1: "Left-fixed straight pole",
      type2: "Right-fixed railing pole",
      type3: "Left-fixed railing pole",
      type4: "Right-fixed advertising pole",
      type5: "Left-fixed advertising pole",
      type6: "Right-fixed airborne pole",
      type7: "Left-fixed airborne pole",
    },
    carType: {
      type0: "Small-curve passing (angle < 10°)",
      type1: "Straight-in & straight-out",
      type2: "Curve passing (angle < 25°) ",
    },
    btnCont: {
      btnRead: "Parameter Read Timeout",
      btnSave: "Parameter Save Timeout",
      btnUp: "Raise Calibration Timeout",
      btnDown: "Movement Calibration Timeout",
    },
    studyCont: {
      text1: "Use remote to raise pole, then click Next",
      text2: "Please confirm the barrier is in raised state",
      text3: "Keep pole raised. No people/vehicles within 2m range",
      text4: "Raise Calibration Timeout, Please Retry",
      text5: "Parameters saved successfully. Perform pole learning?",
      text6: "Use remote to cycle pole movement",
      text7: "Pole Movement Calibration in Progress",
      text8: "Cycle pole at least 3 times. No people/vehicles within 2m range. Click Next when done",
      text9: "Use remote to lower pole, then click Next",
      text10: "Lowering Calibration in Progress. No people/vehicles within 2m range",
      text11: "Raise Calibration Timeout, Please Retry"
    }
  },
  index: {
    text1: "Remote Connection",
    text2: "Product Model",
    text3: "Product ID",
    text4: "Hardware Version",
    text5: "Firmware Version",
    text6: "How to connect radar device?",
    text7: "Searching...",
    text8: "Refresh List",
    text9: "Turn off the radar Bluetooth and debug the next radar",

    bleBtnName: {
      connect: "Connect Bluetooth",
      disconnect: "Disconnect Bluetooth",
    }
  },
  debug: {
    recv: "Receive",
    send: "Send",
    format: "Format:",
    btnSend: "Send Command",
    btnClearSend: "Clear Send Area",
    btnClearRecv: "Clear Receive Area",
    disSend: "Send",
    disRecv: "Receive",
  },
  aconfig: {
    btnRead: "Read advanced radar parameters",
    btnSave: "Save Radar Config",
    btnRestart: "Radar Restarts",
    btnRestore: "Reset to Default Values",

    name1: "Human/Vehicle Distinction",
    name2: "Traffic Direction",
    name3: "Relay Status",

    description1: "Distinguish humans (yellow light) from vehicles",
    description2: "Vehicle approach direction",
    description3: "",

    checkbox1: {
      close: "Close",
      Strong: "Strong",
      Medium_strong: "Medium-strong",
      Medium: "Medium",
      Medium_weak: "Medium-weak",
      Weak: "Weak(recommend)",
    },
    checkbox2: {
      left: "Left",
      both: "Both",
      right: "Right",
    },
    checkbox3: {
      open: "Open",
      close: "Closed",
      disable: "Disable"
    },
    "modal": {
      "reading": "Reading",
      "saving": "Saving",
      "notice": "Notice",
      "radarRestart": "Confirm to restart radar?",
      "restarting": "Restarting",
      "restore": "Confirm to restore factory settings?",
      "restoring": "Restoring factory settings",
      "readingTout": "Parameter reading timed out, please retry",
      "savingTout": "Parameter saving timed out, please retry",
      "restartingTout": "Radar restart timed out, please retry",
      "restoreingTout": "Factory reset timed out, please retry",
      "readsuccess": "Read successfully",
      "readfail": "Read failed",
      "savesuccess": "Saved successfully",
      "restartsuccess": "Restarted successfully",
      "restoresuccess": "Factory settings restored successfully",
      "confirm": "Confirm",
      "cancel": "Cancel"
    }
  },
  aconfig2: {
    items: {
      radarSensitivity: {
        name: "Radar Sensitivity",
        text: "Current",
        unit: "Level",
        limits: {
          5: "Low",
          4: "Low-Medium",
          3: "Medium",
          2: "Medium-High",
          1: "High"
        }
      },
      delayDropTime: {
        name: "Delay Drop Time",
        text: "Current: "
      },
      proximityNoDetect: {
        name: "Proximity No-Detection Distance",
        text: "Current: "
      },
      leftNoDetectWidth: {
        name: "Left No-Detection Width",
        text: "Current: "
      },
      rightNoDetectWidth: {
        name: "Right No-Detection Width",
        text: "Current: "
      },
      leftDetectWidth: {
        name: "Left Detection Area Width",
        text: "Current: "
      },
      rightDetectWidth: {
        name: "Right Detection Area Width",
        text: "Current: "
      },
      units: {
        second: "sec",
        meter: "m"
      }
    }
  }
}