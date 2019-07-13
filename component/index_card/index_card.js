Component({
  properties: {
    list: {
      type: Array,
    },
    height: {
      type: Number,
    },
  },
  data: {},
  methods: {
    detail(event) {
      wx.navigateTo({
        url: '../detail/detail?id=' + event.currentTarget.dataset.item.productId + '&admin_id=' + event.currentTarget.dataset.item.adminId
      })
    }
  },
})