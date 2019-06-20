// pages/goods/goods.js
const app = getApp();
Page({
  data: {
    picUrl: app.globalData.picUrl,
    imgPath: app.globalData.imgPath,
  },
  onLoad: function (options){
    var _this = this;
    _this.setData({
      goodsId: options.id
    });
    let goodsData = {};
    var dataList = wx.getStorageSync('goodsData');
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].GoodsCode == _this.data.goodsId) {
        goodsData = dataList[i];
      }
    }
    _this.setData({
      goods: goodsData,
      imgUrl: _this.data.picUrl + goodsData.ImgUrl
    });
  },
  //立即核销
  onVerification:function(){
    var _this = this;
    wx.navigateTo({
      url: '../verification/verification?id='+_this.data.goodsId,
    })  
  }
})