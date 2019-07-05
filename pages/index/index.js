//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hidden:false,
    searchArray:[
      { name:'北京'},
      { name:'上海'},
      { name:'广州'},
      { name: '北京' },
      { name: '上海' },
      { name: '广州' },
      { name: '北京' },
      { name: '上海' },
      { name: '广州' },
      { name: '北京' },
      { name: '上海' },
      { name: '广州' },
    ],
    listArray: [],
    height: wx.getSystemInfoSync().windowHeight-50,
    address_data:null,
  },
  onLoad: function () {
    console.log(wx.getStorageSync('user'))
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        hidden: true
      },()=>{
        app.getLocation(that);
      });
    } else if (this.data.canIUse){
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
          },()=>{
            app.getLocation(that);
          })
        }
      })
    };
    // this.getAddress();
    
  },
  getAddress: function () {
    var that = this;
    app.getPermission(that);    //传入that值可以在app.js页面直接设置内容
  }, 
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  getSearch_text: function (e) {
      let item = e.detail;
      wx.showToast({
        title: item.latitude,
        icon: 'success',
        duration: 2000
      })
  },
  get_addr: function (data) {
    // console.log(data, '???');
    this.setData({
      address_data:data,
    },()=>{
      wx.showToast({
        title: "123",
        icon: 'success',
        duration: 2000
      })
      this.get_product_list()
    })
  },
  get_product_list(){
    let that = this;
    let data = this.data.address_data;
    console.log(data)
    wx.request({
      url: 'https://api.tiyushiyanshi.com/mini-product/products', //index  product list
      data: {
        longitude: data.longitude,
        latitude: data.latitude,
        distance: '5000',
        page: '1',
        limit: '20',
      },
      method:'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        if (res.data.data){
          that.setData({
            hidden: true,
            listArray: res.data.data
          });
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
      },
      fail: function (err) {
        wx.showToast({
          title: "444",
          icon: 'success',
          duration: 2000
        })
       },//请求失败
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.setData({
      hidden: false,
    },()=>{
      this.get_product_list();
    })
    // setTimeout(()=>{
    //   this.setData({
    //     hidden: true,
    //   });
    // wx.hideNavigationBarLoading() //完成停止加载
    // wx.stopPullDownRefresh();
    // },2000)
  },
})
