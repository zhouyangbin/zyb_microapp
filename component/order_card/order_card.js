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
    console.log("???");
  },
  data: {
  },
  methods: {
    detail(event){
      console.log(event.currentTarget.dataset.item.productId);
      wx.navigateTo({
        url: '../detail/detail?productId=111'
      })
    }
  }
})