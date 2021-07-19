/**
 * vue-behavior-monitor
 * @version 0.0.2
 * @author https://github.com/vannvan 
 * @github https://github.com/vannvan/adoerww/blob/master/vue-behavior-monitor/src/index.js 
 * @update Mon Jul 19 2021 16:31:27 GMT+0800 (中国标准时间)
 */

define(function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var Monitor = /*#__PURE__*/function () {
    function Monitor() {
      _classCallCheck(this, Monitor);

      // 发送队列的阈值
      this.vpt = 10; // 事件节点类型限制

      this.limitNodeType = ['button']; // 用户浏览器信息

      this.uaInfo = {}; // 页面级别的数据队列

      this.pageDataQuene = []; // 当前操作队列ID

      this.currentQueneId = null; // 此属性用于保存bind返回的匿名函数

      this.eventHandler = null;
    }
    /**
     * @description 生成guid，当前操作队列的唯一标识
     * @returns {*}
     * @memberof Monitor
     */


    _createClass(Monitor, [{
      key: "guid",
      value: function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : r & 0x3 | 0x8;
          return v.toString(16);
        });
      }
      /**
       * @description 当前时间戳
       * @returns {*}
       * @memberof Monitor
       */

    }, {
      key: "getTime",
      value: function getTime() {
        return Date.parse(new Date());
      }
      /**
       * @description 初始化方法:
       *  extentData 用于传入基于业务的数据信息，
       *  router 是vue-router对象,这里既可以通过init传入，也可以在当前类模块直接引入，
       *  config 是配置信息
       * @param {*} { extentData = null, router = null, config = {} }
       * @memberof Monitor
       */

    }, {
      key: "init",
      value: function init(_ref) {
        var _this = this;

        var _ref$extentData = _ref.extentData,
            extentData = _ref$extentData === void 0 ? null : _ref$extentData,
            _ref$router = _ref.router,
            router = _ref$router === void 0 ? null : _ref$router,
            _ref$config = _ref.config,
            config = _ref$config === void 0 ? {} : _ref$config,
            vptHanlder = _ref.vptHanlder;
        console.log('monitor init ......');
        var vpt = config.vpt;
        this.vpt = vpt ? vpt : this.vpt;
        this.uaHandler();
        this.eventHandler = this.eventCallback.bind(this); // 关键

        document.addEventListener('click', this.eventHandler, true);

        if (router) {
          router.afterEach( /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(to) {
              var initPageData;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      // 离开监听
                      _this.updateLeaveTime(); // 外部传入


                      _this.vptHandler = vptHanlder.bind(_this, _this.get()); // 阈值监听

                      _this.vptHandler(); // 当前操作页面的唯一标识


                      _this.currentQueneId = _this.guid();
                      initPageData = [_objectSpread2(_objectSpread2({
                        id: _this.currentQueneId,
                        path: to.path,
                        uaInfo: _this.uaInfo,
                        pageInfo: {
                          entryTime: _this.getTime()
                        }
                      }, extentData), {}, {
                        eventData: []
                      })];

                      if (_this.pageDataQuene.length >= _this.vpt) {
                        _this.clear();
                      }

                      _this.pageDataQuene = _this.pageDataQuene.concat(initPageData);

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }());
        } else {
          console.warn('请传入router对象');
        }
      }
      /**
       * @description ua信息
       * @memberof Monitor
       */

    }, {
      key: "uaHandler",
      value: function uaHandler() {
        this.uaInfo = {
          userAgent: navigator.userAgent,
          dpiWidth: window.screen.width,
          dpiHeight: window.screen.height
        };
      }
      /**
       * @description 页面离开时间更新
       * @memberof Monitor
       */

    }, {
      key: "updateLeaveTime",
      value: function updateLeaveTime() {
        var _this2 = this;

        var index = this.pageDataQuene.findIndex(function (el) {
          return el.id == _this2.currentQueneId;
        });

        if (index >= 0) {
          this.pageDataQuene[index].pageInfo.leaveTime = this.getTime();
        }
      }
      /**
       * @description 事件回调中转
       * @param {*} e
       * @memberof Monitor
       */

    }, {
      key: "eventCallback",
      value: function eventCallback(e) {
        //TODO
        if (e.type == 'click') {
          this.clickEventHandler(e);
        }
      }
      /**
       * @description 页面点击事件收集
       * @param {*} ele 事件节点
       * @memberof Monitor
       */

    }, {
      key: "clickEventHandler",
      value: function clickEventHandler(ele) {
        var _this3 = this;

        var _ele$target = ele.target,
            innerText = _ele$target.innerText,
            localName = _ele$target.localName,
            formAction = _ele$target.formAction,
            type = _ele$target.type;
        var isEv = this.limitNodeType.includes(localName);

        if (isEv) {
          var eventData = [{
            innerText: innerText,
            localName: localName,
            formAction: formAction,
            eleType: type,
            eventType: 'click',
            clickTime: this.getTime()
          }];
          var index = this.pageDataQuene.findIndex(function (el) {
            return el.id == _this3.currentQueneId;
          });

          if (index >= 0) {
            this.pageDataQuene[index].eventData = this.pageDataQuene[index].eventData.concat(eventData);
          }
        }
      }
      /**
       * @description 阈值监听，达到阈值就发送数据
       * @memberof Monitor
       */

    }, {
      key: "vptHandler",
      value: function vptHandler() {
        if (this.pageDataQuene.length >= this.vpt) {
          this.sendData();
        }
      }
      /**
       * @description 用于外部获取操作队列
       * @returns {*} Object
       * @memberof Monitor
       */

    }, {
      key: "get",
      value: function get() {
        return {
          value: this.pageDataQuene,
          length: this.pageDataQuene.length
        };
      }
      /**
       * @description 用于清空队列
       * @memberof Monitor
       */

    }, {
      key: "clear",
      value: function clear() {
        //TODO
        this.pageDataQuene = [];
      } // 销毁监听事件

    }, {
      key: "destroy",
      value: function destroy() {
        document.removeEventListener('click', this.eventHandler, true);
      }
    }]);

    return Monitor;
  }();

  return Monitor;

});
