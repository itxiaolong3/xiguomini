var api = require("../../api.js"), app = getApp(), is_no_more = !1, is_loading_more = !1;

Page({
    data: {
        cat_list: [],
        sub_cat_list_scroll_top: 0,
        scrollLeft: 0,
        page: 1,
        cat_style: 0,
        height: 0,
        catheight: 120
    },
    onLoad: function(t) {
        app.pageOnLoad(this);
        var a = wx.getStorageSync("store"), e = t.cat_id;
        void 0 !== e && e && (this.data.cat_style = a.cat_style = -1, wx.showLoading({
            title: "正在加载",
            mask: !0
        }), this.childrenCat(e)), this.setData({
            store: a
        });
    },
    onShow: function() {
        wx.hideLoading(), app.pageOnShow(this), -1 !== this.data.cat_style && this.loadData();
    },
    loadData: function(t) {
      console.log(wx.getStorageSync("store").cat_style,'购物车类型');
        var a = this;
        if ("" == a.data.cat_list || 5 != wx.getStorageSync("store").cat_style && 4 != wx.getStorageSync("store").cat_style && 2 != wx.getStorageSync("store").cat_style) {
            var e = wx.getStorageSync("cat_list");
            e && a.setData({
                cat_list: e,
                current_cat: null
            }), app.request({
                url: api.default.cat_list,
                success: function(t) {
                  //这里我做修改，改为4类型也加载商品
                    0 == t.code && (a.data.cat_list = t.data.list, 4 === wx.getStorageSync("store").cat_style && a.goodsAll({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }), 4 !== wx.getStorageSync("store").cat_style && 2 !== wx.getStorageSync("store").cat_style || a.catItemClick({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }), 1 !== wx.getStorageSync("store").cat_style && 3 !== wx.getStorageSync("store").cat_style || (a.setData({
                        cat_list: t.data.list,
                        current_cat: null
                    }), wx.setStorageSync("cat_list", t.data.list)));
                },
                complete: function() {
                    wx.stopPullDownRefresh();
                }
            });
        } else a.setData({
            cat_list: a.data.cat_list,
            current_cat: a.data.current_cat
        });
    },
    childrenCat: function(i) {
        var o = this;
        is_no_more = !1;
        o.data.page;
        app.request({
            url: api.default.cat_list,
            success: function(t) {
                if (0 == t.code) {
                    var a = !0;
                    for (var e in t.data.list) for (var s in t.data.list[e].id == i && (a = !1, o.data.current_cat = t.data.list[e], 
                    0 < t.data.list[e].list.length ? (o.setData({
                        catheight: 100
                    }), o.firstcat({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    })) : o.firstcat({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }, !1)), t.data.list[e].list) t.data.list[e].list[s].id == i && (a = !1, o.data.current_cat = t.data.list[e], 
                    o.goodsItem({
                        currentTarget: {
                            dataset: {
                                index: s
                            }
                        }
                    }, !1));
                    a && o.setData({
                        show_no_data_tip: !0
                    });
                }
            },
            complete: function() {
                wx.stopPullDownRefresh(), wx.createSelectorQuery().select("#cat").boundingClientRect(function(t) {
                    o.setData({
                        height: t.height
                    });
                }).exec();
            }
        });
    },
    catItemClick: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.cat_list, s = null;
        for (var i in e) i == a ? (!(e[i].active = !0), s = e[i]) : e[i].active = !1;
      var carid = t.currentTarget.dataset.id ? t.currentTarget.dataset.id : e[0].id
      console.log(carid, '当前选中');
      console.log(e,'当前购物车数据');
      this.mygetgoodlist(carid, 1)
        this.setData({
            cat_list: e,
            sub_cat_list_scroll_top: 0,
            current_cat: s
        });
    },
    firstcat: function(t) {
        var a = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1], e = this.data.current_cat;
        this.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            current_cat: a ? e : []
        }), this.list(e.id, 2);
    },
    goodsItem: function(t) {
        var a = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1], e = t.currentTarget.dataset.index, s = this.data.current_cat, i = 0;
        for (var o in s.list) e == o ? (s.list[o].active = !0, i = s.list[o].id) : s.list[o].active = !1;
        this.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            current_cat: a ? s : []
        }), this.list(i, 2);
    },
    goodsAll: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.cat_list, i = null;
        for (var o in s) o == e ? (s[o].active = !0, i = s[o]) : s[o].active = !1;
        a.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            cat_list: s,
            current_cat: i
        });
        var c = t.currentTarget.offsetLeft, r = a.data.scrollLeft;
        r = c - 80, a.setData({
            scrollLeft: r
        }), this.list(i.id, 1), wx.createSelectorQuery().select("#catall").boundingClientRect(function(t) {
            a.setData({
                height: t.height
            });
        }).exec();
    },
    list: function(a, t) {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), is_no_more = !1;
        var s = e.data.page || 2;
        app.request({
            url: api.default.goods_list,
            data: {
                cat_id: a,
                page: s
            },
            success: function(t) {
                0 == t.code && (wx.hideLoading(), 0 == t.data.list.length && (is_no_more = !0), 
                e.setData({
                    page: s + 1
                }), e.setData({
                    goods_list: t.data.list
                }), e.setData({
                    cat_id: a
                })), e.setData({
                    show_no_data_tip: 0 == e.data.goods_list.length
                });
            },
            complete: function() {
                1 == t && wx.createSelectorQuery().select("#catall").boundingClientRect(function(t) {
                    e.setData({
                        height: t.height
                    });
                }).exec();
            }
        });
    },
    mygetgoodlist:function(id,pagenum){
      var e = this;
      wx.showLoading({
        title: "正在加载",
        mask: !0
      }), is_no_more = !1;
      app.request({
        url: api.default.goods_list,
        data: {
          cat_id: id,
          page: pagenum
        },
        success: function (t) {
          0 == t.code && (wx.hideLoading(), 0 == t.data.list.length && (is_no_more = !0),
            e.setData({
              goods_list: t.data.list
            }), e.setData({
              cat_id: id
            }))
        },
        complete: function () {
       
        }
      });

    },
    onReachBottom: function() {
        is_no_more || 5 != wx.getStorageSync("store").cat_style && -1 != this.data.cat_style || this.loadMoreGoodsList();
    },
    loadMoreGoodsList: function() {
        var e = this;
        if (!is_loading_more) {
            e.setData({
                show_loading_bar: !0
            }), is_loading_more = !0;
            var t = e.data.cat_id || "", s = e.data.page || 2;
            app.request({
                url: api.default.goods_list,
                data: {
                    page: s,
                    cat_id: t
                },
                success: function(t) {
                    0 == t.data.list.length && (is_no_more = !0);
                    var a = e.data.goods_list.concat(t.data.list);
                    e.setData({
                        goods_list: a,
                        page: s + 1
                    });
                },
                complete: function() {
                    is_loading_more = !1, e.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    }
});