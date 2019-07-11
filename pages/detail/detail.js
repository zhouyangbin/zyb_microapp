var wxConfig = require('../../wxConfig.js')
const app = getApp()
Page({
  data: {
    info:null,
    total:1,
  },
  onLoad: function (e) {
    console.log(e);
    // app.getOpenid();
    this.setData({
      id:e.id
    },()=>{
      this.get_product_detail();
    })
  },
  review_img(e){
    console.log(e.currentTarget.dataset.src);
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  get_product_detail() {
    let that = this;
    let sendData = null;
    sendData = {
      id: that.data.id,
    };
    wx.request({
      url: wxConfig.base_url + "/mini-product/products/id",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        if (res.data.data) {
          that.setData({
            info: res.data.data
          });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取失败",
          icon: 'fail',
          duration: 2000
        })
      },//请求失败
    })
  },
  total_minus() {
    this.setData({
      total: this.data.total > 1 ? this.data.total - 1 : 1
    })
  },
  total_plus() {
    this.setData({
      total: this.data.total + 1
    })
  },
  pay(){
    console.log(1);
    let sendData = null;
    wx.request({
      url: wxConfig.base_url + "/wechat-pay/dopay",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        if (res.data.data) {
          
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取失败",
          icon: 'fail',
          duration: 2000
        })
      },//请求失败
    })
    // wx.requestPayment({
    //   'timeStamp': timeStamp,
    //   'nonceStr': nonceStr,
    //   'package': 'prepay_id=' + res.data.prepay_id,
    //   'signType': 'MD5',
    //   'paySign': res.data._paySignjs,
    //   'success': function (res) {
    //     console.log(res);
    //   },
    //   'fail': function (res) {
    //     console.log('fail:' + JSON.stringify(res));
    //   }
    // })
  }
})