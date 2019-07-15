var wxConfig = require('../../wxConfig.js')
const app = getApp()
var user = wx.getStorageSync('user');
Page({
  data: {
    info: null,
    "bnrUrl": [{
      "url": "../../static/images/banner1.jpg"
    }, {
        "url": "../../static/images/banner2.jpg"
    }, {
        "url": "../../static/images/banner3.jpg"
    }, {
        "url": "../../static/images/banner4.jpg"
    }]
  },
  onLoad: function(e) {
    this.setData({
      openid: user.openid,
      orderId: e.order_id
    }, () => {
      this.get_pay_detail();
    })
  },
  // 获取支付详情
  get_pay_detail() {
    let that = this;
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
  my_order(){
    wx.switchTab({
      url: '../order/order',
    });
  }
})