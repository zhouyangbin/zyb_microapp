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

  },
  getPhoneNumber(){
    console.log(123)
  }
})