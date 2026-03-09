Page({
  data: {
    searchQuery: '',
    cases: [
      { id: 1, customerName: '张三', caseName: '房贷审批案例', type: '正常', date: '2024-01-15', status: '已完成' },
      { id: 2, customerName: '李四', caseName: '车贷被拒案例', type: '拒贷', date: '2024-01-16', status: '处理中' },
      { id: 3, customerName: '王五', caseName: '贷款选择困难', type: '纠结', date: '2024-01-17', status: '待处理' },
      { id: 4, customerName: '赵六', caseName: '信用卡逾期案例', type: '逾期', date: '2024-01-18', status: '已结案' }
    ],
    filteredCases: []
  },

  onLoad() {
    this.setData({
      filteredCases: this.data.cases
    })
  },

  onSearchInput(e) {
    const query = e.detail.value
    this.filterCases(query)
  },

  filterCases(query) {
    const filtered = this.data.cases.filter(item => {
      return item.customerName.includes(query) || item.caseName.includes(query)
    })
    this.setData({
      filteredCases: filtered,
      searchQuery: query
    })
  },

  onCaseTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  onAddCase() {
    wx.showModal({
      title: '提示',
      content: '新增案例功能开发中',
      showCancel: false
    })
  }
})
