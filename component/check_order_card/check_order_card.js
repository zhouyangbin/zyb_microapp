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
  attached() {},
  data: {},
  methods: {
    qrorder(event) {
      wx.navigateTo({
        url: '../QR_check_order/QR_check_order?orderId=' + event.currentTarget.dataset.item.orderId
      })
    }
  }
})