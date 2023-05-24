!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("UCSSO",[],t):"object"==typeof exports?exports.UCSSO=t():e.UCSSO=t()}(this,function(){return function(e){function t(r){if(o[r])return o[r].exports;var n=o[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var o={};return t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,o,r){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t){!function(){"use strict";function t(e){this.ucSsoUrl=e.ucSsoUrl,this.responseType=e.responseType||"token",this.clientId=e.clientId,this.redirectUri=e.redirectUri,this.scope=e.scope}var o={clearWebAuth:function(e){localStorage.removeItem("access_token_tc"),localStorage.removeItem("id_token_tc"),localStorage.removeItem("expires_in"),localStorage.removeItem("access_token_received_at"),"function"==typeof e&&e()},parseIDToken:function(e){var t=e.split(".")[1];return t=function(e){return window.atob(e.replace(/_/g,"/").replace(/-/g,"+"))}(t),JSON.parse(decodeURIComponent(window.escape(t)))},createQueryString:function(e){var t,o="?";for(t in e)e.hasOwnProperty(t)&&e[t]&&(o=o+t+"="+encodeURIComponent(e[t])+"&");return o.slice(0,-1)},parseQueryString:function(e,t){var o,r,n,i,c={};if(null!==(n=(e||location.search).match(/[\?\&\#][^\?\&\#]+=[^\?\&\#]+/g)))for(o=0,r=n.length;o<r;o+=1)i=n[o].slice(1).split("="),c[i[0]]=decodeURIComponent(i[1]);"function"==typeof t&&t(c)},handleRedirectError:function(e){var t,o=window.location.href;this.parseQueryString(o,function(o){(t=o.error)&&"function"==typeof e&&-1!==["invalid_request","invalid_client","invalid_grant","unauthorized_client","unsupported_grant_type","invalid_scope"].indexOf(t)&&e(t,o.error_description)})},getAccessToken:function(){if(localStorage.getItem("access_token_tc"))return localStorage.getItem("access_token_tc");throw new Error("Error! There is no access token")},getIdToken:function(){if(localStorage.getItem("id_token_tc"))return localStorage.getItem("id_token_tc");throw new Error("Error! There is no id token")}};t.prototype.authorize=function(e){var t=(new Date).getTime(),r={response_type:this.responseType,client_id:this.clientId,redirect_uri:this.redirectUri,scope:this.scope,state:t};localStorage.getItem("state")||(localStorage.setItem("state",t),o.clearWebAuth(),"function"==typeof e&&e(),location.href=this.ucSsoUrl+"/authorize"+o.createQueryString(r))},t.prototype.initWebAuth=function(e,t){var r=this;o.parseQueryString(window.location.href,function(o){var n,i,c,a,s,l,u;n=o.access_token,l=o.state,u=localStorage.getItem("state"),localStorage.removeItem("state"),n?u&&u!==l?"function"==typeof t&&t("invalid_state","invalid_state"):(i=o.id_token,s=1e3*parseInt(o.expires_in,10),c=(new Date).getTime(),localStorage.setItem("access_token_tc",n),localStorage.setItem("id_token_tc",i),localStorage.setItem("expires_in",s),localStorage.setItem("access_token_received_at",c),"function"==typeof e&&e(n,i,c,s)):(n=localStorage.getItem("access_token_tc"),n?(s=parseInt(localStorage.getItem("expires_in"),10),c=parseInt(localStorage.getItem("access_token_received_at"),10),i=localStorage.getItem("id_token_tc"),a=(new Date).getTime(),c+s<a?("function"==typeof t&&t("access_token_expire","access_token_expire"),r.authorize()):"function"==typeof e&&e(n,i,c,s)):("function"==typeof t&&t("no_access_token","no_access_token"),o.error||r.authorize()))})},e.exports={WebAuth:t,staticMethod:o}}()}])});