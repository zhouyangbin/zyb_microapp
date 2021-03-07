var wxConfig = require('../../wxConfig.js')
const app = getApp()
Page({
  data: {
    info: null,
    adList: []
  },
  onLoad: function(e) {
    let user = wx.getStorageSync('user');
    this.setData({
      openid: user.openid,
      orderId: e.orderId
    }, () => {
      this.get_order_detail();
      this.ad();
    })
  },
  // 获取支付详情
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
          that.setData({
            info: res.data.data
          })
        }
      },
      fail: function (err) {
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
        position: 1,
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
  doRefund: function(e) {
    let that = this;
    wx.showModal({
      title: '申请退款',
      content: '',
      cancelText: '取消',
      confirmText: '继续退款',
      success(r) {
        if (r.confirm) {
          let user = wx.getStorageSync('user');
          console.log(that.data.info)
          wx.request({
            url: wxConfig.base_url+'/mini-order/refund',
            method: 'POST',
            header:{'content-type': 'application/x-www-form-urlencoded'},                                 
            data: {
              openid: user.openid,
              order_no: that.data.info.orderNo,
            },
            success(res){
              wx.switchTab({
                url: '../order/order',
              });
            },
            fail(err){
              wx.switchTab({
                url: '../order/order',
              });
            }
          })
        } if (r.cancel) {
          
        }
      }
    })
  },
})