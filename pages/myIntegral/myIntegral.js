// pages/myIntegral/myIntegral.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad: function (options) {
    var _this = this;
    var param = {
      Method: 'GetUIntegral',
      OpenID: wx.getStorageSync('openID')
    };
    util.requestApi(app.globalData.apiUrl, param, function (res){
      _this.setData({
        integralList: res,
      })
    })

  }
})