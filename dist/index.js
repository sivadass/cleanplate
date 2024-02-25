"use strict";var e=require("react");var r={Input:({name:r,id:t,onChange:n,defaultValue:o,value:a,label:c="",isDisabled:i=!1,type:u="text",className:s=""})=>{const l=`cp-form-field cp-input-field ${s}`;return e.createElement("div",{className:l},c&&e.createElement("label",{className:"cp-form-label"},c),e.createElement("input",{className:"cp-form-control",type:u,disabled:i,name:r,id:t,defaultValue:o,value:a,onChange:e=>{n&&n(e)}}))},TextArea:({name:r,id:t,onChange:n,defaultValue:o,value:a,label:c="",isDisabled:i=!1,type:u="text",className:s=""})=>{const l=`cp-form-field cp-textarea-field ${s}`;return e.createElement("div",{className:l},c&&e.createElement("label",{className:"cp-form-label"},c),e.createElement("textarea",{className:"cp-form-control",type:u,disabled:i,name:r,id:t,defaultValue:o,value:a,onChange:e=>{n&&n(e)}}))}};function t(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var n,o,a,c,i={exports:{}};function u(){if(o)return n;o=1;return n="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}var s,l={exports:{}},f={};var p,y,d,m,b,v,h,g,E,S,O={};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function w(){return y||(y=1,"production"===process.env.NODE_ENV?l.exports=function(){if(p)return O;p=1;var e="function"==typeof Symbol&&Symbol.for,r=e?Symbol.for("react.element"):60103,t=e?Symbol.for("react.portal"):60106,n=e?Symbol.for("react.fragment"):60107,o=e?Symbol.for("react.strict_mode"):60108,a=e?Symbol.for("react.profiler"):60114,c=e?Symbol.for("react.provider"):60109,i=e?Symbol.for("react.context"):60110,u=e?Symbol.for("react.async_mode"):60111,s=e?Symbol.for("react.concurrent_mode"):60111,l=e?Symbol.for("react.forward_ref"):60112,f=e?Symbol.for("react.suspense"):60113,y=e?Symbol.for("react.suspense_list"):60120,d=e?Symbol.for("react.memo"):60115,m=e?Symbol.for("react.lazy"):60116,b=e?Symbol.for("react.block"):60121,v=e?Symbol.for("react.fundamental"):60117,h=e?Symbol.for("react.responder"):60118,g=e?Symbol.for("react.scope"):60119;function E(e){if("object"==typeof e&&null!==e){var p=e.$$typeof;switch(p){case r:switch(e=e.type){case u:case s:case n:case a:case o:case f:return e;default:switch(e=e&&e.$$typeof){case i:case l:case m:case d:case c:return e;default:return p}}case t:return p}}}function S(e){return E(e)===s}return O.AsyncMode=u,O.ConcurrentMode=s,O.ContextConsumer=i,O.ContextProvider=c,O.Element=r,O.ForwardRef=l,O.Fragment=n,O.Lazy=m,O.Memo=d,O.Portal=t,O.Profiler=a,O.StrictMode=o,O.Suspense=f,O.isAsyncMode=function(e){return S(e)||E(e)===u},O.isConcurrentMode=S,O.isContextConsumer=function(e){return E(e)===i},O.isContextProvider=function(e){return E(e)===c},O.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===r},O.isForwardRef=function(e){return E(e)===l},O.isFragment=function(e){return E(e)===n},O.isLazy=function(e){return E(e)===m},O.isMemo=function(e){return E(e)===d},O.isPortal=function(e){return E(e)===t},O.isProfiler=function(e){return E(e)===a},O.isStrictMode=function(e){return E(e)===o},O.isSuspense=function(e){return E(e)===f},O.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===n||e===s||e===a||e===o||e===f||e===y||"object"==typeof e&&null!==e&&(e.$$typeof===m||e.$$typeof===d||e.$$typeof===c||e.$$typeof===i||e.$$typeof===l||e.$$typeof===v||e.$$typeof===h||e.$$typeof===g||e.$$typeof===b)},O.typeOf=E,O}():l.exports=(s||(s=1,"production"!==process.env.NODE_ENV&&function(){var e="function"==typeof Symbol&&Symbol.for,r=e?Symbol.for("react.element"):60103,t=e?Symbol.for("react.portal"):60106,n=e?Symbol.for("react.fragment"):60107,o=e?Symbol.for("react.strict_mode"):60108,a=e?Symbol.for("react.profiler"):60114,c=e?Symbol.for("react.provider"):60109,i=e?Symbol.for("react.context"):60110,u=e?Symbol.for("react.async_mode"):60111,s=e?Symbol.for("react.concurrent_mode"):60111,l=e?Symbol.for("react.forward_ref"):60112,p=e?Symbol.for("react.suspense"):60113,y=e?Symbol.for("react.suspense_list"):60120,d=e?Symbol.for("react.memo"):60115,m=e?Symbol.for("react.lazy"):60116,b=e?Symbol.for("react.block"):60121,v=e?Symbol.for("react.fundamental"):60117,h=e?Symbol.for("react.responder"):60118,g=e?Symbol.for("react.scope"):60119;function E(e){if("object"==typeof e&&null!==e){var f=e.$$typeof;switch(f){case r:var y=e.type;switch(y){case u:case s:case n:case a:case o:case p:return y;default:var b=y&&y.$$typeof;switch(b){case i:case l:case m:case d:case c:return b;default:return f}}case t:return f}}}var S=u,O=s,w=i,x=c,$=r,_=l,N=n,j=m,T=d,P=t,I=a,C=o,k=p,R=!1;function V(e){return E(e)===s}f.AsyncMode=S,f.ConcurrentMode=O,f.ContextConsumer=w,f.ContextProvider=x,f.Element=$,f.ForwardRef=_,f.Fragment=N,f.Lazy=j,f.Memo=T,f.Portal=P,f.Profiler=I,f.StrictMode=C,f.Suspense=k,f.isAsyncMode=function(e){return R||(R=!0,console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")),V(e)||E(e)===u},f.isConcurrentMode=V,f.isContextConsumer=function(e){return E(e)===i},f.isContextProvider=function(e){return E(e)===c},f.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===r},f.isForwardRef=function(e){return E(e)===l},f.isFragment=function(e){return E(e)===n},f.isLazy=function(e){return E(e)===m},f.isMemo=function(e){return E(e)===d},f.isPortal=function(e){return E(e)===t},f.isProfiler=function(e){return E(e)===a},f.isStrictMode=function(e){return E(e)===o},f.isSuspense=function(e){return E(e)===p},f.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===n||e===s||e===a||e===o||e===p||e===y||"object"==typeof e&&null!==e&&(e.$$typeof===m||e.$$typeof===d||e.$$typeof===c||e.$$typeof===i||e.$$typeof===l||e.$$typeof===v||e.$$typeof===h||e.$$typeof===g||e.$$typeof===b)},f.typeOf=E}()),f)),l.exports}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/function x(){if(m)return d;m=1;var e=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable;return d=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(r).map((function(e){return r[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(n,o){for(var a,c,i=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(n),u=1;u<arguments.length;u++){for(var s in a=Object(arguments[u]))r.call(a,s)&&(i[s]=a[s]);if(e){c=e(a);for(var l=0;l<c.length;l++)t.call(a,c[l])&&(i[c[l]]=a[c[l]])}}return i},d}function $(){return v?b:(v=1,b=Function.call.bind(Object.prototype.hasOwnProperty))}if("production"!==process.env.NODE_ENV){var _=w();i.exports=function(){if(S)return E;S=1;var e=w(),r=x(),t=u(),n=$(),o=function(){if(g)return h;g=1;var e=function(){};if("production"!==process.env.NODE_ENV){var r=u(),t={},n=$();e=function(e){var r="Warning: "+e;"undefined"!=typeof console&&console.error(r);try{throw new Error(r)}catch(e){}}}function o(o,a,c,i,u){if("production"!==process.env.NODE_ENV)for(var s in o)if(n(o,s)){var l;try{if("function"!=typeof o[s]){var f=Error((i||"React class")+": "+c+" type `"+s+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+typeof o[s]+"`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");throw f.name="Invariant Violation",f}l=o[s](a,s,i,c,null,r)}catch(e){l=e}if(!l||l instanceof Error||e((i||"React class")+": type specification of "+c+" `"+s+"` is invalid; the type checker function must return `null` or an `Error` but returned a "+typeof l+". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."),l instanceof Error&&!(l.message in t)){t[l.message]=!0;var p=u?u():"";e("Failed "+c+" type: "+l.message+(null!=p?p:""))}}}return o.resetWarningCache=function(){"production"!==process.env.NODE_ENV&&(t={})},h=o}(),a=function(){};function c(){return null}return"production"!==process.env.NODE_ENV&&(a=function(e){var r="Warning: "+e;"undefined"!=typeof console&&console.error(r);try{throw new Error(r)}catch(e){}}),E=function(i,u){var s="function"==typeof Symbol&&Symbol.iterator,l="@@iterator",f="<<anonymous>>",p={array:b("array"),bigint:b("bigint"),bool:b("boolean"),func:b("function"),number:b("number"),object:b("object"),string:b("string"),symbol:b("symbol"),any:m(c),arrayOf:function(e){return m((function(r,n,o,a,c){if("function"!=typeof e)return new d("Property `"+c+"` of component `"+o+"` has invalid PropType notation inside arrayOf.");var i=r[n];if(!Array.isArray(i))return new d("Invalid "+a+" `"+c+"` of type `"+g(i)+"` supplied to `"+o+"`, expected an array.");for(var u=0;u<i.length;u++){var s=e(i,u,o,a,c+"["+u+"]",t);if(s instanceof Error)return s}return null}))},element:m((function(e,r,t,n,o){var a=e[r];return i(a)?null:new d("Invalid "+n+" `"+o+"` of type `"+g(a)+"` supplied to `"+t+"`, expected a single ReactElement.")})),elementType:m((function(r,t,n,o,a){var c=r[t];return e.isValidElementType(c)?null:new d("Invalid "+o+" `"+a+"` of type `"+g(c)+"` supplied to `"+n+"`, expected a single ReactElement type.")})),instanceOf:function(e){return m((function(r,t,n,o,a){if(!(r[t]instanceof e)){var c=e.name||f;return new d("Invalid "+o+" `"+a+"` of type `"+((i=r[t]).constructor&&i.constructor.name?i.constructor.name:f)+"` supplied to `"+n+"`, expected instance of `"+c+"`.")}var i;return null}))},node:m((function(e,r,t,n,o){return h(e[r])?null:new d("Invalid "+n+" `"+o+"` supplied to `"+t+"`, expected a ReactNode.")})),objectOf:function(e){return m((function(r,o,a,c,i){if("function"!=typeof e)return new d("Property `"+i+"` of component `"+a+"` has invalid PropType notation inside objectOf.");var u=r[o],s=g(u);if("object"!==s)return new d("Invalid "+c+" `"+i+"` of type `"+s+"` supplied to `"+a+"`, expected an object.");for(var l in u)if(n(u,l)){var f=e(u,l,a,c,i+"."+l,t);if(f instanceof Error)return f}return null}))},oneOf:function(e){return Array.isArray(e)?m((function(r,t,n,o,a){for(var c=r[t],i=0;i<e.length;i++)if(y(c,e[i]))return null;var u=JSON.stringify(e,(function(e,r){return"symbol"===E(r)?String(r):r}));return new d("Invalid "+o+" `"+a+"` of value `"+String(c)+"` supplied to `"+n+"`, expected one of "+u+".")})):("production"!==process.env.NODE_ENV&&a(arguments.length>1?"Invalid arguments supplied to oneOf, expected an array, got "+arguments.length+" arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).":"Invalid argument supplied to oneOf, expected an array."),c)},oneOfType:function(e){if(!Array.isArray(e))return"production"!==process.env.NODE_ENV&&a("Invalid argument supplied to oneOfType, expected an instance of array."),c;for(var r=0;r<e.length;r++){var o=e[r];if("function"!=typeof o)return a("Invalid argument supplied to oneOfType. Expected an array of check functions, but received "+S(o)+" at index "+r+"."),c}return m((function(r,o,a,c,i){for(var u=[],s=0;s<e.length;s++){var l=(0,e[s])(r,o,a,c,i,t);if(null==l)return null;l.data&&n(l.data,"expectedType")&&u.push(l.data.expectedType)}return new d("Invalid "+c+" `"+i+"` supplied to `"+a+"`"+(u.length>0?", expected one of type ["+u.join(", ")+"]":"")+".")}))},shape:function(e){return m((function(r,n,o,a,c){var i=r[n],u=g(i);if("object"!==u)return new d("Invalid "+a+" `"+c+"` of type `"+u+"` supplied to `"+o+"`, expected `object`.");for(var s in e){var l=e[s];if("function"!=typeof l)return v(o,a,c,s,E(l));var f=l(i,s,o,a,c+"."+s,t);if(f)return f}return null}))},exact:function(e){return m((function(o,a,c,i,u){var s=o[a],l=g(s);if("object"!==l)return new d("Invalid "+i+" `"+u+"` of type `"+l+"` supplied to `"+c+"`, expected `object`.");var f=r({},o[a],e);for(var p in f){var y=e[p];if(n(e,p)&&"function"!=typeof y)return v(c,i,u,p,E(y));if(!y)return new d("Invalid "+i+" `"+u+"` key `"+p+"` supplied to `"+c+"`.\nBad object: "+JSON.stringify(o[a],null,"  ")+"\nValid keys: "+JSON.stringify(Object.keys(e),null,"  "));var m=y(s,p,c,i,u+"."+p,t);if(m)return m}return null}))}};function y(e,r){return e===r?0!==e||1/e==1/r:e!=e&&r!=r}function d(e,r){this.message=e,this.data=r&&"object"==typeof r?r:{},this.stack=""}function m(e){if("production"!==process.env.NODE_ENV)var r={},n=0;function o(o,c,i,s,l,p,y){if(s=s||f,p=p||i,y!==t){if(u){var m=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");throw m.name="Invariant Violation",m}if("production"!==process.env.NODE_ENV&&"undefined"!=typeof console){var b=s+":"+i;!r[b]&&n<3&&(a("You are manually calling a React.PropTypes validation function for the `"+p+"` prop on `"+s+"`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."),r[b]=!0,n++)}}return null==c[i]?o?null===c[i]?new d("The "+l+" `"+p+"` is marked as required in `"+s+"`, but its value is `null`."):new d("The "+l+" `"+p+"` is marked as required in `"+s+"`, but its value is `undefined`."):null:e(c,i,s,l,p)}var c=o.bind(null,!1);return c.isRequired=o.bind(null,!0),c}function b(e){return m((function(r,t,n,o,a,c){var i=r[t];return g(i)!==e?new d("Invalid "+o+" `"+a+"` of type `"+E(i)+"` supplied to `"+n+"`, expected `"+e+"`.",{expectedType:e}):null}))}function v(e,r,t,n,o){return new d((e||"React class")+": "+r+" type `"+t+"."+n+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+o+"`.")}function h(e){switch(typeof e){case"number":case"string":case"undefined":return!0;case"boolean":return!e;case"object":if(Array.isArray(e))return e.every(h);if(null===e||i(e))return!0;var r=function(e){var r=e&&(s&&e[s]||e[l]);if("function"==typeof r)return r}(e);if(!r)return!1;var t,n=r.call(e);if(r!==e.entries){for(;!(t=n.next()).done;)if(!h(t.value))return!1}else for(;!(t=n.next()).done;){var o=t.value;if(o&&!h(o[1]))return!1}return!0;default:return!1}}function g(e){var r=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":function(e,r){return"symbol"===e||!!r&&("Symbol"===r["@@toStringTag"]||"function"==typeof Symbol&&r instanceof Symbol)}(r,e)?"symbol":r}function E(e){if(null==e)return""+e;var r=g(e);if("object"===r){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return r}function S(e){var r=E(e);switch(r){case"array":case"object":return"an "+r;case"boolean":case"date":case"regexp":return"a "+r;default:return r}}return d.prototype=Error.prototype,p.checkPropTypes=o,p.resetWarningCache=o.resetWarningCache,p.PropTypes=p,p},E}()(_.isElement,!0)}else i.exports=function(){if(c)return a;c=1;var e=u();function r(){}function t(){}return t.resetWarningCache=r,a=function(){function n(r,t,n,o,a,c){if(c!==e){var i=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}function o(){return n}n.isRequired=n;var a={array:n,bigint:n,bool:n,func:n,number:n,object:n,string:n,symbol:n,any:n,arrayOf:o,element:n,elementType:n,instanceOf:o,node:n,objectOf:o,oneOf:o,oneOfType:o,shape:o,exact:o,checkPropTypes:t,resetWarningCache:r};return a.PropTypes=a,a}}()();var N=t(i.exports),j={"cp-icon":"Icon-module_cp-icon__onsmO",small:"Icon-module_small__9C3K-",medium:"Icon-module_medium__0kcM-",large:"Icon-module_large__LvTw7",black:"Icon-module_black__zBBu5",white:"Icon-module_white__3rwyA",gray:"Icon-module_gray__CLINZ"};const T=({name:r="",size:t="medium",className:n="",color:o="black"})=>e.createElement("span",{className:`${j["cp-icon"]} ${j[t]} ${j[o]} ${n}`},r);T.propTypes={name:N.string,size:N.oneOf(["small","medium","large"]),color:N.oneOf(["black","white","gray"])},exports.AppShell=({children:e})=>React.createElement("div",{className:"cp-app-shell"},e),exports.Badge=({label:r})=>e.createElement("p",{className:"cp-badge"},r),exports.Button=({children:r})=>e.createElement("button",{className:"cp-button"},r),exports.FormControls=r,exports.Icon=T,exports.Modal=({children:r})=>e.createElement("p",{className:"cp-modal"},r),exports.Typography=({children:r,variant:t})=>{switch(t){case"h1":return e.createElement("h1",{className:"cp-typography"},r);case"h2":return e.createElement("h2",{className:"cp-typography"},r);case"h3":return e.createElement("h3",{className:"cp-typography"},r);case"h4":return e.createElement("h4",{className:"cp-typography"},r);case"h5":return e.createElement("h5",{className:"cp-typography"},r);case"h6":return e.createElement("h6",{className:"cp-typography"},r);default:return e.createElement("p",{className:"cp-typography"},r)}};
