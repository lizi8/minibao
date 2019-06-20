// pages/calculator/calculator.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[5,10,15,20,25,30],
    index:0,
    nav: ["商业贷款", "公积金贷款", "组合贷款"],
    navIndex: 0,
    money:"0.00",
    total:"0.00",
    lixi:"0.00",
    iscloan:true,
    isgloan: false,
    srateArr: ["最新商业贷款基准利率(4.9%)", "最新商业贷款利率上浮40%(6.86%)", "最新商业贷款利率上浮20%(5.88%)", "最新商业贷款利率上浮15%(5.64%)", "最新商业贷款利率上浮10%(5.39%)", "最新商业贷款利率上浮5%(5.15%)", "最新商业贷款利率下浮5%(4.66%)", "最新商业贷款利率下浮10%(4.41%)", "最新商业贷款利率下浮15%(4.17%)", "最新商业贷款利率下浮20%(3.92%)", "最新商业贷款利率下浮30%(3.43%)"],
    srateNumArr: ["4.9", "6.86", "5.88", "5.64", "5.39", "5.15", "4.66", "4.41", "4.17", "3.92", "3.43"],
  sindex:0,
    grateArr: ["最新公积金基准利率(3.25%)", "最新公积金基准利率上浮20%(3.9%)", "最新公积金基准利率上浮10%(3.58%)"],
    grateNumArr: ["3.25", "3.9", "3.58"],
   gindex:0
  },

  changeList: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    switch(index){
      case 0: 
        _this.setData({
          navIndex: index,
          iscloan: true,
          isgloan: false,
          money:"0.00",
          total: "0.00",
          lixi: "0.00",
        });
      break;
      case 1:
        _this.setData({
          navIndex: index,
          iscloan: false,
          isgloan: true,
          money: "0.00",
          total: "0.00",
          lixi: "0.00",
        });
        break;
      case 2:
        _this.setData({
          navIndex: index,
          iscloan: true,
          isgloan: true,
          money: "0.00",
          total: "0.00",
          lixi: "0.00",
        });
        break;
    }
   
  },
  yearChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  srateChange:function(e){
    this.setData({
      sindex: e.detail.value
    })
  },
  grateChange: function (e) {
    this.setData({
      gindex: e.detail.value
    })
  },
  formSubmit:function(e){
    var _this = this;
    var type = e.detail.value.type;//还款方式
    var money_s = e.detail.value.money1; //贷款总额
    var money_g = e.detail.value.money2; //贷款总额
    var loansYear = e.detail.value.loansYear; //贷款期限
    var srate = e.detail.value.srate;//商贷利率
    var grate = e.detail.value.grate;//公积金贷利率
    console.log(e.detail.value);
    switch (_this.data.navIndex){
      case 0:
        if (money_s==""){
          util.wxshowModal("提示", "请输入商贷总额");
          return false;
        }
       _this.onMonthlyMoney1(srate / 100, money_s * 10000, loansYear * 12,type);break;
      case 1: 
        if (money_s == "") {
          util.wxshowModal("提示", "请输入公积金总额");
          return false;
        }
      _this.onMonthlyMoney1(grate / 100, money_g * 10000, loansYear * 12, type); break;
      case 2:
        if (money_s == "") {
          util.wxshowModal("提示", "请输入商贷总额");
          return false;
        }
        if (money_s == "") {
          util.wxshowModal("提示", "请输入公积金总额");
          return false;
        }
       _this.onMonthlyMoney3(srate / 100, money_s * 10000, grate / 100, money_g * 10000, loansYear * 12, type); break;
    }

 
  },
  onMonthlyMoney1: function (lilv, daikuan_total, month, type){
    var _this = this;
    var money ="";
    var total="";
    var lixi="";
    if(type=="1"){
      //本息还款
      //月均还款
      var month_money1 = _this.getMonthMoney1(lilv, daikuan_total, month);//调用函数计算
       money = Math.round(month_money1 * 100) / 100;
      //还款总额
      var all_total1 = month_money1 * month;
      total = Math.round(all_total1 * 100) / 100;
      //支付利息款
      lixi = Math.round((all_total1 - daikuan_total) * 100) / 100;
    }else{
      //1.本金还款
      //月还款
      var all_total2 = 0;
      var month_money2 = "";
      for (var j = 0; j < month; j++) {
        //调用函数计算: 本金月还款额
        var huankuan = _this.getMonthMoney2(lilv, daikuan_total, month, j);
        all_total2 += huankuan;
        huankuan = Math.round(huankuan * 100) / 100;
        //fmobj.month_money2.options[j] = new Option( (j+1) +"月," + huankuan + "(元)", huankuan);
        month_money2 += (j + 1) + "月," + huankuan + "(元)\n";
      }
        var  huankuan1 = _this.getMonthMoney2(lilv, daikuan_total, month, 0);
      money = Math.round(huankuan1 * 100) / 100;
        //fmobj.month_money2.options[j] = new Option( (j+1) +"月," + huankuan + "(元)", huankuan);
     
      console.log(month_money2);

      //还款总额
      total = Math.round(all_total2 * 100) / 100;
      //支付利息款
      lixi= Math.round((all_total2 - daikuan_total) * 100) / 100;
      // money = month_money2[0];
    }
    _this.setData({
      money: money,
      total: total,
      lixi:lixi
    })
  },

  onMonthlyMoney3: function (lilv_sd, total_sy, lilv_gjj, total_gjj, month, type) {
    var _this = this;
    var money = "";
    var total = "";
    var lixi = "";
    var daikuan_total = total_sy + total_gjj;
    if (type == "1") {
      //2.本息还款
      //月均还款
      var month_money1 = _this.getMonthMoney1(lilv_sd, total_sy, month) + _this.getMonthMoney1(lilv_gjj, total_gjj, month);//调用函数计算
      money= Math.round(month_money1 * 100) / 100;
      //还款总额
      var all_total1 = month_money1 * month;
      total= Math.round(all_total1 * 100) / 100;
      //支付利息款
      lixi = Math.round((all_total1 - daikuan_total) * 100) / 100;
    } else {
      //1.本金还款
      //月还款
      var all_total2 = 0;
      var month_money2 = "";
      for (var j = 0; j < month; j++) {
        //调用函数计算: 本金月还款额
       var  huankuan = _this.getMonthMoney2(lilv_sd, total_sy, month, j) + _this.getMonthMoney2(lilv_gjj, total_gjj, month, j);
        all_total2 += huankuan;
        huankuan = Math.round(huankuan * 100) / 100;
        //fmobj.month_money2.options[j] = new Option( (j+1) +"月," + huankuan + "(元)", huankuan);
        month_money2 += (j + 1) + "月," + huankuan + "(元)\n";
      }
      var huankuan1 = _this.getMonthMoney2(lilv_sd, total_sy, month, 0) + _this.getMonthMoney2(lilv_gjj, total_gjj, month,0);

      money = Math.round(huankuan1 * 100) / 100;
      //fmobj.month_money2.options[j] = new Option( (j+1) +"月," + huankuan + "(元)", huankuan);
  
      console.log(month_money2);
      // money = month_money2;
      //还款总额
      total = Math.round(all_total2 * 100) / 100;
      //支付利息款
      lixi= Math.round((all_total2 - daikuan_total) * 100) / 100;
    }
    _this.setData({
      money: money,
      total: total,
      lixi: lixi
    })

  },
  //本息还款的月还款额(参数: 年利率/贷款总额/贷款总月份)
  getMonthMoney1:function(lilv, total, month){
    var lilv_month = lilv / 12;//月利率
    return total * lilv_month * Math.pow(1 + lilv_month, month) / (Math.pow(1 + lilv_month, month) - 1);
  },
  //本金还款的月还款额(参数: 年利率 / 贷款总额 / 贷款总月份 / 贷款当前月0～length-1)
  getMonthMoney2:function(lilv, total, month, cur_month){
    var lilv_month = lilv / 12;//月利率
    //return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
    var benjin_money = total / month;
    return(total - benjin_money * cur_month) * lilv_month + benjin_money;

}
})