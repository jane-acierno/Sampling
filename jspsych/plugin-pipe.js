var jsPsychPipe = function(t) {
    "use strict";
    function e() {
        /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
        e = function() {
            return t
        }
        ;
        var t = {}
          , r = Object.prototype
          , n = r.hasOwnProperty
          , o = "function" == typeof Symbol ? Symbol : {}
          , i = o.iterator || "@@iterator"
          , a = o.asyncIterator || "@@asyncIterator"
          , c = o.toStringTag || "@@toStringTag";
        function s(t, e, r) {
            return Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }),
            t[e]
        }
        try {
            s({}, "")
        } catch (t) {
            s = function(t, e, r) {
                return t[e] = r
            }
        }
        function u(t, e, r, n) {
            var o = e && e.prototype instanceof p ? e : p
              , i = Object.create(o.prototype)
              , a = new j(n || []);
            return i._invoke = function(t, e, r) {
                var n = "suspendedStart";
                return function(o, i) {
                    if ("executing" === n)
                        throw new Error("Generator is already running");
                    if ("completed" === n) {
                        if ("throw" === o)
                            throw i;
                        return T()
                    }
                    for (r.method = o,
                    r.arg = i; ; ) {
                        var a = r.delegate;
                        if (a) {
                            var c = b(a, r);
                            if (c) {
                                if (c === h)
                                    continue;
                                return c
                            }
                        }
                        if ("next" === r.method)
                            r.sent = r._sent = r.arg;
                        else if ("throw" === r.method) {
                            if ("suspendedStart" === n)
                                throw n = "completed",
                                r.arg;
                            r.dispatchException(r.arg)
                        } else
                            "return" === r.method && r.abrupt("return", r.arg);
                        n = "executing";
                        var s = f(t, e, r);
                        if ("normal" === s.type) {
                            if (n = r.done ? "completed" : "suspendedYield",
                            s.arg === h)
                                continue;
                            return {
                                value: s.arg,
                                done: r.done
                            }
                        }
                        "throw" === s.type && (n = "completed",
                        r.method = "throw",
                        r.arg = s.arg)
                    }
                }
            }(t, r, a),
            i
        }
        function f(t, e, r) {
            try {
                return {
                    type: "normal",
                    arg: t.call(e, r)
                }
            } catch (t) {
                return {
                    type: "throw",
                    arg: t
                }
            }
        }
        t.wrap = u;
        var h = {};
        function p() {}
        function l() {}
        function d() {}
        var v = {};
        s(v, i, (function() {
            return this
        }
        ));
        var y = Object.getPrototypeOf
          , m = y && y(y(E([])));
        m && m !== r && n.call(m, i) && (v = m);
        var g = d.prototype = p.prototype = Object.create(v);
        function w(t) {
            ["next", "throw", "return"].forEach((function(e) {
                s(t, e, (function(t) {
                    return this._invoke(e, t)
                }
                ))
            }
            ))
        }
        function x(t, e) {
            function r(o, i, a, c) {
                var s = f(t[o], t, i);
                if ("throw" !== s.type) {
                    var u = s.arg
                      , h = u.value;
                    return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then((function(t) {
                        r("next", t, a, c)
                    }
                    ), (function(t) {
                        r("throw", t, a, c)
                    }
                    )) : e.resolve(h).then((function(t) {
                        u.value = t,
                        a(u)
                    }
                    ), (function(t) {
                        return r("throw", t, a, c)
                    }
                    ))
                }
                c(s.arg)
            }
            var o;
            this._invoke = function(t, n) {
                function i() {
                    return new e((function(e, o) {
                        r(t, n, e, o)
                    }
                    ))
                }
                return o = o ? o.then(i, i) : i()
            }
        }
        function b(t, e) {
            var r = t.iterator[e.method];
            if (void 0 === r) {
                if (e.delegate = null,
                "throw" === e.method) {
                    if (t.iterator.return && (e.method = "return",
                    e.arg = void 0,
                    b(t, e),
                    "throw" === e.method))
                        return h;
                    e.method = "throw",
                    e.arg = new TypeError("The iterator does not provide a 'throw' method")
                }
                return h
            }
            var n = f(r, t.iterator, e.arg);
            if ("throw" === n.type)
                return e.method = "throw",
                e.arg = n.arg,
                e.delegate = null,
                h;
            var o = n.arg;
            return o ? o.done ? (e[t.resultName] = o.value,
            e.next = t.nextLoc,
            "return" !== e.method && (e.method = "next",
            e.arg = void 0),
            e.delegate = null,
            h) : o : (e.method = "throw",
            e.arg = new TypeError("iterator result is not an object"),
            e.delegate = null,
            h)
        }
        function k(t) {
            var e = {
                tryLoc: t[0]
            };
            1 in t && (e.catchLoc = t[1]),
            2 in t && (e.finallyLoc = t[2],
            e.afterLoc = t[3]),
            this.tryEntries.push(e)
        }
        function L(t) {
            var e = t.completion || {};
            e.type = "normal",
            delete e.arg,
            t.completion = e
        }
        function j(t) {
            this.tryEntries = [{
                tryLoc: "root"
            }],
            t.forEach(k, this),
            this.reset(!0)
        }
        function E(t) {
            if (t) {
                var e = t[i];
                if (e)
                    return e.call(t);
                if ("function" == typeof t.next)
                    return t;
                if (!isNaN(t.length)) {
                    var r = -1
                      , o = function e() {
                        for (; ++r < t.length; )
                            if (n.call(t, r))
                                return e.value = t[r],
                                e.done = !1,
                                e;
                        return e.value = void 0,
                        e.done = !0,
                        e
                    };
                    return o.next = o
                }
            }
            return {
                next: T
            }
        }
        function T() {
            return {
                value: void 0,
                done: !0
            }
        }
        return l.prototype = d,
        s(g, "constructor", d),
        s(d, "constructor", l),
        l.displayName = s(d, c, "GeneratorFunction"),
        t.isGeneratorFunction = function(t) {
            var e = "function" == typeof t && t.constructor;
            return !!e && (e === l || "GeneratorFunction" === (e.displayName || e.name))
        }
        ,
        t.mark = function(t) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(t, d) : (t.__proto__ = d,
            s(t, c, "GeneratorFunction")),
            t.prototype = Object.create(g),
            t
        }
        ,
        t.awrap = function(t) {
            return {
                __await: t
            }
        }
        ,
        w(x.prototype),
        s(x.prototype, a, (function() {
            return this
        }
        )),
        t.AsyncIterator = x,
        t.async = function(e, r, n, o, i) {
            void 0 === i && (i = Promise);
            var a = new x(u(e, r, n, o),i);
            return t.isGeneratorFunction(r) ? a : a.next().then((function(t) {
                return t.done ? t.value : a.next()
            }
            ))
        }
        ,
        w(g),
        s(g, c, "Generator"),
        s(g, i, (function() {
            return this
        }
        )),
        s(g, "toString", (function() {
            return "[object Generator]"
        }
        )),
        t.keys = function(t) {
            var e = [];
            for (var r in t)
                e.push(r);
            return e.reverse(),
            function r() {
                for (; e.length; ) {
                    var n = e.pop();
                    if (n in t)
                        return r.value = n,
                        r.done = !1,
                        r
                }
                return r.done = !0,
                r
            }
        }
        ,
        t.values = E,
        j.prototype = {
            constructor: j,
            reset: function(t) {
                if (this.prev = 0,
                this.next = 0,
                this.sent = this._sent = void 0,
                this.done = !1,
                this.delegate = null,
                this.method = "next",
                this.arg = void 0,
                this.tryEntries.forEach(L),
                !t)
                    for (var e in this)
                        "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
            },
            stop: function() {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if ("throw" === t.type)
                    throw t.arg;
                return this.rval
            },
            dispatchException: function(t) {
                if (this.done)
                    throw t;
                var e = this;
                function r(r, n) {
                    return a.type = "throw",
                    a.arg = t,
                    e.next = r,
                    n && (e.method = "next",
                    e.arg = void 0),
                    !!n
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o]
                      , a = i.completion;
                    if ("root" === i.tryLoc)
                        return r("end");
                    if (i.tryLoc <= this.prev) {
                        var c = n.call(i, "catchLoc")
                          , s = n.call(i, "finallyLoc");
                        if (c && s) {
                            if (this.prev < i.catchLoc)
                                return r(i.catchLoc, !0);
                            if (this.prev < i.finallyLoc)
                                return r(i.finallyLoc)
                        } else if (c) {
                            if (this.prev < i.catchLoc)
                                return r(i.catchLoc, !0)
                        } else {
                            if (!s)
                                throw new Error("try statement without catch or finally");
                            if (this.prev < i.finallyLoc)
                                return r(i.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function(t, e) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var o = this.tryEntries[r];
                    if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                        var i = o;
                        break
                    }
                }
                i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
                var a = i ? i.completion : {};
                return a.type = t,
                a.arg = e,
                i ? (this.method = "next",
                this.next = i.finallyLoc,
                h) : this.complete(a)
            },
            complete: function(t, e) {
                if ("throw" === t.type)
                    throw t.arg;
                return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                this.method = "return",
                this.next = "end") : "normal" === t.type && e && (this.next = e),
                h
            },
            finish: function(t) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                        return this.complete(r.completion, r.afterLoc),
                        L(r),
                        h
                }
            },
            catch: function(t) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                        var n = r.completion;
                        if ("throw" === n.type) {
                            var o = n.arg;
                            L(r)
                        }
                        return o
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function(t, e, r) {
                return this.delegate = {
                    iterator: E(t),
                    resultName: e,
                    nextLoc: r
                },
                "next" === this.method && (this.arg = void 0),
                h
            }
        },
        t
    }
    function r(t, e) {
        for (var r = 0; r < e.length; r++) {
            var n = e[r];
            n.enumerable = n.enumerable || !1,
            n.configurable = !0,
            "value"in n && (n.writable = !0),
            Object.defineProperty(t, n.key, n)
        }
    }
    function n(t, e, r, n) {
        return new (r || (r = Promise))((function(o, i) {
            function a(t) {
                try {
                    s(n.next(t))
                } catch (t) {
                    i(t)
                }
            }
            function c(t) {
                try {
                    s(n.throw(t))
                } catch (t) {
                    i(t)
                }
            }
            function s(t) {
                var e;
                t.done ? o(t.value) : (e = t.value,
                e instanceof r ? e : new r((function(t) {
                    t(e)
                }
                ))).then(a, c)
            }
            s((n = n.apply(t, e || [])).next())
        }
        ))
    }
    var o = {
        name: "pipe",
        parameters: {
            experiment_id: {
                type: t.ParameterType.STRING,
                default: void 0
            },
            action: {
                type: t.ParameterType.STRING,
                default: void 0
            },
            filename: {
                type: t.ParameterType.STRING,
                default: null
            },
            data_string: {
                type: t.ParameterType.STRING,
                default: null
            }
        }
    }
      , i = function() {
        function t(e) {
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, t),
            this.jsPsych = e
        }
        var o, i, a;
        return o = t,
        a = [{
            key: "saveData",
            value: function(t, r, o) {
                return n(this, void 0, void 0, e().mark((function n() {
                    var i;
                    return e().wrap((function(e) {
                        for (; ; )
                            switch (e.prev = e.next) {
                            case 0:
                                if (t && r && o) {
                                    e.next = 2;
                                    break
                                }
                                throw new Error("Missing required parameter(s).");
                            case 2:
                                return e.prev = 2,
                                e.next = 5,
                                fetch("https://pipe.jspsych.org/api/data/", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Accept: "*/*"
                                    },
                                    body: JSON.stringify({
                                        experimentID: t,
                                        filename: r,
                                        data: o
                                    })
                                });
                            case 5:
                                i = e.sent,
                                e.next = 11;
                                break;
                            case 8:
                                return e.prev = 8,
                                e.t0 = e.catch(2),
                                e.abrupt("return", e.t0);
                            case 11:
                                return e.next = 13,
                                i.json();
                            case 13:
                                return e.abrupt("return", e.sent);
                            case 14:
                            case "end":
                                return e.stop()
                            }
                    }
                    ), n, null, [[2, 8]])
                }
                )))
            }
        }, {
            key: "saveBase64Data",
            value: function(t, r, o) {
                return n(this, void 0, void 0, e().mark((function n() {
                    var i;
                    return e().wrap((function(e) {
                        for (; ; )
                            switch (e.prev = e.next) {
                            case 0:
                                if (t && r && o) {
                                    e.next = 2;
                                    break
                                }
                                throw new Error("Missing required parameter(s).");
                            case 2:
                                return e.prev = 2,
                                e.next = 5,
                                fetch("https://pipe.jspsych.org/api/base64/", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Accept: "*/*"
                                    },
                                    body: JSON.stringify({
                                        experimentID: t,
                                        filename: r,
                                        data: o
                                    })
                                });
                            case 5:
                                i = e.sent,
                                e.next = 11;
                                break;
                            case 8:
                                return e.prev = 8,
                                e.t0 = e.catch(2),
                                e.abrupt("return", e.t0);
                            case 11:
                                return e.next = 13,
                                i.json();
                            case 13:
                                return e.abrupt("return", e.sent);
                            case 14:
                            case "end":
                                return e.stop()
                            }
                    }
                    ), n, null, [[2, 8]])
                }
                )))
            }
        }, {
            key: "getCondition",
            value: function(t) {
                return n(this, void 0, void 0, e().mark((function r() {
                    var n, o;
                    return e().wrap((function(e) {
                        for (; ; )
                            switch (e.prev = e.next) {
                            case 0:
                                if (t) {
                                    e.next = 2;
                                    break
                                }
                                throw new Error("Missing required parameter(s).");
                            case 2:
                                return e.prev = 2,
                                e.next = 5,
                                fetch("https://pipe.jspsych.org/api/condition/", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Accept: "*/*"
                                    },
                                    body: JSON.stringify({
                                        experimentID: t
                                    })
                                });
                            case 5:
                                n = e.sent,
                                e.next = 11;
                                break;
                            case 8:
                                return e.prev = 8,
                                e.t0 = e.catch(2),
                                e.abrupt("return", e.t0);
                            case 11:
                                return e.next = 13,
                                n.json();
                            case 13:
                                return o = e.sent,
                                e.abrupt("return", o.condition);
                            case 15:
                            case "end":
                                return e.stop()
                            }
                    }
                    ), r, null, [[2, 8]])
                }
                )))
            }
        }],
        (i = [{
            key: "trial",
            value: function(t, e) {
                this.run(t, e)
            }
        }, {
            key: "run",
            value: function(r, o) {
                return n(this, void 0, void 0, e().mark((function n() {
                    var i, a, c;
                    return e().wrap((function(e) {
                        for (; ; )
                            switch (e.prev = e.next) {
                            case 0:
                                if (i = "\n      <style>".concat("\n      .spinner {\n        animation: rotate 2s linear infinite;\n        z-index: 2;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        margin: -25px 0 0 -25px;\n        width: 50px;\n        height: 50px;\n      }\n        \n      .spinner .path {\n        stroke: rgb(25,25,25);\n        stroke-linecap: round;\n        animation: dash 1.5s ease-in-out infinite;\n      }\n\n      @keyframes rotate {\n        100% {\n          transform: rotate(360deg);\n        }\n      }\n      \n      @keyframes dash {\n        0% {\n          stroke-dasharray: 1, 150;\n          stroke-dashoffset: 0;\n        }\n        50% {\n          stroke-dasharray: 90, 150;\n          stroke-dashoffset: -35;\n        }\n        100% {\n          stroke-dasharray: 90, 150;\n          stroke-dashoffset: -124;\n        }\n      }\n    ", '</style>\n      <svg class="spinner" viewBox="0 0 50 50">\n        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>\n      </svg>'),
                                r.innerHTML = i,
                                "save" !== o.action) {
                                    e.next = 7;
                                    break
                                }
                                return e.next = 6,
                                t.saveData(o.experiment_id, o.filename, o.data_string);
                            case 6:
                                a = e.sent;
                            case 7:
                                if ("saveBase64" !== o.action) {
                                    e.next = 11;
                                    break
                                }
                                return e.next = 10,
                                t.saveBase64Data(o.experiment_id, o.filename, o.data_string);
                            case 10:
                                a = e.sent;
                            case 11:
                                if ("condition" !== o.action) {
                                    e.next = 15;
                                    break
                                }
                                return e.next = 14,
                                t.getCondition(o.experiment_id);
                            case 14:
                                a = e.sent;
                            case 15:
                                r.innerHTML = "",
                                c = {
                                    result: a,
                                    success: !a.error
                                },
                                this.jsPsych.finishTrial(c);
                            case 18:
                            case "end":
                                return e.stop()
                            }
                    }
                    ), n, this)
                }
                )))
            }
        }]) && r(o.prototype, i),
        a && r(o, a),
        Object.defineProperty(o, "prototype", {
            writable: !1
        }),
        t
    }();
    return i.info = o,
    i
}(jsPsychModule);
//# sourceMappingURL=index.browser.min.js.map
