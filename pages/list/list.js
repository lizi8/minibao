// pages/list/list.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // nav: ["最新发布","最热"],
    // navIndex:0,
    // current:0,
    picUrl: app.globalData.picUrl,
  },
  onLoad:function(){
    var _this = this;
    var param1 = {
      Method: 'GetBrandInfo',
    };
    util.requestApi(app.globalData.apiUrl, param1, function(res){
      _this.setData({
        newsList: res.Table,
        // hotList: res.Table1,
      })
    });
  },
  // changeList:function(e){
  //   var _this = this;
  //   var index = e.currentTarget.dataset.index;
  //   _this.setData({
  //     current: index,
  //     navIndex: index,
  //   })
  // },
  // onChange:function(e){
  //   var _this = this;
  //   var index = e.detail.current;
  //   _this.setData({
  //     current: index,
  //     navIndex: index,
  //   });
  // },
  onWeb: function (e) {
    var target = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../web/web?id=' + target.con + '&code=' + target.code,
    })
  }

})