let app = getApp();
const util = require('../../utils/util.js');
console.log(app.globalData.imgPath)
Page({
  data: {
    buildId: "",
    userId: "",
    isLogin: false,
    imgPath: app.globalData.imgPath,
  },
  onLoad: function(options) {
    var _this = this;
    console.log(options.scene);
    if (options.scene){
      var scene = decodeURIComponent(options.scene).split(",");
      _this.setData({
        buildId: scene[0],
        userId: scene[1],
      })
    }
    if (options.userId) {
      _this.setData({
        userId: options.userId
      })
    }
    if (options.buildId) {
      _this.setData({
        buildId: options.buildId
      })
    }
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("未过期");
        let openID = wx.getStorageSync('openID');
        let session_key = wx.getStorageSync('session_key');
        if (!openID && !session_key) {
          _this.setData({
            isLogin: true
          })
        } else {
          console.log("index");
          _this.goHome();
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        _this.setData({
          isLogin: true
        })
        console.log("重新登录");
        return false;
      }
    })
  },

  /**
   * 授权登录
   */
  authorLogin: function(e) {
    var _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.setStorageSync("userInfo", e.detail.userInfo);
    wx.showLoading({
      title: "正在登录",
      mask: true
    });
    // 执行微信登录
    wx.login({
      success: function(res) {
        console.log(res.code);
        var param = {
          Method: "Check",
          Code: res.code,
          NickName: wx.getStorageSync('userInfo').nickName,
          NickUrl: wx.getStorageSync('userInfo').avatarUrl,
          Sex: wx.getStorageSync('userInfo').gender,
          UserID: _this.data.userId
        };
        util.requestApi(app.globalData.apiUrl, param, function(res) {
          if (res == "-1") {

            _this.goLogin();
            return false;
          }
          console.log("login", res)
          wx.setStorageSync("userID", res[0].ID);
          wx.setStorageSync("openID", res[0].OpenID);
          wx.setStorageSync("session_Key", res[0].Session_Key);
          wx.hideLoading();
          _this.goHome();
        });
      }
    });
  },

  goHome: function() {
    var _this = this;
    if (_this.data.buildId) {
      wx.reLaunch({
        url: '/pages/index/index?buildId=' + _this.data.buildId
      });
    } else {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  },
  goLogin:function(){
    wx.reLaunch({
      url: '/pages/login/login'
    });
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function() {
    var _this = this;
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

})