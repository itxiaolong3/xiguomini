var api = require("../../api.js"), app = getApp(), pay = {
    init: function(l, t) {
        var _ = this;
        _.page = l, app = t, _.page.orderPay = function(t) {
            var e = t.currentTarget.dataset.index, a = _.page.data.order_list[e], o = new Array();
            if (void 0 !== _.page.data.pay_type_list) o = _.page.data.pay_type_list; else if (void 0 !== a.pay_type_list) o = a.pay_type_list; else if (void 0 !== a.goods_list[0].pay_type_list) o = a.goods_list[0].pay_type_list; else {
                var i = {
                    payment: 0
                };
                o.push(i);
            }
            var r = getCurrentPages(), s = r[r.length - 1].route, n = api.order.pay_data;
            function d(t, e, a) {
                app.request({
                    url: e,
                    data: {
                        order_id: t,
                        pay_type: "WECHAT_PAY"
                    },
                    complete: function() {
                        wx.hideLoading();
                    },
                    success: function(t) {
                        0 == t.code && wx.requestPayment({
                            timeStamp: t.data.timeStamp,
                            nonceStr: t.data.nonceStr,
                            package: t.data.package,
                            signType: t.data.signType,
                            paySign: t.data.paySign,
                            success: function(t) {},
                            fail: function(t) {},
                            complete: function(t) {
                                "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? wx.redirectTo({
                                    url: "/" + a + "?status=1"
                                }) : wx.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(t) {
                                        t.confirm && wx.redirectTo({
                                            url: "/" + a + "?status=0"
                                        });
                                    }
                                });
                            }
                        }), 1 == t.code && wx.showToast({
                            title: t.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            function c(e, a, o) {
                var t = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + t.money,
                    content: "是否使用余额",
                    success: function(t) {
                        t.confirm && (wx.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), app.request({
                            url: a,
                            data: {
                                order_id: e,
                                pay_type: "BALANCE_PAY"
                            },
                            complete: function() {
                                wx.hideLoading();
                            },
                            success: function(t) {
                                0 == t.code && wx.redirectTo({
                                    url: "/" + o + "?status=1"
                                }), 1 == t.code && wx.showModal({
                                    title: "提示",
                                    content: t.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            -1 != s.indexOf("pt") ? n = api.group.pay_data : -1 != s.indexOf("miaosha") && (n = api.miaosha.pay_data), 
            1 == o.length ? (wx.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == o[0].payment && d(a.order_id, n, s), 3 == o[0].payment && c(a.order_id, n, s)) : wx.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "微信支付",
                success: function(t) {
                    t.confirm ? (wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), d(a.order_id, n, s)) : t.cancel && c(a.order_id, n, s);
                }
            });
        }, _.page.order_submit = function(i, g) {
            var t = api.order.submit, r = api.order.pay_data, u = "/pages/order/order";
            if ("pt" == g ? (t = api.group.submit, r = api.group.pay_data, u = "/pages/pt/order/order") : "ms" == g ? (t = api.miaosha.submit, 
            r = api.miaosha.pay_data, u = "/pages/miaosha/order/order") : "pond" == g ? (t = api.pond.submit, 
            r = api.order.pay_data, u = "/pages/order/order") : "scratch" == g && (t = api.scratch.submit, 
            r = api.order.pay_data, u = "/pages/order/order"), 3 == i.payment) {
                var e = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + e.money,
                    content: "是否确定使用余额支付",
                    success: function(t) {
                        t.confirm && a();
                    }
                });
            } else a();
            function a() {
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: t,
                    method: "post",
                    data: i,
                    success: function(t) {
                        if (0 == t.code) {
                            var e = function() {
                                app.request({
                                    url: r,
                                    data: {
                                        order_id: p,
                                        order_id_list: a,
                                        pay_type: o,
                                        form_id: i.formId
                                    },
                                    success: function(t) {
                                        if (0 != t.code) return wx.hideLoading(), void _.page.showToast({
                                            title: t.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), "pt" == g ? "ONLY_BUY" == _.page.data.type ? wx.redirectTo({
                                            url: u + "?status=2"
                                        }) : wx.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + p
                                        }) : void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length && 2 != i.payment ? _.page.setData({
                                            show_card: !0
                                        }) : wx.redirectTo({
                                            url: u + "?status=-1"
                                        });
                                    }
                                });
                            };
                            if (null != t.data.p_price && 0 === t.data.p_price) return l.showToast({
                                title: "提交成功"
                            }), void setTimeout(function() {
                                wx.navigateBack();
                            }, 2e3);
                            setTimeout(function() {
                                _.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var p = t.data.order_id || "", a = t.data.order_id_list ? JSON.stringify(t.data.order_id_list) : "", o = "";
                            0 == i.payment ? app.request({
                                url: r,
                                data: {
                                    order_id: p,
                                    order_id_list: a,
                                    pay_type: "WECHAT_PAY"
                                },
                                success: function(t) {
                                    if (0 != t.code) {
                                        if (1 == t.code) return wx.hideLoading(), void _.page.showToast({
                                            title: t.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), wx.requestPayment({
                                            timeStamp: t.data.timeStamp,
                                            nonceStr: t.data.nonceStr,
                                            package: t.data.package,
                                            signType: t.data.signType,
                                            paySign: t.data.paySign,
                                            success: function(t) {},
                                            fail: function(t) {},
                                            complete: function(t) {
                                                "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg || (void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                                    show_card: !0
                                                }) : "pt" == g ? "ONLY_BUY" == _.page.data.type ? wx.redirectTo({
                                                    url: u + "?status=2"
                                                }) : wx.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + p
                                                }) : wx.redirectTo({
                                                    url: u + "?status=1"
                                                })) : wx.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(t) {
                                                        t.confirm && wx.redirectTo({
                                                            url: u + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var e = wx.getStorageSync("quick_list");
                                        if (e) {
                                            for (var a = e.length, o = 0; o < a; o++) for (var i = e[o].goods, r = i.length, s = 0; s < r; s++) i[s].num = 0;
                                            wx.setStorageSync("quick_lists", e);
                                            var n = wx.getStorageSync("carGoods");
                                            for (a = n.length, o = 0; o < a; o++) n[o].num = 0, n[o].goods_price = 0, l.setData({
                                                carGoods: n
                                            });
                                            wx.setStorageSync("carGoods", n);
                                            var d = wx.getStorageSync("total");
                                            d && (d.total_num = 0, d.total_price = 0, wx.setStorageSync("total", d));
                                            wx.getStorageSync("check_num");
                                            0, wx.setStorageSync("check_num", 0);
                                            var c = wx.getStorageSync("quick_hot_goods_lists");
                                            for (a = c.length, o = 0; o < a; o++) c[o].num = 0, l.setData({
                                                quick_hot_goods_lists: c
                                            });
                                            wx.setStorageSync("quick_hot_goods_lists", c);
                                        }
                                    }
                                }
                            }) : 2 == i.payment ? (o = "HUODAO_PAY", e()) : 3 == i.payment && (o = "BALANCE_PAY", 
                            e());
                        }
                        if (1 == t.code) return wx.hideLoading(), void _.page.showToast({
                            title: t.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
        };
    }
};

module.exports = pay;