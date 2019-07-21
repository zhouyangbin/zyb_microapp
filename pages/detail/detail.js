var wxConfig = require('../../wxConfig.js')
const app = getApp()
var user = wx.getStorageSync('user');
Page({
  data: {
    info: null,
    active: null,
    total: 1,
    phoneNumber: '',
    activeContent: '暂无优惠',
    payableAmount: 0,
    realAmount: 0
  },
  onLoad: function(e) {
    this.setData({
      id: e.id,
      admin_id: e.admin_id
    }, () => {
      this.get_product_detail();
      this.get_active();
    })
  },
  review_img(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  // 获取项目详情
  get_product_detail() {
    let that = this;
    let sendData = null;
    if(user.phoneNumber != undefined) {
      this.setData({
        phoneNumber: user.phoneNumber.replace(/^(\d{4})\d{4}(\d+)/, "$1****$2")
      });
    };
    
    sendData = {
      id: that.data.id,
    };
    wx.request({
      url: wxConfig.base_url + "/mini-product/products/id",
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.data) {
          that.setData({
            info: res.data.data,
            payableAmount: res.data.data.price,
            realAmount: res.data.data.price
          });
        }
      },
      fail: function(err) {
        wx.showToast({
          title: "获取失败",
          icon: 'fail',
          duration: 2000
        })
      }, //请求失败
    })
  },
  // 获取活动优惠
  get_active(){
    var that = this;
    wx.request({
      url: wxConfig.base_url+'/mini-active/actives',
      data: {
        openid: user.openid,
        adminId: this.data.admin_id
      },success(res){
        console.log(res);
        if(res.data.data != null) {
          that.setData({
            active: res.data.data,
            activeContent: '满'+res.data.data.ticketNums+'张,打'+res.data.data.discount+'折',
          });
        }
      },
    })
  },
  total_minus() {
    var totalNum = this.data.total > 1 ? this.data.total - 1 : 1;
    var realAmount = totalNum * this.data.info.price;
    if(this.data.active != null) {
      if(totalNum >= this.data.active.ticketNums) {
        realAmount = (totalNum * this.data.info.price * (this.data.active.discount/10)).toFixed(2);
      }
    }
    this.setData({
      total: totalNum,
      payableAmount: (totalNum  * this.data.info.price).toFixed(2),
      realAmount: realAmount,
    })
  },
  total_plus() {
    var totalNum = this.data.total + 1;
    var realAmount = (totalNum * this.data.info.price).toFixed(2);
    if (this.data.active != null) {
      if (totalNum >= this.data.active.ticketNums) {
        realAmount = (totalNum * this.data.info.price * (this.data.active.discount / 10)).toFixed(2);
      }
    }
    this.setData({
      total: totalNum,
      payableAmount: (totalNum * this.data.info.price).toFixed(2),
      realAmount: realAmount,
    })
  },
  pay(e) {
    // console.log(this.data.total);
    // console.log(this.data.info);
    // console.log(this.data.info.price * this.data.total);
    // console.log(this.data.phoneNumber);
    
    if(this.data.phoneNumber == '') {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'fail',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: wxConfig.base_url + '/mini-order/order',
      method: 'POST',
      data: {
        openid: user.openid,
        productId:this.data.info.productId,
        ticketNums: this.data.total,
        cellPhone: this.data.phoneNumber,
        payableAmount: this.data.payableAmount,
        realAmount: this.data.realAmount
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (e) {
        // 创建支付订单失败
        if(e.data.code != 0) {
            wx.showToast({
              title: e.data.msg,
            })
        }else {
          wx.request({
            url: e.data.data.redirect_url,
            data: {
              openId: user.openid
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
        }
      }
    })
  },
  getPhoneNumber(e) {
    var that = this;
    var user = wx.getStorageSync('user');
    wx.request({
      url: wxConfig.base_url + '/wechat/phoneNumber',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: user.openid,
        sessionKey: user.session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0 && res.data.data != undefined) {
          that.setData({
            phoneNumber: res.data.data.phoneNumber
          });
          user.phoneNumber = res.data.data.phoneNumber;
          wx.setStorageSync('user', user);
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'fail',
            duration: 1000
          });
        }
      },
    });
  },
})