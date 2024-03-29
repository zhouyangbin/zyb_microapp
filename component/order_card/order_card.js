const util = require('../../utils/util.js')
var wxConfig = require('../../wxConfig.js')
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
    detail(event){
      if(event.currentTarget.dataset.item.refundStatus == 1 || event.currentTarget.dataset.item.refundStatus == 4) {
        wx.navigateTo({
          url: '../order_detail/order_detail?orderId=' + event.currentTarget.dataset.item.orderId
        })
      }else if (event.currentTarget.dataset.item.payStatus == 1 && event.currentTarget.dataset.item.consumeStatus == 0){
        wx.navigateTo({
          url: '../Consumption_order_detail/Consumption_order_detail?orderId=' + event.currentTarget.dataset.item.orderId
        })
      }else{
        wx.navigateTo({
          url: '../order_detail/order_detail?orderId=' + event.currentTarget.dataset.item.orderId
        })
      }
    },
    doPay(event) {
      var user = wx.getStorageSync('user');
      wx.request({
        url: wxConfig.base_url +'/wechat-pay/dopay',
        method: 'GET',
        data: {
          outTradeNo: event.currentTarget.dataset.orderno,
          openId: user.openid,
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (pay) {
          wx.requestPayment({
            timeStamp: pay.data.timeStamp,
            nonceStr: pay.data.nonceStr,
            package: pay.data.package,
            signType: pay.data.signType,
            paySign: pay.data.paySign,
            success(res) {
              wx.navigateTo({
                url: "../paySuccess/paySuccess?order_id=" + pay.data.orderId,
              })
            },
            fail(res) {
              wx.navigateTo({
                url: "../order/order?tab_index=3",
              })
            }
          })
        }
      })
    },
  }
})