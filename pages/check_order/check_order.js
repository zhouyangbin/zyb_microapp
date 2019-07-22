const app = getApp()
const wxConfig = require('../../wxConfig.js');
var util = require('../../utils/util.js');
Page({
  data: {
    currentText: '查询',
    inputValue: '',
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    page: 1,
    limit: 5,
    orderArray: [],
    height: wx.getSystemInfoSync().windowHeight - 20,
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏
  },
  onLoad: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onShow() {},
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  fetchSearchList: function() {
    let that = this;
    let user = wx.getStorageSync('user');
    let sendData = null;
    sendData = {
      openid: user.openid,
      cellPhone: this.data.inputValue,
      scanPhone: user.phoneNumber,
      page: that.data.page,
      limit: that.data.limit,
      payStatus: '0'
    };
    wx.request({
      url: wxConfig.base_url + "/mini-scan/orders",
      data: sendData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.data) {
          let searchList = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.orderArray.concat(res.data.data);
          // 时间格式转换
          for (var i in searchList) {
            let date = new Date(new Date(searchList[i].createTime));
            searchList[i].createTime = util.formatToYMD(date);
          }
          that.setData({
            orderArray: searchList, // 获取数据数组
            searchLoadingComplete: true,
            searchLoading: true
          });
        } else {
          that.setData({
            orderList: [],
            total: res.data.count,
            searchLoadingComplete: false,
            searchLoading: true
          }, () => {
            wx.showToast({
              title: "没有数据",
              icon: 'loading',
              duration: 2000
            })
          });
        }
      }
    })
  },
  keywordSearch: function() {
    if (this.data.inputValue == '') {
      wx.showToast({
        title: '请输入查询信息',
        icon: 'warn',
        duration: 2000
      })
      this.setData({
        orderArray: []
      });
      return;
    }
    this.setData({
      page: 1,
      orderArray: [],
      isFromSearch: true,
      searchLoading: false,
      searchLoadingComplete: false
    })
    this.fetchSearchList();
  },
  searchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1, //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },
})