var api = require("../../../api.js"), utils = require("../../../utils/utils.js"), app = getApp();

Page({
    data: {
        now_date: new Date()
    },
    onLoad: function(t) {
        app.pageOnLoad(this), this.getPreview(t);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkboxChange: function(t) {
        var e = t.target.dataset.pid, a = t.target.dataset.id, o = this.data.form_list, i = o[e].default[a].selected;
        o[e].default[a].selected = 1 != i, this.setData({
            form_list: o
        });
    },
    radioChange: function(t) {
        var e = t.target.dataset.pid, a = this.data.form_list;
        for (var o in a[e].default) t.target.dataset.id == o ? a[e].default[o].selected = !0 : a[e].default[o].selected = !1;
        this.setData({
            form_list: a
        });
    },
    inputChenge: function(t) {
        var e = t.target.dataset.id, a = this.data.form_list;
        a[e].default = t.detail.value, this.setData({
            form_list: a
        });
    },
    getPreview: function(t) {
        var o = this, e = t.id;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.book.submit_preview,
            method: "get",
            data: {
                gid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    for (var e in t.data.form_list) "date" == t.data.form_list[e].type && (t.data.form_list[e].default = t.data.form_list[e].default ? t.data.form_list[e].default : utils.formatData(new Date())), 
                    "time" == t.data.form_list[e].type && (t.data.form_list[e].default = t.data.form_list[e].default ? t.data.form_list[e].default : "00:00");
                    var a = t.data.option;
                    a ? (1 == a.balance && (o.setData({
                        balance: !0,
                        pay_type: "BALANCE_PAY"
                    }), app.request({
                        url: api.user.index,
                        success: function(t) {
                            0 == t.code && wx.setStorageSync("user_info", t.data.user_info);
                        }
                    })), 1 == a.wechat && o.setData({
                        wechat: !0,
                        pay_type: "WECHAT_PAY"
                    })) : o.setData({
                        wechat: !0,
                        pay_type: "WECHAT_PAY"
                    }), o.setData({
                        goods: t.data.goods,
                        form_list: t.data.form_list
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    booksubmit: function(e) {
        var a = this, t = a.data.pay_type;
        if (0 != a.data.goods.price) {
            if ("BALANCE_PAY" == t) {
                var o = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + o.money,
                    content: "是否使用余额",
                    success: function(t) {
                        t.confirm && a.submit(e);
                    }
                });
            }
            "WECHAT_PAY" == t && a.submit(e);
        } else a.submit(e);
    },
    submit: function(t) {
        var e = t.detail.formId, a = this, o = a.data.goods.id, i = JSON.stringify(a.data.form_list), s = a.data.pay_type;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), app.request({
            url: api.book.submit,
            method: "post",
            data: {
                gid: o,
                form_list: i,
                form_id: e,
                pay_type: s
            },
            success: function(t) {
                if (0 == t.code) {
                    if (1 != t.type) return wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), void wx.requestPayment({
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        success: function(t) {
                            wx.redirectTo({
                                url: "/pages/book/order/order?status=1"
                            });
                        },
                        fail: function(t) {},
                        complete: function(t) {
                            setTimeout(function() {
                                wx.hideLoading();
                            }, 1e3), "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg && wx.redirectTo({
                                url: "/pages/book/order/order?status=-1"
                            }) : wx.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(t) {
                                    t.confirm && wx.redirectTo({
                                        url: "/pages/book/order/order?status=0"
                                    });
                                }
                            });
                        }
                    });
                    wx.redirectTo({
                        url: "/pages/book/order/order?status=1"
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {}
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    switch: function(t) {
        this.setData({
            pay_type: t.currentTarget.dataset.type
        });
    },
    uploadImg: function(t) {
        var e = this, a = t.currentTarget.dataset.id, o = e.data.form_list;
        app.uploader.upload({
            start: function() {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (o[a].default = t.data.url, e.setData({
                    form_list: o
                })) : e.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                e.showToast({
                    title: t
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});