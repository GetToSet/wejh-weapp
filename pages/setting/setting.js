let app = getApp()

Page({
  data: {
  },
  onLoad: function () {
    let _this = this
    app.$store.connect(this, 'setting')
    this.observeCommon('userInfo')
  }
})
