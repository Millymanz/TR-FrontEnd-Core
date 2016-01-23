define("controls/underscore", ["underscore"], function(e) {
    return e.noConflict()
}), define("controls/jquery", ["jquery"], function(e) {
    return e.noConflict()
}), define("controls/Backbone", ["jquery", "backbone", "toastr"], function(e, t, n) {
    var r = t.noConflict(),
        i = t.Collection.prototype.initialize,
        s = t.Collection.prototype.fetch;
    return r.Collection.prototype.initialize = function() {
        this.on("sync error", this.setNotFetching, this), this.once("sync error", this.onFirstSync, this), this.once("error", this.onError, this), i.apply(this, arguments)
    }, r.Collection.prototype.parse = function(e) {
        return this.fetchLimit && e && (e.length === this.fetchLimit + 1 ? (this.moreData = !0, e.splice(this.fetchLimit)) : this.moreData = !1), e
    }, r.Collection.prototype.fetch = function(t) {
        t = t || {}, t.error = t.error || function(e, t) {
            n.error(t.status + " error<br />" + t.responseText)
        }, this.fetching || (this.fetching = !0, this.fetchLimit ? s.call(this, e.extend({
            data: {
                start: 0,
                count: this.fetchLimit
            }
        }, t)) : s.call(this, t))
    }, r.Collection.prototype.fetchMore = function() {
        s.call(this, {
            data: {
                start: this.length,
                count: this.fetchLimit
            },
            remove: !1
        })
    }, r.Collection.prototype.setNotFetching = function() {
        this.fetching = !1
    }, r.Collection.prototype.onFirstSync = function() {
        this.synced = !0
    }, r.Collection.prototype.onError = function(e) {
        this.errored = !0, this.errorMessage = e
    }, r.Collection.prototype.isFetching = function() {
        return !!this.fetching
    }, r.Collection.prototype.isSynced = function() {
        return !!this.synced
    }, r.Collection.prototype.isErrored = function() {
        return !!this.errored
    }, r.View = function(e) {
        return e.extend({
            constructor: function(t) {
                this.options = t || {}, e.apply(this, arguments)
            }
        })
    }(r.View), r.set3rdPartyMode = function() {
        var e = r.sync;
        r.is3rdPartyMode = !0, r.sync = function(t, n, r) {
            var i = typeof n.url == "function" ? n.url() : n.url;
            r.url = "https://www.cloud9trader.com" + i.replace("/api/", "/public-api/"), e(t, n, r)
        }
    }, r
}), define("controls/overlay", ["jquery"], function(e) {
    function n() {
        this.$el = e("<div>", {
            "class": "c9t-overlay"
        }), this.$el.hide(), e("body").append(this.$el)
    }
    var t = 0;
    return n.prototype.show = function() {
        t++, this.$el.show()
    }, n.prototype.hide = function() {
        t--, t === 0 && this.$el.hide()
    }, new n
}), define("controls/Events", ["underscore", "backbone"], function(e, t) {
    return t.Events.waitFor = function(e, t, n, r) {
        var i, s = function() {
            clearTimeout(i), t.apply(n, arguments)
        }.bind(n);
        i = setTimeout(function() {
            this.off(e, s, n), t.call(n, "timeout")
        }.bind(this), r), this.once(e, s, n)
    }, t.Events.listenFor = function(e, t, n, r) {
        setTimeout(function() {
            this.off(e, t, n)
        }.bind(this), r), this.on(e, t, n)
    }, t.Events.mixin = function(t) {
        var n = ["on", "once", "off", "trigger", "stopListening", "listenTo", "listenToOnce", "bind", "unbind", "addListener", "emit", "removeListener", "removeAllListeners", "waitFor", "listenFor"];
        return e.each(n, function(e) {
            t[e] = this[e]
        }, this), t
    }, t.Events
}), define("registry/main", ["jquery", "backbone", "../controls/Events"], function(e, t, n) {
    var r = {
        events: n.mixin({})
    };
    return window.c9tRegistry = r, e.extend({
        register: function(e, t) {
            return r[e] ? console.warn("Cannot re-register " + e) : (r[e] = t, this.trigger("register:" + e, t), t)
        },
        get: function(e) {
            return r[e]
        }
    }, t.Events)
}), define("registry", ["registry/main"], function(e) {
    return e
}), define("controls/Dialogue", ["jquery", "backbone", "./overlay", "registry"], function(e, t, n, r) {
    var i = t.View.extend({
        className: "c9t c9t-dialogue",
        showClose: !1,
        showActions: !0,
        showCancel: !0,
        initialize: function() {
            var t = this.$actions = e("<div>", {
                    "class": "c9t-actions"
                }),
                n = this.options.title || this.title;
            this.$el.hide(), n && (this.$header = e("<h2>" + n + "</h2>"), this.$el.append(this.$header)), this.showClose && (this.$close = e("<div>", {
                "class": "close-button fa fa-times"
            }), this.$close.on("click", this.onCloseClick.bind(this)), this.$el.append(this.$close)), (this.width || this.options.width) && this.$el.width(this.width || this.options.width), this.$errors = e("<div>", {
                "class": "c9t-errors alert alert-error"
            }).hide(), this.$el.append(this.$errors), this.$body = e("<div>", {
                "class": "c9t-body"
            }), this.$el.append(this.$body), this.options.body && this.$body.append(this.options.body), this.showActions && (this.$ok = e("<button>", {
                "class": "btn btn-info ok-button"
            }).html(this.OKText || this.options.OKText || "OK"), t.append(this.$ok), this.showCancel && t.append(e("<button>", {
                "class": "btn btn-info cancel-button"
            }).text("Cancel")), t.on("click", "button", this.onButtonClick.bind(this)), this.$el.append(t)), e("body").append(this.$el), setTimeout(this.center.bind(this), 100)
        },
        show: function() {
            n.show(), this.$el.show(), this.center(), e(document).on("keydown.dialogue", this.onKeyPress.bind(this)), e(window).on("resize.dialogue", this.onResizeWindow.bind(this)), r.get("events").trigger("dialogue:show"), this.listenToOnce(r.get("events"), "dialogue:show", this.hide), this.listenToOnce(r.get("events"), "mobile-drawer:open", this.hide)
        },
        hide: function() {
            n.hide(), this.$el.remove(), this.options.onHide && this.options.onHide(), this.tearDown()
        },
        onButtonClick: function(t) {
            var n = e(t.currentTarget);
            n.hasClass("ok-button") ? this.onOKClick() : n.hasClass("cancel-button") && (this.onCancel && this.onCancel(), this.hide())
        },
        onOKClick: function() {
            var e = !0;
            this.onOK ? e = this.onOK.call(this) : this.options.onOK && this.options.onOK(), this.showActions && e && this.hide()
        },
        onCloseClick: function() {
            this.onCancel && this.onCancel(), this.hide()
        },
        onKeyPress: function(e) {
            e.which === 13 ? this.onOKClick() : e.which === 27 && (this.onCancel && this.onCancel(), this.hide())
        },
        updateErrors: function() {
            this.$errors.empty(), this.errors.length ? (this.$errors.append(this.errors.join("<br />")), this.$errors.show(), this.$ok && this.$ok.prop("disabled", !0)) : (this.$errors.hide(), this.$ok && this.$ok.prop("disabled", !1))
        },
        center: function() {
            var t, n = e(window).height(),
                r = n - 108;
            r < 500 && (r = 500), this.$body.css("max-height", r), t = -this.$el.outerHeight() / 1.7, 8 - t > n / 2 && (t = 8 - n / 2), this.$el.css("margin-left", -this.$el.outerWidth() / 2), this.$el.css("margin-top", t)
        },
        onResizeWindow: function() {
            this.center()
        },
        setOKDisabled: function(e) {
            this.$ok && this.$ok.prop("disabled", e)
        },
        tearDown: function() {
            e(document).off(".dialogue"), e(window).off(".dialogue"), this.stopListening()
        }
    });
    return i
}), define("controls/alertDialogue", ["./Dialogue"], function(e) {
    var t = e.extend({
        className: "c9t-dialogue alert-dialogue",
        showCancel: !1,
        initialize: function() {
            e.prototype.initialize.call(this), this.$body.text(this.options.message)
        }
    });
    return function(e, n) {
        var r = new t({
            message: e,
            onOK: function() {
                return n && n.ok && n.ok(), !0
            }
        });
        r.show()
    }
}), define("utils/config", [], function() {
    return {
        intervals: {
            Tick: {
                ms: 0,
                seconds: 0,
                readable: "Tick",
                readableMid: "Tick",
                readableShort: "Tick"
            },
            S5: {
                ms: 5e3,
                seconds: 5,
                readable: "5 second",
                readableMid: "5 sec",
                readableShort: "5s"
            },
            S15: {
                ms: 15e3,
                seconds: 15,
                readable: "15 second",
                readableMid: "15 sec",
                readableShort: "15s"
            },
            S30: {
                ms: 3e4,
                seconds: 30,
                readable: "30 second",
                readableMid: "30 sec",
                readableShort: "30s"
            },
            M1: {
                ms: 6e4,
                seconds: 60,
                minutes: 1,
                readable: "1 minute",
                readableMid: "1 min",
                readableShort: "1m"
            },
            M2: {
                ms: 12e4,
                seconds: 120,
                minutes: 2,
                readable: "2 minute",
                readableMid: "2 min",
                readableShort: "2m"
            },
            M5: {
                ms: 3e5,
                seconds: 300,
                minutes: 5,
                readable: "5 minute",
                readableMid: "5 min",
                readableShort: "5m"
            },
            M10: {
                ms: 6e5,
                seconds: 600,
                minutes: 10,
                readable: "10 minute",
                readableMid: "10 min",
                readableShort: "10m"
            },
            M15: {
                ms: 9e5,
                seconds: 900,
                minutes: 15,
                readable: "15 minute",
                readableMid: "15 min",
                readableShort: "15m"
            },
            M30: {
                ms: 18e5,
                seconds: 1800,
                minutes: 30,
                readable: "30 minute",
                readableMid: "30 min",
                readableShort: "30m"
            },
            H1: {
                ms: 36e5,
                seconds: 3600,
                minutes: 60,
                readable: "1 hour",
                readableMid: "1 hr",
                readableShort: "1h"
            },
            H2: {
                ms: 72e5,
                seconds: 7200,
                minutes: 120,
                readable: "2 hour",
                readableMid: "2 hr",
                readableShort: "2h"
            },
            H4: {
                ms: 144e5,
                seconds: 14400,
                minutes: 240,
                readable: "4 hour",
                readableMid: "4 hr",
                readableShort: "4h"
            },
            H8: {
                ms: 288e5,
                seconds: 28800,
                minutes: 480,
                readable: "8 hour",
                readableMid: "8 hr",
                readableShort: "8h"
            },
            H12: {
                ms: 432e5,
                seconds: 43200,
                minutes: 720,
                readable: "12 hour",
                readableMid: "12 hr",
                readableShort: "12h"
            },
            D1: {
                ms: 864e5,
                seconds: 86400,
                minutes: 1440,
                readable: "1 day",
                readableMid: "1 day",
                readableShort: "1d"
            },
            W1: {
                ms: 6048e5,
                seconds: 604800,
                minutes: 10080,
                readable: "1 week",
                readableMid: "1 wk",
                readableShort: "1w"
            }
        },
        intervalsInverse: {
            0: "Tick",
            5: "S5",
            15: "S15",
            30: "S30",
            60: "M1",
            120: "M2",
            300: "M5",
            600: "M10",
            900: "M15",
            1800: "M30",
            3600: "H1",
            7200: "H2",
            14400: "H4",
            28800: "H8",
            43200: "H12",
            86400: "D1",
            604800: "W1"
        }
    }
}), define("utils/Date", [], function() {
    function o(e, t) {
        return t ? String("00000" + e).slice(-t) : e.length === 1 ? "0" + e : e
    }
    var e = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        t = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        n = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        r = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        i = {
            hh: function(e) {
                return o(e.getHours().toString(10))
            },
            mm: function(e) {
                return o(e.getMinutes().toString(10))
            },
            ss: function(e) {
                return o(e.getSeconds().toString(10))
            },
            mmm: function(e) {
                return o(e.getMilliseconds().toString(10), 3)
            },
            d: function(e) {
                return e.getDay()
            },
            dd: function(e) {
                return t[e.getDay()]
            },
            ddd: function(t) {
                return e[t.getDay()]
            },
            DD: function(e) {
                return e.getDate()
            },
            ZD: function(e) {
                return o(e.getDate().toString(10))
            },
            M: function(e) {
                return e.getMonth() + 1
            },
            ZM: function(e) {
                return o((e.getMonth() + 1).toString(10))
            },
            MM: function(e) {
                return r[e.getMonth()]
            },
            MMM: function(e) {
                return n[e.getMonth()]
            },
            YY: function(e) {
                return e.getFullYear().toString(10).substring(2)
            },
            YYY: function(e) {
                return e.getFullYear().toString(10)
            },
            "hh:mm": function(e) {
                return i.hh(e) + ":" + i.mm(e)
            },
            "hh12:mm_ap": function(e) {
                var t = e.getHours();
                return (t % 12 || 12) + ":" + i.mm(e) + " " + (t < 12 ? "AM" : "PM")
            },
            "hh:mm:ss": function(e) {
                return i["hh:mm"](e) + ":" + i.ss(e)
            },
            "hh:mm:ss.mmm": function(e) {
                return i["hh:mm:ss"](e) + "." + i.mmm(e)
            },
            "M/DD/YYY": function(e) {
                return i.M(e) + "/" + i.DD(e) + "/" + i.YYY(e)
            },
            ISO: function(e) {
                return i.YYY(e) + "-" + i.ZM(e) + "-" + i.ZD(e) + "T" + i["hh:mm:ss.mmm"](e)
            }
        },
        s = {
            hh: function(e) {
                return o(e.getUTCHours().toString(10))
            },
            mm: function(e) {
                return o(e.getUTCMinutes().toString(10))
            },
            ss: function(e) {
                return o(e.getUTCSeconds().toString(10))
            },
            mmm: function(e) {
                return o(e.getUTCMilliseconds().toString(10), 3)
            },
            d: function(e) {
                return e.getUTCDay()
            },
            dd: function(e) {
                return t[e.getUTCDay()]
            },
            ddd: function(t) {
                return e[t.getUTCDay()]
            },
            DD: function(e) {
                return e.getUTCDate()
            },
            M: function(e) {
                return e.getUTCMonth() + 1
            },
            MM: function(e) {
                return r[e.getUTCMonth()]
            },
            MMM: function(e) {
                return n[e.getUTCMonth()]
            },
            YY: function(e) {
                return e.getUTCFullYear().toString(10).substring(2)
            },
            YYY: function(e) {
                return e.getUTCFullYear().toString(10)
            },
            "hh:mm": function(e) {
                return s.hh(e) + ":" + s.mm(e)
            },
            "hh12:mm_ap": function(e) {
                var t = e.getUTCHours();
                return (t % 12 || 12) + ":" + s.mm(e) + " " + (t < 12 ? "AM" : "PM")
            },
            "hh:mm:ss": function(e) {
                return s["hh:mm"](e) + ":" + s.ss(e)
            },
            "hh:mm:ss.mmm": function(e) {
                return s["hh:mm:ss"](e) + "." + s.mmm(e)
            },
            "M/DD/YYY": function(e) {
                return s.M(e) + "/" + s.DD(e) + "/" + s.YYY(e)
            },
            ISO: function(e) {
                return e.toISOString()
            }
        };
    return {
        milliseconds: {
            millsecond: 1,
            second: 1e3,
            minute: 6e4,
            hour: 36e5,
            day: 864e5,
            week: 6048e5,
            month: 262974e4,
            year: 315569e5
        },
        seconds: {
            millisecond: 1e3,
            second: 1,
            minute: 60,
            hour: 3600,
            day: 86400,
            week: 604800,
            month: 2629740,
            year: 31556900
        },
        days: e,
        shortDays: t,
        months: n,
        shortMonths: r,
        format: function(e, t) {
            var n = (t || "dd MM DD YYY hh:mm:ss").split(" "),
                r = [];
            return e ? (typeof e == "string" && (e = new Date(e)), n.forEach(function(t) {
                r.push(i[t](e))
            }), r.join(" ")) : ""
        },
        formatUTC: function(e, t) {
            var n = (t || "dd MM DD YYY hh:mm:ss").split(" "),
                r = [];
            return e ? (typeof e == "string" && (e = new Date(e)), n.forEach(function(t) {
                r.push(s[t](e))
            }), r.join(" ")) : ""
        },
        getUTCWeekNo: function(e, t) {
            var n = t || new Date(Date.UTC(e.getUTCFullYear(), 0, 1));
            return Math.ceil(((e - n) / this.milliseconds.day + n.getDay() + 1) / 7)
        },
        getUTCDateFromWeekNo: function(e, t) {
            var n;
            return t = t || new Date(Date.UTC((new Date).getUTCFullYear(), 0, 1)), n = t - t.getUTCDay() * this.milliseconds.day, new Date(n + e * this.milliseconds.week)
        },
        getUTCMonthNo: function(e, t) {
            return t ? (e.getUTCFullYear() - t.getUTCFullYear()) * 12 + (e.getUTCMonth() - t.getUTCMonth()) + 1 : e.getUTCMonth() + 1
        },
        getUTCDateFromMonthNo: function(e, t) {
            return new Date(Date.UTC(t.getUTCFullYear() + Math.floor(e / 12), (t.getUTCMonth() + e) % 12 - 1, 1))
        }
    }
}), define("utils/Number", ["underscore"], function(e) {
    var t = {
        "0.2500000000": 188,
        "0.5000000000": 189,
        "0.7500000000": 190,
        .3333333333: 8531,
        .6666666667: 8532,
        "0.2000000000": 8533,
        "0.4000000000": 8534,
        "0.6000000000": 8535,
        "0.8000000000": 8536,
        .1666666667: 8537,
        .8333333333: 8538,
        "0.1250000000": 8539,
        "0.6250000000": 8541,
        "0.8750000000": 8542
    };
    return {
        format: function(e, t) {
            return this.formatMoney(e, null, t)
        },
        formatMoney: function(t, n, r, i, s) {
            var o, u, a;
            return typeof t != "number" || e.isNaN(t) ? "-" : (r = typeof r == "undefined" ? 2 : r, s = s || ".", i = i || ",", n = n || "", o = t < 0 ? "-" : "", u = parseInt(t = Math.abs(+t || 0).toFixed(r), 10) + "", a = (a = u.length) > 3 ? a % 3 : 0, o + n + (a ? u.substr(0, a) + i : "") + u.substr(a).replace(/(\d{3})(?=\d)/g, "$1" + i) + (r ? s + Math.abs(t - u).toFixed(r).slice(2) : ""))
        },
        displayFractions: function(e) {
            var n = (e % 1).toFixed(10);
            return t[n] ? Math.floor(e) + String.fromCharCode(t[n]) : e.toString()
        },
        removePrecisionError: function(e) {
            return parseFloat(e.toFixed(16))
        }
    }
}), define("utils/String", ["underscore"], function(e) {
    function i(t) {
        var n = function(e) {
                return t[e]
            },
            r = "(?:" + e.keys(t).join("|") + ")",
            i = new RegExp(r),
            s = new RegExp(r, "g");
        return function(e) {
            return e = e === undefined || e === null ? "" : "" + e, i.test(e) ? e.replace(s, n) : e
        }
    }
    var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
        n = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "`": "&#x60;"
        },
        r = e.invert(n);
    return {
        randomKey: function(e) {
            var n = [];
            for (var r = 0; r < e; r++) n.push(t.charAt(Math.floor(Math.random() * 61)));
            return n.join("")
        },
        ellipsis: function(e, t) {
            return e.length > t ? e.substr(0, t) + "…" : e
        },
        escape: i(n),
        unescape: i(r)
    }
}), define("utils/Maths", [], function() {
    return {
        count: function(e) {
            return e && e.length
        },
        sum: function(e) {
            var t = 0;
            for (var n = 0; n < e.length; n++) t += e[n];
            return t
        },
        sumSquares: function(e) {
            var t = 0;
            for (var n = 0; n < e.length; n++) t += Math.pow(e[n], 2);
            return t
        },
        mean: function(e) {
            return e.length === 0 ? null : this.sum(e) / e.length
        },
        variance: function(e) {
            if (e.length === 0) return null;
            var t = this.mean(e),
                n = [];
            for (var r = 0; r < e.length; r++) n.push(Math.pow(e[r] - t, 2));
            return this.mean(n)
        },
        standardDeviation: function(e) {
            return e.length === 0 ? null : Math.sqrt(this.variance(e))
        },
        sumNthPowerDeviations: function(e, t) {
            var n = this.mean(e),
                r = 0;
            for (var i = 0; i < e.length; i++) r += Math.pow(e[i] - n, t);
            return r
        },
        sampleVariance: function(e) {
            return e.length <= 1 ? null : this.sumNthPowerDeviations(e, 2) / (e.length - 1)
        },
        sampleStandardDeviation: function(e) {
            return e.length <= 1 ? null : Math.sqrt(this.sampleVariance(e))
        },
        sampleCovariance: function(e, t) {
            if (e.length <= 1 || e.length !== t.length) return null;
            var n = this.mean(e),
                r = this.mean(t),
                i = 0;
            for (var s = 0; s < e.length; s++) i += (e[s] - n) * (t[s] - r);
            return i / (e.length - 1)
        },
        sampleCorrelation: function(e, t) {
            var n = this.sampleCovariance(e, t),
                r = this.sampleStandardDeviation(e),
                i = this.sampleStandardDeviation(t);
            return n === null || r === null || i === null ? null : n / (r * i)
        }
    }
}), define("utils/cookie", [], function() {
    return {
        read: function(e) {
            var t = encodeURIComponent(e) + "=",
                n = document.cookie.split(";");
            for (var r = 0; r < n.length; r++) {
                var i = n[r];
                while (i.charAt(0) === " ") i = i.substring(1, i.length);
                if (i.indexOf(t) === 0) return decodeURIComponent(i.substring(t.length, i.length))
            }
            return null
        }
    }
}), define("utils/main", ["./config", "./Date", "./Number", "./String", "./Maths", "./cookie"], function(e, t, n, r, i, s) {
    return {
        config: e,
        Date: t,
        Number: n,
        String: r,
        Maths: i,
        cookie: s,
        inherits: function(e, t) {
            e.super_ = t, e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        }
    }
}), define("utils", ["utils/main"], function(e) {
    return e
}), define("user/Model", ["jquery", "backbone", "controls/alertDialogue", "utils", "toastr"], function(e, t, n, r, i) {
    var s = t.Model.extend({
        urlRoot: "/api/user",
        initialize: function() {
            this.onChange(), this.on("change", this.onChange, this), this.get("authenticated") && e(document).ajaxError(this.onAjaxError.bind(this))
        },
        get: function(e) {
            return e === "authenticated" ? !!this.id : t.Model.prototype.get.call(this, e)
        },
        onChange: function() {
            this.get("authenticated") ? (this.sendKeepAlive(), this.sessionKeepAlive || (this.sessionKeepAlive = setInterval(this.sendKeepAlive.bind(this), 6e4))) : (clearInterval(this.sessionKeepAlive), delete this.sessionKeepAlive)
        },
        sendKeepAlive: function() {
            e.ajax({
                type: "GET",
                url: "/api/keep-alive"
            }).done(function() {
                this.trigger("token-extended")
            }.bind(this))
        },
        logout: function(t) {
            e.ajax({
                type: "GET",
                url: "/api/user/logout"
            }).done(function() {
                t && t(), this.clear()
            }.bind(this)).fail(function() {
                t && t(!0), i.error("Error logging out")
            })
        },
        onAjaxError: function(e, t) {
            t.status === 401 && (this.clear(), clearInterval(this.sessionKeepAlive), n("Your login session has expired.", {
                ok: function() {
                    this.clear(), document.location.reload(!0)
                }.bind(this)
            }))
        }
    });
    return s
}), define("controls/localStorage", [], function() {
    return {
        set: function(e, t) {
            if (!window.localStorage) return;
            window.localStorage[e] = JSON.stringify(t)
        },
        get: function(e) {
            var t;
            if (!window.localStorage) return;
            t = window.localStorage[e];
            if (t) try {
                return JSON.parse(t)
            } catch (n) {
                delete window.localStorage[e];
                return
            }
        },
        unset: function(e) {
            if (!window.localStorage) return;
            window.localStorage.removeItem(e)
        }
    }
}), define("controls/PanelMixin", ["jquery", "./localStorage"], function(e, t) {
    function n() {
        this.$header = e("<h2>", {
            "class": "panel-header"
        }).text(this.title || ""), this.titleIcon && this.$header.prepend('<i class="fa ' + this.titleIcon + '"></i>'), this.$body = e("<div>", {
            "class": "body"
        }), this.$el.append(this.$header, this.$body), this.resizable && this.renderResizable()
    }
    return n.prototype.renderResizable = function() {
        this.$resizeHandle = e("<div>", {
            "class": "resize-handle"
        }), this.$resizeHandle.html("<div>"), this.$el.append(this.$resizeHandle), this.$resizeHandle.on("mousedown.panel", this._onResizeMouseDown.bind(this)), this.resizablePersistenceKey && t.get(this.resizablePersistenceKey) && setTimeout(function() {
            this._resize(t.get(this.resizablePersistenceKey))
        }.bind(this), 0)
    }, n.prototype._onResizeMouseDown = function(t) {
        this._startY = t.screenY, this._startHeight = this.$body.height(), e(window).on("mousemove.panel", this._onResizeMouseMove.bind(this)).on("mouseup.panel", this._onResizeMouseUp.bind(this)), e(document.body).addClass("no-select-text")
    }, n.prototype._onResizeMouseMove = function(e) {
        var t = Math.max(this._startHeight + e.screenY - this._startY, this.minHeight || 100);
        this._resize(t)
    }, n.prototype._resize = function(e) {
        this.$body.height(e), this.resizablePersistenceKey && t.set(this.resizablePersistenceKey, e), this.trigger("change:height", e)
    }, n.prototype._onResizeMouseUp = function(t) {
        e(window).off(".panel"), e(document.body).removeClass("no-select-text")
    }, n
}), define("controls/clearOverlay", ["jquery"], function(e) {
    function t() {
        this.$el = e("<div>", {
            "class": "c9t-clear-overlay"
        }), this.$el.hide(), e("body").append(this.$el)
    }
    return t.prototype.show = function(e, t, n) {
        this.$el.show(), this.$el.one("click", e), t && this.$el.addClass("c9t-mobile"), n && this.$el.addClass("dark")
    }, t.prototype.hide = function() {
        this.$el.off("click"), this.$el.hasClass("dark") ? (this.$el.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
            this.$el.hide()
        }.bind(this)), this.$el.removeClass("dark")) : this.$el.hide(), this.$el.removeClass("c9t-mobile")
    }, new t
}), define("controls/PopoutPanelMixin", ["underscore", "jquery", "./PanelMixin", "./clearOverlay", "registry"], function(e, t, n, r, i) {
    function s() {
        n.call(this), this.id = e.uniqueId(), this.$expandButton = t("<i>", {
            "class": "expandable-icon fa fa-angle-right"
        }), this.$header.on("click.pop-out-panel" + this.id, this.toggle.bind(this)), this.$el.addClass("c9t-panel-popout"), this.$el.append(this.$expandButton), this.$el.on("click", this._onClick.bind(this)), this.align === "left" && this.$body.addClass("left-align"), i.get("app") && (this.app = i.get("app"), this.app.on("enter-modal", this._onAppModalEnter, this)), this.positionAbsolute && (this.$body.addClass("c9t c9t-panel-popout-body-absolute"), this.$body.addClass(this.absolutePopoutClassName))
    }
    return s.prototype.toggle = function(e) {
        e.stopPropagation(), this.$el.hasClass("expanded") ? this.close() : this.open()
    }, s.prototype.open = function() {
        var e, n, r;
        this.positionAbsolute && (t(document.body).append(this.$body), r = this.$body.width(), e = this.$header.offset(), n = e.left - (this.align === "left" ? 0 : r - this.$header.width() - 20), n + r + 8 > t(document.body).width() && (n = t(document.body).width() - r - 8), n < 8 && (n = 8), this.$body.offset({
            left: n,
            top: e.top + this.$header.height() + 5 + (this.positionOffsetY || 0)
        })), t(window).on("keyup.pop-out-panel" + this.id, this._onKeyPress.bind(this)), this.$expandButton.addClass("fa-angle-down"), this.$el.addClass("expanded"), t(window).on("click.pop-out-panel" + this.id, this._onDocumentClick.bind(this)), this.onOpen && this.onOpen(), this.app && this.app.trigger("enter-modal", this)
    }, s.prototype.close = function() {
        this.positionAbsolute && this.$el.append(this.$body), this.$expandButton.removeClass("fa-angle-down"), this.$el.removeClass("expanded"), t(window).off("click.pop-out-panel" + this.id), t(window).off("keyup.pop-out-panel" + this.id)
    }, s.prototype._onKeyPress = function(e) {
        e.which === 27 && this.close()
    }, s.prototype._onClick = function(e) {
        e.stopPropagation()
    }, s.prototype._onDocumentClick = function() {
        this.close()
    }, s.prototype._onAppModalEnter = function(e) {
        e !== this && this.close()
    }, s
}), define("user/Menu", ["jquery", "backbone", "../controls/PopoutPanelMixin", "registry"], function(e, t, n, r) {
    var i = t.View.extend(e.extend({
        title: "",
        titleIcon: "fa-user",
        className: "user-menu",
        events: {
            "click .logout": "onLogoutClick"
        },
        initialize: function() {
            n.call(this), this.render()
        },
        render: function() {
            this.model.get("username") && this.$body.append('<p class="user">' + this.model.get("username") + "</p>", '<p class="email">' + this.model.get("email") + "</p>"), this.model.get("isAdmin") && this.$body.append('<div><a href="/admin">Admin</a></div>'), this.$body.append('<div><a class="logout" href="/logout">Sign out</a></div>')
        },
        onLogoutClick: function(e) {
            e.preventDefault(), r.get("user").logout(function(e) {
                e || document.location.reload(!0)
            }), this.close()
        }
    }, n.prototype));
    return i
}), define("text", ["module"], function(e) {
    "use strict";
    var t, n, r, i, s, o = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
        u = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        a = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        f = typeof location != "undefined" && location.href,
        l = f && location.protocol && location.protocol.replace(/\:/, ""),
        c = f && location.hostname,
        h = f && (location.port || undefined),
        p = {},
        d = e.config && e.config() || {};
    t = {
        version: "2.0.12",
        strip: function(e) {
            if (e) {
                e = e.replace(u, "");
                var t = e.match(a);
                t && (e = t[1])
            } else e = "";
            return e
        },
        jsEscape: function(e) {
            return e.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
        },
        createXhr: d.createXhr || function() {
            var e, t, n;
            if (typeof XMLHttpRequest != "undefined") return new XMLHttpRequest;
            if (typeof ActiveXObject != "undefined")
                for (t = 0; t < 3; t += 1) {
                    n = o[t];
                    try {
                        e = new ActiveXObject(n)
                    } catch (r) {}
                    if (e) {
                        o = [n];
                        break
                    }
                }
            return e
        },
        parseName: function(e) {
            var t, n, r, i = !1,
                s = e.indexOf("."),
                o = e.indexOf("./") === 0 || e.indexOf("../") === 0;
            return s !== -1 && (!o || s > 1) ? (t = e.substring(0, s), n = e.substring(s + 1, e.length)) : t = e, r = n || t, s = r.indexOf("!"), s !== -1 && (i = r.substring(s + 1) === "strip", r = r.substring(0, s), n ? n = r : t = r), {
                moduleName: t,
                ext: n,
                strip: i
            }
        },
        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
        useXhr: function(e, n, r, i) {
            var s, o, u, a = t.xdRegExp.exec(e);
            return a ? (s = a[2], o = a[3], o = o.split(":"), u = o[1], o = o[0], (!s || s === n) && (!o || o.toLowerCase() === r.toLowerCase()) && (!u && !o || u === i)) : !0
        },
        finishLoad: function(e, n, r, i) {
            r = n ? t.strip(r) : r, d.isBuild && (p[e] = r), i(r)
        },
        load: function(e, n, r, i) {
            if (i && i.isBuild && !i.inlineText) {
                r();
                return
            }
            d.isBuild = i && i.isBuild;
            var s = t.parseName(e),
                o = s.moduleName + (s.ext ? "." + s.ext : ""),
                u = n.toUrl(o),
                a = d.useXhr || t.useXhr;
            if (u.indexOf("empty:") === 0) {
                r();
                return
            }!f || a(u, l, c, h) ? t.get(u, function(n) {
                t.finishLoad(e, s.strip, n, r)
            }, function(e) {
                r.error && r.error(e)
            }) : n([o], function(e) {
                t.finishLoad(s.moduleName + "." + s.ext, s.strip, e, r)
            })
        },
        write: function(e, n, r, i) {
            if (p.hasOwnProperty(n)) {
                var s = t.jsEscape(p[n]);
                r.asModule(e + "!" + n, "define(function () { return '" + s + "';});\n")
            }
        },
        writeFile: function(e, n, r, i, s) {
            var o = t.parseName(n),
                u = o.ext ? "." + o.ext : "",
                a = o.moduleName + u,
                f = r.toUrl(o.moduleName + u) + ".js";
            t.load(a, r, function(n) {
                var r = function(e) {
                    return i(f, e)
                };
                r.asModule = function(e, t) {
                    return i.asModule(e, f, t)
                }, t.write(e, a, r, s)
            }, s)
        }
    };
    if (d.env === "node" || !d.env && typeof process != "undefined" && process.versions && !!process.versions.node && !process.versions["node-webkit"]) n = require.nodeRequire("fs"), t.get = function(e, t, r) {
        try {
            var i = n.readFileSync(e, "utf8");
            i.indexOf("﻿") === 0 && (i = i.substring(1)), t(i)
        } catch (s) {
            r && r(s)
        }
    };
    else if (d.env === "xhr" || !d.env && t.createXhr()) t.get = function(e, n, r, i) {
        var s = t.createXhr(),
            o;
        s.open("GET", e, !0);
        if (i)
            for (o in i) i.hasOwnProperty(o) && s.setRequestHeader(o.toLowerCase(), i[o]);
        d.onXhr && d.onXhr(s, e), s.onreadystatechange = function(t) {
            var i, o;
            s.readyState === 4 && (i = s.status || 0, i > 399 && i < 600 ? (o = new Error(e + " HTTP status: " + i), o.xhr = s, r && r(o)) : n(s.responseText), d.onXhrComplete && d.onXhrComplete(s, e))
        }, s.send(null)
    };
    else if (d.env === "rhino" || !d.env && typeof Packages != "undefined" && typeof java != "undefined") t.get = function(e, t) {
        var n, r, i = "utf-8",
            s = new java.io.File(e),
            o = java.lang.System.getProperty("line.separator"),
            u = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s), i)),
            a = "";
        try {
            n = new java.lang.StringBuffer, r = u.readLine(), r && r.length() && r.charAt(0) === 65279 && (r = r.substring(1)), r !== null && n.append(r);
            while ((r = u.readLine()) !== null) n.append(o), n.append(r);
            a = String(n.toString())
        } finally {
            u.close()
        }
        t(a)
    };
    else if (d.env === "xpconnect" || !d.env && typeof Components != "undefined" && Components.classes && Components.interfaces) r = Components.classes, i = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), s = "@mozilla.org/windows-registry-key;1" in r, t.get = function(e, t) {
        var n, o, u, a = {};
        s && (e = e.replace(/\//g, "\\")), u = new FileUtils.File(e);
        try {
            n = r["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream), n.init(u, 1, 0, !1), o = r["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream), o.init(n, "utf-8", n.available(), i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), o.readString(n.available(), a), o.close(), n.close(), t(a.value)
        } catch (f) {
            throw new Error((u && u.path || "") + ": " + f)
        }
    };
    return t
}), define("text!user/templates/forgottenPasswordDialogue.html", [], function() {
    return '<div id="auth">\n    <h2>Password reset</h2>\n    <!--<a href="#" class="back">&lt; Back</a>-->\n    <p>Enter your email and we&#39;ll send you a link to a page where you can create a new password.</p>\n    <form id="request-password-reset" action="/request-password-reset">\n        <input type="text" id="email" name="email" placeholder="Email" />\n        <input type="submit" class="btn btn-info" value="Submit" />\n    </form>\n</div>'
}), define("user/ForgottenPasswordDialogue", ["jquery", "text!./templates/forgottenPasswordDialogue.html", "controls/Dialogue", "toastr"], function(e, t, n, r) {
    var i = n.extend({
        events: {
            "submit #request-password-reset": "requestPasswordReset"
        },
        showClose: !0,
        showActions: !1,
        initialize: function() {
            n.prototype.initialize.call(this), this.$el.addClass("dialogue-auth"), this.$body.html(t)
        },
        requestPasswordReset: function(t) {
            var n = {};
            e(t.target).serializeArray().forEach(function(e) {
                n[e.name] = e.value
            }), t.preventDefault();
            if (!n.email) {
                r.error("Please enter your email address");
                return
            }
            e.ajax({
                type: "POST",
                url: "/public-api/request-password-reset",
                data: n
            }).done(this.onSuccess.bind(this)).fail(this.onError)
        },
        onSuccess: function() {
            r.success("We've sent you an email with a link to set a new password"), this.hide()
        },
        onError: function(e) {
            r.error(e.responseText || "There has been an error. Please try again.")
        }
    });
    return i
}), define("text!user/templates/loginDialogue.html", [], function() {
    return '<div id="auth">\n    <div class="login-mobile">\n        <h2>Login</h2>\n    </div>\n    <div class="register-mobile">\n        <h2>Register</h2>\n        <p class="strap">...for a free demo account or to start live trading</p>\n    </div>\n    <div class="oauth-buttons">\n        <div class="left-col">\n            <button class="btn login-google" data-provider="google"><i class="fa fa-google-plus"></i> <span>Login with </span>Google</button>\n            <button class="btn login-facebook" data-provider="facebook"><i class="fa fa-facebook"></i> <span>Login with </span>Facebook</button>\n            <button class="btn login-oanda" data-provider="oanda-practice"><i><svg viewBox="0 0 40 40"><defs><clipPath clipPathUnits="userSpaceOnUse"><path d="M 0,532.742 0,0 l 3009.5,0 0,532.742 -3009.5,0 z" /></clipPath></defs><g transform="translate(-242.42966,-483.0856)"><g transform="matrix(0.57949251,0,0,0.57949251,148.77943,211.14272)"><path style="fill-rule:nonzero;stroke:none" d="m 187.00233,535.66753 c 3.04975,0.92139 6.28125,1.41944 9.62987,1.41944 6.56788,0 12.68413,-1.90918 17.84125,-5.18799 l -27.47112,-34.01364 0,37.78219" /><path style="fill-rule:nonzero;stroke:none" d="m 187.00233,475.79597 37.42187,46.32762 c 3.47601,-5.25737 5.50538,-11.55912 5.50538,-18.3325 0,-18.38912 -14.90775,-33.29687 -33.29738,-33.29687 -6.62837,0 -12.79987,1.94575 -17.98975,5.28462 l 8.35988,0 0,0.0171" /><path style="fill-rule:nonzero;stroke:none" d="m 163.33483,503.78959 c 0,9.064 3.62793,17.27925 9.50244,23.28273 l 0,-46.56448 c -5.87451,6.00538 -9.50244,14.21825 -9.50244,23.28175" /></g></g></svg></i> <span>Login with </span>OANDA <span class="oanda-environment">(Practice)</span></button>\n        </div>\n        <div class="right-col">\n            <!-- <button class="btn login-twitter" data-provider="twitter"><i class="fa fa-twitter"></i> Twitter</button> -->\n            <button class="btn login-windows" data-provider="windows"><i class="fa fa-windows"></i> <span>Login with </span>Windows</button>\n            <button class="btn login-linkedin" data-provider="linkedin"><i class="fa fa-linkedin"></i> <span>Login with </span>LinkedIn</button>\n            <button class="btn login-oanda" data-provider="oanda-live"><i><svg viewBox="0 0 40 40"><defs><clipPath clipPathUnits="userSpaceOnUse"><path d="M 0,532.742 0,0 l 3009.5,0 0,532.742 -3009.5,0 z" /></clipPath></defs><g transform="translate(-242.42966,-483.0856)"><g transform="matrix(0.57949251,0,0,0.57949251,148.77943,211.14272)"><path style="fill-rule:nonzero;stroke:none" d="m 187.00233,535.66753 c 3.04975,0.92139 6.28125,1.41944 9.62987,1.41944 6.56788,0 12.68413,-1.90918 17.84125,-5.18799 l -27.47112,-34.01364 0,37.78219" /><path style="fill-rule:nonzero;stroke:none" d="m 187.00233,475.79597 37.42187,46.32762 c 3.47601,-5.25737 5.50538,-11.55912 5.50538,-18.3325 0,-18.38912 -14.90775,-33.29687 -33.29738,-33.29687 -6.62837,0 -12.79987,1.94575 -17.98975,5.28462 l 8.35988,0 0,0.0171" /><path style="fill-rule:nonzero;stroke:none" d="m 163.33483,503.78959 c 0,9.064 3.62793,17.27925 9.50244,23.28273 l 0,-46.56448 c -5.87451,6.00538 -9.50244,14.21825 -9.50244,23.28175" /></g></g></svg></i> <span>Login with </span>OANDA <span class="oanda-environment">(Live)</span></button>\n        </div>\n    </div>\n    <div class="login">\n        <h2>Login</h2>\n        <form id="login" action="/login" method="POST">\n            <input type="text" id="username" name="username" placeholder="User name or email" />\n            <input type="password" name="password" placeholder="Password" />\n            <a href="#" id="forgotten-password">Forgotten your login details?</a>\n            <input type="submit" class="btn btn-info" value="Login" />\n        </form>\n    </div>\n    <div class="register">\n        <h2>Register</h2>\n        <p class="strap">...for a free demo account or to start live trading</p>\n        <form id="register" method="POST">\n            <input type="text" name="regUsername" placeholder="User name" />\n            <input type="text" name="regEmail" placeholder="Email address" />\n            <input type="password" name="regPassword" placeholder="Password" />\n            <input type="password" name="regRepeatPassword" placeholder="Repeat password" />\n            <input type="submit" class="btn btn-info" value="Register" />\n        </form>\n    </div>\n</div>'
}), define("user/LoginDialogue", ["jquery", "text!./templates/loginDialogue.html", "controls/Dialogue", "./ForgottenPasswordDialogue", "hello", "registry", "toastr"], function(e, t, n, r, i, s, o) {
    var u = n.extend({
        title: "",
        events: {
            "submit #login": "login",
            "submit #register": "register",
            "click #forgotten-password": "forgottenPassword",
            "click .oauth-buttons": "_onOAuthClick"
        },
        showClose: !0,
        showActions: !1,
        initialize: function(e, r) {
            var s;
            this.options = e || {}, this.$el.addClass("dialogue-auth"), n.prototype.initialize.call(this), this.$body.html(t), e.headCopy && this.$body.prepend('<p class="alert alert-info head-copy">' + e.headCopy + "</p>"), s = this.$body.find("#username"), document.cookie.split("; ").forEach(function(e) {
                var t = e.split("=");
                t[0] === "username" && s.val(t[1])
            }, this), r === "register" ? this.$el.addClass("dialogue-register") : this.$el.addClass("dialogue-login"), setTimeout(function() {
                r === "register" ? this.$body.find("[name=regUsername]").focus() : s.val() ? this.$body.find("[name=password]").focus() : s.focus()
            }.bind(this), 0), window.localStorage && window.localStorage.removeItem("hello"), i.init({
                facebook: {
                    redirect_uri: ""
                },
                linkedin: {
                    scope: {
                        basic: "r_basicprofile",
                        email: "r_emailaddress"
                    }
                },
                "oanda-practice": {
                    name: "OANDA",
                    login: function(e) {
                        e.options.window_width = 580, e.options.window_height = 400
                    },
                    oauth: {
                        version: 2,
                        auth: "https://api-fxpractice.oanda.com/v1/oauth2/authorize"
                    },
                    scope: {
                        email: "read+trade+marketdata+stream"
                    },
                    response_type: "code"
                },
                "oanda-live": {
                    name: "OANDA",
                    login: function(e) {
                        e.options.window_width = 580, e.options.window_height = 400
                    },
                    oauth: {
                        version: 2,
                        auth: "https://api-fxtrade.oanda.com/v1/oauth2/authorize"
                    },
                    scope: {
                        email: "read+trade+marketdata+stream"
                    },
                    response_type: "code"
                }
            }, {
                oauth_proxy: "https://www.cloud9trader.com/public-api/oauth-proxy"
            }), i.init({
                google: "550405905291-4gqcmis8927jd6h6gmfujq627utvvjfd.apps.googleusercontent.com",
                twitter: "FyOGPmrFGFuWL4jAU5LZqgo9K",
                windows: "0000000048152AB1",
                facebook: "1443030109306968",
                linkedin: "78eaas7atsqi3p",
                "oanda-practice": "G15G2wZez0m0yHhO",
                "oanda-live": "21QBqzGe6k7Pk0lO"
            }, {
                redirect_uri: "https://www.cloud9trader.com/",
                display: "popup",
                scope: "email"
            }), i.on("auth.login", this._onOAuthLogin.bind(this))
        },
        login: function(t) {
            var n = {},
                r = !0;
            e(t.target).serializeArray().forEach(function(e) {
                n[e.name] = e.value
            }), t.preventDefault(), n.username || (this._setError("Please enter your user name"), r = !1), r && !n.password && (this._setError("Please enter your password"), r = !1);
            if (!r) return;
            e.ajax({
                type: "POST",
                url: "/login",
                data: n,
                dataType: "json"
            }).done(function(e) {
                var t = s.get("user");
                window.ga("send", "event", "user", "login", "success"), t && t.set(e), this.options.onLoginSuccess && this.options.onLoginSuccess(e), o.success("Welcome back, " + e.username), this.hide()
            }.bind(this)).fail(function(e) {
                window.ga("send", "event", "user", "login", "fail");
                if (e.readyState === 0) return o.error("Unable to connect to server");
                this._setError(e.responseText || "There has been an error. Please try again.")
            }.bind(this))
        },
        register: function(t) {
            var n = {},
                r = !0;
            e(t.target).serializeArray().forEach(function(e) {
                n[e.name] = e.value
            }), t.preventDefault(), n.regUsername || (this._setError("Please enter your user name"), r = !1), r && !n.regEmail && (this._setError("Please enter your email address"), r = !1), r && !n.regEmail.match(/[^\s@]+@[^\s@]+\.[^\s@]+/) && (this._setError("The email you entered looks invalid"), r = !1), r && (n.regPassword ? n.regRepeatPassword ? n.regPassword !== n.regRepeatPassword && (this._setError("Passwords do not match!"), r = !1) : (this._setError("Please repeat your password"), r = !1) : (this._setError("Please enter your password"), r = !1));
            if (!r) return;
            delete n.repeatPassword, e.ajax({
                type: "POST",
                url: "/public-api/register",
                data: n
            }).done(function() {
                window.ga("send", "event", "user", "register", "success"), e(t.target).html("<p>Thank you. We've sent you an email with a confirmation link</p>"), this.options.onRegisterSuccess && this.options.onRegisterSuccess()
            }.bind(this)).fail(function(e) {
                window.ga("send", "event", "user", "register", "fail");
                if (e.readyState === 0) return o.error("Unable to connect to server");
                this._setError(e.responseText || "There has been an error. Please try again.")
            }.bind(this))
        },
        forgottenPassword: function(e) {
            var t;
            e.preventDefault(), this.options.onForgottenPassword ? this.options.onForgottenPassword() : (this.hide(), t = new r, t.show())
        },
        _onOAuthClick: function(t) {
            var n = e(t.target).closest("button").attr("data-provider");
            i.login(n, {}).then(function() {
                o.success("Verifying login...")
            }, function(e) {
                o.warning(e.error && e.error.message)
            })
        },
        _onOAuthLogin: function(t) {
            e.ajax({
                type: "POST",
                url: "/oauth",
                data: JSON.stringify({
                    network: t.network,
                    accessToken: t.authResponse.access_token,
                    expires: (new Date(t.authResponse.expires * 1e3)).toISOString()
                }),
                dataType: "json",
                contentType: "application/json"
            }).done(function(e) {
                window.ga("send", "event", "user", "login", "success"), this.options.onLoginSuccess(e), o.success("Welcome back, " + e.username), window.localStorage && window.localStorage.removeItem("hello")
            }.bind(this)).fail(function(e) {
                window.ga("send", "event", "user", "login", "fail");
                if (e.readyState === 0) return o.error("Unable to connect to server");
                this._setError(e.responseText || "There has been an error. Please try again."), window.localStorage && window.localStorage.removeItem("hello")
            }.bind(this))
        },
        _setError: function(t) {
            e(window).width() > 480 ? (this.errors = [t], this.updateErrors(), this.$el.one("keyup", this._clearError.bind(this))) : o.error(t)
        },
        _clearError: function() {
            this.errors = [], this.updateErrors()
        }
    });
    return u
}), define("text!user/templates/newPasswordDialogue.html", [], function() {
    return '<div id="auth">\n    <h2>Password reset</h2>\n    <!--<a href="#" class="back">&lt; Cancel</a>-->\n    <p>Please enter your new password</p>\n    <form id="change-password" action="/password-reset">\n        <input type="password" name="password" placeholder="Password" />\n        <input type="password" name="repeatPassword" placeholder="Repeat password" />\n        <input type="submit" class="btn btn-info" value="Submit" />\n    </form>\n</div>'
}), define("user/NewPasswordDialogue", ["jquery", "text!./templates/newPasswordDialogue.html", "controls/Dialogue", "toastr"], function(e, t, n, r) {
    function i() {
        var e = {},
            t = window.location.search.substring(1).split("&");
        return t.forEach(function(t) {
            var n = decodeURIComponent(t).split("=");
            e[n[0]] = n[1]
        }), e
    }
    var s = n.extend({
        events: {
            "submit #change-password": "changePassword"
        },
        showClose: !0,
        showActions: !1,
        OKText: "Change",
        initialize: function() {
            n.prototype.initialize.call(this), this.queryParameters = i(), this.$el.addClass("dialogue-auth"), this.$body.html(t)
        },
        changePassword: function(t) {
            var n = {};
            e(t.target).serializeArray().forEach(function(e) {
                n[e.name] = e.value
            }), t.preventDefault();
            if (n.password === "") {
                r.error("Please enter your password");
                return
            }
            if (n.password !== n.repeatPassword) {
                r.error("Passwords do not match!");
                return
            }
            delete n.repeatPassword, n.passwordVerification = this.queryParameters.key, e.ajax({
                type: "POST",
                url: "/public-api/change-forgotten-password",
                data: n
            }).done(this.onSuccess.bind(this)).fail(this.onError.bind(this))
        },
        onSuccess: function() {
            r.success("Password changed successfully. Please log in with your new password."), this.options.onSuccess()
        },
        onError: function(e) {
            r.error(e.responseText || "There has been an error. Please try again."), this.options.onError()
        }
    });
    return s
}), define("user/main", ["./Model", "./Menu", "./ForgottenPasswordDialogue", "./LoginDialogue", "./NewPasswordDialogue"], function(e, t, n, r, i) {
    return {
        Model: e,
        Menu: t,
        ForgottenPasswordDialogue: n,
        LoginDialogue: r,
        NewPasswordDialogue: i
    }
}), define("user", ["user/main"], function(e) {
    return e
}), define("header/View", ["jquery", "backbone", "user", "registry"], function(e, t, n, r) {
    var i = t.View.extend({
        events: {
            "click #navigation-menu": "_onNavigationMenuClick",
            "click #auth-menu": "_onAuthMenuClick"
        },
        initialize: function() {
            this.render(), r.get("user").on("change", this.render, this), this.$navigation = this.$el.find("#navigation")
        },
        render: function() {
            var e = r.get("user");
            this.options.page && this.$el.find("#navigation-menu a." + this.options.page).addClass("active"), e.get("authenticated") ? (this.userMenu ? this.userMenu.$el.show() : (this.userMenu = new n.Menu({
                model: e
            }), this.$el.append(this.userMenu.$el)), this.$el.addClass("authenticated")) : this.$el.removeClass("authenticated")
        },
        _onNavigationMenuClick: function() {
            var t = e(event.target),
                n = this.options.router;
            if (!n) return;
            t.hasClass("platform") && (n.navigate("/platform", {
                trigger: !0
            }), event.preventDefault()), t.hasClass("algorithms") && (n.navigate("/algorithms", {
                trigger: !0
            }), event.preventDefault())
        },
        _onAuthMenuClick: function(t) {
            var i;
            t.preventDefault(), e(t.target).text() === "Register" && (i = "register");
            var s = new n.LoginDialogue({
                onLoginSuccess: function(e) {
                    s.hide(), r.get("user").set(e), this.options.reloadOnLogin && document.location.reload()
                }.bind(this)
            }, i);
            s.show()
        }
    });
    return i
}), define("header/MobileView", ["jquery", "backbone", "user", "../controls/clearOverlay", "registry"], function(e, t, n, r, i) {
    var s = t.View.extend({
        events: {
            "click #icon-bar .user": "_onAccountClick",
            "click #icon-bar .close-button": "_onCloseButtonClick",
            "click #crumb-bar #crumb": "_onCrumbClick",
            "click #menu-button": "_onMenuButtonClick",
            "click .login": "_onLoginClick",
            "click .register": "_onRegisterClick",
            "click .logout": "_onLogoutClick"
        },
        initialize: function() {
            this.$menuButton = this.$el.find("#menu-button"), this.$mobileCrumb = this.$el.find("#crumb-bar #crumb"), this.$menu = this.$el.find("#menu"), this.$userSection = this.$el.find("#menu .user-section"), this.boundSetModeToCrumb = this.setMode.bind(this, "crumb"), this.boundSetModeToIcons = this.setMode.bind(this, "icons"), i.get("user").on("change", this.render, this), this.render()
        },
        render: function() {
            var e = i.get("user");
            this.options.page && this.$el.find("a." + this.options.page).addClass("active"), e.get("authenticated") ? (this.$userSection.append('<p class="user">' + e.get("username") + "</p>", '<p class="email">' + e.get("email") + "</p>"), e.get("isAdmin") && this.$userSection.append('<a href="/admin" class="admin"><i class="fa fa-user-secret"></i></a>'), this.$userSection.append('<a class="logout" href="/logout">Sign out <i class="fa fa-sign-out"></i></a>'), this.$el.addClass("authenticated")) : (this.$userSection.empty(), this.$el.removeClass("authenticated")), this.setMode(this.options.mode || "icon")
        },
        setMode: function(e) {
            var t;
            this.mode === "icons" && (t = this.boundSetModeToIcons), this.mode === "crumb" && (t = this.boundSetModeToCrumb);
            if (this.mode === e) return;
            this.lastMode = this.mode, this.mode = e, this.$el.removeClass("icons"), this.$el.removeClass("crumb"), this.$el.removeClass("menu"), this.$el.removeClass("account"), this.$el.removeClass("hidden"), this.$el.addClass(e), e === "menu" || e === "account" ? (this.$el.on("touchstart", this._onMenuTouchStart.bind(this)), r.show(t, !0, !0)) : (this.$el.off("touchstart"), r.hide())
        },
        setCrumb: function(e) {
            this.$mobileCrumb.html('<i class="fa fa-chevron-right"></i> <span>' + e + "</span>")
        },
        _onCrumbClick: function(e) {
            this.trigger("click:crumb")
        },
        _onMenuButtonClick: function(e) {
            this.mode === "menu" ? this.setMode("crumb") : this.setMode("menu")
        },
        _onAccountClick: function(e) {
            e.preventDefault(), this.setMode("account"), this.trigger("click:account")
        },
        _onCloseButtonClick: function(e) {
            e.preventDefault(), this.setMode("icons")
        },
        _onLoginClick: function(e) {
            this._onAuthClick(e, "login"), this.trigger("click:login")
        },
        _onRegisterClick: function(e) {
            this._onAuthClick(e, "register"), this.trigger("click:register")
        },
        _onAuthClick: function(e, t) {
            var r = new n.LoginDialogue(null, t);
            e.preventDefault(), r.show(), this.mode === "menu" && this.setMode("crumb")
        },
        _onLogoutClick: function(e) {
            e.preventDefault(), i.get("user").logout(function(e) {
                e || document.location.reload(!0)
            })
        },
        _onMenuTouchStart: function(e) {
            this.startY = e.originalEvent.touches[0].pageY, this.startHeight = this.$el.height(), e.stopPropagation(), this.$el.on("touchmove", this._onMenuTouchMoveThreshold.bind(this))
        },
        _onMenuTouchMoveThreshold: function(e) {
            var t = e.originalEvent.touches[0].pageY,
                n = t - this.startY;
            e.stopPropagation(), e.preventDefault(), n > 100 && (this.$el.addClass("disable-transition"), this.$el.on("touchend", this._onMenuTouchEnd.bind(this)), this.$el.off("touchmove"), this.$el.on("touchmove", this._onMenuTouchMove.bind(this)), this._onMenuTouchMove(e))
        },
        _onMenuTouchMove: function(e) {
            var t = e.originalEvent.touches[0].pageY;
            e.stopPropagation(), e.preventDefault(), this.moveBy = t - this.startY, this.$el.css("maxHeight", this.startHeight - this.moveBy)
        },
        _onMenuTouchEnd: function(e) {
            this.$el.removeClass("disable-transition"), this.$el.css("maxHeight", ""), this.$el.off("touchmove"), this.$el.off("touchend"), this.moveBy < this.startHeight / 4 ? this.setMode(this.mode) : this.setMode(this.lastMode)
        }
    });
    return s
}), define("header/main", ["./View", "./MobileView"], function(e, t) {
    return {
        View: e,
        MobileView: t
    }
}), define("header", ["header/main"], function(e) {
    return e
}), define("price/Interval", ["backbone"], function(e) {
    var t = e.Model.extend({
        idAttribute: "time",
        initialize: function() {},
        parse: function(e) {
            return e.time = new Date(e.time), e
        },
        get: function(t) {
            return t === "close" ? (this.get("ask").close + this.get("bid").close) / 2 : e.Model.prototype.get.call(this, t)
        },
        getChartData: function(e) {
            var t = this.get("bid"),
                n = this.get("ask");
            return (!e || e === "mid") && t && n ? [this.get("time").getTime(), (t.open + n.open) / 2, (t.high + n.high) / 2, (t.low + n.low) / 2, (t.close + n.close) / 2] : e === "bid" && t ? [this.get("time").getTime(), t.open, t.high, t.low, t.close] : e === "ask" && n ? [this.get("time").getTime(), n.open, n.high, n.low, n.close] : null
        },
        update: function(e) {
            var t = this.get("bid"),
                n = this.get("ask"),
                r = e.get("bid"),
                i = e.get("ask");
            t.close = r, n.close = i, r > t.high && (t.high = r), r < t.low && (t.low = r), i > n.high && (n.high = i), i < n.low && (n.low = i)
        }
    });
    return t
}), define("price/Intervals", ["underscore", "backbone", "./Interval", "utils", "registry", "toastr"], function(e, t, n, r, i, s) {
    var o = t.Collection.extend({
        model: n,
        url: function() {
            var e = i.get("user");
            return e && e.get("authenticated") ? "/api/historical" : "/public-api/historical"
        },
        initialize: function(e, n) {
            var s = i.get("instruments");
            s.isSynced() || s.once("synced", this.subscribeToTicks, this), this.instrument = s.get(n.instrumentId), t.Collection.prototype.initialize.apply(this, arguments), this.start = n.start, n.end ? this.end = n.end : (this.end = new Date, this.once("sync", this.subscribeToTicks, this)), this.interval = n.interval, this.intervalMs = r.config.intervals[n.interval].seconds * 1e3
        },
        fetch: function() {
            var e = i.get("broker-connection");
            e && e.getType() === "OANDA" ? e.requestHistoricalPrices(this.instrument, this.start, this.end, this.interval, this._onFetchResponse.bind(this), this) : t.Collection.prototype.fetch.call(this, {
                data: {
                    instrumentId: this.instrument.id,
                    start: this.start.toISOString(),
                    end: this.end.toISOString(),
                    interval: this.interval
                },
                error: function() {
                    s.error("Error fetching " + this.instrument.id + " price intervals")
                }.bind(this)
            })
        },
        _onFetchResponse: function(t, n) {
            if (t) return this.trigger("error"), s.error(t);
            n = e.map(n, function(e) {
                return e.time = new Date(e.time), e
            }), this.reset(n), this.trigger("sync", this)
        },
        subscribeToTicks: function() {
            this.instrument && this.instrument.on("tick", this.onTick, this)
        },
        getChartData: function(e) {
            var t = [];
            return this.each(function(n) {
                var r = n.getChartData(e);
                r && t.push(r)
            }), t
        },
        onTick: function(e) {
            var t = new Date(Math.floor(e.get("time") / this.intervalMs) * this.intervalMs),
                n = this.get(t),
                r = this.at(this.length - 1),
                i = e.get("bid"),
                s = e.get("ask");
            if (n) {
                if (r && n.id < r.id) return console.error("Dropping price interval tick update - out of sequence");
                n.update(e), this.trigger("update", n)
            } else this.add({
                time: t,
                bid: {
                    open: i,
                    high: i,
                    low: i,
                    close: i
                },
                ask: {
                    open: s,
                    high: s,
                    low: s,
                    close: s
                }
            }), this.trigger("new", this.get(t))
        },
        getLineChartData: function(e) {
            var t = [];
            return this.each(function(n) {
                var r;
                !e || e === "mid" ? r = (n.get("bid").open + n.get("ask").open) / 2 : r = n.get[e].open, t.push([r])
            }), t
        },
        tearDown: function() {
            this.instrument && this.instrument.off("tick", this.onTick, this)
        }
    });
    return o
}), define("price/Tick", ["underscore", "backbone"], function(e, t) {
    var n = t.Model.extend({
        idAttribute: "time",
        initialize: function(e, t) {
            this.set("time", new Date(e.time)), this.mid = (e.bid + e.ask) / 2, this.instrument = t.instrument, this.memoize()
        },
        memoize: function() {
            this._getSpread = e.memoize(this._getSpread), this._getPriceString = e.memoize(this._getPriceString), this._getPriceSplit = e.memoize(this._getPriceSplit), this._getFormatted = e.memoize(this._getFormatted)
        },
        get: function(e, n) {
            return e === "price" || e === "mid" ? this.mid : e === "priceString" ? this._getPriceString(n) : e === "large" ? this._getPriceSplit(n).large : e === "pips" ? this._getPriceSplit(n).pip : e === "babyPip" ? this._getPriceSplit(n).babyPip : e === "formattedPrice" ? this._getFormatted(n) : e === "spread" ? this._getSpread() : t.Model.prototype.get.apply(this, arguments)
        },
        _getSpread: function() {
            return ((this.get("ask") - this.get("bid")) * Math.pow(10, this.instrument.get("pipPosition") + 2)).toFixed(1)
        },
        _getPriceString: function(e) {
            return this.get(e || "price").toFixed(this.instrument.get("precision"))
        },
        _getPriceSplit: function(e) {
            return this.instrument.splitPrice(this.get(e || "price"))
        },
        _getFormatted: function(e) {
            var t = this._getPriceSplit(e);
            return "<sub>" + t.large + "</sub><strong>" + t.pip + "</strong><sub>" + t.babyPip + "</sub>"
        },
        getChartData: function(e) {
            return [this.get("time"), this.get(e)]
        }
    });
    return n
}), define("price/Ticks", ["jquery", "backbone", "../controls/Events", "registry", "toastr"], function(e, t, n, r, i) {
    function s(e) {
        this.options = e, e.end || r.get("instruments").get(e.instrumentId).on("tick", this.onTick, this)
    }
    return n.mixin(s.prototype), s.prototype.fetch = function() {
        e.ajax({
            type: "GET",
            url: t.is3rdPartyMode ? "https://www.cloud9trader.com/public-api/historical" : "/api/historical",
            data: {
                interval: "Tick",
                instrumentId: this.options.instrumentId,
                start: this.options.start.toISOString(),
                end: this.options.end && this.options.end.toISOString()
            }
        }).done(this.onSuccess.bind(this)).fail(this.onError.bind(this))
    }, s.prototype.onSuccess = function(e) {
        var t, n;
        this.data = e, this.bidData = [], this.askData = [], this.data.forEach(function(e) {
            e.time = (new Date(e.time)).getTime(), (!t || e.bid !== t) && this.bidData.push([e.time, e.bid]), (!n || e.ask !== n) && this.askData.push([e.time, e.ask]), t = e.bid, n = e.ask
        }, this), this.lastBid = t, this.lastAsk = n, this.trigger("sync", e)
    }, s.prototype.onError = function(e) {
        e.responseText && e.responseText !== "error" ? i.error(e.status + " error<br />" + e.responseText) : i.error("There has been an error. Please try again later"), this.trigger("error")
    }, s.prototype.onTick = function(e) {
        var t = e.get("bid"),
            n = e.get("ask"),
            r = e.get("time").getTime();
        (!this.lastBid || t !== this.lastBid) && this.trigger("tick-bid", [r, t]), (!this.lastAsk || t !== this.lastAsk) && this.trigger("tick-ask", [r, n])
    }, s.prototype.getChartData = function(e) {
        var t = [],
            n;
        return this.data ? e === "bid" ? this.bidData : e === "ask" ? this.askData : (this.data.forEach(function(e) {
            var r = (new Date(e.time)).getTime();
            if (n && r < n) {
                console.error("Received unsorted tick data. Dropping tick.", t.length, this.data.length);
                return
            }
            n = r, t.push([r, e.bid, e.ask])
        }, this), t) : []
    }, s.prototype.tearDown = function() {
        r.get("instruments").get(this.options.instrumentId).off("tick", this.onTick, this)
    }, s
}), define("price/main", ["./Intervals", "./Tick", "./Ticks"], function(e, t, n) {
    return {
        Intervals: e,
        Tick: t,
        Ticks: n
    }
}), define("price", ["price/main"], function(e) {
    return e
}), define("instruments/Model", ["underscore", "backbone", "registry", "price"], function(e, t, n, r) {
    var i = t.Model.extend({
        initialize: function() {
            this.subscribed = 0, this.memoize()
        },
        parse: function(e) {
            var t = e.id.split(":");
            return e.symbol = t[0], e.broker = t[1], e
        },
        memoize: function() {
            this.getPipPosition = e.memoize(this.getPipPosition)
        },
        on: function(e, n, r) {
            e === "tick" && (this._subscribe(), this.get("price") && setTimeout(function() {
                n.call(r, this.get("price"))
            }.bind(this), 0)), t.Events.on.apply(this, arguments)
        },
        off: function(e) {
            e === "tick" && this._unsubscribe(), t.Events.off.apply(this, arguments)
        },
        onTick: function(e) {
            var t;
            e.clientLatency = new Date - e.time - e.serverLatency, t = new r.Tick(e, {
                instrument: this
            }), this.set("open", e.open), this.set("price", t), this.trigger("tick", t)
        },
        onPriceSnapshot: function(e, t) {
            if (e) return;
            this.onTick(t)
        },
        matches: function(e) {
            var t = this.id.replace(/\W/g, "").toLowerCase(),
                n = this.get("displaySymbol").replace(/\W/g, "").toLowerCase(),
                r = this.get("product").toLowerCase();
            return e = e.replace(/\W/g, "").toLowerCase(), t.indexOf(e) !== -1 || n.indexOf(e) !== -1 || r.indexOf(e) !== -1
        },
        _subscribe: function() {
            var e = n.get("broker-connection");
            if (!e) return;
            this.subscribed === 0 && (n.get("broker-connection").requestPriceSnapshot(this, this.onPriceSnapshot, this), n.get("broker-connection").subscribeToPrice(this, this.onTick, this)), this.subscribed++
        },
        _unsubscribe: function() {
            this.subscribed--, this.subscribed === 0 && n.get("broker-connection").unsubscribeFromPrice(this, this.onTick, this)
        },
        get: function(e) {
            return e === "symbol" ? this.symbol = this.symbol || this.id.split(":")[0] : e === "broker" ? this.broker = this.broker || this.id.split(":")[1] : e === "displaySymbol" ? this.attributes.displaySymbol || this.get("symbol") : e === "pipPosition" ? this.getPipPosition() : e === "displayHTML" ? !n.get("account") || n.get("account").isMulti() ? this.displayHTML = this.displayHTML || this.get("displaySymbol") + " <sub>" + this.get("broker") + "</sub>" : this.displayHTML = this.get("symbol") : e === "display" ? this.display = this.display || this.id + " | " + this.get("displaySymbol") : t.Model.prototype.get.call(this, e)
        },
        getPipPosition: function() {
            return Math.round(Math.log(1 / this.get("pipSize")) / Math.log(10)) - 2
        },
        splitPrice: function(e) {
            var t = this.get("precision"),
                n = this.getPipPosition(),
                r, i = [];
            return typeof e == "number" && (e = e.toFixed(t)), r = e.length, t === 0 || n >= 0 ? (i[0] = r - t + n, i[1] = i[0] + 2) : (i[0] = r - t + n - 1, n <= -2 ? i[1] = i[0] + 2 : n === -1 && (i[1] = i[0] + 3)), {
                large: e.slice(0, i[0]),
                pip: e.slice(i[0], i[1]),
                babyPip: e.slice(i[1])
            }
        },
        formatPrice: function(e, t) {
            var n;
            return typeof e == "undefined" || e === null || e === 0 ? "" : (n = this.splitPrice(e), typeof t == "number" && (n.large = (t === 1 ? "> " : "< ") + n.large), "<sub>" + n.large + "</sub><strong>" + n.pip + "</strong><sub>" + n.babyPip + "</sub>")
        },
        convertPriceToPips: function(e) {
            return (e / this.get("pipSize")).toFixed(this.get("pipPrecision"))
        },
        getSpread: function(e) {
            return e = e || this.get("price"), ((e.get("ask") - e.get("bid")) / this.get("pipSize")).toFixed(this.get("pipPrecision"))
        },
        getConversionInstruments: function(e, t) {
            return this.collection.getConversionInstruments(this.get("broker"), e, t || this.get("quote"))
        },
        convertToCurrency: function(e, t, n, r) {
            var i, s;
            return r = r || this.get("quote"), i = this.getConversionInstruments(t, r), r === t ? e : (s = !i || i.some(function(t) {
                var i = t.get("dealt"),
                    s = t.get("quote"),
                    o = n ? n[t.id] : t.get("price");
                if (!o) return !0;
                r === s ? (e /= o.get("price"), r = i) : (e *= o.get("price"), r = s)
            }), s ? null : e)
        },
        convertToAccountCurrency: function(e, t, r) {
            return this.accountCurrency || (this.accountCurrency = n.get("account").get("currency")), this.convertToCurrency(e, this.accountCurrency, t, r)
        },
        getMarginRequirement: function(e) {
            var t = this.get("marginRatios");
            if (t) return this.get("marginRatios")[n.get("account").get("currency")] * (e / this.get("factor"))
        }
    });
    return i
}), define("instruments/Collection", ["underscore", "backbone", "./Model", "registry"], function(e, t, n, r) {
    var i = t.Collection.extend({
        url: function() {
            var e = r.get("broker-connection"),
                n = r.get("user");
            return !t.is3rdPartyMode && (!n || !n.get("authenticated")) ? "/public-api/instruments/USD" : "/api/instruments/" + (e ? e.id : "USD")
        },
        model: n,
        comparator: "symbol",
        initialize: function() {
            this.getConversionInstruments = e.memoize(this._getConversionInstruments, function() {
                return Array.prototype.join.call(arguments, "/")
            }), t.Collection.prototype.initialize.call(this), this._listenToMarginRate()
        },
        fetch: function() {
            this.fetching || (this.fetching = !0, r.get("broker-connection").requestInstruments(this._onSocketFetched, this))
        },
        subscribe: function() {
            r.get("broker-connection").subscribeToInstruments(this._onIntrumentsUpdate, this)
        },
        _onSocketFetched: function(e, t) {
            e ? (this.fetching = !1, this.fetchHttp()) : (this.add(t, {
                merge: !0
            }), this.trigger("sync", this))
        },
        fetchHttp: function() {
            return t.Collection.prototype.fetch.call(this, {
                error: function() {
                    return this.trigger("error", "Unable to retrieve instruments.")
                }.bind(this)
            }), this
        },
        _listenToMarginRate: function() {
            var e = r.get("account");
            if (!e) return r.once("register:account", this._listenToMarginRate, this);
            e.synced ? this._onAccountSync() : e.once("sync", this._onAccountSync, this)
        },
        _onAccountSync: function() {
            r.get("account").on("change:marginRate", this._onAccountMarginRateChange, this)
        },
        _onAccountMarginRateChange: function() {
            this.fetch()
        },
        _onIntrumentsUpdate: function(e) {
            this.add(e, {
                merge: !0
            })
        },
        _getConversionInstruments: function(e, t, n) {
            var r = this.where({
                    product: "Forex",
                    broker: e
                }),
                i = [];
            n = n || this.get("quote");
            if (n === t) return [];
            r.some(function(e) {
                var r = e.get("symbol");
                if (r.match(t + "[/_]" + n) || r.match(n + "[/_]" + t)) return i.push(e), !0
            }.bind(this));
            if (!i.length) {
                r.some(function(e) {
                    var t = e.get("symbol");
                    if (t.match(n + "[/_]USD") || t.match("USD[/_]" + n)) return i.push(e), !0
                }.bind(this));
                if (!i.length) throw new Error("Conversion instruments not found for " + n + " to " + t + "!");
                r.some(function(e) {
                    var n = e.get("symbol");
                    if (n.match(t + "[/_]USD") || n.match("USD[/_]" + t)) return i.push(e), !0
                }.bind(this))
            }
            return i
        },
        getDefault: function() {
            return r.get("instruments").get("EUR/USD:FXCM") || this.get("EUR_USD:OANDA")
        }
    });
    return i
}), define("instruments/Converter", ["../controls/Events", "registry"], function(e, t) {
    function n(e, n, r) {
        var i;
        this.instruments = t.get("instruments"), n === r && (this.rate = 1, setTimeout(function() {
            this.trigger("rate", 1)
        }.bind(this), 0)), i = this.instruments.findWhere({
            dealt: n,
            quote: r,
            broker: e
        });
        if (i) return i.on("tick", this._onSimpleTick, this);
        i = i = this.instruments.findWhere({
            dealt: r,
            quote: n,
            broker: e
        });
        if (i) return i.on("tick", this._onInverseTick, this);
        this.fromCurrency = n, this.toCurrency = r, this.instruments = this._getConversionInstruments(e, n, r);
        if (!this.instruments) {
            console.error("Could not find pairs to convert between " + n + " and " + r);
            return
        }
        this.instruments.forEach(function(e) {
            e.on("tick", this._onConversionTick, this)
        }, this)
    }
    return e.mixin(n.prototype), n.prototype.intermediaries = ["USD", "EUR", "GBP"], n.prototype.get = function() {
        return this.rate
    }, n.prototype._onSimpleTick = function(e) {
        this.rate = e.get("price"), this.trigger("rate", this.rate)
    }, n.prototype._onInverseTick = function(e) {
        this.rate = 1 / e.get("price"), this.trigger("rate", this.rate)
    }, n.prototype._onConversionTick = function() {
        this.rate = this._convert(), this.rate && this.trigger("rate", this.rate)
    }, n.prototype._convert = function() {
        var e, t = 1,
            n = this.fromCurrency;
        return e = this.instruments.some(function(e) {
            var r = e.get("dealt"),
                i = e.get("quote"),
                s = e.get("price");
            if (!s) return !0;
            this.fromCurrency === i ? (t /= s.get("mid"), n = r) : (t *= s.get("mid"), n = i)
        }), e ? null : t
    }, n.prototype._getConversionInstruments = function(e, t, n) {
        var r = [],
            i, s;
        this.intermediaryIndex || (this.intermediaryIndex = 0), i = this.intermediaries[this.intermediaryIndex];
        if (!i) {
            s = !0, i = this.instruments.where({
                dealt: t,
                broker: e
            })[0];
            if (!i) return null;
            i = i.get("quote")
        }
        return this.instruments.some(function(n) {
            if (n.id.match(t + "[/_]" + i + ":" + e) || n.id.match(i + "[/_]" + t + ":" + e)) return r.push(n), !0
        }.bind(this)), r.length && this.instruments.some(function(t) {
            if (t.id.match(n + "[/_]" + i + ":" + e) || t.id.match(i + "[/_]" + n + ":" + e)) return r.push(t), !0
        }.bind(this)), r.length === 2 ? r : (this.intermediaryIndex++, s ? null : this._getConversionInstruments(e, t, n))
    }, n
}), define("instruments/converters", ["./Converter"], function(e) {
    var t = {};
    return {
        get: function(n, r, i) {
            var s = r + "/" + i + ":" + n;
            return t[s] = t[s] || new e(n, r, i), t[s]
        }
    }
}), define("controls/SearchControl", ["underscore", "jquery", "backbone"], function(e, t, n) {
    var r = n.View.extend({
        className: "c9t-search-control",
        events: {
            "click .clear-search": "_onClear"
        },
        initialize: function(n) {
            typeof n.minimumChars == "number" ? this.minimumChars = n.minimumChars : this.minimumChars = 3, this.$el.addClass("c9t-search-control-" + (this.options.size || "small")), n.debounce ? this._triggerDebounced = e.debounce(this._trigger, n.debounce) : this._triggerDebounced = this._trigger, this.$input = t("<input>", {
                type: "text",
                placeholder: n.placeholder || "Search"
            }), this.$searchIcon = t('<i class="fa fa-search"></i>'), this.$clear = t('<i class="clear-search fa fa-times-circle"></i>').hide(), this.$spinner = t('<i class="fa fa-refresh fa-spin"></i>').hide(), this.$info = t("<p>", {
                "class": "search-info"
            }), this.$el.append(this.$input, this.$searchIcon, this.$clear, this.$spinner, this.$info), this.$input.on("keyup", this._onKeyUp.bind(this)), this.$input.on("keydown", this._onKeyDown.bind(this))
        },
        _onKeyUp: function(e) {
            var t = this.$input.val();
            this._setIcons(t.length), t.length >= this.minimumChars ? this._triggerDebounced() : t.length === 0 && this._trigger()
        },
        _trigger: function() {
            var e = this.$input.val();
            e === "" && (e = null), this.lastValue !== e && this.trigger("change", e), this.lastValue = e
        },
        _onKeyDown: function(e) {
            e.which === 13 && (this.$input.blur(), this._trigger())
        },
        setInfo: function(e) {
            this.$info.text(e)
        },
        showSpinner: function() {
            this.$searchIcon.hide(), this.$clear.hide(), this.$spinner.show()
        },
        hideSpinner: function() {
            this._setIcons(this.$input.val().length), this.$spinner.hide()
        },
        _onClear: function() {
            this.$input.val(""), this.$input.blur(), this._setIcons(0), this._trigger()
        },
        _setIcons: function(e) {
            e ? (this.$searchIcon.hide(), this.$clear.show()) : (this.$searchIcon.show(), this.$clear.hide())
        }
    });
    return r
}), define("instruments/Menu", ["underscore", "jquery", "backbone", "../controls/SearchControl", "registry", "bootstrap.tooltip"], function(e, t, n, r, i) {
    var s = n.View.extend({
        events: {
            "click .menu-item": "onClick"
        },
        className: "instruments-menu",
        initialize: function() {
            this.collection = i.get("instruments"), this.render(), this.searchControl = new r({
                placeholder: "Filter instruments",
                minimumChars: 0,
                debounce: !1
            }), this.searchControl.on("change", this._onFilter, this)
        },
        render: function() {
            var r = t("#template-instrument-menu-item").html(),
                s = !i.get("account") || i.get("account").isMulti(),
                o;
            this.$el.empty(), this.filter ? o = new n.Collection(this.collection.filter(function(e) {
                return e.matches(this.filter)
            }.bind(this))) : o = this.collection, e(e(o.sortBy("displaySymbol")).groupBy(function(e) {
                return e.get("product")
            })).each(function(e, n) {
                this.$el.append("<h3>" + (n !== "undefined" ? n : "Other") + "</h3>"), e.forEach(function(e) {
                    var n = t(r);
                    n.find("span.symbol").text(e.get("displaySymbol")), s && n.find("span.broker").text(e.get("broker")), n.data("id", e.id), n.find("div.open-tile").tooltip({
                        placement: "top",
                        container: "body",
                        delay: {
                            show: 500
                        }
                    }), n.find("div.open-chart").tooltip({
                        placement: "top",
                        container: "body",
                        delay: {
                            show: 500
                        }
                    }), this.$el.append(n)
                }.bind(this))
            }.bind(this))
        },
        setContainer: function(e) {
            e.updateSubHeader(this.searchControl.$el)
        },
        onClick: function(e) {
            var n = t(e.target);
            n.tooltip("destroy"), n.hasClass("open-chart") && !n.closest(".menu-item").hasClass("disable-chart") ? this.options.onChartClick(t(e.currentTarget).data("id")) : n.hasClass("open-tile") && !n.closest(".menu-item").hasClass("disable-tile") && this.options.onTileClick(t(e.currentTarget).data("id"))
        },
        setDisabled: function(e, n) {
            this.$el.find(".menu-item").removeClass("disable-tile").removeClass("disable-chart").each(function(r, i) {
                var s = t(i),
                    o = s.data("id");
                e.indexOf(o) !== -1 && (s.addClass("disable-tile"), s.find(".open-tile").tooltip("destroy")), n.indexOf(o) !== -1 && (s.addClass("disable-chart"), s.find(".open-chart").tooltip("destroy"))
            })
        },
        _onFilter: function(e) {
            this.filter = e, this.render()
        },
        tearDown: function() {
            this.remove()
        }
    });
    return s
}), define("instruments/main", ["./Collection", "./converters", "./Menu"], function(e, t, n) {
    return {
        Collection: e,
        converters: t,
        Menu: n
    }
}), define("instruments", ["instruments/main"], function(e) {
    return e
}), define("components/charts/IndicatorDialogue", ["jquery", "backbone", "controls/Dialogue", "registry", "toastr"], function(e, t, n, r, i) {
    var s = n.extend({
        events: {
            "submit form": "onSubmit"
        },
        className: n.prototype.className + " panel",
        initialize: function() {
            this.title = this.options.title, n.prototype.initialize.call(this), this.render()
        },
        render: function() {
            this.$form = e("<form>", {
                "class": "c9t-style-1"
            }), this.options.parameters.forEach(function(e) {
                var t = e.key || e,
                    n = e.label || e;
                this.$form.append(['<div class="field">', '<label for="parameter-' + t + '">' + n + ":</label>", '<input type="text" id="parameter-' + t + '" name="parameter-' + t + '">', "</div>"].join("")), e.default && this.$form.find("#parameter-" + t).val(JSON.stringify(e.default))
            }, this), this.$body.html(this.$form), setTimeout(function() {
                this.$body.find("input").first().focus()
            }.bind(this), 0)
        },
        onOK: function() {
            return this.options.onOK(this.values)
        },
        onOKClick: function() {
            this.getValues();
            if (!this.valid) return;
            n.prototype.onOKClick.call(this)
        },
        getValues: function() {
            return this.values = [], this.valid = !0, this.$form && this.$form.serializeArray().forEach(function(e) {
                var t = e.value.trim();
                if (t !== "") {
                    t[0] === "." && (t = "0" + t), t.slice(0, 2) === "-." && (e = "-0." + t.slice(2));
                    try {
                        t = JSON.parse(t)
                    } catch (n) {
                        return i.error("Could not parse " + t + "<br />Must use valid JavaScript literal notation"), this.valid = !1, !1
                    }
                } else t = null;
                this.values.push(t)
            }, this), this.values
        },
        onSubmit: function(e) {
            e.preventDefault()
        }
    });
    return s
}), define("indicators/main", ["jquery"], function(e) {
    return {
        fetch: function(t, n, r, i, s, o, u) {
            e.ajax({
                type: "GET",
                url: "https://www.cloud9trader.com/public-api/indicator/" + t + "/values",
                data: {
                    instrumentId: n,
                    interval: r,
                    start: i && i.toISOString(),
                    end: s && s.toISOString(),
                    parameters: o && JSON.stringify(o)
                }
            }).done(function(e) {
                u(e.error, e.data, e.seriesConfig, e.studyAxisConfig)
            }).fail(function(e) {
                u(e.responseText || "Error")
            })
        }
    }
}), define("indicators", ["indicators/main"], function(e) {
    return e
}), define("components/charts/TimeData", ["underscore", "backbone", "utils"], function(e, t, n) {
    function r(e, t) {
        this.data = e || [], t && (this.intervalMs = n.config.intervals[t].ms, this.data.forEach(this.slotToInterval, this)), e.length !== 0 && (this.latest = e[e.length - 1][0])
    }
    return e.extend(r.prototype, t.Events, {
        addPoint: function(e) {
            this.intervalMs && this.slotToInterval(e);
            if (!this.latest) this.latest = e[0];
            else if (e[0] <= this.latest) {
                if (this.intervalMs && e[0] === this.latest) {
                    this.data[this.data.length - 1] = e, this.trigger("update-last", e);
                    return
                }
                return
            }
            this.latest = e[0], this.data.push(e), this.trigger("add", e)
        },
        mergePoints: function(t) {
            this.intervalMs && t.forEach(this.slotToInterval, this), this.data = t.concat(this.data), this.data.sort(function(e, t) {
                return e > t ? 1 : -1
            }), this.data = e.uniq(this.data, !0, function(e) {
                return e[0]
            }), this.latest = t[t.length - 1][0], this.trigger("refresh", this.data)
        },
        setData: function(e) {
            this.intervalMs && e.forEach(this.slotToInterval, this), this.data = e, this.trigger("refresh", this.data)
        },
        getType: function() {
            if (this.data.length) {
                if (this.data[0].length === 2) return "spline";
                if (this.data[0].length === 3) return "areasplinerange"
            }
            return null
        },
        clear: function() {
            this.data = [], this.trigger("refresh", this.data)
        },
        slotToInterval: function(e) {
            e[0] = Math.ceil(e[0] / this.intervalMs) * this.intervalMs
        },
        getChartData: function() {
            return this.data
        }
    }), r
}), define("components/charts/Series", ["backbone"], function(e) {
    function t() {}
    return t.prototype = Object.create(e.Events), t.prototype.getTitle = function() {
        return this.options.title
    }, t.prototype.getStart = function() {
        return this.options.dataSettings ? this.options.dataSettings.start : null
    }, t.prototype.getEnd = function() {
        return this.options.dataSettings ? this.options.dataSettings.end || new Date : null
    }, t.prototype.getPrecision = function() {
        return this.options.precision
    }, t.prototype.setPrecision = function() {
        return this.options.precision
    }, t.prototype.setChartSeries = function(e) {
        this.chartSeries = e
    }, t.prototype.show = function() {
        this.chartSeries && this.chartSeries.setVisible(!0, !1), this.hidden = !1
    }, t.prototype.hide = function() {
        this.chartSeries && this.chartSeries.setVisible(!1, !1), this.hidden = !0
    }, t.prototype.isHidden = function() {
        return !!this.hidden
    }, t.prototype.changeType = function(e) {
        this.options.type = e, this.trigger("change:type", e)
    }, t
}), define("components/charts/LineSeries", ["jquery", "./Series"], function(e, t) {
    function n(e, t) {
        this.data = e, this.seriesType = this.data.getType(), this.options = t || {}, e.on("add", this._addPoint, this), e.on("update-last", this._updateLastPoint, this), e.on("refresh", this._refresh, this)
    }
    return n.prototype = new t, n.prototype.getChartConfig = function() {
        var t = e.extend({
            type: this.data.getType() || "spline",
            allowDecimals: !0,
            data: this.data.getChartData(),
            dataLoaded: !0,
            lineWidth: 1,
            gapSize: 1,
            dataGrouping: {
                enabled: !0,
                units: [
                    ["second", [5, 15, 30]],
                    ["minute", [1, 2, 5, 10, 15, 30]],
                    ["hour", [1, 4, 8, 12]],
                    ["day", [1]],
                    ["week", [1]]
                ]
            },
            marker: {
                enabled: !1,
                symbol: "circle"
            },
            tooltip: {
                valueDecimals: this.options.precision,
                valuePrefix: this.options.prefix ? this.options.prefix : null
            },
            showCheckbox: !0,
            selected: !0,
            states: {
                hover: {
                    lineWidth: this.options.lineWidth || 1
                }
            },
            events: {
                mouseOver: function() {},
                mouseOut: function() {}
            },
            zIndex: this.options.zIndex || 30
        }, this.options);
        return this.seriesType === "areasplinerange" && (t.fillOpacity = .1, t.zIndex = 2), t.type === "column" && (t.groupPadding = .1, t.pointPadding = .1), t.type === "candlestick" && (t.color = "#2f7ed8", t.lineColor = "#2f7ed8", t.upLineColor = "silver", t.upColor = "silver"), t
    }, n.prototype._addPoint = function(e) {
        this.trigger("add", e)
    }, n.prototype._updateLastPoint = function(e) {
        this.trigger("update-last", e)
    }, n.prototype._refresh = function(e) {
        this.trigger("refresh", e)
    }, n.prototype.update = function(t) {
        this.trigger("update-config", t), this.config = e.extend(this.config, t)
    }, n.prototype.setData = function(e) {
        this.data = e, this.trigger("set-data", this.data.getChartData())
    }, n.prototype.tearDown = function() {
        this.data.off(null, null, this)
    }, n
}), define("components/charts/Seriess", ["underscore", "jquery", "backbone", "indicators", "./TimeData", "./LineSeries", "utils", "registry", "toastr"], function(e, t, n, r, i, s, o, u, a) {
    function f(e, t, n) {
        this.options = e, this.intervalMs = o.config.intervals[e.interval].ms, this.chartAssets = [], t && this.onFetchResponse(t.error, t.data, t.seriesConfig, t.studyAxisConfig, n)
    }
    return f.prototype = Object.create(n.Events), f.prototype.onFetchResponse = function(n, r, o, u, f) {
        var l = [],
            c, h = [];
        if (n) return this.trigger("error"), a.error("Error fetching technical indicator" + (n ? ":<br />" + n : ""));
        if (r.length === 0) return this.trigger("error"), a.error("No data returned by technical indicator");
        e.isArray(o) ? this.seriesConfig = o : o === null ? this.seriesConfig = [null] : typeof o == "object" ? this.seriesConfig = [o] : this.seriesConfig = [null], this.seriesConfig.forEach(this.processSeriesConfig, this), e.isArray(r[0].v) ? (c = !0, !f && this._shouldConvertToEnvelope(o, r[0].v) ? (r = this._convertDataToEnvelope(r), h[0] = !0, l[0] = [], r[0].v.length === 2 && (l[1] = []), o.splice(1, 1)) : r[0].v.forEach(function(t, n) {
            l[n] = [], e.isArray(t) && (h[n] = !0)
        })) : l[0] = [], r.forEach(function(e) {
            var t = (new Date(e.t)).getTime();
            c ? e.v.forEach(function(e, n) {
                var r;
                this.seriesConfig && this.seriesConfig[n] && this.seriesConfig[n].plotOffset ? (r = t + this.seriesConfig[n].plotOffset * this.intervalMs, l[n].push([r].concat(e))) : l[n].push([t].concat(e))
            }, this) : (this.seriesConfig && this.seriesConfig[0].plotOffset && (t += this.seriesConfig[0].plotOffset * this.intervalMs), l[0].push([t, e.v]))
        }, this), this.data = [], this.seriess = [], l.forEach(function(e, n) {
            var r = this.seriesConfig && this.seriesConfig[n];
            this.data[n] = new i(e, this.options.interval), this.seriess[n] = new s(this.data[n], t.extend({
                name: this.options.name
            }, r || {})), r && r.opposite && (this.seriess[n].opposite = !0)
        }, this), this.studyAxisConfig = u, this.callbacks && this.callbacks.success(this), this.trigger("sync", this)
    }, f.prototype.onValue = function() {}, f.prototype.mergePoints = function(t) {
        var n = [],
            r = [];
        t[0].v.forEach(function(t, i) {
            r[i] = [], e.isArray(t) && (n[i] = !0)
        }), t.forEach(function(e) {
            var t = (new Date(e.t)).getTime();
            e.v.forEach(function(e, i) {
                n[i] ? r[i].push([t, e[0], e[1]]) : r[i].push([t, e])
            })
        }, this), r.forEach(function(e, t) {
            this.data[t].mergePoints(e)
        }, this)
    }, f.prototype.addPoint = function(e, t) {
        t.forEach(function(t, n) {
            this.data[n].addPoint([e].concat(t))
        }, this)
    }, f.prototype.getName = function() {
        return this.options.name
    }, f.prototype.getColor = function() {
        return "#000"
    }, f.prototype.processSeriesConfig = function(e, n, r) {
        var i, s;
        e || (e = r[n] = {}), typeof e.precision != "undefined" ? (i = e.precision, delete e.precision) : e.overlay === !1 ? i = 3 : (s = u.get("instruments").get(this.options.symbol), i = s ? s.get("precision") : 5);
        if (e.type === "column" || e.type === "bar") e.plotOffset = (e.plotOffset || 0) - 1;
        e.tooltip = t.extend({
            valueDecimals: i
        }, e.tooltip)
    }, f.prototype.addChartAsset = function(e) {
        this.chartAssets.push(e)
    }, f.prototype._shouldConvertToEnvelope = function(e, t) {
        var n = !0;
        return t.length !== 2 && t.length !== 3 ? !1 : (t.forEach(function(t, r) {
            e[r] && (e[r].overlay === !1 || e[r].envelope === !1) && (n = !1), typeof t != "number" && (n = !1)
        }), n)
    }, f.prototype._convertDataToEnvelope = function(e) {
        return e.forEach(function(e) {
            var t = e.v[2];
            e.v = [
                [e.v[0], e.v[1]]
            ], t && e.v.push(t)
        }), e
    }, f.prototype.destroy = function() {
        this.chartAssets.forEach(function(e) {
            try {
                e.remove()
            } catch (t) {
                console.log("Highchart error:", t)
            }
        })
    }, f
}), define("components/charts/IndicatorSeriess", ["jquery", "./Seriess", "indicators"], function(e, t, n) {
    function r(e, n) {
        t.call(this, e, n)
    }
    return r.prototype = Object.create(t.prototype), r.prototype.fetch = function(e) {
        this.callbacks = e, n.fetch(this.options.indicator, this.options.instrumentId, this.options.interval, this.options.start, this.options.end ? this.options.end.toISOString() : null, this.options.parameters, this.onFetchResponse.bind(this))
    }, r.prototype.getIndicator = function() {
        return this.options.indicator
    }, r.prototype.getParameters = function() {
        return this.options.parameters
    }, r.prototype.getLabel = function() {
        return this.options.indicator + "(" + this.options.parameters + ")"
    }, r
}), define("controls/systemIndicators", [], function() {
    return {
        bollinger: {
            name: "Bollinger Bands",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }, {
                label: "Deviations",
                key: "deviations",
                "default": 2
            }],
            overlay: !0
        },
        chandelierExit: {
            name: "Chandelier Exit",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 22
            }, {
                label: "Multiplier",
                key: "multiplier",
                "default": 3
            }],
            overlay: !0
        },
        dailyPivot: {
            name: "Daily Pivot",
            parameters: [],
            overlay: !0
        },
        ema: {
            name: "Exponential Moving Average",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }],
            overlay: !0
        },
        emaEnvelope: {
            name: "Exponential Moving Average Envelope",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }, {
                label: "Envelope (%)",
                key: "envelope"
            }],
            overlay: !0
        },
        ichimokuCloud: {
            name: "Ichimoku Cloud",
            parameters: [{
                label: "Tenkan-sen (Conversion Line) Periods",
                key: "conversionLinePeriods",
                "default": 9
            }, {
                label: "Kijun-sen (Base Line) Periods",
                key: "baseLinePeriods",
                "default": 26
            }, {
                label: "Senkou Span B (Leading Span B) Periods",
                key: "leadingSpanPeriods",
                "default": 52
            }, {
                label: "Chikou Span (Lagging Span) Periods",
                key: "laggingSpanPeriods",
                "default": 26
            }],
            overlay: !0
        },
        keltnerChannels: {
            name: "Keltner Channels",
            parameters: [{
                label: "EMA Periods",
                key: "emaPeriods",
                "default": 20
            }, {
                label: "ATR Periods",
                key: "atrPeriods",
                "default": 10
            }, {
                label: "ATR Multiplier",
                key: "atrMultiplier",
                "default": 2
            }],
            overlay: !0
        },
        priceChannels: {
            name: "Price Channels",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }],
            overlay: !0
        },
        sma: {
            name: "Simple Moving Average",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }],
            overlay: !0
        },
        smaEnvelope: {
            name: "Simple Moving Average Envelope",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }, {
                label: "Envelope (%)",
                key: "envelope"
            }],
            overlay: !0
        },
        wma: {
            name: "Weighted Moving Average",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }],
            overlay: !0
        },
        adl: {
            name: "Accumulation Distribution Line",
            parameters: []
        },
        aroon: {
            name: "Aroon",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 25
            }]
        },
        aroonOscillator: {
            name: "Aroon Oscillator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 25
            }]
        },
        atr: {
            name: "Average True Range",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        bollingerBandwidth: {
            name: "Bollinger Bandwidth",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }, {
                label: "Deviations",
                key: "deviations",
                "default": 2
            }]
        },
        bollingerB: {
            name: "Bollinger %B Indicator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }, {
                label: "Deviations",
                key: "deviations",
                "default": 2
            }]
        },
        cmf: {
            name: "Chaikin Money Flow",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }]
        },
        cog: {
            name: "Center of Gravity Oscillator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 10
            }, {
                label: "Signal Periods",
                key: "signalPeriods",
                "default": 9
            }]
        },
        cmo: {
            name: "Chande Momentum Oscillator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }, {
                label: "Signal Periods",
                key: "signalPeriods",
                "default": 9
            }]
        },
        cci: {
            name: "Commodity Channel Index",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }, {
                label: "Constant",
                key: "constant",
                "default": .015
            }, {
                label: "Overbought Line",
                key: "overboughtLine",
                "default": 100
            }, {
                label: "Oversold Line",
                key: "oversoldLine",
                "default": -100
            }]
        },
        coppock: {
            name: "Coppock Curve",
            parameters: [{
                label: "First ROC Periods",
                key: "firstRoCPeriods",
                "default": 14
            }, {
                label: "WMA Periods",
                key: "wmaPeriods",
                "default": 10
            }, {
                label: "Second ROC Periods",
                key: "secondRoCPeriods",
                "default": 11
            }]
        },
        dpo: {
            name: "Detrended Price Oscillator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 20
            }]
        },
        emv: {
            name: "Ease of Movement",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        elderBBPower: {
            name: "Elder Bull/Bear Power",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 13
            }]
        },
        fisherTransform: {
            name: "Fisher Transform",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        forceIndex: {
            name: "Force Index",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 13
            }]
        },
        gapo: {
            name: "Gopalakrishnan Range Index",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 10
            }]
        },
        kst: {
            name: "Know Sure Thing",
            parameters: [{
                label: "First ROC Periods",
                key: "firstROCPeriods",
                "default": 10
            }, {
                label: "Second ROC Periods",
                key: "secondROCPeriods",
                "default": 15
            }, {
                label: "Third ROC Periods",
                key: "thirdROCPeriods",
                "default": 20
            }, {
                label: "Fourth ROC Periods",
                key: "fourthROCPeriods",
                "default": 30
            }, {
                label: "First SMA Periods",
                key: "firstSMAPeriods",
                "default": 10
            }, {
                label: "Second SMA Periods",
                key: "secondSMAPeriods",
                "default": 10
            }, {
                label: "Third SMA Periods",
                key: "thirdSMAPeriods",
                "default": 10
            }, {
                label: "Fourth SMA Periods",
                key: "fourthSMAPeriods",
                "default": 15
            }, {
                label: "Signal SMA Periods",
                key: "signalSMA",
                "default": 9
            }]
        },
        macd: {
            name: "MACD",
            parameters: [{
                label: "Fast EMA Periods",
                key: "fastEMAPeriods",
                "default": 12
            }, {
                label: "Slow EMA Periods",
                key: "slowEMAPeriods",
                "default": 26
            }, {
                label: "Signal EMA Periods",
                key: "signalEMAPeriods",
                "default": 9
            }]
        },
        macdHistogram: {
            name: "MACD Histogram",
            parameters: [{
                label: "Fast EMA Periods",
                key: "fastEMAPeriods",
                "default": 12
            }, {
                label: "Slow EMA Periods",
                key: "slowEMAPeriods",
                "default": 26
            }, {
                label: "Signal EMA Periods",
                key: "signalEMAPeriods",
                "default": 9
            }]
        },
        massIndex: {
            name: "Mass Index",
            parameters: [{
                label: "EMA Periods",
                key: "emaPeriods",
                "default": 9
            }, {
                label: "Summation Periods",
                key: "summationPeriods",
                "default": 25
            }]
        },
        mfi: {
            name: "Money Flow Index",
            parameters: [{
                label: "Periods",
                key: "emaPeriods",
                "default": 14
            }]
        },
        obv: {
            name: "On Balance Volume",
            parameters: []
        },
        ppo: {
            name: "Percentage Price Oscillator",
            parameters: [{
                label: "Fast EMA Periods",
                key: "fastEMAPeriods",
                "default": 12
            }, {
                label: "Slow EMA Periods",
                key: "slowEMAPeriods",
                "default": 26
            }, {
                label: "Signal EMA Periods",
                key: "signalEMAPeriods",
                "default": 9
            }]
        },
        pvo: {
            name: "Percentage Volume Oscillator",
            parameters: [{
                label: "Fast EMA Periods",
                key: "fastEMAPeriods",
                "default": 12
            }, {
                label: "Slow EMA Periods",
                key: "slowEMAPeriods",
                "default": 26
            }, {
                label: "Signal EMA Periods",
                key: "signalEMAPeriods",
                "default": 9
            }]
        },
        pgo: {
            name: "Pretty Good Oscillator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        pmo: {
            name: "Price Momentum Oscillator",
            parameters: [{
                label: "First EMA Periods",
                key: "firstEMAPeriods",
                "default": 35
            }, {
                label: "Second EMA Periods",
                key: "secondEMAPeriods",
                "default": 20
            }, {
                label: "Signal EMA Periods",
                key: "signalEMAPeriods",
                "default": 10
            }]
        },
        qStick: {
            name: "QStick",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        roc: {
            name: "Rate of Change",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 12
            }]
        },
        rsi: {
            name: "Relative Strength Index",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        standardDeviation: {
            name: "Standard Deviation (Volatility)",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 10
            }]
        },
        stochasticOscillator: {
            name: "Stochastic Oscillator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }, {
                label: "Signal Periods",
                key: "smaPeriods",
                "default": 3
            }]
        },
        stochRsi: {
            name: "StochRSI",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        trix: {
            name: "TRIX",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 15
            }, {
                label: "Signal Periods",
                key: "signalPeriods",
                "default": 9
            }]
        },
        tsi: {
            name: "True Strength Index",
            parameters: [{
                label: "First Periods",
                key: "firstPeriods",
                "default": 25
            }, {
                label: "Second Periods",
                key: "secondPeriods",
                "default": 13
            }, {
                label: "Signal Periods",
                key: "signalPeriods",
                "default": 9
            }]
        },
        uo: {
            name: "Ultimate Oscillator",
            parameters: [{
                label: "Short Periods",
                key: "shortPeriods",
                "default": 7
            }, {
                label: "Medium Periods",
                key: "mediumPeriods",
                "default": 14
            }, {
                label: "Long Periods",
                key: "longPeriods",
                "default": 28
            }]
        },
        volume: {
            name: "Volume",
            parameters: []
        },
        vtx: {
            name: "Vortex Indicator",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        },
        williamsR: {
            name: "Williams %R",
            parameters: [{
                label: "Periods",
                key: "periods",
                "default": 14
            }]
        }
    }
}), define("components/charts/IndicatorPanel", ["underscore", "jquery", "backbone", "controls/PopoutPanelMixin", "./IndicatorDialogue", "./IndicatorSeriess", "indicators", "controls/systemIndicators", "registry", "toastr"], function(e, t, n, r, i, s, o, u, a, f) {
    var l = u,
        c = n.View.extend(t.extend({
            title: "Indicators",
            className: "panel c9t-technical-indicators-panel",
            positionAbsolute: !0,
            align: "left",
            positionOffsetY: 6,
            absolutePopoutClassName: "c9t-technical-indicators-panel",
            initialize: function() {
                r.call(this), this.active = {}, this.pendingFetch = 0, this.render(), this.$loading = t('<i class="fa c9t-spinner fa-refresh fa-spin"></i>').hide(), this.$header.prepend(this.$loading), this.options.settings.indicatorConfig && this._loadConfig(this.options.settings.indicatorConfig)
            },
            render: function() {
                var n = [t("<div>", {
                        "class": "column"
                    }).html("<h3>Overlays</h3>"), t("<div>", {
                        "class": "column"
                    }).html("<h3>Studies</h3>"), t("<div>", {
                        "class": "column"
                    }).html("<h3>&nbsp;</h3>"), t("<div>", {
                        "class": "column"
                    }).html("<h3>&nbsp;</h3>")],
                    r, i = 0,
                    s = e.reject(l, function(e) {
                        return e.overlay
                    }).length,
                    o = a.get("indicators");
                for (var u in l) {
                    var f = t("<div>", {
                        "data-key": u,
                        "class": "c9t-indicator"
                    }).text(l[u].name);
                    l[u].overlay ? n[0].append(f) : (i++, i < s / 3 ? n[1].append(f) : i < s * (2 / 3) ? n[2].append(f) : n[3].append(f))
                }
                o && (r = t("<div>", {
                    "class": "column"
                }).html("<h3>Custom</h3>"), o.each(function(e) {
                    e.get("system") || r.append(t("<div>", {
                        "data-key": e.get("key"),
                        "class": "c9t-indicator"
                    }).text(e.get("name")))
                }, this)), this.$body.append(n), r && this.$body.append(r), this.$active = t("<div>", {
                    "class": "column"
                }).html("<h3>Active</h3>"), this.$body.append(this.$active), this.$body.on("click", ".c9t-indicator", this.onSelect.bind(this)), this.$body.on("click", ".active-indicator .c9t-remove", this.onRemoveClick.bind(this))
            },
            _loadConfig: function(t) {
                e.each(t, function(e) {
                    this.onDialogueOK(e.key, e.parameters, !0)
                }, this)
            },
            onSelect: function(e) {
                var n = t(e.target).attr("data-key"),
                    r = t(e.target).text() + " (" + t(e.target).attr("data-key") + ")",
                    i = !!l[n],
                    s, o;
                if (i) o = l[n].parameters, o.length === 0 ? this.onDialogueOK(n) : this.showDialogue(r, n, i, o);
                else {
                    s = a.get("indicators").findWhere({
                        key: n
                    });
                    if (typeof s.get("script") == "undefined") {
                        s.fetch({
                            success: this.onSelect.bind(this, e),
                            error: function() {
                                f.error("Error retrieving technical indicator script"), this.hide()
                            }.bind(this)
                        });
                        return
                    }
                    o = s.get("parameters"), o.length ? this.showDialogue(r, n, i, o) : this.onDialogueOK(n)
                }
            },
            showDialogue: function(e, t, n, r) {
                var s = new i({
                    title: e,
                    isSystem: !1,
                    parameters: r,
                    onOK: this.onDialogueOK.bind(this, t)
                });
                s.show()
            },
            onDialogueOK: function(e, n, r) {
                var i = e + (n ? "(" + n + ")" : ""),
                    o = new s(t.extend({
                        name: i,
                        indicator: e,
                        parameters: n
                    }, this.options.settings));
                return this.pendingFetch++, this.$loading.show(), o.fetch({
                    success: this.onIndicatorFetched.bind(this, o, r)
                }), o.once("error", this.onIndicatorError, this), this.close(), !0
            },
            onIndicatorFetched: function(e, t) {
                this.onSeriesAdded(e, t), this.options.onAddIndicator(e), this.pendingFetch--, this.pendingFetch === 0 && this.$loading.hide()
            },
            onIndicatorError: function() {
                this.pendingFetch--, this.pendingFetch === 0 && this.$loading.hide()
            },
            onSeriesAdded: function(e, n) {
                var r = e.getLabel(),
                    i = e.getName(),
                    s = e.getColor(),
                    o = t("<div>", {
                        "data-id": r,
                        "class": "active-indicator"
                    });
                this.active[r] = e, o.css("color", s), o.text(i), o.append('<div class="c9t-remove fa fa-times"></div>'), this.$active.append(o), n || this.trigger("change:config", this._getConfig())
            },
            onRemoveClick: function(e) {
                var n = t(e.target).parent();
                e.stopPropagation(), this.active[n.attr("data-id")].destroy(), delete this.active[n.attr("data-id")], n.remove(), this.trigger("change:config", this._getConfig())
            },
            _getConfig: function() {
                return e.map(this.active, function(e) {
                    return {
                        key: e.getIndicator(),
                        parameters: e.getParameters()
                    }
                })
            },
            tearDown: function() {
                this.remove()
            }
        }, r.prototype));
    return c
}), define("controls/DropDown", ["underscore", "jquery", "backbone", "registry", "jquery.chosen"], function(e, t, n, r) {
    function i(e) {
        this.$el = e.$el || t("<div>", {
            "class": e.css
        }), e.label && this.$el.html('<label for="' + e.id + '">' + e.label + "</label>"), this.render(e)
    }
    return i.prototype.render = function(e) {
        if (e.data instanceof n.Collection && !e.data.isSynced()) return e.data.once("sync", this.render.bind(this, e), this);
        e.$select ? this.$select = e.$select : (this.$select = t("<select>", {
            id: e.id,
            name: e.name
        }), typeof e.placeholder != "undefined" && this.$select.append('<option class="placeholder" value="-1" disabled selected>' + e.placeholder + "</option>"), e.groupBy && (this.$groups = {}), e.data.sortBy && (e.sortField || e.display) && (e.data = e.data.sortBy(e.sortField || e.display), e.sortOrder === "descending" && e.data.reverse()), e.data.forEach(this.addOption.bind(this, e.selected, e.groupBy, e.display || "name"), this), e.selected || (this.$select.prop({
            selectedIndex: "-1"
        }), this.val(-1))), this.$el.append(this.$select), e.custom ? (setTimeout(function() {
            this.$select.chosen(t.extend({}, {
                width: "auto",
                disable_search: !0
            }, e.customOptions)).change(this.onSelect.bind(this, e.onSelect)), e.size && this.$el.find(".chosen-container").addClass("chosen-" + e.size), e.icon && this.$el.find(".chosen-single").prepend('<i class="fa ' + e.icon + '"></i>'), this.onRendered && this.onRendered()
        }.bind(this), 0), this.$select.on("chosen:showing_dropdown", this.onShow.bind(this))) : this.$select.on("change", this.onSelect.bind(this, e.onSelect))
    }, i.prototype.addOption = function(e, n, r, i) {
        var s = t("<option>", {
                value: i.id,
                selected: i === e || i.id === e
            }).text(i.get ? i.get(r) : i[r || "value"]),
            o;
        n ? (o = i.get(n), this.$groups[o] || (this.$groups[o] = t("<optgroup>", {
            label: o
        }), this.$select.append(this.$groups[o])), this.$groups[o].append(s)) : this.$select.append(s)
    }, i.prototype.val = function(e) {
        if (typeof e == "undefined") return this.$select.val();
        this.$select.val(e), this.$select.trigger("chosen:updated")
    }, i.prototype.onSelect = function(n, r) {
        var i = t(r.target).val(),
            s = parseInt(i, 10);
        n && n(e.isNaN(s) ? i : s)
    }, i.prototype.onShow = function() {
        var e = r.get("app");
        e && r.get("app").trigger("enter-modal", this)
    }, i.prototype.enableAllItems = function() {
        this.$el.find("option").prop("disabled", !1), this.$el.find("option.placeholder").prop("disabled", !0), this.$select.trigger("chosen:updated")
    }, i.prototype.disableItem = function(e) {
        this.$el.find("option[value=" + e + "]").prop("disabled", !0), this.$select.trigger("chosen:updated")
    }, i.prototype.setTitle = function(e) {
        this.$el.find(".chosen-container .chosen-single > span").html(e)
    }, i
}), define("components/charts/SnapshotDialogue", ["backbone", "controls/Dialogue"], function(e, t) {
    var n = t.extend({
        className: t.prototype.className + " panel c9t-snapshot-dialogue",
        title: "Snapshot Preview",
        OKText: "Download",
        showClose: !0,
        showCancel: !1,
        initialize: function() {
            var e = "https://www.cloud9trader.com/chart/" + this.options.filename;
            t.prototype.initialize.call(this), this.$body.append('<p><i class="fa fa-link"></i> <a href="' + e + '" target="_blank">' + e + "</a></p>"), this.$body.append('<p><img src="' + e + '" /><p>'), this.$body.find("img").load(this.center.bind(this)), this.center()
        },
        onOK: function() {
            var e = document.createElement("a");
            e.download = this.options.filename, e.href = "https://www.cloud9trader.com/chart/" + this.options.filename, e.click()
        }
    });
    return n
}), define("components/charts/PriceTicker", ["jquery", "backbone", "registry"], function(e, t, n) {
    var r = t.View.extend({
        className: "c9t-price-ticker",
        initialize: function() {
            this.$statusLight = e("<div>", {
                "class": "c9t-status-light"
            }).hide(), this.$statusText = e("<div>", {
                "class": "c9t-status-text"
            }).hide(), this.$bid = e("<div>", {
                "class": "c9t-bid-price"
            }), this.$ask = e("<div>", {
                "class": "c9t-ask-price"
            }), this.$el.append(this.$statusLight, this.$statusText, this.$bid, this.$ask), this.subscribe()
        },
        subscribe: function() {
            var e = n.get("instruments"),
                t;
            if (!e.isSynced()) return this.listenToOnce(e, "sync", this.subscribe);
            this.render(), t = e.get(this.options.symbol), t.on("change:open", this.onMarketOpenChange), t.on("tick", this.onTick, this), this.onMarketOpenChange(t.get("open"))
        },
        onTick: function(e) {
            this.$bid.text(e.get("bid")), this.$ask.text(e.get("ask"))
        },
        onMarketOpenChange: function(e) {
            e === !0 ? (this.$statusLight.addClass("c9t-open").show(), this.$statusText.text("Market open").show()) : e === !1 ? (this.$statusLight.addClass("c9t-closed").show(), this.$statusText.text("Market closed").show()) : (this.$statusLight.hide(), this.$statusText.hide())
        }
    });
    return r
}), define("components/charts/PriceChartSettings", ["jquery", "backbone", "./IndicatorPanel", "./LineSeries", "./TimeData", "controls/DropDown", "./SnapshotDialogue", "./PriceTicker", "registry", "toastr"], function(e, t, n, r, i, s, o, u, a, f) {
    var l = t.View.extend({
        className: "c9t-settings-bar",
        events: {
            "click .c9t-chart-button-snapshot": "onSnapshotClick"
        },
        initialize: function(e) {
            var t, r = [{
                id: "Tick",
                name: "Tick"
            }, {
                id: "S5",
                name: "5 sec"
            }, {
                id: "S15",
                name: "15 sec"
            }, {
                id: "S30",
                name: "30 sec"
            }, {
                id: "M1",
                name: "1 min"
            }, {
                id: "M2",
                name: "2 min"
            }, {
                id: "M5",
                name: "5 min"
            }, {
                id: "M10",
                name: "10 min"
            }, {
                id: "M15",
                name: "15 min"
            }, {
                id: "M30",
                name: "30 min"
            }, {
                id: "H1",
                name: "1 hour"
            }, {
                id: "H2",
                name: "2 hour"
            }, {
                id: "H4",
                name: "4 hour"
            }, {
                id: "H8",
                name: "8 hour"
            }, {
                id: "H12",
                name: "12 hour"
            }, {
                id: "D1",
                name: "1 day"
            }];
            this.options = e, e.settings.instruments && (this.$instrumentId = new s({
                css: "c9t-setting c9t-setting-instruments",
                data: a.get("instruments"),
                display: "displayHTML",
                selected: e.dataSettings.instrumentId,
                groupBy: "product",
                custom: !0,
                size: "small",
                onSelect: this.onChange.bind(this, "instrumentId"),
                customOptions: {
                    disable_search: !1
                }
            }), this.$el.append(this.$instrumentId.$el)), e.settings.interval && ((a.get("account") && a.get("account").get("broker") === "FXCM" || e.dataSettings.instrumentId.split(":") && e.dataSettings.instrumentId.split(":")[1] === "FXCM") && r.splice(1, 3), this.$interval = new s({
                css: "c9t-setting",
                data: r,
                selected: e.dataSettings.interval,
                custom: !0,
                size: "small",
                onSelect: this.onChange.bind(this, "interval")
            }), this.$el.append(this.$interval.$el)), e.settings.side && (this.$side = new s({
                css: "c9t-setting c9t-setting-side",
                data: [{
                    id: "ask",
                    name: "Ask"
                }, {
                    id: "mid",
                    name: "Mid"
                }, {
                    id: "bid",
                    name: "Bid"
                }],
                custom: !0,
                size: "small",
                onSelect: this.onChange.bind(this, "side")
            }), this.$side.val(e.dataSettings.side || "mid"), this.$el.append(this.$side.$el)), e.settings.type && (t = window.bootstrap && window.bootstrap.version || "0", this.$type = new s({
                css: "c9t-setting c9t-setting-type",
                data: [{
                    id: "candlestick",
                    name: '<img src="/' + t + '/images/candlestick-icon.png" class="c9t-image-icon" />'
                }, {
                    id: "ohlc",
                    name: '<img src="/' + t + '/images/ohlc-icon.png" class="c9t-image-icon" />'
                }, {
                    id: "spline",
                    name: '<img src="/' + t + '/images/line-icon.png" class="c9t-image-icon" />'
                }],
                custom: !0,
                size: "small",
                onSelect: this.onChange.bind(this, "type")
            }), this.$type.val(e.dataSettings.type || "candlestick"), e.dataSettings.interval === "Tick" && this.$type.$el.hide(), this.$el.append(this.$type.$el)), e.settings.indicators && e.dataSettings.interval !== 0 && (this.indicators = new n({
                settings: e.dataSettings,
                onAddIndicator: this.onAddIndicator.bind(this)
            }), this.indicators.on("change:config", this._onChangeIndicatorConfig, this), this.$el.append(this.indicators.$el)), this.options.chart.chart.ready ? this.renderButtons() : this.options.chart.chart.once("ready", this.renderButtons, this)
        },
        renderButtons: function() {
            this.options.settings.embed !== !1 && (this.$embed = e('<div class="c9t-chart-button c9t-chart-button-embed" title="HTML embed code"><i class="fa fa-share-alt"></i></div>'), this.$embed.tooltip({
                placement: "bottom"
            }), this.$el.append(this.$embed)), this.options.settings.snapshot !== !1 && (this.$snapshot = e('<div class="c9t-chart-button c9t-chart-button-snapshot" title="Snapshot"><i class="fa fa-camera"></i></div>'), this.$snapshot.tooltip({
                placement: "bottom"
            }), this.$el.append(this.$snapshot))
        },
        onAddIndicator: function(e) {
            return this.options.chart.addSeriess(e)
        },
        onChange: function(e) {
            var t = this["$" + e].val();
            e === "instrument" && this.$type.$el.toggle(t !== "Tick"), this.trigger("change:" + e, e, t)
        },
        _onChangeIndicatorConfig: function(e) {
            this.trigger("change:indicatorConfig", e)
        },
        onSnapshotClick: function() {
            var e = this.$el.find(".c9t-chart-button-snapshot i").removeClass("fa-camera").addClass("fa-refresh fa-spin");
            if (this.pendingSnapshot) return;
            this.pendingSnapshot = !0, this.options.chart.createSnapshot(function(t, n) {
                var r;
                this.pendingSnapshot = !1, e.addClass("fa-camera").removeClass("fa-refresh fa-spin");
                if (t) return f.error(t);
                r = new o(n), r.show()
            })
        },
        setIntervalDropdownTitle: function(e) {
            this.$interval && this.$interval.setTitle(e)
        }
    });
    return l
}), define("components/charts/TimeChart", ["underscore", "jquery", "backbone", "registry", "highstock", "highcharts-more", "highcharts-exporting"], function(e, t, n, r, i) {
    function o(e) {
        i.setOptions({
            global: {
                useUTC: e
            }
        })
    }
    var s;
    i = i || window.Highcharts, i.wrap(i.Series.prototype, "processData", function(e) {
        var t;
        if (this.type !== "candlestick") return e.apply(this, Array.prototype.slice.call(arguments, 1));
        this.currentDataGrouping && (t = this.currentDataGrouping.totalRange), e.apply(this, Array.prototype.slice.call(arguments, 1)), e.apply(this, Array.prototype.slice.call(arguments, 1)), this.currentDataGrouping && t !== this.currentDataGrouping.totalRange && (window.HighchartsAdapter || i.HighchartsAdapter).fireEvent(this.chart, "change-grouping", {
            ms: this.currentDataGrouping.totalRange,
            series: this
        })
    }), i.setOptions({
        lang: {
            thousandsSep: ","
        }
    }), s = i.getOptions().colors.slice(0), s.splice(1, 1), o(!1), r.on("register:settings", function(e) {
        o(!!e.get("utc-dates")), e.on("change:utc-dates", function(e, t) {
            o(t)
        })
    }), i.SVGRenderer.prototype.symbols.cross = function(e, t, n, r) {
        var i = n / 2;
        return ["M", e + i, t, "L", e + i, t + r, "M", e, t + i, "L", e + r, t + i, "z"]
    };
    var u = n.View.extend({
        className: "chart",
        initialize: function() {
            var e;
            this.$chart = t("<div>"), this.$chart.width(this.options.width), this.$chart.height(this.options.height), this.dataNotFetchedCount = this.options.dataSeries.length, this.$el.append(this.$chart), setTimeout(function() {
                this.setupInitialConfig()
            }.bind(this), 0), (typeof this.options.spinner == "undefined" || this.options.spinner) && this.$chart.html('<i class="c9t-spinner fa fa-refresh fa-spin"></i>'), this.studies = 0, e = r.get("settings"), e && this.listenTo(e, "change:utc-dates", this.requestRedraw)
        },
        setupInitialConfig: function() {
            this.config = t.extend(!0, {}, this.defaultConfig, this.options.chartConfig), this.config.chart.renderTo = this.$chart[0], this.config.chart.height = this.options.height || this.config.chart.height, typeof this.options.navigator != "undefined" && (this.config.navigator.enabled = this.options.navigator), typeof this.options.tooltipYPosition != "undefined" ? this.config.tooltip.positioner = this.config.tooltip.positioner.bind(this, this.options.tooltipYPosition) : this.config.tooltip.positioner = this.config.tooltip.positioner.bind(this, 34), this.config.xAxis.forEach(function(e) {
                typeof this.options.ordinal != "undefined" && (e.ordinal = this.options.ordinal), typeof this.options.min != "undefined" && (e.min = this.options.min.getTime(), this.config.navigator.xAxis.min = this.options.min.getTime()), typeof this.options.max != "undefined" && this.options.max !== null && (e.max = this.options.max.getTime(), this.config.navigator.xAxis.max = this.options.max.getTime()), e.min && e.max && (this.config.navigator.adaptToUpdatedData = !1), e.ordinal === !1 && (e.plotBands = this.getWeekendBands(e.min || this.options.dataSeries[0].series.getStart(), e.max || this.options.dataSeries[0].series.getEnd())), this.options.range !== !1 && this.options.dataSeries[0].series.getIntervalMs && (e.range = Math.round(this.$el.width() / 10) * this.options.dataSeries[0].series.getIntervalMs()), this.options.chartConfig && this.options.chartConfig.range && (e.range = this.options.chartConfig.range)
            }, this), this.options.dataSeries[0].series.type === "candlestick" ? (this.config.xAxis[0].id = "x-axis-candlestick", this.config.xAxis[0].id = "x-axis-spline") : (this.config.xAxis[0].id = "x-axis-spline", this.config.xAxis[0].id = "x-axis-candlestick"), this.config.xAxis[0].events = {
                afterSetExtremes: this.onScroll.bind(this)
            }, this.options.dataSeries.forEach(this.setupSeries, this)
        },
        setupSeries: function(t, n) {
            if (t.series.configReady === !1) return this.listenToOnce(t.series, "config-ready", this.setupSeries.bind(this, t, n));
            var r = t.series.getChartConfig(),
                i = "y-axis-" + (t.position || 0) + (t.opposite ? "-opposite" : ""),
                s = e(this.config.yAxis).find(function(e) {
                    return e.id === i
                }),
                o = e(this.config.xAxis).find(function(e) {
                    return e.id === "x-axis-" + r.type
                }),
                u;
            n === 0 && (this.config.xAxis[0].id = "x-axis-" + r.type, o = this.config.xAxis[0]), s || (this.addYAxis(i, r, null, t.opposite), n === 0 && t.series.getInstrument && (u = this.options.dataSeries[0].series.getInstrument(), this.config.yAxis[0].labels = {
                formatter: function() {
                    return this.isFirst ? "" : u.formatPrice(this.value)
                },
                useHtml: !0,
                align: "left",
                x: 0
            })), r.dataLoaded ? this.onSeriesDataFetched(i, n, t.series) : r.dataErrored ? this.onSeriesDataFetchError() : (this.listenToOnce(t.series, "data-fetched", this.onSeriesDataFetched.bind(this, i, n)), this.listenToOnce(t.series, "data-fetch-error", this.onSeriesDataFetchError.bind(this)))
        },
        onSeriesDataFetched: function(e, t, n, r) {
            var i = n.getChartConfig();
            this.config.series = this.config.series || [], i.yAxis = e, i.xAxis = "x-axis-" + i.type, this.config.series[t] = i, this.dataNotFetchedCount--, this.config.navigator.xAxis.min && r && r.getTime() > this.config.navigator.xAxis.min && (this.config.xAxis.forEach(function(e) {
                e.min = r.getTime()
            }), this.config.navigator.xAxis.min = r.getTime()), this.dataNotFetchedCount === 0 && this.render()
        },
        onSeriesDataFetchError: function() {
            this.$chart.html('<i class="c9t-failure fa fa-warning" title="Error retrieving data!"></i>')
        },
        render: function() {
            var e, n;
            this.config.navigator.series = t.extend(!0, {}, this.defaultConfig.navigator.series, {
                data: this.config.series[0].data.slice(0),
                id: "nav-series"
            }), this.options.plotLine && this.config.series[0].data && (n = this.config.series[0].data[this.config.series[0].data.length - 1]), this.highchart = new i.StockChart(this.config), t(this.highchart).on("change-grouping", this._onDataGroupingChanged.bind(this)), this.options.dataSeries.forEach(function(e, t) {
                this.addSeriesListeners(e.series, this.highchart.series[t])
            }, this), this.options.plotLine && this.options.plotLine.setYAxis(this.highchart.yAxis[0], n), e = this.getRange(), this.trigger("scroll", e.min, e.max), this.ready = !0, this.trigger("ready")
        },
        addYAxis: function(e, n, r, i, s) {
            this.config.yAxis.push(t.extend({
                id: e,
                opposite: i,
                allowDecimals: typeof n.allowDecimals != "undefined" ? n.allowDecimals : !!n.precision,
                maxPadding: 0,
                labels: {
                    align: i ? "right" : "left",
                    x: 0
                },
                title: {
                    text: n.axisTitle,
                    align: "high",
                    rotation: 0,
                    offset: i ? -2 : -27,
                    y: 20,
                    style: {
                        color: n.color
                    }
                },
                gridLineColor: "#EEE"
            }, s || {})), this.updateYAxisPositions();
            if (this.highchart) return this.highchart.addAxis(this.config.yAxis[this.config.yAxis.length - 1], !1), this.highchart.yAxis[this.highchart.yAxis.length - 1]
        },
        removeYAxis: function(t) {
            this.config.yAxis = e.filter(this.config.yAxis, function(e) {
                return e.id !== t.userOptions.id
            }), this.highchart && (this.studies--, t.origRemove()), this.updateYAxisPositions()
        },
        updateYAxisPositions: function() {
            var e = [0],
                t = this.studies;
            for (var n = 1; n <= t; n++) e[n] = (n + 2) * (100 / (t + 3));
            this.config.yAxis.forEach(function(t) {
                var n = t.id.match(/y-axis-(\d+)/),
                    r, i, s;
                n && (r = parseInt(n[1], 10), i = e[r || 0], s = (e[r + 1] || 100) - e[r], t.top = (i === 0 ? 0 : i + 1) + "%", t.height = (s === 100 ? 100 : s - 1) + "%")
            }), this.highchart && this.highchart.yAxis.forEach(function(t) {
                var n = t.userOptions.id.match(/y-axis-(\d+)/),
                    r, i, s;
                n && (r = parseInt(n[1], 10), i = e[r || 0], s = (e[r + 1] || 100) - e[r], t.update({
                    top: (i === 0 ? 0 : i + 1) + "%",
                    height: (s === 100 ? 100 : s - 1) + "%"
                }))
            }), this.options.unitHeight && this.resize(null, this.options.unitHeight * (e.length + 2))
        },
        addXAxis: function(t) {
            var n = e.extend({}, this.config.xAxis[0], {
                id: "x-axis-" + t.type,
                labels: {
                    enabled: !1
                },
                plotBands: null
            });
            this.config.xAxis.push(n), this.highchart && this.highchart.addAxis(n, !0)
        },
        addSeries: function(t, n, r, i, s, o) {
            var u, a, f, l, c, h;
            return this.highchart ? (n = typeof n == "undefined" ? !0 : n, u = t.getChartConfig(), o || (h = n ? 0 : ++this.studies, o = "y-axis-" + h + (r ? "-opposite" : "")), a = e(this.config.yAxis).find(function(e) {
                return e.id === o
            }), f = u.type === "areasplinerange" ? "spline" : u.type, l = e(this.config.xAxis).find(function(e) {
                return e.id === "x-axis-" + f
            }), l && (u.xAxis = l.id), u.id = Math.random().toString(36).substring(7), a || (a = this.addYAxis(o, u, h, r, s), a.origRemove = a.remove, a.remove = this.removeYAxis.bind(this, a), i && (n === !1 && !i.studyYAxisId && (i.studyYAxisId = o), i.addChartAsset(a))), u.yAxis = o, c = this.highchart.addSeries(u, !1), t.setChartSeries(c), t.isHidden() && c.hide(), this.addSeriesListeners(t, c), this.requestRedraw(), c.id = u.id, i && i.addChartAsset(c), c) : this.once("ready", this.addSeries.bind(this, t, n, r, i, s, o))
        },
        addSeriesListeners: function(e, t) {
            this.listenTo(e, "add", this.addPoint.bind(this, t)), this.listenTo(e, "refresh", this.refreshData.bind(this, t)), this.listenTo(e, "update-last", this.updateLastPoint.bind(this, t)), this.listenTo(e, "update-config", this.updateSeriesConfig.bind(this, t)), this.listenTo(e, "set-data", this.onSeriesSetData.bind(this, t)), this.listenTo(e, "change:type", this.onSeriesChangeType.bind(this, t)), t.seriesObject = e
        },
        removeSeriesListeners: function(e) {
            e.off(null, null, this)
        },
        isReady: function() {
            return !!this.ready
        },
        getYAxesHeight: function() {
            var e = 0;
            return this.yAxes.forEach(function(t) {
                e += this.highchart.get(t.id).height + 15
            }.bind(this)), e
        },
        setChartHeight: function(e) {
            this.$chart.height(e), this.highchart.setSize(null, e)
        },
        resize: function(e, t) {
            this.highchart ? (this.highchart.setSize(e || this.$chart.width(), t || this.$chart.height()), this.highchart.series[0].update({}), this.redraw()) : this.once("ready", this.resize.bind(this, e, t), this)
        },
        requestRedraw: function() {
            this.pendingRedraw = !0, this.redrawTimeout || (this.redraw(), this.redrawTimeout = setTimeout(this.onRedrawTimeout.bind(this), 1e3))
        },
        redraw: function() {
            try {
                this.highchart.redraw()
            } catch (e) {
                console.error("Highcharts error:", e)
            }
            this.pendingRedraw = !1
        },
        onRedrawTimeout: function() {
            this.redrawTimeout = null, this.pendingRedraw && this.redraw()
        },
        updateLastPoint: function(e, t, n) {
            var r;
            if (!e.data) return console.error("No series data to update");
            r = e.data.length - 1, r !== -1 && (n ? e.data[r].update(t) : (e.data[r].update(t, !1, !1), this.requestRedraw()))
        },
        addPoint: function(e, t, n) {
            var r, i, s;
            if (!e.options) return console.log("ADD POINT SERIES DOESNT HAVE OPTIONS");
            e.addPoint(t, !1, n), r = this.highchart.get("nav-series"), e.index === 0 && r && r.addPoint(t, !1, n), this.options.liveScrollRange ? this.scroll(t[0] - this.options.liveScrollRange, t[0]) : this.options.liveProcession && (i = this.getRange(), s = i.max - i.min, t[0] - i.max < s / 10 && this.scroll(t[0] - s, t[0])), this.requestRedraw()
        },
        refreshData: function(e, t) {
            var n = this.highchart.get("nav-series");
            e.setData(t, !1), e.index === 0 && n && n.setData(t, !1, !1), this.requestRedraw()
        },
        updateSeriesConfig: function(e, t) {
            e.update(t, !1), this.requestRedraw()
        },
        onSeriesSetData: function(e, t) {
            e.setData(t, !0)
        },
        onSeriesChangeType: function(e, t) {
            var n = e.userOptions.data[e.userOptions.data.length - 1];
            n && n.x && (n.y ? e.userOptions.data[e.userOptions.data.length - 1] = [n.x, n.y] : n.open && (e.userOptions.data[e.userOptions.data.length - 1] = [n.x, n.open, n.high, n.low, n.close])), e.update({
                type: t
            })
        },
        getRange: function() {
            return this.highchart.xAxis[0].getExtremes()
        },
        onScroll: function(e) {
            this.trigger("scroll", e.min, e.max, e.dataMin, e.dataMax)
        },
        getScroll: function() {
            return this.highchart.xAxis[0].getExtremes()
        },
        scroll: function(e, t, n) {
            if (!e || !t) return;
            typeof e != "number" && (e = e.getTime()), typeof t != "number" && (t = t.getTime()), this.highchart && (this.highchart.xAxis.forEach(function(r) {
                r.setExtremes(e, t, !!n, !1)
            }), n || this.requestRedraw())
        },
        getWeekendBands: function(e, t) {
            var n = 6048e5,
                r = Math.floor(e / n),
                i = Math.floor(t / n),
                s = Date.UTC(1970, 0, 2, 22, 0, 0),
                o = Date.UTC(1970, 0, 4, 22, 0, 0),
                u = [],
                a = this.options.weekendBandsColor || "#FAFAFA";
            for (var f = r; f <= i; f++) u.push({
                color: a,
                from: f * n + s,
                to: f * n + o,
                zIndex: 1
            });
            return u
        },
        _onDataGroupingChanged: function(e) {
            this.trigger("change-grouping", e.ms, e.series)
        },
        createSnapshot: function(e) {
            this.highchart && t.ajax("//export.highcharts.com/", {
                method: "POST",
                data: {
                    svg: this.getSnapshotSVG(),
                    async: !0
                }
            }).done(function(n) {
                t.ajax("https://www.cloud9trader.com/public-api/chart-snapshot", {
                    method: "POST",
                    data: {
                        imagepath: n
                    }
                }).success(function(t) {
                    e(null, t)
                }).fail(function() {
                    e("Error storing snapshot. Please try again.")
                })
            }).fail(function() {
                e("Error creating snapshot. Please try again.")
            })
        },
        getSnapshotSVG: function() {
            var n, r = e.findWhere(this.highchart.series, {
                name: "Navigator"
            });
            return this.showCredit(), r && r.hide(), n = t(this.highchart.container.innerHTML), this.hideCredit(), r && r.show(), n.find(".highcharts-tooltip").remove(), n.find(".highcharts-navigator").remove(), n.find(".highcharts-navigator-handle-left").remove(), n.find(".highcharts-navigator-handle-right").remove(), n[0].outerHTML
        },
        showCredit: function() {
            this.credit ? this.credit.show() : (this.credit = this.highchart.renderer.g("c9t-credit").attr({
                zIndex: 999
            }).add(), this.highchart.renderer.text("charts by", this.$chart.width() - 167, 22).css({
                color: "#777",
                fontSize: "9px",
                zIndex: 999
            }).add(this.credit), this.highchart.renderer.path({
                d: "M102.007,36.452c-2.735-3.931-6.998-6.825-11.742-7.98c-1.155-5.594-4.564-10.708-9.335-14.049c-3.13-2.212-6.826-3.681-10.668-4.185c-5.318-0.759-10.895,0.312-15.506,2.993c-3.24,1.853-5.99,4.474-8.009,7.543c-4.182-0.421-8.486,0.528-12.095,2.61c-4.428,2.523-7.732,6.755-9.138,11.535c-3.725,0.226-7.357,1.696-10.109,4.147c-3.327,2.896-5.307,7.152-5.405,11.483v0.637c0.082,4.347,2.062,8.635,5.41,11.541c3.01,2.69,7.094,4.192,11.186,4.173c19.394,0.008,38.786,0,58.18,0.004c1.812-0.002,3.636-0.154,5.394-0.597c5.135-1.217,9.697-4.501,12.398-8.898c1.844-2.934,2.815-6.35,2.894-9.779v-0.51C105.401,43.341,104.217,39.574,102.007,36.452z M96.887,52.62c-1.961,4.154-6.447,7.043-11.168,7.146c-4.295,0.058-8.593,0.009-12.889,0.025c-14.667,0-29.335,0-44.003,0c-1.375-0.02-2.767,0.076-4.126-0.19c-2.597-0.493-4.922-2.152-6.197-4.398c-1.366-2.345-1.514-5.303-0.423-7.777c1.441-3.396,5.25-5.712,9.044-5.372c1.502,0.184,3,0.407,4.502,0.609c0.233-1.493,0.452-2.987,0.678-4.48c0.539-3.309,2.546-6.356,5.399-8.241c2.646-1.778,6.02-2.517,9.193-1.959c1.266,0.233,2.534,0.468,3.802,0.698c0.965-1.714,1.756-3.533,2.976-5.1c2.159-2.83,5.303-4.947,8.808-5.88c3.775-1.023,7.927-0.684,11.466,0.95c3.798,1.718,6.847,4.905,8.345,8.694c0.973,2.311,1.069,4.829,1.438,7.267c2.25,0.394,4.608,0.477,6.716,1.426c3.194,1.347,5.785,4.003,6.933,7.199C98.497,46.265,98.309,49.714,96.887,52.62z",
                translateX: this.$chart.width() - 125,
                translateY: 7,
                scaleX: .25,
                scaleY: .25,
                fill: "#000",
                zIndex: 999
            }).add(this.credit), this.highchart.renderer.path({
                d: "M83.003,35.933c-0.109,0.981-0.293,1.973-0.555,2.976c-0.219,0.873-0.491,1.712-0.818,2.519c-0.326,0.808-0.709,1.603-1.145,2.387L66.894,66.896l-3.142,0.01l11.894-20.213l-2.747,1.374l-2.812,0.785l-2.943,0.262c-4.623,0-8.46-1.505-11.511-4.514c-3.053-3.052-4.579-6.889-4.579-11.511c0-4.622,1.526-8.459,4.579-11.511c3.051-3.052,6.889-4.579,11.511-4.579s8.438,1.527,11.446,4.579c3.051,3.052,4.578,6.89,4.578,11.511C83.167,34.003,83.113,34.952,83.003,35.933z M76.757,23.473c-2.572-2.572-5.777-3.859-9.614-3.859s-7.042,1.287-9.615,3.859c-2.573,2.573-3.859,5.778-3.859,9.615c0,3.663,1.286,6.825,3.859,9.484c2.528,2.616,5.733,3.924,9.615,3.924c3.794,0,6.976-1.285,9.55-3.858c2.572-2.572,3.858-5.756,3.858-9.549C80.551,29.207,79.287,26.002,76.757,23.473L76.757,23.473z",
                translateX: this.$chart.width() - 125,
                translateY: 7,
                scaleX: .25,
                scaleY: .25,
                fill: "#DDDADA",
                zIndex: 1e3
            }).add(this.credit), this.highchart.renderer.path({
                d: "M119.047,37.056c-2.928,2.928-4.392,6.6-4.392,11.016c0,4.418,1.464,8.09,4.392,11.016c2.927,2.93,6.599,4.393,11.016,4.393c3.359,0,6.383-0.887,9.072-2.664v-3.672c-2.592,2.305-5.616,3.455-9.072,3.455c-3.648,0-6.649-1.174-9-3.527c-2.353-2.352-3.528-5.352-3.528-9c0-3.695,1.175-6.719,3.528-9.072c2.304-2.305,5.303-3.455,9-3.455c1.631,0,3.359,0.312,5.184,0.937l2.016,1.08l1.872,1.225v-3.529c-2.257-1.728-5.281-2.592-9.072-2.592C125.646,32.664,121.974,34.128,119.047,37.056z M146.333,62.904h2.88V9.625h-2.88V62.904z M172.47,32.664c-4.32,0-7.945,1.512-10.872,4.537c-2.977,2.977-4.464,6.6-4.464,10.871c0,4.32,1.487,7.969,4.464,10.943c2.927,2.93,6.552,4.393,10.872,4.393s7.967-1.486,10.944-4.463c2.927-2.928,4.392-6.553,4.392-10.873c0-4.32-1.488-7.967-4.464-10.943C180.365,34.152,176.741,32.664,172.47,32.664z M181.253,56.928c-2.4,2.402-5.328,3.602-8.784,3.602c-3.409,0-6.336-1.225-8.784-3.672c-2.448-2.449-3.672-5.377-3.672-8.785c0-3.359,1.248-6.287,3.744-8.783c2.448-2.496,5.352-3.744,8.712-3.744c3.503,0,6.455,1.223,8.856,3.672c2.399,2.4,3.6,5.352,3.6,8.855C184.926,51.529,183.701,54.479,181.253,56.928z M214.157,51.744c0,5.904-2.761,8.855-8.28,8.855c-2.833,0-4.896-0.766-6.192-2.303c-1.249-1.535-1.872-3.719-1.872-6.553V33.167h-2.952v18.576c0,3.697,0.96,6.576,2.88,8.641c1.919,2.064,4.631,3.096,8.136,3.096c3.552,0,6.312-1.055,8.28-3.168c1.919-2.062,2.88-4.92,2.88-8.568V33.167h-2.88V51.744z M251.884,38.568c-3.312-3.888-7.345-5.832-12.096-5.832c-4.32,0-7.968,1.488-10.944,4.465c-2.929,2.928-4.392,6.551-4.392,10.871c0,4.32,1.487,7.969,4.464,10.943c2.927,2.93,6.552,4.393,10.872,4.393c4.896,0,8.928-1.943,12.096-5.832v5.328h2.953V9.625h-2.953V38.568z M248.57,56.928c-2.399,2.402-5.328,3.602-8.784,3.602c-3.409,0-6.336-1.225-8.784-3.672c-2.448-2.449-3.672-5.377-3.672-8.785c0-3.455,1.224-6.408,3.672-8.855c2.4-2.4,5.328-3.6,8.784-3.6c3.408,0,6.336,1.223,8.784,3.672c2.448,2.447,3.671,5.375,3.671,8.783C252.242,51.529,251.019,54.479,248.57,56.928z M278.738,11.137c-5.088,0-9.312,1.681-12.672,5.039c-3.358,3.361-5.039,7.586-5.039,12.673c0,5.089,1.681,9.312,5.039,12.671c3.359,3.312,7.584,4.969,12.672,4.969l3.24-0.287l3.096-0.865l3.025-1.512l-10.225,18.504l2.735,1.297l12.814-22.969c0.479-0.863,0.899-1.738,1.262-2.629c0.359-0.887,0.658-1.811,0.898-2.771c0.289-1.104,0.491-2.195,0.612-3.275c0.119-1.08,0.181-2.124,0.181-3.132c0-5.087-1.683-9.312-5.041-12.673C288.027,12.817,283.826,11.137,278.738,11.137z M289.25,39.361c-2.832,2.832-6.336,4.248-10.513,4.248c-4.271,0-7.801-1.441-10.584-4.32c-2.832-2.928-4.248-6.408-4.248-10.44c0-4.224,1.416-7.751,4.248-10.584c2.832-2.831,6.359-4.248,10.584-4.248c4.226,0,7.752,1.417,10.584,4.248c2.783,2.784,4.177,6.312,4.177,10.584C293.498,33.024,292.082,36.529,289.25,39.361z M307.322,20.137h-2.951v13.031h-4.033v2.953h4.033v26.783h2.951V36.121h6.912v-2.953h-6.912V20.137z M329.57,32.808c-1.199,0-2.303,0.457-3.312,1.367c-1.008,0.913-1.824,1.921-2.447,3.025v-4.033h-2.951v29.736h2.951V43.319c0-0.768,0.156-1.607,0.469-2.52c0.312-0.912,0.73-1.74,1.262-2.484c0.525-0.744,1.15-1.367,1.871-1.873c0.721-0.503,1.486-0.755,2.305-0.755c0.959,0,1.871,0.169,2.736,0.504c0.861,0.337,1.68,0.792,2.445,1.368l1.584-2.448c-1.197-0.864-2.277-1.464-3.238-1.8C332.281,32.975,331.059,32.808,329.57,32.808z M366.723,38.351c-3.168-3.743-7.127-5.615-11.879-5.615c-4.32,0-7.969,1.488-10.945,4.465c-2.928,2.928-4.391,6.551-4.391,10.871c0,4.32,1.486,7.969,4.463,10.943c2.928,2.93,6.553,4.393,10.873,4.393c4.799,0,8.758-1.871,11.879-5.615v5.111h2.953V33.167h-2.953V38.351z M363.627,56.928c-2.4,2.402-5.328,3.602-8.783,3.602c-3.41,0-6.336-1.225-8.785-3.672c-2.447-2.449-3.672-5.377-3.672-8.785c0-3.455,1.225-6.408,3.672-8.855c2.4-2.4,5.328-3.6,8.785-3.6c3.406,0,6.336,1.223,8.783,3.672c2.449,2.447,3.672,5.375,3.672,8.783C367.299,51.529,366.076,54.479,363.627,56.928z M404.234,38.568c-3.312-3.888-7.344-5.832-12.096-5.832c-4.32,0-7.969,1.488-10.943,4.465c-2.93,2.928-4.393,6.551-4.393,10.871c0,4.32,1.486,7.969,4.465,10.943c2.926,2.93,6.551,4.393,10.871,4.393c4.896,0,8.928-1.943,12.096-5.832v5.328h2.953V9.625h-2.953V38.568z M400.922,56.928c-2.4,2.402-5.326,3.602-8.783,3.602c-3.408,0-6.336-1.225-8.783-3.672c-2.449-2.449-3.672-5.377-3.672-8.785c0-3.455,1.223-6.408,3.672-8.855c2.398-2.4,5.328-3.6,8.783-3.6c3.408,0,6.336,1.223,8.783,3.672c2.449,2.447,3.674,5.375,3.674,8.783C404.596,51.529,403.371,54.479,400.922,56.928z M440.018,36.767c-2.879-2.734-6.527-4.104-10.943-4.104c-4.463,0-8.16,1.465-11.088,4.393c-2.881,2.879-4.32,6.553-4.32,11.016c0,4.418,1.465,8.09,4.393,11.016c2.879,2.93,6.553,4.393,11.018,4.393c1.871,0,3.553-0.24,5.039-0.721c3.889-1.246,6.77-3.646,8.641-7.199l-2.664-1.225c-1.631,2.641-3.48,4.393-5.543,5.256c-1.633,0.674-3.457,1.008-5.473,1.008c-3.938,0-7.031-1.199-9.287-3.6c-2.16-2.352-3.24-5.543-3.24-9.576h27.863C444.41,43.056,442.945,39.503,440.018,36.767z M429.074,35.544c2.928,0,5.52,0.816,7.775,2.447c2.352,1.682,3.768,3.889,4.248,6.625h-24.119C418.898,38.568,422.93,35.544,429.074,35.544z M463.635,33.312c-0.961-0.336-2.186-0.504-3.674-0.504c-1.199,0-2.303,0.457-3.312,1.367c-1.008,0.913-1.824,1.921-2.447,3.025v-4.033h-2.951v29.736h2.951V43.319c0-0.768,0.154-1.607,0.469-2.52c0.311-0.912,0.729-1.74,1.26-2.484c0.527-0.744,1.152-1.367,1.873-1.873c0.719-0.503,1.486-0.755,2.303-0.755c0.961,0,1.873,0.169,2.736,0.504c0.863,0.337,1.68,0.792,2.447,1.368l1.584-2.448C465.674,34.248,464.594,33.648,463.635,33.312z",
                translateX: this.$chart.width() - 125,
                translateY: 7,
                scaleX: .25,
                scaleY: .25,
                fill: "#000",
                zIndex: 999
            }).add(this.credit))
        },
        hideCredit: function() {
            this.credit && this.credit.hide()
        },
        tearDown: function() {
            clearTimeout(this.redrawTimeout);
            if (this.highchart) {
                this.options.dataSeries.forEach(function(e) {
                    this.removeSeriesListeners(e.series)
                }, this);
                try {
                    this.highchart.destroy()
                } catch (e) {
                    console.log(e)
                }
            }
            this.stopListening(), this.remove()
        },
        defaultConfig: {
            credits: {
                enabled: !1
            },
            chart: {
                alignTicks: !0,
                animation: !1,
                height: 200,
                margin: [0, 5, 0, 5],
                resetZoomButton: {
                    theme: {
                        display: "none"
                    }
                },
                spacing: [0, 0, 0, 0]
            },
            colors: s,
            exporting: {
                enabled: !1
            },
            navigator: {
                series: {
                    gapSize: 10,
                    lineWidth: 1,
                    lineColor: "#b7c5d5",
                    fillColor: "#cad5e2"
                },
                margin: 0,
                handles: {
                    backgroundColor: "#FFF",
                    borderColor: "#5d7694"
                },
                maskFill: "rgba(255,255,255,0.7)",
                maskInside: !1,
                outlineColor: "#5d7694",
                outlineWidth: 1.5,
                xAxis: {
                    id: "nav-x-axis",
                    gridLineWidth: 0,
                    tickPixelInterval: 300,
                    labels: {
                        enabled: !1
                    },
                    dateTimeLabelFormats: {
                        hour: "%l%P",
                        day: "%b %e",
                        week: "%b %e"
                    }
                }
            },
            plotOptions: {
                series: {
                    connectNulls: !1,
                    gapSize: 10,
                    lineWidth: 1,
                    marker: {
                        lineColor: null,
                        states: {
                            hover: {
                                radius: 3
                            }
                        }
                    },
                    states: {
                        hover: {
                            lineWidth: 1,
                            halo: !1
                        }
                    }
                },
                spline: {
                    gapSize: 10
                },
                line: {
                    gapSize: 10
                },
                candlestick: {
                    pointPlacement: -0.5
                },
                column: {
                    pointPlacement: -0.5
                }
            },
            rangeSelector: {
                enabled: !1
            },
            scrollbar: {
                enabled: !1
            },
            series: [],
            tooltip: {
                valueDecimals: 5,
                borderRadius: 0,
                borderWidth: 0,
                shadow: !1,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                positioner: function(e, t, n, r) {
                    var i = r.plotX - t - 5;
                    return i < 0 && (i = r.plotX + 12), {
                        x: i,
                        y: e
                    }
                },
                xDateFormat: "%A, %b %e %Y, %H:%M"
            },
            xAxis: [{
                id: "x-axis-candlestick",
                lineColor: "#DDD",
                tickColor: "#DDD",
                ordinal: !0,
                labels: {
                    y: -8
                },
                tickPosition: "inside",
                dateTimeLabelFormats: {
                    hour: "%l%P",
                    day: "%b %e",
                    week: "%b %e"
                }
            }, {
                id: "x-axis-spline",
                ordinal: !0,
                labels: {
                    enabled: !1
                },
                lineWidth: 0,
                tickWidth: 0,
                tickPosition: "inside",
                linkedTo: 0
            }],
            yAxis: []
        }
    });
    return u
}), define("components/charts/PriceIntervalSeries", ["jquery", "./Series", "price", "utils", "registry"], function(e, t, n, r, i) {
    function s(e) {
        var t = i.get("instruments");
        this.options = e, e.dataSettings.start || (e.dataSettings.period ? e.dataSettings.start = new Date((e.dataSettings.end || new Date) - e.dataSettings.period * 864e5) : e.dataSettings.periods && (e.dataSettings.start = new Date((e.dataSettings.end || new Date) - e.dataSettings.periods * this.getIntervalMs()))), t.isSynced() || (this.configReady = !1, this.listenToOnce(t, "sync", this.onInstrumentsSync)), this.collection = new n.Intervals(e.data, e.dataSettings), this.listenTo(this.collection, "sync", this.onDataFetched), this.listenTo(this.collection, "error", this.onDataFetchError), this.listenTo(this.collection, "update", this.onIntervalUpdate), this.listenTo(this.collection, "new", this.onNewInterval), e.data ? this.dataLoaded = !0 : this.collection.fetch()
    }
    return s.prototype = new t, s.prototype.onInstrumentsSync = function() {
        this.configReady = !0, this.trigger("config-ready")
    }, s.prototype.onDataFetched = function(e, t, n) {
        var r;
        n && n.xhr && n.xhr.status === 206 && t && t.length && (r = new Date(t[0].time)), this.dataLoaded = !0, this.trigger("data-fetched", this, r)
    }, s.prototype.onDataFetchError = function() {
        this.dataErrored = !0, this.trigger("data-fetch-error", this)
    }, s.prototype.getChartConfig = function() {
        var t = e.extend({
            type: "candlestick",
            allowDecimals: !0,
            data: this.collection.getChartData(this.options.dataSettings.side),
            dataLoaded: this.dataLoaded,
            dataErrored: this.dataErrored,
            lineWidth: this.options.lineWidth || 1,
            dataGrouping: {
                enabled: !0,
                units: [
                    ["second", [5, 15, 30]],
                    ["minute", [1, 2, 5, 10, 15, 30]],
                    ["hour", [1, 4, 8, 12]],
                    ["day", [1]],
                    ["week", [1]]
                ]
            },
            marker: {
                symbol: "circle"
            },
            tooltip: {
                valueDecimals: this.getInstrument().get("precision"),
                valuePrefix: this.options.prefix ? this.options.prefix + " " : null
            },
            states: {
                hover: {
                    lineWidth: this.options.lineWidth || 1
                }
            },
            color: "#2f7ed8",
            lineColor: "#2f7ed8",
            upLineColor: "silver",
            upColor: "silver",
            zIndex: 20,
            groupPadding: .1,
            pointPadding: .1,
            pointPlacement: "between"
        }, this.options);
        return t
    }, s.prototype.getTitle = function() {
        return this.options.dataSettings.symbol
    }, s.prototype.getIntervalMs = function() {
        return r.config.intervals[this.options.dataSettings.interval].ms
    }, s.prototype.getSettings = function() {
        return this.options.dataSettings
    }, s.prototype.getInstrument = function() {
        return this.instrument ? this.instrument : (this.instrument = i.get("instruments").get(this.options.dataSettings.instrumentId), this.instrument)
    }, s.prototype.onIntervalUpdate = function(e) {
        var t = e.getChartData(this.options.dataSettings.side);
        this.trigger("update-last", t, !0)
    }, s.prototype.onNewInterval = function(e) {
        this.trigger("add", e.getChartData(this.options.dataSettings.side))
    }, s.prototype.changeSide = function(e) {
        this.options.dataSettings.side = this.options.dataSettings.side, this.trigger("refresh", this.collection.getChartData(e))
    }, s.prototype.tearDown = function() {
        this.collection.tearDown(), this.stopListening()
    }, s
}), define("components/charts/PriceTickSeries", ["jquery", "./Series", "registry"], function(e, t, n) {
    function r(e, t) {
        var r = n.get("instruments");
        this.ticks = e, this.options = t, this.ticks.on("tick-" + t.side, this._addPoint, this), r.isSynced() || (this.configReady = !1, this.listenToOnce(r, "sync", this.onInstrumentsSync))
    }
    return r.prototype = new t, r.prototype.onInstrumentsSync = function() {
        this.configReady = !0, this.trigger("config-ready")
    }, r.prototype.getChartConfig = function() {
        var t = e.extend({
            dataLoaded: !0,
            allowDecimals: !0,
            type: "line",
            data: this.ticks.getChartData(this.options.side),
            dataGrouping: {
                enabled: !0
            },
            dataSettings: this.ticks.options.settings,
            lineWidth: 0,
            marker: {
                enabled: !0,
                symbol: "cross",
                lineWidth: 1,
                states: {
                    hover: {
                        symbol: "circle",
                        lineWidth: 6,
                        radius: 3
                    }
                }
            },
            states: {
                hover: {
                    enabled: !1
                }
            },
            tooltip: {
                valueDecimals: this.getInstrument().get("precision")
            },
            zIndex: 30
        }, this.options.chartConfig);
        return t
    }, r.prototype._addPoint = function(e) {
        this.trigger("add", e, !0)
    }, r.prototype.getInstrument = function() {
        return this.instrument ? this.instrument : (this.instrument = n.get("instruments").get(this.options.instrumentId), this.instrument)
    }, r.prototype.tearDown = function() {
        this.ticks.off(null, null, this), this.ticks.tearDown()
    }, r
}), define("components/charts/PriceLine", ["registry"], function(e) {
    function t(e, t) {
        this.subscribe(e), this.side = t
    }
    return t.prototype.subscribe = function(t) {
        this.instrument = e.get("instruments").get(t);
        if (!this.instrument) return e.get("instruments").once("sync", this.subscribe.bind(this, t), this);
        this.instrument.on("tick", this.onTick, this)
    }, t.prototype.setYAxis = function(e) {
        this.axis = e, this.pendingTick && (this.onTick(this.pendingTick), delete this.pendingTick)
    }, t.prototype.onTick = function(e) {
        var t = e.get("price"),
            n;
        if (this.axis) {
            this.lastPrice && (t === this.lastPrice ? n = 0 : n = t > this.lastPrice ? 1 : -1), n === 0 && (n = this.lastDirection);
            try {
                this.axis.removePlotBand("spread"), this.axis.addPlotBand({
                    id: "spread",
                    from: e.get("bid"),
                    to: e.get("ask"),
                    color: n ? n === 1 ? "rgba(31,178,59,0.1)" : "rgba(169,20,0,0.1)" : "rgba(74,114,167,0.1)",
                    zIndex: 2
                }), this.axis.removePlotLine("price"), this.axis.addPlotLine({
                    id: "price",
                    value: e.get(this.side || "price"),
                    width: 1,
                    label: {
                        text: e.get("formattedPrice", this.side),
                        align: "center",
                        useHTML: !0,
                        style: {
                            fontSize: "11px"
                        },
                        verticalAlign: "bottom",
                        y: -4
                    },
                    color: n ? n === 1 ? "#1fb265" : "#a60909" : "#4a72a7",
                    zIndex: 35
                })
            } catch (r) {
                console.error(r)
            }
        } else this.pendingTick = e;
        this.lastPrice = t, this.lastDirection = n
    }, t.prototype.tearDown = function() {
        this.instrument.off("tick", this.onTick, this)
    }, t
}), define("components/charts/PositionsSeriess", ["backbone", "./LineSeries", "./TimeData", "registry"], function(e, t, n, r) {
    function i(e) {
        this.chart = e.chart, this.instrumentId = e.instrumentId, this.positions = e.positions, this.$maxWarning = e.$maxWarning, this.maxInView = e.maxInView, this.seriess = [], this.positions === !0 ? this.setUpWithGlobalPositions() : this.setUpWithSuppliedPositions(), this.chart.once("ready", this.onChartReady, this), this.chart.on("scroll", this._onChartScroll, this)
    }
    return i.prototype.setUpWithGlobalPositions = function() {
        var t = r.get("open-positions"),
            n = r.get("closed-positions");
        if (!n.isSynced()) return n.once("sync", this.setUpWithGlobalPositions, this);
        this.positions = new e.Collection, this.positions.add(r.get("open-positions").where({
            instrumentId: this.instrumentId
        })), this.positions.add(r.get("closed-positions").where({
            instrumentId: this.instrumentId
        })), this.addPositions(this.positions), t.on("opened", this.onPositionOpened, this), t.on("closed", this.onPositionClosed, this)
    }, i.prototype.setUpWithSuppliedPositions = function() {
        this.positions.on("opened", this.onPositionOpened, this), this.positions.on("closed", this.onPositionClosed, this), this.positions.isSynced() ? this.addPositions(this.positions) : this.positions.once("sync", this.addPositions.bind(this, this.positions), this)
    }, i.prototype.addPositions = function(e) {
        this.getPositionsSeries(e).forEach(this.addPositionSeries, this)
    }, i.prototype.getPositionsSeries = function(e) {
        var t = [];
        return e.each(function(e) {
            if (e.get("instrumentId") !== this.instrumentId) return;
            t.push(this.getOpenMarker(e)), e.get("status") === "Closed" && (t.push(this.getPositionLine(e)), t.push(this.getCloseMarker(e)))
        }, this), t
    }, i.prototype.addPositionSeries = function(e) {
        this.seriess.push(e), this.chart.addSeries(e)
    }, i.prototype.onChartReady = function() {
        this.queuedSeries && this.queuedSeries.forEach(this.addPositionSeries, this)
    }, i.prototype.onPositionOpened = function(e) {
        var t;
        if (e.get("instrumentId") !== this.instrumentId) return;
        t = this.getOpenMarker(e), this.chart && this.chart.isReady() ? this.addPositionSeries(t) : (this.queuedSeries = this.queuedSeries || [], this.queuedSeries.push(t))
    }, i.prototype.onPositionClosed = function(e) {
        var t, n;
        if (e.get("instrumentId") !== this.instrumentId) return;
        if (!this.openMarkers) return console.warn("No chart positions markers set");
        if (!this.openMarkers[e.id]) return console.warn("No chart marker found for position", e.id);
        this.openMarkers[e.id].update({
            color: e.get("profit") > 0 ? "#8BBC21" : "#a60909",
            marker: {
                symbol: e.get("direction") === "LONG" ? e.get("profit") > 0 ? "url(/" + window.bootstrap.version + "/images/profit-buy.png)" : "url(/" + window.bootstrap.version + "/images/loss-buy.png)" : e.get("profit") > 0 ? "url(/" + window.bootstrap.version + "/images/profit-sell.png)" : "url(/" + window.bootstrap.version + "/images/loss-sell.png)"
            }
        }), t = this.getCloseMarker(e), n = this.getPositionLine(e), this.chart && this.chart.isReady() ? (this.addPositionSeries(t), this.addPositionSeries(n)) : (this.queuedSeries = this.queuedSeries || [], this.queuedSeries.push(t), this.queuedSeries.push(n))
    }, i.prototype.getOpenMarker = function(e) {
        var r = "#d99b15",
            i = e.get("direction") === "LONG" ? "url(/" + window.bootstrap.version + "/images/open-buy.png)" : "url(/" + window.bootstrap.version + "/images/open-sell.png)";
        return e.get("status") === "Closed" && (r = e.get("profit") > 0 ? "#8BBC21" : "#a60909", i = e.get("direction") === "LONG" ? e.get("profit") > 0 ? "url(/" + window.bootstrap.version + "/images/profit-buy.png)" : "url(/" + window.bootstrap.version + "/images/loss-buy.png)" : e.get("profit") > 0 ? "url(/" + window.bootstrap.version + "/images/profit-sell.png)" : "url(/" + window.bootstrap.version + "/images/loss-sell.png)"), this.openMarkers = this.openMarkers || {}, this.openMarkers[e.id] = new t(new n([
            [e.get("openTime").getTime(), e.get("openPrice")]
        ]), {
            name: e.get("brokerId") + " Open " + e.get("direction"),
            color: r,
            marker: {
                enabled: !0,
                symbol: i
            },
            tooltip: {
                pointFormatter: function() {
                    return e.get("tooltip")
                }
            }
        }), this.openMarkers[e.id]
    }, i.prototype.getCloseMarker = function(e) {
        return new t(new n([
            [e.get("closeTime").getTime(), e.get("closePrice")]
        ]), {
            name: "Close " + e.get("direction"),
            color: e.get("profit") > 0 ? "#8BBC21" : "#a60909",
            marker: {
                enabled: !0,
                symbol: "circle",
                radius: 3
            },
            tooltip: {
                pointFormatter: function() {
                    return e.get("tooltip")
                }
            },
            zIndex: 41
        })
    }, i.prototype.getPositionLine = function(e) {
        return new t(new n([
            [e.get("openTime").getTime(), e.get("openPrice")],
            [e.get("closeTime").getTime(), e.get("closePrice")]
        ]), {
            name: e.get("direction"),
            color: e.get("profit") > 0 ? "#8BBC21" : "#a60909",
            enableMouseTracking: !1,
            zIndex: 40
        })
    }, i.prototype._onChartScroll = function(e, t) {
        var n = [];
        if (this.positions === !0) return;
        this.positions.forEach(function(r) {
            var i = r.get("openTime"),
                s = r.get("closeTime");
            (i > e && i < t || s > e && s < t) && n.push(r)
        }), n.length > this.maxInView ? (this.$maxWarning.html('<i class="fa fa-warning"></i> ' + n.length + " positions in chart range (max display " + this.maxInView + "). Zoom in to view."), this.hidePositions()) : (this.$maxWarning.empty(), this.showPositions())
    }, i.prototype.hidePositions = function() {
        if (this.visible === !1) return;
        this.seriess.forEach(function(e) {
            e.hide()
        }), this.visible = !1
    }, i.prototype.showPositions = function() {
        if (this.visible === !0) return;
        this.seriess.forEach(function(e) {
            e.show()
        }), this.visible = !0
    }, i.prototype.tearDown = function() {
        r.get("open-positions").off("opened", this.onPositionOpened, this), r.get("open-positions").off("closed", this.onPositionClosed, this), this.positions.off && (this.positions.off("opened", this.onPositionOpened, this), this.positions.off("closed", this.onPositionClosed, this)), this.chart && this.chart.off("ready", this.onChartReady, this)
    }, i
}), define("controls/Checkbox", ["jquery", "backbone"], function(e, t) {
    function n(t) {
        this.$el = t.$el ? t.$el.addClass("c9t-checkbox-control") : e("<div>", {
            "class": "c9t-checkbox-control"
        }), t.label && this.$el.append('<label for="' + t.id + '">' + t.label + "</label>"), this.$container = e("<div>", {
            "class": "c9t-checkbox-container"
        }), this.$el.append(this.$container), this.$checkbox = e('<input type="checkbox" id="' + t.id + '" name="' + t.id + '">'), this.$checkbox.prop("checked", t.checked || !1), this.duration = 200, this.onLabelText = t.onLabel || "On", this.offLabelText = t.offLabel || "Off", this.onChange = t.onChange, this.boundMove = this.onMove.bind(this), this.boundUp = this.onUp.bind(this), setTimeout(function() {
            this.render(), this.bindEvents(), this.position()
        }.bind(this), 0)
    }
    return n.prototype = Object.create(t.Events), n.prototype.onShow = function() {
        setTimeout(function() {
            this.render(), this.bindEvents(), this.position()
        }.bind(this), 0)
    }, n.prototype.render = function() {
        this.$container.empty(), this.offLabel = e('<label class="c9t-checkbox-label-off"><span>' + this.offLabelText + "</span></label>").appendTo(this.$container), this.offSpan = this.offLabel.children("span"), this.onLabel = e('<label class="c9t-checkbox-label-on"><span>' + this.onLabelText + "</span></label>").appendTo(this.$container), this.onSpan = this.onLabel.children("span"), this.handle = e("<div>", {
            "class": "c9t-checkbox-handle"
        }).appendTo(this.$container)
    }, n.prototype.bindEvents = function() {
        this.$checkbox.change(this.refresh.bind(this)), this.$container.bind("mousedown", this.onMouseDown.bind(this))
    }, n.prototype.position = function() {
        var e = this.$container.width();
        this.offLabel.css("width", e), this.handleWidth = this.handle.outerWidth(!0), this.rightWidth = e - this.handleWidth / 2, this.$checkbox.is(":checked") ? (this.handle.css("left", this.rightWidth - this.handleWidth / 2), this.onLabel.css("width", this.rightWidth), this.offSpan.css("marginRight", -this.rightWidth)) : (this.onLabel.css("width", this.handleWidth / 2), this.onSpan.css("marginLeft", -this.rightWidth)), this.isDisabled() && this.$container.addClass("c9t-checkbox-disabled")
    }, n.prototype.val = function(e) {
        if (typeof e == "undefined") return this.$checkbox.prop("checked");
        this.$checkbox.prop("checked", e)
    }, n.prototype.onMouseDown = function(t) {
        var n;
        t.preventDefault();
        if (this.isDisabled()) return;
        e(document).bind("mousemove", this.boundMove), e(document).bind("mouseup", this.boundUp), n = t.pageX || t.originalEvent.changedTouches[0].pageX, this.isClicking = this.handle, this.dragStartPosition = n, this.handleLeftOffset = parseInt(this.handle.css("left"), 10) || 0
    }, n.prototype.onMove = function(e) {
        var t, n = 5;
        if (!!this.isDisabled() || !this.isClicking) return;
        e.preventDefault(), t = e.pageX || 0, !this.isDragging && Math.abs(this.dragStartPosition - t) > n && (this.isDragging = !0), this.drag(e, t)
    }, n.prototype.onUp = function(t) {
        var n;
        if (!this.isClicking) return;
        e(document).unbind("mousemove", this.boundMove), e(document).unbind("mouseup", this.boundUp), t.preventDefault(), n = t.pageX || 0, this.onDragEnd(t, n)
    }, n.prototype.drag = function(e, t) {
        var n, r;
        if (this.isClicking !== this.handle) return;
        return r = (t + this.handleLeftOffset - this.dragStartPosition) / (this.rightWidth - this.handleWidth / 2), r < 0 && (r = 0), r > 1 && (r = 1), n = r * (this.rightWidth - this.handleWidth / 2), this.handle.css("left", n), this.onLabel.css("width", n + this.handleWidth / 2), this.offSpan.css("marginRight", -n), this.onSpan.css("marginLeft", -(1 - r) * (this.rightWidth - this.handleWidth / 2)), !0
    }, n.prototype.onDragEnd = function(e, t) {
        var n;
        if (this.isClicking !== this.handle) return;
        if (this.isDisabled()) return;
        return this.isDragging ? (n = (t - this.dragStartPosition) / this.rightWidth, this.$checkbox.prop("checked", n >= .5)) : this.$checkbox.prop("checked", !this.$checkbox.prop("checked")), this.isClicking = null, this.isDragging = null, this.hasChanged()
    }, n.prototype.refresh = function() {
        return this.hasChanged()
    }, n.prototype.hasChanged = function() {
        var e, t = this.$checkbox.prop("checked");
        return this.onChange && this.onChange(t), this.trigger("change", t), this.isDisabled() ? (this.$container.addClass("c9t-checkbox-disabled"), !1) : (this.$container.removeClass("c9t-checkbox-disabled"), e = t ? this.rightWidth : this.handleWidth / 2, this.handle.animate({
            left: e - this.handleWidth / 2
        }, this.duration), this.onLabel.animate({
            width: e
        }, this.duration), this.offSpan.animate({
            marginRight: -e + this.handleWidth / 2
        }, this.duration), this.onSpan.animate({
            marginLeft: e - this.rightWidth
        }, this.duration), !0)
    }, n.prototype.isDisabled = function() {
        return this.$checkbox.is(":disabled")
    }, n
}), define("bootstrap.datepicker", ["jquery"], function(e) {
    (function(e) {
        function n() {
            return new Date(Date.UTC.apply(Date, arguments))
        }

        function r() {
            var e = new Date;
            return n(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())
        }

        function o(t, n) {
            var r = e(t).data(),
                i = {},
                s, o = new RegExp("^" + n.toLowerCase() + "([A-Z])"),
                n = new RegExp("^" + n.toLowerCase());
            for (var u in r) n.test(u) && (s = u.replace(o, function(e, t) {
                return t.toLowerCase()
            }), i[s] = r[u]);
            return i
        }

        function u(t) {
            var n = {};
            if (!c[t]) {
                t = t.split("-")[0];
                if (!c[t]) return
            }
            var r = c[t];
            return e.each(l, function(e, t) {
                t in r && (n[t] = r[t])
            }), n
        }
        var t = e(window),
            i = function(t, n) {
                var r = this;
                this._process_options(n), this.element = e(t), this.isInline = !1, this.isInput = this.element.is("input"), this.component = this.element.is(".date") ? this.element.find(".add-on, .btn") : !1, this.hasInput = this.component && this.element.find("input").length, this.component && this.component.length === 0 && (this.component = !1), this.picker = e(h.template), this._buildEvents(), this._attachEvents(), this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"), this.o.rtl && (this.picker.addClass("datepicker-rtl"), this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")), this.viewMode = this.o.startView, this.o.calendarWeeks && this.picker.find("tfoot th.today").attr("colspan", function(e, t) {
                    return parseInt(t) + 1
                }), this._allow_update = !1, this.setStartDate(this._o.startDate), this.setEndDate(this._o.endDate), this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled), this.fillDow(), this.fillMonths(), this._allow_update = !0, this.update(), this.showMode(), this.isInline && this.show()
            };
        i.prototype = {
            constructor: i,
            _process_options: function(t) {
                this._o = e.extend({}, this._o, t);
                var n = this.o = e.extend({}, this._o),
                    r = n.language;
                c[r] || (r = r.split("-")[0], c[r] || (r = f.language)), n.language = r;
                switch (n.startView) {
                    case 2:
                    case "decade":
                        n.startView = 2;
                        break;
                    case 1:
                    case "year":
                        n.startView = 1;
                        break;
                    default:
                        n.startView = 0
                }
                switch (n.minViewMode) {
                    case 1:
                    case "months":
                        n.minViewMode = 1;
                        break;
                    case 2:
                    case "years":
                        n.minViewMode = 2;
                        break;
                    default:
                        n.minViewMode = 0
                }
                n.startView = Math.max(n.startView, n.minViewMode), n.weekStart %= 7, n.weekEnd = (n.weekStart + 6) % 7;
                var i = h.parseFormat(n.format);
                n.startDate !== -Infinity && (n.startDate ? n.startDate instanceof Date ? n.startDate = this._local_to_utc(this._zero_time(n.startDate)) : n.startDate = h.parseDate(n.startDate, i, n.language) : n.startDate = -Infinity), n.endDate !== Infinity && (n.endDate ? n.endDate instanceof Date ? n.endDate = this._local_to_utc(this._zero_time(n.endDate)) : n.endDate = h.parseDate(n.endDate, i, n.language) : n.endDate = Infinity), n.daysOfWeekDisabled = n.daysOfWeekDisabled || [], e.isArray(n.daysOfWeekDisabled) || (n.daysOfWeekDisabled = n.daysOfWeekDisabled.split(/[,\s]*/)), n.daysOfWeekDisabled = e.map(n.daysOfWeekDisabled, function(e) {
                    return parseInt(e, 10)
                });
                var s = String(n.orientation).toLowerCase().split(/\s+/g),
                    o = n.orientation.toLowerCase();
                s = e.grep(s, function(e) {
                    return /^auto|left|right|top|bottom$/.test(e)
                }), n.orientation = {
                    x: "auto",
                    y: "auto"
                };
                if (!!o && o !== "auto")
                    if (s.length === 1) switch (s[0]) {
                        case "top":
                        case "bottom":
                            n.orientation.y = s[0];
                            break;
                        case "left":
                        case "right":
                            n.orientation.x = s[0]
                    } else o = e.grep(s, function(e) {
                        return /^left|right$/.test(e)
                    }), n.orientation.x = o[0] || "auto", o = e.grep(s, function(e) {
                        return /^top|bottom$/.test(e)
                    }), n.orientation.y = o[0] || "auto"
            },
            _events: [],
            _secondaryEvents: [],
            _applyEvents: function(e) {
                for (var t = 0, n, r; t < e.length; t++) n = e[t][0], r = e[t][1], n.on(r)
            },
            _unapplyEvents: function(e) {
                for (var t = 0, n, r; t < e.length; t++) n = e[t][0], r = e[t][1], n.off(r)
            },
            _buildEvents: function() {
                this.isInput ? this._events = [
                    [this.element, {
                        focus: e.proxy(this.show, this),
                        keyup: e.proxy(this.update, this),
                        keydown: e.proxy(this.keydown, this)
                    }]
                ] : this.component && this.hasInput ? this._events = [
                    [this.element.find("input"), {
                        focus: e.proxy(this.show, this),
                        keyup: e.proxy(this.update, this),
                        keydown: e.proxy(this.keydown, this)
                    }],
                    [this.component, {
                        click: e.proxy(this.show, this)
                    }]
                ] : this.element.is("div") ? this.isInline = !0 : this._events = [
                    [this.element, {
                        click: e.proxy(this.show, this)
                    }]
                ], this._secondaryEvents = [
                    [this.picker, {
                        click: e.proxy(this.click, this)
                    }],
                    [e(window), {
                        resize: e.proxy(this.place, this)
                    }],
                    [e(document), {
                        "mousedown touchstart": e.proxy(function(e) {
                            this.element.is(e.target) || this.element.find(e.target).length || this.picker.is(e.target) || this.picker.find(e.target).length || this.hide()
                        }, this)
                    }]
                ]
            },
            _attachEvents: function() {
                this._detachEvents(), this._applyEvents(this._events)
            },
            _detachEvents: function() {
                this._unapplyEvents(this._events)
            },
            _attachSecondaryEvents: function() {
                this._detachSecondaryEvents(), this._applyEvents(this._secondaryEvents)
            },
            _detachSecondaryEvents: function() {
                this._unapplyEvents(this._secondaryEvents)
            },
            _trigger: function(t, n) {
                var r = n || this.date,
                    i = this._utc_to_local(r);
                this.element.trigger({
                    type: t,
                    date: i,
                    format: e.proxy(function(e) {
                        var t = e || this.o.format;
                        return h.formatDate(r, t, this.o.language)
                    }, this)
                })
            },
            show: function(e) {
                this.isInline || this.picker.appendTo("body"), this.picker.show(), this.height = this.component ? this.component.outerHeight() : this.element.outerHeight(), this.place(), this._attachSecondaryEvents(), e && e.preventDefault(), this._trigger("show")
            },
            hide: function(e) {
                if (this.isInline) return;
                if (!this.picker.is(":visible")) return;
                this.picker.hide().detach(), this._detachSecondaryEvents(), this.viewMode = this.o.startView, this.showMode(), this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue(), this._trigger("hide")
            },
            remove: function() {
                this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date
            },
            _utc_to_local: function(e) {
                return new Date(e.getTime() + e.getTimezoneOffset() * 6e4)
            },
            _local_to_utc: function(e) {
                return new Date(e.getTime() - e.getTimezoneOffset() * 6e4)
            },
            _zero_time: function(e) {
                return new Date(e.getFullYear(), e.getMonth(), e.getDate())
            },
            _zero_utc_time: function(e) {
                return new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()))
            },
            getDate: function() {
                return this._utc_to_local(this.getUTCDate())
            },
            getUTCDate: function() {
                return this.date
            },
            setDate: function(e) {
                this.setUTCDate(this._local_to_utc(e))
            },
            setUTCDate: function(e) {
                this.date = e, this.setValue()
            },
            setValue: function() {
                var e = this.getFormattedDate();
                this.isInput ? this.element.val(e).change() : this.component && this.element.find("input").val(e).change()
            },
            getFormattedDate: function(e) {
                return e === undefined && (e = this.o.format), h.formatDate(this.date, e, this.o.language)
            },
            setStartDate: function(e) {
                this._process_options({
                    startDate: e
                }), this.update(), this.updateNavArrows()
            },
            setEndDate: function(e) {
                this._process_options({
                    endDate: e
                }), this.update(), this.updateNavArrows()
            },
            setDaysOfWeekDisabled: function(e) {
                this._process_options({
                    daysOfWeekDisabled: e
                }), this.update(), this.updateNavArrows()
            },
            place: function() {
                if (this.isInline) return;
                var n = this.picker.outerWidth(),
                    r = this.picker.outerHeight(),
                    i = 10,
                    s = t.width(),
                    o = t.height(),
                    u = t.scrollTop(),
                    a = parseInt(this.element.parents().filter(function() {
                        return e(this).css("z-index") != "auto"
                    }).first().css("z-index")) + 10,
                    f = this.component ? this.component.parent().offset() : this.element.offset(),
                    l = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1),
                    c = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1),
                    h = f.left,
                    p = f.top;
                this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"), this.o.orientation.x !== "auto" ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), this.o.orientation.x === "right" && (h -= n - c)) : (this.picker.addClass("datepicker-orient-left"), f.left < 0 ? h -= f.left - i : f.left + n > s && (h = s - n - i));
                var d = this.o.orientation.y,
                    v, m;
                d === "auto" && (v = -u + f.top - r, m = u + o - (f.top + l + r), Math.max(v, m) === m ? d = "top" : d = "bottom"), this.picker.addClass("datepicker-orient-" + d), d === "top" ? p += l : p -= r + parseInt(this.picker.css("padding-top")), this.picker.css({
                    top: p,
                    left: h,
                    zIndex: a
                })
            },
            _allow_update: !0,
            update: function() {
                if (!this._allow_update) return;
                var e = new Date(this.date),
                    t, n = !1;
                arguments && arguments.length && (typeof arguments[0] == "string" || arguments[0] instanceof Date) ? (t = arguments[0], t instanceof Date && (t = this._local_to_utc(t)), n = !0) : (t = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val(), delete this.element.data().date), this.date = h.parseDate(t, this.o.format, this.o.language), n ? this.setValue() : t ? e.getTime() !== this.date.getTime() && this._trigger("changeDate") : this._trigger("clearDate"), this.date < this.o.startDate ? (this.viewDate = new Date(this.o.startDate), this.date = new Date(this.o.startDate)) : this.date > this.o.endDate ? (this.viewDate = new Date(this.o.endDate), this.date = new Date(this.o.endDate)) : (this.viewDate = new Date(this.date), this.date = new Date(this.date)), this.fill()
            },
            fillDow: function() {
                var e = this.o.weekStart,
                    t = "<tr>";
                if (this.o.calendarWeeks) {
                    var n = '<th class="cw">&nbsp;</th>';
                    t += n, this.picker.find(".datepicker-days thead tr:first-child").prepend(n)
                }
                while (e < this.o.weekStart + 7) t += '<th class="dow">' + c[this.o.language].daysMin[e++ % 7] + "</th>";
                t += "</tr>", this.picker.find(".datepicker-days thead").append(t)
            },
            fillMonths: function() {
                var e = "",
                    t = 0;
                while (t < 12) e += '<span class="month">' + c[this.o.language].monthsShort[t++] + "</span>";
                this.picker.find(".datepicker-months td").html(e)
            },
            setRange: function(t) {
                !t || !t.length ? delete this.range : this.range = e.map(t, function(e) {
                    return e.valueOf()
                }), this.fill()
            },
            getClassNames: function(t) {
                var n = [],
                    r = this.viewDate.getUTCFullYear(),
                    i = this.viewDate.getUTCMonth(),
                    s = this.date.valueOf(),
                    o = new Date;
                return t.getUTCFullYear() < r || t.getUTCFullYear() == r && t.getUTCMonth() < i ? n.push("old") : (t.getUTCFullYear() > r || t.getUTCFullYear() == r && t.getUTCMonth() > i) && n.push("new"), this.o.todayHighlight && t.getUTCFullYear() == o.getFullYear() && t.getUTCMonth() == o.getMonth() && t.getUTCDate() == o.getDate() && n.push("today"), t.valueOf() == s && n.push("active"), (t.valueOf() < this.o.startDate || t.valueOf() > this.o.endDate || e.inArray(t.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) && n.push("disabled"), this.range && (t > this.range[0] && t < this.range[this.range.length - 1] && n.push("range"), e.inArray(t.valueOf(), this.range) != -1 && n.push("selected")), n
            },
            fill: function() {
                var t = new Date(this.viewDate),
                    r = t.getUTCFullYear(),
                    i = t.getUTCMonth(),
                    s = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
                    o = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
                    u = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
                    a = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
                    f = this.date && this.date.valueOf(),
                    l;
                this.picker.find(".datepicker-days thead th.datepicker-switch").text(c[this.o.language].months[i] + " " + r), this.picker.find("tfoot th.today").text(c[this.o.language].today).toggle(this.o.todayBtn !== !1), this.picker.find("tfoot th.clear").text(c[this.o.language].clear).toggle(this.o.clearBtn !== !1), this.updateNavArrows(), this.fillMonths();
                var p = n(r, i - 1, 28, 0, 0, 0, 0),
                    d = h.getDaysInMonth(p.getUTCFullYear(), p.getUTCMonth());
                p.setUTCDate(d), p.setUTCDate(d - (p.getUTCDay() - this.o.weekStart + 7) % 7);
                var v = new Date(p);
                v.setUTCDate(v.getUTCDate() + 42), v = v.valueOf();
                var m = [],
                    g;
                while (p.valueOf() < v) {
                    if (p.getUTCDay() == this.o.weekStart) {
                        m.push("<tr>");
                        if (this.o.calendarWeeks) {
                            var y = new Date(+p + (this.o.weekStart - p.getUTCDay() - 7) % 7 * 864e5),
                                b = new Date(+y + (11 - y.getUTCDay()) % 7 * 864e5),
                                w = new Date(+(w = n(b.getUTCFullYear(), 0, 1)) + (11 - w.getUTCDay()) % 7 * 864e5),
                                E = (b - w) / 864e5 / 7 + 1;
                            m.push('<td class="cw">' + E + "</td>")
                        }
                    }
                    g = this.getClassNames(p), g.push("day");
                    if (this.o.beforeShowDay !== e.noop) {
                        var S = this.o.beforeShowDay(this._utc_to_local(p));
                        S === undefined ? S = {} : typeof S == "boolean" ? S = {
                            enabled: S
                        } : typeof S == "string" && (S = {
                            classes: S
                        }), S.enabled === !1 && g.push("disabled"), S.classes && (g = g.concat(S.classes.split(/\s+/))), S.tooltip && (l = S.tooltip)
                    }
                    g = e.unique(g), m.push('<td class="' + g.join(" ") + '"' + (l ? ' title="' + l + '"' : "") + ">" + p.getUTCDate() + "</td>"), p.getUTCDay() == this.o.weekEnd && m.push("</tr>"), p.setUTCDate(p.getUTCDate() + 1)
                }
                this.picker.find(".datepicker-days tbody").empty().append(m.join(""));
                var x = this.date && this.date.getUTCFullYear(),
                    T = this.picker.find(".datepicker-months").find("th:eq(1)").text(r).end().find("span").removeClass("active");
                x && x == r && T.eq(this.date.getUTCMonth()).addClass("active"), (r < s || r > u) && T.addClass("disabled"), r == s && T.slice(0, o).addClass("disabled"), r == u && T.slice(a + 1).addClass("disabled"), m = "", r = parseInt(r / 10, 10) * 10;
                var N = this.picker.find(".datepicker-years").find("th:eq(1)").text(r + "-" + (r + 9)).end().find("td");
                r -= 1;
                for (var C = -1; C < 11; C++) m += '<span class="year' + (C == -1 ? " old" : C == 10 ? " new" : "") + (x == r ? " active" : "") + (r < s || r > u ? " disabled" : "") + '">' + r + "</span>", r += 1;
                N.html(m)
            },
            updateNavArrows: function() {
                if (!this._allow_update) return;
                var e = new Date(this.viewDate),
                    t = e.getUTCFullYear(),
                    n = e.getUTCMonth();
                switch (this.viewMode) {
                    case 0:
                        this.o.startDate !== -Infinity && t <= this.o.startDate.getUTCFullYear() && n <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({
                            visibility: "hidden"
                        }) : this.picker.find(".prev").css({
                            visibility: "visible"
                        }), this.o.endDate !== Infinity && t >= this.o.endDate.getUTCFullYear() && n >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        });
                        break;
                    case 1:
                    case 2:
                        this.o.startDate !== -Infinity && t <= this.o.startDate.getUTCFullYear() ? this.picker.find(".prev").css({
                            visibility: "hidden"
                        }) : this.picker.find(".prev").css({
                            visibility: "visible"
                        }), this.o.endDate !== Infinity && t >= this.o.endDate.getUTCFullYear() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        })
                }
            },
            click: function(t) {
                t.preventDefault();
                var r = e(t.target).closest("span, td, th");
                if (r.length == 1) switch (r[0].nodeName.toLowerCase()) {
                    case "th":
                        switch (r[0].className) {
                            case "datepicker-switch":
                                this.showMode(1);
                                break;
                            case "prev":
                            case "next":
                                var i = h.modes[this.viewMode].navStep * (r[0].className == "prev" ? -1 : 1);
                                switch (this.viewMode) {
                                    case 0:
                                        this.viewDate = this.moveMonth(this.viewDate, i), this._trigger("changeMonth", this.viewDate);
                                        break;
                                    case 1:
                                    case 2:
                                        this.viewDate = this.moveYear(this.viewDate, i), this.viewMode === 1 && this._trigger("changeYear", this.viewDate)
                                }
                                this.fill();
                                break;
                            case "today":
                                var s = new Date;
                                s = n(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0), this.showMode(-2);
                                var o = this.o.todayBtn == "linked" ? null : "view";
                                this._setDate(s, o);
                                break;
                            case "clear":
                                var u;
                                this.isInput ? u = this.element : this.component && (u = this.element.find("input")), u && u.val("").change(), this._trigger("changeDate"), this.update(), this.o.autoclose && this.hide()
                        }
                        break;
                    case "span":
                        if (!r.is(".disabled")) {
                            this.viewDate.setUTCDate(1);
                            if (r.is(".month")) {
                                var a = 1,
                                    f = r.parent().find("span").index(r),
                                    l = this.viewDate.getUTCFullYear();
                                this.viewDate.setUTCMonth(f), this._trigger("changeMonth", this.viewDate), this.o.minViewMode === 1 && this._setDate(n(l, f, a, 0, 0, 0, 0))
                            } else {
                                var l = parseInt(r.text(), 10) || 0,
                                    a = 1,
                                    f = 0;
                                this.viewDate.setUTCFullYear(l), this._trigger("changeYear", this.viewDate), this.o.minViewMode === 2 && this._setDate(n(l, f, a, 0, 0, 0, 0))
                            }
                            this.showMode(-1), this.fill()
                        }
                        break;
                    case "td":
                        if (r.is(".day") && !r.is(".disabled")) {
                            var a = parseInt(r.text(), 10) || 1,
                                l = this.viewDate.getUTCFullYear(),
                                f = this.viewDate.getUTCMonth();
                            r.is(".old") ? f === 0 ? (f = 11, l -= 1) : f -= 1 : r.is(".new") && (f == 11 ? (f = 0, l += 1) : f += 1), this._setDate(n(l, f, a, 0, 0, 0, 0))
                        }
                }
            },
            _setDate: function(e, t) {
                if (!t || t == "date") this.date = new Date(e);
                if (!t || t == "view") this.viewDate = new Date(e);
                this.fill(), this.setValue(), this._trigger("changeDate");
                var n;
                this.isInput ? n = this.element : this.component && (n = this.element.find("input")), n && n.change(), this.o.autoclose && (!t || t == "date") && this.hide()
            },
            moveMonth: function(e, t) {
                if (!t) return e;
                var n = new Date(e.valueOf()),
                    r = n.getUTCDate(),
                    i = n.getUTCMonth(),
                    s = Math.abs(t),
                    o, u;
                t = t > 0 ? 1 : -1;
                if (s == 1) {
                    u = t == -1 ? function() {
                        return n.getUTCMonth() == i
                    } : function() {
                        return n.getUTCMonth() != o
                    }, o = i + t, n.setUTCMonth(o);
                    if (o < 0 || o > 11) o = (o + 12) % 12
                } else {
                    for (var a = 0; a < s; a++) n = this.moveMonth(n, t);
                    o = n.getUTCMonth(), n.setUTCDate(r), u = function() {
                        return o != n.getUTCMonth()
                    }
                }
                while (u()) n.setUTCDate(--r), n.setUTCMonth(o);
                return n
            },
            moveYear: function(e, t) {
                return this.moveMonth(e, t * 12)
            },
            dateWithinRange: function(e) {
                return e >= this.o.startDate && e <= this.o.endDate
            },
            keydown: function(e) {
                if (this.picker.is(":not(:visible)")) {
                    e.keyCode == 27 && this.show();
                    return
                }
                var t = !1,
                    n, r, i, s, o;
                switch (e.keyCode) {
                    case 27:
                        this.hide(), e.preventDefault();
                        break;
                    case 37:
                    case 39:
                        if (!this.o.keyboardNavigation) break;
                        n = e.keyCode == 37 ? -1 : 1, e.ctrlKey ? (s = this.moveYear(this.date, n), o = this.moveYear(this.viewDate, n), this._trigger("changeYear", this.viewDate)) : e.shiftKey ? (s = this.moveMonth(this.date, n), o = this.moveMonth(this.viewDate, n), this._trigger("changeMonth", this.viewDate)) : (s = new Date(this.date), s.setUTCDate(this.date.getUTCDate() + n), o = new Date(this.viewDate), o.setUTCDate(this.viewDate.getUTCDate() + n)), this.dateWithinRange(s) && (this.date = s, this.viewDate = o, this.setValue(), this.update(), e.preventDefault(), t = !0);
                        break;
                    case 38:
                    case 40:
                        if (!this.o.keyboardNavigation) break;
                        n = e.keyCode == 38 ? -1 : 1, e.ctrlKey ? (s = this.moveYear(this.date, n), o = this.moveYear(this.viewDate, n), this._trigger("changeYear", this.viewDate)) : e.shiftKey ? (s = this.moveMonth(this.date, n), o = this.moveMonth(this.viewDate, n), this._trigger("changeMonth", this.viewDate)) : (s = new Date(this.date), s.setUTCDate(this.date.getUTCDate() + n * 7), o = new Date(this.viewDate), o.setUTCDate(this.viewDate.getUTCDate() + n * 7)), this.dateWithinRange(s) && (this.date = s, this.viewDate = o, this.setValue(), this.update(), e.preventDefault(), t = !0);
                        break;
                    case 13:
                        this.hide(), e.preventDefault();
                        break;
                    case 9:
                        this.hide()
                }
                if (t) {
                    this._trigger("changeDate");
                    var u;
                    this.isInput ? u = this.element : this.component && (u = this.element.find("input")), u && u.change()
                }
            },
            showMode: function(e) {
                e && (this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + e))), this.picker.find(">div").hide().filter(".datepicker-" + h.modes[this.viewMode].clsName).css("display", "block"), this.updateNavArrows()
            }
        };
        var s = function(t, n) {
            this.element = e(t), this.inputs = e.map(n.inputs, function(e) {
                return e.jquery ? e[0] : e
            }), delete n.inputs, e(this.inputs).datepicker(n).bind("changeDate", e.proxy(this.dateUpdated, this)), this.pickers = e.map(this.inputs, function(t) {
                return e(t).data("datepicker")
            }), this.updateDates()
        };
        s.prototype = {
            updateDates: function() {
                this.dates = e.map(this.pickers, function(e) {
                    return e.date
                }), this.updateRanges()
            },
            updateRanges: function() {
                var t = e.map(this.dates, function(e) {
                    return e.valueOf()
                });
                e.each(this.pickers, function(e, n) {
                    n.setRange(t)
                })
            },
            dateUpdated: function(t) {
                var n = e(t.target).data("datepicker"),
                    r = n.getUTCDate(),
                    i = e.inArray(t.target, this.inputs),
                    s = this.inputs.length;
                if (i == -1) return;
                if (r < this.dates[i])
                    while (i >= 0 && r < this.dates[i]) this.pickers[i--].setUTCDate(r);
                else if (r > this.dates[i])
                    while (i < s && r > this.dates[i]) this.pickers[i++].setUTCDate(r);
                this.updateDates()
            },
            remove: function() {
                e.map(this.pickers, function(e) {
                    e.remove()
                }), delete this.element.data().datepicker
            }
        };
        var a = e.fn.datepicker;
        e.fn.datepicker = function(t) {
            var n = Array.apply(null, arguments);
            n.shift();
            var r, a;
            return this.each(function() {
                var a = e(this),
                    l = a.data("datepicker"),
                    c = typeof t == "object" && t;
                if (!l) {
                    var h = o(this, "date"),
                        p = e.extend({}, f, h, c),
                        d = u(p.language),
                        v = e.extend({}, f, d, h, c);
                    if (a.is(".input-daterange") || v.inputs) {
                        var m = {
                            inputs: v.inputs || a.find("input").toArray()
                        };
                        a.data("datepicker", l = new s(this, e.extend(v, m)))
                    } else a.data("datepicker", l = new i(this, v))
                }
                if (typeof t == "string" && typeof l[t] == "function") {
                    r = l[t].apply(l, n);
                    if (r !== undefined) return !1
                }
            }), r !== undefined ? r : this
        };
        var f = e.fn.datepicker.defaults = {
                autoclose: !1,
                beforeShowDay: e.noop,
                calendarWeeks: !1,
                clearBtn: !1,
                daysOfWeekDisabled: [],
                endDate: Infinity,
                forceParse: !0,
                format: "mm/dd/yyyy",
                keyboardNavigation: !0,
                language: "en",
                minViewMode: 0,
                orientation: "auto",
                rtl: !1,
                startDate: -Infinity,
                startView: 0,
                todayBtn: !1,
                todayHighlight: !1,
                weekStart: 0
            },
            l = e.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
        e.fn.datepicker.Constructor = i;
        var c = e.fn.datepicker.dates = {
                en: {
                    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    today: "Today",
                    clear: "Clear"
                }
            },
            h = {
                modes: [{
                    clsName: "days",
                    navFnc: "Month",
                    navStep: 1
                }, {
                    clsName: "months",
                    navFnc: "FullYear",
                    navStep: 1
                }, {
                    clsName: "years",
                    navFnc: "FullYear",
                    navStep: 10
                }],
                isLeapYear: function(e) {
                    return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
                },
                getDaysInMonth: function(e, t) {
                    return [31, h.isLeapYear(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t]
                },
                validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
                parseFormat: function(e) {
                    var t = e.replace(this.validParts, "\0").split("\0"),
                        n = e.match(this.validParts);
                    if (!t || !t.length || !n || n.length === 0) throw new Error("Invalid date format.");
                    return {
                        separators: t,
                        parts: n
                    }
                },
                parseDate: function(t, r, s) {
                    if (t instanceof Date) return t;
                    typeof r == "string" && (r = h.parseFormat(r));
                    if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(t)) {
                        var o = /([\-+]\d+)([dmwy])/,
                            u = t.match(/([\-+]\d+)([dmwy])/g),
                            a, f;
                        t = new Date;
                        for (var l = 0; l < u.length; l++) {
                            a = o.exec(u[l]), f = parseInt(a[1]);
                            switch (a[2]) {
                                case "d":
                                    t.setUTCDate(t.getUTCDate() + f);
                                    break;
                                case "m":
                                    t = i.prototype.moveMonth.call(i.prototype, t, f);
                                    break;
                                case "w":
                                    t.setUTCDate(t.getUTCDate() + f * 7);
                                    break;
                                case "y":
                                    t = i.prototype.moveYear.call(i.prototype, t, f)
                            }
                        }
                        return n(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), 0, 0, 0)
                    }
                    var u = t && t.match(this.nonpunctuation) || [],
                        t = new Date,
                        p = {},
                        d = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
                        v = {
                            yyyy: function(e, t) {
                                return e.setUTCFullYear(t)
                            },
                            yy: function(e, t) {
                                return e.setUTCFullYear(2e3 + t)
                            },
                            m: function(e, t) {
                                if (isNaN(e)) return e;
                                t -= 1;
                                while (t < 0) t += 12;
                                t %= 12, e.setUTCMonth(t);
                                while (e.getUTCMonth() != t) e.setUTCDate(e.getUTCDate() - 1);
                                return e
                            },
                            d: function(e, t) {
                                return e.setUTCDate(t)
                            }
                        },
                        m, g, a;
                    v.M = v.MM = v.mm = v.m, v.dd = v.d, t = n(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0);
                    var y = r.parts.slice();
                    u.length != y.length && (y = e(y).filter(function(t, n) {
                        return e.inArray(n, d) !== -1
                    }).toArray());
                    if (u.length == y.length) {
                        for (var l = 0, b = y.length; l < b; l++) {
                            m = parseInt(u[l], 10), a = y[l];
                            if (isNaN(m)) switch (a) {
                                case "MM":
                                    g = e(c[s].months).filter(function() {
                                        var e = this.slice(0, u[l].length),
                                            t = u[l].slice(0, e.length);
                                        return e == t
                                    }), m = e.inArray(g[0], c[s].months) + 1;
                                    break;
                                case "M":
                                    g = e(c[s].monthsShort).filter(function() {
                                        var e = this.slice(0, u[l].length),
                                            t = u[l].slice(0, e.length);
                                        return e == t
                                    }), m = e.inArray(g[0], c[s].monthsShort) + 1
                            }
                            p[a] = m
                        }
                        for (var l = 0, w, E; l < d.length; l++) E = d[l], E in p && !isNaN(p[E]) && (w = new Date(t), v[E](w, p[E]), isNaN(w) || (t = w))
                    }
                    return t
                },
                formatDate: function(t, n, r) {
                    typeof n == "string" && (n = h.parseFormat(n));
                    var i = {
                        d: t.getUTCDate(),
                        D: c[r].daysShort[t.getUTCDay()],
                        DD: c[r].days[t.getUTCDay()],
                        m: t.getUTCMonth() + 1,
                        M: c[r].monthsShort[t.getUTCMonth()],
                        MM: c[r].months[t.getUTCMonth()],
                        yy: t.getUTCFullYear().toString().substring(2),
                        yyyy: t.getUTCFullYear()
                    };
                    i.dd = (i.d < 10 ? "0" : "") + i.d, i.mm = (i.m < 10 ? "0" : "") + i.m;
                    var t = [],
                        s = e.extend([], n.separators);
                    for (var o = 0, u = n.parts.length; o <= u; o++) s.length && t.push(s.shift()), t.push(i[n.parts[o]]);
                    return t.join("")
                },
                headTemplate: '<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
                contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
                footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
            };
        h.template = '<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">' + h.headTemplate + "<tbody></tbody>" + h.footTemplate + "</table>" + "</div>" + '<div class="datepicker-months">' + '<table class="table-condensed">' + h.headTemplate + h.contTemplate + h.footTemplate + "</table>" + "</div>" + '<div class="datepicker-years">' + '<table class="table-condensed">' + h.headTemplate + h.contTemplate + h.footTemplate + "</table>" + "</div>" + "</div>", e.fn.datepicker.DPGlobal = h, e.fn.datepicker.noConflict = function() {
            return e.fn.datepicker = a, this
        }, e(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(t) {
            var n = e(this);
            if (n.data("datepicker")) return;
            t.preventDefault(), n.datepicker("show")
        }), e(function() {
            e('[data-provide="datepicker-inline"]').datepicker()
        })
    })(e)
}), define("bootstrap.timepicker", ["jquery"], function(e) {
    (function(e, t, n, r) {
        "use strict";
        var i = function(t, n) {
            this.widget = "", this.$element = e(t), this.defaultTime = n.defaultTime, this.disableFocus = n.disableFocus, this.disableMousewheel = n.disableMousewheel, this.isOpen = n.isOpen, this.minuteStep = n.minuteStep, this.modalBackdrop = n.modalBackdrop, this.orientation = n.orientation, this.secondStep = n.secondStep, this.showInputs = n.showInputs, this.showMeridian = n.showMeridian, this.showSeconds = n.showSeconds, this.template = n.template, this.appendWidgetTo = n.appendWidgetTo, this.showWidgetOnAddonClick = n.showWidgetOnAddonClick, this._init()
        };
        i.prototype = {
            constructor: i,
            _init: function() {
                var t = this;
                this.showWidgetOnAddonClick && (this.$element.parent().hasClass("input-append") || this.$element.parent().hasClass("input-prepend")) ? (this.$element.parent(".input-append, .input-prepend").find(".add-on").on({
                    "click.timepicker": e.proxy(this.showWidget, this)
                }), this.$element.on({
                    "focus.timepicker": e.proxy(this.highlightUnit, this),
                    "click.timepicker": e.proxy(this.highlightUnit, this),
                    "keydown.timepicker": e.proxy(this.elementKeydown, this),
                    "blur.timepicker": e.proxy(this.blurElement, this),
                    "mousewheel.timepicker DOMMouseScroll.timepicker": e.proxy(this.mousewheel, this)
                })) : this.template ? this.$element.on({
                    "focus.timepicker": e.proxy(this.showWidget, this),
                    "click.timepicker": e.proxy(this.showWidget, this),
                    "blur.timepicker": e.proxy(this.blurElement, this),
                    "mousewheel.timepicker DOMMouseScroll.timepicker": e.proxy(this.mousewheel, this)
                }) : this.$element.on({
                    "focus.timepicker": e.proxy(this.highlightUnit, this),
                    "click.timepicker": e.proxy(this.highlightUnit, this),
                    "keydown.timepicker": e.proxy(this.elementKeydown, this),
                    "blur.timepicker": e.proxy(this.blurElement, this),
                    "mousewheel.timepicker DOMMouseScroll.timepicker": e.proxy(this.mousewheel, this)
                }), this.template !== !1 ? this.$widget = e(this.getTemplate()).on("click", e.proxy(this.widgetClick, this)) : this.$widget = !1, this.showInputs && this.$widget !== !1 && this.$widget.find("input").each(function() {
                    e(this).on({
                        "click.timepicker": function() {
                            e(this).select()
                        },
                        "keydown.timepicker": e.proxy(t.widgetKeydown, t),
                        "keyup.timepicker": e.proxy(t.widgetKeyup, t)
                    })
                }), this.setDefaultTime(this.defaultTime)
            },
            blurElement: function() {
                this.highlightedUnit = null, this.updateFromElementVal()
            },
            clear: function() {
                this.hour = "", this.minute = "", this.second = "", this.meridian = "", this.$element.val("")
            },
            decrementHour: function() {
                if (this.showMeridian)
                    if (this.hour === 1) this.hour = 12;
                    else {
                        if (this.hour === 12) return this.hour--, this.toggleMeridian();
                        if (this.hour === 0) return this.hour = 11, this.toggleMeridian();
                        this.hour--
                    } else this.hour <= 0 ? this.hour = 23 : this.hour--
            },
            decrementMinute: function(e) {
                var t;
                e ? t = this.minute - e : t = this.minute - this.minuteStep, t < 0 ? (this.decrementHour(), this.minute = t + 60) : this.minute = t
            },
            decrementSecond: function() {
                var e = this.second - this.secondStep;
                e < 0 ? (this.decrementMinute(!0), this.second = e + 60) : this.second = e
            },
            elementKeydown: function(e) {
                switch (e.keyCode) {
                    case 9:
                    case 27:
                        this.updateFromElementVal();
                        break;
                    case 37:
                        e.preventDefault(), this.highlightPrevUnit();
                        break;
                    case 38:
                        e.preventDefault();
                        switch (this.highlightedUnit) {
                            case "hour":
                                this.incrementHour(), this.highlightHour();
                                break;
                            case "minute":
                                this.incrementMinute(), this.highlightMinute();
                                break;
                            case "second":
                                this.incrementSecond(), this.highlightSecond();
                                break;
                            case "meridian":
                                this.toggleMeridian(), this.highlightMeridian()
                        }
                        this.update();
                        break;
                    case 39:
                        e.preventDefault(), this.highlightNextUnit();
                        break;
                    case 40:
                        e.preventDefault();
                        switch (this.highlightedUnit) {
                            case "hour":
                                this.decrementHour(), this.highlightHour();
                                break;
                            case "minute":
                                this.decrementMinute(), this.highlightMinute();
                                break;
                            case "second":
                                this.decrementSecond(), this.highlightSecond();
                                break;
                            case "meridian":
                                this.toggleMeridian(), this.highlightMeridian()
                        }
                        this.update()
                }
            },
            getCursorPosition: function() {
                var e = this.$element.get(0);
                if ("selectionStart" in e) return e.selectionStart;
                if (n.selection) {
                    e.focus();
                    var t = n.selection.createRange(),
                        r = n.selection.createRange().text.length;
                    return t.moveStart("character", -e.value.length), t.text.length - r
                }
            },
            getTemplate: function() {
                var e, t, n, r, i, s;
                this.showInputs ? (t = '<input type="text" class="bootstrap-timepicker-hour" maxlength="2"/>', n = '<input type="text" class="bootstrap-timepicker-minute" maxlength="2"/>', r = '<input type="text" class="bootstrap-timepicker-second" maxlength="2"/>', i = '<input type="text" class="bootstrap-timepicker-meridian" maxlength="2"/>') : (t = '<span class="bootstrap-timepicker-hour"></span>', n = '<span class="bootstrap-timepicker-minute"></span>', r = '<span class="bootstrap-timepicker-second"></span>', i = '<span class="bootstrap-timepicker-meridian"></span>'), s = '<table><tr><td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td><td class="separator">&nbsp;</td><td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>' + (this.showSeconds ? '<td class="separator">&nbsp;</td><td><a href="#" data-action="incrementSecond"><i class="icon-chevron-up"></i></a></td>' : "") + (this.showMeridian ? '<td class="separator">&nbsp;</td><td class="meridian-column"><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>' : "") + "</tr>" + "<tr>" + "<td>" + t + "</td> " + '<td class="separator">:</td>' + "<td>" + n + "</td> " + (this.showSeconds ? '<td class="separator">:</td><td>' + r + "</td>" : "") + (this.showMeridian ? '<td class="separator">&nbsp;</td><td>' + i + "</td>" : "") + "</tr>" + "<tr>" + '<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>' + '<td class="separator"></td>' + '<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>' + (this.showSeconds ? '<td class="separator">&nbsp;</td><td><a href="#" data-action="decrementSecond"><i class="icon-chevron-down"></i></a></td>' : "") + (this.showMeridian ? '<td class="separator">&nbsp;</td><td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>' : "") + "</tr>" + "</table>";
                switch (this.template) {
                    case "modal":
                        e = '<div class="bootstrap-timepicker-widget modal hide fade in" data-backdrop="' + (this.modalBackdrop ? "true" : "false") + '">' + '<div class="modal-header">' + '<a href="#" class="close" data-dismiss="modal">×</a>' + "<h3>Pick a Time</h3>" + "</div>" + '<div class="modal-content">' + s + "</div>" + '<div class="modal-footer">' + '<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>' + "</div>" + "</div>";
                        break;
                    case "dropdown":
                        e = '<div class="bootstrap-timepicker-widget dropdown-menu">' + s + "</div>"
                }
                return e
            },
            getTime: function() {
                return this.hour === "" ? "" : this.hour + ":" + (this.minute.toString().length === 1 ? "0" + this.minute : this.minute) + (this.showSeconds ? ":" + (this.second.toString().length === 1 ? "0" + this.second : this.second) : "") + (this.showMeridian ? " " + this.meridian : "")
            },
            hideWidget: function() {
                if (this.isOpen === !1) return;
                this.$element.trigger({
                    type: "hide.timepicker",
                    time: {
                        value: this.getTime(),
                        hours: this.hour,
                        minutes: this.minute,
                        seconds: this.second,
                        meridian: this.meridian
                    }
                }), this.template === "modal" && this.$widget.modal ? this.$widget.modal("hide") : this.$widget.removeClass("open"), e(n).off("mousedown.timepicker, touchend.timepicker"), this.isOpen = !1, this.$widget.detach()
            },
            highlightUnit: function() {
                this.position = this.getCursorPosition(), this.position >= 0 && this.position <= 2 ? this.highlightHour() : this.position >= 3 && this.position <= 5 ? this.highlightMinute() : this.position >= 6 && this.position <= 8 ? this.showSeconds ? this.highlightSecond() : this.highlightMeridian() : this.position >= 9 && this.position <= 11 && this.highlightMeridian()
            },
            highlightNextUnit: function() {
                switch (this.highlightedUnit) {
                    case "hour":
                        this.highlightMinute();
                        break;
                    case "minute":
                        this.showSeconds ? this.highlightSecond() : this.showMeridian ? this.highlightMeridian() : this.highlightHour();
                        break;
                    case "second":
                        this.showMeridian ? this.highlightMeridian() : this.highlightHour();
                        break;
                    case "meridian":
                        this.highlightHour()
                }
            },
            highlightPrevUnit: function() {
                switch (this.highlightedUnit) {
                    case "hour":
                        this.showMeridian ? this.highlightMeridian() : this.showSeconds ? this.highlightSecond() : this.highlightMinute();
                        break;
                    case "minute":
                        this.highlightHour();
                        break;
                    case "second":
                        this.highlightMinute();
                        break;
                    case "meridian":
                        this.showSeconds ? this.highlightSecond() : this.highlightMinute()
                }
            },
            highlightHour: function() {
                var e = this.$element.get(0),
                    t = this;
                this.highlightedUnit = "hour", e.setSelectionRange && setTimeout(function() {
                    t.hour < 10 ? e.setSelectionRange(0, 1) : e.setSelectionRange(0, 2)
                }, 0)
            },
            highlightMinute: function() {
                var e = this.$element.get(0),
                    t = this;
                this.highlightedUnit = "minute", e.setSelectionRange && setTimeout(function() {
                    t.hour < 10 ? e.setSelectionRange(2, 4) : e.setSelectionRange(3, 5)
                }, 0)
            },
            highlightSecond: function() {
                var e = this.$element.get(0),
                    t = this;
                this.highlightedUnit = "second", e.setSelectionRange && setTimeout(function() {
                    t.hour < 10 ? e.setSelectionRange(5, 7) : e.setSelectionRange(6, 8)
                }, 0)
            },
            highlightMeridian: function() {
                var e = this.$element.get(0),
                    t = this;
                this.highlightedUnit = "meridian", e.setSelectionRange && (this.showSeconds ? setTimeout(function() {
                    t.hour < 10 ? e.setSelectionRange(8, 10) : e.setSelectionRange(9, 11)
                }, 0) : setTimeout(function() {
                    t.hour < 10 ? e.setSelectionRange(5, 7) : e.setSelectionRange(6, 8)
                }, 0))
            },
            incrementHour: function() {
                if (this.showMeridian) {
                    if (this.hour === 11) return this.hour++, this.toggleMeridian();
                    this.hour === 12 && (this.hour = 0)
                }
                if (this.hour === 23) {
                    this.hour = 0;
                    return
                }
                this.hour++
            },
            incrementMinute: function(e) {
                var t;
                e ? t = this.minute + e : t = this.minute + this.minuteStep - this.minute % this.minuteStep, t > 59 ? (this.incrementHour(), this.minute = t - 60) : this.minute = t
            },
            incrementSecond: function() {
                var e = this.second + this.secondStep - this.second % this.secondStep;
                e > 59 ? (this.incrementMinute(!0), this.second = e - 60) : this.second = e
            },
            mousewheel: function(t) {
                if (this.disableMousewheel) return;
                t.preventDefault(), t.stopPropagation();
                var n = t.originalEvent.wheelDelta || -t.originalEvent.detail,
                    r = null;
                t.type === "mousewheel" ? r = t.originalEvent.wheelDelta * -1 : t.type === "DOMMouseScroll" && (r = 40 * t.originalEvent.detail), r && (t.preventDefault(), e(this).scrollTop(r + e(this).scrollTop()));
                switch (this.highlightedUnit) {
                    case "minute":
                        n > 0 ? this.incrementMinute() : this.decrementMinute(), this.highlightMinute();
                        break;
                    case "second":
                        n > 0 ? this.incrementSecond() : this.decrementSecond(), this.highlightSecond();
                        break;
                    case "meridian":
                        this.toggleMeridian(), this.highlightMeridian();
                        break;
                    default:
                        n > 0 ? this.incrementHour() : this.decrementHour(), this.highlightHour()
                }
                return !1
            },
            place: function() {
                if (this.isInline) return;
                var n = this.$widget.outerWidth(),
                    r = this.$widget.outerHeight(),
                    i = 10,
                    s = e(t).width(),
                    o = e(t).height(),
                    u = e(t).scrollTop(),
                    a = parseInt(this.$element.parents().filter(function() {}).first().css("z-index"), 10) + 10,
                    f = this.component ? this.component.parent().offset() : this.$element.offset(),
                    l = this.component ? this.component.outerHeight(!0) : this.$element.outerHeight(!1),
                    c = this.component ? this.component.outerWidth(!0) : this.$element.outerWidth(!1),
                    h = f.left,
                    p = f.top;
                this.$widget.removeClass("timepicker-orient-top timepicker-orient-bottom timepicker-orient-right timepicker-orient-left"), this.orientation.x !== "auto" ? (this.picker.addClass("datepicker-orient-" + this.orientation.x), this.orientation.x === "right" && (h -= n - c)) : (this.$widget.addClass("timepicker-orient-left"), f.left < 0 ? h -= f.left - i : f.left + n > s && (h = s - n - i));
                var d = this.orientation.y,
                    v, m;
                d === "auto" && (v = -u + f.top - r, m = u + o - (f.top + l + r), Math.max(v, m) === m ? d = "top" : d = "bottom"), this.$widget.addClass("timepicker-orient-" + d), d === "top" ? p += l : p -= r + parseInt(this.$widget.css("padding-top"), 10), this.$widget.css({
                    top: p,
                    left: h,
                    zIndex: a
                })
            },
            remove: function() {
                e("document").off(".timepicker"), this.$widget && this.$widget.remove(), delete this.$element.data().timepicker
            },
            setDefaultTime: function(e) {
                if (!this.$element.val())
                    if (e === "current") {
                        var t = new Date,
                            n = t.getHours(),
                            r = t.getMinutes(),
                            i = t.getSeconds(),
                            s = "AM";
                        i !== 0 && (i = Math.ceil(t.getSeconds() / this.secondStep) * this.secondStep, i === 60 && (r += 1, i = 0)), r !== 0 && (r = Math.ceil(t.getMinutes() / this.minuteStep) * this.minuteStep, r === 60 && (n += 1, r = 0)), this.showMeridian && (n === 0 ? n = 12 : n >= 12 ? (n > 12 && (n -= 12), s = "PM") : s = "AM"), this.hour = n, this.minute = r, this.second = i, this.meridian = s, this.update()
                    } else e === !1 ? (this.hour = 0, this.minute = 0, this.second = 0, this.meridian = "AM") : this.setTime(e);
                else this.updateFromElementVal()
            },
            setTime: function(e, t) {
                if (!e) {
                    this.clear();
                    return
                }
                var n, r, i, s, o;
                typeof e == "object" && e.getMonth ? (r = e.getHours(), i = e.getMinutes(), s = e.getSeconds(), this.showMeridian && (o = "AM", r > 12 && (o = "PM", r %= 12), r === 12 && (o = "PM"))) : (e.match(/p/i) !== null ? o = "PM" : o = "AM", e = e.replace(/[^0-9\:]/g, ""), n = e.split(":"), r = n[0] ? n[0].toString() : n.toString(), i = n[1] ? n[1].toString() : "", s = n[2] ? n[2].toString() : "", r.length > 4 && (s = r.substr(4, 2)), r.length > 2 && (i = r.substr(2, 2), r = r.substr(0, 2)), i.length > 2 && (s = i.substr(2, 2), i = i.substr(0, 2)), s.length > 2 && (s = s.substr(2, 2)), r = parseInt(r, 10), i = parseInt(i, 10), s = parseInt(s, 10), isNaN(r) && (r = 0), isNaN(i) && (i = 0), isNaN(s) && (s = 0), this.showMeridian ? r < 1 ? r = 1 : r > 12 && (r = 12) : (r >= 24 ? r = 23 : r < 0 && (r = 0), r < 13 && o === "PM" && (r += 12)), i < 0 ? i = 0 : i >= 60 && (i = 59), this.showSeconds && (isNaN(s) ? s = 0 : s < 0 ? s = 0 : s >= 60 && (s = 59))), this.hour = r, this.minute = i, this.second = s, this.meridian = o, this.update(t)
            },
            showWidget: function() {
                if (this.isOpen) return;
                if (this.$element.is(":disabled")) return;
                this.$widget.appendTo(this.appendWidgetTo);
                var t = this;
                e(n).on("mousedown.timepicker, touchend.timepicker", function(e) {
                    t.$element.parent().find(e.target).length || t.$widget.is(e.target) || t.$widget.find(e.target).length || t.hideWidget()
                }), this.$element.trigger({
                    type: "show.timepicker",
                    time: {
                        value: this.getTime(),
                        hours: this.hour,
                        minutes: this.minute,
                        seconds: this.second,
                        meridian: this.meridian
                    }
                }), this.place(), this.disableFocus && this.$element.blur(), this.hour === "" && (this.defaultTime ? this.setDefaultTime(this.defaultTime) : this.setTime("0:0:0")), this.template === "modal" && this.$widget.modal ? this.$widget.modal("show").on("hidden", e.proxy(this.hideWidget, this)) : this.isOpen === !1 && this.$widget.addClass("open"), this.isOpen = !0
            },
            toggleMeridian: function() {
                this.meridian = this.meridian === "AM" ? "PM" : "AM"
            },
            update: function(e) {
                this.updateElement(), e || this.updateWidget(), this.$element.trigger({
                    type: "changeTime.timepicker",
                    time: {
                        value: this.getTime(),
                        hours: this.hour,
                        minutes: this.minute,
                        seconds: this.second,
                        meridian: this.meridian
                    }
                })
            },
            updateElement: function() {
                this.$element.val(this.getTime()).change()
            },
            updateFromElementVal: function() {
                this.setTime(this.$element.val())
            },
            updateWidget: function() {
                if (this.$widget === !1) return;
                var e = this.hour,
                    t = this.minute.toString().length === 1 ? "0" + this.minute : this.minute,
                    n = this.second.toString().length === 1 ? "0" + this.second : this.second;
                this.showInputs ? (this.$widget.find("input.bootstrap-timepicker-hour").val(e), this.$widget.find("input.bootstrap-timepicker-minute").val(t), this.showSeconds && this.$widget.find("input.bootstrap-timepicker-second").val(n), this.showMeridian && this.$widget.find("input.bootstrap-timepicker-meridian").val(this.meridian)) : (this.$widget.find("span.bootstrap-timepicker-hour").text(e), this.$widget.find("span.bootstrap-timepicker-minute").text(t), this.showSeconds && this.$widget.find("span.bootstrap-timepicker-second").text(n), this.showMeridian && this.$widget.find("span.bootstrap-timepicker-meridian").text(this.meridian))
            },
            updateFromWidgetInputs: function() {
                if (this.$widget === !1) return;
                var e = this.$widget.find("input.bootstrap-timepicker-hour").val() + ":" + this.$widget.find("input.bootstrap-timepicker-minute").val() + (this.showSeconds ? ":" + this.$widget.find("input.bootstrap-timepicker-second").val() : "") + (this.showMeridian ? this.$widget.find("input.bootstrap-timepicker-meridian").val() : "");
                this.setTime(e, !0)
            },
            widgetClick: function(t) {
                t.stopPropagation(), t.preventDefault();
                var n = e(t.target),
                    r = n.closest("a").data("action");
                r && this[r](), this.update(), n.is("input") && n.get(0).setSelectionRange(0, 2)
            },
            widgetKeydown: function(t) {
                var n = e(t.target),
                    r = n.attr("class").replace("bootstrap-timepicker-", "");
                switch (t.keyCode) {
                    case 9:
                        if (this.showMeridian && r === "meridian" || this.showSeconds && r === "second" || !this.showMeridian && !this.showSeconds && r === "minute") return this.hideWidget();
                        break;
                    case 27:
                        this.hideWidget();
                        break;
                    case 38:
                        t.preventDefault();
                        switch (r) {
                            case "hour":
                                this.incrementHour();
                                break;
                            case "minute":
                                this.incrementMinute();
                                break;
                            case "second":
                                this.incrementSecond();
                                break;
                            case "meridian":
                                this.toggleMeridian()
                        }
                        this.setTime(this.getTime()), n.get(0).setSelectionRange(0, 2);
                        break;
                    case 40:
                        t.preventDefault();
                        switch (r) {
                            case "hour":
                                this.decrementHour();
                                break;
                            case "minute":
                                this.decrementMinute();
                                break;
                            case "second":
                                this.decrementSecond();
                                break;
                            case "meridian":
                                this.toggleMeridian()
                        }
                        this.setTime(this.getTime()), n.get(0).setSelectionRange(0, 2)
                }
            },
            widgetKeyup: function(e) {
                (e.keyCode === 65 || e.keyCode === 77 || e.keyCode === 80 || e.keyCode === 46 || e.keyCode === 8 || e.keyCode >= 46 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) && this.updateFromWidgetInputs()
            }
        }, e.fn.timepicker = function(t) {
            var n = Array.apply(null, arguments);
            return n.shift(), this.each(function() {
                var r = e(this),
                    s = r.data("timepicker"),
                    o = typeof t == "object" && t;
                s || r.data("timepicker", s = new i(this, e.extend({}, e.fn.timepicker.defaults, o, e(this).data()))), typeof t == "string" && s[t].apply(s, n)
            })
        }, e.fn.timepicker.defaults = {
            defaultTime: "current",
            disableFocus: !1,
            disableMousewheel: !1,
            isOpen: !1,
            minuteStep: 15,
            modalBackdrop: !1,
            orientation: {
                x: "auto",
                y: "auto"
            },
            secondStep: 15,
            showSeconds: !1,
            showInputs: !0,
            showMeridian: !0,
            template: "dropdown",
            appendWidgetTo: "body",
            showWidgetOnAddonClick: !0
        }, e.fn.timepicker.Constructor = i
    })(e, window, document)
}), define("components/charts/EmbedDialogue", ["jquery", "backbone", "controls/Dialogue", "controls/Checkbox", "bootstrap.datepicker", "bootstrap.timepicker"], function(e, t, n, r) {
    var i = n.extend({
        events: {
            change: "onChange",
            keyup: "onChange",
            "mouseup pre": "selectCode"
        },
        className: n.prototype.className + " panel c9t-embed-dialogue",
        title: "HTML Embed Code",
        showClose: !0,
        showCancel: !1,
        initialize: function() {
            var t = {
                    format: "mm/dd/yyyy",
                    startDate: new Date(Date.UTC(2013, 11, 1)),
                    endDate: new Date,
                    autoclose: !0,
                    daysOfWeekDisabled: [6]
                },
                i = new Date(this.options.range.max);
            isNaN(i.getTime()) && (i = new Date), n.prototype.initialize.call(this), this.$body.append(["<p>Paste the code snippet below into your HTML to add a live, interactive " + this.options.settings.instrumentId + " chart to your website or blog.</p>", '<div class="c9t-live-control"></div>', '<div class="c9t-end-field">', '<label for="c9t-end-date">End date / time</label><div class="c9t-date-time-small">', '<div class="input-append date"><input type="text" class="span2"><span class="add-on"><i class="fa fa-th"></i></span></div>', '<div class="input-append bootstrap-timepicker"><input id="timepicker1" type="text" class="input-small"><span class="add-on"><i class="fa fa-clock-o"></i></span></div>', "</div></div>", '<div class="c9t-full-width-control"></div>', '<div class="c9t-width-field"><label for="c9t-width">Width</label><input type="text" id="c9t-width" /> <span>px</span><div class="c9t-width-warning fa fa-warning" title="Minimum width is 500px"></div></div>', '<div class="c9t-height-field"><label for="c9t-height">Height</label><input type="text" id="c9t-height" /> <span>px</span><div class="c9t-height-warning fa fa-warning" title="Minimum height is 200px"></div></div>'].join("")), this.live = new r({
                id: "c9t-end-date",
                $el: this.$el.find(".c9t-live-control"),
                label: "Live streaming prices",
                checked: !0
            }), this.live.on("change", this.onChange, this), this.$end = this.$el.find(".input-append.date").datepicker(t), this.$end.data("datepicker").setDate(i), this.$endTime = this.$el.find(".input-append.bootstrap-timepicker input"), this.$endTime.timepicker({
                defaultTime: i,
                showSeconds: !0,
                minuteStep: 5,
                secondStep: 5
            }), this.fullWidth = new r({
                $el: this.$el.find(".c9t-full-width-control"),
                label: "Flexible width",
                checked: !0
            }), this.fullWidth.on("change", this.onChange, this), this.$width = this.$el.find("#c9t-width").val(this.options.chartWidth), this.$widthWarning = this.$el.find(".c9t-width-warning").hide(), this.$widthWarning.tooltip({
                placement: "bottom",
                container: "body"
            }), this.$height = this.$el.find("#c9t-height").val(this.options.settings.height), this.$heightWarning = this.$el.find(".c9t-height-warning").hide(), this.$heightWarning.tooltip({
                placement: "bottom",
                container: "body"
            }), this.$code = e("<pre>"), this.onChange(), this.$body.append(this.$code)
        },
        onChange: function() {
            this.$end.parents(".c9t-end-field").toggle(!this.live.val()), this.$width.parents(".c9t-width-field").toggle(!this.fullWidth.val()), this.$code.text(this.getCode())
        },
        getCode: function() {
            var e = JSON.stringify(this.getSettings(), null, 8);
            return '<script data-c9t-chart>\n(function(d, w) {\n    var s=d.createElement("script"),e=d.getElementsByTagName("script")[0];\n    s.src="https://www.cloud9trader.com/0/scripts/shared/chart.js";\n    s.async=true;e.parentNode.insertBefore(s,e);w.c9td=w.c9td||[];\n    w.c9td.push(' + e.slice(0, e.length - 1) + "    });\n" + "})(document, window);\n" + "</script>"
        },
        getSettings: function() {
            var e = {},
                t = this.$end.data("datepicker").getUTCDate().toISOString().split("T")[0].split("-"),
                n = this.$endTime.data("timepicker"),
                r = n.hour % 12 + (n.getTime().split(" ")[1] === "PM" ? 12 : 0);
            return e.instrumentId = this.options.settings.instrumentId, e.interval = this.options.settings.interval, e.side = this.options.settings.side, this.live.val() || (e.end = new Date(t[0], t[1] - 1, t[2], r, n.minute, n.second)), !this.fullWidth.val() && parseInt(this.$width.val(), 10) && (e.width = parseInt(this.$width.val(), 10)), parseInt(this.$height.val(), 10) && (e.height = parseInt(this.$height.val(), 10)), e.side === "mid" && delete e.side, e.width && e.width < 500 ? (this.$widthWarning.show(), e.width = 500) : this.$widthWarning.hide(), e.height && e.height < 200 ? (this.$heightWarning.show(), e.height = 200) : this.$heightWarning.hide(), e
        },
        selectCode: function() {
            var e = this.$code[0],
                t, n;
            document.body.createTextRange ? (t = document.body.createTextRange(), t.moveToElementText(e), t.select()) : window.getSelection && (n = window.getSelection(), t = document.createRange(), t.selectNodeContents(e), n.removeAllRanges(), n.addRange(t))
        }
    });
    return i
}), define("controls/formatters", ["underscore", "jquery", "registry", "utils"], function(e, t, n, r) {
    var i, s, o, u;
    n.on("register:settings", function(e) {
        u = e.get("utc-dates"), e.on("change:utc-dates", function(e, t) {
            u = t
        })
    });
    var a = r.Date.seconds,
        f = {
            0: "Every tick",
            1: "Minute data",
            2: "2 min",
            5: "5 min",
            10: "10 min",
            15: "15 min",
            30: "30 min",
            60: "1 hour",
            120: "2 hour",
            240: "4 hour",
            480: "8 hour",
            720: "12 hour",
            1440: "1 day"
        },
        l = {
            0: "Tick",
            1: "Minute",
            2: "2m",
            5: "5m",
            10: "10m",
            15: "15m",
            30: "30m",
            60: "1h",
            120: "2h",
            240: "4h",
            480: "8h",
            720: "12h",
            1440: "1d"
        };
    return {
        accountCurrency: function(e) {
            var t = n.get("account");
            return !s && t.get("currencySymbol") && (s = t.get("currencySymbol")), !i && t.get("currency") && (i = t.get("currency")), !o && t.get("currencyPrecision") && (o = t.get("currencyPrecision")), r.Number.formatMoney(e, s || i, o)
        },
        accountCurrencyLarge: function(e) {
            var t = n.get("account");
            return !s && t.get("currencySymbol") && (s = t.get("currencySymbol")), !i && t.get("currency") && (i = t.get("currency")), r.Number.formatMoney(e, s || i, 0)
        },
        numberSeparators: function(e) {
            return r.Number.formatMoney(e, "", 0)
        },
        percentage: function(t, n) {
            return typeof n != "number" || e.isNaN(n) ? "-" : n.toFixed(t) + "%"
        },
        date: function(e, t) {
            return r.Date.format(t, e)
        },
        dateUTC: function(e, t) {
            return r.Date.formatUTC(t, e)
        },
        dateUserSetting: function(e, t) {
            return u ? r.Date.formatUTC(t, e) : r.Date.format(t, e)
        },
        duration: function(e) {
            var t = e / 1e3,
                n = Math.floor(t / a.year),
                r = Math.floor(t % a.year / a.month),
                i = Math.floor(t % a.month / a.day),
                s = Math.floor(t % a.day / a.hour),
                o = Math.floor(t % a.hour / a.minute),
                u = Math.floor(t % a.minute / a.second),
                f = [n ? n + "y " : "", r ? r + "m " : "", i ? i + "d " : "", s ? s + "h " : "", o && !r ? o + "m " : "", u && !r && !n ? u + "s " : ""];
            return f.join("")
        },
        precision: function(e, t) {
            return t.toFixed(2)
        },
        stringify: function(e, t) {
            return JSON.stringify(t, null, e)
        },
        intervalShort: function(e) {
            var t = r.config.intervals[e];
            return t ? t.readableShort : e
        },
        intervalMid: function(e) {
            var t = r.config.intervals[e];
            return t ? t.readableMid : e
        },
        interval: function(e) {
            var t = r.config.intervals[e];
            return t ? t.readable : e
        },
        resolutionShort: function(e) {
            return l[e] || e
        },
        resolution: function(e) {
            return f[e] || e
        }
    }
}), define("components/charts/PriceChart", ["underscore", "jquery", "backbone", "./PriceChartSettings", "./TimeChart", "./PriceIntervalSeries", "price", "./PriceTickSeries", "./PriceLine", "./PositionsSeriess", "./EmbedDialogue", "utils", "controls/formatters", "registry"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, p) {
    var d = n.View.extend({
        className: "c9t-chart",
        events: {
            "click .c9t-chart-button-embed": "onEmbedClick"
        },
        initialize: function() {
            var e = p.get("instruments");
            this.$chart = t("<div>");
            if (!e.isSynced()) return e.once("sync", this.createPriceSeries.bind(this, this.options), this);
            this.createPriceSeries(this.options)
        },
        createPriceSeries: function(e) {
            this.instrument = e.instrument || p.get("instruments").get(e.instrumentId), typeof e.interval == "number" && (e.interval = c.config.intervalsInverse[e.interval * 60]), this.settings = e, e.interval !== "Tick" ? (this.dataSeries = [{
                series: new s({
                    name: this.instrument.get("displaySymbol") + " " + h.intervalShort(e.interval),
                    data: e.priceData,
                    dataSettings: {
                        instrumentId: this.instrument.id,
                        side: e.side,
                        interval: e.interval,
                        start: e.start,
                        end: e.end,
                        period: e.period,
                        periods: e.periods
                    },
                    type: e.type,
                    height: this.options.height - (this.options.settings ? 20 : 0)
                })
            }], e.start = this.dataSeries[0].series.options.dataSettings.start, this.render()) : (this.options.chartConfig = this.options.chartConfig || {}, this.options.chartConfig.navigator = {
                enabled: !1
            }, e.start = new Date((e.end || new Date) - c.Date.milliseconds.minute * 30), this.ticks = new o.Ticks(e), this.ticks.fetch(), this.ticks.once("sync", this.onTicksFetched, this), this.ticks.once("error", this.onTicksErrored, this))
        },
        onTicksFetched: function() {
            this.dataSeries = [{
                series: new u(this.ticks, {
                    side: "ask",
                    instrumentId: this.settings.instrumentId,
                    chartConfig: {
                        name: "Ask"
                    }
                })
            }, {
                series: new u(this.ticks, {
                    side: "bid",
                    instrumentId: this.settings.instrumentId,
                    chartConfig: {
                        name: "Bid"
                    }
                })
            }], this.render()
        },
        onTicksErrored: function() {
            this.renderSettings()
        },
        render: function() {
            this.$el.empty(), this.options.plotLine && !this.options.end && (this.priceLine = new a(this.instrument.id, this.settings.side)), this.chart = new i({
                width: this.options.width || null,
                height: this.options.height || null,
                unitHeight: this.options.unitHeight,
                dataSeries: this.dataSeries,
                plotLine: this.priceLine || !1,
                spinner: this.options.spinner,
                min: this.options.start,
                max: this.options.end,
                range: this.options.range,
                navigator: this.options.navigator,
                liveProcession: !this.settings.end,
                liveScrollRange: this.settings.interval === "Tick" ? 6e5 : null,
                chartConfig: this.options.chartConfig,
                weekendBandsColor: this.options.weekendBandsColor,
                tooltipYPosition: this.options.tooltipYPosition,
                ordinal: this.options.ordinal
            }), this.renderSettings(), this.$chart.html(this.chart.$el), this.$el.append(this.$chart), this.chart.once("ready", this.onChartReady, this), this.chart.on("change-grouping", this._onDataGroupingChange, this), this.options.positions && this.renderPositions()
        },
        renderSettings: function() {
            this.options.settings && (this.settingsBar = new r({
                chart: this,
                settings: this.options.settings,
                dataSettings: {
                    start: this.settings.start,
                    end: this.settings.end,
                    instrumentId: this.settings.instrumentId,
                    side: this.settings.side,
                    interval: this.settings.interval,
                    type: this.settings.type,
                    period: this.settings.period,
                    periods: this.settings.periods,
                    indicatorConfig: this.settings.indicatorConfig
                }
            }), this.$el.append(this.settingsBar.$el), this.listenTo(this.settingsBar, "change:instrumentId", this.onSettingChange), this.listenTo(this.settingsBar, "change:interval", this.onSettingChange), this.listenTo(this.settingsBar, "change:side", this.onSideChange), this.listenTo(this.settingsBar, "change:type", this.onTypeChange), this.listenTo(this.settingsBar, "change:indicatorConfig", this.onIndicatorsChange))
        },
        renderPositions: function() {
            var e = t("<div>", {
                "class": "max-exceeded"
            });
            this.positionSeriess && this.positionSeriess.tearDown(), this.positionSeriess = new f({
                chart: this.chart,
                instrumentId: this.instrument.id,
                positions: this.options.positions,
                $maxWarning: e,
                maxInView: 100
            }), this.$el.append(e)
        },
        onChartReady: function() {
            this.trigger("ready")
        },
        addSeries: function(e, t, n, r, i, s) {
            return this.chart.addSeries(e, t, n, r, i, s)
        },
        addSeriess: function(e) {
            if (!this.chart.ready) return this.chart.once("ready", this.addSeriess.bind(this, e));
            e.seriess.forEach(function(t, n) {
                var r = !0,
                    i;
                e.seriesConfig && e.seriesConfig[n] && (r = typeof e.seriesConfig[n].overlay == "undefined" ? !0 : e.seriesConfig[n].overlay), r ? this.addSeries(t, !0, t.opposite, e, e.studyAxisConfig) : (e.studyYAxisId && (i = e.studyYAxisId + (t.opposite ? "-opposite" : "")), this.addSeries(t, !1, t.opposite, e, e.studyAxisConfig, i))
            }, this)
        },
        onContainerResize: function(e, t) {
            this.options.width = e, this.options.height = t, this.resize(e, t)
        },
        resize: function(e, t) {
            this.chart.resize(e, t)
        },
        onSettingChange: function(t, n) {
            delete this.options.start, this.settings[t] = n, this.chart.tearDown(), this.priceLine && this.priceLine.tearDown(), this.dataSeries.forEach(function(e) {
                e.series.tearDown()
            }), this.$el.empty(), this.createPriceSeries(this.options), this.$chart.html(this.chart.$el), this.trigger("change:" + t, n), this.trigger("change:settings", e.pick(this.settings, "instrumentId", "interval", "side", "type"))
        },
        onSideChange: function(e, t) {
            this.settings.side = t, this.dataSeries[0].series.changeSide(t), this.trigger("change:settings", this.settings)
        },
        onTypeChange: function(e, t) {
            this.settings.type = t, this.dataSeries[0].series.changeType(t), this.trigger("change:settings", this.settings)
        },
        onIndicatorsChange: function(e) {
            this.settings.indicatorConfig = e, this.trigger("change:settings", this.settings)
        },
        onEmbedClick: function() {
            var e = new l({
                settings: this.settings,
                range: this.chart.getRange(),
                chartWidth: this.$el.width()
            });
            e.show()
        },
        createSnapshot: function(e) {
            return this.chart.createSnapshot(e)
        },
        _onDataGroupingChange: function(e) {
            var t = c.config.intervalsInverse[e / 1e3],
                n;
            if (!t) return;
            this.options.interval === t ? n = c.config.intervals[this.options.interval].readableMid : n = '<i class="fa fa-search-minus"></i> ' + c.config.intervals[t].readableMid, this.settingsBar && this.settingsBar.setIntervalDropdownTitle(n), this.trigger("change-grouping", e, n)
        },
        tearDown: function() {
            this.$chart.remove(), this.priceLine && this.priceLine.tearDown(), this.chart && this.chart.tearDown(), this.stopListening()
        }
    });
    return d
}), define("sockets/Model", ["underscore", "jquery", "backbone", "socketio", "../controls/Events", "utils", "registry"], function(e, t, n, r, i, s, o) {
    var u = {
            brokers: "Broker",
            demoBroker: "Demo Broker",
            indicators: "Technical Indicators",
            tradingSessions: "Trading sessions",
            backtestController: "Backtests"
        },
        a = n.Model.extend(t.extend({
            idAttribute: "server",
            initialize: function() {
                var e = o.get("user");
                this.autoReconnectAttempts = 0, this.connected = !1, e ? this.listenForAuthExtension(e) : o.once("register:user", this.listenForAuthExtension, this)
            },
            listenForAuthExtension: function(e) {
                e.on("token-extended", this._reAuthenticate, this)
            },
            start: function() {
                var e = this.get("server"),
                    n = this.get("query");
                if (this.socket) return;
                this.socket = r.connect(o.get("hosts")[e], {
                    secure: !0,
                    query: n ? t.param(n) : null
                }), this.friendly = u[e], this.socket.on("connect", this._onConnect.bind(this)), this.socket.on("disconnect", this._onDisconnect.bind(this)), this.socket.on("connecting", function() {
                    this.set("status", "Connecting...")
                }.bind(this)), this.socket.on("error", function(e) {
                    this.set("status", "Error"), console.debug("[ERROR]", this.friendly, "error event", e)
                }.bind(this)), this.socket.on("connect_error", function(e) {
                    console.debug("[ERROR]", this.friendly, "connect_error event", e)
                }.bind(this)), this.socket.on("connect_failed", function() {
                    this.set("status", "Connection failed")
                }.bind(this)), this.socket.on("reconnect", function() {
                    this.set("status", "Reconnected")
                }.bind(this)), this.socket.on("reconnecting", function(e) {
                    this.set("status", "Reconnecting... " + e)
                }.bind(this)), this.socket.on("reconnect_failed", function() {
                    this.set("status", "Reconnection failed")
                }.bind(this)), this.socket.on("m", this._onMessage.bind(this))
            },
            get: function(e) {
                return e === "name" ? u[this.get("server")] + " Server" : n.Model.prototype.get.call(this, e)
            },
            _onConnect: function() {
                this.isReconnect && (this.isReconnect = !1), this.set("status", "Connected"), this._setConnected(!0)
            },
            reconnect: function() {
                var e = Math.round(Math.pow(1.9805, Math.floor(this.autoReconnectAttempts))),
                    t = e * 1e3;
                if (this.autoReconnectAttempts > 10) {
                    this.set("status", "Connection failed permanently");
                    return
                }
                this.set("status", "Attempting reconnect in " + e + " second" + (e > 1 ? "s" : "")), setTimeout(function() {
                    this.autoReconnectAttempts++, this.isReconnect = !0, this.socket.connect()
                }.bind(this), t)
            },
            send: function() {
                this.socket.emit.apply(this.socket, arguments)
            },
            _setConnected: function(e) {
                !this.connected && e ? (this.set("connected", !0), this.trigger("connected")) : this.connected && !e && (this.set("connected", !1), this.trigger("disconnected")), this.connected = e
            },
            isConnected: function() {
                return this.connected
            },
            _onMessage: function() {
                this.trigger.apply(this, arguments)
            },
            _reAuthenticate: function() {
                this.send("reauth", s.cookie.read("token"))
            },
            _onDisconnect: function() {
                this.set("status", "Disconnected"), this.socket.removeListener("heartbeat", this.heartbeatHandler), this._setConnected(!1)
            }
        }, i));
    return a
}), define("sockets/collection", ["jquery", "backbone", "./Model"], function(e, t, n) {
    var r = t.Collection.extend({
        model: n,
        initialize: function() {
            this.synced = !0
        }
    });
    return new r
}), define("controls/TableCell", ["jquery", "backbone"], function(e, t) {
    var n = t.View.extend({
        tagName: "td",
        initialize: function() {
            this.model = this.options.model, typeof this.options.key == "object" ? (this.options.key.forEach(function(e) {
                this.model.on("change:" + e, this.render.bind(this, e), this)
            }.bind(this)), this.render(this.options.key[0])) : (this.model.on("change:" + (this.options.baseKey || this.options.key), this.render.bind(this, this.options.key), this), this.render(this.options.key))
        },
        render: function(e) {
            var t = typeof this.model.get(e) != "undefined" && this.model.get(e) !== null ? this.model.get(e) : "";
            this.options.formatter && (t = this.options.formatter(t)), this.options.renderer ? this.options.getRenderer(this.options.renderer)(t, this.$el, this.model) : this.$el[this.options.html ? "html" : "text"](t), this.options.suppressHoverTitle || (this.options.baseKey ? this.$el.attr("title", this.model.get(this.options.baseKey)) : this.$el.attr("title", t)), this.options.align && this.$el.addClass(this.options.align + "-align")
        }
    });
    return n
}), define("controls/ActionBar", ["underscore", "jquery", "backbone", "toastr", "bootstrap.tooltip"], function(e, t, n, r) {
    var i = n.View.extend({
        className: "c9t-actions",
        initialize: function() {
            for (var e in this.model.collection.actions) this.model.collection.actions[e].listenTo && this.model.on("change:" + this.model.collection.actions[e].listenTo, this.render, this);
            this.options.delegateEvents || this.$el.on("click", "i, button", this.onClick.bind(this)), this.render()
        },
        render: function() {
            this.$el.empty();
            for (var e in this.model.collection.actions)
                if (typeof this.model.collection.actions[e] == "function") this.$el.append(t("<button>", {
                    "class": "btn btn-small btn-info"
                }).text(e).attr("data-action", e));
                else if (!this.model.collection.actions[e].display || this.model.collection.actions[e].display.call(this.model.collection, this.model)) this.model.collection.actions[e].icon ? this.$el.append(t("<i>", {
                "class": "fa " + this.model.collection.actions[e].icon,
                title: e
            }).tooltip({
                container: "body",
                placement: this.model.collection.actions[e].tooltipPlacement || "top"
            })) : this.$el.append(t("<button>", {
                "class": "btn btn-small btn-" + (this.model.collection.actions[e].buttonType || "info")
            }).text(e))
        },
        onClick: function(e) {
            var n = t(e.target),
                r = this.model.collection.actions[n.text() || n.attr("title") || n.attr("data-original-title")];
            n.tooltip("hide"), typeof r == "function" ? r.call(this.model.collection, this.model, n) : r.onClick.call(this.model.collection, this.model, n)
        }
    });
    return i
}), define("controls/TableRow", ["jquery", "backbone", "./TableCell", "./ActionBar"], function(e, t, n, r) {
    var i = t.View.extend({
        tagName: "tr",
        initialize: function() {
            this.$el.attr("data-id", this.model.id || this.model.cid), this.options.selected && this.$el.addClass("selected"), this.model.on("change:filtered", this.onFilteredChange, this), this.model.once("destroy", this.onDestroy, this), this.model.on("updated-foldout", this.onFoldoutUpdated, this), this.render()
        },
        render: function() {
            this.$el.empty(), this.options.foldout && this.$el.html(e("<td>", {
                "class": "expander"
            }).html(e("<i>", {
                "class": "expandable-icon fa fa-angle-right"
            }))), this.options.fieldMap.forEach(function(e) {
                this.$el.append((new n({
                    model: this.model,
                    key: e.key,
                    baseKey: e.baseKey,
                    html: e.html,
                    formatter: e.formatter,
                    renderer: e.renderer,
                    getRenderer: this.options.getRenderer,
                    align: e.align,
                    suppressHoverTitle: e.suppressHoverTitle,
                    onClick: e.onClick
                })).$el)
            }, this), this.model.collection.actions && (this.$actions = e("<td>", {
                "class": "c9t-actions"
            }), this.$el.append(this.$actions), this.actionBar = new r({
                model: this.model,
                delegateEvents: !0
            }), this.$actions.html(this.actionBar.$el)), this.model.expanded && (this.$el.addClass("expanded"), setTimeout(this.expand.bind(this), 0))
        },
        toggle: function() {
            this.expanded ? (this.contract(), this.options.onContract && this.options.onContract(this.model)) : (this.expand(), this.options.onExpand && this.options.onExpand(this.model))
        },
        expand: function() {
            this.$foldout || (this.$foldoutDiv = e("<div>"), this.$foldout = e("<tr>", {
                "class": "foldout"
            }).hide(), this.$foldout.html(e("<td>", {
                colspan: this.options.fieldMap.length + 1 + (this.model.collection.actions ? 1 : 0)
            }).html(this.$foldoutDiv)), this.$el.after("<tr></tr>", this.$foldout)), this.options.foldout(this.model, this.$foldoutDiv, this.$foldout), this.$el.find(".expandable-icon").addClass("fa-angle-down"), this.$el.addClass("expanded"), this.$foldout.show(), this.expanded = !0
        },
        contract: function() {
            this.$el.find(".expandable-icon").removeClass("fa-angle-down"), this.$el.removeClass("expanded"), this.$foldout.hide(), this.expanded = !1
        },
        onFoldoutUpdated: function() {
            this.expanded ? this.options.foldout.call(this, this.model, this.$foldoutDiv, this.$foldout) : this.expand()
        },
        select: function() {
            this.$el.addClass("selected")
        },
        onFilteredChange: function() {
            this.$el.toggleClass("filtered", this.model.filtered)
        },
        onDestroy: function() {
            this.options.table.onItemRemoved(this.model.id || this.model.cid), this.tearDown()
        },
        tearDown: function() {
            this.model.off(null, null, this), this.remove()
        }
    });
    return i
}), define("controls/Table", ["underscore", "jquery", "backbone", "./TableRow", "bootstrap.tooltip"], function(e, t, n, r) {
    var i = n.View.extend({
        className: "table-container",
        events: {
            "click th": "onHeaderClick",
            "click td.c9t-actions button": "onActionClick",
            "click th.c9t-actions button": "onHeaderActionClick",
            "click td.c9t-actions i": "onActionClick",
            "click th.c9t-actions i": "onHeaderActionClick",
            "click td.expander": "onExpanderClick",
            "click td.load-more a": "onLoadMoreClick",
            "click tbody tr": "onRowClick"
        },
        initialize: function() {
            var n = t("<tr>"),
                r, i, s;
            this.render = e.throttle(this.render, 1e3), this.$table = t("<table>", {
                "class": "table table-striped table-condensed"
            }).html(t("<thead>").append(n)), this.foldout && n.append('<th class="col-expander"></th>'), this.fieldMap.forEach(function(r) {
                var i = r.readableFn ? this[r.readableFn]() : r.readable,
                    s;
                this.options.sort && e(this.options.sort).find(function(e) {
                    if (e.key === (r.baseKey || r.key)) return s = e.direction, !0
                }), i = (s ? (s === "Ascending" ? this.upArrow : this.downArrow) + " " : "") + (i || ""), n.append(t("<th>", {
                    "data-key": r.baseKey || r.key,
                    "class": r.align ? r.align + "-align" : "",
                    title: i
                }).text(i))
            }, this);
            if (this.collection.actions) {
                r = t("<th>", {
                    "class": "c9t-actions"
                });
                if (this.headerActions) {
                    i = t("<div>", {
                        "class": "c9t-action-bar"
                    }), r.html(i);
                    for (var o in this.headerActions) typeof this.headerActions[o] == "function" || !this.headerActions[o].icon ? i.append(t("<button>", {
                        "class": "btn btn-small btn-info"
                    }).text(o)) : i.append(t("<i>", {
                        "class": "fa " + this.headerActions[o].icon,
                        title: o
                    }).tooltip({
                        container: "body"
                    }))
                }
                n.append(r)
            }
            this.$tableBody = t("<tbody>"), (this.$body || this.$el).append(this.$table.append(this.$tableBody)), this.collection.on("pending", this.onPending, this), this.collection.on("status", this.onStatus, this), this.collection.on("sync reset", this.onSync, this), this.collection.on("add", this.onAdd, this), this.collection.on("remove", this.onRemove, this);
            if (this.options.where)
                for (s in this.options.where) this.collection.on("change:" + s, this.onChangeFilterField, this);
            if (this.options.without)
                for (s in this.options.without) this.collection.on("change:" + s, this.onChangeFilterField, this);
            this.sort = this.sort || this.options.sort || [], this.$table.hide(), this.$emptyText = t("<div>", {
                "class": "table-empty"
            }), this.disableEmptyText || this.$el.append(this.$emptyText), this.collection.isSynced() ? this.requestRender() : (this.$spinner = t('<i class="c9t-spinner fa fa-refresh fa-spin"></i>'), this.$el.append(this.$spinner)), this.collection.on("error", this.onError, this), this.collection.isSynced() && this.collection.isErrored() && this.onError(this.collection.errorMessage)
        },
        onPending: function(e) {
            this.$emptyText.text(e), this.$emptyText.show(), this.$spinner && this.$spinner.remove()
        },
        onStatus: function(e, t) {
            e === "ok" ? this.container.removeStatusMessage() : this.container.showStatusMessage(e, t)
        },
        onError: function(e) {
            this.$emptyText.empty(), this.$spinner && this.$spinner.remove(), this.$errorSymbol && this.$errorSymbol.remove(), this.$errorSymbol = t('<i class="fa fa-warning c9t-failure"></i>'), this.$el.append(this.$errorSymbol), e && this.$errorSymbol.tooltip({
                title: e,
                placement: "bottom"
            })
        },
        render: function(e, t) {
            var n, i = 0;
            if (!this.collection.isSynced()) return;
            this.$spinner && this.$spinner.remove();
            if (e === "sync" && t) {
                this.$errorSymbol && this.$errorSymbol.remove();
                return
            }
            this.$tableBody.empty(), this.$tableBody.remove(), this.tableRows = {}, this.options.where ? n = this.collection.where(this.options.where) : n = this.collection.models, this.options.without && (n = n.filter(function(e) {
                var t = !0;
                for (var n in this.options.without) e.get(n) === this.options.without[n] && (t = !1);
                return t
            }.bind(this))), n.length && (this.sort && this.sort.forEach(function(e) {
                n.sort(function(t, n) {
                    var r = t.get(e.key) > n.get(e.key) ? 1 : -1;
                    return e.direction === "Descending" ? -r : r
                })
            }), this.$table.show(), this.$emptyText.hide(), this.tableRows = {}, n.forEach(function(e) {
                if (e.filtered) return;
                i++, this.tableRows[e.id || e.cid] = new r({
                    table: this,
                    model: e,
                    fieldMap: this.fieldMap,
                    selected: e === this.selected,
                    getRenderer: this.getRenderer.bind(this),
                    foldout: this.foldout,
                    onExpand: this.onExpand,
                    onContract: this.onContract
                }), this.$tableBody.append(this.tableRows[e.id || e.cid].$el), e.isSelected && this.select && this.select(e)
            }, this)), i === 0 && (this.$table.hide(), this.$emptyText.text(this.options.emptyText || "No items"), this.$emptyText.show()), this.collection.moreData && this.$tableBody.append('<tr><td class="load-more" colspan="' + this.$table.find("thead th").length + '"><i class="fa fa-refresh fa-spin"></i> <a href="#">Load more...</a></td></tr>'), this.$table.append(this.$tableBody), this.rowCount = n.length, this.container && this.container.setHeaderCount(n.length), this.pendingRender = !1, this.rendered = !0, this.trigger("rendered")
        },
        updateHeaderCount: function() {
            this.container.setHeaderCount(this.$tableBody.find("tr").length)
        },
        getRowCount: function() {
            return this.rowCount
        },
        requestRender: function(e) {
            this.render(e)
        },
        onSync: function(e) {
            this.render("sync", !(e instanceof n.Collection))
        },
        onReset: function() {
            this.render("render", !1)
        },
        onAdd: function(e, t) {
            if (t && !t.isSynced()) return;
            this.render("add", !0)
        },
        onRemove: function(e, t) {
            var n = this.tableRows[e.id];
            n || (n = this.tableRows[e.cid]), n && n.remove()
        },
        onChangeFilterField: function() {
            this.render("change", !0)
        },
        onHeaderClick: function(n) {
            var r = t(n.target),
                i = r.attr("data-key"),
                s = "Ascending";
            e.some(this.sort, function(e, t) {
                if (e.key === i) return s = e.direction === "Descending" ? "Ascending" : "Descending", this.sort.splice(t, 1), !0
            }, this), this.sort.push({
                key: i,
                direction: s
            }), this.$table.find("th").each(function(e, n) {
                var r = t(n);
                r.text(r.text().replace(this.upArrow, "").replace(this.downArrow, ""))
            }.bind(this)), r.html((s === "Ascending" ? this.upArrow : this.downArrow) + r.text()), this.requestRender()
        },
        onActionClick: function(e) {
            var n = this.collection.get(t(e.target).closest("tr").attr("data-id"));
            this.tableRows[n.id || n.cid].actionBar.onClick(e), e.stopPropagation()
        },
        onHeaderActionClick: function(e) {
            var n = t(e.target),
                r = this.headerActions[n.text() || n.attr("title") || n.attr("data-original-title")];
            typeof r == "function" ? r.call(this.collection, this.collection, n) : r.onClick.call(this.collection, this.collection, n), e.stopPropagation()
        },
        getRenderer: function(e) {
            return typeof e == "function" ? e : this[e].bind(this)
        },
        onExpanderClick: function(e) {
            var n = t(e.target).closest("tr").attr("data-id");
            return this.tableRows[n].toggle()
        },
        onLoadMoreClick: function(e) {
            t(e.currentTarget).closest("td").addClass("loading"), e.preventDefault(), this.collection.fetchMore()
        },
        onRowClick: function(e) {
            var n = t(e.target).closest("tr"),
                r = n.attr("data-id");
            if (typeof r == "undefined") return;
            this.trigger("row-click", this.collection.get(r)), this.options.onSelection ? this.options.onSelection(this.collection.get(r), n) : this.onSelection && this.onSelection(this.collection.get(r), n), this.expandOnClick && !t(e.target).closest(".expander").length && this.onExpanderClick(e)
        },
        onItemRemoved: function(t) {
            delete this.tableRows[t], e.keys(this.tableRows).length === 0 && (this.$table.hide(), this.$emptyText.text(this.options.emptyText || "No items"), this.$emptyText.show())
        },
        tearDown: function() {
            e.each(this.tableRows, function(e) {
                e.tearDown()
            }), this.collection.off(null, null, this), this.remove()
        },
        upArrow: String.fromCharCode(8593),
        downArrow: String.fromCharCode(8595)
    });
    return i
}), define("sockets/StatusView", ["jquery", "backbone", "../controls/Table", "../controls/PopoutPanelMixin", "./collection", "registry", "bootstrap.tooltip"], function(e, t, n, r, i, s) {
    var o = n.extend(e.extend({
        className: "status-view",
        fieldMap: [{
            key: "name",
            readable: "Server"
        }, {
            key: "status",
            readable: "Status"
        }, {
            key: "connected",
            readable: "",
            renderer: "statusLightRenderer"
        }],
        initialize: function() {
            this.collection = i, i.on("change:connected", this.onConnectedChange, this), r.call(this), n.prototype.initialize.call(this), this.$status = e("<span>"), this.$light = e("<div>", {
                "class": "status-light"
            }), this.brokerConnection = s.get("broker-connection"), this.brokerConnection.on("socket-connected", this.renderBrokerStatus, this), this.brokerConnection.on("socket-disconnected", this.renderBrokerStatus, this), this.brokerConnection.on("connected", this.renderBrokerStatus, this), this.brokerConnection.on("disconnected", this.renderBrokerStatus, this), this.$header.append(this.$status, this.$light), this.renderBrokerStatus(), this.onConnectedChange(), this.$light.tooltip({
                placement: "bottom",
                title: "Socket connections"
            })
        },
        renderBrokerStatus: function() {
            this.$light.removeClass("connected"), this.$light.removeClass("disconnected"), this.$status.empty(), this.brokerConnection.isConnected() === !0 ? (this.$light.addClass("connected"), this.$status.hide()) : this.brokerConnection.isSocketConnected() === !0 ? (this.$status.text("BROKER UNAVAILABLE"), this.$status.show()) : (this.$light.addClass("disconnected"), this.$status.text("BROKER DISCONNECTED"), this.$status.show())
        },
        onConnectedChange: function() {
            var e = i.size() - i.where({
                connected: !0
            }).length;
            this.$light.toggleClass("blink", !!e)
        },
        statusLightRenderer: function(t, n) {
            var r = e("<div>", {
                "class": "status-light"
            });
            t === !0 ? r.addClass("connected") : t === !1 && r.addClass("disconnected"), n.html(r)
        }
    }, r.prototype));
    return o
}), define("sockets/main", ["./collection", "./Model", "./StatusView"], function(e, t, n) {
    return {
        add: e.add.bind(e),
        get: e.get.bind(e),
        Model: t,
        StatusView: n
    }
}), define("sockets", ["sockets/main"], function(e) {
    return e
}), define("brokerConnection/main", ["underscore", "backbone", "sockets", "../utils", "toastr"], function(e, t, n, r, i) {
    function u() {}
    var s = 1e4,
        o = 1e4;
    return u.prototype.initialize = function(e) {
        this.socket = e, this.id = e.get("query").connectionId || e.get("query").currency, this.requestPrefix = r.String.randomKey(5) + "/", this.requestCount = 0, this.subscriptions = {}, e.on("connected", this._onSocketConnected, this), e.on("disconnected", this._onSocketDisconnected, this), e.on(this.id + "/connected", this._onBrokerConnected, this), e.on(this.id + "/disconnected", this._onBrokerDisconnected, this), e.on("error", this._onSocketError, this), this.connected = !1, this.socketConnected = e.isConnected(), this._setConnected(), this._requestBrokerConnected()
    }, e.extend(u.prototype, t.Events), u.prototype.getType = function() {
        return this.socket.get("type")
    }, u.prototype._onSocketConnected = function() {
        this.socketConnected = !0, this.trigger("socket-connected"), this._setConnected()
    }, u.prototype._onSocketDisconnected = function() {
        this.socketConnected = !1, this.brokerConnected = !1, this.trigger("socket-disconnected"), this._setConnected(), this._requestBrokerConnected()
    }, u.prototype._onBrokerConnected = function() {
        this.brokerConnected = !0, this._setConnected()
    }, u.prototype._onBrokerDisconnected = function() {
        this.brokerConnected = !1, this._setConnected()
    }, u.prototype._setConnected = function() {
        !this.connected && this.socketConnected && this.brokerConnected ? (this.connected = !0, this.trigger("connected")) : this.connected && (!this.socketConnected || !this.brokerConnected) && (this.connected = !1, this.trigger("disconnected"), this._resetSubscriptions())
    }, u.prototype.isSocketConnected = function() {
        return this.socketConnected
    }, u.prototype.isConnected = function() {
        return this.connected
    }, u.prototype._send = function() {
        this.socket.send.apply(this.socket, ["m", this.id].concat(Array.prototype.slice.call(arguments)))
    }, u.prototype._requestBrokerConnected = function(e, t) {
        var n;
        if (!this.socketConnected) return this.once("socket-connected", this._requestBrokerConnected.bind(this, e, t));
        this._send("request-connected"), this.socket.waitFor(this.id + "/connected", function(e) {
            e === "timeout" && !n && i.error("Request for broker connection status timed out"), n = !0
        }, this, 3e3), this.socket.waitFor(this.id + "/disconnected", function(e) {
            e === "timeout" && !n && i.error("Request for broker connection status timed out"), n = !0
        }, this, 3e3)
    }, u.prototype.requestStatus = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.requestStatus.bind(this, e, t));
        n = this.requestPrefix + this.requestCount++, this._send("request-status", n), this.socket.waitFor(n, e, t, 3e3)
    }, u.prototype.subscribeToStatus = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.subscribeToStatus.bind(this, e, t));
        this.subscriptions.status ? (this.subscriptions.status.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.status.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.status = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToStatus"
        }, this._send("subscribe-status", n), this.socket.on(n, e, t))
    }, u.prototype.requestAccount = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.requestAccount.bind(this, e, t));
        n = this.requestPrefix + this.requestCount++, this._send("request-account", n), this.socket.waitFor(n, e, t, 3e3)
    }, u.prototype.requestCollateral = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.requestCollateral.bind(this, e, t));
        n = this.requestPrefix + this.requestCount++, this._send("request-collateral", n), this.socket.waitFor(n, e, t, 3e3)
    }, u.prototype.subscribeToCollateral = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.subscribeToCollateral.bind(this, e, t));
        this.subscriptions.collateral ? (this.subscriptions.collateral.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.collateral.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.collateral = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToCollateral"
        }, this._send("subscribe-collateral", n), this.socket.on(n, e, t))
    }, u.prototype.requestInstruments = function(e, t) {
        var n;
        n = this.requestPrefix + this.requestCount++, this._send("request-instruments", n), this.socket.waitFor(n, e, t, 3e3)
    }, u.prototype.subscribeToInstruments = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.subscribeToInstruments.bind(this, e, t));
        this.subscriptions.instruments ? (this.subscriptions.instruments.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.instruments.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.instruments = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToInstruments"
        }, this._send("subscribe-instruments", n), this.socket.on(n, e, t))
    }, u.prototype.subscribeToOrders = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.subscribeToOrders.bind(this, e, t));
        this.subscriptions.orders ? (this.subscriptions.orders.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.orders.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.orders = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToOrders"
        }, this._send("subscribe-orders", n), this.socket.on(n, e, t))
    }, u.prototype.requestOpenPositions = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.requestOpenPositions.bind(this, e, t), t);
        n = this.requestPrefix + this.requestCount++, this._send("request-open-positions", n), this.socket.waitFor(n, e, t, 5e3)
    }, u.prototype.subscribeToPositions = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.subscribeToPositions.bind(this, e, t));
        this.subscriptions.positions ? (this.subscriptions.positions.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.positions.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.positions = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToPositions"
        }, this._send("subscribe-positions", n), this.socket.on(n, e, t))
    }, u.prototype.requestPosition = function(e, t, n) {
        var r;
        if (!this.connected) return this.once("connected", this.requestPosition.bind(this, e, t, n));
        r = this.requestPrefix + this.requestCount++, this._send("request-position", r, e), this.socket.waitFor(r, t, n, 3e3)
    }, u.prototype.requestPriceSnapshot = function(e, t, n, r) {
        var i;
        if (r) return t.call(n, "Connection timeout on request for " + e.id);
        if (!this.socketConnected) return this.waitFor("socket-connected", this.requestPriceSnapshot.bind(this, e, t, n), n, s);
        i = this.requestPrefix + this.requestCount++, this._send("request-price-snapshot", i, e.id), this.socket.waitFor(i, t, n, o)
    }, u.prototype.subscribeToPrice = function(e, t, n) {
        function i(e) {
            e.time = new Date(e.time), t.call(n, e)
        }
        var r;
        t.handler = i;
        if (!this.connected) return this.once("connected", this.subscribeToPrice.bind(this, e, t, n));
        this.subscriptions["price/" + e.id] ? (this.subscriptions["price/" + e.id].listeners.push({
            args: arguments,
            context: n
        }), this.socket.on(this.subscriptions["price/" + e.id].id, i, n)) : (r = this.requestPrefix + this.requestCount++, this.subscriptions["price/" + e.id] = {
            id: r,
            listeners: [{
                args: arguments,
                context: n
            }],
            method: "subscribeToPrice"
        }, this._send("subscribe-price", r, null, e.id), this.socket.on(r, i, n))
    }, u.prototype.unsubscribeFromPrice = function(e, t, n) {
        var r = 0,
            i;
        if (!e) {
            for (var s in this.subscriptions) i = s.match(/price\/(.+)/), i && this.unsubscribeFromPrice(i[1], t, n);
            return
        }
        if (!this.subscriptions["price/" + e.id]) {
            console.warn("[WARNING] Broker client interface unsubscribe request for instrumentId with no subscriptions", e.id);
            return
        }
        r = this.subscriptions["price/" + e.id].listeners.length;
        while (r)(!t || this.subscriptions["price/" + e.id].listeners[r - 1].args[1] === t) && (!n || this.subscriptions["price/" + e.id].listeners[r - 1].args[2] === n) && (this.socket.off(this.subscriptions["price/" + e.id].subscriptionId, t && t.handler, n), this.subscriptions["price/" + e.id].listeners.splice(r - 1, 1)), r--;
        this.subscriptions["price/" + e.id].listeners.length === 0 && (this._send("unsubscribe-price", e.id), delete this.subscriptions["price/" + e.id])
    }, u.prototype.requestHistoricalPrices = function(e, t, n, r, i, s) {
        var o;
        if (!this.connected) return this.once("connected", this.requestHistoricalPrices.bind(this, e.id, t, n, r, i, s));
        o = this.requestPrefix + this.requestCount++, this._send("request-historical-prices", o, e.id, t, n, r), this.socket.waitFor(o, i, s, 6e3)
    }, u.prototype.openPosition = function(e, t, n, r, i, s, o, u, a, f) {
        this._send("open-position", e, t, n.id, r, i, s, o, u, a, f)
    }, u.prototype.closePosition = function(e, t, n, r, i) {
        this._send("close-position", e, t, n, r.id, i)
    }, u.prototype.subscribeToMessages = function(e, t) {
        var n;
        if (!this.connected) return this.once("connected", this.subscribeToMessages.bind(this, e, t));
        this.subscriptions.messages ? (this.subscriptions.messages.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.messages.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.messages = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToMessages"
        }, this._send("subscribe-messages", n), this.socket.on(n, e, t))
    }, u.prototype.requestLog = function(e, t) {
        function o(n, o) {
            s++;
            if (n) {
                s === 2 && (r ? u() : e.call(t, "No logs available"));
                return
            }
            o = o.split("\n").map(function(e) {
                var t = e.match(i);
                return t ? [new Date(t[1]), t[2]] : [null, e]
            }), r ? (r = r.concat(o), u()) : (r = o, s === 2 && u())
        }

        function u() {
            r && (r.sort(function(e, t) {
                return !e[0] || !t[0] ? 0 : e[0] - t[0]
            }), r = r.map(function(e) {
                return e[0] ? e[0].toISOString() + e[1] : e[1]
            }).join("\n")), e.call(t, null, r)
        }
        var n, r, i = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z))(.+)/,
            s = 0;
        if (!this.socketConnected) return this.once("socket-connected", this.requestLog.bind(this, e, t));
        n = this.requestPrefix + this.requestCount++, this._send("request-log-connection", n), this.socket.waitFor(n, o, t, 6e3), n = this.requestPrefix + this.requestCount++, this._send("request-log-account", n), this.socket.waitFor(n, o, t, 6e3)
    }, u.prototype.subscribeToLog = function(e, t) {
        var n;
        if (!this.socketConnected) return this.once("socket-connected", this.subscribeToLog.bind(this, e, t));
        this.subscriptions.log ? (this.subscriptions.log.listeners.push({
            args: arguments,
            context: t
        }), this.socket.on(this.subscriptions.log.id, e, t)) : (n = this.requestPrefix + this.requestCount++, this.subscriptions.log = {
            id: n,
            listeners: [{
                args: arguments,
                context: t
            }],
            method: "subscribeToLog"
        }, this._send("subscribe-log", n), this.socket.on(n, e, t))
    }, u.prototype._onSocketError = function(e) {
        i.error(e)
    }, u.prototype._resetSubscriptions = function() {
        this.connected ? console.error("Reset subscriptions calls whilst connected?") : (e.values(this.subscriptions).forEach(function(e) {
            e.listeners.forEach(function(t) {
                this.socket.off(null, null, t.context), this[e.method].apply(this, t.args)
            }, this)
        }, this), this.subscriptions = {})
    }, u.prototype.removeContext = function(t) {
        e(this.subscriptions).values().forEach(function(e) {
            var n = e.listeners.length;
            while (n) n--, e.listeners[n].context === t && e.listeners.splice(n, 1)
        }, this), this.socket.off(null, null, t)
    }, new u
}), define("brokerConnection", ["brokerConnection/main"], function(e) {
    return e
}), define("tile/Button", ["jquery", "backbone"], function(e, t) {
    var n = t.View.extend({
        className: "price-tile-button inactive",
        initialize: function() {
            this.$large = e("<span>", {
                "class": "large"
            }), this.$pip = e("<span>", {
                "class": "pip"
            }), this.$baby = e("<span>", {
                "class": "baby"
            }), this.$el.addClass(this.options.side), this.$el.append(this.$large, this.$pip, this.$baby)
        },
        onFirstTick: function() {
            this.$el.removeClass("inactive")
        },
        onTick: function(e) {
            var t = e.get(this.options.side),
                n = this.lastTick && this.lastTick.get(this.options.side);
            if (!n || t !== n) this.$large.text(e.get("large", this.options.side)), this.$pip.text(e.get("pips", this.options.side)), this.$baby.text(e.get("babyPip", this.options.side)), this.timeout && clearTimeout(this.timeout), n && (this.lightOff(), t > n ? this.$el.addClass("up-light") : t < n && this.$el.addClass("down-light")), this.timeout = setTimeout(this.lightOff.bind(this), 700);
            this.lastTick = e
        },
        lightOff: function() {
            this.$el.removeClass("up-light").removeClass("down-light")
        }
    });
    return n
}), define("text!tile/templates/confirmation.html", [], function() {
    return '<h3 class="heading"></h3>\n<div class="cols">\n    <div class="left-col">\n        <h4 class="stop-loss-label">Stop Loss</h4>\n        <p><span class="stop-loss">none <i class="fa fa-warning" title="Recommend to always set stop loss"></i></span></p>\n        <h4>Take Profit</h4>\n        <p><span class="take-profit">none</span></p>\n        <h4>Spread</h4>\n        <p class="spread">-</p>\n        <h4>Margin Requirement</h4>\n        <p class="margin-requirement"></p>\n    </div>\n    <div class="right-col">\n        <h4>Risking (approx)</h4>\n        <p class="risking">n/a</p>\n        <h4>Target Gain (approx)</h4>\n        <p class="target-gain">n/a</p>\n        <h4>Immediate Cost</h4>\n        <p class="immediate-cost">-</p>\n    </div>\n</div>'
}), define("tile/Confirmation", ["jquery", "../controls/Dialogue", "../controls/formatters", "charts", "text!./templates/confirmation.html", "registry"], function(e, t, n, r, i, s) {
    var o = t.extend({
        className: t.prototype.className + " confirm-trade-dialogue",
        initialize: function() {
            this.options.OKText = "Trade", t.prototype.initialize.call(this), this.instrument = this.options.values.instrument, this.price = this.options.values.price, this.direction = this.options.values.direction, this.side = this.direction === "LONG" ? "ask" : "bid", this.stopLossInvalid = !1, this.takeProfitInvalid = !1, this.trailingStop = this.options.values.trailingStop, this.render()
        },
        render: function() {
            var t = e(i),
                n;
            this.$body.html(t), this.$body.find("h3.heading").html((this.direction === "LONG" ? "Buy" : "Sell") + " " + this.options.values.quantity + " " + this.options.values.instrument.id + ' at <span class="price"></span>'), this.$price = t.find("span.price"), this.$stopLoss = t.find("span.stop-loss"), this.$price.html(this.instrument.formatPrice(this.price));
            if (this.options.values.stopLoss || this.options.values.trailingStop) n = (this.direction === "LONG" ? "Sell" : "Buy") + " at ", this.options.values.trailingStop && (this.direction === "LONG" ? (this.options.values.stopLoss = this.price - this.options.values.trailingStop, n += "min ") : (this.options.values.stopLoss = this.price + this.options.values.trailingStop, n += "max "), t.find(".stop-loss-label").text("Trailing Stop")), this.$risking = t.find("p.risking"), this.$stopLoss.before(n), this.setStopLossValues(this.options.values.stopLoss, !1);
            this.$takeProfit = t.find("span.take-profit"), this.options.values.takeProfit && (this.$takeProfit.html(this.instrument.formatPrice(this.options.values.takeProfit)), this.$takeProfit.before((this.direction === "LONG" ? "Sell" : "Buy") + " at "), this.$targetGain = t.find("p.target-gain"), this.setTakeProfitValues(this.options.values.takeProfit, !1)), this.$spread = t.find("p.spread"), this.$immediateCost = t.find("p.immediate-cost"), this.$marginRequirement = t.find("p.margin-requirement"), this._hasDynamicUsedMargin() ? (this.marginConverter = s.get("instrument-converters").get(this.instrument.get("broker"), this.instrument.get("dealt"), s.get("account").get("currency")), this.marginConverter.on("rate", this._onMarginConverterRate, this), this._onMarginConverterRate(this.marginConverter.get("rate"))) : this._setMarginValue(this.instrument.getMarginRequirement(this.options.values.quantity));
            if (this.options.values.stopLoss || this.options.values.takeProfit) this.chart = new r.PriceChart({
                instrument: this.instrument,
                interval: 15,
                periods: 96,
                plotLine: !0,
                height: 200,
                spinner: !1,
                chartConfig: {
                    navigator: {
                        enabled: !1
                    }
                }
            }), this.chart.chart.once("ready", this.onChartReady, this), this.$body.append(this.chart.$el)
        },
        onChartReady: function() {
            this.yAxis = this.chart.chart.highchart.yAxis[0], this.updateChartStopLoss(), this.updateChartTakeProfit()
        },
        onTick: function(e) {
            this.price = e.get(this.side), this.$price.html(this.instrument.formatPrice(this.price)), this.$spread.text(this.instrument.getSpread(e)), this.$immediateCost.text(n.accountCurrency(this.instrument.convertToAccountCurrency(this.options.values.quantity * Math.abs(e.get("ask") - e.get("bid")))))
        },
        updateStopLoss: function(e, t) {
            this.setStopLossValues(parseFloat(e[this.direction === "LONG" ? "buy" : "sell"]), t)
        },
        setStopLossValues: function(e, t) {
            var r = Math.abs(e - this.price),
                i = this.options.values.quantity * r,
                o = s.get("account").get("balance");
            this.stopLoss = e, this.$stopLoss.html(this.instrument.formatPrice(e) + " (" + this.instrument.convertPriceToPips(r) + " pips)"), this.$risking.text(n.accountCurrency(this.instrument.convertToAccountCurrency(i)) + " (" + n.percentage(1, i / o * 100) + " of balance)"), i > o && this.$risking.append(' <i class="fa fa-warning" title="Risking more than account balance"></i>'), t ? this.$stopLoss.addClass("invalid") : this.$stopLoss.removeClass("invalid"), this.stopLossInvalid = t, this.updateValidity(), this.updateChartStopLoss()
        },
        updateTakeProfit: function(e, t) {
            this.setTakeProfitValues(parseFloat(e[this.direction === "LONG" ? "buy" : "sell"]), t)
        },
        setTakeProfitValues: function(e, t) {
            var r = Math.abs(e - this.price);
            this.takeProfit = e, this.$takeProfit.html(this.instrument.formatPrice(e) + " (" + this.instrument.convertPriceToPips(r) + " pips)"), this.$targetGain.text(n.accountCurrency(this.instrument.convertToAccountCurrency(this.options.values.quantity * r))), t ? this.$takeProfit.addClass("invalid") : this.$takeProfit.removeClass("invalid"), this.takeProfitInvalid = t, this.updateValidity(), this.updateChartTakeProfit()
        },
        updateValidity: function() {
            this.$ok.prop("disabled", this.stopLossInvalid || this.takeProfitInvalid)
        },
        _hasDynamicUsedMargin: function() {
            return !this.instrument.get("marginRatios")
        },
        _setMarginValue: function(e) {
            this.$marginRequirement.text(n.accountCurrency(e)), e > s.get("account").get("availableMargin") && this.$marginRequirement.append(' <i class="fa fa-warning" title="Not enough available margin"></i>')
        },
        _onMarginConverterRate: function(e) {
            this._setMarginValue(this.options.values.quantity * e * this.instrument.get("marginRate"))
        },
        updateChartStopLoss: function() {
            if (!this.yAxis || !this.stopLoss) return;
            this.yAxis.removePlotBand("stop-loss"), this.yAxis.addPlotBand({
                id: "stop-loss",
                from: this.stopLoss,
                to: this.price,
                color: "rgba(169,20,0,0.2)",
                zIndex: 2
            }), this.yAxis.removePlotBand("stop-loss-line"), this.yAxis.addPlotLine({
                id: "stop-loss-line",
                value: this.stopLoss,
                width: 1,
                label: {
                    text: '<span style="color: #a60909, font-weight: bold">Stop Loss:</span> ' + this.instrument.formatPrice(this.stopLoss),
                    align: "right",
                    useHTML: !0,
                    style: {
                        "font-size": "12px",
                        color: "#a60909"
                    },
                    x: -5,
                    y: -2
                },
                color: "#a60909",
                zIndex: 35
            }), this.updateChartExtremes()
        },
        updateChartTakeProfit: function() {
            if (!this.yAxis || !this.takeProfit) return;
            this.yAxis.removePlotBand("take-profit"), this.yAxis.addPlotBand({
                id: "take-profit",
                from: this.price,
                to: this.takeProfit,
                color: "rgba(31,178,59,0.2)",
                zIndex: 2
            }), this.yAxis.removePlotBand("take-profit-line"), this.yAxis.addPlotLine({
                id: "take-profit-line",
                value: this.takeProfit,
                width: 1,
                label: {
                    text: '<span style="color: #1fb265, font-weight: bold">Take Profit:</span> ' + this.instrument.formatPrice(this.takeProfit),
                    align: "right",
                    useHTML: !0,
                    style: {
                        "font-size": "12px",
                        color: "#1fb265"
                    },
                    x: -5,
                    y: -2
                },
                color: "#1fb265",
                zIndex: 35
            }), this.updateChartExtremes()
        },
        updateChartExtremes: function() {
            var e = this.yAxis.getExtremes(),
                t = (e.dataMax - e.dataMin) / 10;
            this.direction === "LONG" ? (this.stopLoss - t < e.dataMin && (e.dataMin = this.stopLoss - t), this.takeProfit + t > e.dataMax && (e.dataMax = this.takeProfit + t)) : (this.takeProfit - t < e.dataMin && (e.dataMin = this.takeProfit - t), this.stopLoss + t > e.dataMax && (e.dataMax = this.stopLoss + t)), this.yAxis.setExtremes(e.dataMin, e.dataMax)
        },
        tearDown: function() {
            this.instrument.off("tick", this.onTick, this), t.prototype.tearDown.call(this)
        }
    });
    return o
}), define("tile/View", ["jquery", "backbone", "price", "./Button", "registry", "utils", "configuration", "./Confirmation", "help", "toastr"], function(e, t, n, r, i, s, o, u, a, f) {
    var l = t.View.extend({
        id: "tile",
        events: {
            "click .price-tile-button": "onClick",
            "dblclick .price-tile-button": "onDoubleClick",
            "keyup .quanity": "onQuantityKeyUp",
            "keyup .stop-loss": "onStopLossKeyUp",
            "change .trailing-stop": "onChangeTrailingStop",
            "keyup .take-profit": "onTakeProfitKeyUp",
            "keyup .quantity": "onQuantityKeyUp"
        },
        className: "price-tile",
        initialize: function(t) {
            this.options = t || {}, this.instrument = t.instrument;
            if (t.instrumentId) {
                if (!i.get("instruments").isSynced()) return i.get("instruments").once("sync", this.initialize.bind(this, t), this);
                this.instrument = i.get("instruments").get(t.instrumentId)
            }
            if (!this.instrument) {
                this.noInstrument = !0, this.$el.text("Instrument not available");
                return
            }
            this.options.view = this, this.sellButton = new r({
                side: "bid"
            }), this.buyButton = new r({
                side: "ask"
            }), this.$spread = e("<div>", {
                "class": "spread"
            });
            if (this.options.readOnly) {
                this.$el.addClass("read-only"), this.instrument.on("tick", this.onTickReadOnly, this), this.renderSmall();
                return
            }
            this.instrument.once("tick", this.onFirstTick, this), this.instrument.on("tick", this.onTick, this), this.$stopLossBlock = e("<div>", {
                "class": "block stop-loss-block"
            }), this.$stopLossLabel = e("<label>", {
                "for": "stop-loss"
            }).text("Stop Loss"), this.$stopLossSellValue = e("<span>", {
                "class": "value sell"
            }), this.$stopLossBuyValue = e("<span>", {
                "class": "value buy"
            }), this.$stopLoss = e("<input>", {
                type: "text",
                name: "stop-loss",
                "class": "stop-loss"
            }).append(this.$stopLossValue), this.$trailingStopBlock = e("<div>", {
                "class": "trailing-stop-block"
            }), this.$trailingStopLabel = e("<label>", {
                "for": "trailing-stop"
            }).text("Trailing"), this.$trailingStop = e("<input>", {
                type: "checkbox",
                id: "trailing-stop",
                name: "trailing-stop",
                "class": "trailing-stop"
            }), this.$trailingStopBlock.append(this.$trailingStopLabel, this.$trailingStop), this.$stopLossBlock.append(this.$stopLossLabel, this.$trailingStopBlock, this.$stopLossSellValue, this.$stopLossBuyValue, this.$stopLoss), this.$takeProfitBlock = e("<div>", {
                "class": "block"
            }), this.$takeProfitLabel = e("<label>", {
                "for": "take-profit"
            }).text("Take Profit").append(this.$takeProfitValue), this.$takeProfitSellValue = e("<span>", {
                "class": "value sell"
            }), this.$takeProfitBuyValue = e("<span>", {
                "class": "value buy"
            }), this.$takeProfit = e("<input>", {
                type: "text",
                name: "take-profit",
                "class": "take-profit"
            }), this.$takeProfitBlock.append(this.$takeProfitLabel, this.$takeProfitSellValue, this.$takeProfitBuyValue, this.$takeProfit), this.$quantityLabel = e("<label>", {
                "for": "quantity"
            }).text("Quantity (" + this.instrument.get("dealt") + ")"), this.$quantity = e("<input>", {
                type: "text",
                name: "quantity",
                "class": "quantity"
            }).val(this.instrument.get("factor")), this.$closedOverlay = e("<div>", {
                "class": "closed-overlay"
            }).text("CLOSED"), this.instrument.on("change:tradingOpen", this.onTradingOpenChange, this), this.onTradingOpenChange(), this.precision = this.instrument.get("precision"), this.pipSize = this.instrument.get("pipSize"), this.rendered = !0, this.renderSmall(), setTimeout(function() {
                i.get("broker-connection").isConnected() || this.setWaitingForBroker()
            }.bind(this), 5e3)
        },
        renderSmall: function() {
            if (this.noInstrument) return;
            this.$el.empty(), this.$el.addClass("small"), this.$el.append(this.sellButton.$el, this.buyButton.$el, this.$spread, this.$quantity, this.$closedOverlay)
        },
        renderBig: function() {
            if (this.noInstrument) return;
            this.$el.empty(), this.$el.addClass("big"), this.$el.append(this.sellButton.$el, this.buyButton.$el, this.$spread, this.$stopLossBlock, this.$takeProfitBlock, this.$quantityLabel, this.$quantity, this.$closedOverlay)
        },
        onFirstTick: function(e) {
            this.setTradingOpen(e.get("open")), this.active = !0, this.buyButton.onFirstTick(e), this.sellButton.onFirstTick(e), this.onTick(e)
        },
        onTick: function(e) {
            this.setTradingOpen(e.get("open")), this.currentPrice = e, this.currentBid = e.get("bid"), this.currentAsk = e.get("ask"), this.$spread.text(e.get("spread")), this.buyButton.onTick(e), this.sellButton.onTick(e), this.calculateStopLossValues(), this.calculateTakeProfitValues(), this.confirmationDialogue && (this.confirmationDialogue.onTick(e), this.stopLoss && this.confirmationDialogue.updateStopLoss(this.stopLoss, this.$stopLoss.hasClass("invalid")))
        },
        onTickReadOnly: function(e) {
            this.setTradingOpen(e.get("open")), this.$spread.text(e.get("spread")), this.buyButton.onTick(e), this.sellButton.onTick(e)
        },
        setWaitingForBroker: function() {
            this.$closedOverlay.text("Waiting for broker..."), this.$closedOverlay.show(), i.get("broker-connection").once("connected", this.setNotWaitingForBroker, this)
        },
        setNotWaitingForBroker: function() {
            this.$closedOverlay.hide()
        },
        setTradingOpen: function(e) {
            (e || e === undefined) && !this.tradingOpen && this.$el.removeClass("trading-closed"), e === !1 && this.tradingOpen && (this.$closedOverlay.text("CLOSED"), this.$el.addClass("trading-closed")), this.tradingOpen = e
        },
        onTradingOpenChange: function() {
            this.instrument.get("tradingOpen") ? (this.tradingOpen = !0, this.$el.removeClass("trading-closed")) : (this.$closedOverlay.text("CLOSED"), this.tradingOpen = !1, this.$el.addClass("trading-closed"))
        },
        onClick: function(t) {
            var n, r, i;
            if (this.options.readOnly) return;
            n = o.get("settings").get("double-click-trading");
            if (!this.active || this.clickBuffer) return;
            this.clickBuffer = setTimeout(function() {
                n && f.info("Double click to trade"), delete this.clickBuffer
            }.bind(this), 1e3), n || (r = e(t.currentTarget).hasClass("bid") ? "bid" : "ask", i = this.getTradeValues(r), this.confirmationDialogue = new u({
                values: i,
                onOK: this.onConfirmationOK.bind(this, r),
                onHide: this.onConfirmationCancel.bind(this, r)
            }), this.checkTrade(i) && this.confirmationDialogue.show())
        },
        onDoubleClick: function(t) {
            if (this.options.readOnly) return;
            clearTimeout(this.clickBuffer), delete this.clickBuffer, this.active && o.get("settings").get("double-click-trading") && this.onConfirmationOK(e(t.currentTarget).hasClass("bid") ? "bid" : "ask")
        },
        onConfirmationOK: function(e) {
            var t = this.getTradeValues(e);
            this.checkTrade(t) && this.trade(t), delete this.confirmationDialogue
        },
        onConfirmationCancel: function() {
            delete this.confirmationDialogue
        },
        getTradeValues: function(e) {
            var t = {};
            return t.direction = e === "bid" ? "SHORT" : "LONG", t.price = this.currentPrice.get(t.direction === "SHORT" ? "bid" : "ask"), t.instrument = this.options.instrument, t.quantity = parseInt(this.$quantity.val(), 10), this.stopLoss && (this.trailingStop ? t.trailingStop = this.trailingStop : t.stopLoss = parseFloat(this.stopLoss[t.direction === "SHORT" ? "sell" : "buy"])), this.takeProfit && (t.takeProfit = parseFloat(this.takeProfit[t.direction === "SHORT" ? "sell" : "buy"])), t
        },
        checkTrade: function(e) {
            var t, n = this.instrument.get("minQuantity"),
                r = this.instrument.get("maxQuantity");
            if (!this.currentPrice) {
                f.error("No price");
                return
            }
            t = this.currentPrice.get(e.side);
            if (!/^\d+$/.test(this.$quantity.val()) || isNaN(e.quantity)) {
                f.error("TRADE STOPPED AT CLIENT<br />Invalid quantity");
                return
            }
            if (n && e.quantity < n) {
                f.error("TRADE STOPPED AT CLIENT<br />Minimum trade size for " + this.instrument.get("displaySymbol") + " is " + n);
                return
            }
            if (r && e.quantity > r) {
                f.error("TRADE STOPPED AT CLIENT<br />Maximum trade size for " + this.instrument.get("displaySymbol") + " is " + r);
                return
            }
            if (e.stopLoss) {
                if (e.direction === "SHORT" && e.stopLoss < this.currentPrice.get("bid")) {
                    f.error("TRADE STOPPED AT CLIENT<br />Sell order stop loss must be higher than current bid price");
                    return
                }
                if (e.direction === "SHORT" && e.stopLoss < this.currentPrice.get("ask")) {
                    f.error("TRADE STOPPED AT CLIENT<br />Sell order stop loss must be higher than current ask price to prevent immediate closure");
                    return
                }
                if (e.direction === "LONG" && e.stopLoss > this.currentPrice.get("ask")) {
                    f.error("TRADE STOPPED AT CLIENT<br />Buy order stop loss must be lower than current ask price");
                    return
                }
                if (e.direction === "LONG" && e.stopLoss > this.currentPrice.get("bid")) {
                    f.error("TRADE STOPPED AT CLIENT<br />Buy order stop loss must be lower than current bid price to prevent immediate closure");
                    return
                }
            }
            if (e.takeProfit) {
                if (e.direction === "SHORT" && e.takeProfit > this.currentPrice.get("bid")) {
                    f.error("TRADE STOPPED AT CLIENT<br />Sell order take profit must be lower than current bid price");
                    return
                }
                if (e.direction === "LONG" && e.takeProfit < this.currentPrice.get("ask")) {
                    f.error("TRADE STOPPED AT CLIENT<br />Buy order take profit must be higher than current ask price");
                    return
                }
            }
            return !0
        },
        trade: function(e) {
            var t;
            e.trailingStop && (t = {
                trailingStopDistance: e.trailingStop
            }, e.direction === "LONG" ? e.trailingStop = e.price - e.trailingStop : e.trailingStop = e.price + e.trailingStop), i.get("broker-connection").openPosition(s.String.randomKey(7), "c9t", e.instrument, e.direction, e.quantity, e.stopLoss, e.trailingStop, e.takeProfit, e.price, t)
        },
        onContainerResize: function(e, t, n, r) {
            this.$el.removeClass("small"), this.$el.removeClass("big"), r === 1 && this.renderSmall(), r === 2 && this.renderBig()
        },
        onQuantityKeyUp: function() {
            var t = e(event.target),
                n = t.val(),
                r = this.instrument.get("minQuantity"),
                i = this.instrument.get("maxQuantity");
            !/^\d+$/.test(n) || isNaN(n) || r && n < r || i && n > i ? t.addClass("has-error") : t.removeClass("has-error")
        },
        onStopLossKeyUp: function(e) {
            var t = e.target.value,
                n = t.match(/^(\d+)%$/);
            this.stopLossInput = parseFloat(t);
            if (isNaN(this.stopLossInput) || this.stopLossInput <= 0) {
                this.$stopLoss.addClass("invalid"), delete this.stopLossInput, this.$stopLossLabel.text("Stop Loss"), this.stopLossInputType = "", this.$stopLossSellValue.text(""), this.$stopLossBuyValue.text(""), delete this.stopLoss;
                return
            }
            n = t.split("."), !n[1] || n[1].length === 1 ? (this.stopLossInputType = "Pip", this.$stopLossLabel.text("Stop Loss (pips)")) : (this.stopLossInputType = "Value", this.$stopLossLabel.text("Stop Loss")), this.calculateStopLossValues(), this.calculateTakeProfitValues()
        },
        onChangeTrailingStop: function(t) {
            this.trailingStopOn = e(t.currentTarget).prop("checked"), this.trailingStopOn ? this.calculateStopLossValues() : delete this.trailingStop
        },
        onTakeProfitKeyUp: function(e) {
            var t = e.target.value,
                n;
            this.takeProfitInput = parseFloat(t);
            if (isNaN(this.takeProfitInput) || this.takeProfitInput <= 0) {
                this.$takeProfit.addClass("invalid"), delete this.takeProfitInput, this.$takeProfitLabel.text("Take Profit"), this.takeProfitInputType = "", this.$takeProfitSellValue.text(""), this.$takeProfitBuyValue.text(""), delete this.takeProfit;
                return
            }
            n = t.split("."), !n[1] || n[1].length === 1 ? (this.takeProfitInputType = "Pip", this.$takeProfitLabel.text("Take Profit (pips)")) : (this.takeProfitInputType = "Value", this.$takeProfitLabel.text("Take Profit")), this.calculateTakeProfitValues(), this.calculateStopLossValues()
        },
        calculateStopLossValues: function() {
            if (!this.stopLossInput) {
                this.stopLoss = null;
                return
            }
            this.$stopLossSellValue.removeClass("invalid").prop("title", ""), this.$stopLossBuyValue.removeClass("invalid").prop("title", ""), this.$stopLoss.removeClass("invalid"), this.stopLossInputType === "Pip" ? (this.stopLoss = {
                sell: (this.currentBid + this.stopLossInput * this.pipSize).toFixed(this.precision),
                buy: (this.currentAsk - this.stopLossInput * this.pipSize).toFixed(this.precision)
            }, this.$stopLossSellValue.text(this.stopLoss.sell), this.$stopLossBuyValue.text(this.stopLoss.buy), this.$stopLossLabel.text("Stop Loss (pips)"), this.stopLoss.sell < this.currentAsk && this.$stopLossSellValue.addClass("invalid").prop("title", "Stop loss must be greater that ask price for short positions"), this.stopLoss.buy > this.currentBid && this.$stopLossBuyValue.addClass("invalid").prop("title", "Stop loss must be less than bid price for long positions"), this.trailingStopOn && (this.trailingStop = this.stopLossInput * this.pipSize)) : this.stopLossInputType === "Value" && (this.stopLoss = {
                sell: this.stopLossInput.toFixed(this.precision),
                buy: this.stopLossInput.toFixed(this.precision)
            }, this.$stopLossSellValue.text(""), this.$stopLossBuyValue.text(""), this.stopLossInput > this.currentAsk ? (this.$stopLossLabel.text("Stop Loss (SELL)"), this.takeProfit && this.takeProfit.sell > this.currentAsk && this.$stopLoss.addClass("invalid"), this.trailingStopOn && (this.trailingStop = this.stopLossInput - this.currentAsk)) : this.stopLossInput < this.currentBid ? (this.$stopLossLabel.text("Stop Loss (BUY)"), this.takeProfit && this.takeProfit.buy < this.currentBid && this.$stopLoss.addClass("invalid"), this.trailingStopOn && (this.trailingStop = this.currentBid - this.stopLossInput)) : this.stopLossInput > this.currentBid && this.stopLossInput < this.currentAsk && (this.$stopLossLabel.text("Stop Loss"), this.$stopLoss.addClass("invalid"), delete this.trailingStop))
        },
        calculateTakeProfitValues: function() {
            if (!this.takeProfitInput) return;
            this.$takeProfit.removeClass("invalid"), this.takeProfitInputType === "Pip" ? (this.takeProfit = {
                sell: (this.currentBid - this.takeProfitInput * this.pipSize).toFixed(this.precision),
                buy: (this.currentAsk + this.takeProfitInput * this.pipSize).toFixed(this.precision)
            }, this.$takeProfitLabel.text("Take Profit (pips)"), this.$takeProfitSellValue.text(this.takeProfit.sell), this.$takeProfitBuyValue.text(this.takeProfit.buy)) : this.takeProfitInputType === "Value" && (this.takeProfit = {
                sell: this.takeProfitInput.toFixed(this.precision),
                buy: this.takeProfitInput.toFixed(this.precision)
            }, this.$takeProfitSellValue.text(""), this.$takeProfitBuyValue.text(""), this.takeProfitInput > this.currentAsk ? (this.$takeProfitLabel.text("Take Profit (BUY)"), this.stopLoss && this.stopLoss.buy > this.currentAsk && this.$takeProfit.addClass("invalid")) : this.takeProfitInput < this.currentBid ? (this.$takeProfitLabel.text("Take Profit (SELL)"), this.stopLoss && this.stopLoss.sell < this.currentBid && this.$takeProfit.addClass("invalid")) : this.takeProfitInput < this.currentAsk && this.takeProfitInput > this.currentBid && (this.$takeProfitLabel.text("Take Profit"), this.$takeProfit.addClass("invalid"))), this.confirmationDialogue && this.confirmationDialogue.updateTakeProfit(this.takeProfit, this.$takeProfit.hasClass("invalid"))
        },
        help: function() {
            var e = this.container.sizeIndex,
                t = [{
                    element: this.container.$el[0],
                    intro: "<h4>Price Tile</h4><p>Price tiles flash up live streaming prices and allow you to execute trades.<p>",
                    position: "right"
                }, {
                    element: this.sellButton.$el[0],
                    intro: "<h4>Bid Price</h4><p>This is the bid price (to sell). Click to open the trade confirmation dialogue to place a market order.</p><p>If you have double-click trading turned on, double clicking will trade immediately.",
                    position: "bottom"
                }, {
                    element: this.buyButton.$el[0],
                    intro: "<h4>Ask Price</h4><p>This is the ask price (to buy). Click to open the trade confirmation dialogue to place a market order.</p><p>If you have double-click trading turned on, double clicking will trade immediately.",
                    position: "bottom"
                }, {
                    element: this.$spread[0],
                    intro: "<h4>Spread</h4><p>This is the difference between the bid and ask prices, represented in pips.",
                    position: "bottom"
                }, {
                    element: this.$stopLoss[0],
                    intro: "<h4>Stop Loss</h4><p>Enter a stop loss value to place a stop order that will close a losing position if price reaches this value.</p><p>The stop loss can be specified in pips, or as absolute price.</p><p>We recommend always setting a stop loss to manage your risk and to guarantee exit in the event of system failure.</p>",
                    position: "right"
                }, {
                    element: this.$takeProfit[0],
                    intro: "<h4>Take Profit</h4><p>Enter a take profit value to place a limit order that will close a successful position if price reaches this value, locking in your profit.</p><p>The take profit can be specified in pips, or as absolute price.</p>",
                    position: "right"
                }, {
                    element: this.$quantity[0],
                    intro: ["<h4>Quantity</h4>", "<p>This specifies the size of the trade you wish to make, in units of the instrument's base (dealt) currency</p>", "<p>e.g. BUY or SELL " + this.$quantity.val() + " " + this.instrument.get("dealt") + " worth of " + this.instrument.get("displaySymbol")].join(""),
                    position: "bottom"
                }];
            this.container.sizeIndex === 0 && t.splice(4, 0, {
                element: this.container.$header[0],
                intro: "<p>Price tiles can be expanded using the + and - icons in the header or by dragging their bottom right corner.<p>",
                position: "right"
            }), a.start(t, {
                fixed: !1,
                onNavigate: function(t) {
                    t === 4 && e === 0 && this.container.grow()
                }.bind(this),
                onExit: function() {
                    e === 0 && this.container.shrink()
                }.bind(this)
            })
        },
        tearDown: function() {
            this.instrument && this.instrument.off("tick", null, this), this.remove()
        }
    });
    return l
}), define("tile/main", ["./View"], function(e) {
    return {
        View: e
    }
}), define("tile", ["tile/main"], function(e) {
    return e
}), define("controls/MobileDrawer", ["jquery", "backbone", "./clearOverlay", "registry"], function(e, t, n, r) {
    var i = t.View.extend({
        events: {
            "click a": "close"
        },
        className: "mobile-drawer",
        initialize: function() {
            this.$el.addClass("mobile-drawer"), this.boundClose = this.close.bind(this)
        },
        open: function() {
            this.trigger("open"), this.$el.addClass("open"), this.$el.on("touchstart", this._onTouchStart.bind(this)), n.show(this.boundClose, !0, !0), r.get("events").trigger("mobile-drawer:open")
        },
        close: function() {
            this.trigger("close"), this.$el.removeClass("open"), this.$el.off("touchstart"), n.hide(), r.get("events").trigger("mobile-drawer:close")
        },
        _onTouchStart: function(e) {
            this.startX = e.originalEvent.touches[0].pageX, this.startLeft = parseInt(this.$el.css("left"), 10), this.$el.on("touchmove", this._onTouchMoveThreshold.bind(this))
        },
        _onTouchMoveThreshold: function(e) {
            var t = e.originalEvent.touches[0].pageX,
                n = t - this.startX;
            e.stopPropagation(), n < -100 && (this.$el.on("touchend", this._onTouchEnd.bind(this)), this.$el.addClass("disable-transition"), this.$el.off("touchmove"), this.$el.on("touchmove", this._onTouchMove.bind(this)), this._onTouchMove(e))
        },
        _onTouchMove: function(e) {
            var t = e.originalEvent.touches[0].pageX;
            e.stopPropagation(), this.moveBy = Math.max(this.startX - t, 0), this.$el.css("left", this.startLeft - this.moveBy)
        },
        _onTouchEnd: function(t) {
            this.$el.removeClass("disable-transition"), this.$el.css("left", ""), this.$el.off("touchmove"), this.$el.off("touchend"), this.moveBy < e(window).width() / 4 ? this.open() : this.close()
        }
    });
    return i
}), requirejs.config({
    paths: {
        jquery: ["//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min", "libraries/jquery/jquery-1.10.2.min"],
        underscore: ["//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min", "libraries/underscore/underscore.1.8.3"],
        backbone: ["//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min", "libraries/backbone/backbone-min"],
        socketio: ["//cdn.socket.io/socket.io-1.1.0", "libraries/socketio/socket.io"],
        toastr: ["//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min", "libraries/toastr/toastr"],
        highstock: ["//cdnjs.cloudflare.com/ajax/libs/highstock/2.1.7/highstock", "libraries/highstock/highstock.src"],
        "highcharts-more": ["//cdnjs.cloudflare.com/ajax/libs/highcharts/4.1.7/highcharts-more", "libraries/highstock/highcharts-more.src"],
        "highcharts-exporting": ["//cdnjs.cloudflare.com/ajax/libs/highstock/2.1.7/modules/exporting", "libraries/highstock/modules/exporting.src"],
        "bootstrap.datepicker": "libraries/bootstrap/bootstrap-datepicker.edited",
        "bootstrap.timepicker": "libraries/bootstrap/bootstrap-timepicker.edited",
        "jquery.chosen": "libraries/jquery/chosen.jquery.1.4.2.edited",
        "bootstrap.tooltip": "libraries/bootstrap/bootstrap-tooltip.edited",
        facebook: "//connect.facebook.net/en_US/all",
        text: "libraries/require/text",
        hello: ["//cdnjs.cloudflare.com/ajax/libs/hellojs/1.5.1/hello.all.min", "libraries/hello/hello.all.1.5.1.min"]
    },
    packages: [{
        name: "brokerConnection",
        location: "components/brokerConnection"
    }, {
        name: "header",
        location: "components/header"
    }, {
        name: "indicators",
        location: "components/indicators3rdParty"
    }, {
        name: "instruments",
        location: "components/instruments"
    }, {
        name: "price",
        location: "components/price"
    }, {
        name: "registry",
        location: "components/registry"
    }, {
        name: "sockets",
        location: "components/sockets"
    }, {
        name: "tile",
        location: "components/tile"
    }, {
        name: "user",
        location: "components/user"
    }, {
        name: "utils",
        location: "components/utils"
    }],
    map: {
        "*": {
            jquery: "controls/jquery",
            underscore: "controls/underscore",
            backbone: "controls/Backbone"
        },
        "controls/jquery": {
            jquery: "jquery"
        },
        "controls/underscore": {
            underscore: "underscore"
        },
        "controls/Backbone": {
            backbone: "backbone"
        }
    },
    shim: {
        highstock: {
            deps: ["jquery"]
        },
        "highcharts-more": {
            deps: ["highstock"]
        },
        "highcharts-exporting": {
            deps: ["highstock"]
        },
        facebook: {
            exports: "FB"
        }
    }
}), define("configuration", [], function() {
    return {}
}), define("help", [], function() {
    return {}
}), define("charts", [], function() {
    return {}
}), require(["underscore", "jquery", "backbone", "header", "user", "instruments", "components/charts/PriceChart", "sockets", "brokerConnection", "tile", "controls/MobileDrawer", "controls/localStorage", "controls/SearchControl", "registry"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, p) {
    function T(e) {
        var t = c.get("charts-page-" + e);
        E && E.tearDown(), S && (S.off("change:instrumentId"), S.off("change:settings"), S.tearDown()), E = new f.View({
            instrumentId: e,
            readOnly: !0
        }), y.html(E.$el), x.instrumentId = e, x.height = b.height(), delete x.indicatorConfig, t && (x.interval = t.interval, x.type = t.type, x.side = t.side, x.indicatorConfig = t.indicatorConfig), S = new o(x), S.on("change:instrumentId", function(e) {
            N(e)
        }), S.on("change:settings", function(t) {
            if (e !== t.instrumentId) return;
            c.set("charts-page-" + e, t)
        }), b.html(S.$el), N(e)
    }

    function N(e) {
        var n = p.get("instruments"),
            r, i;
        if (!n.isSynced()) return n.once("sync", N.bind(null, e));
        r = p.get("instruments").get(e), i = r.get("displaySymbol") + " | " + r.get("broker") + " | Live Market Data Charts | Cloud9Trader", t("#title p").text("LIVE MARKET DATA - " + r.get("product").toUpperCase()), t("#title h1").html(r.get("displayHTML")), v.setCrumb(r.get("displaySymbol") + " " + r.get("broker")), document.title = i, k.navigate("/charts/" + e), c.set("charts-page-selected-instrument", e)
    }
    var d = new i.Model(window.bootstrap && window.bootstrap.user);
    p.register("user", d), new r.View({
        el: t("#header"),
        page: "charts"
    });
    var v = new r.MobileView({
            el: t("#mobile-navigation"),
            page: "charts",
            mode: "crumb"
        }),
        m = new l({
            el: t("#chart-links-container"),
            trigger: t("#mobile-navigation #crumb")
        });
    v.on("click:crumb", function() {
        m.open()
    }), v.on("click:login click:register click:account", function() {
        m.close(), v.setMode("crumb")
    }), m.on("open", function() {
        v.setMode("icons")
    }), m.on("close", function() {
        v.setMode("crumb")
    }), n.set3rdPartyMode(), p.register("hosts", {
        demoBroker: "https://qa5.cloud9trader.com:80"
    });
    var g = new u.Model({
        server: "demoBroker",
        query: {
            connectionId: 0,
            currency: "USD",
            "public": !0
        }
    });
    g.start(), u.add(g), p.register("broker-connection", a), p.get("broker-connection").initialize(g), p.register("instruments", (new s.Collection).fetchHttp());
    var y = t("#price-tile"),
        b = t("#chart"),
        w = t("#chart-links"),
        E, S, x = {
            instrumentId: window.c9t.instrumentId,
            interval: "M15",
            periods: 2500,
            settings: {
                side: !0,
                interval: !0,
                type: !0,
                indicators: !0
            },
            precision: 3,
            plotLine: !0,
            height: b.height(),
            chartConfig: {
                plotOptions: {
                    series: {
                        cursor: "ew-resize"
                    }
                }
            }
        },
        C = n.Router.extend({
            routes: {
                "charts(/*instrumentId)": "chart"
            },
            chart: function(e) {
                e || (e = c.get("charts-page-selected-instrument")), e || this.navigate("/charts/EUR/USD:FXCM"), T(e || "EUR/USD:FXCM"), c.set("charts-page-selected-instrument", e)
            }
        }),
        k = new C;
    n.history.start({
        pushState: !0
    });
    var L = new h({
        placeholder: "Filter instruments",
        minimumChars: 0,
        debounce: !1,
        size: "large"
    });
    L.on("change", function(t) {
        var r = p.get("instruments");
        w.empty(), t && (r = new n.Collection(r.filter(function(e) {
            return e.matches(t)
        }.bind(this)))), e(e(r.sortBy("displaySymbol")).groupBy(function(e) {
            return e.get("product")
        })).each(function(e, t) {
            w.append("<h3>" + (t !== "undefined" ? t : "Other") + "</h3>"), e.forEach(function(e) {
                w.append('<a href="/charts/' + e.id + '">' + e.get("displaySymbol") + " <sub>" + e.get("broker") + "</sub></a>")
            })
        })
    }), t("#search-area").html(L.$el), w.on("click", "a", function(e) {
        var n = t(e.currentTarget).attr("href");
        e.preventDefault(), k.navigate(n, {
            trigger: !0
        })
    }), t(window).on("resize", e.debounce(function() {
        S.resize(null, b.height())
    }, 500)), window.onpopstate = function() {
        window.location.href = window.location.href
    }
}), define("Charts", function() {});
