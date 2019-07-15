//app.js
var wxConfig = require('./wxConfig.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('wx_login', res);
        this.getOpenid();
        // this.getPermission();
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // wx.reLaunch({
        //   url: '/pages/auth/auth',
        // })
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              };
            }
          });
        } else {
          // 未授权，跳转到授权页面
          wx.reLaunch({
            url: '/pages/auth/auth',
          })
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    addressinfo:null,
    Permissionaddressinfo: null,
  },
  getOpenid() {
    var wx_login = wx.getStorageSync('wx_login'); //code这里存储了 
    var url = wxConfig.base_url+'/wechat/code2Session';
    wx.request({
      url: url,
      data: {
        'code': wx_login.code
      },
      method: 'POST', 
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {        
        var obj = {};
        if (res.statusCode == 200){
          obj.openid = res.data.openid;
          obj.session_key = res.data.session_key;
          if (res.data.unionid != undefined) {
              obj.unionid = res.data.unionid;
          }
          if(res.data.phoneNumber != undefined) {
            obj.phoneNumber = res.data.phoneNumber;
          }
          obj.expires_in = Date.now() + 7200;
          wx.setStorageSync('user', obj);//存储openid
        }else{
          wx.showToast({
            title: '获取失败',
            icon: 'fail',
            duration: 1000
          });
        }
      }
    });
  },
  getLocation: function (target) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.globalData.addressinfo = res;
        target.get_addr(res)
      }
    })
  },
  //获取用户地理位置权限
  getPermission: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res,"???")
        that.globalData.Permissionaddressinfo = res;
        // obj.setData({
        //   addr: res      //调用成功直接设置地址
        // },()=>{
        //   obj.get_addr();
        // })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          });
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              console.log(res, "111???")
                              that.globalData.Permissionaddressinfo = res;
                              // obj.setData({
                              //   addr: res.address
                              // })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
})