var wxConfig = require('../../wxConfig.js')
const app = getApp()
Page({
  data: {
    info: null,
    adList: []
  },
  onLoad: function(e) {
    var user = wx.getStorageSync('user')
    this.setData({
      openid: user.openid,
      orderId: e.order_id
    }, () => {
      this.get_pay_detail();
      this.ad();
    })
  },
  // 获取支付详情
  get_pay_detail: function() {
    let that = this
    var user = wx.getStorageSync('user')
    wx.request({
      url: wxConfig.base_url + "/mini-order/details",
      data: {
        openid: user.openid,
        orderId: that.data.orderId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.data) {
          that.setData({
            info: res.data.data,
          });
        }
      },
      fail: function(err) {
        wx.showToast({
          title: "获取失败",
          icon: 'fail',
          duration: 2000
        })
      }, //请求失败
    })
  },
  my_order: function() {
    wx.switchTab({
      url: '../order/order',
    });
  },
  // 获取广告内容
  ad: function() {
    let that = this;
    wx.request({
      url: wxConfig.base_url + '/ad/adverts',
      method: 'GET',
      data: {
        position: 2,
        enabled: 1
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({
            adList: res.data.data
          })
        }
      },
      fail(err) {

      }
    })
  },
  jump:function(e){
    wx.redirectTo({
      url: e.currentTarget.dataset.link,
    })
  },
})