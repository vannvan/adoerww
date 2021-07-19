define((function() { "use strict";

		function e(e, t) { var n = Object.keys(e); if (Object.getOwnPropertySymbols) { var r = Object.getOwnPropertySymbols(e);
						t && (r = r.filter((function(t) { return Object.getOwnPropertyDescriptor(e, t).enumerable }))), n.push.apply(n, r) } return n }

		function t(t) { for (var n = 1; n < arguments.length; n++) { var r = null != arguments[n] ? arguments[n] : {};
						n % 2 ? e(Object(r), !0).forEach((function(e) { a(t, e, r[e]) })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : e(Object(r)).forEach((function(e) { Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e)) })) } return t }

		function n(e, t, n, r, a, i, u) { try { var o = e[i](u),
								c = o.value } catch (e) { return void n(e) } o.done ? t(c) : Promise.resolve(c).then(r, a) }

		function r(e, t) { for (var n = 0; n < t.length; n++) { var r = t[n];
						r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r) } }

		function a(e, t, n) { return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e } return function() {
				function e() {! function(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }(this, e), this.vpt = 10, this.limitNodeType = ["button"], this.uaInfo = {}, this.pageDataQuene = [], this.currentQueneId = null, this.eventHandler = null } var a, i, u; return a = e, (i = [{ key: "guid", value: function() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) { var t = 16 * Math.random() | 0; return ("x" == e ? t : 3 & t | 8).toString(16) })) } }, { key: "getTime", value: function() { return Date.parse(new Date) } }, { key: "init", value: function(e) { var r = this,
										a = e.extentData,
										i = void 0 === a ? null : a,
										u = e.router,
										o = void 0 === u ? null : u,
										c = e.config,
										l = void 0 === c ? {} : c,
										s = e.vptHanlder;
								console.log("monitor init ......"); var v = l.vpt;
								this.vpt = v || this.vpt, this.uaHandler(), this.eventHandler = this.eventCallback.bind(this), document.addEventListener("click", this.eventHandler, !0), o ? o.afterEach(function() { var e, a = (e = regeneratorRuntime.mark((function e(n) { var a; return regeneratorRuntime.wrap((function(e) { for (;;) switch (e.prev = e.next) {
																case 0:
																		r.updateLeaveTime(), r.vptHandler = s.bind(r, r.get()), r.vptHandler(), r.currentQueneId = r.guid(), a = [t(t({ id: r.currentQueneId, path: n.path, uaInfo: r.uaInfo, pageInfo: { entryTime: r.getTime() } }, i), {}, { eventData: [] })], r.pageDataQuene.length >= r.vpt && r.clear(), r.pageDataQuene = r.pageDataQuene.concat(a);
																case 7:
																case "end":
																		return e.stop() } }), e) })), function() { var t = this,
														r = arguments; return new Promise((function(a, i) { var u = e.apply(t, r);

														function o(e) { n(u, a, i, o, c, "next", e) }

														function c(e) { n(u, a, i, o, c, "throw", e) } o(void 0) })) }); return function(e) { return a.apply(this, arguments) } }()) : console.warn("请传入router对象") } }, { key: "uaHandler", value: function() { this.uaInfo = { userAgent: navigator.userAgent, dpiWidth: window.screen.width, dpiHeight: window.screen.height } } }, { key: "updateLeaveTime", value: function() { var e = this,
										t = this.pageDataQuene.findIndex((function(t) { return t.id == e.currentQueneId }));
								t >= 0 && (this.pageDataQuene[t].pageInfo.leaveTime = this.getTime()) } }, { key: "eventCallback", value: function(e) { "click" == e.type && this.clickEventHandler(e) } }, { key: "clickEventHandler", value: function(e) { var t = this,
										n = e.target,
										r = n.innerText,
										a = n.localName,
										i = n.formAction,
										u = n.type; if (this.limitNodeType.includes(a)) { var o = [{ innerText: r, localName: a, formAction: i, eleType: u, eventType: "click", clickTime: this.getTime() }],
												c = this.pageDataQuene.findIndex((function(e) { return e.id == t.currentQueneId }));
										c >= 0 && (this.pageDataQuene[c].eventData = this.pageDataQuene[c].eventData.concat(o)) } } }, { key: "vptHandler", value: function() { this.pageDataQuene.length >= this.vpt && this.sendData() } }, { key: "get", value: function() { return { value: this.pageDataQuene, length: this.pageDataQuene.length } } }, { key: "clear", value: function() { this.pageDataQuene = [] } }, { key: "destroy", value: function() { document.removeEventListener("click", this.eventHandler, !0) } }]) && r(a.prototype, i), u && r(a, u), e }() }));
