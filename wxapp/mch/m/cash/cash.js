var api = require("../../../api.js"), app = getApp();

function min(a, e) {
    return a = parseFloat(a), (e = parseFloat(e)) < a ? e : a;
}

Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: 0
    },
    onLoad: function(a) {
        app.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        var i = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.mch.user.cash_preview,
            success: function(a) {
                if (0 == a.code) {
                    var e = {};
                    e.price = a.data.money, e.type_list = a.data.type_list, i.setData(e);
                }
            },
            complete: function(a) {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    showCashMaxDetail: function() {
        wx.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        });
    },
    select: function(a) {
        var e = a.currentTarget.dataset.index;
        e != this.data.check && this.setData({
            name: "",
            mobile: "",
            bank_name: ""
        }), this.setData({
            selected: e
        });
    },
    formSubmit: function(a) {
        var e = parseFloat(parseFloat(a.detail.value.cash).toFixed(2)), i = this.data.price;
        if (e) if (i < e) wx.showToast({
            title: "提现金额不能超过" + i + "元",
            image: "/images/icon-warning.png"
        }); else if (e < 1) wx.showToast({
            title: "提现金额不能低于1元",
            image: "/images/icon-warning.png"
        }); else {
            var t = this.data.selected;
            if (0 == t || 1 == t || 2 == t || 3 == t || 4 == t) {
                if (1 == t || 2 == t || 3 == t) {
                    if (!(s = a.detail.value.name) || null == s) return void wx.showToast({
                        title: "姓名不能为空",
                        image: "/images/icon-warning.png"
                    });
                    if (!(o = a.detail.value.mobile) || null == o) return void wx.showToast({
                        title: "账号不能为空",
                        image: "/images/icon-warning.png"
                    });
                }
                if (3 == t) {
                    if (!(n = a.detail.value.bank_name) || null == n) return void wx.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    });
                } else var n = "";
                if (4 == t || 0 == t) {
                    n = "";
                    var o = "", s = "";
                }
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: api.mch.user.cash,
                    method: "POST",
                    data: {
                        cash_val: e,
                        nickname: s,
                        account: o,
                        bank_name: n,
                        type: t,
                        scene: "CASH",
                        form_id: a.detail.formId
                    },
                    success: function(e) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(a) {
                                a.confirm && 0 == e.code && wx.redirectTo({
                                    url: "/mch/m/cash-log/cash-log"
                                });
                            }
                        });
                    }
                });
            } else wx.showToast({
                title: "请选择提现方式",
                image: "/images/icon-warning.png"
            });
        } else wx.showToast({
            title: "请输入提现金额",
            image: "/images/icon-warning.png"
        });
    }
});