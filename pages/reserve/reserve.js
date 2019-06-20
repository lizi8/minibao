// pages/reserve/reserve.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    gender: 0,
    array: ['请选择','男', '女'],
    startdata: util.formatDate(new Date()),
  },
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      buildId: options.id,
    });
  },
  bindGenderChange:function(e){
    this.setData({
      gender: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      reserveDate: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log(e.detail);
    var _this = this;
    var userName = e.detail.value.userName;
  
    var gender = e.detail.value.gender;
    var phone = e.detail.value.phone;
    var reserveDate = e.detail.value.reserveDate;
    if (userName == "") {
      util.wxshowModal("提示", "请输入姓名");
      return false;
    }
    if (gender == 0) {
      util.wxshowModal("提示", "请选择性别");
      return false;
    }
    if (phone == "") {
      util.wxshowModal("提示", "请输入手机号码");
      return false;
    }
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(phone)) || phone.length != 11) {
      util.wxshowModal("提示", "电话格式不正确");
      return false;
    };
    if (reserveDate == "") {
      util.wxshowModal("提示", "请选择时间");
      return false;
    }
    var param = {
      Method: 'SaveYuYue',
      OpenID: wx.getStorageSync('openID'),
      ProjectCode: _this.data.buildId,
      Name:userName,
      Phone:phone,
      Sex: gender,
      Time: reserveDate
    };
    util.requestApi(app.globalData.apiUrl, param,function(res){
      console.log(res);
      util.wxshowToast("预约成功");
      setTimeout(function () {
         wx.navigateBack({
        delta: 1
      });
      }, 2000)
    })
  }
 

 
})