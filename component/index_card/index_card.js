Component({
  properties: {
    list: {
      type: Array,
    },
    height: {
      type: Number,
    },
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