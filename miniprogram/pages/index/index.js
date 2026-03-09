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
        { id: 1, title: '房贷审批案例', category: '正常', date: '2024-01-15', content: '客户张三申请房贷，资料齐全，顺利审批通过。' },
        { id: 2, title: '车贷被拒案例', category: '拒贷', date: '2024-01-16', content: '客户李四车贷申请因信用记录不良被拒。' },
        { id: 3, title: '贷款选择困难', category: '纠结', date: '2024-01-17', content: '客户王五在多家银行产品间犹豫不决。' },
        { id: 4, title: '信用卡逾期案例', category: '逾期', date: '2024-01-18', content: '客户赵六信用卡逾期，经协商达成还款计划。' }
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
      return item.title.includes(query) || item.content.includes(query)
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
