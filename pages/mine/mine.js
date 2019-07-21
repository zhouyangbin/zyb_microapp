// pages/mine/mine.js
var app = getApp()
const wxConfig = require('../../wxConfig.js')
var user = wx.getStorageSync('user');
// pages/mine/mine.js
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [{
        typeId: 0,
        name: '待支付',
        url: '../order/order?tab_index=3',
        imageurl: '../../component/images/person/personal_pay.png',
      },
      {
        typeId: 1,
        name: '待消费',
        url: '../order/order?tab_index=2',
        // url: '../QR_check_order/QR_check_order?orderId=114',
        imageurl: '../../component/images/person/personal_consume.png',
      }
    ],
    hidden: false,
    number: 0,
  },
  //事件处理函数
  toOrder: function(e) {
    if (e.currentTarget.dataset.url != undefined) {
      wx.reLaunch({
        url: e.currentTarget.dataset.url
      })
    }

  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.checkScan();
    this.scan();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  myAddress: function(e) {
    wx.navigateTo({
      url: '../addressList/addressList'
    });
  },
  getScancode: function() {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        console.log(result);
        wx.navigateTo({
          url: "../QR_check_order/QR_check_order?key_word=" + 123,
        })
      }
    })
  },
  phonenumber_order() {
    wx.navigateTo({
      url: '../check_order/check_order',
    })
  },
  // 检查是否是扫码人员
  checkScan: function(e) {
    var that = this;
    wx.request({
      url: wxConfig.base_url + '/mini-scan/check-scan',
      method: 'POST',
      data: {
        openid: user.openid,
        cellPhone: user.phoneNumber,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code != 0) {
          that.setData({
            hidden: true
          })
        }
      },
      fail: function(err) {

      }
    })
  },
  // 检查扫码人员当天扫码数量
  scan: function() {
    var that = this;
    let d = new Date();
    let date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    wx.request({
      url: wxConfig.base_url + '/mini-scan/scan',
      data: {
        openid: user.openid,
        cellPhone: user.phoneNumber,
        startTime: date + ' 00:00:00',
        endTime: date + ' 23:59:59'
      },
      success: function(res) {
        if (res.data.data != null) {
          that.setData({
            number: res.data.data.count
          })
        }
      },
      fail: function(err) {
      }
    })
  }
})