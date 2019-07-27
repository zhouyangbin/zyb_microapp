//index.js
//获取应用实例
const app = getApp()
const wxConfig = require('../../wxConfig.js')
Page({
  data: {
    hidden: false,
    searchArray: [{
        name: '附近'
      },
      {
        name: '1KM'
      },
      {
        name: '2KM'
      },
      {
        name: '3KM'
      },
      {
        name: '5KM'
      },
    ],
    listArray: [],
    height: wx.getSystemInfoSync().windowHeight - 70,
    address_data: null,
    page: 1,
    limit: 5,
    total: null,
  },
  onLoad: function() {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        hidden: true
      }, () => {
        app.getLocation(that);
      });
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          hidden: true
        }, () => {
          app.getLocation(that);
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
          }, () => {
            app.getLocation(that);
            // this.getAddress()
          })
        }
      })
    };
  },
  onShow: function() {
    if (this.data.address_data != null) {
      this.setData({
        listArray: [],
        page: 1,
        address_data: {
          latitude: app.globalData.Permissionaddressinfo.latitude,
          longitude: app.globalData.Permissionaddressinfo.longitude
        }
      });
      this.get_product_list();
    }
  },
  getAddress: function() {
    var that = this;
    app.getPermission(that); //传入that值可以在app.js页面直接设置内容
  },
  getSearch_text: function(e) {
    let item = e.detail;
    wx.showToast({
      title: item.latitude,
      icon: 'loading',
      duration: 1000
    })
  },
  get_addr: function(data) {
    this.setData({
      address_data: data,
    }, () => {
      this.get_product_list()
    })
  },
  get_product_list() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    let that = this;
    let data = this.data.address_data;
    let sendData = null;
    sendData = {
      longitude: data.longitude,
      latitude: data.latitude,
      page: that.data.page,
      limit: that.data.limit,
    };
    wx.request({ //index  product list
      url: wxConfig.base_url + "/mini-product/products",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.data) {
          that.setData({
            hidden: true,
            listArray: that.data.listArray.concat(res.data.data),
            total: res.data.count
          });
          // wx.hideLoading();
        } else {
          that.setData({
            hidden: true,
            listArray: [],
            total: res.data.count,
          }, () => {
            wx.showToast({
              title: "没有数据",
              icon: 'loading',
              duration: 2000
            })
          });
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
      },
      fail: function(err) {
        wx.showToast({
          title: "444",
          icon: 'success',
          duration: 5000
        })
      }, //请求失败
    })
  },
  scroll_bottom() {
    if (this.data.total > this.data.listArray.length) {
      this.setData({
        page: this.data.page + 1,
        hidden: false
      }, () => {
        this.get_product_list();
      });
    } else {
      wx.showToast({
        title: "没有更多数据",
        icon: 'success',
        duration: 1000
      })
    }
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      hidden: false,
      listArray: []
    }, () => {
      this.get_product_list();
    })
  },
  onReachBottom: function() {
    wx.showNavigationBarLoading();
    this.setData({
      hidden: false,
      listArray: [],
    }, () => {
      this.get_product_list();
    });
  }
})