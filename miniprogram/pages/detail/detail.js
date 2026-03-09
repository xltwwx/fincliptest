const MODULES = [
  { id: 'intro', title: '拟交流案例介绍', hint: '请录入案例标题、时间、客户姓名、客户类型、经营行业及贷款金额等基本信息。' },
  { id: 'customer', title: '客户基本信息与社区化', hint: '请录入客户的家庭情况、经营情况以及资产负债等社区化信息。' },
  { id: 'scheme', title: '贷款方案', hint: '请录入贷款利率、期限、担保方式及还款方式等具体方案内容。' },
  { id: 'investigation', title: '调查过程', hint: '请录入非现场调查和现场调查的具体过程与发现。' },
  { id: 'focus', title: '决策争议焦点', hint: '请录入该案例在决策过程中的核心争议点及模型分析结果。' },
];

Page({
  data: {
    formData: null,
    isNewCase: false,
    activeRecording: null,
    showConfirm: false,
    modules: MODULES,
    // Recording state
    isRecording: false,
    hasRecording: false,
    recordingContent: '',
    timerSeconds: 0,
    timerDisplay: '00:00',
    timerInterval: null
  },

  onLoad(options) {
    const app = getApp();
    const caseId = options.id;
    
    if (caseId === 'new') {
      // 新建案例
      const newCase = {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        customerName: '',
        customerId: '',
        businessType: '正常',
        duration: '00:00',
        date: new Date().toISOString().split('T')[0],
        type: '正常',
        intro: { title: '', time: '', customerName: '', customerType: '', industry: '', amount: '' },
        customerInfo: { family: '', business: '', assetsLiabilities: '' },
        loanScheme: { rate: '', term: '', guarantee: '', repayment: '' },
        investigation: { offSite: '', onSite: '' },
        decisionFocus: '',
        recordings: {}
      };
      this.setData({ 
        formData: newCase,
        isNewCase: true 
      });
    } else {
      // 编辑已有案例
      const cases = app.globalData.cases || [];
      const existingCase = cases.find(c => c.id === caseId);
      if (existingCase) {
        this.setData({ 
          formData: JSON.parse(JSON.stringify(existingCase)),
          isNewCase: false 
        });
      }
    }
  },

  onUnload() {
    // 清理定时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
  },

  onCustomerIdInput(e) {
    this.setData({
      'formData.customerId': e.detail.value
    });
  },

  onBusinessTypeChange(e) {
    const value = e.detail.value;
    this.setData({
      'formData.businessType': value,
      'formData.type': value
    });
  },

  onModuleTap(e) {
    const moduleId = e.currentTarget.dataset.id;
    const module = MODULES.find(m => m.id === moduleId);
    const hasRecording = !!(this.data.formData.recordings && this.data.formData.recordings[moduleId]);
    
    this.setData({
      activeRecording: module,
      hasRecording: hasRecording,
      recordingContent: hasRecording ? this.data.formData.recordings[moduleId] : '',
      isRecording: false,
      timerSeconds: 0,
      timerDisplay: '00:00'
    });
    
    // 清除之前的定时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }
  },

  onCloseRecording() {
    this.setData({
      activeRecording: null,
      isRecording: false
    });
    
    // 清除定时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }
  },

  onCompleteRecording() {
    // 保存录音内容
    if (this.data.activeRecording && this.data.recordingContent) {
      const recordings = { ...this.data.formData.recordings };
      recordings[this.data.activeRecording.id] = this.data.recordingContent;
      
      this.setData({
        'formData.recordings': recordings
      });
    }
    
    this.onCloseRecording();
  },

  onToggleRecording() {
    if (this.data.isRecording) {
      // 停止录音
      this.stopRecording();
    } else {
      // 开始录音
      this.startRecording();
    }
  },

  startRecording() {
    this.setData({ isRecording: true, timerSeconds: 0 });
    
    const interval = setInterval(() => {
      const newSeconds = this.data.timerSeconds + 1;
      const mins = Math.floor(newSeconds / 60);
      const secs = newSeconds % 60;
      const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      this.setData({
        timerSeconds: newSeconds,
        timerDisplay: display
      });
    }, 1000);
    
    this.setData({ timerInterval: interval });
  },

  stopRecording() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    
    this.setData({
      isRecording: false,
      hasRecording: true,
      recordingContent: `模拟录音数据 - ${this.data.activeRecording.title} - ${new Date().toLocaleTimeString()}`
    });
  },

  onDeleteRecording() {
    this.setData({
      hasRecording: false,
      recordingContent: '',
      timerSeconds: 0,
      timerDisplay: '00:00'
    });
  },

  onSaveRecording(e) {
    const { moduleId, content } = e.detail;
    const recordings = { ...this.data.formData.recordings };
    
    if (!content) {
      delete recordings[moduleId];
    } else {
      recordings[moduleId] = content;
    }
    
    this.setData({
      'formData.recordings': recordings
    });
  },

  onShowConfirm() {
    this.setData({ showConfirm: true });
  },

  onHideConfirm() {
    this.setData({ showConfirm: false });
  },

  onSubmitConfirm() {
    const app = getApp();
    const formData = this.data.formData;
    
    // 更新案例名称
    formData.name = formData.customerId ? `案例-${formData.customerId}` : '未命名案例';
    
    if (this.data.isNewCase) {
      // 新增案例
      app.globalData.cases.unshift(formData);
    } else {
      // 更新案例
      const cases = app.globalData.cases;
      const index = cases.findIndex(c => c.id === formData.id);
      if (index >= 0) {
        cases[index] = formData;
      }
    }
    
    wx.navigateBack();
  },

  onBack() {
    wx.navigateBack();
  }
})
