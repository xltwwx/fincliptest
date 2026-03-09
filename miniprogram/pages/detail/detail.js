Page({
  data: {
    caseDetail: null,
    isRecording: false,
    hasAudio: false,
    isPlaying: false,
    audioPath: ''
  },

  onLoad(options) {
    const id = parseInt(options.id)
    this.loadCaseDetail(id)
  },

  loadCaseDetail(id) {
    try {
      const cases = wx.getStorageSync('cases')
      const casesList = cases ? JSON.parse(cases) : []
      const caseData = casesList.find(c => c.id === id)

      if (caseData) {
        this.setData({
          caseDetail: caseData
        })
      } else {
        const mockData = {
          1: { id: 1, customerName: '张三', caseName: '房贷审批案例', type: '正常', date: '2024-01-15', status: '已完成', content: '客户张三申请房贷，资料齐全，顺利审批通过。' },
          2: { id: 2, customerName: '李四', caseName: '车贷被拒案例', type: '拒贷', date: '2024-01-16', status: '处理中', content: '客户李四因信用记录不良，车贷申请被拒。' },
          3: { id: 3, customerName: '王五', caseName: '贷款选择困难', type: '纠结', date: '2024-01-17', status: '待处理', content: '客户王五在多家银行贷款方案之间犹豫不决。' },
          4: { id: 4, customerName: '赵六', caseName: '信用卡逾期案例', type: '逾期', date: '2024-01-18', status: '已结案', content: '客户赵六信用卡逾期，经协商已制定还款计划。' }
        }
        this.setData({
          caseDetail: mockData[id] || null
        })
      }
    } catch (e) {
      console.error('加载案例失败', e)
    }
  },

  onBack() {
    wx.navigateBack()
  },

  onEdit() {
    if (this.data.caseDetail) {
      wx.navigateTo({
        url: `/pages/edit/edit?id=${this.data.caseDetail.id}`
      })
    }
  },

  onRecord() {
    if (this.data.isRecording) {
      this.stopRecord()
    } else {
      this.startRecord()
    }
  },

  startRecord() {
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      console.log('录音开始')
      this.setData({ isRecording: true })
    })

    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.setData({
        isRecording: false,
        hasAudio: true,
        audioPath: res.tempFilePath
      })
      wx.showToast({ title: '录音完成', icon: 'success' })
    })

    recorderManager.onError((err) => {
      console.error('录音错误', err)
      this.setData({ isRecording: false })
      wx.showToast({ title: '录音失败', icon: 'none' })
    })

    const systemInfo = wx.getSystemInfoSync()
    if (systemInfo.platform === 'devtools') {
      wx.showToast({ title: '模拟器中模拟录音', icon: 'none' })
      this.setData({ isRecording: true })
      setTimeout(() => {
        this.setData({
          isRecording: false,
          hasAudio: true,
          audioPath: 'simulated_audio.mp3'
        })
      }, 2000)
      return
    }

    wx.authorize({
      scope: 'scope.record',
      success: () => {
        recorderManager.start({
          duration: 60000,
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'mp3'
        })
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '需要录音权限，请在设置中开启',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) wx.openSetting()
          }
        })
      }
    })
  },

  stopRecord() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  onPlayAudio() {
    if (!this.data.audioPath) {
      wx.showToast({ title: '暂无录音', icon: 'none' })
      return
    }

    if (this.data.isPlaying) {
      this.stopAudio()
    } else {
      this.playAudio()
    }
  },

  playAudio() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = this.data.audioPath
    innerAudioContext.autoplay = true

    innerAudioContext.onPlay(() => {
      this.setData({ isPlaying: true })
    })

    innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false })
    })

    innerAudioContext.onError((res) => {
      console.error('播放错误', res)
      this.setData({ isPlaying: false })
      wx.showToast({ title: '播放失败', icon: 'none' })
    })

    innerAudioContext.play()
    this.innerAudioContext = innerAudioContext
  },

  stopAudio() {
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
      this.setData({ isPlaying: false })
    }
  },

  onDelete() {
    if (!this.data.caseDetail) return

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个案例吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            const cases = wx.getStorageSync('cases')
            let casesList = cases ? JSON.parse(cases) : []
            casesList = casesList.filter(c => c.id !== this.data.caseDetail.id)
            wx.setStorageSync('cases', JSON.stringify(casesList))
            
            wx.showToast({ title: '删除成功', icon: 'success' })
            setTimeout(() => wx.navigateBack(), 1500)
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  onUnload() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
  }
})
