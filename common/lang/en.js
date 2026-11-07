export default {
  statusBar: {
    title: "Barrier Gate Radar",
    advCfg: "Advanced Settings",
    cmdDebug: "Command Debugging"
  },
  tabBar: {
    home: "Connect",
    config: "Configuration",
    display: "Target Graph",
    more: "More"
  },
  index: {
    text0: "anti-crush radar",
    text1: "Product Model",
    text2: "Radar type",
    text3: "Product ID",
    text4: "Hardware Version",
    text5: "Firmware Version",
    text6: "The Bluetooth will automatically turn off after 30 minutes of \ninactivity. After the radar is powered off and restarted,\n the Bluetooth will be reactivated. Once a successful \nconnection is established, the blue light will come on.",
    text7: "Searching...",
    text8: "Refresh List",
    text9: "Turn off the radar Bluetooth and debug the next radar",
    text10: "Version",
    text11: "Info Code",
    text12: "Connect Sucess",

    bleBtnName: {
      connect: "Connect Bluetooth",
      disconnect: "Disconnect Bluetooth",
    },

    Notes: {
      title: "Usage Precautions",
      line1: "1: The radar must be powered by an independent power supply of 12V/2A or 24V/2A. Do not use the 12V output from the barrier gate control board for power supply;",
      line2: "2: For small vehicle passage, install at a height of 55~65cm above the ground; for large vehicle passage, install at a height of 70~80cm above the ground;",
      line3: "3: When installing the radar, the edge distance of the radar must be 15~22cm from the barrier gate arm to ensure usability. If it is a straight arm radar installed flush with or higher than the arm, or if an advertising board or warning light is installed on the arm, a fence arm (distinguishing left/right fixed) must be selected for use, and dynamic calibration must be performed;",
      line4: "4: For single-lane mixed entry/exit scenarios, it is recommended to install one radar on each side of the gate to ensure safety;",
      line5: "5: In scenarios where there is license plate recognition or other protruding objects in front of the radar, the radar must be installed separately using a column or bracket moved outward to ensure that radar performance is not interfered with by protruding objects;",
      line6: "6: When the radar is used at the entrance/exit of a logistics park, if there are scenarios with small cars, medium/large vehicles, long large vehicles, or trailer trucks, one radar has a blind spot. It is recommended to install two radars, one at 60cm and one at 80cm, and set the vehicle passage delay gate lowering function to ensure vehicle passage safety;",
      line7: "7: When the radar installation position, parameter settings, barrier arm deformation, or on-site scenario changes or is altered, the radar must be re-learned according to the radar mini-program scenario learning steps;",
      line8: "8: The radar is not suitable for use in large corner entrance/exit scenarios (e.g., when vehicles turn in/out and form an angle greater than 30° in front of the radar, the vehicle passage risk is too high, and it is not recommended for use);",
      line9: "9: During radar installation, if you have any questions or encounter special on-site scenarios, please contact the manufacturer promptly for confirmation.",
      confirm: "I have confirmed and read",
    },
  },
  more: {
    advancedConfig: "Advanced Settings",
    binUpdate: "Firmware upgrade function",
    remote: "Remote Support",
    commamd: "Command Debugging",
    userSheet: "Radar User Manual",
    userProtocol: "User Agreement",
    langSwitch: "Language Switch",
    toolInfo: "Barrier Gate Radar",
    prodInfo: "Version 1.1.20",
    advancedCont: "Operation requires professional guidance. Risk of vehicle damage! Confirm to proceed?",
    download: "Please Waitting Download",
    opensuccess: "Open Successfull",
    openfailed: "Open Failed",
    downFailed: "Download failed. Please check your network connection.",
    relay: "relay aera setting",
    relay_win: "The current device version is not supported."
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
    saved: "Successfull",
    readSuccess: "Successfully",
    upStudyFinish: "Raise Pole Calibration Complete",
    dnstudyFinish: "Pole Movement Calibration Complete",
    studyFinish: "Calibration Complete",
    confirmText: "Confirm",
    confirmText1: "Next",
    cancelText: "Cancel",
    finished: "Finished",
    readTineout: "Read Timeout",
    conSuccess: "Connection Successful",
    disconBle: "Disconnect Bluetooth?",
    searchingDev: "Searching for Devices",
    openBleErr: "Bluetooth Failed - Please Enable Bluetooth",
    connecting: "Connecting...",
    closeBle: "Disconnected",
    connectErr: "Connection Failed, Please Retry",
    Bleconnected: "Bluetooth Connected",
    CloseRadarBLE: "The current radar Bluetooth can only be used again after a power-off and restart. Do you want to turn it off?",
  },
  config: {
    text1: "Vehicle Passing:",
    text2: "Pole type:",
    text2_dis: "Facing away from the radar, the pole is on the side of the radar, indicating a fixed direction.",
    text3: "Longitudinal detection distance(米):",
    text3_dis: "The length of the pole is more than 0.5 meters shorter.",
    btnRead: "Read Radar Basic Parameters",
    btnSave: "Save Basic Parameters",
    btnUpStudy: "Raise Pole Calibration",
    btnDownStudy: "Pole Movement Calibration",
    studyEndNotice: "There is a risk involved. Please adjust the installation location, pole type, etc.",
    fixation_text: "Fixed Type",
    fixation_left: "Left Fixed",
    fixation_right: "Right Fixed",
    confirmText1: 'Next',
    cancelText: 'Cancel',
    finished: 'Finish',

    btnStudy: "Learn Scenario",
    selLeft: "Select Left Fixed",
    selRight: "Select Right Fixed",

    t_poleLen: "Pole Length (m)",
    t_leftDect: "Left Detection Range (m)",
    t_rightDect: "Right Detection Range (m)",
    t_delay: "Delay Setting (s)",

    info1: "Are you sure you want to close the radar learning scene? Once closed, the radar will terminate the learning function",
    info2: "Learning failed, radar not responding",
    info3: "Radar learning scene completed",

    poleType: {
      type0: "Straight Bar",
      type1: "Fence Bar",
      type2: "Advertising Bar",
      type3: "Parachute Bar",
      // type0: "Right-fixed straight pole",
      // type1: "Left-fixed straight pole",
      // type2: "Right-fixed railing pole",
      // type3: "Left-fixed railing pole",
      // type4: "Right-fixed advertising pole",
      // type5: "Left-fixed advertising pole",
      // type6: "Right-fixed airborne pole",
      // type7: "Left-fixed airborne pole",
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
      text6: "The configuration has been saved successfully. Do you want to proceed with the background learning of raising the barrier and the learning of barrier lifting and lowering?",
      text7: "In the process of learning to raise and lower the pole",
      text8: "Cycle pole at least 5 times. No people/vehicles within 2m range. Click Next when done",
      text9: "Use remote to lower pole, then click Next",
      text10: "Lowering Calibration in Progress. No people/vehicles within 2m range",
      text11: "Raise Calibration Timeout, Please Retry",
      upend: "The background learning of raising the bar is completed."
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
    area: "Area",
    sensitivity: "Sensitivity",
    poletype: "Pole Type",
    cmd1: "User-defined Command",
    cmd2: "One-click reading of all radar parameters",
    // cmd2: "Read Environment Parameters Command",
    cmd3: "Read All Parameters Command",
    cmd4: "Read Human-Vehicle Classification Parameters Command",
    cmd5: "Read Noise Parameters Command",
    readsensitivity: "Read Sensitivity",
    writesensitivity: "Set Sensitivity",
    copySuccess: "Copied successfully",
    copyFail: "Copy failed"
  },
  aconfig: {
    btnRead: "Read advanced radar parameters",
    btnSave: "Save Radar Config",
    btnRestart: "Radar Restarts",
    btnRestore: "Reset to Default Values",
    btnBleAutoConnect: "Disable automatic Bluetooth shutdown",

    name1: "Human/Vehicle Distinction",
    name2: "Traffic Direction",
    name3: "Relay Status",

    description1: "Distinguish between people and vehicles. After opening, if a vehicle is detected, a person will be detected within 13 seconds.",
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
      "readsuccess": "successfully",
      "readfail": "Read failed",
      "savesuccess": "successfully",
      "restartsuccess": "successfully",
      "restoresuccess": "successfully",
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
          10: "Extremely low (not recommended)",
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
  },
  relay: {
    read: "Read",
    write: "Write",
    para1: "Decimeters of the left side of start area X",
    para2: "Decimeters of the right side of start area X",
    para3: "Proximity non-detection distance of start area Y",
    para4: "Maximum distance of start area Y",
    para5: "The status of the start relay",
    para6: "Startup area status",
    relay_state: {
      state0: "Normally Open",
      state1: "Normally Closed",
      state2: "Invalid",
    },
    aera_state: {
      state0: "Disable start area",
      state1: "Enable start area",
    }
  },
  study: {
    step1: "Step 1",
    line1: "Use the remote control to keep the barrier gate arm in the lowered position; Note: First remove all obstacles from the lane. During the radar learning process, ensure there are no interfering targets such as vehicles and pedestrians! (Within 3 meters on both the left and right sides of the radar sensing area)",
    head1: "Use the remote control to raise the barrier gate arm and keep it in the raised position!",
    step2: "Step 2",
    line2: "Learning the gate closing scenario, please wait.....",
    head2: "Learning the gate opening scenario!",
    step3: "Step 3",
    line3: "Note: During the radar learning process, ensure that no vehicles, pedestrians, or other objects enter within 3 meters on the left/right sides of the radar sensing area to interfere with the radar learning scenario.",
    head3: "Dynamic learning. Use the remote control to raise and lower the barrier gate arm 3 to 5 times!",
    step4: "Step 4",
    line4: "Note: During the radar learning process, ensure that no vehicles, pedestrians, or other objects enter within 3 meters on the left/right sides of the radar sensing area to interfere with the radar learning scenario.",
    head4: "Use the remote control to lower the barrier gate arm and keep it in the lowered position!",
    step5: "Step 5",
    line5: "Note: During the radar learning process, ensure that no vehicles, pedestrians, or other objects enter within 3 meters on the left/right sides of the radar sensing area to interfere with the radar learning scenario.",
    head5: "Learning the gate closing scenario!",
    stepFinish: "Scenario learning completed",
    lineFinish: "Congratulations, the radar learning is complete. Please use it!",
  },

  copy: "Copy",

  b_readParam: "Read Parameters",
  b_saveParam: "Save Parameters",
  b_restore: "Restore Factory Settings",

  b_readEnvParam: "Environment Parameters",
  b_readAllParam: "All Parameters",
  b_readCarParam: "Pedestrian-Vehicle Distinction",
  b_readBkgParam: "Background Noise",
}