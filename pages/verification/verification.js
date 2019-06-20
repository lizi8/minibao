// pages/verification/verification.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      goodsId: options.id
    });
  },
  //确认核销
  formSubmit:function(e){
    var _this = this;
    var hxcode = e.detail.value.hxCode;
    if(hxcode==""){
      util.wxshowModal("提示", "请输入核销码");
        return false;
    }
    console.log(hxcode);
    var param = {
      Method: 'IntegralExch',
      OpenID: wx.getStorageSync('openID'),
      GoodsCode: _this.data.goodsId,
      Password: hxcode
    };
    util.requestApi(app.globalData.apiUrl, param, _this.verificationData)
  },
  verificationData:function(res){
    console.log(res[0]);
    if (res[0].Opt == 1) {
      util.wxshowToast("核销成功");
    } else if (res[0].Opt ==2) {
      util.wxshowToast("积分不足");
    } else if (res[0].Opt == 3) {
      util.wxshowToast("核销码错误");
    }
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/integral/integral'
      })
    }, 2000)

  }
})