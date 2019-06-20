//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    picUrl: app.globalData.picUrl,
    banner: [{ "imgUrl": app.globalData.postPath + 'b1.jpg', "Content": "https://mp.weixin.qq.com/s/864Sk4w78O6ITbMNvqPRMQ", ProjectCode:"nanjing002"}, 
      { "imgUrl": app.globalData.postPath + 'b2.jpg', "Content": "https://mp.weixin.qq.com/s/DEYIuY4wk9u9RMDPBlD1BA", ProjectCode: "wuxi002" }, { "imgUrl": app.globalData.postPath + 'b3.jpg', "Content": "https://mp.weixin.qq.com/s/Ok9tswHBLsuvIQ8zHbgnjg", ProjectCode: "yancheng002"}],
    nav: ["全部", "南京", "盐城", "常州", "无锡"],
    navIndex: 0,
    buildId: "",
    imgPath: app.globalData.imgPath,
  },
  onLoad: function (options) {
    var _this = this;
    if (options.buildId) {
      _this.setData({
        buildId: options.buildId
      })
    }
    if (_this.data.buildId){
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + _this.data.buildId
      });
    }
    _this.getList(); 
  },
  onShow:function(){
    var _this = this;
    // _this.getList();
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    var _this = this;
    _this.getList();
  },
  getList: function() {
    var _this = this;
    var param1 = {
      Method: "GetPJList"
    };
    util.requestApi(app.globalData.apiUrl, param1, _this.bulidDataList)
  },
  bulidDataList: function(res) {
    var _this = this;
    _this.setData({
      bulidList: res.Table,
      allbulidList: res.Table,
      newsList: res.Table1.brandInfo,
      navIndex: 0,
    })
    wx.stopPullDownRefresh()
  },
  
  changeList: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    if (index == _this.data.navIndex) {
      return false;
    }
    var dataList =_this.data.allbulidList;
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
      bulidList: list,
      navIndex: index,
    })
  },
  //打开详情
  onDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  //打开新鲜事
  onInfoList: function() {
    wx.navigateTo({
      url: '../list/list',
    })
  },
  //
  onWeb: function(e) {
    var target = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../web/web?id=' + target.con + '&code=' + target.code,
    })
  },
  onShareAppMessage: function () {
    var _this = this;
    return {
      title: "保利in江苏",
      desc: '',
      imageUrl: '',
      path: '/pages/login/login'
    }
  },
  onMap: function (e) {
    var target = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../map/map?latitude=' + target.addrlat + '&longitude=' + target.addrlng + "&title=" + target.name,
    })
  },
  
})