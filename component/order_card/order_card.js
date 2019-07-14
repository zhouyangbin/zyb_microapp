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
    detail(event){
      console.log(event.currentTarget.dataset.item.orderId);
      wx.navigateTo({
        url: '../order_detail/order_detail?orderId=' + event.currentTarget.dataset.item.orderId
      })
    }
  }
})