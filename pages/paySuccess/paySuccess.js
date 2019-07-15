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
      payId: e.payId,
    }, () => {
      this.get_pay_detail();
    })
  },
  // 获取支付详情
  get_pay_detail() {
    let that = this;
    let sendData = null;
    sendData = {
      id: that.data.payId,
    };
    wx.request({
      url: wxConfig.base_url + "/mini-product/products/id",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.data) {
          that.setData({
            info: res.data.data,
            payableAmount: res.data.data.price,
            realAmount: res.data.data.price
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