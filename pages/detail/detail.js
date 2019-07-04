Component({
  /**
 1. 组件的属性列表
   */
  properties: {
    selectArray: {
      type: Array,
    },
    // 初始时要展示的内容
    currentText: {
      type: String,
    }
  },

  /**
 2. 组件的初始数据
   */
  data: {
    isShow: false, // 初始option不显示
    arrowAnimation: {} // 箭头的动画
  },

  /**
 3. 组件的方法列表
   */
  methods: {
    //option的显示与否
    selectToggleAction: function () {
      // 获取当前option显示的状态
      var nowShow = this.data.isShow;
      // 创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          arrowAnimation: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          arrowAnimation: animation.export()
        })
      }
      this.setData({
        isShow: !nowShow
      })
    },
    //设置内容
    selectItemAction: function (e) {
      // 当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      var nowData = this.properties.selectArray;
      var index = e.target.dataset.index; // 当前点击的索引
      var current_text = nowData[index].name; // 当前点击的内容
      var current_type = nowData[index].type; // 当前点击的内容
      // 再次执行动画，注意这里一定是this.animation来使用动画!!!!!!
      this.animation.rotate(0).step();
      this.setData({
        isShow: false,
        current_text: current_text,
        arrowAnimation: this.animation.export()
      })
      // 内容更新后，需要把更新的数据传输出去
      var nowDate = {
        id: index,
        name: current_text,
        type: current_type
      }
      // 这里的 getNowData 要和外部的 bind:getNowData ，名称一定要对应
      this.triggerEvent('getNowData', nowDate);
    }
  }
})