module.exports = {
    currentPage: null,
    onLoad: function(t) {
        this.currentPage = t;
        var a = this;
        if (t.options) {
            var e = 0;
            if (t.options.user_id) e = t.options.user_id; else if (t.options.scene) if (isNaN(t.options.scene)) {
                var i = decodeURIComponent(t.options.scene);
                i && (i = getApp().utils.scene_decode(i)) && i.uid && (e = i.uid);
            } else e = t.options.scene;
            e && wx.setStorageSync("parent_id", e);
        }
        if (void 0 === t.openWxapp && (t.openWxapp = getApp().openWxapp), void 0 === t.showToast && (t.showToast = function(e) {
            a.showToast(e);
        }), void 0 === t._formIdFormSubmit) {
            a = this;
            t._formIdFormSubmit = function(e) {
                a.formIdFormSubmit(e);
            };
        }
        getApp().setNavigationBarColor(), this.setPageNavbar(t), t.naveClick = function(e) {
            getApp().navigatorClick(e, t);
        }, this.setDeviceInfo(), this.setPageClasses(), this.setUserInfo(), void 0 === t.showLoadling && (t.showLoading = function(e) {
            a.showLoading(e);
        }), void 0 === t.hideLoading && (t.hideLoading = function(e) {
            a.hideLoading(e);
        }), this.setWxappImg(), this.setBarTitle();
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().order_pay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    showToast: function(e) {
        var t = this.currentPage, a = e.duration || 2500, i = e.title || "", s = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: i
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof s && s();
        }, a);
    },
    formIdFormSubmit: function(e) {},
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], a = wx.getSystemInfoSync();
        if (a.model) for (var i in 0 <= a.model.indexOf("iPhone X") && (a.model = "iPhone X"), 
        t) t[i].model == a.model && e.setData({
            __device: t[i].id
        });
    },
    setPageNavbar: function(s) {
        var t = this, e = wx.getStorageSync("_navbar");
        e && n(e);
        var a = !1;
        for (var i in this.navbarPages) if (s.route == this.navbarPages[i]) {
            a = !0;
            break;
        }
        function n(e) {
            var t = !1, a = s.route || s.__route__ || null;
            for (var i in e.navs) e.navs[i].url === "/" + a ? t = e.navs[i].active = !0 : e.navs[i].active = !1;
            t && s.setData({
                _navbar: e
            });
        }
        a && getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (n(e.data), wx.setStorageSync("_navbar", e.data), t.setPageClasses());
            }
        });
    },
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list" ],
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (t += " show_navbar"), 
        t && e.setData({
            __page_classes: t
        });
    },
    setUserInfo: function() {
        var e = this.currentPage, t = wx.getStorageSync("user_info");
        t && e.setData({
            __user_info: t
        });
    },
    showLoading: function(e) {
        this.currentPage.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage, a = wx.getStorageSync("wxapp_img");
        a && t.setData({
            __wxapp_img: a
        });
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, a = wx.getStorageSync("wx_bar_title");
        for (var i in a) a[i].url === t && wx.setNavigationBarTitle({
            title: a[i].title
        });
    }
};