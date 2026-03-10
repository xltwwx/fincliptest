// pages/recording/recording.js
let timerInterval = null;

Page({
  data: {
    moduleId: '',
    title: '',
    hint: '',
    isRecording: false,
    hasRecording: false,
    hasExistingRecording: false,  // 标记是否有已存在的录音
    recordingContent: '',
    timer: 0,
    formattedTime: '00:00',
    statusText: '准备就绪',
    controlHint: '点击蓝色按钮开始录音'
  },

  onLoad(options) {
    this.setData({
      moduleId: options.moduleId || '',
      title: decodeURIComponent(options.title || ''),
      hint: decodeURIComponent(options.hint || '')
    });

    // 检查是否已有录音
    this.checkExistingRecording();
  },

  onShow() {
    // 每次显示时检查是否有录音数据
    this.checkExistingRecording();
  },

  checkExistingRecording() {
    const tempData = wx.getStorageSync('tempRecording');
    if (tempData && tempData.moduleId === this.data.moduleId && tempData.content) {
      this.setData({
        hasRecording: true,
        hasExistingRecording: true,
        recordingContent: tempData.content,
        isRecording: false,
        statusText: '录音已完成',
        controlHint: '您可以试听或重新录制'
      });
    }
  },

  onUnload() {
    this.stopTimer();
  },

  startTimer() {
    let seconds = 0;
    this.setData({ timer: 0, formattedTime: '00:00' });
    
    timerInterval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      this.setData({
        timer: seconds,
        formattedTime: formatted
      });
    }, 1000);
  },

  stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  },

  onRecordTap() {
    if (this.data.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },

  startRecording() {
    this.setData({
      isRecording: true,
      statusText: '正在录音中...',
      controlHint: '点击红色按钮停止录音'
    });
    this.startTimer();

    // 使用微信原生录音 API（真机有效）
    try {
      const recorderManager = wx.getRecorderManager();
      
      recorderManager.onStart(() => {
        console.log('recorder start');
      });
      
      recorderManager.onStop((res) => {
        console.log('recorder stop', res);
        // 保存录音数据（模拟）
        const content = `录音文件：${res.tempFilePath} - ${new Date().toLocaleTimeString()}`;
        this.setData({
          hasRecording: true,
          recordingContent: content,
          statusText: '录音已完成',
          controlHint: '您可以试听或重新录制'
        });
        
        // 保存到临时存储
        wx.setStorageSync('tempRecording', {
          moduleId: this.data.moduleId,
          content: content,
          tempFilePath: res.tempFilePath
        });
      });

      recorderManager.onError((err) => {
        console.error('recorder error', err);
        // 出错时使用模拟数据
        this.handleSimulatedRecording();
      });

      // 开始录音
      recorderManager.start({
        duration: 60000, // 最长 60 秒
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000
      });
    } catch (e) {
      // 模拟器或不支持时使用模拟
      console.log('使用模拟录音');
      this.handleSimulatedRecording();
    }
  },

  handleSimulatedRecording() {
    this.stopTimer();
    const content = `模拟录音数据 - ${this.data.title} - ${new Date().toLocaleTimeString()}`;
    this.setData({
      isRecording: false,
      hasRecording: true,
      hasExistingRecording: true,
      recordingContent: content,
      statusText: '录音已完成',
      controlHint: '您可以试听或重新录制'
    });
    
    wx.setStorageSync('tempRecording', {
      moduleId: this.data.moduleId,
      content: content
    });
  },

  stopRecording() {
    this.setData({
      isRecording: false
    });
    this.stopTimer();

    try {
      const recorderManager = wx.getRecorderManager();
      recorderManager.stop();
    } catch (e) {
      // 模拟器模式
      this.handleSimulatedRecording();
    }
  },

  onReRecord() {
    // 删除当前录音，准备重新录制
    this.setData({
      hasRecording: false,
      hasExistingRecording: false,
      recordingContent: '',
      timer: 0,
      formattedTime: '00:00',
      statusText: '准备就绪',
      controlHint: '点击蓝色按钮开始录音'
    });
    wx.removeStorageSync('tempRecording');
  },

  onDelete() {
    // 仅在有已有录音时显示删除确认
    if (this.data.hasExistingRecording) {
      wx.showModal({
        title: '确认删除',
        content: '是否删除当前录音并重新录制？',
        success: (res) => {
          if (res.confirm) {
            this.onReRecord();
          }
        }
      });
    } else {
      this.onReRecord();
    }
  },

  onPlay() {
    if (this.data.recordingContent) {
      wx.showToast({
        title: '播放录音（演示）',
        icon: 'none'
      });
      // 实际使用时可以用 wx.createInnerAudioContext() 播放音频
    }
  },

  onComplete() {
    if (this.data.hasRecording) {
      // 保存录音数据到模块
      const tempData = wx.getStorageSync('tempRecording');
      if (tempData) {
        // 通知 detail 页面更新录音数据
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.updateRecordingData) {
          prevPage.updateRecordingData(this.data.moduleId, tempData.content);
        }
      }
      wx.navigateBack();
    } else {
      // 没有录音也允许返回，清空该模块的录音
      wx.removeStorageSync('tempRecording');
      wx.navigateBack();
    }
  },

  onClose() {
    // 不清除临时数据，保留录音结果
    wx.navigateBack();
  }
})
