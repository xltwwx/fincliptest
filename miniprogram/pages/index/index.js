Page({
  data: {
    searchQuery: '',
    cases: [],
    filteredCases: []
  },

  onLoad() {
    this.loadCases()
  },

  onShow() {
    // 每次显示页面时重新加载数据（支持从新增/编辑页返回后刷新）
    this.loadCases()
  },

  loadCases() {
    let cases = this.getCases()
    
    // 如果没有数据，使用默认数据
    if (cases.length === 0) {
      cases = [
        { id: 1, customerName: '张三', caseName: '房贷审批案例', type: '正常', date: '2024-01-15', status: '已完成', content: '客户张三申请房贷，资料齐全，顺利审批通过。' },
        { id: 2, customerName: '李四', caseName: '车贷被拒案例', type: '拒贷', date: '2024-01-16', status: '处理中', content: '客户李四车贷申请因信用记录不良被拒。' },
        { id: 3, customerName: '王五', caseName: '贷款选择困难', type: '纠结', date: '2024-01-17', status: '待处理', content: '客户王五在多家银行产品间犹豫不决。' },
        { id: 4, customerName: '赵六', caseName: '信用卡逾期案例', type: '逾期', date: '2024-01-18', status: '已结案', content: '客户赵六信用卡逾期，经协商达成还款计划。' }
      ]
      this.saveCases(cases)
    }
    
    this.setData({
      cases: cases,
      filteredCases: cases
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
    wx.navigateTo({
      url: '/pages/edit/edit'
    })
  },

  getCases() {
    try {
      const cases = wx.getStorageSync('cases')
      return cases ? JSON.parse(cases) : []
    } catch (e) {
      return []
    }
  },

  saveCases(cases) {
    wx.setStorageSync('cases', JSON.stringify(cases))
  }
})
