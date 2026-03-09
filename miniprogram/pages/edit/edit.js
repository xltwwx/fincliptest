Page({
  data: {
    formData: {
      title: '',
      content: ''
    },
    categories: ['正常', '拒贷', '纠结', '逾期'],
    categoryIndex: 0,
    editId: null
  },

  onLoad(options) {
    // 如果是编辑模式，加载现有数据
    if (options.id) {
      const id = parseInt(options.id)
      const cases = this.getCases()
      const caseData = cases.find(c => c.id === id)
      
      if (caseData) {
        const catIndex = this.data.categories.indexOf(caseData.category || '正常')
        this.setData({
          editId: id,
          formData: {
            title: caseData.title || '',
            content: caseData.content || '',
            category: caseData.category || '正常'
          },
          categoryIndex: catIndex >= 0 ? catIndex : 0
        })
        wx.setNavigationBarTitle({ title: '编辑案例' })
      }
    }
  },

  onCategoryChange(e) {
    const index = e.detail.value
    this.setData({
      categoryIndex: index,
      'formData.category': this.data.categories[index]
    })
  },

  onSubmit(e) {
    const form = e.detail.value
    
    if (!form.title || !form.content) {
      wx.showToast({
        title: '请填写标题和内容',
        icon: 'none'
      })
      return
    }

    let cases = this.getCases()
    const category = this.data.categories[this.data.categoryIndex]
    
    if (this.data.editId) {
      // 编辑模式
      const index = cases.findIndex(c => c.id === this.data.editId)
      if (index !== -1) {
        cases[index] = {
          ...cases[index],
          title: form.title,
          content: form.content,
          category: category
        }
      }
    } else {
      // 新增模式
      const newCase = {
        id: Date.now(),
        title: form.title,
        content: form.content,
        category: category,
        date: new Date().toISOString().split('T')[0]
      }
      cases.unshift(newCase)
    }

    this.saveCases(cases)
    
    wx.showToast({
      title: this.data.editId ? '保存成功' : '添加成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  onCancel() {
    wx.navigateBack()
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
