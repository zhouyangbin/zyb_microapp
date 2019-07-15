var wxConfig = require('../../wxConfig.js')
const app = getApp()
var user = wx.getStorageSync('user');
Page({
  data: {
    info: null,
    orderId:null,
  },
  onLoad: function(e) {
    this.setData({
      orderId: e.orderId,
    }, () => {
      this.get_order_detail();
    })
  },
  // 获取项目详情
  get_order_detail() {
    let user = wx.getStorageSync('user');
    let that = this;
    let sendData = null;
    sendData = {
      openid: user.openid,
      orderId: this.data.orderId
    };
    wx.request({
      url: wxConfig.base_url + "/mini-order/details",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.data) {
          console.log(res.data.data)
          that.setData({
            info: res.data.data
          })
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
})