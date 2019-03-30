function objectToUrlParams(t) {
    var e = "";
    for (var r in t) e += "&" + r + "=" + t[r];
    return e.substr(1);
}

var hj = null;

if ("undefined" != typeof wx) hj = wx; else {
    (hj = my).getSystemInfoSync = function() {
        return {};
    };
    var setStorageSync = my.setStorageSync;
    hj.setStorageSync = function(t, e) {
        return setStorageSync({
            key: t,
            data: e
        });
    };
    var getStorageSync = my.getStorageSync;
    hj.getStorageSync = function(t) {
        var e = getStorageSync({
            key: t
        });
        return e ? e.data : e;
    }, hj.request = function(t) {
        if ("get" == t.method.toLowerCase() && t.data) {
            var e = objectToUrlParams(t.data);
            t.url += "&" + e, t.data = null;
        }
        my.httpRequest(t);
    }, hj.setNavigationBarColor = function() {}, hj.setNavigationBarTitle = function() {};
}

module.exports = hj;