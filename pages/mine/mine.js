// pages/mine/mine.js
var app = getApp()
const wxConfig = require('../../wxConfig.js')
var util = require('../../utils/util.js');
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
        imageurl: '../../component/images/person/personal_consume.png',
      }
    ],
    hidden: 0,
    number: 0,
    scene:"",
    phoneNumber: ""
  },
  //事件处理函数
  toOrder: function(e) {
    if (e.currentTarget.dataset.url != undefined) {
      wx.reLaunch({
        url: e.currentTarget.dataset.url
      })
    }

  },
  onLoad: function(query) {
    const scene = decodeURIComponent(query.scene);
    if(scene != "") {
      this.setData({
        scene: scene
      })
    }
    
    var user = wx.getStorageSync('user');    
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
    if(user.phoneNumber != undefined) {
      this.setData({
        phoneNumber: user.phoneNumber
      });
    }
    
    this.checkScan();
    this.scan();
  },  
  onShow: function () {
    this.checkScan();
    this.scan();
  },
  getUserInfo: function(e) {    
    app.globalData.userInfo = e.detail.userInfo
        
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    try {
      console.log(e.detail.userInfo)
      var user = wx.getStorageSync("user")
      // 更新用户信息表
      var data = {
        'openid': user.openid,
        'nickName': e.detail.userInfo.nickName,
        'avatarUrl': e.detail.userInfo.avatarUrl,
        'gender': e.detail.userInfo.gender,
        'country': e.detail.userInfo.country,
        'province': e.detail.userInfo.province,
        'city': e.detail.userInfo.city,
        'language': e.detail.userInfo.language
      };
      if (user.unionid != undefined) {
        data.unionid = user.unionid;
      };
      wx.request({
        url: wxConfig.base_url + '/mini-user/users',
        method: 'POST',
        data: data,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
        }
      })
    } catch(e) {
    }    
  },
  myAddress: function(e) {
    wx.navigateTo({
      url: '../addressList/addressList'
    });
  },
  getScancode: function() {
    let that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        let scene = [];        
        if(result !=undefined && result != "") {          
          scene = result.split(";");
          that.setData({
            scene: scene[scene.length-1]
          })
        } else if(res.path != undefined) {
          let path = res.path;
          let orderId = path.replace("pages/QR_check_order/QR_check_order?scene=orderId%3D","")
          orderId = orderId.replace("pages/QR_check_order/QR_check_order?scene=orderId=","")
          wx.navigateTo({
            url: "../QR_check_order/QR_check_order?orderId=" + orderId,
          })
          return
        }
        wx.navigateTo({
          url: "../QR_check_order/QR_check_order?orderId=" + this.data.scene,
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
    let user = wx.getStorageSync('user');
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
        if (res.data.code == 0) {
          that.setData({
            hidden: 1
          })
        }
      },
      fail: function(err) {

      }
    })
  },
  // 检查扫码人员当天扫码数量
  scan: function() {
    let user = wx.getStorageSync('user');
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
  },
  getPhoneNumber(e) {
    var that = this;
    var user = wx.getStorageSync('user');
    wx.request({
      url: wxConfig.base_url + '/wechat/phoneNumber',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: user.openid,
        sessionKey: user.session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.code == 0 && res.data.data != undefined) {
          that.setData({
            phoneNumber: res.data.data.phoneNumber
          });          
          user.phoneNumber = res.data.data.phoneNumber;
          wx.setStorageSync('user', user);
          that.checkScan();
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
})