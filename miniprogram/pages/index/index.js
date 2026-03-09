// pages/index/index.js
const app = getApp();

Page({
  data: {
    cases: [],
    searchQuery: '',
    filteredCases: []
  },

  onLoad() {
    this.loadCases();
  },

  loadCases() {
    const cases = app.globalData.cases || [];
    // 按日期排序
    const sortedCases = [...cases].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.setData({ 
      cases: sortedCases,
      filteredCases: sortedCases
    });
  },

  onSearchInput(e) {
    const query = e.detail.value.toLowerCase();
    this.setData({ searchQuery: e.detail.value });
    
    const filtered = this.data.cases.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.customerName.toLowerCase().includes(query)
    );
    
    this.setData({ filteredCases: filtered });
  },

  onCaseTap(e) {
    const id = e.currentTarget.dataset.id;
    const caseItem = this.data.cases.find(c => c.id === id);
    if (caseItem) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  },

  onAddTap() {
    wx.navigateTo({
      url: '/pages/detail/detail?id=new'
    });
  },

  onShow() {
    // 每次显示页面时重新加载数据
    this.loadCases();
  }
})
