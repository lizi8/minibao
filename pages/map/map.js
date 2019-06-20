// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const app = getApp();
const util = require('../../utils/util.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'E6RBZ-RBAWX-G6G47-TCRPM-72IOO-4FBWZ',
});


Page({
  data:{
    imgPath: app.globalData.imgPath,
    catering:false,
    bus:false,
    school:false,
    shop:false,
  //   typeList: [{ "id": 1, "img": app.globalData.imgPath + "catering.png", "img1": app.globalData.imgPath + "catering1.png", "name": "餐饮" }, { "id": 2, "img": app.globalData.imgPath + "Bus.png", "img1": app.globalData.imgPath + "Bus1.png", "name": "公交" }, { "id": 3, "img": app.globalData.imgPath + "school.png", "img1": app.globalData.imgPath + "school1.png", "name": "学校" }, { "id": 4, "img": app.globalData.imgPath + "shop.png", "img1": app.globalData.imgPath + "shop1.png", "name": "购物" }],
  },
  onLoad: function (options) {
      var _this = this;
      wx.setNavigationBarTitle({
        title: options.title
      });
   _this.setData({
     latitude: options.latitude,
     longitude: options.longitude,
      markers:[{
        title: options.title,
        id: 0,
        latitude: options.latitude,
        longitude: options.longitude,
        iconPath: app.globalData.imgPath + "biaoji.png", //图标路径
        width: 38,
        height:38,
        callout: {
          content: options.title,
          color: '#333',
          padding:10,
          fontSize: 15,
          borderRadius: 6,
          display: 'ALWAYS'
        },
      }]
   });

  },
  btnsearch:function(e){
    var _this = this;
    var type = e.currentTarget.dataset["type"];
    switch (type){
      case "餐饮":
      _this.setData({
        catering: true,
        bus: false,
        school: false,
        shop: false,
      });
       break;
      case "公交":
        _this.setData({
          catering: false,
          bus: true,
          school: false,
          shop: false,
        }) ;
        break;
      case "学校":
        _this.setData({
          catering: false,
          bus: false,
          school: true,
          shop: false,
        });
       break;
      case "购物":
        _this.setData({
          catering: false,
          bus: false,
          school: false,
          shop: true,
        });
       break;
    }
    // 调用接口
    qqmapsdk.search({
      keyword: type,
      location: {
        latitude: _this.data.latitude,
        longitude: _this.data.longitude,
      },
      success: function (res) {
        console.log(res);
        var mks = []
                for (var i = 0; i < res.data.length; i++) {
                    mks.push({ // 获取返回结果，放到mks数组中
                        title: res.data[i].title,
                        id: res.data[i].id,
                        latitude: res.data[i].location.lat,
                        longitude: res.data[i].location.lng,
                        iconPath: app.globalData.imgPath+"location.png", //图标路径
                        width: 30,
                        height: 30
                    })
                }
                _this.setData({ //设置markers属性，将搜索结果显示在地图中
                    markers: mks
                })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
  
});

