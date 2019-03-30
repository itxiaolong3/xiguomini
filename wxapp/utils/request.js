module.exports = function(e) {
    e.data || (e.data = {});
    var a = wx.getStorageSync("access_token");
    a && (e.data.access_token = a), e.data._uniacid = this.siteInfo.uniacid, e.data._acid = this.siteInfo.acid, 
    e.data._version = this._version, "undefined" != typeof wx && (e.data._platform = "wx"), 
    "undefined" != typeof my && (e.data._platform = "my"), wx.request({
        url: e.url,
        header: e.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: e.data || {},
        method: e.method || "GET",
        dataType: e.dataType || "json",
        success: function(a) {
            -1 == a.data.code ? getApp().login() : -2 == a.data.code ? wx.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : e.success && e.success(a.data);
        },
        fail: function(a) {
            console.warn("--- request fail >>>"), console.warn(a), console.warn("<<< request fail ---");
            var t = getApp();
            t.is_on_launch ? (t.is_on_launch = !1, wx.showModal({
                title: "网络请求出错",
                content: a.errMsg,
                showCancel: !1,
                success: function(a) {
                    a.confirm && e.fail && e.fail(a);
                }
            })) : (wx.showToast({
                title: a.errMsg,
                image: "/images/icon-warning.png"
            }), e.fail && e.fail(a));
        },
        complete: function(t) {
            200 != t.statusCode && t.data.code && 500 == t.data.code && wx.showModal({
                title: "系统错误",
                content: t.data.data.type + "\r\n事件ID:" + t.data.data.event_id,
                cancelText: "关闭",
                confirmText: "复制",
                success: function(a) {
                    a.confirm && wx.setClipboardData({
                        data: t.data.data.type + "\r\n事件ID:" + t.data.data.event_id + "\r\n " + e.url
                    });
                }
            }), e.complete && e.complete(t);
        }
    });
};