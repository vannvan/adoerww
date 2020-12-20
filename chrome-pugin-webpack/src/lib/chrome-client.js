// chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
export function getURL (url) {
    if(!url) return
    return chrome.extension.getURL(url)
}

export function getInContext() {
    return chrome.extension.inIncognitoContext
}

export function request() {
    return chrome.extension.onRequest
}

export function sendRequest() {
    return chrome.extension.sendRequest
}

export function getExtension() {
    return chrome.extension
}

export function lStorage() {
    return chrome.storage
}

export function setlStorage(key, v) {
    
}