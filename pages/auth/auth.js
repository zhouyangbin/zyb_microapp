var app = getApp();
const wxConfig = require('../../wxConfig.js')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onAuth() {
    wx.getSetting({
      success: (res) => {
        var user = wx.getStorageSync("user");        
        wx.getUserInfo({
          success: function(res){
            console.log(res.userInfo);
            console.log(res.rawData);
            wx.request({
              url: wxConfig.base_url+'/mini-user/users',
              method: 'POST',
              data: {
                'openid': user.openid,
                'nickName': res.userInfo.nickName,
                'avatarUrl': res.userInfo.avatarUrl,
                'gender': res.userInfo.gender,
                'country': res.userInfo.country,
                'province': res.userInfo.province,
                'city': res.userInfo.city,
                'language': res.userInfo.language
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {   
                
              }
            })
          }
        })  
        if (res.authSetting['scope.userInfo']) {
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }
    })
  }
})