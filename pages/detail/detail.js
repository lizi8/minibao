// pages/detail/detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    onBuildAll:false,
    isAroundAll: false,
    windowWidth: '',
    posterHeight: '',
    isposter:false,
    picUrl: app.globalData.picUrl,
    imgPath: app.globalData.imgPath,
  },
  onLoad: function (options){
    console.log("buildId---", options.id);
    var _this = this;
    _this.setData({
      buildId: options.id
    });
  },
  onShow:function(){
    var _this = this;
    var param1 = {
      Method: 'UserRead',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: _this.data.buildId,
      NickUrl: wx.getStorageSync('userInfo').avatarUrl,
      NickName: wx.getStorageSync('userInfo').nickName
    };
    util.requestApi(app.globalData.apiUrl, param1, function (res) {
      console.log(res);
    });


    var param = {
      Method: "GetProject",
      "ProjectCode": _this.data.buildId,
      OpenID: wx.getStorageSync('openID')
    };
    util.requestApi(app.globalData.apiUrl, param, _this.dataList);
  


    var param2 = {
      Method: 'GetNickUrl',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: _this.data.buildId,
    };

    util.requestApi(app.globalData.apiUrl, param2, function (res) {
      console.log(res);
      var list = res;
      var arr = [];
      if (list.length > 10) {
        for (var i = 0; i < 10; i++) {
          arr.push(list[i]);
        }
      } else {
        arr = list;
      }
      _this.setData({
        headList: arr
      });
    });

    const poster = {
      "width": 243.5,
      "height": 528
    }
    const systemInfo = wx.getSystemInfoSync();
    let windowWidth = systemInfo.windowWidth;
    let windowHeight = systemInfo.windowHeight;
    let posterwidth = windowWidth*0.63;
    let posterHeight = parseInt((posterwidth/poster.width) * poster.height);
    let posterLeft = parseInt((windowWidth - posterwidth) / 2);
    var top = windowHeight - posterHeight-35;
    let posterTop=0;
    if (top>0){
      posterTop = parseInt( top / 2);
    }
    _this.setData({
      posterwidth: posterwidth,
      posterHeight: posterHeight,
      posterLeft: posterLeft,
      posterTop: posterTop
    })
  },
  dataList:function(res){
    var _this = this;
    console.log(res[0]);
    _this.setData({
      values: res[0]
    })
    wx.setNavigationBarTitle({
      title: _this.data.values.Name
    })
  },
  

  onBuildAll:function(){
    var _this = this;
    _this.setData({
      isBuildAll:true
    })
  },
  onAroundAll: function () {
    var _this = this;
    _this.setData({
      isAroundAll: true
    })
  },

  getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res)
        },
        fail: function () {
          reject("")
        }
      })
    })
  },
  getImageAll: function (image_src) {
    var _this = this;
    var all = [];
    image_src.map(function (item) {
      all.push(_this.getImage(item))
    })
    return Promise.all(all)
  },
  creatQr:function(){
    var _this = this;
    
    var param = {
      Method: 'GetSmallCode',
      path: "pages/login/login",
      scene: _this.data.buildId + "," + wx.getStorageSync("userID"),
    };
    util.requestApi(app.globalData.apiUrl, param, function (res) {
    
      _this.setData({
        qrName: res
      });
      _this.createPoster();

    });
  },
  //创建
  createPoster: function () {
    var _this = this;

    wx.showLoading({
      title: "正在生成",
      icon: 'loading',
      mask:true,
      // duration: 2000
    })

    //图片一把是通过接口请求后台，返回俩点地址，或者网络图片
    let bg = app.globalData.postPath +_this.data.buildId+".jpg";
    let qr = app.globalData.qrpath + _this.data.qrName;
    let avatar = wx.getStorageSync('userInfo').avatarUrl;
    
    //图片区别下载完成，生成临时路径后，在尽心绘制
    this.getImageAll([bg, qr, avatar]).then((res) => {
      let bg = res[0];
      let qr = res[1];
      let avatar = res[2];


      //设置canvas width height position-left,  为图片宽高
      let nickname = wx.getStorageSync('userInfo').nickName;
      var bgw = _this.data.posterwidth;
      var bgh = _this.data.posterHeight;
      let ctx = wx.createCanvasContext('myCanvas');
      ctx.width = bgw;
      ctx.height = bgh;
      ctx.drawImage(bg.path, 0, 0, bgw, bgh);
      ctx.save();
      //绘制昵称
      ctx.setFontSize(12)
      ctx.setFillStyle('white')
      ctx.fillText(nickname, bgw * 0.3, bgh * 0.95)

    
      //绘制头像
      ctx.save();
      ctx.arc(bgw * 0.16, bgh * 0.94, bgw * 0.1, 0, 2 * Math.PI) //画出圆
      ctx.strokeStyle = "#ffe200";
      ctx.clip(); //裁剪上面的圆形
      ctx.drawImage(avatar.path, bgw * 0.06, bgh * 0.89, bgw * 0.2, bgw * 0.21); // 在刚刚裁剪的园上画图
      ctx.restore();

      //绘制二维码
      ctx.save();
      ctx.arc(bgw * 0.8, bgh * 0.94, bgw * 0.12, 0, 2 * Math.PI) //画出圆
      ctx.strokeStyle = "#000";
      ctx.clip(); //裁剪上面的圆形
      ctx.drawImage(qr.path, bgw * 0.68, bgh * 0.884, bgw * 0.24, bgw * 0.24);
      ctx.restore();
      ctx.draw();
      wx.hideLoading();
      _this.setData({
        isposter: true
      })
    })
  },
 
  //保存
  onSave: function () {
    wx.canvasToTempFilePath({//canvas 生成图片 生成临时路径
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({ //下载图片
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "保存成功",
              icon: "success",
            })
          }
        })
      }
    })
  },
  onClose: function () {
    var _this = this;
    _this.setData({
      isposter: false
    })
  },
  onToPhoto:function(e){
      var _this =this;
      wx.navigateTo({
        url: '../photo/photo?id=' + _this.data.buildId,
      })
  },
  onHeadList: function () {
    var _this = this;
    wx.navigateTo({
      url: '../access/access?id=' + _this.data.buildId,
    })
  },
  onReserve: function () {
    var _this = this;
    wx.navigateTo({
      url: '../reserve/reserve?id=' + _this.data.buildId,
    })
  },
  onMap: function () {
    var _this = this;
    wx.navigateTo({
      url: '../map/map?latitude=' + _this.data.values.Addrlat + '&longitude=' + _this.data.values.Addrlng + "&title=" + _this.data.values.Name,
    })
  },
  onCollect: function () {
    var _this = this;
    var param = {
      Method: 'UpCollection',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: _this.data.buildId,
    };
    util.requestApi(app.globalData.apiUrl, param, _this.collectData);
  },
  collectData: function (res){
    var _this = this;
    _this.setData({
      "values.IsShow": res[0].IsShow
    })
  },

  onShareAppMessage: function () {
    var _this =this;
    return {
      title: _this.data.values.Name,
      desc: '',
      imageUrl: '',
      path: '/pages/login/login?buildId=' + _this.data.buildId + "&userId=" + wx.getStorageSync("userID")
    }
  },
  previewImg: function (e) {
    var imgurl = e.currentTarget.dataset.imgurl;
    var arr=[];
    arr.push(imgurl);
    console.log(imgurl);
    wx.previewImage({
      current: imgurl,     
      urls: arr,             
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onTel:function(){
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.values.AskPhone
    })
  },
  onCalculator:function(){
    wx.navigateTo({
      url: '../calculator/calculator'
    })
  }
})