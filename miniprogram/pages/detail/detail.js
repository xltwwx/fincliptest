// pages/detail/detail.js
const app = getApp();

const MODULES = [
  { id: 'intro', title: '拟交流案例介绍', hint: '请录入案例标题、时间、客户姓名、客户类型、经营行业及贷款金额等基本信息。' },
  { id: 'customer', title: '客户基本信息与社区化', hint: '请录入客户的家庭情况、经营情况以及资产负债等社区化信息。' },
  { id: 'scheme', title: '贷款方案', hint: '请录入贷款利率、期限、担保方式及还款方式等具体方案内容。' },
  { id: 'investigation', title: '调查过程', hint: '请录入非现场调查和现场调查的具体过程与发现。' },
  { id: 'focus', title: '决策争议焦点', hint: '请录入该案例在决策过程中的核心争议点及模型分析结果。' },
];

Page({
  data: {
    formData: {
      id: '',
      name: '',
      customerName: '',
      customerId: '',
      businessType: '正常',
      duration: '00:00',
      date: '',
      type: '正常',
      intro: { title: '', time: '', customerName: '', customerType: '', industry: '', amount: '' },
      customerInfo: { family: '', business: '', assetsLiabilities: '' },
      loanScheme: { rate: '', term: '', guarantee: '', repayment: '' },
      investigation: { offSite: '', onSite: '' },
      decisionFocus: '',
      recordings: {}
    },
    modules: MODULES,
    businessTypes: ['正常', '纠结', '拒贷', '逾期'],
    businessTypeIndex: 0,
    showConfirm: false,
    isNewCase: false
  },

  onLoad(options) {
    const id = options.id;
    
    if (id === 'new') {
      // 新案例
      const today = new Date().toISOString().split('T')[0];
      this.setData({
        'formData.id': Math.random().toString(36).substr(2, 9),
        'formData.date': today,
        isNewCase: true
      });
    } else {
      // 编辑已有案例
      const caseItem = app.globalData.cases.find(c => c.id === id);
      if (caseItem) {
        const businessTypeIndex = this.data.businessTypes.indexOf(caseItem.type || caseItem.businessType || '正常');
        this.setData({
          formData: caseItem,
          businessTypeIndex: businessTypeIndex >= 0 ? businessTypeIndex : 0
        });
      }
    }
  },

  onCustomerIdInput(e) {
    this.setData({
      'formData.customerId': e.detail.value
    });
  },

  onBusinessTypeChange(e) {
    const index = e.detail.value;
    const type = this.data.businessTypes[index];
    this.setData({
      businessTypeIndex: index,
      'formData.businessType': type,
      'formData.type': type
    });
  },

  onModuleTap(e) {
    const module = e.currentTarget.dataset.module;
    // 清除之前的临时录音数据
    wx.removeStorageSync('tempRecording');
    wx.navigateTo({
      url: `/pages/recording/recording?moduleId=${module.id}&title=${encodeURIComponent(module.title)}&hint=${encodeURIComponent(module.hint)}`
    });
  },

  // 更新录音数据的方法（供 recording 页面调用）
  updateRecordingData(moduleId, content) {
    const key = `formData.recordings.${moduleId}`;
    this.setData({
      [key]: content
    });
  },

  onSubmitTap() {
    this.setData({ showConfirm: true });
  },

  hideConfirm() {
    this.setData({ showConfirm: false });
  },

  confirmSubmit() {
    const formData = this.data.formData;
    const name = formData.customerId ? `案例-${formData.customerId}` : '未命名案例';
    formData.name = name;

    // 保存数据
    const cases = app.globalData.cases || [];
    const existingIndex = cases.findIndex(c => c.id === formData.id);

    if (existingIndex >= 0) {
      // 更新已有案例
      cases[existingIndex] = formData;
    } else {
      // 添加新案例
      cases.unshift(formData);
    }

    app.globalData.cases = cases;
    wx.setStorageSync('cases', JSON.stringify(cases));

    this.hideConfirm();
    wx.navigateBack();
  },

  onShow() {
    // 从录音页面返回时，检查是否有新的录音数据
    const recordingData = wx.getStorageSync('tempRecording');
    if (recordingData && recordingData.moduleId) {
      const key = `formData.recordings.${recordingData.moduleId}`;
      this.setData({
        [key]: recordingData.content
      });
      // 不清除临时数据，等到下次进入录音页再清除
    }
  },

  // 编辑已有案例的方法
  onEditCase() {
    wx.showModal({
      title: '修改案例信息',
      editable: true,
      placeholderText: '请输入客户号',
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            'formData.customerId': res.content
          });
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 修改业务类型
  onModifyBusinessType() {
    wx.showActionSheet({
      itemList: this.data.businessTypes,
      success: (res) => {
        const index = res.tapIndex;
        const type = this.data.businessTypes[index];
        this.setData({
          businessTypeIndex: index,
          'formData.businessType': type,
          'formData.type': type
        });
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
      }
    });
  },

  onBack() {
    wx.navigateBack();
  }
})
