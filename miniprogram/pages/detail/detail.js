Page({
  data: {
    caseDetail: null
  },

  onLoad(options) {
    const id = parseInt(options.id)
    // 模拟数据，实际应从全局或接口获取
    const mockData = {
      1: { id: 1, customerName: '张三', caseName: '房贷审批案例', type: '正常', date: '2024-01-15', status: '已完成', description: '客户张三申请房贷，资料齐全，顺利审批通过。' },
      2: { id: 2, customerName: '李四', caseName: '车贷被拒案例', type: '拒贷', date: '2024-01-16', status: '处理中', description: '客户李四因信用记录不良，车贷申请被拒。' },
      3: { id: 3, customerName: '王五', caseName: '贷款选择困难', type: '纠结', date: '2024-01-17', status: '待处理', description: '客户王五在多家银行贷款方案之间犹豫不决。' },
      4: { id: 4, customerName: '赵六', caseName: '信用卡逾期案例', type: '逾期', date: '2024-01-18', status: '已结案', description: '客户赵六信用卡逾期，经协商已制定还款计划。' }
    }
    
    this.setData({
      caseDetail: mockData[id] || null
    })
  },

  onBack() {
    wx.navigateBack()
  },

  onEdit() {
    wx.showModal({
      title: '提示',
      content: '编辑功能开发中',
      showCancel: false
    })
  },

  onRecord() {
    wx.showModal({
      title: '提示',
      content: '录音功能开发中',
      showCancel: false
    })
  }
})
