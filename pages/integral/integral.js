// pages/integral/integral.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    nav: ["全部", "南京", "盐城", "常州", "无锡"],
    navIndex: 0,
    picUrl: app.globalData.picUrl,
    goodConH:"850rpx"
  },
  onLoad:function(){
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == 'iPhone X' || model == 'iPhone XR') {
          _this.setData({
            goodConH: "1100rpx"
          })
        }
      }
    })
  },

  onShow:function(){
    var _this = this;
    _this.getGoodsList();
  },
  onPullDownRefresh() {
    var _this = this;
    _this.getGoodsList();
  },
  getGoodsList:function(){
    var _this = this;
    var param = {
      Method: 'GetGoodsInfo',
      OpenID: wx.getStorageSync('openID'),
    };
    util.requestApi(app.globalData.apiUrl, param, function (res) {
      _this.setData({
        userInfo: res.Table[0],
        goodsList: res.Table1,
        navIndex: 0,
      })
      wx.stopPullDownRefresh()
      wx.setStorageSync('goodsData', _this.data.goodsList)
    })
  },
  //签到
  onSignIn:function(e){
    var _this = this;
    var param = {
      Method: 'Sign',
      OpenID: wx.getStorageSync('openID'),
    };
    util.requestApi(app.globalData.apiUrl, param, _this.signData)
  },
  signData:function(res){
    var _this =this;
    if (res[0].Opt == 1) {
      util.wxshowToast("签到成功")
      var num = parseInt(_this.data.userInfo.Integral) + parseInt(res[0].Integral);
      _this.setData({
        "userInfo.Opt": 2,
        "userInfo.Integral": num
      })
    } else {
      util.wxshowToast("已签到过")
    }
  },
  changeList: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    if (index == _this.data.navIndex) {
      return false;
    }
    var dataList = wx.getStorageSync('goodsData');
    var list = [];
    if (index == 0) {
      list = dataList;
    } else {
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].AreaID == index) {
          list.push(dataList[i]);
        }
      }
    }
    _this.setData({
      goodsList: list,
      navIndex: index,
    })
  },
  //商品
  onGoods:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/goods?id='+id,
    });  
  },
  //规则
  onRule:function(){
    wx.navigateTo({
      url: '../rule/rule',
    })  
  }
  
})