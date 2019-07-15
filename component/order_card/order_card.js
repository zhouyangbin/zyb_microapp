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
      console.log(event.currentTarget.dataset.item.productId);
      wx.navigateTo({
        url: '../order_detail/order_detail?orderId=' + event.currentTarget.dataset.item.orderId
      })
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
              console.log(res);
            },
            fail(res) {
              console.log(res);
            }
          })
        }
      })
    },
  }
})