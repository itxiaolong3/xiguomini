var api = require("../../api.js"), app = getApp();

Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(e) {
        app.pageOnLoad(this);
    },
    loadData: function(e) {
        var a = this;
        a.setData({
            store: wx.getStorageSync("store")
        });
        var t = wx.getStorageSync("pages_user_user");
        t && a.setData(t), app.request({
            url: api.user.index,
            success: function(e) {
                0 == e.code && (a.setData(e.data), wx.setStorageSync("pages_user_user", e.data), 
                wx.setStorageSync("share_setting", e.data.share_setting), wx.setStorageSync("user_info", e.data.user_info));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        app.pageOnShow(this);
        this.loadData();
    },
    callTel: function(e) {
        var a = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    apply: function(a) {
        var t = wx.getStorageSync("share_setting"), n = wx.getStorageSync("user_info");
        1 == t.share_condition ? wx.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != t.share_condition && 2 != t.share_condition || (0 == n.is_distributor ? wx.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(e) {
                e.confirm && (wx.showLoading({
                    title: "正在加载",
                    mask: !0
                }), app.request({
                    url: api.share.join,
                    method: "POST",
                    data: {
                        form_id: a.detail.formId
                    },
                    success: function(e) {
                        0 == e.code && (0 == t.share_condition ? (n.is_distributor = 2, wx.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (n.is_distributor = 1, wx.navigateTo({
                            url: "/pages/share/index"
                        })), wx.setStorageSync("user_info", n));
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        }) : wx.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(e) {
        wx.scanCode({
            onlyFromCamera: !1,
            success: function(e) {
                wx.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function(e) {
                wx.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        wx.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function(e) {
        var a, t;
        app.permission_list && app.permission_list.length && (a = app.permission_list, t = "integralmall", 
        -1 != ("," + a.join(",") + ",").indexOf("," + t + ",")) && wx.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    }
});