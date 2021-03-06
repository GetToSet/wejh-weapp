let app = getApp()

Page({
  data: {
    wd: ''
  },
  onLoad (payload) {
    let _this = this
    app.$store.connect(this, 'teacher')
    this.observeCommon('teacher')
    this.observeCommon('icons')
    this.observeCommon('userInfo')

    setTimeout(() => {
      // 判断是否登录
      if (!app.isLogin() || !this.data.userInfo) {
        return wx.redirectTo({
          url: '/pages/login/login'
        })
      }
      if (payload && payload.name) {
        this.setState({
          wd: payload.name
        }, () => {
          this.getTeacher()
        })
      }
    }, 500)
  },
  bindClearSearchTap () {
    app.$store.setCommonState({
      teacher: {
        wd: '',
        list: []
      }
    })
  },
  bindSearchInput(e) {
    const value = e.detail.value
    if (!value) {
      this.bindClearSearchTap()
    }
    this.setState({
      wd: value
    })
  },
  call(e) {
    const phone = (e.target.dataset.phone || '').replace('－', '-')
    if (phone.match(/[^0-9\-]/g)) {
      wx.getClipboardData({
        success: function(res) {
          app.toast({
            icon: 'success',
            title: '复制成功'
          })
        }
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  },
  getTeacher (callback = this.afterGetTeacher) {
    wx.showLoading({
      title: '获取数据中'
    })
    app.services.getTeacher(callback, {
      data: {
        wd: this.data.wd
      },
      showError: true
    })
  },
  bindConfirmSearchTap () {
    this.getTeacher()
  },
  afterGetTeacher () {
    wx.hideLoading()
    setTimeout(() => {
      if (!this.data.teacher || this.data.teacher.list.length === 0) {
        app.toast({
          icon: 'error',
          title: '没有相关教师'
        })
      }
    }, 300)
  },
})
