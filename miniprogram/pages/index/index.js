Page({
  data: {
    searchQuery: '',
    filteredCases: [],
    cases: []
  },

  onLoad() {
    this.loadCases();
  },

  onShow() {
    this.loadCases();
  },

  loadCases() {
    const app = getApp();
    const cases = app.globalData.cases || [];
    
    // 按日期排序
    const sortedCases = cases.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    this.setData({
      cases: sortedCases,
      filteredCases: sortedCases
    });
  },

  onSearchInput(e) {
    const searchQuery = e.detail.value.toLowerCase();
    this.setData({ searchQuery });
    this.filterCases(searchQuery);
  },

  filterCases(query) {
    const cases = this.data.cases;
    const filtered = cases.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.customerName.toLowerCase().includes(query)
    );
    this.setData({ filteredCases: filtered });
  },

  getTypeColor(type) {
    const colors = {
      '纠结': 'bg-orange-100 text-orange-600',
      '拒贷': 'bg-red-100 text-red-600',
      '正常': 'bg-green-100 text-green-600',
      '逾期': 'bg-purple-100 text-purple-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  },

  onCaseTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  onAddCase() {
    wx.navigateTo({
      url: '/pages/detail/detail?id=new'
    });
  }
})
