import e from"react";const t=({children:t,variant:r})=>{switch(r){case"h1":return e.createElement("h1",{className:"cp-typography"},t);case"h2":return e.createElement("h2",{className:"cp-typography"},t);case"h3":return e.createElement("h3",{className:"cp-typography"},t);case"h4":return e.createElement("h4",{className:"cp-typography"},t);case"h5":return e.createElement("h5",{className:"cp-typography"},t);case"h6":return e.createElement("h6",{className:"cp-typography"},t);default:return e.createElement("p",{className:"cp-typography"},t)}},r=({children:e})=>React.createElement("div",{className:"cp-app-shell"},e),n=({children:t})=>e.createElement("p",{className:"cp-modal"},t),o=({label:t})=>e.createElement("p",{className:"cp-badge"},t);var a={Input:({name:t,id:r,onChange:n,defaultValue:o,value:a,label:c="",isDisabled:i=!1,type:u="text",className:s=""})=>{const l=`cp-form-field cp-input-field ${s}`;return e.createElement("div",{className:l},c&&e.createElement("label",{className:"cp-form-label"},c),e.createElement("input",{className:"cp-form-control",type:u,disabled:i,name:t,id:r,defaultValue:o,value:a,onChange:e=>{n&&n(e)}}))},TextArea:({name:t,id:r,onChange:n,defaultValue:o,value:a,label:c="",isDisabled:i=!1,type:u="text",className:s=""})=>{const l=`cp-form-field cp-textarea-field ${s}`;return e.createElement("div",{className:l},c&&e.createElement("label",{className:"cp-form-label"},c),e.createElement("textarea",{className:"cp-form-control",type:u,disabled:i,name:t,id:r,defaultValue:o,value:a,onChange:e=>{n&&n(e)}}))}};function c(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var i,u,s,l,f={exports:{}};function p(){if(u)return i;u=1;return i="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}var y,d={exports:{}},m={};var b,v,h,g,_,E,O,S,w,$,x={};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function N(){return v||(v=1,"production"===process.env.NODE_ENV?d.exports=function(){if(b)return x;b=1;var e="function"==typeof Symbol&&Symbol.for,t=e?Symbol.for("react.element"):60103,r=e?Symbol.for("react.portal"):60106,n=e?Symbol.for("react.fragment"):60107,o=e?Symbol.for("react.strict_mode"):60108,a=e?Symbol.for("react.profiler"):60114,c=e?Symbol.for("react.provider"):60109,i=e?Symbol.for("react.context"):60110,u=e?Symbol.for("react.async_mode"):60111,s=e?Symbol.for("react.concurrent_mode"):60111,l=e?Symbol.for("react.forward_ref"):60112,f=e?Symbol.for("react.suspense"):60113,p=e?Symbol.for("react.suspense_list"):60120,y=e?Symbol.for("react.memo"):60115,d=e?Symbol.for("react.lazy"):60116,m=e?Symbol.for("react.block"):60121,v=e?Symbol.for("react.fundamental"):60117,h=e?Symbol.for("react.responder"):60118,g=e?Symbol.for("react.scope"):60119;function _(e){if("object"==typeof e&&null!==e){var p=e.$$typeof;switch(p){case t:switch(e=e.type){case u:case s:case n:case a:case o:case f:return e;default:switch(e=e&&e.$$typeof){case i:case l:case d:case y:case c:return e;default:return p}}case r:return p}}}function E(e){return _(e)===s}return x.AsyncMode=u,x.ConcurrentMode=s,x.ContextConsumer=i,x.ContextProvider=c,x.Element=t,x.ForwardRef=l,x.Fragment=n,x.Lazy=d,x.Memo=y,x.Portal=r,x.Profiler=a,x.StrictMode=o,x.Suspense=f,x.isAsyncMode=function(e){return E(e)||_(e)===u},x.isConcurrentMode=E,x.isContextConsumer=function(e){return _(e)===i},x.isContextProvider=function(e){return _(e)===c},x.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===t},x.isForwardRef=function(e){return _(e)===l},x.isFragment=function(e){return _(e)===n},x.isLazy=function(e){return _(e)===d},x.isMemo=function(e){return _(e)===y},x.isPortal=function(e){return _(e)===r},x.isProfiler=function(e){return _(e)===a},x.isStrictMode=function(e){return _(e)===o},x.isSuspense=function(e){return _(e)===f},x.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===n||e===s||e===a||e===o||e===f||e===p||"object"==typeof e&&null!==e&&(e.$$typeof===d||e.$$typeof===y||e.$$typeof===c||e.$$typeof===i||e.$$typeof===l||e.$$typeof===v||e.$$typeof===h||e.$$typeof===g||e.$$typeof===m)},x.typeOf=_,x}():d.exports=(y||(y=1,"production"!==process.env.NODE_ENV&&function(){var e="function"==typeof Symbol&&Symbol.for,t=e?Symbol.for("react.element"):60103,r=e?Symbol.for("react.portal"):60106,n=e?Symbol.for("react.fragment"):60107,o=e?Symbol.for("react.strict_mode"):60108,a=e?Symbol.for("react.profiler"):60114,c=e?Symbol.for("react.provider"):60109,i=e?Symbol.for("react.context"):60110,u=e?Symbol.for("react.async_mode"):60111,s=e?Symbol.for("react.concurrent_mode"):60111,l=e?Symbol.for("react.forward_ref"):60112,f=e?Symbol.for("react.suspense"):60113,p=e?Symbol.for("react.suspense_list"):60120,y=e?Symbol.for("react.memo"):60115,d=e?Symbol.for("react.lazy"):60116,b=e?Symbol.for("react.block"):60121,v=e?Symbol.for("react.fundamental"):60117,h=e?Symbol.for("react.responder"):60118,g=e?Symbol.for("react.scope"):60119;function _(e){if("object"==typeof e&&null!==e){var p=e.$$typeof;switch(p){case t:var m=e.type;switch(m){case u:case s:case n:case a:case o:case f:return m;default:var b=m&&m.$$typeof;switch(b){case i:case l:case d:case y:case c:return b;default:return p}}case r:return p}}}var E=u,O=s,S=i,w=c,$=t,x=l,N=n,j=d,T=y,P=r,I=a,C=o,k=f,R=!1;function V(e){return _(e)===s}m.AsyncMode=E,m.ConcurrentMode=O,m.ContextConsumer=S,m.ContextProvider=w,m.Element=$,m.ForwardRef=x,m.Fragment=N,m.Lazy=j,m.Memo=T,m.Portal=P,m.Profiler=I,m.StrictMode=C,m.Suspense=k,m.isAsyncMode=function(e){return R||(R=!0,console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")),V(e)||_(e)===u},m.isConcurrentMode=V,m.isContextConsumer=function(e){return _(e)===i},m.isContextProvider=function(e){return _(e)===c},m.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===t},m.isForwardRef=function(e){return _(e)===l},m.isFragment=function(e){return _(e)===n},m.isLazy=function(e){return _(e)===d},m.isMemo=function(e){return _(e)===y},m.isPortal=function(e){return _(e)===r},m.isProfiler=function(e){return _(e)===a},m.isStrictMode=function(e){return _(e)===o},m.isSuspense=function(e){return _(e)===f},m.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===n||e===s||e===a||e===o||e===f||e===p||"object"==typeof e&&null!==e&&(e.$$typeof===d||e.$$typeof===y||e.$$typeof===c||e.$$typeof===i||e.$$typeof===l||e.$$typeof===v||e.$$typeof===h||e.$$typeof===g||e.$$typeof===b)},m.typeOf=_}()),m)),d.exports}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/function j(){if(g)return h;g=1;var e=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable;return h=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(n,o){for(var a,c,i=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(n),u=1;u<arguments.length;u++){for(var s in a=Object(arguments[u]))t.call(a,s)&&(i[s]=a[s]);if(e){c=e(a);for(var l=0;l<c.length;l++)r.call(a,c[l])&&(i[c[l]]=a[c[l]])}}return i},h}function T(){return E?_:(E=1,_=Function.call.bind(Object.prototype.hasOwnProperty))}if("production"!==process.env.NODE_ENV){var P=N();f.exports=function(){if($)return w;$=1;var e=N(),t=j(),r=p(),n=T(),o=function(){if(S)return O;S=1;var e=function(){};if("production"!==process.env.NODE_ENV){var t=p(),r={},n=T();e=function(e){var t="Warning: "+e;"undefined"!=typeof console&&console.error(t);try{throw new Error(t)}catch(e){}}}function o(o,a,c,i,u){if("production"!==process.env.NODE_ENV)for(var s in o)if(n(o,s)){var l;try{if("function"!=typeof o[s]){var f=Error((i||"React class")+": "+c+" type `"+s+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+typeof o[s]+"`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");throw f.name="Invariant Violation",f}l=o[s](a,s,i,c,null,t)}catch(e){l=e}if(!l||l instanceof Error||e((i||"React class")+": type specification of "+c+" `"+s+"` is invalid; the type checker function must return `null` or an `Error` but returned a "+typeof l+". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."),l instanceof Error&&!(l.message in r)){r[l.message]=!0;var p=u?u():"";e("Failed "+c+" type: "+l.message+(null!=p?p:""))}}}return o.resetWarningCache=function(){"production"!==process.env.NODE_ENV&&(r={})},O=o}(),a=function(){};function c(){return null}return"production"!==process.env.NODE_ENV&&(a=function(e){var t="Warning: "+e;"undefined"!=typeof console&&console.error(t);try{throw new Error(t)}catch(e){}}),w=function(i,u){var s="function"==typeof Symbol&&Symbol.iterator,l="@@iterator",f="<<anonymous>>",p={array:b("array"),bigint:b("bigint"),bool:b("boolean"),func:b("function"),number:b("number"),object:b("object"),string:b("string"),symbol:b("symbol"),any:m(c),arrayOf:function(e){return m((function(t,n,o,a,c){if("function"!=typeof e)return new d("Property `"+c+"` of component `"+o+"` has invalid PropType notation inside arrayOf.");var i=t[n];if(!Array.isArray(i))return new d("Invalid "+a+" `"+c+"` of type `"+g(i)+"` supplied to `"+o+"`, expected an array.");for(var u=0;u<i.length;u++){var s=e(i,u,o,a,c+"["+u+"]",r);if(s instanceof Error)return s}return null}))},element:m((function(e,t,r,n,o){var a=e[t];return i(a)?null:new d("Invalid "+n+" `"+o+"` of type `"+g(a)+"` supplied to `"+r+"`, expected a single ReactElement.")})),elementType:m((function(t,r,n,o,a){var c=t[r];return e.isValidElementType(c)?null:new d("Invalid "+o+" `"+a+"` of type `"+g(c)+"` supplied to `"+n+"`, expected a single ReactElement type.")})),instanceOf:function(e){return m((function(t,r,n,o,a){if(!(t[r]instanceof e)){var c=e.name||f;return new d("Invalid "+o+" `"+a+"` of type `"+((i=t[r]).constructor&&i.constructor.name?i.constructor.name:f)+"` supplied to `"+n+"`, expected instance of `"+c+"`.")}var i;return null}))},node:m((function(e,t,r,n,o){return h(e[t])?null:new d("Invalid "+n+" `"+o+"` supplied to `"+r+"`, expected a ReactNode.")})),objectOf:function(e){return m((function(t,o,a,c,i){if("function"!=typeof e)return new d("Property `"+i+"` of component `"+a+"` has invalid PropType notation inside objectOf.");var u=t[o],s=g(u);if("object"!==s)return new d("Invalid "+c+" `"+i+"` of type `"+s+"` supplied to `"+a+"`, expected an object.");for(var l in u)if(n(u,l)){var f=e(u,l,a,c,i+"."+l,r);if(f instanceof Error)return f}return null}))},oneOf:function(e){return Array.isArray(e)?m((function(t,r,n,o,a){for(var c=t[r],i=0;i<e.length;i++)if(y(c,e[i]))return null;var u=JSON.stringify(e,(function(e,t){return"symbol"===_(t)?String(t):t}));return new d("Invalid "+o+" `"+a+"` of value `"+String(c)+"` supplied to `"+n+"`, expected one of "+u+".")})):("production"!==process.env.NODE_ENV&&a(arguments.length>1?"Invalid arguments supplied to oneOf, expected an array, got "+arguments.length+" arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).":"Invalid argument supplied to oneOf, expected an array."),c)},oneOfType:function(e){if(!Array.isArray(e))return"production"!==process.env.NODE_ENV&&a("Invalid argument supplied to oneOfType, expected an instance of array."),c;for(var t=0;t<e.length;t++){var o=e[t];if("function"!=typeof o)return a("Invalid argument supplied to oneOfType. Expected an array of check functions, but received "+E(o)+" at index "+t+"."),c}return m((function(t,o,a,c,i){for(var u=[],s=0;s<e.length;s++){var l=(0,e[s])(t,o,a,c,i,r);if(null==l)return null;l.data&&n(l.data,"expectedType")&&u.push(l.data.expectedType)}return new d("Invalid "+c+" `"+i+"` supplied to `"+a+"`"+(u.length>0?", expected one of type ["+u.join(", ")+"]":"")+".")}))},shape:function(e){return m((function(t,n,o,a,c){var i=t[n],u=g(i);if("object"!==u)return new d("Invalid "+a+" `"+c+"` of type `"+u+"` supplied to `"+o+"`, expected `object`.");for(var s in e){var l=e[s];if("function"!=typeof l)return v(o,a,c,s,_(l));var f=l(i,s,o,a,c+"."+s,r);if(f)return f}return null}))},exact:function(e){return m((function(o,a,c,i,u){var s=o[a],l=g(s);if("object"!==l)return new d("Invalid "+i+" `"+u+"` of type `"+l+"` supplied to `"+c+"`, expected `object`.");var f=t({},o[a],e);for(var p in f){var y=e[p];if(n(e,p)&&"function"!=typeof y)return v(c,i,u,p,_(y));if(!y)return new d("Invalid "+i+" `"+u+"` key `"+p+"` supplied to `"+c+"`.\nBad object: "+JSON.stringify(o[a],null,"  ")+"\nValid keys: "+JSON.stringify(Object.keys(e),null,"  "));var m=y(s,p,c,i,u+"."+p,r);if(m)return m}return null}))}};function y(e,t){return e===t?0!==e||1/e==1/t:e!=e&&t!=t}function d(e,t){this.message=e,this.data=t&&"object"==typeof t?t:{},this.stack=""}function m(e){if("production"!==process.env.NODE_ENV)var t={},n=0;function o(o,c,i,s,l,p,y){if(s=s||f,p=p||i,y!==r){if(u){var m=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");throw m.name="Invariant Violation",m}if("production"!==process.env.NODE_ENV&&"undefined"!=typeof console){var b=s+":"+i;!t[b]&&n<3&&(a("You are manually calling a React.PropTypes validation function for the `"+p+"` prop on `"+s+"`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."),t[b]=!0,n++)}}return null==c[i]?o?null===c[i]?new d("The "+l+" `"+p+"` is marked as required in `"+s+"`, but its value is `null`."):new d("The "+l+" `"+p+"` is marked as required in `"+s+"`, but its value is `undefined`."):null:e(c,i,s,l,p)}var c=o.bind(null,!1);return c.isRequired=o.bind(null,!0),c}function b(e){return m((function(t,r,n,o,a,c){var i=t[r];return g(i)!==e?new d("Invalid "+o+" `"+a+"` of type `"+_(i)+"` supplied to `"+n+"`, expected `"+e+"`.",{expectedType:e}):null}))}function v(e,t,r,n,o){return new d((e||"React class")+": "+t+" type `"+r+"."+n+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+o+"`.")}function h(e){switch(typeof e){case"number":case"string":case"undefined":return!0;case"boolean":return!e;case"object":if(Array.isArray(e))return e.every(h);if(null===e||i(e))return!0;var t=function(e){var t=e&&(s&&e[s]||e[l]);if("function"==typeof t)return t}(e);if(!t)return!1;var r,n=t.call(e);if(t!==e.entries){for(;!(r=n.next()).done;)if(!h(r.value))return!1}else for(;!(r=n.next()).done;){var o=r.value;if(o&&!h(o[1]))return!1}return!0;default:return!1}}function g(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":function(e,t){return"symbol"===e||!!t&&("Symbol"===t["@@toStringTag"]||"function"==typeof Symbol&&t instanceof Symbol)}(t,e)?"symbol":t}function _(e){if(null==e)return""+e;var t=g(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}function E(e){var t=_(e);switch(t){case"array":case"object":return"an "+t;case"boolean":case"date":case"regexp":return"a "+t;default:return t}}return d.prototype=Error.prototype,p.checkPropTypes=o,p.resetWarningCache=o.resetWarningCache,p.PropTypes=p,p},w}()(P.isElement,!0)}else f.exports=function(){if(l)return s;l=1;var e=p();function t(){}function r(){}return r.resetWarningCache=t,s=function(){function n(t,r,n,o,a,c){if(c!==e){var i=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}function o(){return n}n.isRequired=n;var a={array:n,bigint:n,bool:n,func:n,number:n,object:n,string:n,symbol:n,any:n,arrayOf:o,element:n,elementType:n,instanceOf:o,node:n,objectOf:o,oneOf:o,oneOfType:o,shape:o,exact:o,checkPropTypes:r,resetWarningCache:t};return a.PropTypes=a,a}}()();var I=c(f.exports),C={"cp-icon":"Icon-module_cp-icon__onsmO",small:"Icon-module_small__9C3K-",medium:"Icon-module_medium__0kcM-",large:"Icon-module_large__LvTw7",black:"Icon-module_black__zBBu5",white:"Icon-module_white__3rwyA",gray:"Icon-module_gray__CLINZ"};const k=({name:t="",size:r="medium",className:n="",color:o="black"})=>e.createElement("span",{className:`${C["cp-icon"]} ${C[r]} ${C[o]} ${n}`},t);k.propTypes={name:I.string,size:I.oneOf(["small","medium","large"]),color:I.oneOf(["black","white","gray"])};var R={"cp-button":"Button-module_cp-button__t348U",small:"Button-module_small__FaxG-",medium:"Button-module_medium__gHl4b",disabled:"Button-module_disabled__En-KU",loading:"Button-module_loading__cFq1s","cp-button-loader":"Button-module_cp-button-loader__Ee1ij","spin-animation":"Button-module_spin-animation__lrjqF",outline:"Button-module_outline__LI97x"};const V=({children:t,isLoading:r=!1,isDisabled:n=!1,size:o="medium",variant:a="solid",onClick:c})=>e.createElement("button",{className:`${R["cp-button"]} ${R[a]} ${R[o]} ${n?R.disabled:""}  ${r?R.loading:""}`,onClick:e=>(e=>{n||r?e.preventDefault():"function"==typeof c&&c(e)})(e)},r&&e.createElement(k,{name:"progress_activity",className:R["cp-button-loader"]}),t);k.propTypes={size:I.oneOf(["small","medium"]),variant:I.oneOf(["solid","outline"])};export{r as AppShell,o as Badge,V as Button,a as FormControls,k as Icon,n as Modal,t as Typography};
