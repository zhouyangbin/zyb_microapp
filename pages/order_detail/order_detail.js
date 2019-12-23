var wxConfig = require('../../wxConfig.js')
const app = getApp()
var user = wx.getStorageSync('user');
var util = require('../../utils/util.js');
Page({
  data: {
    info: null,
    orderId:null,
  },  
  onLoad: function(e) {
    this.setData({
      orderId: e.orderId,
    }, () => {
      this.get_order_detail();      
    })
  },
  // 获取项目详情
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
            info: res.data.data,
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: "获取失败",
          icon: 'fail',
          duration: 2000
        })
      }, //请求失败
    })
  },
  onShow: function() {
    // 计算时间差值
    // let time1 = new Date(this.data.info.completionTime).getTime() + (this.data.info.playTime * 60 * 1000);
    // console.log(time1)
    // this.data.timer = setInterval(() => { //注意箭头函数！！
    //   this.setData({
    //     timeLeft: util.getTimeLeft(time1)//使用了util.getTimeLeft
    //   });
    //   if (this.data.timeLeft == "0天0时0分0秒") {
    //     clearInterval(this.data.timer);
    //   }
    // }, 1000);
  }
})