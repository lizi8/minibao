//app.js
App({
  onLaunch: function () {
    var _this =this;
  },
  globalData: {
    userInfo: null,
    openID: "",
    session_key: "",
    apiUrl: "https://wb.jaas.ac.cn/BaoLiWebSmall/CommonHelper.ashx",
    picUrl: "https://wb.jaas.ac.cn/BaoLiWebThink/UpLoad/",
    upLoadUrl: 'https://wb.jaas.ac.cn/BaoLiWebSmall/upLoad.ashx',
    thumbUrl: "https://wb.jaas.ac.cn/BaoLiWebSmall/Thumb/",
    imgPath: "/images/",
    postPath:"https://wb.jaas.ac.cn/BaoLiWebSmall/images/",
    qrpath: "https://wb.jaas.ac.cn/BaoLiWebSmall/qr/",
  },

  doLogin() {
    wx.reLaunch({
      url: '/pages/login/login'
    });
  },
 
})