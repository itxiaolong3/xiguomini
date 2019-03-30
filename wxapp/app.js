var hj = null, page = null, request = null, api = null, utils = null, order_pay = null, uploader = null, login = null;

"undefined" != typeof wx && (hj = require("./hj.js"), page = require("./utils/page.js"), 
request = require("./utils/request.js"), api = require("./api.js"), utils = require("./utils/utils.js"), 
order_pay = require("./commons/order-pay/order-pay.js"), uploader = require("./utils/uploader"), 
login = require("./utils/login.js"));

var _app = App({
    is_on_launch: !0,
    onShowData: null,
    _version: "2.6.7",
    onLaunch: function() {
        this.setApi(), api = this.api, this.getNavigationBarColor(), this.getStoreData(), 
        this.getCatList();
    },
    onShow: function(e) {
        this.onShowData = e;
    },
    getStoreData: function() {
        var t = this;
        this.request({
            url: api.default.store,
            success: function(e) {
                0 == e.code && (t.hj.setStorageSync("store", e.data.store), t.hj.setStorageSync("store_name", e.data.store_name), 
                t.hj.setStorageSync("show_customer_service", e.data.show_customer_service), t.hj.setStorageSync("contact_tel", e.data.contact_tel), 
                t.hj.setStorageSync("share_setting", e.data.share_setting), t.permission_list = e.data.permission_list, 
                t.hj.setStorageSync("wxapp_img", e.data.wxapp_img), t.hj.setStorageSync("wx_bar_title", e.data.wx_bar_title));
            },
            complete: function() {}
        });
    },
    getCatList: function() {
        var a = this;
        this.request({
            url: api.default.cat_list,
            success: function(e) {
                if (0 == e.code) {
                    var t = e.data.list || [];
                    a.hj.setStorageSync("cat_list", t);
                }
            }
        });
    },
    saveFormId: function(e) {
        this.request({
            url: api.user.save_form_id,
            data: {
                form_id: e
            }
        });
    },
    loginBindParent: function(e) {
        if ("" == this.hj.getStorageSync("access_token")) return !0;
        this.bindParent(e);
    },
    bindParent: function(e) {
        var t = this;
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var a = t.hj.getStorageSync("user_info");
            if (0 < t.hj.getStorageSync("share_setting").level) 0 != e.parent_id && t.request({
                url: api.share.bind_parent,
                data: {
                    parent_id: e.parent_id
                },
                success: function(e) {
                    0 == e.code && (a.parent = e.data, t.hj.setStorageSync("user_info", a));
                }
            });
        }
    },
    shareSendCoupon: function(a) {
        var i = this;
        i.hj.showLoading({
            mask: !0
        }), a.hideGetCoupon || (a.hideGetCoupon = function(e) {
            var t = e.currentTarget.dataset.url || !1;
            a.setData({
                get_coupon_list: null
            }), t && i.hj.navigateTo({
                url: t
            });
        }), this.request({
            url: api.coupon.share_send,
            success: function(e) {
                0 == e.code && a.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function() {
                i.hj.hideLoading();
            }
        });
    },
    getauth: function(t) {
        var a = this;
        a.hj.showModal({
            title: "是否打开设置页面重新授权",
            content: t.content,
            confirmText: "去设置",
            success: function(e) {
                e.confirm ? a.hj.openSetting({
                    success: function(e) {
                        t.success && t.success(e);
                    },
                    fail: function(e) {
                        t.fail && t.fail(e);
                    },
                    complete: function(e) {
                        t.complete && t.complete(e);
                    }
                }) : t.cancel && a.getauth(t);
            }
        });
    },
    setApi: function() {
        var i = this.siteInfo.siteroot;
        i = i.replace("app/index.php", ""), i += "addons/zjhj_mall/core/web/index.php?store_id=-1&r=api/", 
        this.api = function e(t) {
            for (var a in t) "string" == typeof t[a] ? t[a] = t[a].replace("{$_api_root}", i) : t[a] = e(t[a]);
            return t;
        }(this.api);
        var e = this.api.default.index, t = e.substr(0, e.indexOf("/index.php"));
        this.webRoot = t;
    },
    webRoot: null,
    siteInfo: require("./siteinfo.js"),
    currentPage: null,
    pageOnLoad: function(e) {
        this.page.onLoad(e);
    },
    pageOnReady: function(e) {
        this.page.onReady(e);
    },
    pageOnShow: function(e) {
        this.page.onShow(e);
    },
    pageOnHide: function(e) {
        this.page.onHide(e);
    },
    pageOnUnload: function(e) {
        this.page.onUnload(e);
    },
    getNavigationBarColor: function() {
        var t = this;
        t.request({
            url: api.default.navigation_bar_color,
            success: function(e) {
                0 == e.code && (t.hj.setStorageSync("_navigation_bar_color", e.data), t.setNavigationBarColor());
            }
        });
    },
    setNavigationBarColor: function() {
        var e = this.hj.getStorageSync("_navigation_bar_color");
        e && this.hj.setNavigationBarColor(e);
    },
    loginNoRefreshPage: [ "pages/index/index", "mch/shop/shop" ],
    openWxapp: function(e) {
        if (e.currentTarget.dataset.url) {
            var t = e.currentTarget.dataset.url;
            (t = function(e) {
                var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, a = /^[^\?]+\?([\w\W]+)$/.exec(e), i = {};
                if (a && a[1]) for (var n, r = a[1]; null != (n = t.exec(r)); ) i[n[1]] = n[2];
                return i;
            }(t)).path = t.path ? decodeURIComponent(t.path) : "", this.hj.navigateToMiniProgram({
                appId: t.appId,
                path: t.path,
                complete: function(e) {}
            });
        }
    },
    navigatorClick: function(e, t) {
        var a = e.currentTarget.dataset.open_type;
        if ("redirect" == a) return !0;
        if ("wxapp" == a) {
            var i = e.currentTarget.dataset.path;
            "/" != i.substr(0, 1) && (i = "/" + i), this.hj.navigateToMiniProgram({
                appId: e.currentTarget.dataset.appid,
                path: i,
                complete: function(e) {}
            });
        }
        if ("tel" == a) {
            var n = e.currentTarget.dataset.tel;
            this.hj.makePhoneCall({
                phoneNumber: n
            });
        }
        return !1;
    },
    hj: hj,
    page: page,
    request: request,
    api: api,
    utils: utils,
    order_pay: order_pay,
    uploader: uploader,
    login: login,
    setRequire: function() {
        this.hj = require("./hj.js"), this.request = require("./utils/request.js"), this.page = require("./utils/page.js"), 
        this.api = require("./api.js"), this.utils = require("./utils/utils.js"), this.order_pay = require("./commons/order-pay/order-pay.js"), 
        this.uploader = require("./utils/uploader"), this.login = require("./utils/login.js");
    }
});

"undefined" != typeof my && _app.setRequire();