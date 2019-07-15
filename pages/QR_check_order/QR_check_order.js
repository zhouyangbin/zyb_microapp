const app = getApp()
const wxConfig = require('../../wxConfig.js');
const util = require('../../utils/util.js')
Page({
  data: {
    currentText: '查询',
    inputValue: '',
    order: [],
    page: 1,
    limit: 100,
  },
  onLoad: function(e) {
    console.log(e);
    // 从订单详情页跳转过来
    if (e.orderId != undefined) {
      this.details(e.orderId);
    }
    if (e.key_word != undefined) {
      this.setData({
        inputValue: e.key_word,
      })
    }

  },
  onShow() {},
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  check_phone_order(e) {
    let that = this;
    let user = wx.getStorageSync('user');
    let sendData = null;
    sendData = {
      openid: user.openid,
      cellphone: this.data.inputValue,
      limit: that.data.limit,
      payStatus: '0'
    };
    wx.request({ //index  product list
      url: wxConfig.base_url + "/mini-order/orders",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data);
        if (res.data.data) {
          that.setData({
            hidden: true,
            orderArray: res.data.data,
            total: res.data.count
          });
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
          duration: 2000
        })
      }, //请求失败
    })
  },
  // 订单详情
  details(e) {
    var that = this;
    let user = wx.getStorageSync('user');
    wx.request({
      url: wxConfig.base_url + '/mini-order/details',
      data: {
        openid: user.openid,
        orderId: e
      },
      success(res) {
        res.data.data.createTime = util.formatTime(new Date(res.data.data.createTime));
        that.setData({
          item: res.data.data
        });
      },
      fail(err) {

      }
    })
  },
  // 核销
  check(e) {
    
  }
})