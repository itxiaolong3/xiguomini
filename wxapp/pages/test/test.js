var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    formSubmit: function(n) {
        app.saveFormId(n.detail.formId);
    },
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    send: function() {
        app.request({
            url: "http://cje.tunnel.qydev.com/we7offical/addons/zjhj_mall/core/web/index.php?store_id=1&r=api/user/test",
            success: function(n) {}
        });
    }
});