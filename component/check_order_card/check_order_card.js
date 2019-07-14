const util = require('../../utils/util.js')
Component({
  properties: {
    orderList: {
      type: Array,
    },
    height: {
      type: Number,
    },
  },
  attached() {
  },
  data: {
  },
  methods: {
    order_completed(event){
      console.log(event.currentTarget.dataset.item.orderId);
      return;
      wx.request({//index  product list
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
        fail: function (err) {
          wx.showToast({
            title: "444",
            icon: 'success',
            duration: 2000
          })
        },//请求失败
      })
      
    },
    detail(event) {
      console.log(event.currentTarget.dataset.item.orderId);
      wx.navigateTo({
        url: '../order_detail/order_detail?orderId=' +                                     event.currentTarget.dataset.item.orderId
      })
    }
  }
})