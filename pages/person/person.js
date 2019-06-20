// pages/person/person.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    array: ['请选择', '男', '女'],
    userName: '',
    gender: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var param = {
      Method: "GetUser",
      OpenID: wx.getStorageSync("openID")
    };
    util.requestApi(app.globalData.apiUrl, param, function (res) {
      _this.setData({
        infos: res[0]
      })
      console.log(_this.data.infos);
    });
  },
  //上传头像
  uploadHead: function() {
    var _this = this;
    util.wxchooseImage(app.globalData.upLoadUrl, app.globalData.thumbUrl,function(res){
    _this.setData({
      "infos.NameUrl": res
    })
  });
  },
  //性别
  bindgenderChange:function(e){
    this.setData({
      "infos.Sex": e.detail.value
    })
  },
  //获取手机号码
  getPhoneNumber: function(e) {
    var _this = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    } else {
      var param = {
        Method: "AESDecryptPhone",
        encryptedData: e.detail.encryptedData,
        session_key: wx.getStorageSync('session_Key'),
        iv: e.detail.iv
      };
      util.requestApi(app.globalData.apiUrl, param, function (res) {
        _this.setData({
          "infos.Phone": res.phoneNumber
        })
        })
      }
  },
  //提交数据
  formSubmit: function(e) {
    var _this = this;
    var headUrl = e.detail.value.headUrl;
    var userName = e.detail.value.userName;
    var gender = e.detail.value.gender;
    var phone = e.detail.value.phone;
    _this.setData({
      userName: userName,
      gender: gender,
    })
    var param = {
      Method: "UpUser",
      OpenID: wx.getStorageSync('openID'),
      Name: userName,
      Phone: _this.data.infos.Phone,
      Sex: gender,
      NameUrl: _this.data.infos.NameUrl
    };
    util.requestApi(app.globalData.apiUrl, param, _this.userData)
  },
  userData: function(res) {
    let _this = this;
    _this.setData({
      "infos.Name": _this.data.userName,
      "infos.Sex": _this.data.gender,
    })
    util.wxshowToast("修改成功");
    setTimeout(function () {
      wx.switchTab({
        url: "/pages/user/user"
      })
    }, 2000)
    
  }
})