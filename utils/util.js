const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

//提示弹框
function wxshowModal(title, content) {
  wx.showModal({
    title: title,
    showCancel: false,
    content: content,
    success: function(res) {}
  })
}
function wxshowToast(title) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000,
    mask: true
  })
}


//request请求
function requestApi(url, param, callBack) {

  let openID = wx.getStorageSync('openID');
  let session_key= wx.getStorageSync('session_key');
  if (param.Method != "Check" && !openID && !session_key) {
    app.doLogin();
    return false;
  }
  wx.showLoading({
    title: '加载中...',
  });
  wx.request({
    url: url,
    data: param,
    // method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      wx.hideLoading();
      callBack(res.data);
    },
    fail: function(error) {
      console.log(error)
    }
  })
}



function wxchooseImage(url, picUrl, callBack) {
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function(res) {
      var tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths);
      wx.uploadFile({
        url: url,
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: function(res) {
          console.log(res);
          var path = picUrl + res.data;
          callBack(path);
        }
      })
    }
  })
}

module.exports = {
  formatTime,
  formatDate,
  wxshowModal,
  requestApi,
  wxchooseImage,
  wxshowToast,

}