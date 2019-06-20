// pages/myReserve/myReserve.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    picUrl: app.globalData.picUrl,
  },
  onLoad: function (options) {
    var _this =this;
    _this.getReserve();
  },
  getReserve:function(){
    var _this = this;
    var param = {
      Method: 'GetYuYue',
      OpenID: wx.getStorageSync('openID')
    };
    util.requestApi(app.globalData.apiUrl, param, function (res) {
      _this.setData({
        reserveList: res,
      })
      console.log(_this.data.reserveList);
  });
  },
  onCancel: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var param = {
      Method: 'UpYuYue',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: id
    };
    util.requestApi(app.globalData.apiUrl, param, function(res){
      util.wxshowToast("取消成功")
      setTimeout(function () {
        _this.getReserve();
      }, 2000)
    })
  },


  
})