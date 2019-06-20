// pages/web/web.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
  },
  onLoad: function(options) {
    var _this = this;
    _this.setData({
      webUrl: options.id,
      brandCode: options.code,
    });
    var param = {
      Method: 'UserRead',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: _this.data.brandCode,
      NickUrl: wx.getStorageSync('userInfo').avatarUrl,
    };
    util.requestApi(app.globalData.apiUrl, param, function(res) {
   
    });
  },
})