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

        _this.setData({
          result: result,

        })
      }
    })
  },
  getPhoneNumber(e){
    console.log(e);
    let user = wx.setStorageSync('openid');
    var url = wxConfig.base_url + '/mini-user/users/id';
    wx.request({
      url: url,
      data: {
        'openid': user.openid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200 && res.data.code == 0) {

        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'fail',
            duration: 1000
          });
        }
      }
    });
  }
})
