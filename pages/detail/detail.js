var wxConfig = require('../../wxConfig.js')
const app = getApp()
Page({
  data: {
    title:'咕噜咕噜机构列',
    price:123,
    total:1
  },
  total_minus(){
    this.setData({
      total: this.data.total >1 ? this.data.total-1 :1 
    })
  },
  total_plus() {
    this.setData({
      total: this.data.total + 1
    })
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    app.getOpenid();
    console.log("发起请求获取数据");
  }
})