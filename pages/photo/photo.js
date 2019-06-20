// pages/photo/photo.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    picUrl: app.globalData.picUrl,
    nav: ["效果图", "实景图", "周边配套", "规划图"],
    navIndex: 0,
    current:0,
  },
  onLoad:function(options){
    var _this = this;
    _this.setData({
      buildId: options.id
    });
    var param = {
      Method: 'GetImgList',
      ProjectCode: options.id,
    };
    util.requestApi(app.globalData.apiUrl, param, function(res){
      _this.setData({
        photoList: res
      });
    })
  },
  changeList: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    _this.setData({
      current: index,
      navIndex: index,
    })
  },
  bindChange: function (e) {
    var _this = this;
    var index = e.detail.current;
    _this.setData({ 
      current: index,
      navIndex: index,
      });
  },
  previewImg: function (e) {
    var _this = this;
    var data = e.currentTarget.dataset;
    var lists = _this.data.photoList;
    var arr = [];
    for (var i = 0; i < lists.length;i++){
      if (lists[i].ImgID == data.imgid){
        arr.push(_this.data.picUrl+lists[i].ImgUrl);
      }
    }
    wx.previewImage({
      current: data.imgurl,    
      urls: arr,              
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

  
})