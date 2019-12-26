(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    }
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    if (!echarts.registerMap) {
        log('ECharts Map is not loaded')
        return;
    }
    echarts.registerMap('安徽', {"type":"Feature","id":"3201","properties":{"name":"南京市","cp":[118.8062,31.9208],"childNum":3},"geometry":{"type":"Polygon","coordinates":["@@k@ma@kUUVmVIUWVUUaVa@Ñ²k°Jôk@Wmk¯KmX¯aUakKWU@XULXaV@@mUaVUUl@VmkaUXm@WUUna°IlmVmIUW@Uk@@aV@VVX@VI°»nmU@VKVan@m»UaU@U_@WlIUaaVaUala@¯n@kaUkUUWKU@mwkUUmmL@K@LmUUVKVÅImUJVkVVLèVLVU@WLV@nVÜULVUL@bW@XbWbkJUUVUxVXmVk@WUUkVmIV@nbnVWbJUkUULa@Jma@XkK@VVL@L@JLUVU@V¼nXlbm@kbUKmn@lVb@VXXVUV@b@LVbÆxXbl@@lV@UVV@XVK²VlI`UbVbUlVVn@WXn@@VUV@@KmbVLXÒLkKV@nX@VVUV@bnVllbmnbIWVXU@`lLlknVnmlLlbUmVInK°nUU@l@VU@Vn@@alI`VIXaVaVa"],"encodeOffsets":[[121928,33244]]}});
}));