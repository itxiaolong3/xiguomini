var api = require("../../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        app.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        this.loadOrderDetails();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this, o = "/pages/pt/group/details?oid=" + t.data.order_info.order_id;
        return {
            title: t.data.order_info.goods_list[0].name,
            path: o,
            imageUrl: t.data.order_info.goods_list[0].goods_pic,
            success: function(t) {}
        };
    },
    loadOrderDetails: function() {
        var o = this, t = o.options.scene;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), app.request({
            url: api.group.order.clerk_order_details,
            data: {
                id: t
            },
            success: function(t) {
                0 == t.code ? (3 != t.data.status && o.countDownRun(t.data.limit_time_ms), o.setData({
                    order_info: t.data,
                    limit_time: t.data.limit_time
                })) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    copyText: function(t) {
        var o = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: o,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    clerkOrder: function(t) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(t) {
                t.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), app.request({
                    url: api.group.order.clerk,
                    data: {
                        order_id: o.data.order_info.order_id
                    },
                    success: function(t) {
                        0 == t.code ? wx.redirectTo({
                            url: "/pages/user/user"
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: t.msg,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : t.cancel;
            }
        });
    },
    location: function() {
        var t = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address,
            name: t.name
        });
    }
});