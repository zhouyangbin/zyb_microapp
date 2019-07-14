const wxConfig = require('../../wxConfig.js');
var util = require('../../utils/util.js');
Page({
  data: {
    tab_index: '5',
    hidden: false,
    height: wx.getSystemInfoSync().windowHeight - 50,
    orderArray: [],
    page:1,
    limit:4,
    total:null
  },
  onLoad: function () {
    this.get_order();
  },
  onShow: function () {
    
  },
  tabClick: function (e) {
    this.setData({
      page: 1,
      orderArray:[],
      tab_index: e.target.dataset.num
    },()=>{
      this.get_order();
    })
  },
  get_order(){
    let user = wx.getStorageSync('user');
    let that = this;
    let sendData=null;
    sendData={
      openid: user.openid,
      page: that.data.page,
      limit: that.data.limit,
    };
    if(that.data.tab_index == 1){
      sendData.consumeStatus = 1
    }
    if (that.data.tab_index == 2) {
      sendData.consumeStatus = 0;
      sendData.payStatus = 1
    }
    if (that.data.tab_index == 3) {
      sendData.payStatus = 0
    }
    console.log(user)
    wx.request({//index  product list
      url: wxConfig.base_url + "/mini-order/orders",
      data: sendData,
      method: 'GET',
      header: {'content-type': 'application/json'},
      success(res) {
        for(var i in res.data.data) {
          res.data.data[i].createTime = util.formatTime(new Date(res.data.data[i].createTime))
        }
        if (res.data.data) {
          that.setData({
            hidden: true,
            orderArray: that.data.orderArray.concat(res.data.data),
            total:res.data.count
          });
        }else{
          that.setData({
            hidden: true,
            orderArray: [],
            total: null
          });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "获取失败",
          icon: 'success',
          duration: 2000
        })
      },//请求失败
    })
  },
  scroll_bottom(){
    console.log(123);
    if (this.data.total > this.data.orderArray.length) {
      this.setData({
        page: this.data.page + 1,
        hidden: false
      }, () => {
        this.get_order();
      });
    } else {
      wx.showToast({
        title: "没有更多数据",
        icon: 'success',
        duration: 1000
      })
    }
  } 
})