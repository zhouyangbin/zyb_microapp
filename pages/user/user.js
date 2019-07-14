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
    };
    this.checkScan();
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

        _this.setData({
          result: result,

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
  // 检查是否是扫码人员
  checkScan(e) {
    var user = wx.getStorageSync('user');
    console.log(user);
    var that = this;
    wx.request({
      url: wxConfig.base_url+'/mini-scan/check-scan',
      method: 'POST',
      data: {
        openid: user.openid,
        cellPhone: user.phoneNumber,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        if(res.data.code != 0) {
          that.setData({
            hidden: true
          })
        }
      },fail:function(err){

      }
    })
  }
})
