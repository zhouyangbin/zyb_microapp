var wxConfig = require('../../wxConfig.js')
const app = getApp()
Component({
  data: {
  },
  methods: {
    logInfo() {
      console.log("发起请求获取数据");
    }
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    console.log(wx.getStorageSync('wx_login'));
    console.log(wxConfig);
    app.getOpenid();
  }
})