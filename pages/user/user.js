// pages/user/user.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    imgPath: app.globalData.imgPath,
  },
  onLoad: function() {
  },
  //跳转
  // onTab: function(e) {
  //   var path = e.target.dataset.path;
  //   wx.navigateTo({
  //     url: path,
  //   })
  // },
  onShow:function(){
    var _this = this;
    var param = {
      Method: "GetUser",
      OpenID: wx.getStorageSync("openID")
    };
    util.requestApi(app.globalData.apiUrl, param, function(res){
      _this.setData({
        infos: res[0]
      })
      console.log(_this.data.infos);
    });
  },


})