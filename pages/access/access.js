// pages/access/access.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      buildId: options.id
    });
  },
  onShow:function(){
    var _this = this;
    var param= {
      Method: 'GetNickUrl',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: _this.data.buildId,
    };
    util.requestApi(app.globalData.apiUrl, param, function (res) {

      _this.setData({
        headList: res
      });

  })
  }
})