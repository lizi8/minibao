// pages/collect/collect.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    picUrl: app.globalData.picUrl,
  },
  onLoad: function(options) {
    var _this = this;
    this.getCollectList();
  },
  getCollectList:function(){
    var _this = this;
    var param = {
      Method: 'GetCollection',
      OpenID: wx.getStorageSync('openID')
    };
    util.requestApi(app.globalData.apiUrl, param, function (res) {
      _this.setData({
        collectList: res,
      })
    })
  },
  onCancel: function(e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var param = {
      Method: 'UpCollection',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: id
    };
    util.requestApi(app.globalData.apiUrl, param,function(res){
      util.wxshowToast("取消成功");
      setTimeout(function(){
        _this.getCollectList()
      },2000)
      
    })
  }
})