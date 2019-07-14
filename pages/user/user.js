//index.js
//获取应用实例
const app = getApp()
const wxConfig = require('../../wxConfig.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hidden: false,

  },
  onLoad: function () {
    console.log(wx);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          hidden: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            hidden: true
          })
        }
      })
    }
  },
  onShow(){
    console.log(app.globalData.userInfo)
  },
  getScancode: function () {
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
  phonenumber_order(){
    wx.navigateTo({
      url: '../check_order/check_order',
    })
  },
  getPhoneNumber(e) {
    var user = wx.getStorageSync('user');   
    wx.request({
      url: wxConfig.base_url +'/wechat/phoneNumber',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        openid: user.openid,
        sessionKey: user.session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,        
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          console.log(res.data.data);
      } else {
          wx.showToast({
            title: '获取失败',
            icon: 'fail',
            duration: 1000
          });
        }
      },
    });
  },
  submitOrder : function(e) {
    var user = wx.getStorageSync('user'); 

    wx.redirectTo({
      url: '/pages/pay/pay?timeStamp=1563002622&nonceStr=1523423607&package=&prepay_id=wx131523426436482ec791051d1411109700&signType=MD5&paySign=B19D1F05B006E65561B9A3BBA64BA073&appid=wx6f8898d9291238a1&orderNo=201907132504408185176064&totalFee=10'
    })  
    // wx.request({
    //   url: wxConfig.base_url+'/mini-order/order',
    //   method: 'POST',
    //   data: {
    //     openid: user.openid,
    //     productId: 18,
    //     ticketNums: 1,
    //     cellPhone: '18610612576',
    //     payableAmount: 0.1,
    //     realAmount: 0.1
    //   },
    //   header: { 'content-type': 'application/x-www-form-urlencoded' },
    //   success: function(e){
    //     wx.request({
    //       url: e.data.data.redirect_url,
    //       data:{
    //         openId: user.openid
    //       },
    //       header: { 'content-type': 'application/x-www-form-urlencoded' },
    //       success: function(pay) {
    //         var that = this;
    //         console.log("----------------");
    //         var payUrl = pay.data;
    //         console.log(payUrl);
    //          wx.redirectTo({
    //            url: '/pages/pay/pay?timeStamp=1563002622&nonceStr=1523423607&package=prepay_id=wx131523426436482ec791051d1411109700& signType=MD5&paySign=B19D1F05B006E65561B9A3BBA64BA073&appid=wx6f8898d9291238a1&orderNo=201907132504408185176064&totalFee=10'
    //          })
    //       } 
    //     })
    //   }
    // })
  },
  submitRedirect: function(e) {
    wx.redirectTo({
      url: '/pages/pay/pay?id=1',
    })
  }
})
