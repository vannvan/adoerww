/*!
 * avgrund 0.1
 * http://lab.hakim.se/avgrund
 * MIT licensed
 * 模态框组件
 * Copyright (C) 2012 Hakim El Hattab, http://hakim.se
 */
import $ from 'jquery'
import { isEmpty } from '@/lib/utils'

function isUserInfo() {
    let userInfoString = localStorage.getItem('pt-plug-access-user')
    if (!isEmpty(userInfoString) && userInfoString !== 'undefined' && JSON.parse(userInfoString) !== null) {
        deactivate();
        $('#account').hide()
        $('#exit').hide()
        $("#topLoginDiv").show()
        $('#loginH').html('<i class="iconfont">&#xe63c;</i>' + '登录').show()
        return false
    }
    return true
}

export const ShopeModal = (function() {
    var container = document.documentElement,
        popup = document.querySelector('.modal-animate'),
        currentState = null;
    container.className = container.className.replace(/\s+$/gi, '') + ' ready';
    // Deactivate on ESC
    function onDocumentKeyUp(event) {
        if (event.keyCode === 27) {
            if (!isUserInfo()) {
                return
            }
            deactivate();
        }
    }
    // Deactivate on click close
    function onDocumentClick(event) {
        if (event.target.id.indexOf('loginClose') > -1) { //登录模态框显示登录按钮
            if (!isUserInfo()) {
                return
            }

        }
        if (event.target.className.indexOf('modal-head-close') > -1) {
            deactivate();
        }
    }

    function activate(state) {
        if (typeof window.addEventListener != "undefined") {
            document.addEventListener('keyup', onDocumentKeyUp, false);
            document.addEventListener('click', onDocumentClick, false);
            document.addEventListener('touchstart', onDocumentClick, false);
        } else {
            document.attachEvent('keyup', onDocumentKeyUp);
            document.attachEvent('click', onDocumentClick);
            document.attachEvent('touchstart', onDocumentClick);
        }
        removeClass(popup, currentState);
        addClass(popup, 'no-transition');
        addClass(popup, state);
        setTimeout(function() {
            removeClass(popup, 'no-transition');
            addClass(container, 'active');
        }, 0);
        currentState = state;
    }

    function deactivate() {
        if (typeof window.addEventListener != "undefined") {
            document.removeEventListener('keyup', onDocumentKeyUp, false);
            document.removeEventListener('click', onDocumentClick, false);
            document.removeEventListener('touchstart', onDocumentClick, false);
        } else {
            document.detachEvent('keyup', onDocumentKeyUp);
            document.detachEvent('click', onDocumentClick);
            document.detachEvent('touchstart', onDocumentClick);
        }
        removeClass(container, 'active');
        removeClass(popup, 'modal-animate')
    }

    function disableBlur() {
        addClass(document.documentElement, 'no-blur');
    }

    function addClass(element, name) {
        if (element !== null && element.className != null) {
            element.className = element.className.replace(/\s+$/gi, '') + ' ' + name;
        }
    }

    function removeClass(element, name) {
        if (element) element.className = element.className.replace(name, '').replace(name, '').replace(name, '');
    }

    function show(selector) {
        popup = document.querySelector(selector);
        addClass(popup, 'modal-animate');
        activate();
        return this;
    }

    function hide() {
        deactivate();
    }
    return {
        disableBlur: disableBlur,
        deactivate: deactivate,
        activate: activate,
        hide: hide,
        show: show
    }
})();