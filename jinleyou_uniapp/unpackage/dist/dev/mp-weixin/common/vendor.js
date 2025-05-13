"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key2) => key2.charCodeAt(0) === 111 && key2.charCodeAt(1) === 110 && // uppercase letter
(key2.charCodeAt(2) > 122 || key2.charCodeAt(2) < 97);
const isModelListener = (key2) => key2.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i2 = arr.indexOf(el);
  if (i2 > -1) {
    arr.splice(i2, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn$1 = (val, key2) => hasOwnProperty$2.call(val, key2);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise$1 = (val) => {
  return (isObject$2(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key2) => isString(key2) && key2 !== "NaN" && key2[0] !== "-" && "" + parseInt(key2, 10) === key2;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s2 = str ? `on${capitalize(str)}` : ``;
  return s2;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i2 = 0; i2 < fns.length; i2++) {
    fns[i2](arg);
  }
};
const def = (obj2, key2, value) => {
  Object.defineProperty(obj2, key2, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
const toNumber = (val) => {
  const n2 = isString(val) ? Number(val) : NaN;
  return isNaN(n2) ? val : n2;
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i2 = 0; i2 < value.length; i2++) {
      const item = value[i2];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key2 in normalized) {
          res[key2] = normalized[key2];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject$2(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      const normalized = normalizeClass(value[i2]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$2(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$2(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key2, val2], i2) => {
          entries[stringifySymbol(key2, i2) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v2) => stringifySymbol(v2))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$2(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v2, i2 = "") => {
  var _a;
  return isSymbol(v2) ? `Symbol(${(_a = v2.description) != null ? _a : i2})` : v2;
};
const isObject$1 = (val) => val !== null && typeof val === "object";
const defaultDelimiters = ["{", "}"];
class BaseFormatter {
  constructor() {
    this._caches = /* @__PURE__ */ Object.create(null);
  }
  interpolate(message, values, delimiters = defaultDelimiters) {
    if (!values) {
      return [message];
    }
    let tokens = this._caches[message];
    if (!tokens) {
      tokens = parse(message, delimiters);
      this._caches[message] = tokens;
    }
    return compile$1(tokens, values);
  }
}
const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, [startDelimiter, endDelimiter]) {
  const tokens = [];
  let position = 0;
  let text = "";
  while (position < format.length) {
    let char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({ type: "text", value: text });
      }
      text = "";
      let sub = "";
      char = format[position++];
      while (char !== void 0 && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      const isClosed = char === endDelimiter;
      const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
      tokens.push({ value: sub, type });
    } else {
      text += char;
    }
  }
  text && tokens.push({ type: "text", value: text });
  return tokens;
}
function compile$1(tokens, values) {
  const compiled = [];
  let index2 = 0;
  const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
  if (mode === "unknown") {
    return compiled;
  }
  while (index2 < tokens.length) {
    const token = tokens[index2];
    switch (token.type) {
      case "text":
        compiled.push(token.value);
        break;
      case "list":
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case "named":
        if (mode === "named") {
          compiled.push(values[token.value]);
        } else {
          {
            console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
          }
        }
        break;
      case "unknown":
        {
          console.warn(`Detect 'unknown' type of token!`);
        }
        break;
    }
    index2++;
  }
  return compiled;
}
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key2) => hasOwnProperty$1.call(val, key2);
const defaultFormatter = new BaseFormatter();
function include(str, parts2) {
  return !!parts2.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts2) {
  return parts2.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages2) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages2 && messages2[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages2 && Object.keys(messages2).length > 0) {
    locales = Object.keys(messages2);
  }
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
class I18n {
  constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater2 || defaultFormatter;
    this.messages = messages2 || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  setLocale(locale) {
    const oldLocale = this.locale;
    this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
    if (!this.messages[this.locale]) {
      this.messages[this.locale] = {};
    }
    this.message = this.messages[this.locale];
    if (oldLocale !== this.locale) {
      this.watchers.forEach((watcher) => {
        watcher(this.locale, oldLocale);
      });
    }
  }
  getLocale() {
    return this.locale;
  }
  watchLocale(fn) {
    const index2 = this.watchers.push(fn) - 1;
    return () => {
      this.watchers.splice(index2, 1);
    };
  }
  add(locale, message, override = true) {
    const curMessages = this.messages[locale];
    if (curMessages) {
      if (override) {
        Object.assign(curMessages, message);
      } else {
        Object.keys(message).forEach((key2) => {
          if (!hasOwn(curMessages, key2)) {
            curMessages[key2] = message[key2];
          }
        });
      }
    } else {
      this.messages[locale] = message;
    }
  }
  f(message, values, delimiters) {
    return this.formater.interpolate(message, values, delimiters).join("");
  }
  t(key2, locale, values) {
    let message = this.message;
    if (typeof locale === "string") {
      locale = normalizeLocale(locale, this.messages);
      locale && (message = this.messages[locale]);
    } else {
      values = locale;
    }
    if (!hasOwn(message, key2)) {
      console.warn(`Cannot translate the value of keypath ${key2}. Use the value of keypath as default.`);
      return key2;
    }
    return this.formater.interpolate(message[key2], values).join("");
  }
}
function watchAppLocale(appVm, i18n) {
  if (appVm.$watchLocale) {
    appVm.$watchLocale((newLocale) => {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(() => appVm.$locale, (newLocale) => {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof index !== "undefined" && index.getLocale) {
    return index.getLocale();
  }
  if (typeof global !== "undefined" && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
  if (typeof locale !== "string") {
    const options2 = [
      messages2,
      locale
    ];
    locale = options2[0];
    messages2 = options2[1];
  }
  if (typeof locale !== "string") {
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== "string") {
    fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  const i18n = new I18n({
    locale,
    fallbackLocale,
    messages: messages2,
    watcher
  });
  let t2 = (key2, values) => {
    if (typeof getApp !== "function") {
      t2 = function(key22, values2) {
        return i18n.t(key22, values2);
      };
    } else {
      let isWatchedAppLocale = false;
      t2 = function(key22, values2) {
        const appVm = getApp().$vm;
        if (appVm) {
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key22, values2);
      };
    }
    return t2(key2, values);
  };
  return {
    i18n,
    f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t(key2, values) {
      return t2(key2, values);
    },
    add(locale2, message, override = true) {
      return i18n.add(locale2, message, override);
    },
    watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale() {
      return i18n.getLocale();
    },
    setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i2 = 0; i2 < fns.length; i2++) {
    ret = fns[i2](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj2, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts2 = path.split(".");
  let key2 = parts2[0];
  if (!obj2) {
    obj2 = {};
  }
  if (parts2.length === 1) {
    return obj2[key2];
  }
  return getValueByDataPath(obj2[key2], parts2.slice(1).join("."));
}
function sortObject(obj2) {
  let sortObj = {};
  if (isPlainObject(obj2)) {
    Object.keys(obj2).sort().forEach((key2) => {
      const _key = key2;
      sortObj[_key] = obj2[_key];
    });
  }
  return !Object.keys(sortObj) ? obj2 : sortObj;
}
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
const encode = encodeURIComponent;
function stringifyQuery(obj2, encodeStr = encode) {
  const res = obj2 ? Object.keys(obj2).map((key2) => {
    let val = obj2[key2];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key2) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i2 = 0;
    var len = evtArr.length;
    for (i2; i2 < len; i2++) {
      evtArr[i2].fn.apply(evtArr[i2].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i2 = evts.length - 1; i2 >= 0; i2--) {
        if (evts[i2].fn === event || evts[i2].fn._ === event || evts[i2]._id === event) {
          evts.splice(i2, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i2, l2;
      for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
        this.effects[i2].stop();
      }
      for (i2 = 0, l2 = this.cleanups.length; i2 < l2; i2++) {
        this.cleanups[i2]();
      }
      if (this.scopes) {
        for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
          this.scopes[i2].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i2 = 0; i2 < this._depsLength; i2++) {
        const dep = this.deps[i2];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v2) {
    this._dirtyLevel = v2 ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i2 = effect2._depsLength; i2 < effect2.deps.length; i2++) {
      cleanupDepEffect(effect2.deps[i2], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key2) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key2);
    if (!dep) {
      depsMap.set(key2, dep = createDep(() => depsMap.delete(key2)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key: key2
      }
    );
  }
}
function trigger(target, type, key2, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key2 === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key22) => {
      if (key22 === "length" || !isSymbol(key22) && key22 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key2 !== void 0) {
      deps.push(depsMap.get(key2));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key2)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key: key2,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key2) => key2 !== "arguments" && key2 !== "caller").map((key2) => Symbol[key2]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key2) => {
    instrumentations[key2] = function(...args) {
      const arr = toRaw(this);
      for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
        track(arr, "get", i2 + "");
      }
      const res = arr[key2](...args);
      if (res === -1 || res === false) {
        return arr[key2](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key2) => {
    instrumentations[key2] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key2].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key2) {
  const obj2 = toRaw(this);
  track(obj2, "has", key2);
  return obj2.hasOwnProperty(key2);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key2, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key2 === "__v_isReactive") {
      return !isReadonly2;
    } else if (key2 === "__v_isReadonly") {
      return isReadonly2;
    } else if (key2 === "__v_isShallow") {
      return isShallow2;
    } else if (key2 === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn$1(arrayInstrumentations, key2)) {
        return Reflect.get(arrayInstrumentations, key2, receiver);
      }
      if (key2 === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key2, receiver);
    if (isSymbol(key2) ? builtInSymbols.has(key2) : isNonTrackableKeys(key2)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key2);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key2) ? res : res.value;
    }
    if (isObject$2(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key2, value, receiver) {
    let oldValue = target[key2];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key2) ? Number(key2) < target.length : hasOwn$1(target, key2);
    const result = Reflect.set(target, key2, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key2, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key2, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key2) {
    const hadKey = hasOwn$1(target, key2);
    const oldValue = target[key2];
    const result = Reflect.deleteProperty(target, key2);
    if (result && hadKey) {
      trigger(target, "delete", key2, void 0, oldValue);
    }
    return result;
  }
  has(target, key2) {
    const result = Reflect.has(target, key2);
    if (!isSymbol(key2) || !builtInSymbols.has(key2)) {
      track(target, "has", key2);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key2) {
    {
      warn$2(
        `Set operation on key "${String(key2)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key2) {
    {
      warn$2(
        `Delete operation on key "${String(key2)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function get(target, key2, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key2);
  if (!isReadonly2) {
    if (hasChanged(key2, rawKey)) {
      track(rawTarget, "get", key2);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key2)) {
    return wrap(target.get(key2));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key2);
  }
}
function has$1(key2, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key2);
  if (!isReadonly2) {
    if (hasChanged(key2, rawKey)) {
      track(rawTarget, "has", key2);
    }
    track(rawTarget, "has", rawKey);
  }
  return key2 === rawKey ? target.has(key2) : target.has(key2) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key2, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get22 } = getProto(target);
  let hadKey = has2.call(target, key2);
  if (!hadKey) {
    key2 = toRaw(key2);
    hadKey = has2.call(target, key2);
  } else {
    checkIdentityKeys(target, has2, key2);
  }
  const oldValue = get22.call(target, key2);
  target.set(key2, value);
  if (!hadKey) {
    trigger(target, "add", key2, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key2, value, oldValue);
  }
  return this;
}
function deleteEntry(key2) {
  const target = toRaw(this);
  const { has: has2, get: get22 } = getProto(target);
  let hadKey = has2.call(target, key2);
  if (!hadKey) {
    key2 = toRaw(key2);
    hadKey = has2.call(target, key2);
  } else {
    checkIdentityKeys(target, has2, key2);
  }
  const oldValue = get22 ? get22.call(target, key2) : void 0;
  const result = target.delete(key2);
  if (hadKey) {
    trigger(target, "delete", key2, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key2) => {
      return callback.call(thisArg, wrap(value), wrap(key2), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key2 = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key2}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key2) {
      return get(this, key2);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key2) {
      return get(this, key2, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key2) {
      return get(this, key2, true);
    },
    get size() {
      return size(this, true);
    },
    has(key2) {
      return has$1.call(this, key2, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key2) {
      return get(this, key2, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key2) {
      return has$1.call(this, key2, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key2, receiver) => {
    if (key2 === "__v_isReactive") {
      return !isReadonly2;
    } else if (key2 === "__v_isReadonly") {
      return isReadonly2;
    } else if (key2 === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn$1(instrumentations, key2) && key2 in target ? instrumentations : target,
      key2,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key2) {
  const rawKey = toRaw(key2);
  if (rawKey !== key2 && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$2(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v2) {
    this.effect.dirty = v2;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key2, receiver) => unref(Reflect.get(target, key2, receiver)),
  set: (target, key2, value, receiver) => {
    const oldValue = target[key2];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key2, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a2) => {
          var _a, _b;
          return (_b = (_a = a2.toString) == null ? void 0 : _a.call(a2)) != null ? _b : JSON.stringify(a2);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i2) => {
    logs.push(...i2 === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key2) => {
    res.push(...formatProp(key2, props[key2]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key2, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key2}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key2}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key2, toRaw(value.value), true);
    return raw ? value : [`${key2}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key2}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key2}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise$1(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i2 = 0; i2 < fn.length; i2++) {
    values.push(callWithAsyncErrorHandling(fn[i2], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
          if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i2 = queue$1.indexOf(job);
  if (i2 > flushIndex) {
    queue$1.splice(i2, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i2 = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i2 < queue$1.length; i2++) {
    const cb = queue$1[i2];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i2, 1);
      i2--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a2, b2) => getId(a2) - getId(b2)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a2, b2) => {
  const diff2 = getId(a2) - getId(b2);
  if (diff2 === 0) {
    if (a2.pre && !b2.pre)
      return -1;
    if (b2.pre && !a2.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params2) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params2
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key2) => normalized[key2] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$2(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options2, key2) {
  if (!options2 || !isOn(key2)) {
    return false;
  }
  key2 = key2.slice(2).replace(/Once$/, "");
  return hasOwn$1(options2, key2[0].toLowerCase() + key2.slice(1)) || hasOwn$1(options2, hyphenate(key2)) || hasOwn$1(options2, key2);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component2[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options2) {
  if (!isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options2);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options2) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options2 = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options2);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i2 = 0; i2 < segments.length && cur; i2++) {
      cur = cur[segments[i2]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject$2(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      traverse(value[i2], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key2 in value) {
      traverse(value[key2], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$2(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v2) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options2) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options2);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options2);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key2, value) {
        if (key2 in context.provides) {
          warn$1(
            `App already provides property with key "${String(key2)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key2] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key2, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key2] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key2, value);
    }
  }
}
function inject(key2, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key2 in provides) {
      return provides[key2];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key2)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook$1 = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook$1("bm");
const onMounted = createHook$1("m");
const onBeforeUpdate = createHook$1("bu");
const onUpdated = createHook$1("u");
const onBeforeUnmount = createHook$1("bum");
const onUnmounted = createHook$1("um");
const onServerPrefetch = createHook$1("sp");
const onRenderTriggered = createHook$1(
  "rtg"
);
const onRenderTracked = createHook$1(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i2) => {
  if (!i2)
    return null;
  if (isStatefulComponent(i2))
    return getExposeProxy(i2) || i2.proxy;
  return getPublicInstance(i2.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i2) => i2,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i2) => i2.__$el || (i2.__$el = {}),
    $data: (i2) => i2.data,
    $props: (i2) => shallowReadonly(i2.props),
    $attrs: (i2) => shallowReadonly(i2.attrs),
    $slots: (i2) => shallowReadonly(i2.slots),
    $refs: (i2) => shallowReadonly(i2.refs),
    $parent: (i2) => getPublicInstance(i2.parent),
    $root: (i2) => getPublicInstance(i2.root),
    $emit: (i2) => i2.emit,
    $options: (i2) => resolveMergedOptions(i2),
    $forceUpdate: (i2) => i2.f || (i2.f = () => {
      i2.effect.dirty = true;
      queueJob(i2.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i2) => instanceWatch.bind(i2)
  })
);
const isReservedPrefix = (key2) => key2 === "_" || key2 === "$";
const hasSetupBinding = (state, key2) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn$1(state, key2);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key2) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key2 === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key2[0] !== "$") {
      const n2 = accessCache[key2];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key2];
          case 2:
            return data[key2];
          case 4:
            return ctx[key2];
          case 3:
            return props[key2];
        }
      } else if (hasSetupBinding(setupState, key2)) {
        accessCache[key2] = 1;
        return setupState[key2];
      } else if (data !== EMPTY_OBJ && hasOwn$1(data, key2)) {
        accessCache[key2] = 2;
        return data[key2];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn$1(normalizedProps, key2)
      ) {
        accessCache[key2] = 3;
        return props[key2];
      } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key2)) {
        accessCache[key2] = 4;
        return ctx[key2];
      } else if (shouldCacheAccess) {
        accessCache[key2] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key2];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key2 === "$attrs") {
        track(instance, "get", key2);
      } else if (key2 === "$slots") {
        track(instance, "get", key2);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key2])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key2)) {
      accessCache[key2] = 4;
      return ctx[key2];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn$1(globalProperties, key2)
    ) {
      {
        return globalProperties[key2];
      }
    } else if (currentRenderingInstance && (!isString(key2) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key2.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key2[0]) && hasOwn$1(data, key2)) {
        warn$1(
          `Property ${JSON.stringify(
            key2
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key2)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key2, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key2)) {
      setupState[key2] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn$1(setupState, key2)) {
      warn$1(`Cannot mutate <script setup> binding "${key2}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn$1(data, key2)) {
      data[key2] = value;
      return true;
    } else if (hasOwn$1(instance.props, key2)) {
      warn$1(`Attempting to mutate prop "${key2}". Props are readonly.`);
      return false;
    }
    if (key2[0] === "$" && key2.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key2}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key2 in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key2, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key2] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key2) {
    let normalizedProps;
    return !!accessCache[key2] || data !== EMPTY_OBJ && hasOwn$1(data, key2) || hasSetupBinding(setupState, key2) || (normalizedProps = propsOptions[0]) && hasOwn$1(normalizedProps, key2) || hasOwn$1(ctx, key2) || hasOwn$1(publicPropertiesMap, key2) || hasOwn$1(appContext.config.globalProperties, key2);
  },
  defineProperty(target, key2, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key2] = 0;
    } else if (hasOwn$1(descriptor, "value")) {
      this.set(target, key2, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key2, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key2) => {
    Object.defineProperty(target, key2, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key2](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key2) => {
      Object.defineProperty(ctx, key2, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key2],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key2) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key2[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key2
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key2, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key2],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key2) => {
    if (cache[key2]) {
      warn$1(`${type} property "${key2}" is already defined in ${cache[key2]}.`);
    } else {
      cache[key2] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options2 = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options2.beforeCreate) {
    callHook$1(options2.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options2;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key2 in propsOptions) {
        checkDuplicateProperties("Props", key2);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key2 in methods) {
      const methodHandler = methods[key2];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key2, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key2);
        }
      } else {
        warn$1(
          `Method "${key2}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise$1(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject$2(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key2 in data) {
          checkDuplicateProperties("Data", key2);
          if (!isReservedPrefix(key2[0])) {
            Object.defineProperty(ctx, key2, {
              configurable: true,
              enumerable: true,
              get: () => data[key2],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key2 in computedOptions) {
      const opt = computedOptions[key2];
      const get22 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get22 === NOOP) {
        warn$1(`Computed property "${key2}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key2}" is readonly.`
        );
      };
      const c2 = computed({
        get: get22,
        set: set2
      });
      Object.defineProperty(ctx, key2, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v2) => c2.value = v2
      });
      {
        checkDuplicateProperties("Computed", key2);
      }
    }
  }
  if (watchOptions) {
    for (const key2 in watchOptions) {
      createWatcher(watchOptions[key2], ctx, publicThis, key2);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key2) => {
        provide(key2, provides[key2]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register2(_hook.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key2) => {
        Object.defineProperty(exposed, key2, {
          get: () => publicThis[key2],
          set: (val) => publicThis[key2] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options2, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key2 in injectOptions) {
    const opt = injectOptions[key2];
    let injected;
    if (isObject$2(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key2,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key2);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key2, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v2) => injected.value = v2
      });
    } else {
      ctx[key2] = injected;
    }
    {
      checkDuplicateProperties("Inject", key2);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key2) {
  const getter = key2.includes(".") ? createPathGetter(publicThis, key2) : () => publicThis[key2];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$2(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key2));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key2}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$2(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key2 in from) {
    if (asMixin && key2 === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key2] || strats && strats[key2];
      to[key2] = strat ? strat(to[key2], from[key2]) : from[key2];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i2 = 0; i2 < raw.length; i2++) {
      res[raw[i2]] = raw[i2];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key2 in from) {
    merged[key2] = mergeAsArray$1(to[key2], from[key2]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key2 in instance.propsOptions[0]) {
    if (!(key2 in props)) {
      props[key2] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options2] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
        let key2 = propsToUpdate[i2];
        if (isEmitListener(instance.emitsOptions, key2)) {
          continue;
        }
        const value = rawProps[key2];
        if (options2) {
          if (hasOwn$1(attrs, key2)) {
            if (value !== attrs[key2]) {
              attrs[key2] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key2);
            props[camelizedKey] = resolvePropValue$1(
              options2,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key2]) {
            attrs[key2] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key2 in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn$1(rawProps, key2) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key2)) === key2 || !hasOwn$1(rawProps, kebabKey))) {
        if (options2) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key2] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key2] = resolvePropValue$1(
              options2,
              rawCurrentProps,
              key2,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key2];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key2 in attrs) {
        if (!rawProps || !hasOwn$1(rawProps, key2) && true) {
          delete attrs[key2];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options2, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key2 in rawProps) {
      if (isReservedProp(key2)) {
        continue;
      }
      const value = rawProps[key2];
      let camelKey;
      if (options2 && hasOwn$1(options2, camelKey = camelize(key2))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key2)) {
        if (!(key2 in attrs) || value !== attrs[key2]) {
          attrs[key2] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i2 = 0; i2 < needCastKeys.length; i2++) {
      const key2 = needCastKeys[i2];
      props[key2] = resolvePropValue$1(
        options2,
        rawCurrentProps,
        key2,
        castValues[key2],
        instance,
        !hasOwn$1(castValues, key2)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue$1(options2, props, key2, value, instance, isAbsent) {
  const opt = options2[key2];
  if (opt != null) {
    const hasDefault = hasOwn$1(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key2 in propsDefaults) {
          value = propsDefaults[key2];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key2] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key2))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i2 = 0; i2 < raw.length; i2++) {
      if (!isString(raw[i2])) {
        warn$1(`props must be strings when using array syntax.`, raw[i2]);
      }
      const normalizedKey = camelize(raw[i2]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$2(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key2 in raw) {
      const normalizedKey = camelize(key2);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key2];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn$1(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$2(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key2) {
  if (key2[0] !== "$" && !isReservedProp(key2)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key2}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a2, b2) {
  return getType$1(a2) === getType$1(b2);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options2 = instance.propsOptions[0];
  for (const key2 in options2) {
    let opt = options2[key2];
    if (opt == null)
      continue;
    validateProp$1(
      key2,
      resolvedValues[key2],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn$1(rawProps, key2) && !hasOwn$1(rawProps, hyphenate(key2))
    );
  }
}
function validateProp$1(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i2 = 0; i2 < types.length && !isValid; i2++) {
      const { valid, expectedType } = assertType$1(value, types[i2]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i2) => {
    currentInstance = i2;
  };
  setInSSRSetupState = (v2) => {
    isInSSRComponentSetup = v2;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i2 = 0; i2 < names.length; i2++) {
        validateComponentName(names[i2], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i2 = 0; i2 < names.length; i2++) {
        validateDirectiveName(names[i2]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise$1(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$2(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key2) {
        track(instance, "get", "$attrs");
        return target[key2];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key2) {
      track(instance, "get", "$slots");
      return target[key2];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key2) {
        if (key2 in target) {
          return target[key2];
        }
        return instance.proxy[key2];
      },
      has(target, key2) {
        return key2 in target || key2 in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key2 in registry) {
        if (registry[key2] === Component2) {
          return key2;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i2 = getCurrentInstance();
    if (i2 && i2.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key2 in pre) {
      const currentValue = current[key2];
      if (currentValue === void 0) {
        current[key2] = null;
      } else {
        syncKeys(currentValue, pre[key2]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key2 in current) {
        const currentValue = unwrapper(current[key2]);
        const preValue = pre[key2];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key2,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key2,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key2,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key2 + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key2,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key2 + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v2) {
  result[k] = v2;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i2 = 0; i2 < copies.length; i2++) {
      copies[i2]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i2 = 0; i2 < len; i2++) {
        copy[i2] = clone(src[i2], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn$1(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key2) => {
    ret[key2] = data[key2];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options2, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options2,
    instance,
    publicThis
  );
  const computedOptions = options2.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    $templateRefs && $templateRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray(templateRef.v)) {
          templateRef.v.forEach((v2) => {
            setTemplateRef(templateRef, v2, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick(instance, doSet);
  }
}
function toSkip(value) {
  if (isObject$2(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn$1(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options2) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options2.parentComponent, null);
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options2.mpType === "app") {
    instance.render = NOOP;
  }
  if (options2.onBeforeSetup) {
    options2.onBeforeSetup(instance, options2);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options2.parentComponent && instance.proxy) {
      options2.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key2 in attrs) {
    if (key2 === "class" || key2 === "style" || isOn(key2)) {
      (res || (res = {}))[key2] = attrs[key2];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = [];
  instance.$templateUniElementRefs = [];
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key2) => key2 !== "class" && key2 !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key2) => {
        if (!isModelListener(key2) || !(key2.slice(9) in propsOptions)) {
          props[key2] = fallthroughAttrs2[key2];
        }
      });
    } else {
      keys.forEach((key2) => props[key2] = fallthroughAttrs2[key2]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update: update3 }, allowed) {
  effect2.allowRecurse = update3.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u: u2 } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u2) {
        queuePostRenderEffect(u2);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update3),
    instance.scope
    // track it in component's effect scope
  );
  const update3 = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update3.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update3.ownerInstance = instance;
  }
  {
    update3();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update: update3, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update3) {
    update3.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options2) {
    return mountComponent(createVNode2(initialVNode), options2);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options2, instance, publicThis) {
  const mpType = options2.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component") {
    return;
  }
  Object.keys(options2).forEach((name) => {
    if (isUniLifecycleHook(name, options2[name], false)) {
      const hooks = options2[name];
      if (isArray(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options2, instance, publicThis) {
  initHooks$1(options2, instance, publicThis);
}
function set(target, key2, val) {
  return target[key2] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i2 = 0;
    for (; i2 < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i2++)) << 18 | b64.indexOf(str.charAt(i2++)) << 12 | (r1 = b64.indexOf(str.charAt(i2++))) << 6 | (r2 = b64.indexOf(str.charAt(i2++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function stringifyStyle(value) {
  if (isString(value)) {
    return value;
  }
  return stringify(normalizeStyle(value));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key2 in styles) {
    ret += `${key2.startsWith(`--`) ? key2 : hyphenate(key2)}:${styles[key2]};`;
  }
  return ret;
}
function vOn(value, key2) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key2 !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString(key2) || typeof key2 === "number") ? "_" + key2 : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray(res) || isPromise$1(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn$1(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn$1(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn$1(event.detail, "checked") && !hasOwn$1(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i2 = 0, l2 = source.length; i2 < l2; i2++) {
      ret[i2] = renderItem(source[i2], i2, i2);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i2 = 0; i2 < source; i2++) {
      ret[i2] = renderItem(i2 + 1, i2, i2);
    }
  } else if (isObject$2(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i2) => renderItem(item, i2, i2));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        const key2 = keys[i2];
        ret[i2] = renderItem(source[key2], key2, i2);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
function withModelModifiers(fn, { number, trim }, isComponent = false) {
  if (isComponent) {
    return (...args) => {
      if (trim) {
        args = args.map((a2) => a2.trim());
      } else if (number) {
        args = args.map(toNumber);
      }
      return fn(...args);
    };
  }
  return (event) => {
    const value = event.detail.value;
    if (trim) {
      event.detail.value = value.trim();
    } else if (number) {
      event.detail.value = toNumber(value);
    }
    return fn(event);
  };
}
function hasIdProp(_ctx) {
  return _ctx.$.propsOptions && _ctx.$.propsOptions[0] && "id" in _ctx.$.propsOptions[0];
}
function getVirtualHostId(_ctx) {
  return _ctx.$scope.virtualHostId;
}
function hasVirtualHostId(_ctx) {
  return !!getVirtualHostId(_ctx);
}
function genIdWithVirtualHost(_ctx, idBinding) {
  if (!hasVirtualHostId(_ctx) || hasIdProp(_ctx)) {
    return idBinding;
  }
  return getVirtualHostId(_ctx);
}
function genUniElementId(_ctx, idBinding, genId) {
  return genIdWithVirtualHost(_ctx, idBinding) || genId || "";
}
const o$1 = (value, key2) => vOn(value, key2);
const f$1 = (source, renderItem) => vFor(source, renderItem);
const s$1 = (value) => stringifyStyle(value);
const e$1 = (target, ...sources) => extend(target, ...sources);
const n$1 = (value) => normalizeClass(value);
const t$1 = (val) => toDisplayString(val);
const p$1 = (props) => renderProps(props);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
const m$1 = (fn, modifiers, isComponent = false) => withModelModifiers(fn, modifiers, isComponent);
const gei = genUniElementId;
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function getLocaleLanguage$1() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key2 in protocol) {
    const errMsg = validateProp(key2, data[key2], protocol[key2], !hasOwn$1(data, key2));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i2 = 0; i2 < len; i2++) {
    const opts = protocol[i2];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i2) {
      data[opts.name] = args[i2];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i2 = 0; i2 < types.length && !isValid; i2++) {
      const { valid, expectedType } = assertType(value, types[i2]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params2) {
  return function(data) {
    return hook(data, params2) || data;
  };
}
function queue(hooks, data, params2) {
  let promise = false;
  for (let i2 = 0; i2 < hooks.length; i2++) {
    const hook = hooks[i2];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params2));
    } else {
      const res = hook(data, params2);
      if (isPromise$1(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options2 = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray(hooks)) {
      return;
    }
    const oldCallback = options2[name];
    options2[name] = function callbackInterceptor(res) {
      queue(hooks, res, options2).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options2;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options2, params2) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options2);
      return res.then((options22) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options22), ...params2);
      });
    } else {
      return api(wrapperOptions(interceptor, options2), ...params2);
    }
  }
  return api(options2, ...params2);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, args, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn, extend(args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options2) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options2) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options2) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options2);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options2) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options2) {
  return wrapperTaskApi(name, fn, protocol, options2);
}
function defineSyncApi(name, fn, protocol, options2) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options2) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options2));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  var _a, _b;
  let windowWidth, pixelRatio, platform;
  {
    const windowInfo = ((_a = wx.getWindowInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const deviceInfo = ((_b = wx.getDeviceInfo) === null || _b === void 0 ? void 0 : _b.call(wx)) || wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i2 = 0; i2 < hooks.length; i2++) {
    if (res.indexOf(hooks[i2]) === -1) {
      res.push(hooks[i2]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString(method) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString(method)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray(name))
    name = name ? [name] : [];
  name.forEach((n2) => {
    eventBus.off(n2, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i2 = 0; i2 < onPushMessageCallbacks.length; i2++) {
      const callback = onPushMessageCallbacks[i2];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_2, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options2 = {}, ...rest) {
    if (isFunction(options2.success) || isFunction(options2.fail) || isFunction(options2.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, options2, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options2, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key2 in fromArgs) {
        if (hasOwn$1(argsOption, key2)) {
          let keyOption = argsOption[key2];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key2], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key2}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key2];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key2] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key2) !== -1) {
          const callback = fromArgs[key2];
          if (isFunction(callback)) {
            toArgs[key2] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn$1(toArgs, key2)) {
            toArgs[key2] = fromArgs[key2];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      if (isFunction(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn$1(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method;
    }
    const needWrapper = hasProtocol || isFunction(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options2 = protocol || {};
      if (isFunction(protocol)) {
        options2 = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options2.args, options2.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options2.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options2.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale) => {
  const app = isFunction(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_2, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  let osName = "";
  let osVersion = "";
  if (platform && false) {
    osName = platform;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || platform;
    osVersion = system.split(" ")[1] || "";
  }
  osName = osName.toLocaleLowerCase();
  switch (osName) {
    case "harmony":
    case "ohos":
    case "openharmony":
      osName = "harmonyos";
      break;
    case "iphone os":
      osName = "ios";
      break;
    case "mac":
    case "darwin":
      osName = "macos";
      break;
    case "windows_nt":
      osName = "windows";
      break;
  }
  return {
    osName,
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "",
    appName: "jinleyou_uniapp",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.64",
    uniCompilerVersion: "4.64",
    uniRuntimeVersion: "4.64",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLocaleLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform);
    toRes = sortObject(extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "",
      appName: "jinleyou_uniapp",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "4.64",
      uniCompilerVersion: "4.64",
      uniRuntimeVersion: "4.64"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key2) {
      if (hasOwn$1(target, key2)) {
        return target[key2];
      }
      if (hasOwn$1(api, key2)) {
        return promisify(key2, api[key2]);
      }
      if (hasOwn$1(baseApis, key2)) {
        return promisify(key2, baseApis[key2]);
      }
      return promisify(key2, wrapper(key2, platform[key2]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key2) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key2)) {
    return false;
  }
  return objectKeys.indexOf(key2) > -1 || typeof wx[key2] === "function";
}
function initWx() {
  const newWx = {};
  for (const key2 in wx) {
    if (isWxKey(key2)) {
      newWx[key2] = wx[key2];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.canIUse("getAppBaseInfo")) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getWindowInfo")) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getDeviceInfo")) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
function initRuntimeSocket(hosts, port, id) {
  if (hosts == "" || port == "" || id == "")
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise, host2) => {
    return promise.then((socket) => {
      if (socket != null)
        return Promise.resolve(socket);
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve2, reject) => {
    const socket = index.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      multiple: true,
      // 支付宝小程序 是否开启多实例
      fail() {
        resolve2(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve2(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve2(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
  });
}
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
const errorExtra = {};
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error) => {
      errorQueue.add(error);
    });
    return;
  }
  const data = errors.map((err) => {
    if (typeof err === "string") {
      return err;
    }
    const isPromiseRejection = err && "promise" in err && "reason" in err;
    const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
    if (isPromiseRejection) {
      err = err.reason;
    }
    if (err instanceof Error && err.stack) {
      if (err.message && !err.stack.includes(err.message)) {
        return `${prefix}${err.message}
${err.stack}`;
      }
      return `${prefix}${err.stack}`;
    }
    if (typeof err === "object" && err !== null) {
      try {
        return prefix + JSON.stringify(err);
      } catch (err2) {
        return prefix + String(err2);
      }
    }
    return prefix + String(err);
  }).filter(Boolean);
  if (data.length > 0) {
    sendError(JSON.stringify(Object.assign({
      type: "error",
      data
    }, errorExtra)));
  }
}
function setSendError(value, extra = {}) {
  sendError = value;
  Object.assign(errorExtra, extra);
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error instanceof PromiseRejectionEvent && error.reason instanceof Error && error.reason.message && error.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error);
      }
      sendErrorMessages([error]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index.onError === "function") {
    index.onError(onError2);
  }
  if (typeof index.onUnhandledRejection === "function") {
    index.onUnhandledRejection(onError2);
  }
  return function offError2() {
    if (typeof index.offError === "function") {
      index.offError(onError2);
    }
    if (typeof index.offUnhandledRejection === "function") {
      index.offUnhandledRejection(onError2);
    }
  };
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  const type = typeof arg;
  switch (type) {
    case "string":
      return formatString(arg);
    case "number":
      return formatNumber(arg);
    case "boolean":
      return formatBoolean(arg);
    case "object":
      try {
        return formatObject(arg, depth);
      } catch (e2) {
        return {
          type: "object",
          value: {
            properties: []
          }
        };
      }
    case "undefined":
      return formatUndefined();
    case "function":
      return formatFunction(arg);
    case "symbol": {
      return formatSymbol(arg);
    }
    case "bigint":
      return formatBigInt(arg);
  }
}
function formatFunction(value) {
  return {
    type: "function",
    value: `function ${value.name}() {}`
  };
}
function formatUndefined() {
  return {
    type: "undefined"
  };
}
function formatBoolean(value) {
  return {
    type: "boolean",
    value: String(value)
  };
}
function formatNumber(value) {
  return {
    type: "number",
    value: String(value)
  };
}
function formatBigInt(value) {
  return {
    type: "bigint",
    value: String(value)
  };
}
function formatString(value) {
  return {
    type: "string",
    value
  };
}
function formatSymbol(value) {
  return {
    type: "symbol",
    value: value.description
  };
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  {
    if (isComponentPublicInstance(value)) {
      return formatComponentPublicInstance(value, depth);
    }
    if (isComponentInternalInstance(value)) {
      return formatComponentInternalInstance(value, depth);
    }
    if (isUniElement(value)) {
      return formatUniElement(value, depth);
    }
    if (isCSSStyleDeclaration(value)) {
      return formatCSSStyleDeclaration(value, depth);
    }
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v2, i2) => formatArrayElement(v2, i2, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v2) => formatSetEntry(v2, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v2) => formatMapEntry(v2, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  let className = void 0;
  {
    const constructor = value.constructor;
    if (constructor) {
      if (constructor.get$UTSMetadata$) {
        className = constructor.get$UTSMetadata$().name;
      }
    }
  }
  let entries = Object.entries(value);
  if (isHarmonyBuilderParams(value)) {
    entries = entries.filter(([key2]) => key2 !== "modifier" && key2 !== "nodeContent");
  }
  return {
    type: "object",
    className,
    value: {
      properties: entries.map((entry) => formatObjectProperty(entry[0], entry[1], depth + 1))
    }
  };
}
function isHarmonyBuilderParams(value) {
  return value.modifier && value.modifier._attribute && value.nodeContent;
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  const result = formatArg(value, depth);
  result.name = name;
  return result;
}
function formatArrayElement(value, index2, depth) {
  const result = formatArg(value, depth);
  result.name = `${index2}`;
  return result;
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
let sendConsole = null;
const messageQueue = [];
const messageExtra = {};
const EXCEPTION_BEGIN_MARK = "---BEGIN:EXCEPTION---";
const EXCEPTION_END_MARK = "---END:EXCEPTION---";
function sendConsoleMessages(messages2) {
  if (sendConsole == null) {
    messageQueue.push(...messages2);
    return;
  }
  sendConsole(JSON.stringify(Object.assign({
    type: "console",
    data: messages2
  }, messageExtra)));
}
function setSendConsole(value, extra = {}) {
  sendConsole = value;
  Object.assign(messageExtra, extra);
  if (value != null && messageQueue.length > 0) {
    const messages2 = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages2);
  }
}
const atFileRegex = /^\s*at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      const originalArgs = [...args];
      if (originalArgs.length) {
        const maybeAtFile = originalArgs[originalArgs.length - 1];
        if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
          originalArgs.pop();
        }
      }
      {
        originalConsole[type](...originalArgs);
      }
      if (type === "error" && args.length === 1) {
        const arg = args[0];
        if (typeof arg === "string" && arg.startsWith(EXCEPTION_BEGIN_MARK)) {
          const startIndex = EXCEPTION_BEGIN_MARK.length;
          const endIndex = arg.length - EXCEPTION_END_MARK.length;
          sendErrorMessages([arg.slice(startIndex, endIndex)]);
          return;
        } else if (arg instanceof Error) {
          sendErrorMessages([arg]);
          return;
        }
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    {
      if (typeof index !== "undefined" && index.__f__) {
        const oldLog = index.__f__;
        if (oldLog) {
          index.__f__ = function(...args) {
            const [type, filename, ...rest] = args;
            oldLog(type, "", ...rest);
            sendConsoleMessages([formatMessage(type, [...rest, filename])]);
          };
          return function restoreConsole() {
            index.__f__ = oldLog;
          };
        }
      }
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
function initRuntimeSocketService() {
  const hosts = "10.111.209.252,127.0.0.1";
  const port = "8090";
  const id = "mp-weixin_uj6Owy";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        {
          originalConsole.error(wrapError("小程序平台，请勾选不校验合法域名配置。"));
        }
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      {
        initMiniProgramGlobalFlag();
      }
      socket.onClose(() => {
        {
          originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        }
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error) {
  return `${ERROR_CHAR}${error}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key2, val] of props) {
    target[key2] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn$1(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i2 = $children.length - 1; i2 >= 0; i2--) {
    const childVm = $children[i2];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i2 = $children.length - 1; i2 >= 0; i2--) {
    parentVm = findVmByVueId($children[i2], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options2) {
  const ctx = instance.ctx;
  ctx.mpType = options2.mpType;
  ctx.$mpType = options2.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options2.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray(options2.slots) && options2.slots.length) {
    options2.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options2.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options2) {
  initBaseInstance(instance, options2);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock2) => {
    if (hasOwn$1(mpInstance, mock2)) {
      instance[mock2] = ctx[mock2] = mpInstance[mock2];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn$1(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn$1(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options2) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options2);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn$1(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn$1(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v2) {
      locale.value = v2;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options2, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options2.behaviors) {
    if (options2.behaviors.includes("wx://form-field")) {
      if (!options2.properties || !options2.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options2.properties || !options2.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options2) {
  const properties = {};
  {
    if (options2 && options2.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray(rawProps)) {
    rawProps.forEach((key2) => {
      properties[key2] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key2) => {
      const opts = rawProps[key2];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key2] = {
          type: opts.type,
          value
        };
      } else {
        properties[key2] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_2) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i2 = 0; i2 < nextKeys.length; i2++) {
    const key2 = nextKeys[i2];
    if (nextProps[key2] !== prevProps[key2]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse: parse2, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options2 = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject$2(item.options)) {
        extend(options2, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options2, vueOptions.options);
  }
  const mpComponentOptions = {
    options: options2,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse2) {
    parse2(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options2) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options2);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse: parse2, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse2 && parse2(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options2, isComponent) {
  const oldHook = options2[name];
  if (!oldHook) {
    options2[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options2[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options2) {
  initMiniProgramHook(ON_LOAD, options2);
  return MPPage(options2);
};
Component = function(options2) {
  initMiniProgramHook("created", options2);
  const isVueComponent = options2.properties && options2.properties.uP;
  if (!isVueComponent) {
    initProps(options2);
    initPropsObserver(options2);
  }
  return MPComponent(options2);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options2) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options2);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var mock = { exports: {} };
(function(module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    return (
      /******/
      function(modules) {
        var installedModules = {};
        function __webpack_require__2(moduleId) {
          if (installedModules[moduleId])
            return installedModules[moduleId].exports;
          var module2 = installedModules[moduleId] = {
            /******/
            exports: {},
            /******/
            id: moduleId,
            /******/
            loaded: false
            /******/
          };
          modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__2);
          module2.loaded = true;
          return module2.exports;
        }
        __webpack_require__2.m = modules;
        __webpack_require__2.c = installedModules;
        __webpack_require__2.p = "";
        return __webpack_require__2(0);
      }([
        /* 0 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Handler2 = __webpack_require__2(1);
          var Util2 = __webpack_require__2(3);
          var Random2 = __webpack_require__2(5);
          var RE2 = __webpack_require__2(20);
          var toJSONSchema = __webpack_require__2(23);
          var valid = __webpack_require__2(25);
          var XHR;
          if (typeof window !== "undefined")
            XHR = __webpack_require__2(27);
          /*!
              Mock - 模拟请求 & 模拟数据
              https://github.com/nuysoft/Mock
              墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
          */
          var Mock2 = {
            Handler: Handler2,
            Random: Random2,
            Util: Util2,
            XHR,
            RE: RE2,
            toJSONSchema,
            valid,
            heredoc: Util2.heredoc,
            setup: function(settings) {
              return XHR.setup(settings);
            },
            _mocked: {}
          };
          Mock2.version = "1.0.1-beta3";
          if (XHR)
            XHR.Mock = Mock2;
          Mock2.mock = function(rurl, rtype, template) {
            if (arguments.length === 1) {
              return Handler2.gen(rurl);
            }
            if (arguments.length === 2) {
              template = rtype;
              rtype = void 0;
            }
            if (XHR)
              window.XMLHttpRequest = XHR;
            Mock2._mocked[rurl + (rtype || "")] = {
              rurl,
              rtype,
              template
            };
            return Mock2;
          };
          module2.exports = Mock2;
        },
        /* 1 */
        /***/
        function(module, exports, __webpack_require__) {
          var Constant = __webpack_require__(2);
          var Util = __webpack_require__(3);
          var Parser = __webpack_require__(4);
          var Random = __webpack_require__(5);
          var RE = __webpack_require__(20);
          var Handler = {
            extend: Util.extend
          };
          Handler.gen = function(template, name, context) {
            name = name == void 0 ? "" : name + "";
            context = context || {};
            context = {
              // 当前访问路径，只有属性名，不包括生成规则
              path: context.path || [Constant.GUID],
              templatePath: context.templatePath || [Constant.GUID++],
              // 最终属性值的上下文
              currentContext: context.currentContext,
              // 属性值模板的上下文
              templateCurrentContext: context.templateCurrentContext || template,
              // 最终值的根
              root: context.root || context.currentContext,
              // 模板的根
              templateRoot: context.templateRoot || context.templateCurrentContext || template
            };
            var rule = Parser.parse(name);
            var type = Util.type(template);
            var data;
            if (Handler[type]) {
              data = Handler[type]({
                // 属性值类型
                type,
                // 属性值模板
                template,
                // 属性名 + 生成规则
                name,
                // 属性名
                parsedName: name ? name.replace(Constant.RE_KEY, "$1") : name,
                // 解析后的生成规则
                rule,
                // 相关上下文
                context
              });
              if (!context.root)
                context.root = data;
              return data;
            }
            return template;
          };
          Handler.extend({
            array: function(options2) {
              var result = [], i2, ii;
              if (options2.template.length === 0)
                return result;
              if (!options2.rule.parameters) {
                for (i2 = 0; i2 < options2.template.length; i2++) {
                  options2.context.path.push(i2);
                  options2.context.templatePath.push(i2);
                  result.push(
                    Handler.gen(options2.template[i2], i2, {
                      path: options2.context.path,
                      templatePath: options2.context.templatePath,
                      currentContext: result,
                      templateCurrentContext: options2.template,
                      root: options2.context.root || result,
                      templateRoot: options2.context.templateRoot || options2.template
                    })
                  );
                  options2.context.path.pop();
                  options2.context.templatePath.pop();
                }
              } else {
                if (options2.rule.min === 1 && options2.rule.max === void 0) {
                  options2.context.path.push(options2.name);
                  options2.context.templatePath.push(options2.name);
                  result = Random.pick(
                    Handler.gen(options2.template, void 0, {
                      path: options2.context.path,
                      templatePath: options2.context.templatePath,
                      currentContext: result,
                      templateCurrentContext: options2.template,
                      root: options2.context.root || result,
                      templateRoot: options2.context.templateRoot || options2.template
                    })
                  );
                  options2.context.path.pop();
                  options2.context.templatePath.pop();
                } else {
                  if (options2.rule.parameters[2]) {
                    options2.template.__order_index = options2.template.__order_index || 0;
                    options2.context.path.push(options2.name);
                    options2.context.templatePath.push(options2.name);
                    result = Handler.gen(options2.template, void 0, {
                      path: options2.context.path,
                      templatePath: options2.context.templatePath,
                      currentContext: result,
                      templateCurrentContext: options2.template,
                      root: options2.context.root || result,
                      templateRoot: options2.context.templateRoot || options2.template
                    })[options2.template.__order_index % options2.template.length];
                    options2.template.__order_index += +options2.rule.parameters[2];
                    options2.context.path.pop();
                    options2.context.templatePath.pop();
                  } else {
                    for (i2 = 0; i2 < options2.rule.count; i2++) {
                      for (ii = 0; ii < options2.template.length; ii++) {
                        options2.context.path.push(result.length);
                        options2.context.templatePath.push(ii);
                        result.push(
                          Handler.gen(options2.template[ii], result.length, {
                            path: options2.context.path,
                            templatePath: options2.context.templatePath,
                            currentContext: result,
                            templateCurrentContext: options2.template,
                            root: options2.context.root || result,
                            templateRoot: options2.context.templateRoot || options2.template
                          })
                        );
                        options2.context.path.pop();
                        options2.context.templatePath.pop();
                      }
                    }
                  }
                }
              }
              return result;
            },
            object: function(options2) {
              var result = {}, keys, fnKeys, key2, parsedKey, inc, i2;
              if (options2.rule.min != void 0) {
                keys = Util.keys(options2.template);
                keys = Random.shuffle(keys);
                keys = keys.slice(0, options2.rule.count);
                for (i2 = 0; i2 < keys.length; i2++) {
                  key2 = keys[i2];
                  parsedKey = key2.replace(Constant.RE_KEY, "$1");
                  options2.context.path.push(parsedKey);
                  options2.context.templatePath.push(key2);
                  result[parsedKey] = Handler.gen(options2.template[key2], key2, {
                    path: options2.context.path,
                    templatePath: options2.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options2.template,
                    root: options2.context.root || result,
                    templateRoot: options2.context.templateRoot || options2.template
                  });
                  options2.context.path.pop();
                  options2.context.templatePath.pop();
                }
              } else {
                keys = [];
                fnKeys = [];
                for (key2 in options2.template) {
                  (typeof options2.template[key2] === "function" ? fnKeys : keys).push(key2);
                }
                keys = keys.concat(fnKeys);
                for (i2 = 0; i2 < keys.length; i2++) {
                  key2 = keys[i2];
                  parsedKey = key2.replace(Constant.RE_KEY, "$1");
                  options2.context.path.push(parsedKey);
                  options2.context.templatePath.push(key2);
                  result[parsedKey] = Handler.gen(options2.template[key2], key2, {
                    path: options2.context.path,
                    templatePath: options2.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options2.template,
                    root: options2.context.root || result,
                    templateRoot: options2.context.templateRoot || options2.template
                  });
                  options2.context.path.pop();
                  options2.context.templatePath.pop();
                  inc = key2.match(Constant.RE_KEY);
                  if (inc && inc[2] && Util.type(options2.template[key2]) === "number") {
                    options2.template[key2] += parseInt(inc[2], 10);
                  }
                }
              }
              return result;
            },
            number: function(options2) {
              var result, parts2;
              if (options2.rule.decimal) {
                options2.template += "";
                parts2 = options2.template.split(".");
                parts2[0] = options2.rule.range ? options2.rule.count : parts2[0];
                parts2[1] = (parts2[1] || "").slice(0, options2.rule.dcount);
                while (parts2[1].length < options2.rule.dcount) {
                  parts2[1] += // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                  parts2[1].length < options2.rule.dcount - 1 ? Random.character("number") : Random.character("123456789");
                }
                result = parseFloat(parts2.join("."), 10);
              } else {
                result = options2.rule.range && !options2.rule.parameters[2] ? options2.rule.count : options2.template;
              }
              return result;
            },
            boolean: function(options2) {
              var result;
              result = options2.rule.parameters ? Random.bool(options2.rule.min, options2.rule.max, options2.template) : options2.template;
              return result;
            },
            string: function(options2) {
              var result = "", i2, placeholders, ph, phed;
              if (options2.template.length) {
                if (options2.rule.count == void 0) {
                  result += options2.template;
                }
                for (i2 = 0; i2 < options2.rule.count; i2++) {
                  result += options2.template;
                }
                placeholders = result.match(Constant.RE_PLACEHOLDER) || [];
                for (i2 = 0; i2 < placeholders.length; i2++) {
                  ph = placeholders[i2];
                  if (/^\\/.test(ph)) {
                    placeholders.splice(i2--, 1);
                    continue;
                  }
                  phed = Handler.placeholder(ph, options2.context.currentContext, options2.context.templateCurrentContext, options2);
                  if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) {
                    result = phed;
                    break;
                  }
                  result = result.replace(ph, phed);
                }
              } else {
                result = options2.rule.range ? Random.string(options2.rule.count) : options2.template;
              }
              return result;
            },
            "function": function(options2) {
              return options2.template.call(options2.context.currentContext, options2);
            },
            "regexp": function(options2) {
              var source = "";
              if (options2.rule.count == void 0) {
                source += options2.template.source;
              }
              for (var i2 = 0; i2 < options2.rule.count; i2++) {
                source += options2.template.source;
              }
              return RE.Handler.gen(
                RE.Parser.parse(
                  source
                )
              );
            }
          });
          Handler.extend({
            _all: function() {
              var re2 = {};
              for (var key2 in Random)
                re2[key2.toLowerCase()] = key2;
              return re2;
            },
            // 处理占位符，转换为最终值
            placeholder: function(placeholder, obj, templateContext, options) {
              Constant.RE_PLACEHOLDER.exec("");
              var parts = Constant.RE_PLACEHOLDER.exec(placeholder), key = parts && parts[1], lkey = key && key.toLowerCase(), okey = this._all()[lkey], params = parts && parts[2] || "";
              var pathParts = this.splitPathToArray(key);
              try {
                params = eval("(function(){ return [].splice.call(arguments, 0 ) })(" + params + ")");
              } catch (error) {
                params = parts[2].split(/,\s*/);
              }
              if (obj && key in obj)
                return obj[key];
              if (key.charAt(0) === "/" || pathParts.length > 1)
                return this.getValueByKeyPath(key, options);
              if (templateContext && typeof templateContext === "object" && key in templateContext && placeholder !== templateContext[key]) {
                templateContext[key] = Handler.gen(templateContext[key], key, {
                  currentContext: obj,
                  templateCurrentContext: templateContext
                });
                return templateContext[key];
              }
              if (!(key in Random) && !(lkey in Random) && !(okey in Random))
                return placeholder;
              for (var i = 0; i < params.length; i++) {
                Constant.RE_PLACEHOLDER.exec("");
                if (Constant.RE_PLACEHOLDER.test(params[i])) {
                  params[i] = Handler.placeholder(params[i], obj, templateContext, options);
                }
              }
              var handle = Random[key] || Random[lkey] || Random[okey];
              switch (Util.type(handle)) {
                case "array":
                  return Random.pick(handle);
                case "function":
                  handle.options = options;
                  var re = handle.apply(Random, params);
                  if (re === void 0)
                    re = "";
                  delete handle.options;
                  return re;
              }
            },
            getValueByKeyPath: function(key2, options2) {
              var originalKey = key2;
              var keyPathParts = this.splitPathToArray(key2);
              var absolutePathParts = [];
              if (key2.charAt(0) === "/") {
                absolutePathParts = [options2.context.path[0]].concat(
                  this.normalizePath(keyPathParts)
                );
              } else {
                if (keyPathParts.length > 1) {
                  absolutePathParts = options2.context.path.slice(0);
                  absolutePathParts.pop();
                  absolutePathParts = this.normalizePath(
                    absolutePathParts.concat(keyPathParts)
                  );
                }
              }
              try {
                key2 = keyPathParts[keyPathParts.length - 1];
                var currentContext = options2.context.root;
                var templateCurrentContext = options2.context.templateRoot;
                for (var i2 = 1; i2 < absolutePathParts.length - 1; i2++) {
                  currentContext = currentContext[absolutePathParts[i2]];
                  templateCurrentContext = templateCurrentContext[absolutePathParts[i2]];
                }
                if (currentContext && key2 in currentContext)
                  return currentContext[key2];
                if (templateCurrentContext && typeof templateCurrentContext === "object" && key2 in templateCurrentContext && originalKey !== templateCurrentContext[key2]) {
                  templateCurrentContext[key2] = Handler.gen(templateCurrentContext[key2], key2, {
                    currentContext,
                    templateCurrentContext
                  });
                  return templateCurrentContext[key2];
                }
              } catch (err) {
              }
              return "@" + keyPathParts.join("/");
            },
            // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
            normalizePath: function(pathParts2) {
              var newPathParts = [];
              for (var i2 = 0; i2 < pathParts2.length; i2++) {
                switch (pathParts2[i2]) {
                  case "..":
                    newPathParts.pop();
                    break;
                  case ".":
                    break;
                  default:
                    newPathParts.push(pathParts2[i2]);
                }
              }
              return newPathParts;
            },
            splitPathToArray: function(path) {
              var parts2 = path.split(/\/+/);
              if (!parts2[parts2.length - 1])
                parts2 = parts2.slice(0, -1);
              if (!parts2[0])
                parts2 = parts2.slice(1);
              return parts2;
            }
          });
          module.exports = Handler;
        },
        /* 2 */
        /***/
        function(module2, exports2) {
          module2.exports = {
            GUID: 1,
            RE_KEY: /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
            RE_RANGE: /([\+\-]?\d+)-?([\+\-]?\d+)?/,
            RE_PLACEHOLDER: /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g
            // /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
            // RE_INDEX: /^index$/,
            // RE_KEY: /^key$/
          };
        },
        /* 3 */
        /***/
        function(module2, exports2) {
          var Util2 = {};
          Util2.extend = function extend2() {
            var target = arguments[0] || {}, i2 = 1, length = arguments.length, options2, name, src, copy, clone2;
            if (length === 1) {
              target = this;
              i2 = 0;
            }
            for (; i2 < length; i2++) {
              options2 = arguments[i2];
              if (!options2)
                continue;
              for (name in options2) {
                src = target[name];
                copy = options2[name];
                if (target === copy)
                  continue;
                if (copy === void 0)
                  continue;
                if (Util2.isArray(copy) || Util2.isObject(copy)) {
                  if (Util2.isArray(copy))
                    clone2 = src && Util2.isArray(src) ? src : [];
                  if (Util2.isObject(copy))
                    clone2 = src && Util2.isObject(src) ? src : {};
                  target[name] = Util2.extend(clone2, copy);
                } else {
                  target[name] = copy;
                }
              }
            }
            return target;
          };
          Util2.each = function each(obj2, iterator, context) {
            var i2, key2;
            if (this.type(obj2) === "number") {
              for (i2 = 0; i2 < obj2; i2++) {
                iterator(i2, i2);
              }
            } else if (obj2.length === +obj2.length) {
              for (i2 = 0; i2 < obj2.length; i2++) {
                if (iterator.call(context, obj2[i2], i2, obj2) === false)
                  break;
              }
            } else {
              for (key2 in obj2) {
                if (iterator.call(context, obj2[key2], key2, obj2) === false)
                  break;
              }
            }
          };
          Util2.type = function type(obj2) {
            return obj2 === null || obj2 === void 0 ? String(obj2) : Object.prototype.toString.call(obj2).match(/\[object (\w+)\]/)[1].toLowerCase();
          };
          Util2.each("String Object Array RegExp Function".split(" "), function(value) {
            Util2["is" + value] = function(obj2) {
              return Util2.type(obj2) === value.toLowerCase();
            };
          });
          Util2.isObjectOrArray = function(value) {
            return Util2.isObject(value) || Util2.isArray(value);
          };
          Util2.isNumeric = function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
          };
          Util2.keys = function(obj2) {
            var keys = [];
            for (var key2 in obj2) {
              if (obj2.hasOwnProperty(key2))
                keys.push(key2);
            }
            return keys;
          };
          Util2.values = function(obj2) {
            var values = [];
            for (var key2 in obj2) {
              if (obj2.hasOwnProperty(key2))
                values.push(obj2[key2]);
            }
            return values;
          };
          Util2.heredoc = function heredoc(fn) {
            return fn.toString().replace(/^[^\/]+\/\*!?/, "").replace(/\*\/[^\/]+$/, "").replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
          };
          Util2.noop = function() {
          };
          module2.exports = Util2;
        },
        /* 4 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Constant2 = __webpack_require__2(2);
          var Random2 = __webpack_require__2(5);
          module2.exports = {
            parse: function(name) {
              name = name == void 0 ? "" : name + "";
              var parameters = (name || "").match(Constant2.RE_KEY);
              var range = parameters && parameters[3] && parameters[3].match(Constant2.RE_RANGE);
              var min = range && range[1] && parseInt(range[1], 10);
              var max = range && range[2] && parseInt(range[2], 10);
              var count = range ? !range[2] ? parseInt(range[1], 10) : Random2.integer(min, max) : void 0;
              var decimal = parameters && parameters[4] && parameters[4].match(Constant2.RE_RANGE);
              var dmin = decimal && decimal[1] && parseInt(decimal[1], 10);
              var dmax = decimal && decimal[2] && parseInt(decimal[2], 10);
              var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random2.integer(dmin, dmax) : void 0;
              var result = {
                // 1 name, 2 inc, 3 range, 4 decimal
                parameters,
                // 1 min, 2 max
                range,
                min,
                max,
                // min-max
                count,
                // 是否有 decimal
                decimal,
                dmin,
                dmax,
                // dmin-dimax
                dcount
              };
              for (var r2 in result) {
                if (result[r2] != void 0)
                  return result;
              }
              return {};
            }
          };
        },
        /* 5 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Util2 = __webpack_require__2(3);
          var Random2 = {
            extend: Util2.extend
          };
          Random2.extend(__webpack_require__2(6));
          Random2.extend(__webpack_require__2(7));
          Random2.extend(__webpack_require__2(8));
          Random2.extend(__webpack_require__2(10));
          Random2.extend(__webpack_require__2(13));
          Random2.extend(__webpack_require__2(15));
          Random2.extend(__webpack_require__2(16));
          Random2.extend(__webpack_require__2(17));
          Random2.extend(__webpack_require__2(14));
          Random2.extend(__webpack_require__2(19));
          module2.exports = Random2;
        },
        /* 6 */
        /***/
        function(module2, exports2) {
          module2.exports = {
            // 返回一个随机的布尔值。
            boolean: function(min, max, cur) {
              if (cur !== void 0) {
                min = typeof min !== "undefined" && !isNaN(min) ? parseInt(min, 10) : 1;
                max = typeof max !== "undefined" && !isNaN(max) ? parseInt(max, 10) : 1;
                return Math.random() > 1 / (min + max) * min ? !cur : cur;
              }
              return Math.random() >= 0.5;
            },
            bool: function(min, max, cur) {
              return this.boolean(min, max, cur);
            },
            // 返回一个随机的自然数（大于等于 0 的整数）。
            natural: function(min, max) {
              min = typeof min !== "undefined" ? parseInt(min, 10) : 0;
              max = typeof max !== "undefined" ? parseInt(max, 10) : 9007199254740992;
              return Math.round(Math.random() * (max - min)) + min;
            },
            // 返回一个随机的整数。
            integer: function(min, max) {
              min = typeof min !== "undefined" ? parseInt(min, 10) : -9007199254740992;
              max = typeof max !== "undefined" ? parseInt(max, 10) : 9007199254740992;
              return Math.round(Math.random() * (max - min)) + min;
            },
            int: function(min, max) {
              return this.integer(min, max);
            },
            // 返回一个随机的浮点数。
            float: function(min, max, dmin, dmax) {
              dmin = dmin === void 0 ? 0 : dmin;
              dmin = Math.max(Math.min(dmin, 17), 0);
              dmax = dmax === void 0 ? 17 : dmax;
              dmax = Math.max(Math.min(dmax, 17), 0);
              var ret = this.integer(min, max) + ".";
              for (var i2 = 0, dcount = this.natural(dmin, dmax); i2 < dcount; i2++) {
                ret += // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                i2 < dcount - 1 ? this.character("number") : this.character("123456789");
              }
              return parseFloat(ret, 10);
            },
            // 返回一个随机字符。
            character: function(pool) {
              var pools = {
                lower: "abcdefghijklmnopqrstuvwxyz",
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                number: "0123456789",
                symbol: "!@#$%^&*()[]"
              };
              pools.alpha = pools.lower + pools.upper;
              pools["undefined"] = pools.lower + pools.upper + pools.number + pools.symbol;
              pool = pools[("" + pool).toLowerCase()] || pool;
              return pool.charAt(this.natural(0, pool.length - 1));
            },
            char: function(pool) {
              return this.character(pool);
            },
            // 返回一个随机字符串。
            string: function(pool, min, max) {
              var len;
              switch (arguments.length) {
                case 0:
                  len = this.natural(3, 7);
                  break;
                case 1:
                  len = pool;
                  pool = void 0;
                  break;
                case 2:
                  if (typeof arguments[0] === "string") {
                    len = min;
                  } else {
                    len = this.natural(pool, min);
                    pool = void 0;
                  }
                  break;
                case 3:
                  len = this.natural(min, max);
                  break;
              }
              var text = "";
              for (var i2 = 0; i2 < len; i2++) {
                text += this.character(pool);
              }
              return text;
            },
            str: function() {
              return this.string.apply(this, arguments);
            },
            // 返回一个整型数组。
            range: function(start, stop, step) {
              if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
              }
              step = arguments[2] || 1;
              start = +start;
              stop = +stop;
              step = +step;
              var len = Math.max(Math.ceil((stop - start) / step), 0);
              var idx = 0;
              var range = new Array(len);
              while (idx < len) {
                range[idx++] = start;
                start += step;
              }
              return range;
            }
          };
        },
        /* 7 */
        /***/
        function(module2, exports2) {
          var patternLetters = {
            yyyy: "getFullYear",
            yy: function(date) {
              return ("" + date.getFullYear()).slice(2);
            },
            y: "yy",
            MM: function(date) {
              var m2 = date.getMonth() + 1;
              return m2 < 10 ? "0" + m2 : m2;
            },
            M: function(date) {
              return date.getMonth() + 1;
            },
            dd: function(date) {
              var d2 = date.getDate();
              return d2 < 10 ? "0" + d2 : d2;
            },
            d: "getDate",
            HH: function(date) {
              var h2 = date.getHours();
              return h2 < 10 ? "0" + h2 : h2;
            },
            H: "getHours",
            hh: function(date) {
              var h2 = date.getHours() % 12;
              return h2 < 10 ? "0" + h2 : h2;
            },
            h: function(date) {
              return date.getHours() % 12;
            },
            mm: function(date) {
              var m2 = date.getMinutes();
              return m2 < 10 ? "0" + m2 : m2;
            },
            m: "getMinutes",
            ss: function(date) {
              var s2 = date.getSeconds();
              return s2 < 10 ? "0" + s2 : s2;
            },
            s: "getSeconds",
            SS: function(date) {
              var ms2 = date.getMilliseconds();
              return ms2 < 10 && "00" + ms2 || ms2 < 100 && "0" + ms2 || ms2;
            },
            S: "getMilliseconds",
            A: function(date) {
              return date.getHours() < 12 ? "AM" : "PM";
            },
            a: function(date) {
              return date.getHours() < 12 ? "am" : "pm";
            },
            T: "getTime"
          };
          module2.exports = {
            // 日期占位符集合。
            _patternLetters: patternLetters,
            // 日期占位符正则。
            _rformat: new RegExp(function() {
              var re2 = [];
              for (var i2 in patternLetters)
                re2.push(i2);
              return "(" + re2.join("|") + ")";
            }(), "g"),
            // 格式化日期。
            _formatDate: function(date, format) {
              return format.replace(this._rformat, function creatNewSubString($0, flag) {
                return typeof patternLetters[flag] === "function" ? patternLetters[flag](date) : patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) : date[patternLetters[flag]]();
              });
            },
            // 生成一个随机的 Date 对象。
            _randomDate: function(min, max) {
              min = min === void 0 ? /* @__PURE__ */ new Date(0) : min;
              max = max === void 0 ? /* @__PURE__ */ new Date() : max;
              return new Date(Math.random() * (max.getTime() - min.getTime()));
            },
            // 返回一个随机的日期字符串。
            date: function(format) {
              format = format || "yyyy-MM-dd";
              return this._formatDate(this._randomDate(), format);
            },
            // 返回一个随机的时间字符串。
            time: function(format) {
              format = format || "HH:mm:ss";
              return this._formatDate(this._randomDate(), format);
            },
            // 返回一个随机的日期和时间字符串。
            datetime: function(format) {
              format = format || "yyyy-MM-dd HH:mm:ss";
              return this._formatDate(this._randomDate(), format);
            },
            // 返回当前的日期和时间字符串。
            now: function(unit, format) {
              if (arguments.length === 1) {
                if (!/year|month|day|hour|minute|second|week/.test(unit)) {
                  format = unit;
                  unit = "";
                }
              }
              unit = (unit || "").toLowerCase();
              format = format || "yyyy-MM-dd HH:mm:ss";
              var date = /* @__PURE__ */ new Date();
              switch (unit) {
                case "year":
                  date.setMonth(0);
                case "month":
                  date.setDate(1);
                case "week":
                case "day":
                  date.setHours(0);
                case "hour":
                  date.setMinutes(0);
                case "minute":
                  date.setSeconds(0);
                case "second":
                  date.setMilliseconds(0);
              }
              switch (unit) {
                case "week":
                  date.setDate(date.getDate() - date.getDay());
              }
              return this._formatDate(date, format);
            }
          };
        },
        /* 8 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          (function(module3) {
            module3.exports = {
              // 常见的广告宽高
              _adSize: [
                "300x250",
                "250x250",
                "240x400",
                "336x280",
                "180x150",
                "720x300",
                "468x60",
                "234x60",
                "88x31",
                "120x90",
                "120x60",
                "120x240",
                "125x125",
                "728x90",
                "160x600",
                "120x600",
                "300x600"
              ],
              // 常见的屏幕宽高
              _screenSize: [
                "320x200",
                "320x240",
                "640x480",
                "800x480",
                "800x480",
                "1024x600",
                "1024x768",
                "1280x800",
                "1440x900",
                "1920x1200",
                "2560x1600"
              ],
              // 常见的视频宽高
              _videoSize: ["720x480", "768x576", "1280x720", "1920x1080"],
              /*
              		        生成一个随机的图片地址。
              
              		        替代图片源
              		            http://fpoimg.com/
              		        参考自 
              		            http://rensanning.iteye.com/blog/1933310
              		            http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
              		    */
              image: function(size2, background, foreground, format, text) {
                if (arguments.length === 4) {
                  text = format;
                  format = void 0;
                }
                if (arguments.length === 3) {
                  text = foreground;
                  foreground = void 0;
                }
                if (!size2)
                  size2 = this.pick(this._adSize);
                if (background && ~background.indexOf("#"))
                  background = background.slice(1);
                if (foreground && ~foreground.indexOf("#"))
                  foreground = foreground.slice(1);
                return "http://dummyimage.com/" + size2 + (background ? "/" + background : "") + (foreground ? "/" + foreground : "") + (format ? "." + format : "") + (text ? "&text=" + text : "");
              },
              img: function() {
                return this.image.apply(this, arguments);
              },
              /*
              		        BrandColors
              		        http://brandcolors.net/
              		        A collection of major brand color codes curated by Galen Gidman.
              		        大牌公司的颜色集合
              
              		        // 获取品牌和颜色
              		        $('h2').each(function(index, item){
              		            item = $(item)
              		            uni.__f__('log','at node_modules/mockjs/dist/mock.js:1295','\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
              		        })
              		    */
              _brandColors: {
                "4ormat": "#fb0a2a",
                "500px": "#02adea",
                "About.me (blue)": "#00405d",
                "About.me (yellow)": "#ffcc33",
                "Addvocate": "#ff6138",
                "Adobe": "#ff0000",
                "Aim": "#fcd20b",
                "Amazon": "#e47911",
                "Android": "#a4c639",
                "Angie's List": "#7fbb00",
                "AOL": "#0060a3",
                "Atlassian": "#003366",
                "Behance": "#053eff",
                "Big Cartel": "#97b538",
                "bitly": "#ee6123",
                "Blogger": "#fc4f08",
                "Boeing": "#0039a6",
                "Booking.com": "#003580",
                "Carbonmade": "#613854",
                "Cheddar": "#ff7243",
                "Code School": "#3d4944",
                "Delicious": "#205cc0",
                "Dell": "#3287c1",
                "Designmoo": "#e54a4f",
                "Deviantart": "#4e6252",
                "Designer News": "#2d72da",
                "Devour": "#fd0001",
                "DEWALT": "#febd17",
                "Disqus (blue)": "#59a3fc",
                "Disqus (orange)": "#db7132",
                "Dribbble": "#ea4c89",
                "Dropbox": "#3d9ae8",
                "Drupal": "#0c76ab",
                "Dunked": "#2a323a",
                "eBay": "#89c507",
                "Ember": "#f05e1b",
                "Engadget": "#00bdf6",
                "Envato": "#528036",
                "Etsy": "#eb6d20",
                "Evernote": "#5ba525",
                "Fab.com": "#dd0017",
                "Facebook": "#3b5998",
                "Firefox": "#e66000",
                "Flickr (blue)": "#0063dc",
                "Flickr (pink)": "#ff0084",
                "Forrst": "#5b9a68",
                "Foursquare": "#25a0ca",
                "Garmin": "#007cc3",
                "GetGlue": "#2d75a2",
                "Gimmebar": "#f70078",
                "GitHub": "#171515",
                "Google Blue": "#0140ca",
                "Google Green": "#16a61e",
                "Google Red": "#dd1812",
                "Google Yellow": "#fcca03",
                "Google+": "#dd4b39",
                "Grooveshark": "#f77f00",
                "Groupon": "#82b548",
                "Hacker News": "#ff6600",
                "HelloWallet": "#0085ca",
                "Heroku (light)": "#c7c5e6",
                "Heroku (dark)": "#6567a5",
                "HootSuite": "#003366",
                "Houzz": "#73ba37",
                "HTML5": "#ec6231",
                "IKEA": "#ffcc33",
                "IMDb": "#f3ce13",
                "Instagram": "#3f729b",
                "Intel": "#0071c5",
                "Intuit": "#365ebf",
                "Kickstarter": "#76cc1e",
                "kippt": "#e03500",
                "Kodery": "#00af81",
                "LastFM": "#c3000d",
                "LinkedIn": "#0e76a8",
                "Livestream": "#cf0005",
                "Lumo": "#576396",
                "Mixpanel": "#a086d3",
                "Meetup": "#e51937",
                "Nokia": "#183693",
                "NVIDIA": "#76b900",
                "Opera": "#cc0f16",
                "Path": "#e41f11",
                "PayPal (dark)": "#1e477a",
                "PayPal (light)": "#3b7bbf",
                "Pinboard": "#0000e6",
                "Pinterest": "#c8232c",
                "PlayStation": "#665cbe",
                "Pocket": "#ee4056",
                "Prezi": "#318bff",
                "Pusha": "#0f71b4",
                "Quora": "#a82400",
                "QUOTE.fm": "#66ceff",
                "Rdio": "#008fd5",
                "Readability": "#9c0000",
                "Red Hat": "#cc0000",
                "Resource": "#7eb400",
                "Rockpack": "#0ba6ab",
                "Roon": "#62b0d9",
                "RSS": "#ee802f",
                "Salesforce": "#1798c1",
                "Samsung": "#0c4da2",
                "Shopify": "#96bf48",
                "Skype": "#00aff0",
                "Snagajob": "#f47a20",
                "Softonic": "#008ace",
                "SoundCloud": "#ff7700",
                "Space Box": "#f86960",
                "Spotify": "#81b71a",
                "Sprint": "#fee100",
                "Squarespace": "#121212",
                "StackOverflow": "#ef8236",
                "Staples": "#cc0000",
                "Status Chart": "#d7584f",
                "Stripe": "#008cdd",
                "StudyBlue": "#00afe1",
                "StumbleUpon": "#f74425",
                "T-Mobile": "#ea0a8e",
                "Technorati": "#40a800",
                "The Next Web": "#ef4423",
                "Treehouse": "#5cb868",
                "Trulia": "#5eab1f",
                "Tumblr": "#34526f",
                "Twitch.tv": "#6441a5",
                "Twitter": "#00acee",
                "TYPO3": "#ff8700",
                "Ubuntu": "#dd4814",
                "Ustream": "#3388ff",
                "Verizon": "#ef1d1d",
                "Vimeo": "#86c9ef",
                "Vine": "#00a478",
                "Virb": "#06afd8",
                "Virgin Media": "#cc0000",
                "Wooga": "#5b009c",
                "WordPress (blue)": "#21759b",
                "WordPress (orange)": "#d54e21",
                "WordPress (grey)": "#464646",
                "Wunderlist": "#2b88d9",
                "XBOX": "#9bc848",
                "XING": "#126567",
                "Yahoo!": "#720e9e",
                "Yandex": "#ffcc00",
                "Yelp": "#c41200",
                "YouTube": "#c4302b",
                "Zalongo": "#5498dc",
                "Zendesk": "#78a300",
                "Zerply": "#9dcc7a",
                "Zootool": "#5e8b1d"
              },
              _brandNames: function() {
                var brands = [];
                for (var b2 in this._brandColors) {
                  brands.push(b2);
                }
                return brands;
              },
              /*
              		        生成一段随机的 Base64 图片编码。
              
              		        https://github.com/imsky/holder
              		        Holder renders image placeholders entirely on the client side.
              
              		        dataImageHolder: function(size) {
              		            return 'holder.js/' + size
              		        },
              		    */
              dataImage: function(size2, text) {
                var canvas;
                if (typeof document !== "undefined") {
                  canvas = document.createElement("canvas");
                } else {
                  var Canvas = module3.require("canvas");
                  canvas = new Canvas();
                }
                var ctx = canvas && canvas.getContext && canvas.getContext("2d");
                if (!canvas || !ctx)
                  return "";
                if (!size2)
                  size2 = this.pick(this._adSize);
                text = text !== void 0 ? text : size2;
                size2 = size2.split("x");
                var width = parseInt(size2[0], 10), height = parseInt(size2[1], 10), background = this._brandColors[this.pick(this._brandNames())], foreground = "#FFF", text_height = 14, font = "sans-serif";
                canvas.width = width;
                canvas.height = height;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = foreground;
                ctx.font = "bold " + text_height + "px " + font;
                ctx.fillText(text, width / 2, height / 2, width);
                return canvas.toDataURL("image/png");
              }
            };
          }).call(exports2, __webpack_require__2(9)(module2));
        },
        /* 9 */
        /***/
        function(module2, exports2) {
          module2.exports = function(module3) {
            if (!module3.webpackPolyfill) {
              module3.deprecate = function() {
              };
              module3.paths = [];
              module3.children = [];
              module3.webpackPolyfill = 1;
            }
            return module3;
          };
        },
        /* 10 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Convert = __webpack_require__2(11);
          var DICT = __webpack_require__2(12);
          module2.exports = {
            // 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
            color: function(name) {
              if (name || DICT[name])
                return DICT[name].nicer;
              return this.hex();
            },
            // #DAC0DE
            hex: function() {
              var hsv = this._goldenRatioColor();
              var rgb = Convert.hsv2rgb(hsv);
              var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2]);
              return hex;
            },
            // rgb(128,255,255)
            rgb: function() {
              var hsv = this._goldenRatioColor();
              var rgb = Convert.hsv2rgb(hsv);
              return "rgb(" + parseInt(rgb[0], 10) + ", " + parseInt(rgb[1], 10) + ", " + parseInt(rgb[2], 10) + ")";
            },
            // rgba(128,255,255,0.3)
            rgba: function() {
              var hsv = this._goldenRatioColor();
              var rgb = Convert.hsv2rgb(hsv);
              return "rgba(" + parseInt(rgb[0], 10) + ", " + parseInt(rgb[1], 10) + ", " + parseInt(rgb[2], 10) + ", " + Math.random().toFixed(2) + ")";
            },
            // hsl(300,80%,90%)
            hsl: function() {
              var hsv = this._goldenRatioColor();
              var hsl = Convert.hsv2hsl(hsv);
              return "hsl(" + parseInt(hsl[0], 10) + ", " + parseInt(hsl[1], 10) + ", " + parseInt(hsl[2], 10) + ")";
            },
            // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
            // https://github.com/devongovett/color-generator/blob/master/index.js
            // 随机生成一个有吸引力的颜色。
            _goldenRatioColor: function(saturation, value) {
              this._goldenRatio = 0.618033988749895;
              this._hue = this._hue || Math.random();
              this._hue += this._goldenRatio;
              this._hue %= 1;
              if (typeof saturation !== "number")
                saturation = 0.5;
              if (typeof value !== "number")
                value = 0.95;
              return [
                this._hue * 360,
                saturation * 100,
                value * 100
              ];
            }
          };
        },
        /* 11 */
        /***/
        function(module2, exports2) {
          module2.exports = {
            rgb2hsl: function rgb2hsl(rgb) {
              var r2 = rgb[0] / 255, g2 = rgb[1] / 255, b2 = rgb[2] / 255, min = Math.min(r2, g2, b2), max = Math.max(r2, g2, b2), delta = max - min, h2, s2, l2;
              if (max == min)
                h2 = 0;
              else if (r2 == max)
                h2 = (g2 - b2) / delta;
              else if (g2 == max)
                h2 = 2 + (b2 - r2) / delta;
              else if (b2 == max)
                h2 = 4 + (r2 - g2) / delta;
              h2 = Math.min(h2 * 60, 360);
              if (h2 < 0)
                h2 += 360;
              l2 = (min + max) / 2;
              if (max == min)
                s2 = 0;
              else if (l2 <= 0.5)
                s2 = delta / (max + min);
              else
                s2 = delta / (2 - max - min);
              return [h2, s2 * 100, l2 * 100];
            },
            rgb2hsv: function rgb2hsv(rgb) {
              var r2 = rgb[0], g2 = rgb[1], b2 = rgb[2], min = Math.min(r2, g2, b2), max = Math.max(r2, g2, b2), delta = max - min, h2, s2, v2;
              if (max === 0)
                s2 = 0;
              else
                s2 = delta / max * 1e3 / 10;
              if (max == min)
                h2 = 0;
              else if (r2 == max)
                h2 = (g2 - b2) / delta;
              else if (g2 == max)
                h2 = 2 + (b2 - r2) / delta;
              else if (b2 == max)
                h2 = 4 + (r2 - g2) / delta;
              h2 = Math.min(h2 * 60, 360);
              if (h2 < 0)
                h2 += 360;
              v2 = max / 255 * 1e3 / 10;
              return [h2, s2, v2];
            },
            hsl2rgb: function hsl2rgb(hsl) {
              var h2 = hsl[0] / 360, s2 = hsl[1] / 100, l2 = hsl[2] / 100, t1, t2, t3, rgb, val;
              if (s2 === 0) {
                val = l2 * 255;
                return [val, val, val];
              }
              if (l2 < 0.5)
                t2 = l2 * (1 + s2);
              else
                t2 = l2 + s2 - l2 * s2;
              t1 = 2 * l2 - t2;
              rgb = [0, 0, 0];
              for (var i2 = 0; i2 < 3; i2++) {
                t3 = h2 + 1 / 3 * -(i2 - 1);
                if (t3 < 0)
                  t3++;
                if (t3 > 1)
                  t3--;
                if (6 * t3 < 1)
                  val = t1 + (t2 - t1) * 6 * t3;
                else if (2 * t3 < 1)
                  val = t2;
                else if (3 * t3 < 2)
                  val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                else
                  val = t1;
                rgb[i2] = val * 255;
              }
              return rgb;
            },
            hsl2hsv: function hsl2hsv(hsl) {
              var h2 = hsl[0], s2 = hsl[1] / 100, l2 = hsl[2] / 100, sv, v2;
              l2 *= 2;
              s2 *= l2 <= 1 ? l2 : 2 - l2;
              v2 = (l2 + s2) / 2;
              sv = 2 * s2 / (l2 + s2);
              return [h2, sv * 100, v2 * 100];
            },
            hsv2rgb: function hsv2rgb(hsv) {
              var h2 = hsv[0] / 60;
              var s2 = hsv[1] / 100;
              var v2 = hsv[2] / 100;
              var hi = Math.floor(h2) % 6;
              var f2 = h2 - Math.floor(h2);
              var p2 = 255 * v2 * (1 - s2);
              var q2 = 255 * v2 * (1 - s2 * f2);
              var t2 = 255 * v2 * (1 - s2 * (1 - f2));
              v2 = 255 * v2;
              switch (hi) {
                case 0:
                  return [v2, t2, p2];
                case 1:
                  return [q2, v2, p2];
                case 2:
                  return [p2, v2, t2];
                case 3:
                  return [p2, q2, v2];
                case 4:
                  return [t2, p2, v2];
                case 5:
                  return [v2, p2, q2];
              }
            },
            hsv2hsl: function hsv2hsl(hsv) {
              var h2 = hsv[0], s2 = hsv[1] / 100, v2 = hsv[2] / 100, sl, l2;
              l2 = (2 - s2) * v2;
              sl = s2 * v2;
              sl /= l2 <= 1 ? l2 : 2 - l2;
              l2 /= 2;
              return [h2, sl * 100, l2 * 100];
            },
            // http://www.140byt.es/keywords/color
            rgb2hex: function(a2, b2, c2) {
              return "#" + ((256 + a2 << 8 | b2) << 8 | c2).toString(16).slice(1);
            },
            hex2rgb: function(a2) {
              a2 = "0x" + a2.slice(1).replace(a2.length > 4 ? a2 : /./g, "$&$&") | 0;
              return [a2 >> 16, a2 >> 8 & 255, a2 & 255];
            }
          };
        },
        /* 12 */
        /***/
        function(module2, exports2) {
          module2.exports = {
            // name value nicer
            navy: {
              value: "#000080",
              nicer: "#001F3F"
            },
            blue: {
              value: "#0000ff",
              nicer: "#0074D9"
            },
            aqua: {
              value: "#00ffff",
              nicer: "#7FDBFF"
            },
            teal: {
              value: "#008080",
              nicer: "#39CCCC"
            },
            olive: {
              value: "#008000",
              nicer: "#3D9970"
            },
            green: {
              value: "#008000",
              nicer: "#2ECC40"
            },
            lime: {
              value: "#00ff00",
              nicer: "#01FF70"
            },
            yellow: {
              value: "#ffff00",
              nicer: "#FFDC00"
            },
            orange: {
              value: "#ffa500",
              nicer: "#FF851B"
            },
            red: {
              value: "#ff0000",
              nicer: "#FF4136"
            },
            maroon: {
              value: "#800000",
              nicer: "#85144B"
            },
            fuchsia: {
              value: "#ff00ff",
              nicer: "#F012BE"
            },
            purple: {
              value: "#800080",
              nicer: "#B10DC9"
            },
            silver: {
              value: "#c0c0c0",
              nicer: "#DDDDDD"
            },
            gray: {
              value: "#808080",
              nicer: "#AAAAAA"
            },
            black: {
              value: "#000000",
              nicer: "#111111"
            },
            white: {
              value: "#FFFFFF",
              nicer: "#FFFFFF"
            }
          };
        },
        /* 13 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Basic = __webpack_require__2(6);
          var Helper = __webpack_require__2(14);
          function range(defaultMin, defaultMax, min, max) {
            return min === void 0 ? Basic.natural(defaultMin, defaultMax) : (
              // ()
              max === void 0 ? min : (
                // ( len )
                Basic.natural(parseInt(min, 10), parseInt(max, 10))
              )
            );
          }
          module2.exports = {
            // 随机生成一段文本。
            paragraph: function(min, max) {
              var len = range(3, 7, min, max);
              var result = [];
              for (var i2 = 0; i2 < len; i2++) {
                result.push(this.sentence());
              }
              return result.join(" ");
            },
            // 
            cparagraph: function(min, max) {
              var len = range(3, 7, min, max);
              var result = [];
              for (var i2 = 0; i2 < len; i2++) {
                result.push(this.csentence());
              }
              return result.join("");
            },
            // 随机生成一个句子，第一个单词的首字母大写。
            sentence: function(min, max) {
              var len = range(12, 18, min, max);
              var result = [];
              for (var i2 = 0; i2 < len; i2++) {
                result.push(this.word());
              }
              return Helper.capitalize(result.join(" ")) + ".";
            },
            // 随机生成一个中文句子。
            csentence: function(min, max) {
              var len = range(12, 18, min, max);
              var result = [];
              for (var i2 = 0; i2 < len; i2++) {
                result.push(this.cword());
              }
              return result.join("") + "。";
            },
            // 随机生成一个单词。
            word: function(min, max) {
              var len = range(3, 10, min, max);
              var result = "";
              for (var i2 = 0; i2 < len; i2++) {
                result += Basic.character("lower");
              }
              return result;
            },
            // 随机生成一个或多个汉字。
            cword: function(pool, min, max) {
              var DICT_KANZI = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞";
              var len;
              switch (arguments.length) {
                case 0:
                  pool = DICT_KANZI;
                  len = 1;
                  break;
                case 1:
                  if (typeof arguments[0] === "string") {
                    len = 1;
                  } else {
                    len = pool;
                    pool = DICT_KANZI;
                  }
                  break;
                case 2:
                  if (typeof arguments[0] === "string") {
                    len = min;
                  } else {
                    len = this.natural(pool, min);
                    pool = DICT_KANZI;
                  }
                  break;
                case 3:
                  len = this.natural(min, max);
                  break;
              }
              var result = "";
              for (var i2 = 0; i2 < len; i2++) {
                result += pool.charAt(this.natural(0, pool.length - 1));
              }
              return result;
            },
            // 随机生成一句标题，其中每个单词的首字母大写。
            title: function(min, max) {
              var len = range(3, 7, min, max);
              var result = [];
              for (var i2 = 0; i2 < len; i2++) {
                result.push(this.capitalize(this.word()));
              }
              return result.join(" ");
            },
            // 随机生成一句中文标题。
            ctitle: function(min, max) {
              var len = range(3, 7, min, max);
              var result = [];
              for (var i2 = 0; i2 < len; i2++) {
                result.push(this.cword());
              }
              return result.join("");
            }
          };
        },
        /* 14 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Util2 = __webpack_require__2(3);
          module2.exports = {
            // 把字符串的第一个字母转换为大写。
            capitalize: function(word) {
              return (word + "").charAt(0).toUpperCase() + (word + "").substr(1);
            },
            // 把字符串转换为大写。
            upper: function(str) {
              return (str + "").toUpperCase();
            },
            // 把字符串转换为小写。
            lower: function(str) {
              return (str + "").toLowerCase();
            },
            // 从数组中随机选取一个元素，并返回。
            pick: function pick(arr, min, max) {
              if (!Util2.isArray(arr)) {
                arr = [].slice.call(arguments);
                min = 1;
                max = 1;
              } else {
                if (min === void 0)
                  min = 1;
                if (max === void 0)
                  max = min;
              }
              if (min === 1 && max === 1)
                return arr[this.natural(0, arr.length - 1)];
              return this.shuffle(arr, min, max);
            },
            /*
            			    打乱数组中元素的顺序，并返回。
            			    Given an array, scramble the order and return it.
            
            			    其他的实现思路：
            			        // https://code.google.com/p/jslibs/wiki/JavascriptTips
            			        result = result.sort(function() {
            			            return Math.random() - 0.5
            			        })
            			*/
            shuffle: function shuffle(arr, min, max) {
              arr = arr || [];
              var old = arr.slice(0), result = [], index2 = 0, length = old.length;
              for (var i2 = 0; i2 < length; i2++) {
                index2 = this.natural(0, old.length - 1);
                result.push(old[index2]);
                old.splice(index2, 1);
              }
              switch (arguments.length) {
                case 0:
                case 1:
                  return result;
                case 2:
                  max = min;
                case 3:
                  min = parseInt(min, 10);
                  max = parseInt(max, 10);
                  return result.slice(0, this.natural(min, max));
              }
            },
            /*
            			    * Random.order(item, item)
            			    * Random.order([item, item ...])
            
            			    顺序获取数组中的元素
            
            			    [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)
            
            			    不支持单独调用！
            			*/
            order: function order(array) {
              order.cache = order.cache || {};
              if (arguments.length > 1)
                array = [].slice.call(arguments, 0);
              var options2 = order.options;
              var templatePath = options2.context.templatePath.join(".");
              var cache = order.cache[templatePath] = order.cache[templatePath] || {
                index: 0,
                array
              };
              return cache.array[cache.index++ % cache.array.length];
            }
          };
        },
        /* 15 */
        /***/
        function(module2, exports2) {
          module2.exports = {
            // 随机生成一个常见的英文名。
            first: function() {
              var names = [
                // male
                "James",
                "John",
                "Robert",
                "Michael",
                "William",
                "David",
                "Richard",
                "Charles",
                "Joseph",
                "Thomas",
                "Christopher",
                "Daniel",
                "Paul",
                "Mark",
                "Donald",
                "George",
                "Kenneth",
                "Steven",
                "Edward",
                "Brian",
                "Ronald",
                "Anthony",
                "Kevin",
                "Jason",
                "Matthew",
                "Gary",
                "Timothy",
                "Jose",
                "Larry",
                "Jeffrey",
                "Frank",
                "Scott",
                "Eric"
              ].concat([
                // female
                "Mary",
                "Patricia",
                "Linda",
                "Barbara",
                "Elizabeth",
                "Jennifer",
                "Maria",
                "Susan",
                "Margaret",
                "Dorothy",
                "Lisa",
                "Nancy",
                "Karen",
                "Betty",
                "Helen",
                "Sandra",
                "Donna",
                "Carol",
                "Ruth",
                "Sharon",
                "Michelle",
                "Laura",
                "Sarah",
                "Kimberly",
                "Deborah",
                "Jessica",
                "Shirley",
                "Cynthia",
                "Angela",
                "Melissa",
                "Brenda",
                "Amy",
                "Anna"
              ]);
              return this.pick(names);
            },
            // 随机生成一个常见的英文姓。
            last: function() {
              var names = [
                "Smith",
                "Johnson",
                "Williams",
                "Brown",
                "Jones",
                "Miller",
                "Davis",
                "Garcia",
                "Rodriguez",
                "Wilson",
                "Martinez",
                "Anderson",
                "Taylor",
                "Thomas",
                "Hernandez",
                "Moore",
                "Martin",
                "Jackson",
                "Thompson",
                "White",
                "Lopez",
                "Lee",
                "Gonzalez",
                "Harris",
                "Clark",
                "Lewis",
                "Robinson",
                "Walker",
                "Perez",
                "Hall",
                "Young",
                "Allen"
              ];
              return this.pick(names);
            },
            // 随机生成一个常见的英文姓名。
            name: function(middle) {
              return this.first() + " " + (middle ? this.first() + " " : "") + this.last();
            },
            /*
                随机生成一个常见的中文姓。
                [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
                [玄派网 - 网络小说创作辅助平台](http://xuanpai.sinaapp.com/)
             */
            cfirst: function() {
              var names = "王 李 张 刘 陈 杨 赵 黄 周 吴 徐 孙 胡 朱 高 林 何 郭 马 罗 梁 宋 郑 谢 韩 唐 冯 于 董 萧 程 曹 袁 邓 许 傅 沈 曾 彭 吕 苏 卢 蒋 蔡 贾 丁 魏 薛 叶 阎 余 潘 杜 戴 夏 锺 汪 田 任 姜 范 方 石 姚 谭 廖 邹 熊 金 陆 郝 孔 白 崔 康 毛 邱 秦 江 史 顾 侯 邵 孟 龙 万 段 雷 钱 汤 尹 黎 易 常 武 乔 贺 赖 龚 文".split(" ");
              return this.pick(names);
            },
            /*
                随机生成一个常见的中文名。
                [中国最常见名字前50名_三九算命网](http://www.name999.net/xingming/xingshi/20131004/48.html)
             */
            clast: function() {
              var names = "伟 芳 娜 秀英 敏 静 丽 强 磊 军 洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 平 刚 桂英".split(" ");
              return this.pick(names);
            },
            // 随机生成一个常见的中文姓名。
            cname: function() {
              return this.cfirst() + this.clast();
            }
          };
        },
        /* 16 */
        /***/
        function(module2, exports2) {
          module2.exports = {
            /*
            		        随机生成一个 URL。
            
            		        [URL 规范](http://www.w3.org/Addressing/URL/url-spec.txt)
            		            http                    Hypertext Transfer Protocol 
            		            ftp                     File Transfer protocol 
            		            gopher                  The Gopher protocol 
            		            mailto                  Electronic mail address 
            		            mid                     Message identifiers for electronic mail 
            		            cid                     Content identifiers for MIME body part 
            		            news                    Usenet news 
            		            nntp                    Usenet news for local NNTP access only 
            		            prospero                Access using the prospero protocols 
            		            telnet rlogin tn3270    Reference to interactive sessions
            		            wais                    Wide Area Information Servers 
            		    */
            url: function(protocol, host2) {
              return (protocol || this.protocol()) + "://" + // protocol?
              (host2 || this.domain()) + // host?
              "/" + this.word();
            },
            // 随机生成一个 URL 协议。
            protocol: function() {
              return this.pick(
                // 协议簇
                "http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais".split(" ")
              );
            },
            // 随机生成一个域名。
            domain: function(tld) {
              return this.word() + "." + (tld || this.tld());
            },
            /*
                随机生成一个顶级域名。
                国际顶级域名 international top-level domain-names, iTLDs
                国家顶级域名 national top-level domainnames, nTLDs
                [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
            */
            tld: function() {
              return this.pick(
                // 域名后缀
                "com net org edu gov int mil cn com.cn net.cn gov.cn org.cn 中国 中国互联.公司 中国互联.网络 tel biz cc tv info name hk mobi asia cd travel pro museum coop aero ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw".split(" ")
              );
            },
            // 随机生成一个邮件地址。
            email: function(domain) {
              return this.character("lower") + "." + this.word() + "@" + (domain || this.word() + "." + this.tld());
            },
            // 随机生成一个 IP 地址。
            ip: function() {
              return this.natural(0, 255) + "." + this.natural(0, 255) + "." + this.natural(0, 255) + "." + this.natural(0, 255);
            }
          };
        },
        /* 17 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var DICT = __webpack_require__2(18);
          var REGION = ["东北", "华北", "华东", "华中", "华南", "西南", "西北"];
          module2.exports = {
            // 随机生成一个大区。
            region: function() {
              return this.pick(REGION);
            },
            // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
            province: function() {
              return this.pick(DICT).name;
            },
            // 随机生成一个（中国）市。
            city: function(prefix) {
              var province = this.pick(DICT);
              var city = this.pick(province.children);
              return prefix ? [province.name, city.name].join(" ") : city.name;
            },
            // 随机生成一个（中国）县。
            county: function(prefix) {
              var province = this.pick(DICT);
              var city = this.pick(province.children);
              var county = this.pick(city.children) || {
                name: "-"
              };
              return prefix ? [province.name, city.name, county.name].join(" ") : county.name;
            },
            // 随机生成一个邮政编码（六位数字）。
            zip: function(len) {
              var zip = "";
              for (var i2 = 0; i2 < (len || 6); i2++)
                zip += this.natural(0, 9);
              return zip;
            }
            // address: function() {},
            // phone: function() {},
            // areacode: function() {},
            // street: function() {},
            // street_suffixes: function() {},
            // street_suffix: function() {},
            // states: function() {},
            // state: function() {},
          };
        },
        /* 18 */
        /***/
        function(module2, exports2) {
          var DICT = {
            "110000": "北京",
            "110100": "北京市",
            "110101": "东城区",
            "110102": "西城区",
            "110105": "朝阳区",
            "110106": "丰台区",
            "110107": "石景山区",
            "110108": "海淀区",
            "110109": "门头沟区",
            "110111": "房山区",
            "110112": "通州区",
            "110113": "顺义区",
            "110114": "昌平区",
            "110115": "大兴区",
            "110116": "怀柔区",
            "110117": "平谷区",
            "110228": "密云县",
            "110229": "延庆县",
            "110230": "其它区",
            "120000": "天津",
            "120100": "天津市",
            "120101": "和平区",
            "120102": "河东区",
            "120103": "河西区",
            "120104": "南开区",
            "120105": "河北区",
            "120106": "红桥区",
            "120110": "东丽区",
            "120111": "西青区",
            "120112": "津南区",
            "120113": "北辰区",
            "120114": "武清区",
            "120115": "宝坻区",
            "120116": "滨海新区",
            "120221": "宁河县",
            "120223": "静海县",
            "120225": "蓟县",
            "120226": "其它区",
            "130000": "河北省",
            "130100": "石家庄市",
            "130102": "长安区",
            "130103": "桥东区",
            "130104": "桥西区",
            "130105": "新华区",
            "130107": "井陉矿区",
            "130108": "裕华区",
            "130121": "井陉县",
            "130123": "正定县",
            "130124": "栾城县",
            "130125": "行唐县",
            "130126": "灵寿县",
            "130127": "高邑县",
            "130128": "深泽县",
            "130129": "赞皇县",
            "130130": "无极县",
            "130131": "平山县",
            "130132": "元氏县",
            "130133": "赵县",
            "130181": "辛集市",
            "130182": "藁城市",
            "130183": "晋州市",
            "130184": "新乐市",
            "130185": "鹿泉市",
            "130186": "其它区",
            "130200": "唐山市",
            "130202": "路南区",
            "130203": "路北区",
            "130204": "古冶区",
            "130205": "开平区",
            "130207": "丰南区",
            "130208": "丰润区",
            "130223": "滦县",
            "130224": "滦南县",
            "130225": "乐亭县",
            "130227": "迁西县",
            "130229": "玉田县",
            "130230": "曹妃甸区",
            "130281": "遵化市",
            "130283": "迁安市",
            "130284": "其它区",
            "130300": "秦皇岛市",
            "130302": "海港区",
            "130303": "山海关区",
            "130304": "北戴河区",
            "130321": "青龙满族自治县",
            "130322": "昌黎县",
            "130323": "抚宁县",
            "130324": "卢龙县",
            "130398": "其它区",
            "130400": "邯郸市",
            "130402": "邯山区",
            "130403": "丛台区",
            "130404": "复兴区",
            "130406": "峰峰矿区",
            "130421": "邯郸县",
            "130423": "临漳县",
            "130424": "成安县",
            "130425": "大名县",
            "130426": "涉县",
            "130427": "磁县",
            "130428": "肥乡县",
            "130429": "永年县",
            "130430": "邱县",
            "130431": "鸡泽县",
            "130432": "广平县",
            "130433": "馆陶县",
            "130434": "魏县",
            "130435": "曲周县",
            "130481": "武安市",
            "130482": "其它区",
            "130500": "邢台市",
            "130502": "桥东区",
            "130503": "桥西区",
            "130521": "邢台县",
            "130522": "临城县",
            "130523": "内丘县",
            "130524": "柏乡县",
            "130525": "隆尧县",
            "130526": "任县",
            "130527": "南和县",
            "130528": "宁晋县",
            "130529": "巨鹿县",
            "130530": "新河县",
            "130531": "广宗县",
            "130532": "平乡县",
            "130533": "威县",
            "130534": "清河县",
            "130535": "临西县",
            "130581": "南宫市",
            "130582": "沙河市",
            "130583": "其它区",
            "130600": "保定市",
            "130602": "新市区",
            "130603": "北市区",
            "130604": "南市区",
            "130621": "满城县",
            "130622": "清苑县",
            "130623": "涞水县",
            "130624": "阜平县",
            "130625": "徐水县",
            "130626": "定兴县",
            "130627": "唐县",
            "130628": "高阳县",
            "130629": "容城县",
            "130630": "涞源县",
            "130631": "望都县",
            "130632": "安新县",
            "130633": "易县",
            "130634": "曲阳县",
            "130635": "蠡县",
            "130636": "顺平县",
            "130637": "博野县",
            "130638": "雄县",
            "130681": "涿州市",
            "130682": "定州市",
            "130683": "安国市",
            "130684": "高碑店市",
            "130699": "其它区",
            "130700": "张家口市",
            "130702": "桥东区",
            "130703": "桥西区",
            "130705": "宣化区",
            "130706": "下花园区",
            "130721": "宣化县",
            "130722": "张北县",
            "130723": "康保县",
            "130724": "沽源县",
            "130725": "尚义县",
            "130726": "蔚县",
            "130727": "阳原县",
            "130728": "怀安县",
            "130729": "万全县",
            "130730": "怀来县",
            "130731": "涿鹿县",
            "130732": "赤城县",
            "130733": "崇礼县",
            "130734": "其它区",
            "130800": "承德市",
            "130802": "双桥区",
            "130803": "双滦区",
            "130804": "鹰手营子矿区",
            "130821": "承德县",
            "130822": "兴隆县",
            "130823": "平泉县",
            "130824": "滦平县",
            "130825": "隆化县",
            "130826": "丰宁满族自治县",
            "130827": "宽城满族自治县",
            "130828": "围场满族蒙古族自治县",
            "130829": "其它区",
            "130900": "沧州市",
            "130902": "新华区",
            "130903": "运河区",
            "130921": "沧县",
            "130922": "青县",
            "130923": "东光县",
            "130924": "海兴县",
            "130925": "盐山县",
            "130926": "肃宁县",
            "130927": "南皮县",
            "130928": "吴桥县",
            "130929": "献县",
            "130930": "孟村回族自治县",
            "130981": "泊头市",
            "130982": "任丘市",
            "130983": "黄骅市",
            "130984": "河间市",
            "130985": "其它区",
            "131000": "廊坊市",
            "131002": "安次区",
            "131003": "广阳区",
            "131022": "固安县",
            "131023": "永清县",
            "131024": "香河县",
            "131025": "大城县",
            "131026": "文安县",
            "131028": "大厂回族自治县",
            "131081": "霸州市",
            "131082": "三河市",
            "131083": "其它区",
            "131100": "衡水市",
            "131102": "桃城区",
            "131121": "枣强县",
            "131122": "武邑县",
            "131123": "武强县",
            "131124": "饶阳县",
            "131125": "安平县",
            "131126": "故城县",
            "131127": "景县",
            "131128": "阜城县",
            "131181": "冀州市",
            "131182": "深州市",
            "131183": "其它区",
            "140000": "山西省",
            "140100": "太原市",
            "140105": "小店区",
            "140106": "迎泽区",
            "140107": "杏花岭区",
            "140108": "尖草坪区",
            "140109": "万柏林区",
            "140110": "晋源区",
            "140121": "清徐县",
            "140122": "阳曲县",
            "140123": "娄烦县",
            "140181": "古交市",
            "140182": "其它区",
            "140200": "大同市",
            "140202": "城区",
            "140203": "矿区",
            "140211": "南郊区",
            "140212": "新荣区",
            "140221": "阳高县",
            "140222": "天镇县",
            "140223": "广灵县",
            "140224": "灵丘县",
            "140225": "浑源县",
            "140226": "左云县",
            "140227": "大同县",
            "140228": "其它区",
            "140300": "阳泉市",
            "140302": "城区",
            "140303": "矿区",
            "140311": "郊区",
            "140321": "平定县",
            "140322": "盂县",
            "140323": "其它区",
            "140400": "长治市",
            "140421": "长治县",
            "140423": "襄垣县",
            "140424": "屯留县",
            "140425": "平顺县",
            "140426": "黎城县",
            "140427": "壶关县",
            "140428": "长子县",
            "140429": "武乡县",
            "140430": "沁县",
            "140431": "沁源县",
            "140481": "潞城市",
            "140482": "城区",
            "140483": "郊区",
            "140485": "其它区",
            "140500": "晋城市",
            "140502": "城区",
            "140521": "沁水县",
            "140522": "阳城县",
            "140524": "陵川县",
            "140525": "泽州县",
            "140581": "高平市",
            "140582": "其它区",
            "140600": "朔州市",
            "140602": "朔城区",
            "140603": "平鲁区",
            "140621": "山阴县",
            "140622": "应县",
            "140623": "右玉县",
            "140624": "怀仁县",
            "140625": "其它区",
            "140700": "晋中市",
            "140702": "榆次区",
            "140721": "榆社县",
            "140722": "左权县",
            "140723": "和顺县",
            "140724": "昔阳县",
            "140725": "寿阳县",
            "140726": "太谷县",
            "140727": "祁县",
            "140728": "平遥县",
            "140729": "灵石县",
            "140781": "介休市",
            "140782": "其它区",
            "140800": "运城市",
            "140802": "盐湖区",
            "140821": "临猗县",
            "140822": "万荣县",
            "140823": "闻喜县",
            "140824": "稷山县",
            "140825": "新绛县",
            "140826": "绛县",
            "140827": "垣曲县",
            "140828": "夏县",
            "140829": "平陆县",
            "140830": "芮城县",
            "140881": "永济市",
            "140882": "河津市",
            "140883": "其它区",
            "140900": "忻州市",
            "140902": "忻府区",
            "140921": "定襄县",
            "140922": "五台县",
            "140923": "代县",
            "140924": "繁峙县",
            "140925": "宁武县",
            "140926": "静乐县",
            "140927": "神池县",
            "140928": "五寨县",
            "140929": "岢岚县",
            "140930": "河曲县",
            "140931": "保德县",
            "140932": "偏关县",
            "140981": "原平市",
            "140982": "其它区",
            "141000": "临汾市",
            "141002": "尧都区",
            "141021": "曲沃县",
            "141022": "翼城县",
            "141023": "襄汾县",
            "141024": "洪洞县",
            "141025": "古县",
            "141026": "安泽县",
            "141027": "浮山县",
            "141028": "吉县",
            "141029": "乡宁县",
            "141030": "大宁县",
            "141031": "隰县",
            "141032": "永和县",
            "141033": "蒲县",
            "141034": "汾西县",
            "141081": "侯马市",
            "141082": "霍州市",
            "141083": "其它区",
            "141100": "吕梁市",
            "141102": "离石区",
            "141121": "文水县",
            "141122": "交城县",
            "141123": "兴县",
            "141124": "临县",
            "141125": "柳林县",
            "141126": "石楼县",
            "141127": "岚县",
            "141128": "方山县",
            "141129": "中阳县",
            "141130": "交口县",
            "141181": "孝义市",
            "141182": "汾阳市",
            "141183": "其它区",
            "150000": "内蒙古自治区",
            "150100": "呼和浩特市",
            "150102": "新城区",
            "150103": "回民区",
            "150104": "玉泉区",
            "150105": "赛罕区",
            "150121": "土默特左旗",
            "150122": "托克托县",
            "150123": "和林格尔县",
            "150124": "清水河县",
            "150125": "武川县",
            "150126": "其它区",
            "150200": "包头市",
            "150202": "东河区",
            "150203": "昆都仑区",
            "150204": "青山区",
            "150205": "石拐区",
            "150206": "白云鄂博矿区",
            "150207": "九原区",
            "150221": "土默特右旗",
            "150222": "固阳县",
            "150223": "达尔罕茂明安联合旗",
            "150224": "其它区",
            "150300": "乌海市",
            "150302": "海勃湾区",
            "150303": "海南区",
            "150304": "乌达区",
            "150305": "其它区",
            "150400": "赤峰市",
            "150402": "红山区",
            "150403": "元宝山区",
            "150404": "松山区",
            "150421": "阿鲁科尔沁旗",
            "150422": "巴林左旗",
            "150423": "巴林右旗",
            "150424": "林西县",
            "150425": "克什克腾旗",
            "150426": "翁牛特旗",
            "150428": "喀喇沁旗",
            "150429": "宁城县",
            "150430": "敖汉旗",
            "150431": "其它区",
            "150500": "通辽市",
            "150502": "科尔沁区",
            "150521": "科尔沁左翼中旗",
            "150522": "科尔沁左翼后旗",
            "150523": "开鲁县",
            "150524": "库伦旗",
            "150525": "奈曼旗",
            "150526": "扎鲁特旗",
            "150581": "霍林郭勒市",
            "150582": "其它区",
            "150600": "鄂尔多斯市",
            "150602": "东胜区",
            "150621": "达拉特旗",
            "150622": "准格尔旗",
            "150623": "鄂托克前旗",
            "150624": "鄂托克旗",
            "150625": "杭锦旗",
            "150626": "乌审旗",
            "150627": "伊金霍洛旗",
            "150628": "其它区",
            "150700": "呼伦贝尔市",
            "150702": "海拉尔区",
            "150703": "扎赉诺尔区",
            "150721": "阿荣旗",
            "150722": "莫力达瓦达斡尔族自治旗",
            "150723": "鄂伦春自治旗",
            "150724": "鄂温克族自治旗",
            "150725": "陈巴尔虎旗",
            "150726": "新巴尔虎左旗",
            "150727": "新巴尔虎右旗",
            "150781": "满洲里市",
            "150782": "牙克石市",
            "150783": "扎兰屯市",
            "150784": "额尔古纳市",
            "150785": "根河市",
            "150786": "其它区",
            "150800": "巴彦淖尔市",
            "150802": "临河区",
            "150821": "五原县",
            "150822": "磴口县",
            "150823": "乌拉特前旗",
            "150824": "乌拉特中旗",
            "150825": "乌拉特后旗",
            "150826": "杭锦后旗",
            "150827": "其它区",
            "150900": "乌兰察布市",
            "150902": "集宁区",
            "150921": "卓资县",
            "150922": "化德县",
            "150923": "商都县",
            "150924": "兴和县",
            "150925": "凉城县",
            "150926": "察哈尔右翼前旗",
            "150927": "察哈尔右翼中旗",
            "150928": "察哈尔右翼后旗",
            "150929": "四子王旗",
            "150981": "丰镇市",
            "150982": "其它区",
            "152200": "兴安盟",
            "152201": "乌兰浩特市",
            "152202": "阿尔山市",
            "152221": "科尔沁右翼前旗",
            "152222": "科尔沁右翼中旗",
            "152223": "扎赉特旗",
            "152224": "突泉县",
            "152225": "其它区",
            "152500": "锡林郭勒盟",
            "152501": "二连浩特市",
            "152502": "锡林浩特市",
            "152522": "阿巴嘎旗",
            "152523": "苏尼特左旗",
            "152524": "苏尼特右旗",
            "152525": "东乌珠穆沁旗",
            "152526": "西乌珠穆沁旗",
            "152527": "太仆寺旗",
            "152528": "镶黄旗",
            "152529": "正镶白旗",
            "152530": "正蓝旗",
            "152531": "多伦县",
            "152532": "其它区",
            "152900": "阿拉善盟",
            "152921": "阿拉善左旗",
            "152922": "阿拉善右旗",
            "152923": "额济纳旗",
            "152924": "其它区",
            "210000": "辽宁省",
            "210100": "沈阳市",
            "210102": "和平区",
            "210103": "沈河区",
            "210104": "大东区",
            "210105": "皇姑区",
            "210106": "铁西区",
            "210111": "苏家屯区",
            "210112": "东陵区",
            "210113": "新城子区",
            "210114": "于洪区",
            "210122": "辽中县",
            "210123": "康平县",
            "210124": "法库县",
            "210181": "新民市",
            "210184": "沈北新区",
            "210185": "其它区",
            "210200": "大连市",
            "210202": "中山区",
            "210203": "西岗区",
            "210204": "沙河口区",
            "210211": "甘井子区",
            "210212": "旅顺口区",
            "210213": "金州区",
            "210224": "长海县",
            "210281": "瓦房店市",
            "210282": "普兰店市",
            "210283": "庄河市",
            "210298": "其它区",
            "210300": "鞍山市",
            "210302": "铁东区",
            "210303": "铁西区",
            "210304": "立山区",
            "210311": "千山区",
            "210321": "台安县",
            "210323": "岫岩满族自治县",
            "210381": "海城市",
            "210382": "其它区",
            "210400": "抚顺市",
            "210402": "新抚区",
            "210403": "东洲区",
            "210404": "望花区",
            "210411": "顺城区",
            "210421": "抚顺县",
            "210422": "新宾满族自治县",
            "210423": "清原满族自治县",
            "210424": "其它区",
            "210500": "本溪市",
            "210502": "平山区",
            "210503": "溪湖区",
            "210504": "明山区",
            "210505": "南芬区",
            "210521": "本溪满族自治县",
            "210522": "桓仁满族自治县",
            "210523": "其它区",
            "210600": "丹东市",
            "210602": "元宝区",
            "210603": "振兴区",
            "210604": "振安区",
            "210624": "宽甸满族自治县",
            "210681": "东港市",
            "210682": "凤城市",
            "210683": "其它区",
            "210700": "锦州市",
            "210702": "古塔区",
            "210703": "凌河区",
            "210711": "太和区",
            "210726": "黑山县",
            "210727": "义县",
            "210781": "凌海市",
            "210782": "北镇市",
            "210783": "其它区",
            "210800": "营口市",
            "210802": "站前区",
            "210803": "西市区",
            "210804": "鲅鱼圈区",
            "210811": "老边区",
            "210881": "盖州市",
            "210882": "大石桥市",
            "210883": "其它区",
            "210900": "阜新市",
            "210902": "海州区",
            "210903": "新邱区",
            "210904": "太平区",
            "210905": "清河门区",
            "210911": "细河区",
            "210921": "阜新蒙古族自治县",
            "210922": "彰武县",
            "210923": "其它区",
            "211000": "辽阳市",
            "211002": "白塔区",
            "211003": "文圣区",
            "211004": "宏伟区",
            "211005": "弓长岭区",
            "211011": "太子河区",
            "211021": "辽阳县",
            "211081": "灯塔市",
            "211082": "其它区",
            "211100": "盘锦市",
            "211102": "双台子区",
            "211103": "兴隆台区",
            "211121": "大洼县",
            "211122": "盘山县",
            "211123": "其它区",
            "211200": "铁岭市",
            "211202": "银州区",
            "211204": "清河区",
            "211221": "铁岭县",
            "211223": "西丰县",
            "211224": "昌图县",
            "211281": "调兵山市",
            "211282": "开原市",
            "211283": "其它区",
            "211300": "朝阳市",
            "211302": "双塔区",
            "211303": "龙城区",
            "211321": "朝阳县",
            "211322": "建平县",
            "211324": "喀喇沁左翼蒙古族自治县",
            "211381": "北票市",
            "211382": "凌源市",
            "211383": "其它区",
            "211400": "葫芦岛市",
            "211402": "连山区",
            "211403": "龙港区",
            "211404": "南票区",
            "211421": "绥中县",
            "211422": "建昌县",
            "211481": "兴城市",
            "211482": "其它区",
            "220000": "吉林省",
            "220100": "长春市",
            "220102": "南关区",
            "220103": "宽城区",
            "220104": "朝阳区",
            "220105": "二道区",
            "220106": "绿园区",
            "220112": "双阳区",
            "220122": "农安县",
            "220181": "九台市",
            "220182": "榆树市",
            "220183": "德惠市",
            "220188": "其它区",
            "220200": "吉林市",
            "220202": "昌邑区",
            "220203": "龙潭区",
            "220204": "船营区",
            "220211": "丰满区",
            "220221": "永吉县",
            "220281": "蛟河市",
            "220282": "桦甸市",
            "220283": "舒兰市",
            "220284": "磐石市",
            "220285": "其它区",
            "220300": "四平市",
            "220302": "铁西区",
            "220303": "铁东区",
            "220322": "梨树县",
            "220323": "伊通满族自治县",
            "220381": "公主岭市",
            "220382": "双辽市",
            "220383": "其它区",
            "220400": "辽源市",
            "220402": "龙山区",
            "220403": "西安区",
            "220421": "东丰县",
            "220422": "东辽县",
            "220423": "其它区",
            "220500": "通化市",
            "220502": "东昌区",
            "220503": "二道江区",
            "220521": "通化县",
            "220523": "辉南县",
            "220524": "柳河县",
            "220581": "梅河口市",
            "220582": "集安市",
            "220583": "其它区",
            "220600": "白山市",
            "220602": "浑江区",
            "220621": "抚松县",
            "220622": "靖宇县",
            "220623": "长白朝鲜族自治县",
            "220625": "江源区",
            "220681": "临江市",
            "220682": "其它区",
            "220700": "松原市",
            "220702": "宁江区",
            "220721": "前郭尔罗斯蒙古族自治县",
            "220722": "长岭县",
            "220723": "乾安县",
            "220724": "扶余市",
            "220725": "其它区",
            "220800": "白城市",
            "220802": "洮北区",
            "220821": "镇赉县",
            "220822": "通榆县",
            "220881": "洮南市",
            "220882": "大安市",
            "220883": "其它区",
            "222400": "延边朝鲜族自治州",
            "222401": "延吉市",
            "222402": "图们市",
            "222403": "敦化市",
            "222404": "珲春市",
            "222405": "龙井市",
            "222406": "和龙市",
            "222424": "汪清县",
            "222426": "安图县",
            "222427": "其它区",
            "230000": "黑龙江省",
            "230100": "哈尔滨市",
            "230102": "道里区",
            "230103": "南岗区",
            "230104": "道外区",
            "230106": "香坊区",
            "230108": "平房区",
            "230109": "松北区",
            "230111": "呼兰区",
            "230123": "依兰县",
            "230124": "方正县",
            "230125": "宾县",
            "230126": "巴彦县",
            "230127": "木兰县",
            "230128": "通河县",
            "230129": "延寿县",
            "230181": "阿城区",
            "230182": "双城市",
            "230183": "尚志市",
            "230184": "五常市",
            "230186": "其它区",
            "230200": "齐齐哈尔市",
            "230202": "龙沙区",
            "230203": "建华区",
            "230204": "铁锋区",
            "230205": "昂昂溪区",
            "230206": "富拉尔基区",
            "230207": "碾子山区",
            "230208": "梅里斯达斡尔族区",
            "230221": "龙江县",
            "230223": "依安县",
            "230224": "泰来县",
            "230225": "甘南县",
            "230227": "富裕县",
            "230229": "克山县",
            "230230": "克东县",
            "230231": "拜泉县",
            "230281": "讷河市",
            "230282": "其它区",
            "230300": "鸡西市",
            "230302": "鸡冠区",
            "230303": "恒山区",
            "230304": "滴道区",
            "230305": "梨树区",
            "230306": "城子河区",
            "230307": "麻山区",
            "230321": "鸡东县",
            "230381": "虎林市",
            "230382": "密山市",
            "230383": "其它区",
            "230400": "鹤岗市",
            "230402": "向阳区",
            "230403": "工农区",
            "230404": "南山区",
            "230405": "兴安区",
            "230406": "东山区",
            "230407": "兴山区",
            "230421": "萝北县",
            "230422": "绥滨县",
            "230423": "其它区",
            "230500": "双鸭山市",
            "230502": "尖山区",
            "230503": "岭东区",
            "230505": "四方台区",
            "230506": "宝山区",
            "230521": "集贤县",
            "230522": "友谊县",
            "230523": "宝清县",
            "230524": "饶河县",
            "230525": "其它区",
            "230600": "大庆市",
            "230602": "萨尔图区",
            "230603": "龙凤区",
            "230604": "让胡路区",
            "230605": "红岗区",
            "230606": "大同区",
            "230621": "肇州县",
            "230622": "肇源县",
            "230623": "林甸县",
            "230624": "杜尔伯特蒙古族自治县",
            "230625": "其它区",
            "230700": "伊春市",
            "230702": "伊春区",
            "230703": "南岔区",
            "230704": "友好区",
            "230705": "西林区",
            "230706": "翠峦区",
            "230707": "新青区",
            "230708": "美溪区",
            "230709": "金山屯区",
            "230710": "五营区",
            "230711": "乌马河区",
            "230712": "汤旺河区",
            "230713": "带岭区",
            "230714": "乌伊岭区",
            "230715": "红星区",
            "230716": "上甘岭区",
            "230722": "嘉荫县",
            "230781": "铁力市",
            "230782": "其它区",
            "230800": "佳木斯市",
            "230803": "向阳区",
            "230804": "前进区",
            "230805": "东风区",
            "230811": "郊区",
            "230822": "桦南县",
            "230826": "桦川县",
            "230828": "汤原县",
            "230833": "抚远县",
            "230881": "同江市",
            "230882": "富锦市",
            "230883": "其它区",
            "230900": "七台河市",
            "230902": "新兴区",
            "230903": "桃山区",
            "230904": "茄子河区",
            "230921": "勃利县",
            "230922": "其它区",
            "231000": "牡丹江市",
            "231002": "东安区",
            "231003": "阳明区",
            "231004": "爱民区",
            "231005": "西安区",
            "231024": "东宁县",
            "231025": "林口县",
            "231081": "绥芬河市",
            "231083": "海林市",
            "231084": "宁安市",
            "231085": "穆棱市",
            "231086": "其它区",
            "231100": "黑河市",
            "231102": "爱辉区",
            "231121": "嫩江县",
            "231123": "逊克县",
            "231124": "孙吴县",
            "231181": "北安市",
            "231182": "五大连池市",
            "231183": "其它区",
            "231200": "绥化市",
            "231202": "北林区",
            "231221": "望奎县",
            "231222": "兰西县",
            "231223": "青冈县",
            "231224": "庆安县",
            "231225": "明水县",
            "231226": "绥棱县",
            "231281": "安达市",
            "231282": "肇东市",
            "231283": "海伦市",
            "231284": "其它区",
            "232700": "大兴安岭地区",
            "232702": "松岭区",
            "232703": "新林区",
            "232704": "呼中区",
            "232721": "呼玛县",
            "232722": "塔河县",
            "232723": "漠河县",
            "232724": "加格达奇区",
            "232725": "其它区",
            "310000": "上海",
            "310100": "上海市",
            "310101": "黄浦区",
            "310104": "徐汇区",
            "310105": "长宁区",
            "310106": "静安区",
            "310107": "普陀区",
            "310108": "闸北区",
            "310109": "虹口区",
            "310110": "杨浦区",
            "310112": "闵行区",
            "310113": "宝山区",
            "310114": "嘉定区",
            "310115": "浦东新区",
            "310116": "金山区",
            "310117": "松江区",
            "310118": "青浦区",
            "310120": "奉贤区",
            "310230": "崇明县",
            "310231": "其它区",
            "320000": "江苏省",
            "320100": "南京市",
            "320102": "玄武区",
            "320104": "秦淮区",
            "320105": "建邺区",
            "320106": "鼓楼区",
            "320111": "浦口区",
            "320113": "栖霞区",
            "320114": "雨花台区",
            "320115": "江宁区",
            "320116": "六合区",
            "320124": "溧水区",
            "320125": "高淳区",
            "320126": "其它区",
            "320200": "无锡市",
            "320202": "崇安区",
            "320203": "南长区",
            "320204": "北塘区",
            "320205": "锡山区",
            "320206": "惠山区",
            "320211": "滨湖区",
            "320281": "江阴市",
            "320282": "宜兴市",
            "320297": "其它区",
            "320300": "徐州市",
            "320302": "鼓楼区",
            "320303": "云龙区",
            "320305": "贾汪区",
            "320311": "泉山区",
            "320321": "丰县",
            "320322": "沛县",
            "320323": "铜山区",
            "320324": "睢宁县",
            "320381": "新沂市",
            "320382": "邳州市",
            "320383": "其它区",
            "320400": "常州市",
            "320402": "天宁区",
            "320404": "钟楼区",
            "320405": "戚墅堰区",
            "320411": "新北区",
            "320412": "武进区",
            "320481": "溧阳市",
            "320482": "金坛市",
            "320483": "其它区",
            "320500": "苏州市",
            "320505": "虎丘区",
            "320506": "吴中区",
            "320507": "相城区",
            "320508": "姑苏区",
            "320581": "常熟市",
            "320582": "张家港市",
            "320583": "昆山市",
            "320584": "吴江区",
            "320585": "太仓市",
            "320596": "其它区",
            "320600": "南通市",
            "320602": "崇川区",
            "320611": "港闸区",
            "320612": "通州区",
            "320621": "海安县",
            "320623": "如东县",
            "320681": "启东市",
            "320682": "如皋市",
            "320684": "海门市",
            "320694": "其它区",
            "320700": "连云港市",
            "320703": "连云区",
            "320705": "新浦区",
            "320706": "海州区",
            "320721": "赣榆县",
            "320722": "东海县",
            "320723": "灌云县",
            "320724": "灌南县",
            "320725": "其它区",
            "320800": "淮安市",
            "320802": "清河区",
            "320803": "淮安区",
            "320804": "淮阴区",
            "320811": "清浦区",
            "320826": "涟水县",
            "320829": "洪泽县",
            "320830": "盱眙县",
            "320831": "金湖县",
            "320832": "其它区",
            "320900": "盐城市",
            "320902": "亭湖区",
            "320903": "盐都区",
            "320921": "响水县",
            "320922": "滨海县",
            "320923": "阜宁县",
            "320924": "射阳县",
            "320925": "建湖县",
            "320981": "东台市",
            "320982": "大丰市",
            "320983": "其它区",
            "321000": "扬州市",
            "321002": "广陵区",
            "321003": "邗江区",
            "321023": "宝应县",
            "321081": "仪征市",
            "321084": "高邮市",
            "321088": "江都区",
            "321093": "其它区",
            "321100": "镇江市",
            "321102": "京口区",
            "321111": "润州区",
            "321112": "丹徒区",
            "321181": "丹阳市",
            "321182": "扬中市",
            "321183": "句容市",
            "321184": "其它区",
            "321200": "泰州市",
            "321202": "海陵区",
            "321203": "高港区",
            "321281": "兴化市",
            "321282": "靖江市",
            "321283": "泰兴市",
            "321284": "姜堰区",
            "321285": "其它区",
            "321300": "宿迁市",
            "321302": "宿城区",
            "321311": "宿豫区",
            "321322": "沭阳县",
            "321323": "泗阳县",
            "321324": "泗洪县",
            "321325": "其它区",
            "330000": "浙江省",
            "330100": "杭州市",
            "330102": "上城区",
            "330103": "下城区",
            "330104": "江干区",
            "330105": "拱墅区",
            "330106": "西湖区",
            "330108": "滨江区",
            "330109": "萧山区",
            "330110": "余杭区",
            "330122": "桐庐县",
            "330127": "淳安县",
            "330182": "建德市",
            "330183": "富阳市",
            "330185": "临安市",
            "330186": "其它区",
            "330200": "宁波市",
            "330203": "海曙区",
            "330204": "江东区",
            "330205": "江北区",
            "330206": "北仑区",
            "330211": "镇海区",
            "330212": "鄞州区",
            "330225": "象山县",
            "330226": "宁海县",
            "330281": "余姚市",
            "330282": "慈溪市",
            "330283": "奉化市",
            "330284": "其它区",
            "330300": "温州市",
            "330302": "鹿城区",
            "330303": "龙湾区",
            "330304": "瓯海区",
            "330322": "洞头县",
            "330324": "永嘉县",
            "330326": "平阳县",
            "330327": "苍南县",
            "330328": "文成县",
            "330329": "泰顺县",
            "330381": "瑞安市",
            "330382": "乐清市",
            "330383": "其它区",
            "330400": "嘉兴市",
            "330402": "南湖区",
            "330411": "秀洲区",
            "330421": "嘉善县",
            "330424": "海盐县",
            "330481": "海宁市",
            "330482": "平湖市",
            "330483": "桐乡市",
            "330484": "其它区",
            "330500": "湖州市",
            "330502": "吴兴区",
            "330503": "南浔区",
            "330521": "德清县",
            "330522": "长兴县",
            "330523": "安吉县",
            "330524": "其它区",
            "330600": "绍兴市",
            "330602": "越城区",
            "330621": "绍兴县",
            "330624": "新昌县",
            "330681": "诸暨市",
            "330682": "上虞市",
            "330683": "嵊州市",
            "330684": "其它区",
            "330700": "金华市",
            "330702": "婺城区",
            "330703": "金东区",
            "330723": "武义县",
            "330726": "浦江县",
            "330727": "磐安县",
            "330781": "兰溪市",
            "330782": "义乌市",
            "330783": "东阳市",
            "330784": "永康市",
            "330785": "其它区",
            "330800": "衢州市",
            "330802": "柯城区",
            "330803": "衢江区",
            "330822": "常山县",
            "330824": "开化县",
            "330825": "龙游县",
            "330881": "江山市",
            "330882": "其它区",
            "330900": "舟山市",
            "330902": "定海区",
            "330903": "普陀区",
            "330921": "岱山县",
            "330922": "嵊泗县",
            "330923": "其它区",
            "331000": "台州市",
            "331002": "椒江区",
            "331003": "黄岩区",
            "331004": "路桥区",
            "331021": "玉环县",
            "331022": "三门县",
            "331023": "天台县",
            "331024": "仙居县",
            "331081": "温岭市",
            "331082": "临海市",
            "331083": "其它区",
            "331100": "丽水市",
            "331102": "莲都区",
            "331121": "青田县",
            "331122": "缙云县",
            "331123": "遂昌县",
            "331124": "松阳县",
            "331125": "云和县",
            "331126": "庆元县",
            "331127": "景宁畲族自治县",
            "331181": "龙泉市",
            "331182": "其它区",
            "340000": "安徽省",
            "340100": "合肥市",
            "340102": "瑶海区",
            "340103": "庐阳区",
            "340104": "蜀山区",
            "340111": "包河区",
            "340121": "长丰县",
            "340122": "肥东县",
            "340123": "肥西县",
            "340192": "其它区",
            "340200": "芜湖市",
            "340202": "镜湖区",
            "340203": "弋江区",
            "340207": "鸠江区",
            "340208": "三山区",
            "340221": "芜湖县",
            "340222": "繁昌县",
            "340223": "南陵县",
            "340224": "其它区",
            "340300": "蚌埠市",
            "340302": "龙子湖区",
            "340303": "蚌山区",
            "340304": "禹会区",
            "340311": "淮上区",
            "340321": "怀远县",
            "340322": "五河县",
            "340323": "固镇县",
            "340324": "其它区",
            "340400": "淮南市",
            "340402": "大通区",
            "340403": "田家庵区",
            "340404": "谢家集区",
            "340405": "八公山区",
            "340406": "潘集区",
            "340421": "凤台县",
            "340422": "其它区",
            "340500": "马鞍山市",
            "340503": "花山区",
            "340504": "雨山区",
            "340506": "博望区",
            "340521": "当涂县",
            "340522": "其它区",
            "340600": "淮北市",
            "340602": "杜集区",
            "340603": "相山区",
            "340604": "烈山区",
            "340621": "濉溪县",
            "340622": "其它区",
            "340700": "铜陵市",
            "340702": "铜官山区",
            "340703": "狮子山区",
            "340711": "郊区",
            "340721": "铜陵县",
            "340722": "其它区",
            "340800": "安庆市",
            "340802": "迎江区",
            "340803": "大观区",
            "340811": "宜秀区",
            "340822": "怀宁县",
            "340823": "枞阳县",
            "340824": "潜山县",
            "340825": "太湖县",
            "340826": "宿松县",
            "340827": "望江县",
            "340828": "岳西县",
            "340881": "桐城市",
            "340882": "其它区",
            "341000": "黄山市",
            "341002": "屯溪区",
            "341003": "黄山区",
            "341004": "徽州区",
            "341021": "歙县",
            "341022": "休宁县",
            "341023": "黟县",
            "341024": "祁门县",
            "341025": "其它区",
            "341100": "滁州市",
            "341102": "琅琊区",
            "341103": "南谯区",
            "341122": "来安县",
            "341124": "全椒县",
            "341125": "定远县",
            "341126": "凤阳县",
            "341181": "天长市",
            "341182": "明光市",
            "341183": "其它区",
            "341200": "阜阳市",
            "341202": "颍州区",
            "341203": "颍东区",
            "341204": "颍泉区",
            "341221": "临泉县",
            "341222": "太和县",
            "341225": "阜南县",
            "341226": "颍上县",
            "341282": "界首市",
            "341283": "其它区",
            "341300": "宿州市",
            "341302": "埇桥区",
            "341321": "砀山县",
            "341322": "萧县",
            "341323": "灵璧县",
            "341324": "泗县",
            "341325": "其它区",
            "341400": "巢湖市",
            "341421": "庐江县",
            "341422": "无为县",
            "341423": "含山县",
            "341424": "和县",
            "341500": "六安市",
            "341502": "金安区",
            "341503": "裕安区",
            "341521": "寿县",
            "341522": "霍邱县",
            "341523": "舒城县",
            "341524": "金寨县",
            "341525": "霍山县",
            "341526": "其它区",
            "341600": "亳州市",
            "341602": "谯城区",
            "341621": "涡阳县",
            "341622": "蒙城县",
            "341623": "利辛县",
            "341624": "其它区",
            "341700": "池州市",
            "341702": "贵池区",
            "341721": "东至县",
            "341722": "石台县",
            "341723": "青阳县",
            "341724": "其它区",
            "341800": "宣城市",
            "341802": "宣州区",
            "341821": "郎溪县",
            "341822": "广德县",
            "341823": "泾县",
            "341824": "绩溪县",
            "341825": "旌德县",
            "341881": "宁国市",
            "341882": "其它区",
            "350000": "福建省",
            "350100": "福州市",
            "350102": "鼓楼区",
            "350103": "台江区",
            "350104": "仓山区",
            "350105": "马尾区",
            "350111": "晋安区",
            "350121": "闽侯县",
            "350122": "连江县",
            "350123": "罗源县",
            "350124": "闽清县",
            "350125": "永泰县",
            "350128": "平潭县",
            "350181": "福清市",
            "350182": "长乐市",
            "350183": "其它区",
            "350200": "厦门市",
            "350203": "思明区",
            "350205": "海沧区",
            "350206": "湖里区",
            "350211": "集美区",
            "350212": "同安区",
            "350213": "翔安区",
            "350214": "其它区",
            "350300": "莆田市",
            "350302": "城厢区",
            "350303": "涵江区",
            "350304": "荔城区",
            "350305": "秀屿区",
            "350322": "仙游县",
            "350323": "其它区",
            "350400": "三明市",
            "350402": "梅列区",
            "350403": "三元区",
            "350421": "明溪县",
            "350423": "清流县",
            "350424": "宁化县",
            "350425": "大田县",
            "350426": "尤溪县",
            "350427": "沙县",
            "350428": "将乐县",
            "350429": "泰宁县",
            "350430": "建宁县",
            "350481": "永安市",
            "350482": "其它区",
            "350500": "泉州市",
            "350502": "鲤城区",
            "350503": "丰泽区",
            "350504": "洛江区",
            "350505": "泉港区",
            "350521": "惠安县",
            "350524": "安溪县",
            "350525": "永春县",
            "350526": "德化县",
            "350527": "金门县",
            "350581": "石狮市",
            "350582": "晋江市",
            "350583": "南安市",
            "350584": "其它区",
            "350600": "漳州市",
            "350602": "芗城区",
            "350603": "龙文区",
            "350622": "云霄县",
            "350623": "漳浦县",
            "350624": "诏安县",
            "350625": "长泰县",
            "350626": "东山县",
            "350627": "南靖县",
            "350628": "平和县",
            "350629": "华安县",
            "350681": "龙海市",
            "350682": "其它区",
            "350700": "南平市",
            "350702": "延平区",
            "350721": "顺昌县",
            "350722": "浦城县",
            "350723": "光泽县",
            "350724": "松溪县",
            "350725": "政和县",
            "350781": "邵武市",
            "350782": "武夷山市",
            "350783": "建瓯市",
            "350784": "建阳市",
            "350785": "其它区",
            "350800": "龙岩市",
            "350802": "新罗区",
            "350821": "长汀县",
            "350822": "永定县",
            "350823": "上杭县",
            "350824": "武平县",
            "350825": "连城县",
            "350881": "漳平市",
            "350882": "其它区",
            "350900": "宁德市",
            "350902": "蕉城区",
            "350921": "霞浦县",
            "350922": "古田县",
            "350923": "屏南县",
            "350924": "寿宁县",
            "350925": "周宁县",
            "350926": "柘荣县",
            "350981": "福安市",
            "350982": "福鼎市",
            "350983": "其它区",
            "360000": "江西省",
            "360100": "南昌市",
            "360102": "东湖区",
            "360103": "西湖区",
            "360104": "青云谱区",
            "360105": "湾里区",
            "360111": "青山湖区",
            "360121": "南昌县",
            "360122": "新建县",
            "360123": "安义县",
            "360124": "进贤县",
            "360128": "其它区",
            "360200": "景德镇市",
            "360202": "昌江区",
            "360203": "珠山区",
            "360222": "浮梁县",
            "360281": "乐平市",
            "360282": "其它区",
            "360300": "萍乡市",
            "360302": "安源区",
            "360313": "湘东区",
            "360321": "莲花县",
            "360322": "上栗县",
            "360323": "芦溪县",
            "360324": "其它区",
            "360400": "九江市",
            "360402": "庐山区",
            "360403": "浔阳区",
            "360421": "九江县",
            "360423": "武宁县",
            "360424": "修水县",
            "360425": "永修县",
            "360426": "德安县",
            "360427": "星子县",
            "360428": "都昌县",
            "360429": "湖口县",
            "360430": "彭泽县",
            "360481": "瑞昌市",
            "360482": "其它区",
            "360483": "共青城市",
            "360500": "新余市",
            "360502": "渝水区",
            "360521": "分宜县",
            "360522": "其它区",
            "360600": "鹰潭市",
            "360602": "月湖区",
            "360622": "余江县",
            "360681": "贵溪市",
            "360682": "其它区",
            "360700": "赣州市",
            "360702": "章贡区",
            "360721": "赣县",
            "360722": "信丰县",
            "360723": "大余县",
            "360724": "上犹县",
            "360725": "崇义县",
            "360726": "安远县",
            "360727": "龙南县",
            "360728": "定南县",
            "360729": "全南县",
            "360730": "宁都县",
            "360731": "于都县",
            "360732": "兴国县",
            "360733": "会昌县",
            "360734": "寻乌县",
            "360735": "石城县",
            "360781": "瑞金市",
            "360782": "南康市",
            "360783": "其它区",
            "360800": "吉安市",
            "360802": "吉州区",
            "360803": "青原区",
            "360821": "吉安县",
            "360822": "吉水县",
            "360823": "峡江县",
            "360824": "新干县",
            "360825": "永丰县",
            "360826": "泰和县",
            "360827": "遂川县",
            "360828": "万安县",
            "360829": "安福县",
            "360830": "永新县",
            "360881": "井冈山市",
            "360882": "其它区",
            "360900": "宜春市",
            "360902": "袁州区",
            "360921": "奉新县",
            "360922": "万载县",
            "360923": "上高县",
            "360924": "宜丰县",
            "360925": "靖安县",
            "360926": "铜鼓县",
            "360981": "丰城市",
            "360982": "樟树市",
            "360983": "高安市",
            "360984": "其它区",
            "361000": "抚州市",
            "361002": "临川区",
            "361021": "南城县",
            "361022": "黎川县",
            "361023": "南丰县",
            "361024": "崇仁县",
            "361025": "乐安县",
            "361026": "宜黄县",
            "361027": "金溪县",
            "361028": "资溪县",
            "361029": "东乡县",
            "361030": "广昌县",
            "361031": "其它区",
            "361100": "上饶市",
            "361102": "信州区",
            "361121": "上饶县",
            "361122": "广丰县",
            "361123": "玉山县",
            "361124": "铅山县",
            "361125": "横峰县",
            "361126": "弋阳县",
            "361127": "余干县",
            "361128": "鄱阳县",
            "361129": "万年县",
            "361130": "婺源县",
            "361181": "德兴市",
            "361182": "其它区",
            "370000": "山东省",
            "370100": "济南市",
            "370102": "历下区",
            "370103": "市中区",
            "370104": "槐荫区",
            "370105": "天桥区",
            "370112": "历城区",
            "370113": "长清区",
            "370124": "平阴县",
            "370125": "济阳县",
            "370126": "商河县",
            "370181": "章丘市",
            "370182": "其它区",
            "370200": "青岛市",
            "370202": "市南区",
            "370203": "市北区",
            "370211": "黄岛区",
            "370212": "崂山区",
            "370213": "李沧区",
            "370214": "城阳区",
            "370281": "胶州市",
            "370282": "即墨市",
            "370283": "平度市",
            "370285": "莱西市",
            "370286": "其它区",
            "370300": "淄博市",
            "370302": "淄川区",
            "370303": "张店区",
            "370304": "博山区",
            "370305": "临淄区",
            "370306": "周村区",
            "370321": "桓台县",
            "370322": "高青县",
            "370323": "沂源县",
            "370324": "其它区",
            "370400": "枣庄市",
            "370402": "市中区",
            "370403": "薛城区",
            "370404": "峄城区",
            "370405": "台儿庄区",
            "370406": "山亭区",
            "370481": "滕州市",
            "370482": "其它区",
            "370500": "东营市",
            "370502": "东营区",
            "370503": "河口区",
            "370521": "垦利县",
            "370522": "利津县",
            "370523": "广饶县",
            "370591": "其它区",
            "370600": "烟台市",
            "370602": "芝罘区",
            "370611": "福山区",
            "370612": "牟平区",
            "370613": "莱山区",
            "370634": "长岛县",
            "370681": "龙口市",
            "370682": "莱阳市",
            "370683": "莱州市",
            "370684": "蓬莱市",
            "370685": "招远市",
            "370686": "栖霞市",
            "370687": "海阳市",
            "370688": "其它区",
            "370700": "潍坊市",
            "370702": "潍城区",
            "370703": "寒亭区",
            "370704": "坊子区",
            "370705": "奎文区",
            "370724": "临朐县",
            "370725": "昌乐县",
            "370781": "青州市",
            "370782": "诸城市",
            "370783": "寿光市",
            "370784": "安丘市",
            "370785": "高密市",
            "370786": "昌邑市",
            "370787": "其它区",
            "370800": "济宁市",
            "370802": "市中区",
            "370811": "任城区",
            "370826": "微山县",
            "370827": "鱼台县",
            "370828": "金乡县",
            "370829": "嘉祥县",
            "370830": "汶上县",
            "370831": "泗水县",
            "370832": "梁山县",
            "370881": "曲阜市",
            "370882": "兖州市",
            "370883": "邹城市",
            "370884": "其它区",
            "370900": "泰安市",
            "370902": "泰山区",
            "370903": "岱岳区",
            "370921": "宁阳县",
            "370923": "东平县",
            "370982": "新泰市",
            "370983": "肥城市",
            "370984": "其它区",
            "371000": "威海市",
            "371002": "环翠区",
            "371081": "文登市",
            "371082": "荣成市",
            "371083": "乳山市",
            "371084": "其它区",
            "371100": "日照市",
            "371102": "东港区",
            "371103": "岚山区",
            "371121": "五莲县",
            "371122": "莒县",
            "371123": "其它区",
            "371200": "莱芜市",
            "371202": "莱城区",
            "371203": "钢城区",
            "371204": "其它区",
            "371300": "临沂市",
            "371302": "兰山区",
            "371311": "罗庄区",
            "371312": "河东区",
            "371321": "沂南县",
            "371322": "郯城县",
            "371323": "沂水县",
            "371324": "苍山县",
            "371325": "费县",
            "371326": "平邑县",
            "371327": "莒南县",
            "371328": "蒙阴县",
            "371329": "临沭县",
            "371330": "其它区",
            "371400": "德州市",
            "371402": "德城区",
            "371421": "陵县",
            "371422": "宁津县",
            "371423": "庆云县",
            "371424": "临邑县",
            "371425": "齐河县",
            "371426": "平原县",
            "371427": "夏津县",
            "371428": "武城县",
            "371481": "乐陵市",
            "371482": "禹城市",
            "371483": "其它区",
            "371500": "聊城市",
            "371502": "东昌府区",
            "371521": "阳谷县",
            "371522": "莘县",
            "371523": "茌平县",
            "371524": "东阿县",
            "371525": "冠县",
            "371526": "高唐县",
            "371581": "临清市",
            "371582": "其它区",
            "371600": "滨州市",
            "371602": "滨城区",
            "371621": "惠民县",
            "371622": "阳信县",
            "371623": "无棣县",
            "371624": "沾化县",
            "371625": "博兴县",
            "371626": "邹平县",
            "371627": "其它区",
            "371700": "菏泽市",
            "371702": "牡丹区",
            "371721": "曹县",
            "371722": "单县",
            "371723": "成武县",
            "371724": "巨野县",
            "371725": "郓城县",
            "371726": "鄄城县",
            "371727": "定陶县",
            "371728": "东明县",
            "371729": "其它区",
            "410000": "河南省",
            "410100": "郑州市",
            "410102": "中原区",
            "410103": "二七区",
            "410104": "管城回族区",
            "410105": "金水区",
            "410106": "上街区",
            "410108": "惠济区",
            "410122": "中牟县",
            "410181": "巩义市",
            "410182": "荥阳市",
            "410183": "新密市",
            "410184": "新郑市",
            "410185": "登封市",
            "410188": "其它区",
            "410200": "开封市",
            "410202": "龙亭区",
            "410203": "顺河回族区",
            "410204": "鼓楼区",
            "410205": "禹王台区",
            "410211": "金明区",
            "410221": "杞县",
            "410222": "通许县",
            "410223": "尉氏县",
            "410224": "开封县",
            "410225": "兰考县",
            "410226": "其它区",
            "410300": "洛阳市",
            "410302": "老城区",
            "410303": "西工区",
            "410304": "瀍河回族区",
            "410305": "涧西区",
            "410306": "吉利区",
            "410307": "洛龙区",
            "410322": "孟津县",
            "410323": "新安县",
            "410324": "栾川县",
            "410325": "嵩县",
            "410326": "汝阳县",
            "410327": "宜阳县",
            "410328": "洛宁县",
            "410329": "伊川县",
            "410381": "偃师市",
            "410400": "平顶山市",
            "410402": "新华区",
            "410403": "卫东区",
            "410404": "石龙区",
            "410411": "湛河区",
            "410421": "宝丰县",
            "410422": "叶县",
            "410423": "鲁山县",
            "410425": "郏县",
            "410481": "舞钢市",
            "410482": "汝州市",
            "410483": "其它区",
            "410500": "安阳市",
            "410502": "文峰区",
            "410503": "北关区",
            "410505": "殷都区",
            "410506": "龙安区",
            "410522": "安阳县",
            "410523": "汤阴县",
            "410526": "滑县",
            "410527": "内黄县",
            "410581": "林州市",
            "410582": "其它区",
            "410600": "鹤壁市",
            "410602": "鹤山区",
            "410603": "山城区",
            "410611": "淇滨区",
            "410621": "浚县",
            "410622": "淇县",
            "410623": "其它区",
            "410700": "新乡市",
            "410702": "红旗区",
            "410703": "卫滨区",
            "410704": "凤泉区",
            "410711": "牧野区",
            "410721": "新乡县",
            "410724": "获嘉县",
            "410725": "原阳县",
            "410726": "延津县",
            "410727": "封丘县",
            "410728": "长垣县",
            "410781": "卫辉市",
            "410782": "辉县市",
            "410783": "其它区",
            "410800": "焦作市",
            "410802": "解放区",
            "410803": "中站区",
            "410804": "马村区",
            "410811": "山阳区",
            "410821": "修武县",
            "410822": "博爱县",
            "410823": "武陟县",
            "410825": "温县",
            "410881": "济源市",
            "410882": "沁阳市",
            "410883": "孟州市",
            "410884": "其它区",
            "410900": "濮阳市",
            "410902": "华龙区",
            "410922": "清丰县",
            "410923": "南乐县",
            "410926": "范县",
            "410927": "台前县",
            "410928": "濮阳县",
            "410929": "其它区",
            "411000": "许昌市",
            "411002": "魏都区",
            "411023": "许昌县",
            "411024": "鄢陵县",
            "411025": "襄城县",
            "411081": "禹州市",
            "411082": "长葛市",
            "411083": "其它区",
            "411100": "漯河市",
            "411102": "源汇区",
            "411103": "郾城区",
            "411104": "召陵区",
            "411121": "舞阳县",
            "411122": "临颍县",
            "411123": "其它区",
            "411200": "三门峡市",
            "411202": "湖滨区",
            "411221": "渑池县",
            "411222": "陕县",
            "411224": "卢氏县",
            "411281": "义马市",
            "411282": "灵宝市",
            "411283": "其它区",
            "411300": "南阳市",
            "411302": "宛城区",
            "411303": "卧龙区",
            "411321": "南召县",
            "411322": "方城县",
            "411323": "西峡县",
            "411324": "镇平县",
            "411325": "内乡县",
            "411326": "淅川县",
            "411327": "社旗县",
            "411328": "唐河县",
            "411329": "新野县",
            "411330": "桐柏县",
            "411381": "邓州市",
            "411382": "其它区",
            "411400": "商丘市",
            "411402": "梁园区",
            "411403": "睢阳区",
            "411421": "民权县",
            "411422": "睢县",
            "411423": "宁陵县",
            "411424": "柘城县",
            "411425": "虞城县",
            "411426": "夏邑县",
            "411481": "永城市",
            "411482": "其它区",
            "411500": "信阳市",
            "411502": "浉河区",
            "411503": "平桥区",
            "411521": "罗山县",
            "411522": "光山县",
            "411523": "新县",
            "411524": "商城县",
            "411525": "固始县",
            "411526": "潢川县",
            "411527": "淮滨县",
            "411528": "息县",
            "411529": "其它区",
            "411600": "周口市",
            "411602": "川汇区",
            "411621": "扶沟县",
            "411622": "西华县",
            "411623": "商水县",
            "411624": "沈丘县",
            "411625": "郸城县",
            "411626": "淮阳县",
            "411627": "太康县",
            "411628": "鹿邑县",
            "411681": "项城市",
            "411682": "其它区",
            "411700": "驻马店市",
            "411702": "驿城区",
            "411721": "西平县",
            "411722": "上蔡县",
            "411723": "平舆县",
            "411724": "正阳县",
            "411725": "确山县",
            "411726": "泌阳县",
            "411727": "汝南县",
            "411728": "遂平县",
            "411729": "新蔡县",
            "411730": "其它区",
            "420000": "湖北省",
            "420100": "武汉市",
            "420102": "江岸区",
            "420103": "江汉区",
            "420104": "硚口区",
            "420105": "汉阳区",
            "420106": "武昌区",
            "420107": "青山区",
            "420111": "洪山区",
            "420112": "东西湖区",
            "420113": "汉南区",
            "420114": "蔡甸区",
            "420115": "江夏区",
            "420116": "黄陂区",
            "420117": "新洲区",
            "420118": "其它区",
            "420200": "黄石市",
            "420202": "黄石港区",
            "420203": "西塞山区",
            "420204": "下陆区",
            "420205": "铁山区",
            "420222": "阳新县",
            "420281": "大冶市",
            "420282": "其它区",
            "420300": "十堰市",
            "420302": "茅箭区",
            "420303": "张湾区",
            "420321": "郧县",
            "420322": "郧西县",
            "420323": "竹山县",
            "420324": "竹溪县",
            "420325": "房县",
            "420381": "丹江口市",
            "420383": "其它区",
            "420500": "宜昌市",
            "420502": "西陵区",
            "420503": "伍家岗区",
            "420504": "点军区",
            "420505": "猇亭区",
            "420506": "夷陵区",
            "420525": "远安县",
            "420526": "兴山县",
            "420527": "秭归县",
            "420528": "长阳土家族自治县",
            "420529": "五峰土家族自治县",
            "420581": "宜都市",
            "420582": "当阳市",
            "420583": "枝江市",
            "420584": "其它区",
            "420600": "襄阳市",
            "420602": "襄城区",
            "420606": "樊城区",
            "420607": "襄州区",
            "420624": "南漳县",
            "420625": "谷城县",
            "420626": "保康县",
            "420682": "老河口市",
            "420683": "枣阳市",
            "420684": "宜城市",
            "420685": "其它区",
            "420700": "鄂州市",
            "420702": "梁子湖区",
            "420703": "华容区",
            "420704": "鄂城区",
            "420705": "其它区",
            "420800": "荆门市",
            "420802": "东宝区",
            "420804": "掇刀区",
            "420821": "京山县",
            "420822": "沙洋县",
            "420881": "钟祥市",
            "420882": "其它区",
            "420900": "孝感市",
            "420902": "孝南区",
            "420921": "孝昌县",
            "420922": "大悟县",
            "420923": "云梦县",
            "420981": "应城市",
            "420982": "安陆市",
            "420984": "汉川市",
            "420985": "其它区",
            "421000": "荆州市",
            "421002": "沙市区",
            "421003": "荆州区",
            "421022": "公安县",
            "421023": "监利县",
            "421024": "江陵县",
            "421081": "石首市",
            "421083": "洪湖市",
            "421087": "松滋市",
            "421088": "其它区",
            "421100": "黄冈市",
            "421102": "黄州区",
            "421121": "团风县",
            "421122": "红安县",
            "421123": "罗田县",
            "421124": "英山县",
            "421125": "浠水县",
            "421126": "蕲春县",
            "421127": "黄梅县",
            "421181": "麻城市",
            "421182": "武穴市",
            "421183": "其它区",
            "421200": "咸宁市",
            "421202": "咸安区",
            "421221": "嘉鱼县",
            "421222": "通城县",
            "421223": "崇阳县",
            "421224": "通山县",
            "421281": "赤壁市",
            "421283": "其它区",
            "421300": "随州市",
            "421302": "曾都区",
            "421321": "随县",
            "421381": "广水市",
            "421382": "其它区",
            "422800": "恩施土家族苗族自治州",
            "422801": "恩施市",
            "422802": "利川市",
            "422822": "建始县",
            "422823": "巴东县",
            "422825": "宣恩县",
            "422826": "咸丰县",
            "422827": "来凤县",
            "422828": "鹤峰县",
            "422829": "其它区",
            "429004": "仙桃市",
            "429005": "潜江市",
            "429006": "天门市",
            "429021": "神农架林区",
            "430000": "湖南省",
            "430100": "长沙市",
            "430102": "芙蓉区",
            "430103": "天心区",
            "430104": "岳麓区",
            "430105": "开福区",
            "430111": "雨花区",
            "430121": "长沙县",
            "430122": "望城区",
            "430124": "宁乡县",
            "430181": "浏阳市",
            "430182": "其它区",
            "430200": "株洲市",
            "430202": "荷塘区",
            "430203": "芦淞区",
            "430204": "石峰区",
            "430211": "天元区",
            "430221": "株洲县",
            "430223": "攸县",
            "430224": "茶陵县",
            "430225": "炎陵县",
            "430281": "醴陵市",
            "430282": "其它区",
            "430300": "湘潭市",
            "430302": "雨湖区",
            "430304": "岳塘区",
            "430321": "湘潭县",
            "430381": "湘乡市",
            "430382": "韶山市",
            "430383": "其它区",
            "430400": "衡阳市",
            "430405": "珠晖区",
            "430406": "雁峰区",
            "430407": "石鼓区",
            "430408": "蒸湘区",
            "430412": "南岳区",
            "430421": "衡阳县",
            "430422": "衡南县",
            "430423": "衡山县",
            "430424": "衡东县",
            "430426": "祁东县",
            "430481": "耒阳市",
            "430482": "常宁市",
            "430483": "其它区",
            "430500": "邵阳市",
            "430502": "双清区",
            "430503": "大祥区",
            "430511": "北塔区",
            "430521": "邵东县",
            "430522": "新邵县",
            "430523": "邵阳县",
            "430524": "隆回县",
            "430525": "洞口县",
            "430527": "绥宁县",
            "430528": "新宁县",
            "430529": "城步苗族自治县",
            "430581": "武冈市",
            "430582": "其它区",
            "430600": "岳阳市",
            "430602": "岳阳楼区",
            "430603": "云溪区",
            "430611": "君山区",
            "430621": "岳阳县",
            "430623": "华容县",
            "430624": "湘阴县",
            "430626": "平江县",
            "430681": "汨罗市",
            "430682": "临湘市",
            "430683": "其它区",
            "430700": "常德市",
            "430702": "武陵区",
            "430703": "鼎城区",
            "430721": "安乡县",
            "430722": "汉寿县",
            "430723": "澧县",
            "430724": "临澧县",
            "430725": "桃源县",
            "430726": "石门县",
            "430781": "津市市",
            "430782": "其它区",
            "430800": "张家界市",
            "430802": "永定区",
            "430811": "武陵源区",
            "430821": "慈利县",
            "430822": "桑植县",
            "430823": "其它区",
            "430900": "益阳市",
            "430902": "资阳区",
            "430903": "赫山区",
            "430921": "南县",
            "430922": "桃江县",
            "430923": "安化县",
            "430981": "沅江市",
            "430982": "其它区",
            "431000": "郴州市",
            "431002": "北湖区",
            "431003": "苏仙区",
            "431021": "桂阳县",
            "431022": "宜章县",
            "431023": "永兴县",
            "431024": "嘉禾县",
            "431025": "临武县",
            "431026": "汝城县",
            "431027": "桂东县",
            "431028": "安仁县",
            "431081": "资兴市",
            "431082": "其它区",
            "431100": "永州市",
            "431102": "零陵区",
            "431103": "冷水滩区",
            "431121": "祁阳县",
            "431122": "东安县",
            "431123": "双牌县",
            "431124": "道县",
            "431125": "江永县",
            "431126": "宁远县",
            "431127": "蓝山县",
            "431128": "新田县",
            "431129": "江华瑶族自治县",
            "431130": "其它区",
            "431200": "怀化市",
            "431202": "鹤城区",
            "431221": "中方县",
            "431222": "沅陵县",
            "431223": "辰溪县",
            "431224": "溆浦县",
            "431225": "会同县",
            "431226": "麻阳苗族自治县",
            "431227": "新晃侗族自治县",
            "431228": "芷江侗族自治县",
            "431229": "靖州苗族侗族自治县",
            "431230": "通道侗族自治县",
            "431281": "洪江市",
            "431282": "其它区",
            "431300": "娄底市",
            "431302": "娄星区",
            "431321": "双峰县",
            "431322": "新化县",
            "431381": "冷水江市",
            "431382": "涟源市",
            "431383": "其它区",
            "433100": "湘西土家族苗族自治州",
            "433101": "吉首市",
            "433122": "泸溪县",
            "433123": "凤凰县",
            "433124": "花垣县",
            "433125": "保靖县",
            "433126": "古丈县",
            "433127": "永顺县",
            "433130": "龙山县",
            "433131": "其它区",
            "440000": "广东省",
            "440100": "广州市",
            "440103": "荔湾区",
            "440104": "越秀区",
            "440105": "海珠区",
            "440106": "天河区",
            "440111": "白云区",
            "440112": "黄埔区",
            "440113": "番禺区",
            "440114": "花都区",
            "440115": "南沙区",
            "440116": "萝岗区",
            "440183": "增城市",
            "440184": "从化市",
            "440189": "其它区",
            "440200": "韶关市",
            "440203": "武江区",
            "440204": "浈江区",
            "440205": "曲江区",
            "440222": "始兴县",
            "440224": "仁化县",
            "440229": "翁源县",
            "440232": "乳源瑶族自治县",
            "440233": "新丰县",
            "440281": "乐昌市",
            "440282": "南雄市",
            "440283": "其它区",
            "440300": "深圳市",
            "440303": "罗湖区",
            "440304": "福田区",
            "440305": "南山区",
            "440306": "宝安区",
            "440307": "龙岗区",
            "440308": "盐田区",
            "440309": "其它区",
            "440320": "光明新区",
            "440321": "坪山新区",
            "440322": "大鹏新区",
            "440323": "龙华新区",
            "440400": "珠海市",
            "440402": "香洲区",
            "440403": "斗门区",
            "440404": "金湾区",
            "440488": "其它区",
            "440500": "汕头市",
            "440507": "龙湖区",
            "440511": "金平区",
            "440512": "濠江区",
            "440513": "潮阳区",
            "440514": "潮南区",
            "440515": "澄海区",
            "440523": "南澳县",
            "440524": "其它区",
            "440600": "佛山市",
            "440604": "禅城区",
            "440605": "南海区",
            "440606": "顺德区",
            "440607": "三水区",
            "440608": "高明区",
            "440609": "其它区",
            "440700": "江门市",
            "440703": "蓬江区",
            "440704": "江海区",
            "440705": "新会区",
            "440781": "台山市",
            "440783": "开平市",
            "440784": "鹤山市",
            "440785": "恩平市",
            "440786": "其它区",
            "440800": "湛江市",
            "440802": "赤坎区",
            "440803": "霞山区",
            "440804": "坡头区",
            "440811": "麻章区",
            "440823": "遂溪县",
            "440825": "徐闻县",
            "440881": "廉江市",
            "440882": "雷州市",
            "440883": "吴川市",
            "440884": "其它区",
            "440900": "茂名市",
            "440902": "茂南区",
            "440903": "茂港区",
            "440923": "电白县",
            "440981": "高州市",
            "440982": "化州市",
            "440983": "信宜市",
            "440984": "其它区",
            "441200": "肇庆市",
            "441202": "端州区",
            "441203": "鼎湖区",
            "441223": "广宁县",
            "441224": "怀集县",
            "441225": "封开县",
            "441226": "德庆县",
            "441283": "高要市",
            "441284": "四会市",
            "441285": "其它区",
            "441300": "惠州市",
            "441302": "惠城区",
            "441303": "惠阳区",
            "441322": "博罗县",
            "441323": "惠东县",
            "441324": "龙门县",
            "441325": "其它区",
            "441400": "梅州市",
            "441402": "梅江区",
            "441421": "梅县",
            "441422": "大埔县",
            "441423": "丰顺县",
            "441424": "五华县",
            "441426": "平远县",
            "441427": "蕉岭县",
            "441481": "兴宁市",
            "441482": "其它区",
            "441500": "汕尾市",
            "441502": "城区",
            "441521": "海丰县",
            "441523": "陆河县",
            "441581": "陆丰市",
            "441582": "其它区",
            "441600": "河源市",
            "441602": "源城区",
            "441621": "紫金县",
            "441622": "龙川县",
            "441623": "连平县",
            "441624": "和平县",
            "441625": "东源县",
            "441626": "其它区",
            "441700": "阳江市",
            "441702": "江城区",
            "441721": "阳西县",
            "441723": "阳东县",
            "441781": "阳春市",
            "441782": "其它区",
            "441800": "清远市",
            "441802": "清城区",
            "441821": "佛冈县",
            "441823": "阳山县",
            "441825": "连山壮族瑶族自治县",
            "441826": "连南瑶族自治县",
            "441827": "清新区",
            "441881": "英德市",
            "441882": "连州市",
            "441883": "其它区",
            "441900": "东莞市",
            "442000": "中山市",
            "442101": "东沙群岛",
            "445100": "潮州市",
            "445102": "湘桥区",
            "445121": "潮安区",
            "445122": "饶平县",
            "445186": "其它区",
            "445200": "揭阳市",
            "445202": "榕城区",
            "445221": "揭东区",
            "445222": "揭西县",
            "445224": "惠来县",
            "445281": "普宁市",
            "445285": "其它区",
            "445300": "云浮市",
            "445302": "云城区",
            "445321": "新兴县",
            "445322": "郁南县",
            "445323": "云安县",
            "445381": "罗定市",
            "445382": "其它区",
            "450000": "广西壮族自治区",
            "450100": "南宁市",
            "450102": "兴宁区",
            "450103": "青秀区",
            "450105": "江南区",
            "450107": "西乡塘区",
            "450108": "良庆区",
            "450109": "邕宁区",
            "450122": "武鸣县",
            "450123": "隆安县",
            "450124": "马山县",
            "450125": "上林县",
            "450126": "宾阳县",
            "450127": "横县",
            "450128": "其它区",
            "450200": "柳州市",
            "450202": "城中区",
            "450203": "鱼峰区",
            "450204": "柳南区",
            "450205": "柳北区",
            "450221": "柳江县",
            "450222": "柳城县",
            "450223": "鹿寨县",
            "450224": "融安县",
            "450225": "融水苗族自治县",
            "450226": "三江侗族自治县",
            "450227": "其它区",
            "450300": "桂林市",
            "450302": "秀峰区",
            "450303": "叠彩区",
            "450304": "象山区",
            "450305": "七星区",
            "450311": "雁山区",
            "450321": "阳朔县",
            "450322": "临桂区",
            "450323": "灵川县",
            "450324": "全州县",
            "450325": "兴安县",
            "450326": "永福县",
            "450327": "灌阳县",
            "450328": "龙胜各族自治县",
            "450329": "资源县",
            "450330": "平乐县",
            "450331": "荔浦县",
            "450332": "恭城瑶族自治县",
            "450333": "其它区",
            "450400": "梧州市",
            "450403": "万秀区",
            "450405": "长洲区",
            "450406": "龙圩区",
            "450421": "苍梧县",
            "450422": "藤县",
            "450423": "蒙山县",
            "450481": "岑溪市",
            "450482": "其它区",
            "450500": "北海市",
            "450502": "海城区",
            "450503": "银海区",
            "450512": "铁山港区",
            "450521": "合浦县",
            "450522": "其它区",
            "450600": "防城港市",
            "450602": "港口区",
            "450603": "防城区",
            "450621": "上思县",
            "450681": "东兴市",
            "450682": "其它区",
            "450700": "钦州市",
            "450702": "钦南区",
            "450703": "钦北区",
            "450721": "灵山县",
            "450722": "浦北县",
            "450723": "其它区",
            "450800": "贵港市",
            "450802": "港北区",
            "450803": "港南区",
            "450804": "覃塘区",
            "450821": "平南县",
            "450881": "桂平市",
            "450882": "其它区",
            "450900": "玉林市",
            "450902": "玉州区",
            "450903": "福绵区",
            "450921": "容县",
            "450922": "陆川县",
            "450923": "博白县",
            "450924": "兴业县",
            "450981": "北流市",
            "450982": "其它区",
            "451000": "百色市",
            "451002": "右江区",
            "451021": "田阳县",
            "451022": "田东县",
            "451023": "平果县",
            "451024": "德保县",
            "451025": "靖西县",
            "451026": "那坡县",
            "451027": "凌云县",
            "451028": "乐业县",
            "451029": "田林县",
            "451030": "西林县",
            "451031": "隆林各族自治县",
            "451032": "其它区",
            "451100": "贺州市",
            "451102": "八步区",
            "451119": "平桂管理区",
            "451121": "昭平县",
            "451122": "钟山县",
            "451123": "富川瑶族自治县",
            "451124": "其它区",
            "451200": "河池市",
            "451202": "金城江区",
            "451221": "南丹县",
            "451222": "天峨县",
            "451223": "凤山县",
            "451224": "东兰县",
            "451225": "罗城仫佬族自治县",
            "451226": "环江毛南族自治县",
            "451227": "巴马瑶族自治县",
            "451228": "都安瑶族自治县",
            "451229": "大化瑶族自治县",
            "451281": "宜州市",
            "451282": "其它区",
            "451300": "来宾市",
            "451302": "兴宾区",
            "451321": "忻城县",
            "451322": "象州县",
            "451323": "武宣县",
            "451324": "金秀瑶族自治县",
            "451381": "合山市",
            "451382": "其它区",
            "451400": "崇左市",
            "451402": "江州区",
            "451421": "扶绥县",
            "451422": "宁明县",
            "451423": "龙州县",
            "451424": "大新县",
            "451425": "天等县",
            "451481": "凭祥市",
            "451482": "其它区",
            "460000": "海南省",
            "460100": "海口市",
            "460105": "秀英区",
            "460106": "龙华区",
            "460107": "琼山区",
            "460108": "美兰区",
            "460109": "其它区",
            "460200": "三亚市",
            "460300": "三沙市",
            "460321": "西沙群岛",
            "460322": "南沙群岛",
            "460323": "中沙群岛的岛礁及其海域",
            "469001": "五指山市",
            "469002": "琼海市",
            "469003": "儋州市",
            "469005": "文昌市",
            "469006": "万宁市",
            "469007": "东方市",
            "469025": "定安县",
            "469026": "屯昌县",
            "469027": "澄迈县",
            "469028": "临高县",
            "469030": "白沙黎族自治县",
            "469031": "昌江黎族自治县",
            "469033": "乐东黎族自治县",
            "469034": "陵水黎族自治县",
            "469035": "保亭黎族苗族自治县",
            "469036": "琼中黎族苗族自治县",
            "471005": "其它区",
            "500000": "重庆",
            "500100": "重庆市",
            "500101": "万州区",
            "500102": "涪陵区",
            "500103": "渝中区",
            "500104": "大渡口区",
            "500105": "江北区",
            "500106": "沙坪坝区",
            "500107": "九龙坡区",
            "500108": "南岸区",
            "500109": "北碚区",
            "500110": "万盛区",
            "500111": "双桥区",
            "500112": "渝北区",
            "500113": "巴南区",
            "500114": "黔江区",
            "500115": "长寿区",
            "500222": "綦江区",
            "500223": "潼南县",
            "500224": "铜梁县",
            "500225": "大足区",
            "500226": "荣昌县",
            "500227": "璧山县",
            "500228": "梁平县",
            "500229": "城口县",
            "500230": "丰都县",
            "500231": "垫江县",
            "500232": "武隆县",
            "500233": "忠县",
            "500234": "开县",
            "500235": "云阳县",
            "500236": "奉节县",
            "500237": "巫山县",
            "500238": "巫溪县",
            "500240": "石柱土家族自治县",
            "500241": "秀山土家族苗族自治县",
            "500242": "酉阳土家族苗族自治县",
            "500243": "彭水苗族土家族自治县",
            "500381": "江津区",
            "500382": "合川区",
            "500383": "永川区",
            "500384": "南川区",
            "500385": "其它区",
            "510000": "四川省",
            "510100": "成都市",
            "510104": "锦江区",
            "510105": "青羊区",
            "510106": "金牛区",
            "510107": "武侯区",
            "510108": "成华区",
            "510112": "龙泉驿区",
            "510113": "青白江区",
            "510114": "新都区",
            "510115": "温江区",
            "510121": "金堂县",
            "510122": "双流县",
            "510124": "郫县",
            "510129": "大邑县",
            "510131": "蒲江县",
            "510132": "新津县",
            "510181": "都江堰市",
            "510182": "彭州市",
            "510183": "邛崃市",
            "510184": "崇州市",
            "510185": "其它区",
            "510300": "自贡市",
            "510302": "自流井区",
            "510303": "贡井区",
            "510304": "大安区",
            "510311": "沿滩区",
            "510321": "荣县",
            "510322": "富顺县",
            "510323": "其它区",
            "510400": "攀枝花市",
            "510402": "东区",
            "510403": "西区",
            "510411": "仁和区",
            "510421": "米易县",
            "510422": "盐边县",
            "510423": "其它区",
            "510500": "泸州市",
            "510502": "江阳区",
            "510503": "纳溪区",
            "510504": "龙马潭区",
            "510521": "泸县",
            "510522": "合江县",
            "510524": "叙永县",
            "510525": "古蔺县",
            "510526": "其它区",
            "510600": "德阳市",
            "510603": "旌阳区",
            "510623": "中江县",
            "510626": "罗江县",
            "510681": "广汉市",
            "510682": "什邡市",
            "510683": "绵竹市",
            "510684": "其它区",
            "510700": "绵阳市",
            "510703": "涪城区",
            "510704": "游仙区",
            "510722": "三台县",
            "510723": "盐亭县",
            "510724": "安县",
            "510725": "梓潼县",
            "510726": "北川羌族自治县",
            "510727": "平武县",
            "510781": "江油市",
            "510782": "其它区",
            "510800": "广元市",
            "510802": "利州区",
            "510811": "昭化区",
            "510812": "朝天区",
            "510821": "旺苍县",
            "510822": "青川县",
            "510823": "剑阁县",
            "510824": "苍溪县",
            "510825": "其它区",
            "510900": "遂宁市",
            "510903": "船山区",
            "510904": "安居区",
            "510921": "蓬溪县",
            "510922": "射洪县",
            "510923": "大英县",
            "510924": "其它区",
            "511000": "内江市",
            "511002": "市中区",
            "511011": "东兴区",
            "511024": "威远县",
            "511025": "资中县",
            "511028": "隆昌县",
            "511029": "其它区",
            "511100": "乐山市",
            "511102": "市中区",
            "511111": "沙湾区",
            "511112": "五通桥区",
            "511113": "金口河区",
            "511123": "犍为县",
            "511124": "井研县",
            "511126": "夹江县",
            "511129": "沐川县",
            "511132": "峨边彝族自治县",
            "511133": "马边彝族自治县",
            "511181": "峨眉山市",
            "511182": "其它区",
            "511300": "南充市",
            "511302": "顺庆区",
            "511303": "高坪区",
            "511304": "嘉陵区",
            "511321": "南部县",
            "511322": "营山县",
            "511323": "蓬安县",
            "511324": "仪陇县",
            "511325": "西充县",
            "511381": "阆中市",
            "511382": "其它区",
            "511400": "眉山市",
            "511402": "东坡区",
            "511421": "仁寿县",
            "511422": "彭山县",
            "511423": "洪雅县",
            "511424": "丹棱县",
            "511425": "青神县",
            "511426": "其它区",
            "511500": "宜宾市",
            "511502": "翠屏区",
            "511521": "宜宾县",
            "511522": "南溪区",
            "511523": "江安县",
            "511524": "长宁县",
            "511525": "高县",
            "511526": "珙县",
            "511527": "筠连县",
            "511528": "兴文县",
            "511529": "屏山县",
            "511530": "其它区",
            "511600": "广安市",
            "511602": "广安区",
            "511603": "前锋区",
            "511621": "岳池县",
            "511622": "武胜县",
            "511623": "邻水县",
            "511681": "华蓥市",
            "511683": "其它区",
            "511700": "达州市",
            "511702": "通川区",
            "511721": "达川区",
            "511722": "宣汉县",
            "511723": "开江县",
            "511724": "大竹县",
            "511725": "渠县",
            "511781": "万源市",
            "511782": "其它区",
            "511800": "雅安市",
            "511802": "雨城区",
            "511821": "名山区",
            "511822": "荥经县",
            "511823": "汉源县",
            "511824": "石棉县",
            "511825": "天全县",
            "511826": "芦山县",
            "511827": "宝兴县",
            "511828": "其它区",
            "511900": "巴中市",
            "511902": "巴州区",
            "511903": "恩阳区",
            "511921": "通江县",
            "511922": "南江县",
            "511923": "平昌县",
            "511924": "其它区",
            "512000": "资阳市",
            "512002": "雁江区",
            "512021": "安岳县",
            "512022": "乐至县",
            "512081": "简阳市",
            "512082": "其它区",
            "513200": "阿坝藏族羌族自治州",
            "513221": "汶川县",
            "513222": "理县",
            "513223": "茂县",
            "513224": "松潘县",
            "513225": "九寨沟县",
            "513226": "金川县",
            "513227": "小金县",
            "513228": "黑水县",
            "513229": "马尔康县",
            "513230": "壤塘县",
            "513231": "阿坝县",
            "513232": "若尔盖县",
            "513233": "红原县",
            "513234": "其它区",
            "513300": "甘孜藏族自治州",
            "513321": "康定县",
            "513322": "泸定县",
            "513323": "丹巴县",
            "513324": "九龙县",
            "513325": "雅江县",
            "513326": "道孚县",
            "513327": "炉霍县",
            "513328": "甘孜县",
            "513329": "新龙县",
            "513330": "德格县",
            "513331": "白玉县",
            "513332": "石渠县",
            "513333": "色达县",
            "513334": "理塘县",
            "513335": "巴塘县",
            "513336": "乡城县",
            "513337": "稻城县",
            "513338": "得荣县",
            "513339": "其它区",
            "513400": "凉山彝族自治州",
            "513401": "西昌市",
            "513422": "木里藏族自治县",
            "513423": "盐源县",
            "513424": "德昌县",
            "513425": "会理县",
            "513426": "会东县",
            "513427": "宁南县",
            "513428": "普格县",
            "513429": "布拖县",
            "513430": "金阳县",
            "513431": "昭觉县",
            "513432": "喜德县",
            "513433": "冕宁县",
            "513434": "越西县",
            "513435": "甘洛县",
            "513436": "美姑县",
            "513437": "雷波县",
            "513438": "其它区",
            "520000": "贵州省",
            "520100": "贵阳市",
            "520102": "南明区",
            "520103": "云岩区",
            "520111": "花溪区",
            "520112": "乌当区",
            "520113": "白云区",
            "520121": "开阳县",
            "520122": "息烽县",
            "520123": "修文县",
            "520151": "观山湖区",
            "520181": "清镇市",
            "520182": "其它区",
            "520200": "六盘水市",
            "520201": "钟山区",
            "520203": "六枝特区",
            "520221": "水城县",
            "520222": "盘县",
            "520223": "其它区",
            "520300": "遵义市",
            "520302": "红花岗区",
            "520303": "汇川区",
            "520321": "遵义县",
            "520322": "桐梓县",
            "520323": "绥阳县",
            "520324": "正安县",
            "520325": "道真仡佬族苗族自治县",
            "520326": "务川仡佬族苗族自治县",
            "520327": "凤冈县",
            "520328": "湄潭县",
            "520329": "余庆县",
            "520330": "习水县",
            "520381": "赤水市",
            "520382": "仁怀市",
            "520383": "其它区",
            "520400": "安顺市",
            "520402": "西秀区",
            "520421": "平坝县",
            "520422": "普定县",
            "520423": "镇宁布依族苗族自治县",
            "520424": "关岭布依族苗族自治县",
            "520425": "紫云苗族布依族自治县",
            "520426": "其它区",
            "522200": "铜仁市",
            "522201": "碧江区",
            "522222": "江口县",
            "522223": "玉屏侗族自治县",
            "522224": "石阡县",
            "522225": "思南县",
            "522226": "印江土家族苗族自治县",
            "522227": "德江县",
            "522228": "沿河土家族自治县",
            "522229": "松桃苗族自治县",
            "522230": "万山区",
            "522231": "其它区",
            "522300": "黔西南布依族苗族自治州",
            "522301": "兴义市",
            "522322": "兴仁县",
            "522323": "普安县",
            "522324": "晴隆县",
            "522325": "贞丰县",
            "522326": "望谟县",
            "522327": "册亨县",
            "522328": "安龙县",
            "522329": "其它区",
            "522400": "毕节市",
            "522401": "七星关区",
            "522422": "大方县",
            "522423": "黔西县",
            "522424": "金沙县",
            "522425": "织金县",
            "522426": "纳雍县",
            "522427": "威宁彝族回族苗族自治县",
            "522428": "赫章县",
            "522429": "其它区",
            "522600": "黔东南苗族侗族自治州",
            "522601": "凯里市",
            "522622": "黄平县",
            "522623": "施秉县",
            "522624": "三穗县",
            "522625": "镇远县",
            "522626": "岑巩县",
            "522627": "天柱县",
            "522628": "锦屏县",
            "522629": "剑河县",
            "522630": "台江县",
            "522631": "黎平县",
            "522632": "榕江县",
            "522633": "从江县",
            "522634": "雷山县",
            "522635": "麻江县",
            "522636": "丹寨县",
            "522637": "其它区",
            "522700": "黔南布依族苗族自治州",
            "522701": "都匀市",
            "522702": "福泉市",
            "522722": "荔波县",
            "522723": "贵定县",
            "522725": "瓮安县",
            "522726": "独山县",
            "522727": "平塘县",
            "522728": "罗甸县",
            "522729": "长顺县",
            "522730": "龙里县",
            "522731": "惠水县",
            "522732": "三都水族自治县",
            "522733": "其它区",
            "530000": "云南省",
            "530100": "昆明市",
            "530102": "五华区",
            "530103": "盘龙区",
            "530111": "官渡区",
            "530112": "西山区",
            "530113": "东川区",
            "530121": "呈贡区",
            "530122": "晋宁县",
            "530124": "富民县",
            "530125": "宜良县",
            "530126": "石林彝族自治县",
            "530127": "嵩明县",
            "530128": "禄劝彝族苗族自治县",
            "530129": "寻甸回族彝族自治县",
            "530181": "安宁市",
            "530182": "其它区",
            "530300": "曲靖市",
            "530302": "麒麟区",
            "530321": "马龙县",
            "530322": "陆良县",
            "530323": "师宗县",
            "530324": "罗平县",
            "530325": "富源县",
            "530326": "会泽县",
            "530328": "沾益县",
            "530381": "宣威市",
            "530382": "其它区",
            "530400": "玉溪市",
            "530402": "红塔区",
            "530421": "江川县",
            "530422": "澄江县",
            "530423": "通海县",
            "530424": "华宁县",
            "530425": "易门县",
            "530426": "峨山彝族自治县",
            "530427": "新平彝族傣族自治县",
            "530428": "元江哈尼族彝族傣族自治县",
            "530429": "其它区",
            "530500": "保山市",
            "530502": "隆阳区",
            "530521": "施甸县",
            "530522": "腾冲县",
            "530523": "龙陵县",
            "530524": "昌宁县",
            "530525": "其它区",
            "530600": "昭通市",
            "530602": "昭阳区",
            "530621": "鲁甸县",
            "530622": "巧家县",
            "530623": "盐津县",
            "530624": "大关县",
            "530625": "永善县",
            "530626": "绥江县",
            "530627": "镇雄县",
            "530628": "彝良县",
            "530629": "威信县",
            "530630": "水富县",
            "530631": "其它区",
            "530700": "丽江市",
            "530702": "古城区",
            "530721": "玉龙纳西族自治县",
            "530722": "永胜县",
            "530723": "华坪县",
            "530724": "宁蒗彝族自治县",
            "530725": "其它区",
            "530800": "普洱市",
            "530802": "思茅区",
            "530821": "宁洱哈尼族彝族自治县",
            "530822": "墨江哈尼族自治县",
            "530823": "景东彝族自治县",
            "530824": "景谷傣族彝族自治县",
            "530825": "镇沅彝族哈尼族拉祜族自治县",
            "530826": "江城哈尼族彝族自治县",
            "530827": "孟连傣族拉祜族佤族自治县",
            "530828": "澜沧拉祜族自治县",
            "530829": "西盟佤族自治县",
            "530830": "其它区",
            "530900": "临沧市",
            "530902": "临翔区",
            "530921": "凤庆县",
            "530922": "云县",
            "530923": "永德县",
            "530924": "镇康县",
            "530925": "双江拉祜族佤族布朗族傣族自治县",
            "530926": "耿马傣族佤族自治县",
            "530927": "沧源佤族自治县",
            "530928": "其它区",
            "532300": "楚雄彝族自治州",
            "532301": "楚雄市",
            "532322": "双柏县",
            "532323": "牟定县",
            "532324": "南华县",
            "532325": "姚安县",
            "532326": "大姚县",
            "532327": "永仁县",
            "532328": "元谋县",
            "532329": "武定县",
            "532331": "禄丰县",
            "532332": "其它区",
            "532500": "红河哈尼族彝族自治州",
            "532501": "个旧市",
            "532502": "开远市",
            "532522": "蒙自市",
            "532523": "屏边苗族自治县",
            "532524": "建水县",
            "532525": "石屏县",
            "532526": "弥勒市",
            "532527": "泸西县",
            "532528": "元阳县",
            "532529": "红河县",
            "532530": "金平苗族瑶族傣族自治县",
            "532531": "绿春县",
            "532532": "河口瑶族自治县",
            "532533": "其它区",
            "532600": "文山壮族苗族自治州",
            "532621": "文山市",
            "532622": "砚山县",
            "532623": "西畴县",
            "532624": "麻栗坡县",
            "532625": "马关县",
            "532626": "丘北县",
            "532627": "广南县",
            "532628": "富宁县",
            "532629": "其它区",
            "532800": "西双版纳傣族自治州",
            "532801": "景洪市",
            "532822": "勐海县",
            "532823": "勐腊县",
            "532824": "其它区",
            "532900": "大理白族自治州",
            "532901": "大理市",
            "532922": "漾濞彝族自治县",
            "532923": "祥云县",
            "532924": "宾川县",
            "532925": "弥渡县",
            "532926": "南涧彝族自治县",
            "532927": "巍山彝族回族自治县",
            "532928": "永平县",
            "532929": "云龙县",
            "532930": "洱源县",
            "532931": "剑川县",
            "532932": "鹤庆县",
            "532933": "其它区",
            "533100": "德宏傣族景颇族自治州",
            "533102": "瑞丽市",
            "533103": "芒市",
            "533122": "梁河县",
            "533123": "盈江县",
            "533124": "陇川县",
            "533125": "其它区",
            "533300": "怒江傈僳族自治州",
            "533321": "泸水县",
            "533323": "福贡县",
            "533324": "贡山独龙族怒族自治县",
            "533325": "兰坪白族普米族自治县",
            "533326": "其它区",
            "533400": "迪庆藏族自治州",
            "533421": "香格里拉县",
            "533422": "德钦县",
            "533423": "维西傈僳族自治县",
            "533424": "其它区",
            "540000": "西藏自治区",
            "540100": "拉萨市",
            "540102": "城关区",
            "540121": "林周县",
            "540122": "当雄县",
            "540123": "尼木县",
            "540124": "曲水县",
            "540125": "堆龙德庆县",
            "540126": "达孜县",
            "540127": "墨竹工卡县",
            "540128": "其它区",
            "542100": "昌都地区",
            "542121": "昌都县",
            "542122": "江达县",
            "542123": "贡觉县",
            "542124": "类乌齐县",
            "542125": "丁青县",
            "542126": "察雅县",
            "542127": "八宿县",
            "542128": "左贡县",
            "542129": "芒康县",
            "542132": "洛隆县",
            "542133": "边坝县",
            "542134": "其它区",
            "542200": "山南地区",
            "542221": "乃东县",
            "542222": "扎囊县",
            "542223": "贡嘎县",
            "542224": "桑日县",
            "542225": "琼结县",
            "542226": "曲松县",
            "542227": "措美县",
            "542228": "洛扎县",
            "542229": "加查县",
            "542231": "隆子县",
            "542232": "错那县",
            "542233": "浪卡子县",
            "542234": "其它区",
            "542300": "日喀则地区",
            "542301": "日喀则市",
            "542322": "南木林县",
            "542323": "江孜县",
            "542324": "定日县",
            "542325": "萨迦县",
            "542326": "拉孜县",
            "542327": "昂仁县",
            "542328": "谢通门县",
            "542329": "白朗县",
            "542330": "仁布县",
            "542331": "康马县",
            "542332": "定结县",
            "542333": "仲巴县",
            "542334": "亚东县",
            "542335": "吉隆县",
            "542336": "聂拉木县",
            "542337": "萨嘎县",
            "542338": "岗巴县",
            "542339": "其它区",
            "542400": "那曲地区",
            "542421": "那曲县",
            "542422": "嘉黎县",
            "542423": "比如县",
            "542424": "聂荣县",
            "542425": "安多县",
            "542426": "申扎县",
            "542427": "索县",
            "542428": "班戈县",
            "542429": "巴青县",
            "542430": "尼玛县",
            "542431": "其它区",
            "542432": "双湖县",
            "542500": "阿里地区",
            "542521": "普兰县",
            "542522": "札达县",
            "542523": "噶尔县",
            "542524": "日土县",
            "542525": "革吉县",
            "542526": "改则县",
            "542527": "措勤县",
            "542528": "其它区",
            "542600": "林芝地区",
            "542621": "林芝县",
            "542622": "工布江达县",
            "542623": "米林县",
            "542624": "墨脱县",
            "542625": "波密县",
            "542626": "察隅县",
            "542627": "朗县",
            "542628": "其它区",
            "610000": "陕西省",
            "610100": "西安市",
            "610102": "新城区",
            "610103": "碑林区",
            "610104": "莲湖区",
            "610111": "灞桥区",
            "610112": "未央区",
            "610113": "雁塔区",
            "610114": "阎良区",
            "610115": "临潼区",
            "610116": "长安区",
            "610122": "蓝田县",
            "610124": "周至县",
            "610125": "户县",
            "610126": "高陵县",
            "610127": "其它区",
            "610200": "铜川市",
            "610202": "王益区",
            "610203": "印台区",
            "610204": "耀州区",
            "610222": "宜君县",
            "610223": "其它区",
            "610300": "宝鸡市",
            "610302": "渭滨区",
            "610303": "金台区",
            "610304": "陈仓区",
            "610322": "凤翔县",
            "610323": "岐山县",
            "610324": "扶风县",
            "610326": "眉县",
            "610327": "陇县",
            "610328": "千阳县",
            "610329": "麟游县",
            "610330": "凤县",
            "610331": "太白县",
            "610332": "其它区",
            "610400": "咸阳市",
            "610402": "秦都区",
            "610403": "杨陵区",
            "610404": "渭城区",
            "610422": "三原县",
            "610423": "泾阳县",
            "610424": "乾县",
            "610425": "礼泉县",
            "610426": "永寿县",
            "610427": "彬县",
            "610428": "长武县",
            "610429": "旬邑县",
            "610430": "淳化县",
            "610431": "武功县",
            "610481": "兴平市",
            "610482": "其它区",
            "610500": "渭南市",
            "610502": "临渭区",
            "610521": "华县",
            "610522": "潼关县",
            "610523": "大荔县",
            "610524": "合阳县",
            "610525": "澄城县",
            "610526": "蒲城县",
            "610527": "白水县",
            "610528": "富平县",
            "610581": "韩城市",
            "610582": "华阴市",
            "610583": "其它区",
            "610600": "延安市",
            "610602": "宝塔区",
            "610621": "延长县",
            "610622": "延川县",
            "610623": "子长县",
            "610624": "安塞县",
            "610625": "志丹县",
            "610626": "吴起县",
            "610627": "甘泉县",
            "610628": "富县",
            "610629": "洛川县",
            "610630": "宜川县",
            "610631": "黄龙县",
            "610632": "黄陵县",
            "610633": "其它区",
            "610700": "汉中市",
            "610702": "汉台区",
            "610721": "南郑县",
            "610722": "城固县",
            "610723": "洋县",
            "610724": "西乡县",
            "610725": "勉县",
            "610726": "宁强县",
            "610727": "略阳县",
            "610728": "镇巴县",
            "610729": "留坝县",
            "610730": "佛坪县",
            "610731": "其它区",
            "610800": "榆林市",
            "610802": "榆阳区",
            "610821": "神木县",
            "610822": "府谷县",
            "610823": "横山县",
            "610824": "靖边县",
            "610825": "定边县",
            "610826": "绥德县",
            "610827": "米脂县",
            "610828": "佳县",
            "610829": "吴堡县",
            "610830": "清涧县",
            "610831": "子洲县",
            "610832": "其它区",
            "610900": "安康市",
            "610902": "汉滨区",
            "610921": "汉阴县",
            "610922": "石泉县",
            "610923": "宁陕县",
            "610924": "紫阳县",
            "610925": "岚皋县",
            "610926": "平利县",
            "610927": "镇坪县",
            "610928": "旬阳县",
            "610929": "白河县",
            "610930": "其它区",
            "611000": "商洛市",
            "611002": "商州区",
            "611021": "洛南县",
            "611022": "丹凤县",
            "611023": "商南县",
            "611024": "山阳县",
            "611025": "镇安县",
            "611026": "柞水县",
            "611027": "其它区",
            "620000": "甘肃省",
            "620100": "兰州市",
            "620102": "城关区",
            "620103": "七里河区",
            "620104": "西固区",
            "620105": "安宁区",
            "620111": "红古区",
            "620121": "永登县",
            "620122": "皋兰县",
            "620123": "榆中县",
            "620124": "其它区",
            "620200": "嘉峪关市",
            "620300": "金昌市",
            "620302": "金川区",
            "620321": "永昌县",
            "620322": "其它区",
            "620400": "白银市",
            "620402": "白银区",
            "620403": "平川区",
            "620421": "靖远县",
            "620422": "会宁县",
            "620423": "景泰县",
            "620424": "其它区",
            "620500": "天水市",
            "620502": "秦州区",
            "620503": "麦积区",
            "620521": "清水县",
            "620522": "秦安县",
            "620523": "甘谷县",
            "620524": "武山县",
            "620525": "张家川回族自治县",
            "620526": "其它区",
            "620600": "武威市",
            "620602": "凉州区",
            "620621": "民勤县",
            "620622": "古浪县",
            "620623": "天祝藏族自治县",
            "620624": "其它区",
            "620700": "张掖市",
            "620702": "甘州区",
            "620721": "肃南裕固族自治县",
            "620722": "民乐县",
            "620723": "临泽县",
            "620724": "高台县",
            "620725": "山丹县",
            "620726": "其它区",
            "620800": "平凉市",
            "620802": "崆峒区",
            "620821": "泾川县",
            "620822": "灵台县",
            "620823": "崇信县",
            "620824": "华亭县",
            "620825": "庄浪县",
            "620826": "静宁县",
            "620827": "其它区",
            "620900": "酒泉市",
            "620902": "肃州区",
            "620921": "金塔县",
            "620922": "瓜州县",
            "620923": "肃北蒙古族自治县",
            "620924": "阿克塞哈萨克族自治县",
            "620981": "玉门市",
            "620982": "敦煌市",
            "620983": "其它区",
            "621000": "庆阳市",
            "621002": "西峰区",
            "621021": "庆城县",
            "621022": "环县",
            "621023": "华池县",
            "621024": "合水县",
            "621025": "正宁县",
            "621026": "宁县",
            "621027": "镇原县",
            "621028": "其它区",
            "621100": "定西市",
            "621102": "安定区",
            "621121": "通渭县",
            "621122": "陇西县",
            "621123": "渭源县",
            "621124": "临洮县",
            "621125": "漳县",
            "621126": "岷县",
            "621127": "其它区",
            "621200": "陇南市",
            "621202": "武都区",
            "621221": "成县",
            "621222": "文县",
            "621223": "宕昌县",
            "621224": "康县",
            "621225": "西和县",
            "621226": "礼县",
            "621227": "徽县",
            "621228": "两当县",
            "621229": "其它区",
            "622900": "临夏回族自治州",
            "622901": "临夏市",
            "622921": "临夏县",
            "622922": "康乐县",
            "622923": "永靖县",
            "622924": "广河县",
            "622925": "和政县",
            "622926": "东乡族自治县",
            "622927": "积石山保安族东乡族撒拉族自治县",
            "622928": "其它区",
            "623000": "甘南藏族自治州",
            "623001": "合作市",
            "623021": "临潭县",
            "623022": "卓尼县",
            "623023": "舟曲县",
            "623024": "迭部县",
            "623025": "玛曲县",
            "623026": "碌曲县",
            "623027": "夏河县",
            "623028": "其它区",
            "630000": "青海省",
            "630100": "西宁市",
            "630102": "城东区",
            "630103": "城中区",
            "630104": "城西区",
            "630105": "城北区",
            "630121": "大通回族土族自治县",
            "630122": "湟中县",
            "630123": "湟源县",
            "630124": "其它区",
            "632100": "海东市",
            "632121": "平安县",
            "632122": "民和回族土族自治县",
            "632123": "乐都区",
            "632126": "互助土族自治县",
            "632127": "化隆回族自治县",
            "632128": "循化撒拉族自治县",
            "632129": "其它区",
            "632200": "海北藏族自治州",
            "632221": "门源回族自治县",
            "632222": "祁连县",
            "632223": "海晏县",
            "632224": "刚察县",
            "632225": "其它区",
            "632300": "黄南藏族自治州",
            "632321": "同仁县",
            "632322": "尖扎县",
            "632323": "泽库县",
            "632324": "河南蒙古族自治县",
            "632325": "其它区",
            "632500": "海南藏族自治州",
            "632521": "共和县",
            "632522": "同德县",
            "632523": "贵德县",
            "632524": "兴海县",
            "632525": "贵南县",
            "632526": "其它区",
            "632600": "果洛藏族自治州",
            "632621": "玛沁县",
            "632622": "班玛县",
            "632623": "甘德县",
            "632624": "达日县",
            "632625": "久治县",
            "632626": "玛多县",
            "632627": "其它区",
            "632700": "玉树藏族自治州",
            "632721": "玉树市",
            "632722": "杂多县",
            "632723": "称多县",
            "632724": "治多县",
            "632725": "囊谦县",
            "632726": "曲麻莱县",
            "632727": "其它区",
            "632800": "海西蒙古族藏族自治州",
            "632801": "格尔木市",
            "632802": "德令哈市",
            "632821": "乌兰县",
            "632822": "都兰县",
            "632823": "天峻县",
            "632824": "其它区",
            "640000": "宁夏回族自治区",
            "640100": "银川市",
            "640104": "兴庆区",
            "640105": "西夏区",
            "640106": "金凤区",
            "640121": "永宁县",
            "640122": "贺兰县",
            "640181": "灵武市",
            "640182": "其它区",
            "640200": "石嘴山市",
            "640202": "大武口区",
            "640205": "惠农区",
            "640221": "平罗县",
            "640222": "其它区",
            "640300": "吴忠市",
            "640302": "利通区",
            "640303": "红寺堡区",
            "640323": "盐池县",
            "640324": "同心县",
            "640381": "青铜峡市",
            "640382": "其它区",
            "640400": "固原市",
            "640402": "原州区",
            "640422": "西吉县",
            "640423": "隆德县",
            "640424": "泾源县",
            "640425": "彭阳县",
            "640426": "其它区",
            "640500": "中卫市",
            "640502": "沙坡头区",
            "640521": "中宁县",
            "640522": "海原县",
            "640523": "其它区",
            "650000": "新疆维吾尔自治区",
            "650100": "乌鲁木齐市",
            "650102": "天山区",
            "650103": "沙依巴克区",
            "650104": "新市区",
            "650105": "水磨沟区",
            "650106": "头屯河区",
            "650107": "达坂城区",
            "650109": "米东区",
            "650121": "乌鲁木齐县",
            "650122": "其它区",
            "650200": "克拉玛依市",
            "650202": "独山子区",
            "650203": "克拉玛依区",
            "650204": "白碱滩区",
            "650205": "乌尔禾区",
            "650206": "其它区",
            "652100": "吐鲁番地区",
            "652101": "吐鲁番市",
            "652122": "鄯善县",
            "652123": "托克逊县",
            "652124": "其它区",
            "652200": "哈密地区",
            "652201": "哈密市",
            "652222": "巴里坤哈萨克自治县",
            "652223": "伊吾县",
            "652224": "其它区",
            "652300": "昌吉回族自治州",
            "652301": "昌吉市",
            "652302": "阜康市",
            "652323": "呼图壁县",
            "652324": "玛纳斯县",
            "652325": "奇台县",
            "652327": "吉木萨尔县",
            "652328": "木垒哈萨克自治县",
            "652329": "其它区",
            "652700": "博尔塔拉蒙古自治州",
            "652701": "博乐市",
            "652702": "阿拉山口市",
            "652722": "精河县",
            "652723": "温泉县",
            "652724": "其它区",
            "652800": "巴音郭楞蒙古自治州",
            "652801": "库尔勒市",
            "652822": "轮台县",
            "652823": "尉犁县",
            "652824": "若羌县",
            "652825": "且末县",
            "652826": "焉耆回族自治县",
            "652827": "和静县",
            "652828": "和硕县",
            "652829": "博湖县",
            "652830": "其它区",
            "652900": "阿克苏地区",
            "652901": "阿克苏市",
            "652922": "温宿县",
            "652923": "库车县",
            "652924": "沙雅县",
            "652925": "新和县",
            "652926": "拜城县",
            "652927": "乌什县",
            "652928": "阿瓦提县",
            "652929": "柯坪县",
            "652930": "其它区",
            "653000": "克孜勒苏柯尔克孜自治州",
            "653001": "阿图什市",
            "653022": "阿克陶县",
            "653023": "阿合奇县",
            "653024": "乌恰县",
            "653025": "其它区",
            "653100": "喀什地区",
            "653101": "喀什市",
            "653121": "疏附县",
            "653122": "疏勒县",
            "653123": "英吉沙县",
            "653124": "泽普县",
            "653125": "莎车县",
            "653126": "叶城县",
            "653127": "麦盖提县",
            "653128": "岳普湖县",
            "653129": "伽师县",
            "653130": "巴楚县",
            "653131": "塔什库尔干塔吉克自治县",
            "653132": "其它区",
            "653200": "和田地区",
            "653201": "和田市",
            "653221": "和田县",
            "653222": "墨玉县",
            "653223": "皮山县",
            "653224": "洛浦县",
            "653225": "策勒县",
            "653226": "于田县",
            "653227": "民丰县",
            "653228": "其它区",
            "654000": "伊犁哈萨克自治州",
            "654002": "伊宁市",
            "654003": "奎屯市",
            "654021": "伊宁县",
            "654022": "察布查尔锡伯自治县",
            "654023": "霍城县",
            "654024": "巩留县",
            "654025": "新源县",
            "654026": "昭苏县",
            "654027": "特克斯县",
            "654028": "尼勒克县",
            "654029": "其它区",
            "654200": "塔城地区",
            "654201": "塔城市",
            "654202": "乌苏市",
            "654221": "额敏县",
            "654223": "沙湾县",
            "654224": "托里县",
            "654225": "裕民县",
            "654226": "和布克赛尔蒙古自治县",
            "654227": "其它区",
            "654300": "阿勒泰地区",
            "654301": "阿勒泰市",
            "654321": "布尔津县",
            "654322": "富蕴县",
            "654323": "福海县",
            "654324": "哈巴河县",
            "654325": "青河县",
            "654326": "吉木乃县",
            "654327": "其它区",
            "659001": "石河子市",
            "659002": "阿拉尔市",
            "659003": "图木舒克市",
            "659004": "五家渠市",
            "710000": "台湾",
            "710100": "台北市",
            "710101": "中正区",
            "710102": "大同区",
            "710103": "中山区",
            "710104": "松山区",
            "710105": "大安区",
            "710106": "万华区",
            "710107": "信义区",
            "710108": "士林区",
            "710109": "北投区",
            "710110": "内湖区",
            "710111": "南港区",
            "710112": "文山区",
            "710113": "其它区",
            "710200": "高雄市",
            "710201": "新兴区",
            "710202": "前金区",
            "710203": "芩雅区",
            "710204": "盐埕区",
            "710205": "鼓山区",
            "710206": "旗津区",
            "710207": "前镇区",
            "710208": "三民区",
            "710209": "左营区",
            "710210": "楠梓区",
            "710211": "小港区",
            "710212": "其它区",
            "710241": "苓雅区",
            "710242": "仁武区",
            "710243": "大社区",
            "710244": "冈山区",
            "710245": "路竹区",
            "710246": "阿莲区",
            "710247": "田寮区",
            "710248": "燕巢区",
            "710249": "桥头区",
            "710250": "梓官区",
            "710251": "弥陀区",
            "710252": "永安区",
            "710253": "湖内区",
            "710254": "凤山区",
            "710255": "大寮区",
            "710256": "林园区",
            "710257": "鸟松区",
            "710258": "大树区",
            "710259": "旗山区",
            "710260": "美浓区",
            "710261": "六龟区",
            "710262": "内门区",
            "710263": "杉林区",
            "710264": "甲仙区",
            "710265": "桃源区",
            "710266": "那玛夏区",
            "710267": "茂林区",
            "710268": "茄萣区",
            "710300": "台南市",
            "710301": "中西区",
            "710302": "东区",
            "710303": "南区",
            "710304": "北区",
            "710305": "安平区",
            "710306": "安南区",
            "710307": "其它区",
            "710339": "永康区",
            "710340": "归仁区",
            "710341": "新化区",
            "710342": "左镇区",
            "710343": "玉井区",
            "710344": "楠西区",
            "710345": "南化区",
            "710346": "仁德区",
            "710347": "关庙区",
            "710348": "龙崎区",
            "710349": "官田区",
            "710350": "麻豆区",
            "710351": "佳里区",
            "710352": "西港区",
            "710353": "七股区",
            "710354": "将军区",
            "710355": "学甲区",
            "710356": "北门区",
            "710357": "新营区",
            "710358": "后壁区",
            "710359": "白河区",
            "710360": "东山区",
            "710361": "六甲区",
            "710362": "下营区",
            "710363": "柳营区",
            "710364": "盐水区",
            "710365": "善化区",
            "710366": "大内区",
            "710367": "山上区",
            "710368": "新市区",
            "710369": "安定区",
            "710400": "台中市",
            "710401": "中区",
            "710402": "东区",
            "710403": "南区",
            "710404": "西区",
            "710405": "北区",
            "710406": "北屯区",
            "710407": "西屯区",
            "710408": "南屯区",
            "710409": "其它区",
            "710431": "太平区",
            "710432": "大里区",
            "710433": "雾峰区",
            "710434": "乌日区",
            "710435": "丰原区",
            "710436": "后里区",
            "710437": "石冈区",
            "710438": "东势区",
            "710439": "和平区",
            "710440": "新社区",
            "710441": "潭子区",
            "710442": "大雅区",
            "710443": "神冈区",
            "710444": "大肚区",
            "710445": "沙鹿区",
            "710446": "龙井区",
            "710447": "梧栖区",
            "710448": "清水区",
            "710449": "大甲区",
            "710450": "外埔区",
            "710451": "大安区",
            "710500": "金门县",
            "710507": "金沙镇",
            "710508": "金湖镇",
            "710509": "金宁乡",
            "710510": "金城镇",
            "710511": "烈屿乡",
            "710512": "乌坵乡",
            "710600": "南投县",
            "710614": "南投市",
            "710615": "中寮乡",
            "710616": "草屯镇",
            "710617": "国姓乡",
            "710618": "埔里镇",
            "710619": "仁爱乡",
            "710620": "名间乡",
            "710621": "集集镇",
            "710622": "水里乡",
            "710623": "鱼池乡",
            "710624": "信义乡",
            "710625": "竹山镇",
            "710626": "鹿谷乡",
            "710700": "基隆市",
            "710701": "仁爱区",
            "710702": "信义区",
            "710703": "中正区",
            "710704": "中山区",
            "710705": "安乐区",
            "710706": "暖暖区",
            "710707": "七堵区",
            "710708": "其它区",
            "710800": "新竹市",
            "710801": "东区",
            "710802": "北区",
            "710803": "香山区",
            "710804": "其它区",
            "710900": "嘉义市",
            "710901": "东区",
            "710902": "西区",
            "710903": "其它区",
            "711100": "新北市",
            "711130": "万里区",
            "711131": "金山区",
            "711132": "板桥区",
            "711133": "汐止区",
            "711134": "深坑区",
            "711135": "石碇区",
            "711136": "瑞芳区",
            "711137": "平溪区",
            "711138": "双溪区",
            "711139": "贡寮区",
            "711140": "新店区",
            "711141": "坪林区",
            "711142": "乌来区",
            "711143": "永和区",
            "711144": "中和区",
            "711145": "土城区",
            "711146": "三峡区",
            "711147": "树林区",
            "711148": "莺歌区",
            "711149": "三重区",
            "711150": "新庄区",
            "711151": "泰山区",
            "711152": "林口区",
            "711153": "芦洲区",
            "711154": "五股区",
            "711155": "八里区",
            "711156": "淡水区",
            "711157": "三芝区",
            "711158": "石门区",
            "711200": "宜兰县",
            "711214": "宜兰市",
            "711215": "头城镇",
            "711216": "礁溪乡",
            "711217": "壮围乡",
            "711218": "员山乡",
            "711219": "罗东镇",
            "711220": "三星乡",
            "711221": "大同乡",
            "711222": "五结乡",
            "711223": "冬山乡",
            "711224": "苏澳镇",
            "711225": "南澳乡",
            "711226": "钓鱼台",
            "711300": "新竹县",
            "711314": "竹北市",
            "711315": "湖口乡",
            "711316": "新丰乡",
            "711317": "新埔镇",
            "711318": "关西镇",
            "711319": "芎林乡",
            "711320": "宝山乡",
            "711321": "竹东镇",
            "711322": "五峰乡",
            "711323": "横山乡",
            "711324": "尖石乡",
            "711325": "北埔乡",
            "711326": "峨眉乡",
            "711400": "桃园县",
            "711414": "中坜市",
            "711415": "平镇市",
            "711416": "龙潭乡",
            "711417": "杨梅市",
            "711418": "新屋乡",
            "711419": "观音乡",
            "711420": "桃园市",
            "711421": "龟山乡",
            "711422": "八德市",
            "711423": "大溪镇",
            "711424": "复兴乡",
            "711425": "大园乡",
            "711426": "芦竹乡",
            "711500": "苗栗县",
            "711519": "竹南镇",
            "711520": "头份镇",
            "711521": "三湾乡",
            "711522": "南庄乡",
            "711523": "狮潭乡",
            "711524": "后龙镇",
            "711525": "通霄镇",
            "711526": "苑里镇",
            "711527": "苗栗市",
            "711528": "造桥乡",
            "711529": "头屋乡",
            "711530": "公馆乡",
            "711531": "大湖乡",
            "711532": "泰安乡",
            "711533": "铜锣乡",
            "711534": "三义乡",
            "711535": "西湖乡",
            "711536": "卓兰镇",
            "711700": "彰化县",
            "711727": "彰化市",
            "711728": "芬园乡",
            "711729": "花坛乡",
            "711730": "秀水乡",
            "711731": "鹿港镇",
            "711732": "福兴乡",
            "711733": "线西乡",
            "711734": "和美镇",
            "711735": "伸港乡",
            "711736": "员林镇",
            "711737": "社头乡",
            "711738": "永靖乡",
            "711739": "埔心乡",
            "711740": "溪湖镇",
            "711741": "大村乡",
            "711742": "埔盐乡",
            "711743": "田中镇",
            "711744": "北斗镇",
            "711745": "田尾乡",
            "711746": "埤头乡",
            "711747": "溪州乡",
            "711748": "竹塘乡",
            "711749": "二林镇",
            "711750": "大城乡",
            "711751": "芳苑乡",
            "711752": "二水乡",
            "711900": "嘉义县",
            "711919": "番路乡",
            "711920": "梅山乡",
            "711921": "竹崎乡",
            "711922": "阿里山乡",
            "711923": "中埔乡",
            "711924": "大埔乡",
            "711925": "水上乡",
            "711926": "鹿草乡",
            "711927": "太保市",
            "711928": "朴子市",
            "711929": "东石乡",
            "711930": "六脚乡",
            "711931": "新港乡",
            "711932": "民雄乡",
            "711933": "大林镇",
            "711934": "溪口乡",
            "711935": "义竹乡",
            "711936": "布袋镇",
            "712100": "云林县",
            "712121": "斗南镇",
            "712122": "大埤乡",
            "712123": "虎尾镇",
            "712124": "土库镇",
            "712125": "褒忠乡",
            "712126": "东势乡",
            "712127": "台西乡",
            "712128": "仑背乡",
            "712129": "麦寮乡",
            "712130": "斗六市",
            "712131": "林内乡",
            "712132": "古坑乡",
            "712133": "莿桐乡",
            "712134": "西螺镇",
            "712135": "二仑乡",
            "712136": "北港镇",
            "712137": "水林乡",
            "712138": "口湖乡",
            "712139": "四湖乡",
            "712140": "元长乡",
            "712400": "屏东县",
            "712434": "屏东市",
            "712435": "三地门乡",
            "712436": "雾台乡",
            "712437": "玛家乡",
            "712438": "九如乡",
            "712439": "里港乡",
            "712440": "高树乡",
            "712441": "盐埔乡",
            "712442": "长治乡",
            "712443": "麟洛乡",
            "712444": "竹田乡",
            "712445": "内埔乡",
            "712446": "万丹乡",
            "712447": "潮州镇",
            "712448": "泰武乡",
            "712449": "来义乡",
            "712450": "万峦乡",
            "712451": "崁顶乡",
            "712452": "新埤乡",
            "712453": "南州乡",
            "712454": "林边乡",
            "712455": "东港镇",
            "712456": "琉球乡",
            "712457": "佳冬乡",
            "712458": "新园乡",
            "712459": "枋寮乡",
            "712460": "枋山乡",
            "712461": "春日乡",
            "712462": "狮子乡",
            "712463": "车城乡",
            "712464": "牡丹乡",
            "712465": "恒春镇",
            "712466": "满州乡",
            "712500": "台东县",
            "712517": "台东市",
            "712518": "绿岛乡",
            "712519": "兰屿乡",
            "712520": "延平乡",
            "712521": "卑南乡",
            "712522": "鹿野乡",
            "712523": "关山镇",
            "712524": "海端乡",
            "712525": "池上乡",
            "712526": "东河乡",
            "712527": "成功镇",
            "712528": "长滨乡",
            "712529": "金峰乡",
            "712530": "大武乡",
            "712531": "达仁乡",
            "712532": "太麻里乡",
            "712600": "花莲县",
            "712615": "花莲市",
            "712616": "新城乡",
            "712617": "太鲁阁",
            "712618": "秀林乡",
            "712619": "吉安乡",
            "712620": "寿丰乡",
            "712621": "凤林镇",
            "712622": "光复乡",
            "712623": "丰滨乡",
            "712624": "瑞穗乡",
            "712625": "万荣乡",
            "712626": "玉里镇",
            "712627": "卓溪乡",
            "712628": "富里乡",
            "712700": "澎湖县",
            "712707": "马公市",
            "712708": "西屿乡",
            "712709": "望安乡",
            "712710": "七美乡",
            "712711": "白沙乡",
            "712712": "湖西乡",
            "712800": "连江县",
            "712805": "南竿乡",
            "712806": "北竿乡",
            "712807": "莒光乡",
            "712808": "东引乡",
            "810000": "香港特别行政区",
            "810100": "香港岛",
            "810101": "中西区",
            "810102": "湾仔",
            "810103": "东区",
            "810104": "南区",
            "810200": "九龙",
            "810201": "九龙城区",
            "810202": "油尖旺区",
            "810203": "深水埗区",
            "810204": "黄大仙区",
            "810205": "观塘区",
            "810300": "新界",
            "810301": "北区",
            "810302": "大埔区",
            "810303": "沙田区",
            "810304": "西贡区",
            "810305": "元朗区",
            "810306": "屯门区",
            "810307": "荃湾区",
            "810308": "葵青区",
            "810309": "离岛区",
            "820000": "澳门特别行政区",
            "820100": "澳门半岛",
            "820200": "离岛",
            "990000": "海外",
            "990100": "海外"
          };
          function tree(list) {
            var mapped = {};
            for (var i2 = 0, item; i2 < list.length; i2++) {
              item = list[i2];
              if (!item || !item.id)
                continue;
              mapped[item.id] = item;
            }
            var result = [];
            for (var ii = 0; ii < list.length; ii++) {
              item = list[ii];
              if (!item)
                continue;
              if (item.pid == void 0 && item.parentId == void 0) {
                result.push(item);
                continue;
              }
              var parent = mapped[item.pid] || mapped[item.parentId];
              if (!parent)
                continue;
              if (!parent.children)
                parent.children = [];
              parent.children.push(item);
            }
            return result;
          }
          var DICT_FIXED = function() {
            var fixed = [];
            for (var id in DICT) {
              var pid = id.slice(2, 6) === "0000" ? void 0 : id.slice(4, 6) == "00" ? id.slice(0, 2) + "0000" : id.slice(0, 4) + "00";
              fixed.push({
                id,
                pid,
                name: DICT[id]
              });
            }
            return tree(fixed);
          }();
          module2.exports = DICT_FIXED;
        },
        /* 19 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var DICT = __webpack_require__2(18);
          module2.exports = {
            // Dice
            d4: function() {
              return this.natural(1, 4);
            },
            d6: function() {
              return this.natural(1, 6);
            },
            d8: function() {
              return this.natural(1, 8);
            },
            d12: function() {
              return this.natural(1, 12);
            },
            d20: function() {
              return this.natural(1, 20);
            },
            d100: function() {
              return this.natural(1, 100);
            },
            /*
            			    随机生成一个 GUID。
            
            			    http://www.broofa.com/2008/09/javascript-uuid-function/
            			    [UUID 规范](http://www.ietf.org/rfc/rfc4122.txt)
            			        UUIDs (Universally Unique IDentifier)
            			        GUIDs (Globally Unique IDentifier)
            			        The formal definition of the UUID string representation is provided by the following ABNF [7]:
            			            UUID                   = time-low "-" time-mid "-"
            			                                   time-high-and-version "-"
            			                                   clock-seq-and-reserved
            			                                   clock-seq-low "-" node
            			            time-low               = 4hexOctet
            			            time-mid               = 2hexOctet
            			            time-high-and-version  = 2hexOctet
            			            clock-seq-and-reserved = hexOctet
            			            clock-seq-low          = hexOctet
            			            node                   = 6hexOctet
            			            hexOctet               = hexDigit hexDigit
            			            hexDigit =
            			                "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
            			                "a" / "b" / "c" / "d" / "e" / "f" /
            			                "A" / "B" / "C" / "D" / "E" / "F"
            			    
            			    https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349
            			*/
            guid: function() {
              var pool = "abcdefABCDEF1234567890", guid = this.string(pool, 8) + "-" + this.string(pool, 4) + "-" + this.string(pool, 4) + "-" + this.string(pool, 4) + "-" + this.string(pool, 12);
              return guid;
            },
            uuid: function() {
              return this.guid();
            },
            /*
            			    随机生成一个 18 位身份证。
            
            			    [身份证](http://baike.baidu.com/view/1697.htm#4)
            			        地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
            			    [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
            			*/
            id: function() {
              var id, sum = 0, rank = [
                "7",
                "9",
                "10",
                "5",
                "8",
                "4",
                "2",
                "1",
                "6",
                "3",
                "7",
                "9",
                "10",
                "5",
                "8",
                "4",
                "2"
              ], last = [
                "1",
                "0",
                "X",
                "9",
                "8",
                "7",
                "6",
                "5",
                "4",
                "3",
                "2"
              ];
              id = this.pick(DICT).id + this.date("yyyyMMdd") + this.string("number", 3);
              for (var i2 = 0; i2 < id.length; i2++) {
                sum += id[i2] * rank[i2];
              }
              id += last[sum % 11];
              return id;
            },
            /*
                生成一个全局的自增整数。
                类似自增主键（auto increment primary key）。
            */
            increment: /* @__PURE__ */ function() {
              var key2 = 0;
              return function(step) {
                return key2 += +step || 1;
              };
            }(),
            inc: function(step) {
              return this.increment(step);
            }
          };
        },
        /* 20 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Parser2 = __webpack_require__2(21);
          var Handler2 = __webpack_require__2(22);
          module2.exports = {
            Parser: Parser2,
            Handler: Handler2
          };
        },
        /* 21 */
        /***/
        function(module2, exports2) {
          function Token(n2) {
            this.type = n2, this.offset = Token.offset(), this.text = Token.text();
          }
          function Alternate(n2, l2) {
            Token.call(this, "alternate"), this.left = n2, this.right = l2;
          }
          function Match(n2) {
            Token.call(this, "match"), this.body = n2.filter(Boolean);
          }
          function Group(n2, l2) {
            Token.call(this, n2), this.body = l2;
          }
          function CaptureGroup(n2) {
            Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index2++), this.body = n2;
          }
          function Quantified(n2, l2) {
            Token.call(this, "quantified"), this.body = n2, this.quantifier = l2;
          }
          function Quantifier(n2, l2) {
            Token.call(this, "quantifier"), this.min = n2, this.max = l2, this.greedy = true;
          }
          function CharSet(n2, l2) {
            Token.call(this, "charset"), this.invert = n2, this.body = l2;
          }
          function CharacterRange(n2, l2) {
            Token.call(this, "range"), this.start = n2, this.end = l2;
          }
          function Literal(n2) {
            Token.call(this, "literal"), this.body = n2, this.escaped = this.body != this.text;
          }
          function Unicode(n2) {
            Token.call(this, "unicode"), this.code = n2.toUpperCase();
          }
          function Hex(n2) {
            Token.call(this, "hex"), this.code = n2.toUpperCase();
          }
          function Octal(n2) {
            Token.call(this, "octal"), this.code = n2.toUpperCase();
          }
          function BackReference(n2) {
            Token.call(this, "back-reference"), this.code = n2.toUpperCase();
          }
          function ControlCharacter(n2) {
            Token.call(this, "control-character"), this.code = n2.toUpperCase();
          }
          var parser = function() {
            function n2(n3, l3) {
              function u3() {
                this.constructor = n3;
              }
              u3.prototype = l3.prototype, n3.prototype = new u3();
            }
            function l2(n3, l3, u3, t2, r2) {
              function e2(n4, l4) {
                function u4(n5) {
                  function l5(n6) {
                    return n6.charCodeAt(0).toString(16).toUpperCase();
                  }
                  return n5.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n6) {
                    return "\\x0" + l5(n6);
                  }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n6) {
                    return "\\x" + l5(n6);
                  }).replace(/[\u0180-\u0FFF]/g, function(n6) {
                    return "\\u0" + l5(n6);
                  }).replace(/[\u1080-\uFFFF]/g, function(n6) {
                    return "\\u" + l5(n6);
                  });
                }
                var t3, r3;
                switch (n4.length) {
                  case 0:
                    t3 = "end of input";
                    break;
                  case 1:
                    t3 = n4[0];
                    break;
                  default:
                    t3 = n4.slice(0, -1).join(", ") + " or " + n4[n4.length - 1];
                }
                return r3 = l4 ? '"' + u4(l4) + '"' : "end of input", "Expected " + t3 + " but " + r3 + " found.";
              }
              this.expected = n3, this.found = l3, this.offset = u3, this.line = t2, this.column = r2, this.name = "SyntaxError", this.message = e2(n3, l3);
            }
            function u2(n3) {
              function u3() {
                return n3.substring(Lt2, qt2);
              }
              function t2() {
                return Lt2;
              }
              function r2(l3) {
                function u4(l4, u5, t3) {
                  var r3, e3;
                  for (r3 = u5; t3 > r3; r3++)
                    e3 = n3.charAt(r3), "\n" === e3 ? (l4.seenCR || l4.line++, l4.column = 1, l4.seenCR = false) : "\r" === e3 || "\u2028" === e3 || "\u2029" === e3 ? (l4.line++, l4.column = 1, l4.seenCR = true) : (l4.column++, l4.seenCR = false);
                }
                return Mt2 !== l3 && (Mt2 > l3 && (Mt2 = 0, Dt2 = {
                  line: 1,
                  column: 1,
                  seenCR: false
                }), u4(Dt2, Mt2, l3), Mt2 = l3), Dt2;
              }
              function e2(n4) {
                Ht2 > qt2 || (qt2 > Ht2 && (Ht2 = qt2, Ot2 = []), Ot2.push(n4));
              }
              function o2(n4) {
                var l3 = 0;
                for (n4.sort(); l3 < n4.length; )
                  n4[l3 - 1] === n4[l3] ? n4.splice(l3, 1) : l3++;
              }
              function c2() {
                var l3, u4, t3, r3, o3;
                return l3 = qt2, u4 = i2(), null !== u4 ? (t3 = qt2, 124 === n3.charCodeAt(qt2) ? (r3 = fl, qt2++) : (r3 = null, 0 === Wt2 && e2(sl)), null !== r3 ? (o3 = c2(), null !== o3 ? (r3 = [r3, o3], t3 = r3) : (qt2 = t3, t3 = il)) : (qt2 = t3, t3 = il), null === t3 && (t3 = al), null !== t3 ? (Lt2 = l3, u4 = hl(u4, t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function i2() {
                var n4, l3, u4, t3, r3;
                if (n4 = qt2, l3 = f2(), null === l3 && (l3 = al), null !== l3)
                  if (u4 = qt2, Wt2++, t3 = d2(), Wt2--, null === t3 ? u4 = al : (qt2 = u4, u4 = il), null !== u4) {
                    for (t3 = [], r3 = h2(), null === r3 && (r3 = a2()); null !== r3; )
                      t3.push(r3), r3 = h2(), null === r3 && (r3 = a2());
                    null !== t3 ? (r3 = s2(), null === r3 && (r3 = al), null !== r3 ? (Lt2 = n4, l3 = dl(l3, t3, r3), null === l3 ? (qt2 = n4, n4 = l3) : n4 = l3) : (qt2 = n4, n4 = il)) : (qt2 = n4, n4 = il);
                  } else
                    qt2 = n4, n4 = il;
                else
                  qt2 = n4, n4 = il;
                return n4;
              }
              function a2() {
                var n4;
                return n4 = x(), null === n4 && (n4 = Q2(), null === n4 && (n4 = B2())), n4;
              }
              function f2() {
                var l3, u4;
                return l3 = qt2, 94 === n3.charCodeAt(qt2) ? (u4 = pl, qt2++) : (u4 = null, 0 === Wt2 && e2(vl)), null !== u4 && (Lt2 = l3, u4 = wl()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function s2() {
                var l3, u4;
                return l3 = qt2, 36 === n3.charCodeAt(qt2) ? (u4 = Al, qt2++) : (u4 = null, 0 === Wt2 && e2(Cl)), null !== u4 && (Lt2 = l3, u4 = gl()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function h2() {
                var n4, l3, u4;
                return n4 = qt2, l3 = a2(), null !== l3 ? (u4 = d2(), null !== u4 ? (Lt2 = n4, l3 = bl(l3, u4), null === l3 ? (qt2 = n4, n4 = l3) : n4 = l3) : (qt2 = n4, n4 = il)) : (qt2 = n4, n4 = il), n4;
              }
              function d2() {
                var n4, l3, u4;
                return Wt2++, n4 = qt2, l3 = p2(), null !== l3 ? (u4 = k(), null === u4 && (u4 = al), null !== u4 ? (Lt2 = n4, l3 = Tl(l3, u4), null === l3 ? (qt2 = n4, n4 = l3) : n4 = l3) : (qt2 = n4, n4 = il)) : (qt2 = n4, n4 = il), Wt2--, null === n4 && (l3 = null, 0 === Wt2 && e2(kl)), n4;
              }
              function p2() {
                var n4;
                return n4 = v2(), null === n4 && (n4 = w2(), null === n4 && (n4 = A2(), null === n4 && (n4 = C2(), null === n4 && (n4 = g2(), null === n4 && (n4 = b2()))))), n4;
              }
              function v2() {
                var l3, u4, t3, r3, o3, c3;
                return l3 = qt2, 123 === n3.charCodeAt(qt2) ? (u4 = xl, qt2++) : (u4 = null, 0 === Wt2 && e2(yl)), null !== u4 ? (t3 = T2(), null !== t3 ? (44 === n3.charCodeAt(qt2) ? (r3 = ml, qt2++) : (r3 = null, 0 === Wt2 && e2(Rl)), null !== r3 ? (o3 = T2(), null !== o3 ? (125 === n3.charCodeAt(qt2) ? (c3 = Fl, qt2++) : (c3 = null, 0 === Wt2 && e2(Ql)), null !== c3 ? (Lt2 = l3, u4 = Sl(t3, o3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function w2() {
                var l3, u4, t3, r3;
                return l3 = qt2, 123 === n3.charCodeAt(qt2) ? (u4 = xl, qt2++) : (u4 = null, 0 === Wt2 && e2(yl)), null !== u4 ? (t3 = T2(), null !== t3 ? (n3.substr(qt2, 2) === Ul ? (r3 = Ul, qt2 += 2) : (r3 = null, 0 === Wt2 && e2(El)), null !== r3 ? (Lt2 = l3, u4 = Gl(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function A2() {
                var l3, u4, t3, r3;
                return l3 = qt2, 123 === n3.charCodeAt(qt2) ? (u4 = xl, qt2++) : (u4 = null, 0 === Wt2 && e2(yl)), null !== u4 ? (t3 = T2(), null !== t3 ? (125 === n3.charCodeAt(qt2) ? (r3 = Fl, qt2++) : (r3 = null, 0 === Wt2 && e2(Ql)), null !== r3 ? (Lt2 = l3, u4 = Bl(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function C2() {
                var l3, u4;
                return l3 = qt2, 43 === n3.charCodeAt(qt2) ? (u4 = jl, qt2++) : (u4 = null, 0 === Wt2 && e2($l)), null !== u4 && (Lt2 = l3, u4 = ql()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function g2() {
                var l3, u4;
                return l3 = qt2, 42 === n3.charCodeAt(qt2) ? (u4 = Ll, qt2++) : (u4 = null, 0 === Wt2 && e2(Ml)), null !== u4 && (Lt2 = l3, u4 = Dl()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function b2() {
                var l3, u4;
                return l3 = qt2, 63 === n3.charCodeAt(qt2) ? (u4 = Hl, qt2++) : (u4 = null, 0 === Wt2 && e2(Ol)), null !== u4 && (Lt2 = l3, u4 = Wl()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function k() {
                var l3;
                return 63 === n3.charCodeAt(qt2) ? (l3 = Hl, qt2++) : (l3 = null, 0 === Wt2 && e2(Ol)), l3;
              }
              function T2() {
                var l3, u4, t3;
                if (l3 = qt2, u4 = [], zl.test(n3.charAt(qt2)) ? (t3 = n3.charAt(qt2), qt2++) : (t3 = null, 0 === Wt2 && e2(Il)), null !== t3)
                  for (; null !== t3; )
                    u4.push(t3), zl.test(n3.charAt(qt2)) ? (t3 = n3.charAt(qt2), qt2++) : (t3 = null, 0 === Wt2 && e2(Il));
                else
                  u4 = il;
                return null !== u4 && (Lt2 = l3, u4 = Jl(u4)), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function x() {
                var l3, u4, t3, r3;
                return l3 = qt2, 40 === n3.charCodeAt(qt2) ? (u4 = Kl, qt2++) : (u4 = null, 0 === Wt2 && e2(Nl)), null !== u4 ? (t3 = R2(), null === t3 && (t3 = F2(), null === t3 && (t3 = m2(), null === t3 && (t3 = y2()))), null !== t3 ? (41 === n3.charCodeAt(qt2) ? (r3 = Pl, qt2++) : (r3 = null, 0 === Wt2 && e2(Vl)), null !== r3 ? (Lt2 = l3, u4 = Xl(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function y2() {
                var n4, l3;
                return n4 = qt2, l3 = c2(), null !== l3 && (Lt2 = n4, l3 = Yl(l3)), null === l3 ? (qt2 = n4, n4 = l3) : n4 = l3, n4;
              }
              function m2() {
                var l3, u4, t3;
                return l3 = qt2, n3.substr(qt2, 2) === Zl ? (u4 = Zl, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(_l)), null !== u4 ? (t3 = c2(), null !== t3 ? (Lt2 = l3, u4 = nu(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function R2() {
                var l3, u4, t3;
                return l3 = qt2, n3.substr(qt2, 2) === lu ? (u4 = lu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(uu)), null !== u4 ? (t3 = c2(), null !== t3 ? (Lt2 = l3, u4 = tu(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function F2() {
                var l3, u4, t3;
                return l3 = qt2, n3.substr(qt2, 2) === ru ? (u4 = ru, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(eu)), null !== u4 ? (t3 = c2(), null !== t3 ? (Lt2 = l3, u4 = ou(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function Q2() {
                var l3, u4, t3, r3, o3;
                if (Wt2++, l3 = qt2, 91 === n3.charCodeAt(qt2) ? (u4 = iu, qt2++) : (u4 = null, 0 === Wt2 && e2(au)), null !== u4)
                  if (94 === n3.charCodeAt(qt2) ? (t3 = pl, qt2++) : (t3 = null, 0 === Wt2 && e2(vl)), null === t3 && (t3 = al), null !== t3) {
                    for (r3 = [], o3 = S2(), null === o3 && (o3 = U()); null !== o3; )
                      r3.push(o3), o3 = S2(), null === o3 && (o3 = U());
                    null !== r3 ? (93 === n3.charCodeAt(qt2) ? (o3 = fu, qt2++) : (o3 = null, 0 === Wt2 && e2(su)), null !== o3 ? (Lt2 = l3, u4 = hu(t3, r3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il);
                  } else
                    qt2 = l3, l3 = il;
                else
                  qt2 = l3, l3 = il;
                return Wt2--, null === l3 && (u4 = null, 0 === Wt2 && e2(cu)), l3;
              }
              function S2() {
                var l3, u4, t3, r3;
                return Wt2++, l3 = qt2, u4 = U(), null !== u4 ? (45 === n3.charCodeAt(qt2) ? (t3 = pu, qt2++) : (t3 = null, 0 === Wt2 && e2(vu)), null !== t3 ? (r3 = U(), null !== r3 ? (Lt2 = l3, u4 = wu(u4, r3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), Wt2--, null === l3 && (u4 = null, 0 === Wt2 && e2(du)), l3;
              }
              function U() {
                var n4;
                return Wt2++, n4 = G2(), null === n4 && (n4 = E2()), Wt2--, null === n4 && (0 === Wt2 && e2(Au)), n4;
              }
              function E2() {
                var l3, u4;
                return l3 = qt2, Cu.test(n3.charAt(qt2)) ? (u4 = n3.charAt(qt2), qt2++) : (u4 = null, 0 === Wt2 && e2(gu)), null !== u4 && (Lt2 = l3, u4 = bu(u4)), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function G2() {
                var n4;
                return n4 = L2(), null === n4 && (n4 = Y2(), null === n4 && (n4 = H2(), null === n4 && (n4 = O2(), null === n4 && (n4 = W2(), null === n4 && (n4 = z2(), null === n4 && (n4 = I2(), null === n4 && (n4 = J2(), null === n4 && (n4 = K2(), null === n4 && (n4 = N2(), null === n4 && (n4 = P2(), null === n4 && (n4 = V2(), null === n4 && (n4 = X2(), null === n4 && (n4 = _2(), null === n4 && (n4 = nl(), null === n4 && (n4 = ll(), null === n4 && (n4 = ul(), null === n4 && (n4 = tl()))))))))))))))))), n4;
              }
              function B2() {
                var n4;
                return n4 = j2(), null === n4 && (n4 = q2(), null === n4 && (n4 = $2())), n4;
              }
              function j2() {
                var l3, u4;
                return l3 = qt2, 46 === n3.charCodeAt(qt2) ? (u4 = ku, qt2++) : (u4 = null, 0 === Wt2 && e2(Tu)), null !== u4 && (Lt2 = l3, u4 = xu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function $2() {
                var l3, u4;
                return Wt2++, l3 = qt2, mu.test(n3.charAt(qt2)) ? (u4 = n3.charAt(qt2), qt2++) : (u4 = null, 0 === Wt2 && e2(Ru)), null !== u4 && (Lt2 = l3, u4 = bu(u4)), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, Wt2--, null === l3 && (u4 = null, 0 === Wt2 && e2(yu)), l3;
              }
              function q2() {
                var n4;
                return n4 = M2(), null === n4 && (n4 = D2(), null === n4 && (n4 = Y2(), null === n4 && (n4 = H2(), null === n4 && (n4 = O2(), null === n4 && (n4 = W2(), null === n4 && (n4 = z2(), null === n4 && (n4 = I2(), null === n4 && (n4 = J2(), null === n4 && (n4 = K2(), null === n4 && (n4 = N2(), null === n4 && (n4 = P2(), null === n4 && (n4 = V2(), null === n4 && (n4 = X2(), null === n4 && (n4 = Z2(), null === n4 && (n4 = _2(), null === n4 && (n4 = nl(), null === n4 && (n4 = ll(), null === n4 && (n4 = ul(), null === n4 && (n4 = tl()))))))))))))))))))), n4;
              }
              function L2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Fu ? (u4 = Fu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Qu)), null !== u4 && (Lt2 = l3, u4 = Su()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function M2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Fu ? (u4 = Fu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Qu)), null !== u4 && (Lt2 = l3, u4 = Uu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function D2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Eu ? (u4 = Eu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Gu)), null !== u4 && (Lt2 = l3, u4 = Bu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function H2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === ju ? (u4 = ju, qt2 += 2) : (u4 = null, 0 === Wt2 && e2($u)), null !== u4 && (Lt2 = l3, u4 = qu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function O2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Lu ? (u4 = Lu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Mu)), null !== u4 && (Lt2 = l3, u4 = Du()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function W2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Hu ? (u4 = Hu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Ou)), null !== u4 && (Lt2 = l3, u4 = Wu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function z2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === zu ? (u4 = zu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Iu)), null !== u4 && (Lt2 = l3, u4 = Ju()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function I2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Ku ? (u4 = Ku, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Nu)), null !== u4 && (Lt2 = l3, u4 = Pu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function J2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Vu ? (u4 = Vu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Xu)), null !== u4 && (Lt2 = l3, u4 = Yu()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function K2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Zu ? (u4 = Zu, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(_u)), null !== u4 && (Lt2 = l3, u4 = nt2()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function N2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === lt2 ? (u4 = lt2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(ut2)), null !== u4 && (Lt2 = l3, u4 = tt2()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function P2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === rt2 ? (u4 = rt2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(et2)), null !== u4 && (Lt2 = l3, u4 = ot2()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function V2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === ct2 ? (u4 = ct2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(it2)), null !== u4 && (Lt2 = l3, u4 = at2()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function X2() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === ft2 ? (u4 = ft2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(st2)), null !== u4 && (Lt2 = l3, u4 = ht2()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function Y2() {
                var l3, u4, t3;
                return l3 = qt2, n3.substr(qt2, 2) === dt2 ? (u4 = dt2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(pt2)), null !== u4 ? (n3.length > qt2 ? (t3 = n3.charAt(qt2), qt2++) : (t3 = null, 0 === Wt2 && e2(vt2)), null !== t3 ? (Lt2 = l3, u4 = wt2(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function Z2() {
                var l3, u4, t3;
                return l3 = qt2, 92 === n3.charCodeAt(qt2) ? (u4 = At2, qt2++) : (u4 = null, 0 === Wt2 && e2(Ct2)), null !== u4 ? (gt2.test(n3.charAt(qt2)) ? (t3 = n3.charAt(qt2), qt2++) : (t3 = null, 0 === Wt2 && e2(bt2)), null !== t3 ? (Lt2 = l3, u4 = kt2(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              function _2() {
                var l3, u4, t3, r3;
                if (l3 = qt2, n3.substr(qt2, 2) === Tt2 ? (u4 = Tt2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(xt2)), null !== u4) {
                  if (t3 = [], yt2.test(n3.charAt(qt2)) ? (r3 = n3.charAt(qt2), qt2++) : (r3 = null, 0 === Wt2 && e2(mt2)), null !== r3)
                    for (; null !== r3; )
                      t3.push(r3), yt2.test(n3.charAt(qt2)) ? (r3 = n3.charAt(qt2), qt2++) : (r3 = null, 0 === Wt2 && e2(mt2));
                  else
                    t3 = il;
                  null !== t3 ? (Lt2 = l3, u4 = Rt2(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il);
                } else
                  qt2 = l3, l3 = il;
                return l3;
              }
              function nl() {
                var l3, u4, t3, r3;
                if (l3 = qt2, n3.substr(qt2, 2) === Ft2 ? (u4 = Ft2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Qt)), null !== u4) {
                  if (t3 = [], St2.test(n3.charAt(qt2)) ? (r3 = n3.charAt(qt2), qt2++) : (r3 = null, 0 === Wt2 && e2(Ut2)), null !== r3)
                    for (; null !== r3; )
                      t3.push(r3), St2.test(n3.charAt(qt2)) ? (r3 = n3.charAt(qt2), qt2++) : (r3 = null, 0 === Wt2 && e2(Ut2));
                  else
                    t3 = il;
                  null !== t3 ? (Lt2 = l3, u4 = Et2(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il);
                } else
                  qt2 = l3, l3 = il;
                return l3;
              }
              function ll() {
                var l3, u4, t3, r3;
                if (l3 = qt2, n3.substr(qt2, 2) === Gt2 ? (u4 = Gt2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(Bt2)), null !== u4) {
                  if (t3 = [], St2.test(n3.charAt(qt2)) ? (r3 = n3.charAt(qt2), qt2++) : (r3 = null, 0 === Wt2 && e2(Ut2)), null !== r3)
                    for (; null !== r3; )
                      t3.push(r3), St2.test(n3.charAt(qt2)) ? (r3 = n3.charAt(qt2), qt2++) : (r3 = null, 0 === Wt2 && e2(Ut2));
                  else
                    t3 = il;
                  null !== t3 ? (Lt2 = l3, u4 = jt2(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il);
                } else
                  qt2 = l3, l3 = il;
                return l3;
              }
              function ul() {
                var l3, u4;
                return l3 = qt2, n3.substr(qt2, 2) === Tt2 ? (u4 = Tt2, qt2 += 2) : (u4 = null, 0 === Wt2 && e2(xt2)), null !== u4 && (Lt2 = l3, u4 = $t2()), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4, l3;
              }
              function tl() {
                var l3, u4, t3;
                return l3 = qt2, 92 === n3.charCodeAt(qt2) ? (u4 = At2, qt2++) : (u4 = null, 0 === Wt2 && e2(Ct2)), null !== u4 ? (n3.length > qt2 ? (t3 = n3.charAt(qt2), qt2++) : (t3 = null, 0 === Wt2 && e2(vt2)), null !== t3 ? (Lt2 = l3, u4 = bu(t3), null === u4 ? (qt2 = l3, l3 = u4) : l3 = u4) : (qt2 = l3, l3 = il)) : (qt2 = l3, l3 = il), l3;
              }
              var rl, el = arguments.length > 1 ? arguments[1] : {}, ol = {
                regexp: c2
              }, cl = c2, il = null, al = "", fl = "|", sl = '"|"', hl = function(n4, l3) {
                return l3 ? new Alternate(n4, l3[1]) : n4;
              }, dl = function(n4, l3, u4) {
                return new Match([n4].concat(l3).concat([u4]));
              }, pl = "^", vl = '"^"', wl = function() {
                return new Token("start");
              }, Al = "$", Cl = '"$"', gl = function() {
                return new Token("end");
              }, bl = function(n4, l3) {
                return new Quantified(n4, l3);
              }, kl = "Quantifier", Tl = function(n4, l3) {
                return l3 && (n4.greedy = false), n4;
              }, xl = "{", yl = '"{"', ml = ",", Rl = '","', Fl = "}", Ql = '"}"', Sl = function(n4, l3) {
                return new Quantifier(n4, l3);
              }, Ul = ",}", El = '",}"', Gl = function(n4) {
                return new Quantifier(n4, 1 / 0);
              }, Bl = function(n4) {
                return new Quantifier(n4, n4);
              }, jl = "+", $l = '"+"', ql = function() {
                return new Quantifier(1, 1 / 0);
              }, Ll = "*", Ml = '"*"', Dl = function() {
                return new Quantifier(0, 1 / 0);
              }, Hl = "?", Ol = '"?"', Wl = function() {
                return new Quantifier(0, 1);
              }, zl = /^[0-9]/, Il = "[0-9]", Jl = function(n4) {
                return +n4.join("");
              }, Kl = "(", Nl = '"("', Pl = ")", Vl = '")"', Xl = function(n4) {
                return n4;
              }, Yl = function(n4) {
                return new CaptureGroup(n4);
              }, Zl = "?:", _l = '"?:"', nu = function(n4) {
                return new Group("non-capture-group", n4);
              }, lu = "?=", uu = '"?="', tu = function(n4) {
                return new Group("positive-lookahead", n4);
              }, ru = "?!", eu = '"?!"', ou = function(n4) {
                return new Group("negative-lookahead", n4);
              }, cu = "CharacterSet", iu = "[", au = '"["', fu = "]", su = '"]"', hu = function(n4, l3) {
                return new CharSet(!!n4, l3);
              }, du = "CharacterRange", pu = "-", vu = '"-"', wu = function(n4, l3) {
                return new CharacterRange(n4, l3);
              }, Au = "Character", Cu = /^[^\\\]]/, gu = "[^\\\\\\]]", bu = function(n4) {
                return new Literal(n4);
              }, ku = ".", Tu = '"."', xu = function() {
                return new Token("any-character");
              }, yu = "Literal", mu = /^[^|\\\/.[()?+*$\^]/, Ru = "[^|\\\\\\/.[()?+*$\\^]", Fu = "\\b", Qu = '"\\\\b"', Su = function() {
                return new Token("backspace");
              }, Uu = function() {
                return new Token("word-boundary");
              }, Eu = "\\B", Gu = '"\\\\B"', Bu = function() {
                return new Token("non-word-boundary");
              }, ju = "\\d", $u = '"\\\\d"', qu = function() {
                return new Token("digit");
              }, Lu = "\\D", Mu = '"\\\\D"', Du = function() {
                return new Token("non-digit");
              }, Hu = "\\f", Ou = '"\\\\f"', Wu = function() {
                return new Token("form-feed");
              }, zu = "\\n", Iu = '"\\\\n"', Ju = function() {
                return new Token("line-feed");
              }, Ku = "\\r", Nu = '"\\\\r"', Pu = function() {
                return new Token("carriage-return");
              }, Vu = "\\s", Xu = '"\\\\s"', Yu = function() {
                return new Token("white-space");
              }, Zu = "\\S", _u = '"\\\\S"', nt2 = function() {
                return new Token("non-white-space");
              }, lt2 = "\\t", ut2 = '"\\\\t"', tt2 = function() {
                return new Token("tab");
              }, rt2 = "\\v", et2 = '"\\\\v"', ot2 = function() {
                return new Token("vertical-tab");
              }, ct2 = "\\w", it2 = '"\\\\w"', at2 = function() {
                return new Token("word");
              }, ft2 = "\\W", st2 = '"\\\\W"', ht2 = function() {
                return new Token("non-word");
              }, dt2 = "\\c", pt2 = '"\\\\c"', vt2 = "any character", wt2 = function(n4) {
                return new ControlCharacter(n4);
              }, At2 = "\\", Ct2 = '"\\\\"', gt2 = /^[1-9]/, bt2 = "[1-9]", kt2 = function(n4) {
                return new BackReference(n4);
              }, Tt2 = "\\0", xt2 = '"\\\\0"', yt2 = /^[0-7]/, mt2 = "[0-7]", Rt2 = function(n4) {
                return new Octal(n4.join(""));
              }, Ft2 = "\\x", Qt = '"\\\\x"', St2 = /^[0-9a-fA-F]/, Ut2 = "[0-9a-fA-F]", Et2 = function(n4) {
                return new Hex(n4.join(""));
              }, Gt2 = "\\u", Bt2 = '"\\\\u"', jt2 = function(n4) {
                return new Unicode(n4.join(""));
              }, $t2 = function() {
                return new Token("null-character");
              }, qt2 = 0, Lt2 = 0, Mt2 = 0, Dt2 = {
                line: 1,
                column: 1,
                seenCR: false
              }, Ht2 = 0, Ot2 = [], Wt2 = 0;
              if ("startRule" in el) {
                if (!(el.startRule in ol))
                  throw new Error(`Can't start parsing from rule "` + el.startRule + '".');
                cl = ol[el.startRule];
              }
              if (Token.offset = t2, Token.text = u3, rl = cl(), null !== rl && qt2 === n3.length)
                return rl;
              throw o2(Ot2), Lt2 = Math.max(qt2, Ht2), new l2(Ot2, Lt2 < n3.length ? n3.charAt(Lt2) : null, Lt2, r2(Lt2).line, r2(Lt2).column);
            }
            return n2(l2, Error), {
              SyntaxError: l2,
              parse: u2
            };
          }(), index2 = 1, cgs = {};
          module2.exports = parser;
        },
        /* 22 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Util2 = __webpack_require__2(3);
          var Random2 = __webpack_require__2(5);
          var Handler2 = {
            extend: Util2.extend
          };
          var LOWER = ascii(97, 122);
          var UPPER = ascii(65, 90);
          var NUMBER = ascii(48, 57);
          var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126);
          var PRINTABLE = ascii(32, 126);
          var SPACE = " \f\n\r	\v \u2028\u2029";
          var CHARACTER_CLASSES = {
            "\\w": LOWER + UPPER + NUMBER + "_",
            // ascii(95, 95)
            "\\W": OTHER.replace("_", ""),
            "\\s": SPACE,
            "\\S": function() {
              var result = PRINTABLE;
              for (var i2 = 0; i2 < SPACE.length; i2++) {
                result = result.replace(SPACE[i2], "");
              }
              return result;
            }(),
            "\\d": NUMBER,
            "\\D": LOWER + UPPER + OTHER
          };
          function ascii(from, to) {
            var result = "";
            for (var i2 = from; i2 <= to; i2++) {
              result += String.fromCharCode(i2);
            }
            return result;
          }
          Handler2.gen = function(node, result, cache) {
            cache = cache || {
              guid: 1
            };
            return Handler2[node.type] ? Handler2[node.type](node, result, cache) : Handler2.token(node, result, cache);
          };
          Handler2.extend({
            /* jshint unused:false */
            token: function(node, result, cache) {
              switch (node.type) {
                case "start":
                case "end":
                  return "";
                case "any-character":
                  return Random2.character();
                case "backspace":
                  return "";
                case "word-boundary":
                  return "";
                case "non-word-boundary":
                  break;
                case "digit":
                  return Random2.pick(
                    NUMBER.split("")
                  );
                case "non-digit":
                  return Random2.pick(
                    (LOWER + UPPER + OTHER).split("")
                  );
                case "form-feed":
                  break;
                case "line-feed":
                  return node.body || node.text;
                case "carriage-return":
                  break;
                case "white-space":
                  return Random2.pick(
                    SPACE.split("")
                  );
                case "non-white-space":
                  return Random2.pick(
                    (LOWER + UPPER + NUMBER).split("")
                  );
                case "tab":
                  break;
                case "vertical-tab":
                  break;
                case "word":
                  return Random2.pick(
                    (LOWER + UPPER + NUMBER).split("")
                  );
                case "non-word":
                  return Random2.pick(
                    OTHER.replace("_", "").split("")
                  );
              }
              return node.body || node.text;
            },
            /*
                {
                    type: 'alternate',
                    offset: 0,
                    text: '',
                    left: {
                        boyd: []
                    },
                    right: {
                        boyd: []
                    }
                }
            */
            alternate: function(node, result, cache) {
              return this.gen(
                Random2.boolean() ? node.left : node.right,
                result,
                cache
              );
            },
            /*
                {
                    type: 'match',
                    offset: 0,
                    text: '',
                    body: []
                }
            */
            match: function(node, result, cache) {
              result = "";
              for (var i2 = 0; i2 < node.body.length; i2++) {
                result += this.gen(node.body[i2], result, cache);
              }
              return result;
            },
            // ()
            "capture-group": function(node, result, cache) {
              result = this.gen(node.body, result, cache);
              cache[cache.guid++] = result;
              return result;
            },
            // (?:...)
            "non-capture-group": function(node, result, cache) {
              return this.gen(node.body, result, cache);
            },
            // (?=p)
            "positive-lookahead": function(node, result, cache) {
              return this.gen(node.body, result, cache);
            },
            // (?!p)
            "negative-lookahead": function(node, result, cache) {
              return "";
            },
            /*
                {
                    type: 'quantified',
                    offset: 3,
                    text: 'c*',
                    body: {
                        type: 'literal',
                        offset: 3,
                        text: 'c',
                        body: 'c',
                        escaped: false
                    },
                    quantifier: {
                        type: 'quantifier',
                        offset: 4,
                        text: '*',
                        min: 0,
                        max: Infinity,
                        greedy: true
                    }
                }
            */
            quantified: function(node, result, cache) {
              result = "";
              var count = this.quantifier(node.quantifier);
              for (var i2 = 0; i2 < count; i2++) {
                result += this.gen(node.body, result, cache);
              }
              return result;
            },
            /*
                quantifier: {
                    type: 'quantifier',
                    offset: 4,
                    text: '*',
                    min: 0,
                    max: Infinity,
                    greedy: true
                }
            */
            quantifier: function(node, result, cache) {
              var min = Math.max(node.min, 0);
              var max = isFinite(node.max) ? node.max : min + Random2.integer(3, 7);
              return Random2.integer(min, max);
            },
            /*
                
            */
            charset: function(node, result, cache) {
              if (node.invert)
                return this["invert-charset"](node, result, cache);
              var literal = Random2.pick(node.body);
              return this.gen(literal, result, cache);
            },
            "invert-charset": function(node, result, cache) {
              var pool = PRINTABLE;
              for (var i2 = 0, item; i2 < node.body.length; i2++) {
                item = node.body[i2];
                switch (item.type) {
                  case "literal":
                    pool = pool.replace(item.body, "");
                    break;
                  case "range":
                    var min = this.gen(item.start, result, cache).charCodeAt();
                    var max = this.gen(item.end, result, cache).charCodeAt();
                    for (var ii = min; ii <= max; ii++) {
                      pool = pool.replace(String.fromCharCode(ii), "");
                    }
                  default:
                    var characters = CHARACTER_CLASSES[item.text];
                    if (characters) {
                      for (var iii = 0; iii <= characters.length; iii++) {
                        pool = pool.replace(characters[iii], "");
                      }
                    }
                }
              }
              return Random2.pick(pool.split(""));
            },
            range: function(node, result, cache) {
              var min = this.gen(node.start, result, cache).charCodeAt();
              var max = this.gen(node.end, result, cache).charCodeAt();
              return String.fromCharCode(
                Random2.integer(min, max)
              );
            },
            literal: function(node, result, cache) {
              return node.escaped ? node.body : node.text;
            },
            // Unicode \u
            unicode: function(node, result, cache) {
              return String.fromCharCode(
                parseInt(node.code, 16)
              );
            },
            // 十六进制 \xFF
            hex: function(node, result, cache) {
              return String.fromCharCode(
                parseInt(node.code, 16)
              );
            },
            // 八进制 \0
            octal: function(node, result, cache) {
              return String.fromCharCode(
                parseInt(node.code, 8)
              );
            },
            // 反向引用
            "back-reference": function(node, result, cache) {
              return cache[node.code] || "";
            },
            /*
                http://en.wikipedia.org/wiki/C0_and_C1_control_codes
            */
            CONTROL_CHARACTER_MAP: function() {
              var CONTROL_CHARACTER = "@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _".split(" ");
              var CONTROL_CHARACTER_UNICODE = "\0       \x07 \b 	 \n \v \f \r              \x1B    ".split(" ");
              var map = {};
              for (var i2 = 0; i2 < CONTROL_CHARACTER.length; i2++) {
                map[CONTROL_CHARACTER[i2]] = CONTROL_CHARACTER_UNICODE[i2];
              }
              return map;
            }(),
            "control-character": function(node, result, cache) {
              return this.CONTROL_CHARACTER_MAP[node.code];
            }
          });
          module2.exports = Handler2;
        },
        /* 23 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          module2.exports = __webpack_require__2(24);
        },
        /* 24 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Constant2 = __webpack_require__2(2);
          var Util2 = __webpack_require__2(3);
          var Parser2 = __webpack_require__2(4);
          function toJSONSchema(template, name, path) {
            path = path || [];
            var result = {
              name: typeof name === "string" ? name.replace(Constant2.RE_KEY, "$1") : name,
              template,
              type: Util2.type(template),
              // 可能不准确，例如 { 'name|1': [{}, {} ...] }
              rule: Parser2.parse(name)
            };
            result.path = path.slice(0);
            result.path.push(name === void 0 ? "ROOT" : result.name);
            switch (result.type) {
              case "array":
                result.items = [];
                Util2.each(template, function(value, index2) {
                  result.items.push(
                    toJSONSchema(value, index2, result.path)
                  );
                });
                break;
              case "object":
                result.properties = [];
                Util2.each(template, function(value, name2) {
                  result.properties.push(
                    toJSONSchema(value, name2, result.path)
                  );
                });
                break;
            }
            return result;
          }
          module2.exports = toJSONSchema;
        },
        /* 25 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          module2.exports = __webpack_require__2(26);
        },
        /* 26 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Constant2 = __webpack_require__2(2);
          var Util2 = __webpack_require__2(3);
          var toJSONSchema = __webpack_require__2(23);
          function valid(template, data) {
            var schema = toJSONSchema(template);
            var result = Diff.diff(schema, data);
            for (var i2 = 0; i2 < result.length; i2++) {
            }
            return result;
          }
          var Diff = {
            diff: function diff2(schema, data, name) {
              var result = [];
              if (this.name(schema, data, name, result) && this.type(schema, data, name, result)) {
                this.value(schema, data, name, result);
                this.properties(schema, data, name, result);
                this.items(schema, data, name, result);
              }
              return result;
            },
            /* jshint unused:false */
            name: function(schema, data, name, result) {
              var length = result.length;
              Assert.equal("name", schema.path, name + "", schema.name + "", result);
              return result.length === length;
            },
            type: function(schema, data, name, result) {
              var length = result.length;
              switch (schema.type) {
                case "string":
                  if (schema.template.match(Constant2.RE_PLACEHOLDER))
                    return true;
                  break;
                case "array":
                  if (schema.rule.parameters) {
                    if (schema.rule.min !== void 0 && schema.rule.max === void 0) {
                      if (schema.rule.count === 1)
                        return true;
                    }
                    if (schema.rule.parameters[2])
                      return true;
                  }
                  break;
                case "function":
                  return true;
              }
              Assert.equal("type", schema.path, Util2.type(data), schema.type, result);
              return result.length === length;
            },
            value: function(schema, data, name, result) {
              var length = result.length;
              var rule = schema.rule;
              var templateType = schema.type;
              if (templateType === "object" || templateType === "array" || templateType === "function")
                return true;
              if (!rule.parameters) {
                switch (templateType) {
                  case "regexp":
                    Assert.match("value", schema.path, data, schema.template, result);
                    return result.length === length;
                  case "string":
                    if (schema.template.match(Constant2.RE_PLACEHOLDER))
                      return result.length === length;
                    break;
                }
                Assert.equal("value", schema.path, data, schema.template, result);
                return result.length === length;
              }
              var actualRepeatCount;
              switch (templateType) {
                case "number":
                  var parts2 = (data + "").split(".");
                  parts2[0] = +parts2[0];
                  if (rule.min !== void 0 && rule.max !== void 0) {
                    Assert.greaterThanOrEqualTo("value", schema.path, parts2[0], Math.min(rule.min, rule.max), result);
                    Assert.lessThanOrEqualTo("value", schema.path, parts2[0], Math.max(rule.min, rule.max), result);
                  }
                  if (rule.min !== void 0 && rule.max === void 0) {
                    Assert.equal("value", schema.path, parts2[0], rule.min, result, "[value] " + name);
                  }
                  if (rule.decimal) {
                    if (rule.dmin !== void 0 && rule.dmax !== void 0) {
                      Assert.greaterThanOrEqualTo("value", schema.path, parts2[1].length, rule.dmin, result);
                      Assert.lessThanOrEqualTo("value", schema.path, parts2[1].length, rule.dmax, result);
                    }
                    if (rule.dmin !== void 0 && rule.dmax === void 0) {
                      Assert.equal("value", schema.path, parts2[1].length, rule.dmin, result);
                    }
                  }
                  break;
                case "boolean":
                  break;
                case "string":
                  actualRepeatCount = data.match(new RegExp(schema.template, "g"));
                  actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0;
                  if (rule.min !== void 0 && rule.max !== void 0) {
                    Assert.greaterThanOrEqualTo("repeat count", schema.path, actualRepeatCount, rule.min, result);
                    Assert.lessThanOrEqualTo("repeat count", schema.path, actualRepeatCount, rule.max, result);
                  }
                  if (rule.min !== void 0 && rule.max === void 0) {
                    Assert.equal("repeat count", schema.path, actualRepeatCount, rule.min, result);
                  }
                  break;
                case "regexp":
                  actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ""), "g"));
                  actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0;
                  if (rule.min !== void 0 && rule.max !== void 0) {
                    Assert.greaterThanOrEqualTo("repeat count", schema.path, actualRepeatCount, rule.min, result);
                    Assert.lessThanOrEqualTo("repeat count", schema.path, actualRepeatCount, rule.max, result);
                  }
                  if (rule.min !== void 0 && rule.max === void 0) {
                    Assert.equal("repeat count", schema.path, actualRepeatCount, rule.min, result);
                  }
                  break;
              }
              return result.length === length;
            },
            properties: function(schema, data, name, result) {
              var length = result.length;
              var rule = schema.rule;
              var keys = Util2.keys(data);
              if (!schema.properties)
                return;
              if (!schema.rule.parameters) {
                Assert.equal("properties length", schema.path, keys.length, schema.properties.length, result);
              } else {
                if (rule.min !== void 0 && rule.max !== void 0) {
                  Assert.greaterThanOrEqualTo("properties length", schema.path, keys.length, Math.min(rule.min, rule.max), result);
                  Assert.lessThanOrEqualTo("properties length", schema.path, keys.length, Math.max(rule.min, rule.max), result);
                }
                if (rule.min !== void 0 && rule.max === void 0) {
                  if (rule.count !== 1)
                    Assert.equal("properties length", schema.path, keys.length, rule.min, result);
                }
              }
              if (result.length !== length)
                return false;
              for (var i2 = 0; i2 < keys.length; i2++) {
                result.push.apply(
                  result,
                  this.diff(
                    function() {
                      var property;
                      Util2.each(schema.properties, function(item) {
                        if (item.name === keys[i2])
                          property = item;
                      });
                      return property || schema.properties[i2];
                    }(),
                    data[keys[i2]],
                    keys[i2]
                  )
                );
              }
              return result.length === length;
            },
            items: function(schema, data, name, result) {
              var length = result.length;
              if (!schema.items)
                return;
              var rule = schema.rule;
              if (!schema.rule.parameters) {
                Assert.equal("items length", schema.path, data.length, schema.items.length, result);
              } else {
                if (rule.min !== void 0 && rule.max !== void 0) {
                  Assert.greaterThanOrEqualTo(
                    "items",
                    schema.path,
                    data.length,
                    Math.min(rule.min, rule.max) * schema.items.length,
                    result,
                    "[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements"
                  );
                  Assert.lessThanOrEqualTo(
                    "items",
                    schema.path,
                    data.length,
                    Math.max(rule.min, rule.max) * schema.items.length,
                    result,
                    "[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements"
                  );
                }
                if (rule.min !== void 0 && rule.max === void 0) {
                  if (rule.count === 1)
                    return result.length === length;
                  else
                    Assert.equal("items length", schema.path, data.length, rule.min * schema.items.length, result);
                }
                if (rule.parameters[2])
                  return result.length === length;
              }
              if (result.length !== length)
                return false;
              for (var i2 = 0; i2 < data.length; i2++) {
                result.push.apply(
                  result,
                  this.diff(
                    schema.items[i2 % schema.items.length],
                    data[i2],
                    i2 % schema.items.length
                  )
                );
              }
              return result.length === length;
            }
          };
          var Assert = {
            message: function(item) {
              return (item.message || "[{utype}] Expect {path}'{ltype} {action} {expected}, but is {actual}").replace("{utype}", item.type.toUpperCase()).replace("{ltype}", item.type.toLowerCase()).replace("{path}", Util2.isArray(item.path) && item.path.join(".") || item.path).replace("{action}", item.action).replace("{expected}", item.expected).replace("{actual}", item.actual);
            },
            equal: function(type, path, actual, expected, result, message) {
              if (actual === expected)
                return true;
              switch (type) {
                case "type":
                  if (expected === "regexp" && actual === "string")
                    return true;
                  break;
              }
              var item = {
                path,
                type,
                actual,
                expected,
                action: "is equal to",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            },
            // actual matches expected
            match: function(type, path, actual, expected, result, message) {
              if (expected.test(actual))
                return true;
              var item = {
                path,
                type,
                actual,
                expected,
                action: "matches",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            },
            notEqual: function(type, path, actual, expected, result, message) {
              if (actual !== expected)
                return true;
              var item = {
                path,
                type,
                actual,
                expected,
                action: "is not equal to",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            },
            greaterThan: function(type, path, actual, expected, result, message) {
              if (actual > expected)
                return true;
              var item = {
                path,
                type,
                actual,
                expected,
                action: "is greater than",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            },
            lessThan: function(type, path, actual, expected, result, message) {
              if (actual < expected)
                return true;
              var item = {
                path,
                type,
                actual,
                expected,
                action: "is less to",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            },
            greaterThanOrEqualTo: function(type, path, actual, expected, result, message) {
              if (actual >= expected)
                return true;
              var item = {
                path,
                type,
                actual,
                expected,
                action: "is greater than or equal to",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            },
            lessThanOrEqualTo: function(type, path, actual, expected, result, message) {
              if (actual <= expected)
                return true;
              var item = {
                path,
                type,
                actual,
                expected,
                action: "is less than or equal to",
                message
              };
              item.message = Assert.message(item);
              result.push(item);
              return false;
            }
          };
          valid.Diff = Diff;
          valid.Assert = Assert;
          module2.exports = valid;
        },
        /* 27 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          module2.exports = __webpack_require__2(28);
        },
        /* 28 */
        /***/
        function(module2, exports2, __webpack_require__2) {
          var Util2 = __webpack_require__2(3);
          window._XMLHttpRequest = window.XMLHttpRequest;
          window._ActiveXObject = window.ActiveXObject;
          try {
            new window.Event("custom");
          } catch (exception) {
            window.Event = function(type, bubbles2, cancelable, detail) {
              var event = document.createEvent("CustomEvent");
              event.initCustomEvent(type, bubbles2, cancelable, detail);
              return event;
            };
          }
          var XHR_STATES = {
            // The object has been constructed.
            UNSENT: 0,
            // The open() method has been successfully invoked.
            OPENED: 1,
            // All redirects (if any) have been followed and all HTTP headers of the response have been received.
            HEADERS_RECEIVED: 2,
            // The response's body is being received.
            LOADING: 3,
            // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
            DONE: 4
          };
          var XHR_EVENTS = "readystatechange loadstart progress abort error load timeout loadend".split(" ");
          var XHR_REQUEST_PROPERTIES = "timeout withCredentials".split(" ");
          var XHR_RESPONSE_PROPERTIES = "readyState responseURL status statusText responseType response responseText responseXML".split(" ");
          var HTTP_STATUS_CODES = {
            100: "Continue",
            101: "Switching Protocols",
            200: "OK",
            201: "Created",
            202: "Accepted",
            203: "Non-Authoritative Information",
            204: "No Content",
            205: "Reset Content",
            206: "Partial Content",
            300: "Multiple Choice",
            301: "Moved Permanently",
            302: "Found",
            303: "See Other",
            304: "Not Modified",
            305: "Use Proxy",
            307: "Temporary Redirect",
            400: "Bad Request",
            401: "Unauthorized",
            402: "Payment Required",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            407: "Proxy Authentication Required",
            408: "Request Timeout",
            409: "Conflict",
            410: "Gone",
            411: "Length Required",
            412: "Precondition Failed",
            413: "Request Entity Too Large",
            414: "Request-URI Too Long",
            415: "Unsupported Media Type",
            416: "Requested Range Not Satisfiable",
            417: "Expectation Failed",
            422: "Unprocessable Entity",
            500: "Internal Server Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Gateway Timeout",
            505: "HTTP Version Not Supported"
          };
          function MockXMLHttpRequest() {
            this.custom = {
              events: {},
              requestHeaders: {},
              responseHeaders: {}
            };
          }
          MockXMLHttpRequest._settings = {
            timeout: "10-100"
            /*
                timeout: 50,
                timeout: '10-100',
             */
          };
          MockXMLHttpRequest.setup = function(settings) {
            Util2.extend(MockXMLHttpRequest._settings, settings);
            return MockXMLHttpRequest._settings;
          };
          Util2.extend(MockXMLHttpRequest, XHR_STATES);
          Util2.extend(MockXMLHttpRequest.prototype, XHR_STATES);
          MockXMLHttpRequest.prototype.mock = true;
          MockXMLHttpRequest.prototype.match = false;
          Util2.extend(MockXMLHttpRequest.prototype, {
            // https://xhr.spec.whatwg.org/#the-open()-method
            // Sets the request method, request URL, and synchronous flag.
            open: function(method, url, async, username, password) {
              var that = this;
              Util2.extend(this.custom, {
                method,
                url,
                async: typeof async === "boolean" ? async : true,
                username,
                password,
                options: {
                  url,
                  type: method
                }
              });
              this.custom.timeout = function(timeout) {
                if (typeof timeout === "number")
                  return timeout;
                if (typeof timeout === "string" && !~timeout.indexOf("-"))
                  return parseInt(timeout, 10);
                if (typeof timeout === "string" && ~timeout.indexOf("-")) {
                  var tmp = timeout.split("-");
                  var min = parseInt(tmp[0], 10);
                  var max = parseInt(tmp[1], 10);
                  return Math.round(Math.random() * (max - min)) + min;
                }
              }(MockXMLHttpRequest._settings.timeout);
              var item = find(this.custom.options);
              function handle2(event) {
                for (var i3 = 0; i3 < XHR_RESPONSE_PROPERTIES.length; i3++) {
                  try {
                    that[XHR_RESPONSE_PROPERTIES[i3]] = xhr[XHR_RESPONSE_PROPERTIES[i3]];
                  } catch (e2) {
                  }
                }
                that.dispatchEvent(new Event(
                  event.type
                  /*, false, false, that*/
                ));
              }
              if (!item) {
                var xhr = createNativeXMLHttpRequest();
                this.custom.xhr = xhr;
                for (var i2 = 0; i2 < XHR_EVENTS.length; i2++) {
                  xhr.addEventListener(XHR_EVENTS[i2], handle2);
                }
                if (username)
                  xhr.open(method, url, async, username, password);
                else
                  xhr.open(method, url, async);
                for (var j2 = 0; j2 < XHR_REQUEST_PROPERTIES.length; j2++) {
                  try {
                    xhr[XHR_REQUEST_PROPERTIES[j2]] = that[XHR_REQUEST_PROPERTIES[j2]];
                  } catch (e2) {
                  }
                }
                return;
              }
              this.match = true;
              this.custom.template = item;
              this.readyState = MockXMLHttpRequest.OPENED;
              this.dispatchEvent(new Event(
                "readystatechange"
                /*, false, false, this*/
              ));
            },
            // https://xhr.spec.whatwg.org/#the-setrequestheader()-method
            // Combines a header in author request headers.
            setRequestHeader: function(name, value) {
              if (!this.match) {
                this.custom.xhr.setRequestHeader(name, value);
                return;
              }
              var requestHeaders = this.custom.requestHeaders;
              if (requestHeaders[name])
                requestHeaders[name] += "," + value;
              else
                requestHeaders[name] = value;
            },
            timeout: 0,
            withCredentials: false,
            upload: {},
            // https://xhr.spec.whatwg.org/#the-send()-method
            // Initiates the request.
            send: function send(data) {
              var that = this;
              this.custom.options.body = data;
              if (!this.match) {
                this.custom.xhr.send(data);
                return;
              }
              this.setRequestHeader("X-Requested-With", "MockXMLHttpRequest");
              this.dispatchEvent(new Event(
                "loadstart"
                /*, false, false, this*/
              ));
              if (this.custom.async)
                setTimeout(done, this.custom.timeout);
              else
                done();
              function done() {
                that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;
                that.dispatchEvent(new Event(
                  "readystatechange"
                  /*, false, false, that*/
                ));
                that.readyState = MockXMLHttpRequest.LOADING;
                that.dispatchEvent(new Event(
                  "readystatechange"
                  /*, false, false, that*/
                ));
                that.status = 200;
                that.statusText = HTTP_STATUS_CODES[200];
                that.response = that.responseText = JSON.stringify(
                  convert(that.custom.template, that.custom.options),
                  null,
                  4
                );
                that.readyState = MockXMLHttpRequest.DONE;
                that.dispatchEvent(new Event(
                  "readystatechange"
                  /*, false, false, that*/
                ));
                that.dispatchEvent(new Event(
                  "load"
                  /*, false, false, that*/
                ));
                that.dispatchEvent(new Event(
                  "loadend"
                  /*, false, false, that*/
                ));
              }
            },
            // https://xhr.spec.whatwg.org/#the-abort()-method
            // Cancels any network activity.
            abort: function abort() {
              if (!this.match) {
                this.custom.xhr.abort();
                return;
              }
              this.readyState = MockXMLHttpRequest.UNSENT;
              this.dispatchEvent(new Event("abort", false, false, this));
              this.dispatchEvent(new Event("error", false, false, this));
            }
          });
          Util2.extend(MockXMLHttpRequest.prototype, {
            responseURL: "",
            status: MockXMLHttpRequest.UNSENT,
            statusText: "",
            // https://xhr.spec.whatwg.org/#the-getresponseheader()-method
            getResponseHeader: function(name) {
              if (!this.match) {
                return this.custom.xhr.getResponseHeader(name);
              }
              return this.custom.responseHeaders[name.toLowerCase()];
            },
            // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
            // http://www.utf8-chartable.de/
            getAllResponseHeaders: function() {
              if (!this.match) {
                return this.custom.xhr.getAllResponseHeaders();
              }
              var responseHeaders = this.custom.responseHeaders;
              var headers = "";
              for (var h2 in responseHeaders) {
                if (!responseHeaders.hasOwnProperty(h2))
                  continue;
                headers += h2 + ": " + responseHeaders[h2] + "\r\n";
              }
              return headers;
            },
            overrideMimeType: function() {
            },
            responseType: "",
            // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
            response: null,
            responseText: "",
            responseXML: null
          });
          Util2.extend(MockXMLHttpRequest.prototype, {
            addEventListener: function addEventListener(type, handle2) {
              var events = this.custom.events;
              if (!events[type])
                events[type] = [];
              events[type].push(handle2);
            },
            removeEventListener: function removeEventListener(type, handle2) {
              var handles = this.custom.events[type] || [];
              for (var i2 = 0; i2 < handles.length; i2++) {
                if (handles[i2] === handle2) {
                  handles.splice(i2--, 1);
                }
              }
            },
            dispatchEvent: function dispatchEvent(event) {
              var handles = this.custom.events[event.type] || [];
              for (var i2 = 0; i2 < handles.length; i2++) {
                handles[i2].call(this, event);
              }
              var ontype = "on" + event.type;
              if (this[ontype])
                this[ontype](event);
            }
          });
          function createNativeXMLHttpRequest() {
            var isLocal = function() {
              var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
              var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
              var ajaxLocation = location.href;
              var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
              return rlocalProtocol.test(ajaxLocParts[1]);
            }();
            return window.ActiveXObject ? !isLocal && createStandardXHR() || createActiveXHR() : createStandardXHR();
            function createStandardXHR() {
              try {
                return new window._XMLHttpRequest();
              } catch (e2) {
              }
            }
            function createActiveXHR() {
              try {
                return new window._ActiveXObject("Microsoft.XMLHTTP");
              } catch (e2) {
              }
            }
          }
          function find(options2) {
            for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
              var item = MockXMLHttpRequest.Mock._mocked[sUrlType];
              if ((!item.rurl || match(item.rurl, options2.url)) && (!item.rtype || match(item.rtype, options2.type.toLowerCase()))) {
                return item;
              }
            }
            function match(expected, actual) {
              if (Util2.type(expected) === "string") {
                return expected === actual;
              }
              if (Util2.type(expected) === "regexp") {
                return expected.test(actual);
              }
            }
          }
          function convert(item, options2) {
            return Util2.isFunction(item.template) ? item.template(options2) : MockXMLHttpRequest.Mock.mock(item.template);
          }
          module2.exports = MockXMLHttpRequest;
        }
        /******/
      ])
    );
  });
})(mock);
var mockExports = mock.exports;
const Mock = /* @__PURE__ */ getDefaultExportFromCjs(mockExports);
var dayjs_min = { exports: {} };
(function(module2, exports2) {
  !function(t2, e2) {
    module2.exports = e2();
  }(commonjsGlobal, function() {
    var t2 = 1e3, e2 = 6e4, n2 = 36e5, r2 = "millisecond", i2 = "second", s2 = "minute", u2 = "hour", a2 = "day", o2 = "week", c2 = "month", f2 = "quarter", h2 = "year", d2 = "date", l2 = "Invalid Date", $2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y2 = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t3) {
      var e3 = ["th", "st", "nd", "rd"], n3 = t3 % 100;
      return "[" + t3 + (e3[(n3 - 20) % 10] || e3[n3] || e3[0]) + "]";
    } }, m2 = function(t3, e3, n3) {
      var r3 = String(t3);
      return !r3 || r3.length >= e3 ? t3 : "" + Array(e3 + 1 - r3.length).join(n3) + t3;
    }, v2 = { s: m2, z: function(t3) {
      var e3 = -t3.utcOffset(), n3 = Math.abs(e3), r3 = Math.floor(n3 / 60), i3 = n3 % 60;
      return (e3 <= 0 ? "+" : "-") + m2(r3, 2, "0") + ":" + m2(i3, 2, "0");
    }, m: function t3(e3, n3) {
      if (e3.date() < n3.date())
        return -t3(n3, e3);
      var r3 = 12 * (n3.year() - e3.year()) + (n3.month() - e3.month()), i3 = e3.clone().add(r3, c2), s3 = n3 - i3 < 0, u3 = e3.clone().add(r3 + (s3 ? -1 : 1), c2);
      return +(-(r3 + (n3 - i3) / (s3 ? i3 - u3 : u3 - i3)) || 0);
    }, a: function(t3) {
      return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
    }, p: function(t3) {
      return { M: c2, y: h2, w: o2, d: a2, D: d2, h: u2, m: s2, s: i2, ms: r2, Q: f2 }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t3) {
      return void 0 === t3;
    } }, g2 = "en", D2 = {};
    D2[g2] = M2;
    var p2 = "$isDayjsObject", S2 = function(t3) {
      return t3 instanceof _2 || !(!t3 || !t3[p2]);
    }, w2 = function t3(e3, n3, r3) {
      var i3;
      if (!e3)
        return g2;
      if ("string" == typeof e3) {
        var s3 = e3.toLowerCase();
        D2[s3] && (i3 = s3), n3 && (D2[s3] = n3, i3 = s3);
        var u3 = e3.split("-");
        if (!i3 && u3.length > 1)
          return t3(u3[0]);
      } else {
        var a3 = e3.name;
        D2[a3] = e3, i3 = a3;
      }
      return !r3 && i3 && (g2 = i3), i3 || !r3 && g2;
    }, O2 = function(t3, e3) {
      if (S2(t3))
        return t3.clone();
      var n3 = "object" == typeof e3 ? e3 : {};
      return n3.date = t3, n3.args = arguments, new _2(n3);
    }, b2 = v2;
    b2.l = w2, b2.i = S2, b2.w = function(t3, e3) {
      return O2(t3, { locale: e3.$L, utc: e3.$u, x: e3.$x, $offset: e3.$offset });
    };
    var _2 = function() {
      function M3(t3) {
        this.$L = w2(t3.locale, null, true), this.parse(t3), this.$x = this.$x || t3.x || {}, this[p2] = true;
      }
      var m3 = M3.prototype;
      return m3.parse = function(t3) {
        this.$d = function(t4) {
          var e3 = t4.date, n3 = t4.utc;
          if (null === e3)
            return /* @__PURE__ */ new Date(NaN);
          if (b2.u(e3))
            return /* @__PURE__ */ new Date();
          if (e3 instanceof Date)
            return new Date(e3);
          if ("string" == typeof e3 && !/Z$/i.test(e3)) {
            var r3 = e3.match($2);
            if (r3) {
              var i3 = r3[2] - 1 || 0, s3 = (r3[7] || "0").substring(0, 3);
              return n3 ? new Date(Date.UTC(r3[1], i3, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3)) : new Date(r3[1], i3, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3);
            }
          }
          return new Date(e3);
        }(t3), this.init();
      }, m3.init = function() {
        var t3 = this.$d;
        this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
      }, m3.$utils = function() {
        return b2;
      }, m3.isValid = function() {
        return !(this.$d.toString() === l2);
      }, m3.isSame = function(t3, e3) {
        var n3 = O2(t3);
        return this.startOf(e3) <= n3 && n3 <= this.endOf(e3);
      }, m3.isAfter = function(t3, e3) {
        return O2(t3) < this.startOf(e3);
      }, m3.isBefore = function(t3, e3) {
        return this.endOf(e3) < O2(t3);
      }, m3.$g = function(t3, e3, n3) {
        return b2.u(t3) ? this[e3] : this.set(n3, t3);
      }, m3.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m3.valueOf = function() {
        return this.$d.getTime();
      }, m3.startOf = function(t3, e3) {
        var n3 = this, r3 = !!b2.u(e3) || e3, f3 = b2.p(t3), l3 = function(t4, e4) {
          var i3 = b2.w(n3.$u ? Date.UTC(n3.$y, e4, t4) : new Date(n3.$y, e4, t4), n3);
          return r3 ? i3 : i3.endOf(a2);
        }, $3 = function(t4, e4) {
          return b2.w(n3.toDate()[t4].apply(n3.toDate("s"), (r3 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e4)), n3);
        }, y3 = this.$W, M4 = this.$M, m4 = this.$D, v3 = "set" + (this.$u ? "UTC" : "");
        switch (f3) {
          case h2:
            return r3 ? l3(1, 0) : l3(31, 11);
          case c2:
            return r3 ? l3(1, M4) : l3(0, M4 + 1);
          case o2:
            var g3 = this.$locale().weekStart || 0, D3 = (y3 < g3 ? y3 + 7 : y3) - g3;
            return l3(r3 ? m4 - D3 : m4 + (6 - D3), M4);
          case a2:
          case d2:
            return $3(v3 + "Hours", 0);
          case u2:
            return $3(v3 + "Minutes", 1);
          case s2:
            return $3(v3 + "Seconds", 2);
          case i2:
            return $3(v3 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m3.endOf = function(t3) {
        return this.startOf(t3, false);
      }, m3.$set = function(t3, e3) {
        var n3, o3 = b2.p(t3), f3 = "set" + (this.$u ? "UTC" : ""), l3 = (n3 = {}, n3[a2] = f3 + "Date", n3[d2] = f3 + "Date", n3[c2] = f3 + "Month", n3[h2] = f3 + "FullYear", n3[u2] = f3 + "Hours", n3[s2] = f3 + "Minutes", n3[i2] = f3 + "Seconds", n3[r2] = f3 + "Milliseconds", n3)[o3], $3 = o3 === a2 ? this.$D + (e3 - this.$W) : e3;
        if (o3 === c2 || o3 === h2) {
          var y3 = this.clone().set(d2, 1);
          y3.$d[l3]($3), y3.init(), this.$d = y3.set(d2, Math.min(this.$D, y3.daysInMonth())).$d;
        } else
          l3 && this.$d[l3]($3);
        return this.init(), this;
      }, m3.set = function(t3, e3) {
        return this.clone().$set(t3, e3);
      }, m3.get = function(t3) {
        return this[b2.p(t3)]();
      }, m3.add = function(r3, f3) {
        var d3, l3 = this;
        r3 = Number(r3);
        var $3 = b2.p(f3), y3 = function(t3) {
          var e3 = O2(l3);
          return b2.w(e3.date(e3.date() + Math.round(t3 * r3)), l3);
        };
        if ($3 === c2)
          return this.set(c2, this.$M + r3);
        if ($3 === h2)
          return this.set(h2, this.$y + r3);
        if ($3 === a2)
          return y3(1);
        if ($3 === o2)
          return y3(7);
        var M4 = (d3 = {}, d3[s2] = e2, d3[u2] = n2, d3[i2] = t2, d3)[$3] || 1, m4 = this.$d.getTime() + r3 * M4;
        return b2.w(m4, this);
      }, m3.subtract = function(t3, e3) {
        return this.add(-1 * t3, e3);
      }, m3.format = function(t3) {
        var e3 = this, n3 = this.$locale();
        if (!this.isValid())
          return n3.invalidDate || l2;
        var r3 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i3 = b2.z(this), s3 = this.$H, u3 = this.$m, a3 = this.$M, o3 = n3.weekdays, c3 = n3.months, f3 = n3.meridiem, h3 = function(t4, n4, i4, s4) {
          return t4 && (t4[n4] || t4(e3, r3)) || i4[n4].slice(0, s4);
        }, d3 = function(t4) {
          return b2.s(s3 % 12 || 12, t4, "0");
        }, $3 = f3 || function(t4, e4, n4) {
          var r4 = t4 < 12 ? "AM" : "PM";
          return n4 ? r4.toLowerCase() : r4;
        };
        return r3.replace(y2, function(t4, r4) {
          return r4 || function(t5) {
            switch (t5) {
              case "YY":
                return String(e3.$y).slice(-2);
              case "YYYY":
                return b2.s(e3.$y, 4, "0");
              case "M":
                return a3 + 1;
              case "MM":
                return b2.s(a3 + 1, 2, "0");
              case "MMM":
                return h3(n3.monthsShort, a3, c3, 3);
              case "MMMM":
                return h3(c3, a3);
              case "D":
                return e3.$D;
              case "DD":
                return b2.s(e3.$D, 2, "0");
              case "d":
                return String(e3.$W);
              case "dd":
                return h3(n3.weekdaysMin, e3.$W, o3, 2);
              case "ddd":
                return h3(n3.weekdaysShort, e3.$W, o3, 3);
              case "dddd":
                return o3[e3.$W];
              case "H":
                return String(s3);
              case "HH":
                return b2.s(s3, 2, "0");
              case "h":
                return d3(1);
              case "hh":
                return d3(2);
              case "a":
                return $3(s3, u3, true);
              case "A":
                return $3(s3, u3, false);
              case "m":
                return String(u3);
              case "mm":
                return b2.s(u3, 2, "0");
              case "s":
                return String(e3.$s);
              case "ss":
                return b2.s(e3.$s, 2, "0");
              case "SSS":
                return b2.s(e3.$ms, 3, "0");
              case "Z":
                return i3;
            }
            return null;
          }(t4) || i3.replace(":", "");
        });
      }, m3.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m3.diff = function(r3, d3, l3) {
        var $3, y3 = this, M4 = b2.p(d3), m4 = O2(r3), v3 = (m4.utcOffset() - this.utcOffset()) * e2, g3 = this - m4, D3 = function() {
          return b2.m(y3, m4);
        };
        switch (M4) {
          case h2:
            $3 = D3() / 12;
            break;
          case c2:
            $3 = D3();
            break;
          case f2:
            $3 = D3() / 3;
            break;
          case o2:
            $3 = (g3 - v3) / 6048e5;
            break;
          case a2:
            $3 = (g3 - v3) / 864e5;
            break;
          case u2:
            $3 = g3 / n2;
            break;
          case s2:
            $3 = g3 / e2;
            break;
          case i2:
            $3 = g3 / t2;
            break;
          default:
            $3 = g3;
        }
        return l3 ? $3 : b2.a($3);
      }, m3.daysInMonth = function() {
        return this.endOf(c2).$D;
      }, m3.$locale = function() {
        return D2[this.$L];
      }, m3.locale = function(t3, e3) {
        if (!t3)
          return this.$L;
        var n3 = this.clone(), r3 = w2(t3, e3, true);
        return r3 && (n3.$L = r3), n3;
      }, m3.clone = function() {
        return b2.w(this.$d, this);
      }, m3.toDate = function() {
        return new Date(this.valueOf());
      }, m3.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m3.toISOString = function() {
        return this.$d.toISOString();
      }, m3.toString = function() {
        return this.$d.toUTCString();
      }, M3;
    }(), k = _2.prototype;
    return O2.prototype = k, [["$ms", r2], ["$s", i2], ["$m", s2], ["$H", u2], ["$W", a2], ["$M", c2], ["$y", h2], ["$D", d2]].forEach(function(t3) {
      k[t3[1]] = function(e3) {
        return this.$g(e3, t3[0], t3[1]);
      };
    }), O2.extend = function(t3, e3) {
      return t3.$i || (t3(e3, _2, O2), t3.$i = true), O2;
    }, O2.locale = w2, O2.isDayjs = S2, O2.unix = function(t3) {
      return O2(1e3 * t3);
    }, O2.en = D2[g2], O2.Ls = D2, O2.p = {}, O2;
  });
})(dayjs_min);
var dayjs_minExports = dayjs_min.exports;
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
var isSameOrAfter$1 = { exports: {} };
(function(module2, exports2) {
  !function(e2, t2) {
    module2.exports = t2();
  }(commonjsGlobal, function() {
    return function(e2, t2) {
      t2.prototype.isSameOrAfter = function(e3, t3) {
        return this.isSame(e3, t3) || this.isAfter(e3, t3);
      };
    };
  });
})(isSameOrAfter$1);
var isSameOrAfterExports = isSameOrAfter$1.exports;
const isSameOrAfter = /* @__PURE__ */ getDefaultExportFromCjs(isSameOrAfterExports);
/*!
 * vuex v4.1.0
 * (c) 2022 Evan You
 * @license MIT
 */
var storeKey = "store";
function forEachValue(obj2, fn) {
  Object.keys(obj2).forEach(function(key2) {
    return fn(obj2[key2], key2);
  });
}
function isObject(obj2) {
  return obj2 !== null && typeof obj2 === "object";
}
function isPromise(val) {
  return val && typeof val.then === "function";
}
function assert(condition, msg) {
  if (!condition) {
    throw new Error("[vuex] " + msg);
  }
}
function partial(fn, arg) {
  return function() {
    return fn(arg);
  };
}
function genericSubscribe(fn, subs, options2) {
  if (subs.indexOf(fn) < 0) {
    options2 && options2.prepend ? subs.unshift(fn) : subs.push(fn);
  }
  return function() {
    var i2 = subs.indexOf(fn);
    if (i2 > -1) {
      subs.splice(i2, 1);
    }
  };
}
function resetStore(store, hot) {
  store._actions = /* @__PURE__ */ Object.create(null);
  store._mutations = /* @__PURE__ */ Object.create(null);
  store._wrappedGetters = /* @__PURE__ */ Object.create(null);
  store._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  var state = store.state;
  installModule(store, state, [], store._modules.root, true);
  resetStoreState(store, state, hot);
}
function resetStoreState(store, state, hot) {
  var oldState = store._state;
  var oldScope = store._scope;
  store.getters = {};
  store._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computedObj = {};
  var computedCache = {};
  var scope = effectScope(true);
  scope.run(function() {
    forEachValue(wrappedGetters, function(fn, key2) {
      computedObj[key2] = partial(fn, store);
      computedCache[key2] = computed(function() {
        return computedObj[key2]();
      });
      Object.defineProperty(store.getters, key2, {
        get: function() {
          return computedCache[key2].value;
        },
        enumerable: true
        // for local getters
      });
    });
  });
  store._state = reactive({
    data: state
  });
  store._scope = scope;
  if (store.strict) {
    enableStrictMode(store);
  }
  if (oldState) {
    if (hot) {
      store._withCommit(function() {
        oldState.data = null;
      });
    }
  }
  if (oldScope) {
    oldScope.stop();
  }
}
function installModule(store, rootState, path, module2, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);
  if (module2.namespaced) {
    if (store._modulesNamespaceMap[namespace] && true) {
      console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
    }
    store._modulesNamespaceMap[namespace] = module2;
  }
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function() {
      {
        if (moduleName in parentState) {
          console.warn(
            '[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"'
          );
        }
      }
      parentState[moduleName] = module2.state;
    });
  }
  var local = module2.context = makeLocalContext(store, namespace, path);
  module2.forEachMutation(function(mutation, key2) {
    var namespacedType = namespace + key2;
    registerMutation(store, namespacedType, mutation, local);
  });
  module2.forEachAction(function(action, key2) {
    var type = action.root ? key2 : namespace + key2;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });
  module2.forEachGetter(function(getter, key2) {
    var namespacedType = namespace + key2;
    registerGetter(store, namespacedType, getter, local);
  });
  module2.forEachChild(function(child, key2) {
    installModule(store, rootState, path.concat(key2), child, hot);
  });
}
function makeLocalContext(store, namespace, path) {
  var noNamespace = namespace === "";
  var local = {
    dispatch: noNamespace ? store.dispatch : function(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options2 = args.options;
      var type = args.type;
      if (!options2 || !options2.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
          return;
        }
      }
      return store.dispatch(type, payload);
    },
    commit: noNamespace ? store.commit : function(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options2 = args.options;
      var type = args.type;
      if (!options2 || !options2.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
          return;
        }
      }
      store.commit(type, payload, options2);
    }
  };
  Object.defineProperties(local, {
    getters: {
      get: noNamespace ? function() {
        return store.getters;
      } : function() {
        return makeLocalGetters(store, namespace);
      }
    },
    state: {
      get: function() {
        return getNestedState(store.state, path);
      }
    }
  });
  return local;
}
function makeLocalGetters(store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    var gettersProxy = {};
    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function(type) {
      if (type.slice(0, splitPos) !== namespace) {
        return;
      }
      var localType = type.slice(splitPos);
      Object.defineProperty(gettersProxy, localType, {
        get: function() {
          return store.getters[type];
        },
        enumerable: true
      });
    });
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }
  return store._makeLocalGettersCache[namespace];
}
function registerMutation(store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler(payload) {
    handler.call(store, local.state, payload);
  });
}
function registerAction(store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler(payload) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function(err) {
        store._devtoolHook.emit("vuex:error", err);
        throw err;
      });
    } else {
      return res;
    }
  });
}
function registerGetter(store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    {
      console.error("[vuex] duplicate getter key: " + type);
    }
    return;
  }
  store._wrappedGetters[type] = function wrappedGetter(store2) {
    return rawGetter(
      local.state,
      // local state
      local.getters,
      // local getters
      store2.state,
      // root state
      store2.getters
      // root getters
    );
  };
}
function enableStrictMode(store) {
  watch(function() {
    return store._state.data;
  }, function() {
    {
      assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, flush: "sync" });
}
function getNestedState(state, path) {
  return path.reduce(function(state2, key2) {
    return state2[key2];
  }, state);
}
function unifyObjectStyle(type, payload, options2) {
  if (isObject(type) && type.type) {
    options2 = payload;
    payload = type;
    type = type.type;
  }
  {
    assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
  }
  return { type, payload, options: options2 };
}
var Module = function Module2(rawModule, runtime) {
  this.runtime = runtime;
  this._children = /* @__PURE__ */ Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
};
var prototypeAccessors$1 = { namespaced: { configurable: true } };
prototypeAccessors$1.namespaced.get = function() {
  return !!this._rawModule.namespaced;
};
Module.prototype.addChild = function addChild(key2, module2) {
  this._children[key2] = module2;
};
Module.prototype.removeChild = function removeChild(key2) {
  delete this._children[key2];
};
Module.prototype.getChild = function getChild(key2) {
  return this._children[key2];
};
Module.prototype.hasChild = function hasChild(key2) {
  return key2 in this._children;
};
Module.prototype.update = function update(rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};
Module.prototype.forEachChild = function forEachChild(fn) {
  forEachValue(this._children, fn);
};
Module.prototype.forEachGetter = function forEachGetter(fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};
Module.prototype.forEachAction = function forEachAction(fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};
Module.prototype.forEachMutation = function forEachMutation(fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};
Object.defineProperties(Module.prototype, prototypeAccessors$1);
var ModuleCollection = function ModuleCollection2(rawRootModule) {
  this.register([], rawRootModule, false);
};
ModuleCollection.prototype.get = function get2(path) {
  return path.reduce(function(module2, key2) {
    return module2.getChild(key2);
  }, this.root);
};
ModuleCollection.prototype.getNamespace = function getNamespace(path) {
  var module2 = this.root;
  return path.reduce(function(namespace, key2) {
    module2 = module2.getChild(key2);
    return namespace + (module2.namespaced ? key2 + "/" : "");
  }, "");
};
ModuleCollection.prototype.update = function update$1(rawRootModule) {
  update2([], this.root, rawRootModule);
};
ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
  var this$1$1 = this;
  if (runtime === void 0)
    runtime = true;
  {
    assertRawModule(path, rawModule);
  }
  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function(rawChildModule, key2) {
      this$1$1.register(path.concat(key2), rawChildModule, runtime);
    });
  }
};
ModuleCollection.prototype.unregister = function unregister(path) {
  var parent = this.get(path.slice(0, -1));
  var key2 = path[path.length - 1];
  var child = parent.getChild(key2);
  if (!child) {
    {
      console.warn(
        "[vuex] trying to unregister module '" + key2 + "', which is not registered"
      );
    }
    return;
  }
  if (!child.runtime) {
    return;
  }
  parent.removeChild(key2);
};
ModuleCollection.prototype.isRegistered = function isRegistered(path) {
  var parent = this.get(path.slice(0, -1));
  var key2 = path[path.length - 1];
  if (parent) {
    return parent.hasChild(key2);
  }
  return false;
};
function update2(path, targetModule, newModule) {
  {
    assertRawModule(path, newModule);
  }
  targetModule.update(newModule);
  if (newModule.modules) {
    for (var key2 in newModule.modules) {
      if (!targetModule.getChild(key2)) {
        {
          console.warn(
            "[vuex] trying to add a new module '" + key2 + "' on hot reloading, manual reload is needed"
          );
        }
        return;
      }
      update2(
        path.concat(key2),
        targetModule.getChild(key2),
        newModule.modules[key2]
      );
    }
  }
}
var functionAssert = {
  assert: function(value) {
    return typeof value === "function";
  },
  expected: "function"
};
var objectAssert = {
  assert: function(value) {
    return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
  },
  expected: 'function or object with "handler" function'
};
var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};
function assertRawModule(path, rawModule) {
  Object.keys(assertTypes).forEach(function(key2) {
    if (!rawModule[key2]) {
      return;
    }
    var assertOptions = assertTypes[key2];
    forEachValue(rawModule[key2], function(value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key2, type, value, assertOptions.expected)
      );
    });
  });
}
function makeAssertionMessage(path, key2, type, value, expected) {
  var buf = key2 + " should be " + expected + ' but "' + key2 + "." + type + '"';
  if (path.length > 0) {
    buf += ' in module "' + path.join(".") + '"';
  }
  buf += " is " + JSON.stringify(value) + ".";
  return buf;
}
function createStore(options2) {
  return new Store(options2);
}
var Store = function Store2(options2) {
  var this$1$1 = this;
  if (options2 === void 0)
    options2 = {};
  {
    assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store2, "store must be called with the new operator.");
  }
  var plugins = options2.plugins;
  if (plugins === void 0)
    plugins = [];
  var strict = options2.strict;
  if (strict === void 0)
    strict = false;
  var devtools2 = options2.devtools;
  this._committing = false;
  this._actions = /* @__PURE__ */ Object.create(null);
  this._actionSubscribers = [];
  this._mutations = /* @__PURE__ */ Object.create(null);
  this._wrappedGetters = /* @__PURE__ */ Object.create(null);
  this._modules = new ModuleCollection(options2);
  this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  this._subscribers = [];
  this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  this._scope = null;
  this._devtools = devtools2;
  var store = this;
  var ref2 = this;
  var dispatch2 = ref2.dispatch;
  var commit2 = ref2.commit;
  this.dispatch = function boundDispatch(type, payload) {
    return dispatch2.call(store, type, payload);
  };
  this.commit = function boundCommit(type, payload, options22) {
    return commit2.call(store, type, payload, options22);
  };
  this.strict = strict;
  var state = this._modules.root.state;
  installModule(this, state, [], this._modules.root);
  resetStoreState(this, state);
  plugins.forEach(function(plugin2) {
    return plugin2(this$1$1);
  });
};
var prototypeAccessors = { state: { configurable: true } };
Store.prototype.install = function install(app, injectKey) {
  app.provide(injectKey || storeKey, this);
  app.config.globalProperties.$store = this;
  this._devtools !== void 0 ? this._devtools : true;
};
prototypeAccessors.state.get = function() {
  return this._state.data;
};
prototypeAccessors.state.set = function(v2) {
  {
    assert(false, "use store.replaceState() to explicit replace store state.");
  }
};
Store.prototype.commit = function commit(_type, _payload, _options) {
  var this$1$1 = this;
  var ref2 = unifyObjectStyle(_type, _payload, _options);
  var type = ref2.type;
  var payload = ref2.payload;
  var options2 = ref2.options;
  var mutation = { type, payload };
  var entry = this._mutations[type];
  if (!entry) {
    {
      console.error("[vuex] unknown mutation type: " + type);
    }
    return;
  }
  this._withCommit(function() {
    entry.forEach(function commitIterator(handler) {
      handler(payload);
    });
  });
  this._subscribers.slice().forEach(function(sub) {
    return sub(mutation, this$1$1.state);
  });
  if (options2 && options2.silent) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools"
    );
  }
};
Store.prototype.dispatch = function dispatch(_type, _payload) {
  var this$1$1 = this;
  var ref2 = unifyObjectStyle(_type, _payload);
  var type = ref2.type;
  var payload = ref2.payload;
  var action = { type, payload };
  var entry = this._actions[type];
  if (!entry) {
    {
      console.error("[vuex] unknown action type: " + type);
    }
    return;
  }
  try {
    this._actionSubscribers.slice().filter(function(sub) {
      return sub.before;
    }).forEach(function(sub) {
      return sub.before(action, this$1$1.state);
    });
  } catch (e2) {
    {
      console.warn("[vuex] error in before action subscribers: ");
      console.error(e2);
    }
  }
  var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
    return handler(payload);
  })) : entry[0](payload);
  return new Promise(function(resolve2, reject) {
    result.then(function(res) {
      try {
        this$1$1._actionSubscribers.filter(function(sub) {
          return sub.after;
        }).forEach(function(sub) {
          return sub.after(action, this$1$1.state);
        });
      } catch (e2) {
        {
          console.warn("[vuex] error in after action subscribers: ");
          console.error(e2);
        }
      }
      resolve2(res);
    }, function(error) {
      try {
        this$1$1._actionSubscribers.filter(function(sub) {
          return sub.error;
        }).forEach(function(sub) {
          return sub.error(action, this$1$1.state, error);
        });
      } catch (e2) {
        {
          console.warn("[vuex] error in error action subscribers: ");
          console.error(e2);
        }
      }
      reject(error);
    });
  });
};
Store.prototype.subscribe = function subscribe(fn, options2) {
  return genericSubscribe(fn, this._subscribers, options2);
};
Store.prototype.subscribeAction = function subscribeAction(fn, options2) {
  var subs = typeof fn === "function" ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers, options2);
};
Store.prototype.watch = function watch$1(getter, cb, options2) {
  var this$1$1 = this;
  {
    assert(typeof getter === "function", "store.watch only accepts a function.");
  }
  return watch(function() {
    return getter(this$1$1.state, this$1$1.getters);
  }, cb, Object.assign({}, options2));
};
Store.prototype.replaceState = function replaceState(state) {
  var this$1$1 = this;
  this._withCommit(function() {
    this$1$1._state.data = state;
  });
};
Store.prototype.registerModule = function registerModule(path, rawModule, options2) {
  if (options2 === void 0)
    options2 = {};
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, "cannot register the root module by using registerModule.");
  }
  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options2.preserveState);
  resetStoreState(this, this.state);
};
Store.prototype.unregisterModule = function unregisterModule(path) {
  var this$1$1 = this;
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }
  this._modules.unregister(path);
  this._withCommit(function() {
    var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
    delete parentState[path[path.length - 1]];
  });
  resetStore(this);
};
Store.prototype.hasModule = function hasModule(path) {
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }
  return this._modules.isRegistered(path);
};
Store.prototype.hotUpdate = function hotUpdate(newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};
Store.prototype._withCommit = function _withCommit(fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};
Object.defineProperties(Store.prototype, prototypeAccessors);
var mapState = normalizeNamespace(function(namespace, states) {
  var res = {};
  if (!isValidMap(states)) {
    console.error("[vuex] mapState: mapper parameter must be either an Array or an Object");
  }
  normalizeMap(states).forEach(function(ref2) {
    var key2 = ref2.key;
    var val = ref2.val;
    res[key2] = function mappedState() {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module2 = getModuleByNamespace(this.$store, "mapState", namespace);
        if (!module2) {
          return;
        }
        state = module2.context.state;
        getters = module2.context.getters;
      }
      return typeof val === "function" ? val.call(this, state, getters) : state[val];
    };
    res[key2].vuex = true;
  });
  return res;
});
var mapMutations = normalizeNamespace(function(namespace, mutations) {
  var res = {};
  if (!isValidMap(mutations)) {
    console.error("[vuex] mapMutations: mapper parameter must be either an Array or an Object");
  }
  normalizeMap(mutations).forEach(function(ref2) {
    var key2 = ref2.key;
    var val = ref2.val;
    res[key2] = function mappedMutation() {
      var args = [], len = arguments.length;
      while (len--)
        args[len] = arguments[len];
      var commit2 = this.$store.commit;
      if (namespace) {
        var module2 = getModuleByNamespace(this.$store, "mapMutations", namespace);
        if (!module2) {
          return;
        }
        commit2 = module2.context.commit;
      }
      return typeof val === "function" ? val.apply(this, [commit2].concat(args)) : commit2.apply(this.$store, [val].concat(args));
    };
  });
  return res;
});
function normalizeMap(map) {
  if (!isValidMap(map)) {
    return [];
  }
  return Array.isArray(map) ? map.map(function(key2) {
    return { key: key2, val: key2 };
  }) : Object.keys(map).map(function(key2) {
    return { key: key2, val: map[key2] };
  });
}
function isValidMap(map) {
  return Array.isArray(map) || isObject(map);
}
function normalizeNamespace(fn) {
  return function(namespace, map) {
    if (typeof namespace !== "string") {
      map = namespace;
      namespace = "";
    } else if (namespace.charAt(namespace.length - 1) !== "/") {
      namespace += "/";
    }
    return fn(namespace, map);
  };
}
function getModuleByNamespace(store, helper, namespace) {
  var module2 = store._modulesNamespaceMap[namespace];
  if (!module2) {
    console.error("[vuex] module namespace not found in " + helper + "(): " + namespace);
  }
  return module2;
}
const createHook = (lifecycle) => (hook, target = getCurrentInstance()) => {
  !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
};
const onShow = /* @__PURE__ */ createHook(ON_SHOW);
const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
const fontData = [
  {
    "font_class": "arrow-down",
    "unicode": ""
  },
  {
    "font_class": "arrow-left",
    "unicode": ""
  },
  {
    "font_class": "arrow-right",
    "unicode": ""
  },
  {
    "font_class": "arrow-up",
    "unicode": ""
  },
  {
    "font_class": "auth",
    "unicode": ""
  },
  {
    "font_class": "auth-filled",
    "unicode": ""
  },
  {
    "font_class": "back",
    "unicode": ""
  },
  {
    "font_class": "bars",
    "unicode": ""
  },
  {
    "font_class": "calendar",
    "unicode": ""
  },
  {
    "font_class": "calendar-filled",
    "unicode": ""
  },
  {
    "font_class": "camera",
    "unicode": ""
  },
  {
    "font_class": "camera-filled",
    "unicode": ""
  },
  {
    "font_class": "cart",
    "unicode": ""
  },
  {
    "font_class": "cart-filled",
    "unicode": ""
  },
  {
    "font_class": "chat",
    "unicode": ""
  },
  {
    "font_class": "chat-filled",
    "unicode": ""
  },
  {
    "font_class": "chatboxes",
    "unicode": ""
  },
  {
    "font_class": "chatboxes-filled",
    "unicode": ""
  },
  {
    "font_class": "chatbubble",
    "unicode": ""
  },
  {
    "font_class": "chatbubble-filled",
    "unicode": ""
  },
  {
    "font_class": "checkbox",
    "unicode": ""
  },
  {
    "font_class": "checkbox-filled",
    "unicode": ""
  },
  {
    "font_class": "checkmarkempty",
    "unicode": ""
  },
  {
    "font_class": "circle",
    "unicode": ""
  },
  {
    "font_class": "circle-filled",
    "unicode": ""
  },
  {
    "font_class": "clear",
    "unicode": ""
  },
  {
    "font_class": "close",
    "unicode": ""
  },
  {
    "font_class": "closeempty",
    "unicode": ""
  },
  {
    "font_class": "cloud-download",
    "unicode": ""
  },
  {
    "font_class": "cloud-download-filled",
    "unicode": ""
  },
  {
    "font_class": "cloud-upload",
    "unicode": ""
  },
  {
    "font_class": "cloud-upload-filled",
    "unicode": ""
  },
  {
    "font_class": "color",
    "unicode": ""
  },
  {
    "font_class": "color-filled",
    "unicode": ""
  },
  {
    "font_class": "compose",
    "unicode": ""
  },
  {
    "font_class": "contact",
    "unicode": ""
  },
  {
    "font_class": "contact-filled",
    "unicode": ""
  },
  {
    "font_class": "down",
    "unicode": ""
  },
  {
    "font_class": "bottom",
    "unicode": ""
  },
  {
    "font_class": "download",
    "unicode": ""
  },
  {
    "font_class": "download-filled",
    "unicode": ""
  },
  {
    "font_class": "email",
    "unicode": ""
  },
  {
    "font_class": "email-filled",
    "unicode": ""
  },
  {
    "font_class": "eye",
    "unicode": ""
  },
  {
    "font_class": "eye-filled",
    "unicode": ""
  },
  {
    "font_class": "eye-slash",
    "unicode": ""
  },
  {
    "font_class": "eye-slash-filled",
    "unicode": ""
  },
  {
    "font_class": "fire",
    "unicode": ""
  },
  {
    "font_class": "fire-filled",
    "unicode": ""
  },
  {
    "font_class": "flag",
    "unicode": ""
  },
  {
    "font_class": "flag-filled",
    "unicode": ""
  },
  {
    "font_class": "folder-add",
    "unicode": ""
  },
  {
    "font_class": "folder-add-filled",
    "unicode": ""
  },
  {
    "font_class": "font",
    "unicode": ""
  },
  {
    "font_class": "forward",
    "unicode": ""
  },
  {
    "font_class": "gear",
    "unicode": ""
  },
  {
    "font_class": "gear-filled",
    "unicode": ""
  },
  {
    "font_class": "gift",
    "unicode": ""
  },
  {
    "font_class": "gift-filled",
    "unicode": ""
  },
  {
    "font_class": "hand-down",
    "unicode": ""
  },
  {
    "font_class": "hand-down-filled",
    "unicode": ""
  },
  {
    "font_class": "hand-up",
    "unicode": ""
  },
  {
    "font_class": "hand-up-filled",
    "unicode": ""
  },
  {
    "font_class": "headphones",
    "unicode": ""
  },
  {
    "font_class": "heart",
    "unicode": ""
  },
  {
    "font_class": "heart-filled",
    "unicode": ""
  },
  {
    "font_class": "help",
    "unicode": ""
  },
  {
    "font_class": "help-filled",
    "unicode": ""
  },
  {
    "font_class": "home",
    "unicode": ""
  },
  {
    "font_class": "home-filled",
    "unicode": ""
  },
  {
    "font_class": "image",
    "unicode": ""
  },
  {
    "font_class": "image-filled",
    "unicode": ""
  },
  {
    "font_class": "images",
    "unicode": ""
  },
  {
    "font_class": "images-filled",
    "unicode": ""
  },
  {
    "font_class": "info",
    "unicode": ""
  },
  {
    "font_class": "info-filled",
    "unicode": ""
  },
  {
    "font_class": "left",
    "unicode": ""
  },
  {
    "font_class": "link",
    "unicode": ""
  },
  {
    "font_class": "list",
    "unicode": ""
  },
  {
    "font_class": "location",
    "unicode": ""
  },
  {
    "font_class": "location-filled",
    "unicode": ""
  },
  {
    "font_class": "locked",
    "unicode": ""
  },
  {
    "font_class": "locked-filled",
    "unicode": ""
  },
  {
    "font_class": "loop",
    "unicode": ""
  },
  {
    "font_class": "mail-open",
    "unicode": ""
  },
  {
    "font_class": "mail-open-filled",
    "unicode": ""
  },
  {
    "font_class": "map",
    "unicode": ""
  },
  {
    "font_class": "map-filled",
    "unicode": ""
  },
  {
    "font_class": "map-pin",
    "unicode": ""
  },
  {
    "font_class": "map-pin-ellipse",
    "unicode": ""
  },
  {
    "font_class": "medal",
    "unicode": ""
  },
  {
    "font_class": "medal-filled",
    "unicode": ""
  },
  {
    "font_class": "mic",
    "unicode": ""
  },
  {
    "font_class": "mic-filled",
    "unicode": ""
  },
  {
    "font_class": "micoff",
    "unicode": ""
  },
  {
    "font_class": "micoff-filled",
    "unicode": ""
  },
  {
    "font_class": "minus",
    "unicode": ""
  },
  {
    "font_class": "minus-filled",
    "unicode": ""
  },
  {
    "font_class": "more",
    "unicode": ""
  },
  {
    "font_class": "more-filled",
    "unicode": ""
  },
  {
    "font_class": "navigate",
    "unicode": ""
  },
  {
    "font_class": "navigate-filled",
    "unicode": ""
  },
  {
    "font_class": "notification",
    "unicode": ""
  },
  {
    "font_class": "notification-filled",
    "unicode": ""
  },
  {
    "font_class": "paperclip",
    "unicode": ""
  },
  {
    "font_class": "paperplane",
    "unicode": ""
  },
  {
    "font_class": "paperplane-filled",
    "unicode": ""
  },
  {
    "font_class": "person",
    "unicode": ""
  },
  {
    "font_class": "person-filled",
    "unicode": ""
  },
  {
    "font_class": "personadd",
    "unicode": ""
  },
  {
    "font_class": "personadd-filled",
    "unicode": ""
  },
  {
    "font_class": "personadd-filled-copy",
    "unicode": ""
  },
  {
    "font_class": "phone",
    "unicode": ""
  },
  {
    "font_class": "phone-filled",
    "unicode": ""
  },
  {
    "font_class": "plus",
    "unicode": ""
  },
  {
    "font_class": "plus-filled",
    "unicode": ""
  },
  {
    "font_class": "plusempty",
    "unicode": ""
  },
  {
    "font_class": "pulldown",
    "unicode": ""
  },
  {
    "font_class": "pyq",
    "unicode": ""
  },
  {
    "font_class": "qq",
    "unicode": ""
  },
  {
    "font_class": "redo",
    "unicode": ""
  },
  {
    "font_class": "redo-filled",
    "unicode": ""
  },
  {
    "font_class": "refresh",
    "unicode": ""
  },
  {
    "font_class": "refresh-filled",
    "unicode": ""
  },
  {
    "font_class": "refreshempty",
    "unicode": ""
  },
  {
    "font_class": "reload",
    "unicode": ""
  },
  {
    "font_class": "right",
    "unicode": ""
  },
  {
    "font_class": "scan",
    "unicode": ""
  },
  {
    "font_class": "search",
    "unicode": ""
  },
  {
    "font_class": "settings",
    "unicode": ""
  },
  {
    "font_class": "settings-filled",
    "unicode": ""
  },
  {
    "font_class": "shop",
    "unicode": ""
  },
  {
    "font_class": "shop-filled",
    "unicode": ""
  },
  {
    "font_class": "smallcircle",
    "unicode": ""
  },
  {
    "font_class": "smallcircle-filled",
    "unicode": ""
  },
  {
    "font_class": "sound",
    "unicode": ""
  },
  {
    "font_class": "sound-filled",
    "unicode": ""
  },
  {
    "font_class": "spinner-cycle",
    "unicode": ""
  },
  {
    "font_class": "staff",
    "unicode": ""
  },
  {
    "font_class": "staff-filled",
    "unicode": ""
  },
  {
    "font_class": "star",
    "unicode": ""
  },
  {
    "font_class": "star-filled",
    "unicode": ""
  },
  {
    "font_class": "starhalf",
    "unicode": ""
  },
  {
    "font_class": "trash",
    "unicode": ""
  },
  {
    "font_class": "trash-filled",
    "unicode": ""
  },
  {
    "font_class": "tune",
    "unicode": ""
  },
  {
    "font_class": "tune-filled",
    "unicode": ""
  },
  {
    "font_class": "undo",
    "unicode": ""
  },
  {
    "font_class": "undo-filled",
    "unicode": ""
  },
  {
    "font_class": "up",
    "unicode": ""
  },
  {
    "font_class": "top",
    "unicode": ""
  },
  {
    "font_class": "upload",
    "unicode": ""
  },
  {
    "font_class": "upload-filled",
    "unicode": ""
  },
  {
    "font_class": "videocam",
    "unicode": ""
  },
  {
    "font_class": "videocam-filled",
    "unicode": ""
  },
  {
    "font_class": "vip",
    "unicode": ""
  },
  {
    "font_class": "vip-filled",
    "unicode": ""
  },
  {
    "font_class": "wallet",
    "unicode": ""
  },
  {
    "font_class": "wallet-filled",
    "unicode": ""
  },
  {
    "font_class": "weibo",
    "unicode": ""
  },
  {
    "font_class": "weixin",
    "unicode": ""
  }
];
const en$1 = {
  "uni-load-more.contentdown": "Pull up to show more",
  "uni-load-more.contentrefresh": "loading...",
  "uni-load-more.contentnomore": "No more data"
};
const zhHans = {
  "uni-load-more.contentdown": "上拉显示更多",
  "uni-load-more.contentrefresh": "正在加载...",
  "uni-load-more.contentnomore": "没有更多数据了"
};
const zhHant = {
  "uni-load-more.contentdown": "上拉顯示更多",
  "uni-load-more.contentrefresh": "正在加載...",
  "uni-load-more.contentnomore": "沒有更多數據了"
};
const messages = {
  en: en$1,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant
};
const pages = [
  {
    path: "pages/login/login",
    style: {
      navigationBarTitleText: "登录"
    }
  },
  {
    path: "pages/register/index",
    style: {
      navigationBarTitleText: "注册"
    }
  },
  {
    path: "pages/forgot-password/index",
    style: {
      navigationBarTitleText: "忘记密码"
    }
  },
  {
    path: "pages/index/index",
    style: {
      navigationBarTitleText: "津乐游"
    }
  },
  {
    path: "pages/partner/index",
    style: {
      navigationBarTitleText: "行程列表"
    }
  },
  {
    path: "pages/partner/create-plans",
    style: {
      navigationBarTitleText: "发布旅行计划"
    }
  },
  {
    path: "pages/partner/create-guides",
    style: {
      navigationBarTitleText: "发布导游服务"
    }
  },
  {
    path: "pages/chat/chat",
    style: {
      navigationBarTitleText: "聊天"
    }
  },
  {
    path: "pages/guide/guide",
    style: {
      navigationBarTitleText: "应急导航"
    }
  },
  {
    path: "pages/my/my",
    style: {
      navigationBarTitleText: "个人中心"
    }
  },
  {
    path: "pages/scenic/scenic",
    style: {
      navigationBarTitleText: "景点详情"
    }
  },
  {
    path: "pages/my/my_messages",
    style: {
      navigationBarTitleText: "我的消息"
    }
  },
  {
    path: "pages/my/my_comments",
    style: {
      navigationBarTitleText: "我的评论"
    }
  },
  {
    path: "pages/my/my_trips",
    style: {
      navigationBarTitleText: "我的行程"
    }
  },
  {
    path: "pages/my/my_services",
    style: {
      navigationBarTitleText: "我的服务"
    }
  },
  {
    path: "pages/my/setting",
    style: {
      navigationBarTitleText: "设置"
    }
  },
  {
    path: "pages/my/edit_profile",
    style: {
      navigationBarTitleText: "修改个人资料"
    }
  }
];
const tabBar = {
  color: "#7A7E83",
  selectedColor: "#2867CE",
  borderStyle: "black",
  backgroundColor: "#ffffff",
  list: [
    {
      pagePath: "pages/index/index",
      iconPath: "static/tabBar/home01.png",
      selectedIconPath: "static/tabBar/home.png",
      text: "景点"
    },
    {
      pagePath: "pages/partner/index",
      iconPath: "static/tabBar/partner01.png",
      selectedIconPath: "static/tabBar/partner.png",
      text: "找同伴"
    },
    {
      pagePath: "pages/guide/guide",
      iconPath: "static/tabBar/guide01.png",
      selectedIconPath: "static/tabBar/guide.png",
      text: "应急导航"
    },
    {
      pagePath: "pages/my/my",
      iconPath: "static/tabBar/my01.png",
      selectedIconPath: "static/tabBar/my.png",
      text: "个人中心"
    }
  ]
};
const easycom = {
  autoscan: true,
  custom: {
    "^u--(.*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue",
    "^up-(.*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue",
    "^u-([^-].*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue",
    "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
  }
};
const globalStyle = {
  navigationBarTextStyle: "black",
  navigationBarTitleText: "uni-app",
  navigationBarBackgroundColor: "#F8F8F8",
  backgroundColor: "#F8F8F8"
};
const uniIdRouter = {};
const e = {
  pages,
  tabBar,
  easycom,
  globalStyle,
  uniIdRouter
};
var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [];
function t(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function n(e2, t2, n2) {
  return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
    return function() {
      throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
    }(null == t3 && n2.path);
  } }, n2.exports), n2.exports;
}
var s = n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = n2 || function(e3, t3) {
    var n3 = Object.create || /* @__PURE__ */ function() {
      function e4() {
      }
      return function(t4) {
        var n4;
        return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
      };
    }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
      var t4 = n3(this);
      return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
        t4.$super.init.apply(this, arguments);
      }), t4.init.prototype = t4, t4.$super = this, t4;
    }, create: function() {
      var e4 = this.extend();
      return e4.init.apply(e4, arguments), e4;
    }, init: function() {
    }, mixIn: function(e4) {
      for (var t4 in e4)
        e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
      e4.hasOwnProperty("toString") && (this.toString = e4.toString);
    }, clone: function() {
      return this.init.prototype.extend(this);
    } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
      e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
    }, toString: function(e4) {
      return (e4 || c2).stringify(this);
    }, concat: function(e4) {
      var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
      if (this.clamp(), s3 % 4)
        for (var i3 = 0; i3 < r3; i3++) {
          var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
          t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
        }
      else
        for (i3 = 0; i3 < r3; i3 += 4)
          t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
      return this.sigBytes += r3, this;
    }, clamp: function() {
      var t4 = this.words, n4 = this.sigBytes;
      t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4.words = this.words.slice(0), e4;
    }, random: function(t4) {
      for (var n4, s3 = [], r3 = function(t5) {
        t5 = t5;
        var n5 = 987654321, s4 = 4294967295;
        return function() {
          var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
          return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
        };
      }, i3 = 0; i3 < t4; i3 += 4) {
        var a3 = r3(4294967296 * (n4 || e3.random()));
        n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
      }
      return new o2.init(s3, t4);
    } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
      for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
        var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
        s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
      }
      return s3.join("");
    }, parse: function(e4) {
      for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
        n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
      return new o2.init(n4, t4 / 2);
    } }, u2 = a2.Latin1 = { stringify: function(e4) {
      for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
        var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
        s3.push(String.fromCharCode(i3));
      }
      return s3.join("");
    }, parse: function(e4) {
      for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
        n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
      return new o2.init(n4, t4);
    } }, h2 = a2.Utf8 = { stringify: function(e4) {
      try {
        return decodeURIComponent(escape(u2.stringify(e4)));
      } catch (e5) {
        throw new Error("Malformed UTF-8 data");
      }
    }, parse: function(e4) {
      return u2.parse(unescape(encodeURIComponent(e4)));
    } }, l2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
      this._data = new o2.init(), this._nDataBytes = 0;
    }, _append: function(e4) {
      "string" == typeof e4 && (e4 = h2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
    }, _process: function(t4) {
      var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
      if (c3) {
        for (var h3 = 0; h3 < c3; h3 += i3)
          this._doProcessBlock(s3, h3);
        var l3 = s3.splice(0, c3);
        n4.sigBytes -= u3;
      }
      return new o2.init(l3, u3);
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4._data = this._data.clone(), e4;
    }, _minBufferSize: 0 });
    r2.Hasher = l2.extend({ cfg: i2.extend(), init: function(e4) {
      this.cfg = this.cfg.extend(e4), this.reset();
    }, reset: function() {
      l2.reset.call(this), this._doReset();
    }, update: function(e4) {
      return this._append(e4), this._process(), this;
    }, finalize: function(e4) {
      return e4 && this._append(e4), this._doFinalize();
    }, blockSize: 16, _createHelper: function(e4) {
      return function(t4, n4) {
        return new e4.init(n4).finalize(t4);
      };
    }, _createHmacHelper: function(e4) {
      return function(t4, n4) {
        return new d2.HMAC.init(e4, n4).finalize(t4);
      };
    } });
    var d2 = s2.algo = {};
    return s2;
  }(Math), n2);
}), r = s, i = (n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, function(e3) {
    var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
    !function() {
      for (var t4 = 0; t4 < 64; t4++)
        a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
    }();
    var c2 = o2.MD5 = i2.extend({ _doReset: function() {
      this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
    }, _doProcessBlock: function(e4, t4) {
      for (var n3 = 0; n3 < 16; n3++) {
        var s3 = t4 + n3, r3 = e4[s3];
        e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
      }
      var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], v2 = e4[t4 + 9], I2 = e4[t4 + 10], S2 = e4[t4 + 11], b2 = e4[t4 + 12], k2 = e4[t4 + 13], T2 = e4[t4 + 14], A2 = e4[t4 + 15], P2 = i3[0], C2 = i3[1], x2 = i3[2], O2 = i3[3];
      P2 = u2(P2, C2, x2, O2, o3, 7, a2[0]), O2 = u2(O2, P2, C2, x2, c3, 12, a2[1]), x2 = u2(x2, O2, P2, C2, p2, 17, a2[2]), C2 = u2(C2, x2, O2, P2, f2, 22, a2[3]), P2 = u2(P2, C2, x2, O2, g2, 7, a2[4]), O2 = u2(O2, P2, C2, x2, m2, 12, a2[5]), x2 = u2(x2, O2, P2, C2, y2, 17, a2[6]), C2 = u2(C2, x2, O2, P2, _2, 22, a2[7]), P2 = u2(P2, C2, x2, O2, w2, 7, a2[8]), O2 = u2(O2, P2, C2, x2, v2, 12, a2[9]), x2 = u2(x2, O2, P2, C2, I2, 17, a2[10]), C2 = u2(C2, x2, O2, P2, S2, 22, a2[11]), P2 = u2(P2, C2, x2, O2, b2, 7, a2[12]), O2 = u2(O2, P2, C2, x2, k2, 12, a2[13]), x2 = u2(x2, O2, P2, C2, T2, 17, a2[14]), P2 = h2(P2, C2 = u2(C2, x2, O2, P2, A2, 22, a2[15]), x2, O2, c3, 5, a2[16]), O2 = h2(O2, P2, C2, x2, y2, 9, a2[17]), x2 = h2(x2, O2, P2, C2, S2, 14, a2[18]), C2 = h2(C2, x2, O2, P2, o3, 20, a2[19]), P2 = h2(P2, C2, x2, O2, m2, 5, a2[20]), O2 = h2(O2, P2, C2, x2, I2, 9, a2[21]), x2 = h2(x2, O2, P2, C2, A2, 14, a2[22]), C2 = h2(C2, x2, O2, P2, g2, 20, a2[23]), P2 = h2(P2, C2, x2, O2, v2, 5, a2[24]), O2 = h2(O2, P2, C2, x2, T2, 9, a2[25]), x2 = h2(x2, O2, P2, C2, f2, 14, a2[26]), C2 = h2(C2, x2, O2, P2, w2, 20, a2[27]), P2 = h2(P2, C2, x2, O2, k2, 5, a2[28]), O2 = h2(O2, P2, C2, x2, p2, 9, a2[29]), x2 = h2(x2, O2, P2, C2, _2, 14, a2[30]), P2 = l2(P2, C2 = h2(C2, x2, O2, P2, b2, 20, a2[31]), x2, O2, m2, 4, a2[32]), O2 = l2(O2, P2, C2, x2, w2, 11, a2[33]), x2 = l2(x2, O2, P2, C2, S2, 16, a2[34]), C2 = l2(C2, x2, O2, P2, T2, 23, a2[35]), P2 = l2(P2, C2, x2, O2, c3, 4, a2[36]), O2 = l2(O2, P2, C2, x2, g2, 11, a2[37]), x2 = l2(x2, O2, P2, C2, _2, 16, a2[38]), C2 = l2(C2, x2, O2, P2, I2, 23, a2[39]), P2 = l2(P2, C2, x2, O2, k2, 4, a2[40]), O2 = l2(O2, P2, C2, x2, o3, 11, a2[41]), x2 = l2(x2, O2, P2, C2, f2, 16, a2[42]), C2 = l2(C2, x2, O2, P2, y2, 23, a2[43]), P2 = l2(P2, C2, x2, O2, v2, 4, a2[44]), O2 = l2(O2, P2, C2, x2, b2, 11, a2[45]), x2 = l2(x2, O2, P2, C2, A2, 16, a2[46]), P2 = d2(P2, C2 = l2(C2, x2, O2, P2, p2, 23, a2[47]), x2, O2, o3, 6, a2[48]), O2 = d2(O2, P2, C2, x2, _2, 10, a2[49]), x2 = d2(x2, O2, P2, C2, T2, 15, a2[50]), C2 = d2(C2, x2, O2, P2, m2, 21, a2[51]), P2 = d2(P2, C2, x2, O2, b2, 6, a2[52]), O2 = d2(O2, P2, C2, x2, f2, 10, a2[53]), x2 = d2(x2, O2, P2, C2, I2, 15, a2[54]), C2 = d2(C2, x2, O2, P2, c3, 21, a2[55]), P2 = d2(P2, C2, x2, O2, w2, 6, a2[56]), O2 = d2(O2, P2, C2, x2, A2, 10, a2[57]), x2 = d2(x2, O2, P2, C2, y2, 15, a2[58]), C2 = d2(C2, x2, O2, P2, k2, 21, a2[59]), P2 = d2(P2, C2, x2, O2, g2, 6, a2[60]), O2 = d2(O2, P2, C2, x2, S2, 10, a2[61]), x2 = d2(x2, O2, P2, C2, p2, 15, a2[62]), C2 = d2(C2, x2, O2, P2, v2, 21, a2[63]), i3[0] = i3[0] + P2 | 0, i3[1] = i3[1] + C2 | 0, i3[2] = i3[2] + x2 | 0, i3[3] = i3[3] + O2 | 0;
    }, _doFinalize: function() {
      var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
      n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
      var i3 = e3.floor(s3 / 4294967296), o3 = s3;
      n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
      for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
        var h3 = c3[u3];
        c3[u3] = 16711935 & (h3 << 8 | h3 >>> 24) | 4278255360 & (h3 << 24 | h3 >>> 8);
      }
      return a3;
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4._hash = this._hash.clone(), e4;
    } });
    function u2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    function h2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    function l2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    function d2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
  }(Math), n2.MD5);
}), n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, void function() {
    var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
    e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
      e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
      var n3 = e4.blockSize, r2 = 4 * n3;
      t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
      for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
        a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
      i2.sigBytes = o2.sigBytes = r2, this.reset();
    }, reset: function() {
      var e4 = this._hasher;
      e4.reset(), e4.update(this._iKey);
    }, update: function(e4) {
      return this._hasher.update(e4), this;
    }, finalize: function(e4) {
      var t4 = this._hasher, n3 = t4.finalize(e4);
      return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
    } });
  }());
}), n(function(e2, t2) {
  e2.exports = r.HmacMD5;
})), o = n(function(e2, t2) {
  e2.exports = r.enc.Utf8;
}), a = n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, function() {
    var e3 = n2, t3 = e3.lib.WordArray;
    function s2(e4, n3, s3) {
      for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
        if (o2 % 4) {
          var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
          r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
        }
      return t3.create(r2, i2);
    }
    e3.enc.Base64 = { stringify: function(e4) {
      var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
      e4.clamp();
      for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
        for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
          r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
      var c2 = s3.charAt(64);
      if (c2)
        for (; r2.length % 4; )
          r2.push(c2);
      return r2.join("");
    }, parse: function(e4) {
      var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
      if (!r2) {
        r2 = this._reverseMap = [];
        for (var i2 = 0; i2 < n3.length; i2++)
          r2[n3.charCodeAt(i2)] = i2;
      }
      var o2 = n3.charAt(64);
      if (o2) {
        var a2 = e4.indexOf(o2);
        -1 !== a2 && (t4 = a2);
      }
      return s2(e4, t4, r2);
    }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
  }(), n2.enc.Base64);
});
const c = "FUNCTION", u = "OBJECT", h = "CLIENT_DB", l = "pending", d = "fulfilled", p = "rejected";
function f(e2) {
  return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
}
function g(e2) {
  return "object" === f(e2);
}
function m(e2) {
  return "function" == typeof e2;
}
function y(e2) {
  return function() {
    try {
      return e2.apply(e2, arguments);
    } catch (e3) {
      console.error(e3);
    }
  };
}
const _ = "REJECTED", w = "NOT_PENDING";
class v {
  constructor({ createPromise: e2, retryRule: t2 = _ } = {}) {
    this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
  }
  get needRetry() {
    if (!this.status)
      return true;
    switch (this.retryRule) {
      case _:
        return this.status === p;
      case w:
        return this.status !== l;
    }
  }
  exec() {
    return this.needRetry ? (this.status = l, this.promise = this.createPromise().then((e2) => (this.status = d, Promise.resolve(e2)), (e2) => (this.status = p, Promise.reject(e2))), this.promise) : this.promise;
  }
}
function I(e2) {
  return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
}
const S = true, b = "mp-weixin", T = I(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), A = b, P = I(""), C = I("[]") || [];
let O = "";
try {
  O = "";
} catch (e2) {
}
let L = {};
function R(e2, t2 = {}) {
  var n2, s2;
  return n2 = L, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (L[e2] = t2), L[e2];
}
const N = ["invoke", "success", "fail", "complete"], D = R("_globalUniCloudInterceptor");
function M(e2, t2) {
  D[e2] || (D[e2] = {}), g(t2) && Object.keys(t2).forEach((n2) => {
    N.indexOf(n2) > -1 && function(e3, t3, n3) {
      let s2 = D[e3][t3];
      s2 || (s2 = D[e3][t3] = []), -1 === s2.indexOf(n3) && m(n3) && s2.push(n3);
    }(e2, n2, t2[n2]);
  });
}
function q(e2, t2) {
  D[e2] || (D[e2] = {}), g(t2) ? Object.keys(t2).forEach((n2) => {
    N.indexOf(n2) > -1 && function(e3, t3, n3) {
      const s2 = D[e3][t3];
      if (!s2)
        return;
      const r2 = s2.indexOf(n3);
      r2 > -1 && s2.splice(r2, 1);
    }(e2, n2, t2[n2]);
  }) : delete D[e2];
}
function K(e2, t2) {
  return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
}
function F(e2, t2) {
  return D[e2] && D[e2][t2] || [];
}
function j(e2) {
  M("callObject", e2);
}
const $ = R("_globalUniCloudListener"), B = "response", W = "needLogin", H = "refreshToken", J = "clientdb", z = "cloudfunction", V = "cloudobject";
function G(e2) {
  return $[e2] || ($[e2] = []), $[e2];
}
function Y(e2, t2) {
  const n2 = G(e2);
  n2.includes(t2) || n2.push(t2);
}
function Q(e2, t2) {
  const n2 = G(e2), s2 = n2.indexOf(t2);
  -1 !== s2 && n2.splice(s2, 1);
}
function X(e2, t2) {
  const n2 = G(e2);
  for (let e3 = 0; e3 < n2.length; e3++) {
    (0, n2[e3])(t2);
  }
}
let Z, ee = false;
function te() {
  return Z || (Z = new Promise((e2) => {
    ee && e2(), function t2() {
      if ("function" == typeof getCurrentPages) {
        const t3 = getCurrentPages();
        t3 && t3[0] && (ee = true, e2());
      }
      ee || setTimeout(() => {
        t2();
      }, 30);
    }();
  }), Z);
}
function ne(e2) {
  const t2 = {};
  for (const n2 in e2) {
    const s2 = e2[n2];
    m(s2) && (t2[n2] = y(s2));
  }
  return t2;
}
class se extends Error {
  constructor(e2) {
    super(e2.message), this.errMsg = e2.message || e2.errMsg || "unknown system error", this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
  }
  toJson(e2 = 0) {
    if (!(e2 >= 10))
      return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
  }
}
var re = { request: (e2) => index.request(e2), uploadFile: (e2) => index.uploadFile(e2), setStorageSync: (e2, t2) => index.setStorageSync(e2, t2), getStorageSync: (e2) => index.getStorageSync(e2), removeStorageSync: (e2) => index.removeStorageSync(e2), clearStorageSync: () => index.clearStorageSync(), connectSocket: (e2) => index.connectSocket(e2) };
function ie(e2) {
  return e2 && ie(e2.__v_raw) || e2;
}
function oe() {
  return { token: re.getStorageSync("uni_id_token") || re.getStorageSync("uniIdToken"), tokenExpired: re.getStorageSync("uni_id_token_expired") };
}
function ae({ token: e2, tokenExpired: t2 } = {}) {
  e2 && re.setStorageSync("uni_id_token", e2), t2 && re.setStorageSync("uni_id_token_expired", t2);
}
let ce, ue;
function he() {
  return ce || (ce = index.getSystemInfoSync()), ce;
}
function le() {
  let e2, t2;
  try {
    if (index.getLaunchOptionsSync) {
      if (index.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
        return;
      const { scene: n2, channel: s2 } = index.getLaunchOptionsSync();
      e2 = s2, t2 = n2;
    }
  } catch (e3) {
  }
  return { channel: e2, scene: t2 };
}
let de = {};
function pe() {
  const e2 = index.getLocale && index.getLocale() || "en";
  if (ue)
    return { ...de, ...ue, locale: e2, LOCALE: e2 };
  const t2 = he(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
  for (const e3 in t2)
    Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
  return ue = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...le(), ...t2 }, { ...de, ...ue, locale: e2, LOCALE: e2 };
}
var fe = { sign: function(e2, t2) {
  let n2 = "";
  return Object.keys(e2).sort().forEach(function(t3) {
    e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
  }), n2 = n2.slice(1), i(n2, t2).toString();
}, wrappedRequest: function(e2, t2) {
  return new Promise((n2, s2) => {
    t2(Object.assign(e2, { complete(e3) {
      e3 || (e3 = {});
      const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
      if (!e3.statusCode || e3.statusCode >= 400) {
        const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
        return s2(new se({ code: n3, message: r3, requestId: t3 }));
      }
      const r2 = e3.data;
      if (r2.error)
        return s2(new se({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
      r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
    } }));
  });
}, toBase64: function(e2) {
  return a.stringify(o.parse(e2));
} };
var ge = class {
  constructor(e2) {
    ["spaceId", "clientSecret"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(`${t2} required`);
    }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = re, this._getAccessTokenPromiseHub = new v({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
      if (!e3.result || !e3.result.accessToken)
        throw new se({ code: "AUTH_FAILED", message: "获取accessToken失败" });
      this.setAccessToken(e3.result.accessToken);
    }), retryRule: w });
  }
  get hasAccessToken() {
    return !!this.accessToken;
  }
  setAccessToken(e2) {
    this.accessToken = e2;
  }
  requestWrapped(e2) {
    return fe.wrappedRequest(e2, this.adapter.request);
  }
  requestAuth(e2) {
    return this.requestWrapped(e2);
  }
  request(e2, t2) {
    return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
      !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
    }).then(() => this.getAccessToken()).then(() => {
      const t4 = this.rebuildRequest(e2);
      return this.request(t4, true);
    })) : this.getAccessToken().then(() => {
      const t3 = this.rebuildRequest(e2);
      return this.request(t3, true);
    }));
  }
  rebuildRequest(e2) {
    const t2 = Object.assign({}, e2);
    return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = fe.sign(t2.data, this.config.clientSecret), t2;
  }
  setupRequest(e2, t2) {
    const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
    return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = fe.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
  }
  getAccessToken() {
    return this._getAccessTokenPromiseHub.exec();
  }
  async authorize() {
    await this.getAccessToken();
  }
  callFunction(e2) {
    const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
    return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
  }
  getOSSUploadOptionsFromPath(e2) {
    const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
    return this.request(this.setupRequest(t2));
  }
  uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
    return new Promise((o2, a2) => {
      const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
        e3 && e3.statusCode < 400 ? o2(e3) : a2(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }, fail(e3) {
        a2(new se({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
      } });
      "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
        i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
      });
    });
  }
  reportOSSUpload(e2) {
    const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
    return this.request(this.setupRequest(t2));
  }
  async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
    if ("string" !== f(t2))
      throw new se({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
    if (!(t2 = t2.trim()))
      throw new se({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
    if (/:\/\//.test(t2))
      throw new se({ code: "INVALID_PARAM", message: "cloudPath不合法" });
    const o2 = i2 && i2.envType || this.config.envType;
    if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
      throw new se({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
    const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: h2, signature: l2, host: d2, ossPath: p2, id: g2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: h2, Signature: l2, host: d2, id: g2, key: p2, policy: m2, success_action_status: 200 };
    if (u2 && (_2["x-oss-security-token"] = u2), y2) {
      const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: g2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
      _2.callback = fe.toBase64(e3);
    }
    const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
    if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
      return { success: true, filePath: e2, fileID: c2 };
    if ((await this.reportOSSUpload({ id: g2 })).success)
      return { success: true, filePath: e2, fileID: c2 };
    throw new se({ code: "UPLOAD_FAILED", message: "文件上传失败" });
  }
  getTempFileURL({ fileList: e2 } = {}) {
    return new Promise((t2, n2) => {
      Array.isArray(e2) && 0 !== e2.length || n2(new se({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), t2({ fileList: e2.map((e3) => ({ fileID: e3, tempFileURL: e3 })) });
    });
  }
  async getFileInfo({ fileList: e2 } = {}) {
    if (!Array.isArray(e2) || 0 === e2.length)
      throw new se({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
    const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
    return { fileList: (await this.request(this.setupRequest(t2))).result };
  }
};
var me = { init(e2) {
  const t2 = new ge(e2), n2 = { signInAnonymously: function() {
    return t2.authorize();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} };
const ye = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
var _e;
!function(e2) {
  e2.local = "local", e2.none = "none", e2.session = "session";
}(_e || (_e = {}));
var we = function() {
}, ve = n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, function(e3) {
    var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
    !function() {
      function t4(t5) {
        for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
          if (!(t5 % s4))
            return false;
        return true;
      }
      function n3(e4) {
        return 4294967296 * (e4 - (0 | e4)) | 0;
      }
      for (var s3 = 2, r3 = 0; r3 < 64; )
        t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
    }();
    var u2 = [], h2 = o2.SHA256 = i2.extend({ _doReset: function() {
      this._hash = new r2.init(a2.slice(0));
    }, _doProcessBlock: function(e4, t4) {
      for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], h3 = n3[5], l2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
        if (p2 < 16)
          u2[p2] = 0 | e4[t4 + p2];
        else {
          var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
          u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
        }
        var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), v2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & h3 ^ ~a3 & l2) + c2[p2] + u2[p2];
        d2 = l2, l2 = h3, h3 = a3, a3 = o3 + v2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = v2 + (w2 + _2) | 0;
      }
      n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + h3 | 0, n3[6] = n3[6] + l2 | 0, n3[7] = n3[7] + d2 | 0;
    }, _doFinalize: function() {
      var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
      return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4._hash = this._hash.clone(), e4;
    } });
    t3.SHA256 = i2._createHelper(h2), t3.HmacSHA256 = i2._createHmacHelper(h2);
  }(Math), n2.SHA256);
}), Ie = ve, Se = n(function(e2, t2) {
  e2.exports = r.HmacSHA256;
});
const be = () => {
  let e2;
  if (!Promise) {
    e2 = () => {
    }, e2.promise = {};
    const t3 = () => {
      throw new se({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
    };
    return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
  }
  const t2 = new Promise((t3, n2) => {
    e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
  });
  return e2.promise = t2, e2;
};
function ke(e2) {
  return void 0 === e2;
}
function Te(e2) {
  return "[object Null]" === Object.prototype.toString.call(e2);
}
function Ae(e2 = "") {
  return e2.replace(/([\s\S]+)\s+(请前往云开发AI小助手查看问题：.*)/, "$1");
}
function Pe(e2 = 32) {
  const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n2 = t2.length;
  let s2 = "";
  for (let r2 = 0; r2 < e2; r2++)
    s2 += t2.charAt(Math.floor(Math.random() * n2));
  return s2;
}
var Ce;
function xe(e2) {
  const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
  var n2;
  for (const e3 of t2) {
    const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
    if (t3())
      return { adapter: n3(), runtime: s2 };
  }
}
!function(e2) {
  e2.WEB = "web", e2.WX_MP = "wx_mp";
}(Ce || (Ce = {}));
const Oe = { adapter: null, runtime: void 0 }, Ee = ["anonymousUuidKey"];
class Le extends we {
  constructor() {
    super(), Oe.adapter.root.tcbObject || (Oe.adapter.root.tcbObject = {});
  }
  setItem(e2, t2) {
    Oe.adapter.root.tcbObject[e2] = t2;
  }
  getItem(e2) {
    return Oe.adapter.root.tcbObject[e2];
  }
  removeItem(e2) {
    delete Oe.adapter.root.tcbObject[e2];
  }
  clear() {
    delete Oe.adapter.root.tcbObject;
  }
}
function Re(e2, t2) {
  switch (e2) {
    case "local":
      return t2.localStorage || new Le();
    case "none":
      return new Le();
    default:
      return t2.sessionStorage || new Le();
  }
}
class Ue {
  constructor(e2) {
    if (!this._storage) {
      this._persistence = Oe.adapter.primaryStorage || e2.persistence, this._storage = Re(this._persistence, Oe.adapter);
      const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = "device_id", a2 = `token_type_${e2.env}`, c2 = `user_info_${e2.env}`;
      this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: c2, deviceIdKey: o2, tokenTypeKey: a2 };
    }
  }
  updatePersistence(e2) {
    if (e2 === this._persistence)
      return;
    const t2 = "local" === this._persistence;
    this._persistence = e2;
    const n2 = Re(e2, Oe.adapter);
    for (const e3 in this.keys) {
      const s2 = this.keys[e3];
      if (t2 && Ee.includes(e3))
        continue;
      const r2 = this._storage.getItem(s2);
      ke(r2) || Te(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
    }
    this._storage = n2;
  }
  setStore(e2, t2, n2) {
    if (!this._storage)
      return;
    const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
    try {
      this._storage.setItem(e2, r2);
    } catch (e3) {
      throw e3;
    }
  }
  getStore(e2, t2) {
    try {
      if (!this._storage)
        return;
    } catch (e3) {
      return "";
    }
    t2 = t2 || "localCachev1";
    const n2 = this._storage.getItem(e2);
    if (!n2)
      return "";
    if (n2.indexOf(t2) >= 0) {
      return JSON.parse(n2).content;
    }
    return "";
  }
  removeStore(e2) {
    this._storage.removeItem(e2);
  }
}
const Ne = {}, De = {};
function Me(e2) {
  return Ne[e2];
}
class qe {
  constructor(e2, t2) {
    this.data = t2 || null, this.name = e2;
  }
}
class Ke extends qe {
  constructor(e2, t2) {
    super("error", { error: e2, data: t2 }), this.error = e2;
  }
}
const Fe = new class {
  constructor() {
    this._listeners = {};
  }
  on(e2, t2) {
    return function(e3, t3, n2) {
      n2[e3] = n2[e3] || [], n2[e3].push(t3);
    }(e2, t2, this._listeners), this;
  }
  off(e2, t2) {
    return function(e3, t3, n2) {
      if (n2 && n2[e3]) {
        const s2 = n2[e3].indexOf(t3);
        -1 !== s2 && n2[e3].splice(s2, 1);
      }
    }(e2, t2, this._listeners), this;
  }
  fire(e2, t2) {
    if (e2 instanceof Ke)
      return console.error(e2.error), this;
    const n2 = "string" == typeof e2 ? new qe(e2, t2 || {}) : e2;
    const s2 = n2.name;
    if (this._listens(s2)) {
      n2.target = this;
      const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
      for (const t3 of e3)
        t3.call(this, n2);
    }
    return this;
  }
  _listens(e2) {
    return this._listeners[e2] && this._listeners[e2].length > 0;
  }
}();
function je(e2, t2) {
  Fe.on(e2, t2);
}
function $e(e2, t2 = {}) {
  Fe.fire(e2, t2);
}
function Be(e2, t2) {
  Fe.off(e2, t2);
}
const We = "loginStateChanged", He = "loginStateExpire", Je = "loginTypeChanged", ze = "anonymousConverted", Ve = "refreshAccessToken";
var Ge;
!function(e2) {
  e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
}(Ge || (Ge = {}));
class Ye {
  constructor() {
    this._fnPromiseMap = /* @__PURE__ */ new Map();
  }
  async run(e2, t2) {
    let n2 = this._fnPromiseMap.get(e2);
    return n2 || (n2 = new Promise(async (n3, s2) => {
      try {
        await this._runIdlePromise();
        const s3 = t2();
        n3(await s3);
      } catch (e3) {
        s2(e3);
      } finally {
        this._fnPromiseMap.delete(e2);
      }
    }), this._fnPromiseMap.set(e2, n2)), n2;
  }
  _runIdlePromise() {
    return Promise.resolve();
  }
}
class Qe {
  constructor(e2) {
    this._singlePromise = new Ye(), this._cache = Me(e2.env), this._baseURL = `https://${e2.env}.ap-shanghai.tcb-api.tencentcloudapi.com`, this._reqClass = new Oe.adapter.reqClass({ timeout: e2.timeout, timeoutMsg: `请求在${e2.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] });
  }
  _getDeviceId() {
    if (this._deviceID)
      return this._deviceID;
    const { deviceIdKey: e2 } = this._cache.keys;
    let t2 = this._cache.getStore(e2);
    return "string" == typeof t2 && t2.length >= 16 && t2.length <= 48 || (t2 = Pe(), this._cache.setStore(e2, t2)), this._deviceID = t2, t2;
  }
  async _request(e2, t2, n2 = {}) {
    const s2 = { "x-request-id": Pe(), "x-device-id": this._getDeviceId() };
    if (n2.withAccessToken) {
      const { tokenTypeKey: e3 } = this._cache.keys, t3 = await this.getAccessToken(), n3 = this._cache.getStore(e3);
      s2.authorization = `${n3} ${t3}`;
    }
    return this._reqClass["get" === n2.method ? "get" : "post"]({ url: `${this._baseURL}${e2}`, data: t2, headers: s2 });
  }
  async _fetchAccessToken() {
    const { loginTypeKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2, tokenTypeKey: s2 } = this._cache.keys, r2 = this._cache.getStore(e2);
    if (r2 && r2 !== Ge.ANONYMOUS)
      throw new se({ code: "INVALID_OPERATION", message: "非匿名登录不支持刷新 access token" });
    const i2 = await this._singlePromise.run("fetchAccessToken", async () => (await this._request("/auth/v1/signin/anonymously", {}, { method: "post" })).data), { access_token: o2, expires_in: a2, token_type: c2 } = i2;
    return this._cache.setStore(s2, c2), this._cache.setStore(t2, o2), this._cache.setStore(n2, Date.now() + 1e3 * a2), o2;
  }
  isAccessTokenExpired(e2, t2) {
    let n2 = true;
    return e2 && t2 && (n2 = t2 < Date.now()), n2;
  }
  async getAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
    return this.isAccessTokenExpired(n2, s2) ? this._fetchAccessToken() : n2;
  }
  async refreshAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, loginTypeKey: n2 } = this._cache.keys;
    return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.setStore(n2, Ge.ANONYMOUS), this.getAccessToken();
  }
  async getUserInfo() {
    return this._singlePromise.run("getUserInfo", async () => (await this._request("/auth/v1/user/me", {}, { withAccessToken: true, method: "get" })).data);
  }
}
const Xe = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Ze = { "X-SDK-Version": "1.3.5" };
function et(e2, t2, n2) {
  const s2 = e2[t2];
  e2[t2] = function(t3) {
    const r2 = {}, i2 = {};
    n2.forEach((n3) => {
      const { data: s3, headers: o3 } = n3.call(e2, t3);
      Object.assign(r2, s3), Object.assign(i2, o3);
    });
    const o2 = t3.data;
    return o2 && (() => {
      var e3;
      if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
        t3.data = { ...o2, ...r2 };
      else
        for (const e4 in r2)
          o2.append(e4, r2[e4]);
    })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
  };
}
function tt$1() {
  const e2 = Math.random().toString(16).slice(2);
  return { data: { seqId: e2 }, headers: { ...Ze, "x-seqid": e2 } };
}
class nt {
  constructor(e2 = {}) {
    var t2;
    this.config = e2, this._reqClass = new Oe.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = Me(this.config.env), this._localCache = (t2 = this.config.env, De[t2]), this.oauth = new Qe(this.config), et(this._reqClass, "post", [tt$1]), et(this._reqClass, "upload", [tt$1]), et(this._reqClass, "download", [tt$1]);
  }
  async post(e2) {
    return await this._reqClass.post(e2);
  }
  async upload(e2) {
    return await this._reqClass.upload(e2);
  }
  async download(e2) {
    return await this._reqClass.download(e2);
  }
  async refreshAccessToken() {
    let e2, t2;
    this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
    try {
      e2 = await this._refreshAccessTokenPromise;
    } catch (e3) {
      t2 = e3;
    }
    if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
      throw t2;
    return e2;
  }
  async _refreshAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
    this._cache.removeStore(e2), this._cache.removeStore(t2);
    let i2 = this._cache.getStore(n2);
    if (!i2)
      throw new se({ message: "未登录CloudBase" });
    const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
    if (a2.data.code) {
      const { code: e3 } = a2.data;
      if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
        if (this._cache.getStore(s2) === Ge.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
          const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
          return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
        }
        $e(He), this._cache.removeStore(n2);
      }
      throw new se({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
    }
    if (a2.data.access_token)
      return $e(Ve), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
    a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
  }
  async getAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
    if (!this._cache.getStore(n2))
      throw new se({ message: "refresh token不存在，登录状态异常" });
    let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
    return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
  }
  async request(e2, t2, n2) {
    const s2 = `x-tcb-trace_${this.config.env}`;
    let r2 = "application/x-www-form-urlencoded";
    const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
    let o2;
    if (-1 === Xe.indexOf(e2) && (this._cache.keys, i2.access_token = await this.oauth.getAccessToken()), "storage.uploadFile" === e2) {
      o2 = new FormData();
      for (let e3 in o2)
        o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
      r2 = "multipart/form-data";
    } else {
      r2 = "application/json", o2 = {};
      for (let e3 in i2)
        void 0 !== i2[e3] && (o2[e3] = i2[e3]);
    }
    let a2 = { headers: { "content-type": r2 } };
    n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
    const c2 = this._localCache.getStore(s2);
    c2 && (a2.headers["X-TCB-Trace"] = c2);
    const { parse: u2, inQuery: h2, search: l2 } = t2;
    let d2 = { env: this.config.env };
    u2 && (d2.parse = true), h2 && (d2 = { ...h2, ...d2 });
    let p2 = function(e3, t3, n3 = {}) {
      const s3 = /\?/.test(t3);
      let r3 = "";
      for (let e4 in n3)
        "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
      return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
    }(ye, "//tcb-api.tencentcloudapi.com/web", d2);
    l2 && (p2 += l2);
    const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
    if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
      throw new se({ code: "NETWORK_ERROR", message: "network request error" });
    return f2;
  }
  async send(e2, t2 = {}, n2 = {}) {
    const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
    if (("ACCESS_TOKEN_DISABLED" === s2.data.code || "ACCESS_TOKEN_EXPIRED" === s2.data.code) && -1 === Xe.indexOf(e2)) {
      await this.oauth.refreshAccessToken();
      const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if (s3.data.code)
        throw new se({ code: s3.data.code, message: Ae(s3.data.message) });
      return s3.data;
    }
    if (s2.data.code)
      throw new se({ code: s2.data.code, message: Ae(s2.data.message) });
    return s2.data;
  }
  setRefreshToken(e2) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
  }
}
const st = {};
function rt(e2) {
  return st[e2];
}
class it {
  constructor(e2) {
    this.config = e2, this._cache = Me(e2.env), this._request = rt(e2.env);
  }
  setRefreshToken(e2) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
  }
  setAccessToken(e2, t2) {
    const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
    this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
  }
  async refreshUserInfo() {
    const { data: e2 } = await this._request.send("auth.getUserInfo", {});
    return this.setLocalUserInfo(e2), e2;
  }
  setLocalUserInfo(e2) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e2);
  }
}
class ot {
  constructor(e2) {
    if (!e2)
      throw new se({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._envId = e2, this._cache = Me(this._envId), this._request = rt(this._envId), this.setUserInfo();
  }
  linkWithTicket(e2) {
    if ("string" != typeof e2)
      throw new se({ code: "PARAM_ERROR", message: "ticket must be string" });
    return this._request.send("auth.linkWithTicket", { ticket: e2 });
  }
  linkWithRedirect(e2) {
    e2.signInWithRedirect();
  }
  updatePassword(e2, t2) {
    return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
  }
  updateEmail(e2) {
    return this._request.send("auth.updateEmail", { newEmail: e2 });
  }
  updateUsername(e2) {
    if ("string" != typeof e2)
      throw new se({ code: "PARAM_ERROR", message: "username must be a string" });
    return this._request.send("auth.updateUsername", { username: e2 });
  }
  async getLinkedUidList() {
    const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
    let t2 = false;
    const { users: n2 } = e2;
    return n2.forEach((e3) => {
      e3.wxOpenId && e3.wxPublicId && (t2 = true);
    }), { users: n2, hasPrimaryUid: t2 };
  }
  setPrimaryUid(e2) {
    return this._request.send("auth.setPrimaryUid", { uid: e2 });
  }
  unlink(e2) {
    return this._request.send("auth.unlink", { platform: e2 });
  }
  async update(e2) {
    const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
    this.setLocalUserInfo(a2);
  }
  async refresh() {
    const e2 = await this._request.oauth.getUserInfo();
    return this.setLocalUserInfo(e2), e2;
  }
  setUserInfo() {
    const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
    ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
      this[e3] = t2[e3];
    }), this.location = { country: t2.country, province: t2.province, city: t2.city };
  }
  setLocalUserInfo(e2) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e2), this.setUserInfo();
  }
}
class at {
  constructor(e2) {
    if (!e2)
      throw new se({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._cache = Me(e2);
    const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
    this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new ot(e2);
  }
  get isAnonymousAuth() {
    return this.loginType === Ge.ANONYMOUS;
  }
  get isCustomAuth() {
    return this.loginType === Ge.CUSTOM;
  }
  get isWeixinAuth() {
    return this.loginType === Ge.WECHAT || this.loginType === Ge.WECHAT_OPEN || this.loginType === Ge.WECHAT_PUBLIC;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
}
class ct extends it {
  async signIn() {
    this._cache.updatePersistence("local"), await this._request.oauth.getAccessToken(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.ANONYMOUS, persistence: "local" });
    const e2 = new at(this.config.env);
    return await e2.user.refresh(), e2;
  }
  async linkAndRetrieveDataWithTicket(e2) {
    const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
    if (i2.refresh_token)
      return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), $e(ze, { env: this.config.env }), $e(Je, { loginType: Ge.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
    throw new se({ message: "匿名转化失败" });
  }
  _setAnonymousUUID(e2) {
    const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, Ge.ANONYMOUS);
  }
  _clearAnonymousUUID() {
    this._cache.removeStore(this._cache.keys.anonymousUuidKey);
  }
}
class ut extends it {
  async signIn(e2) {
    if ("string" != typeof e2)
      throw new se({ code: "PARAM_ERROR", message: "ticket must be a string" });
    const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
    if (n2.refresh_token)
      return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new at(this.config.env);
    throw new se({ message: "自定义登录失败" });
  }
}
class ht extends it {
  async signIn(e2, t2) {
    if ("string" != typeof e2)
      throw new se({ code: "PARAM_ERROR", message: "email must be a string" });
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
    if (r2)
      return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.EMAIL, persistence: this.config.persistence }), new at(this.config.env);
    throw s2.code ? new se({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new se({ message: "邮箱登录失败" });
  }
  async activate(e2) {
    return this._request.send("auth.activateEndUserMail", { token: e2 });
  }
  async resetPasswordWithToken(e2, t2) {
    return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
  }
}
class lt extends it {
  async signIn(e2, t2) {
    if ("string" != typeof e2)
      throw new se({ code: "PARAM_ERROR", message: "username must be a string" });
    "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Ge.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
    if (r2)
      return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.USERNAME, persistence: this.config.persistence }), new at(this.config.env);
    throw s2.code ? new se({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new se({ message: "用户名密码登录失败" });
  }
}
class dt {
  constructor(e2) {
    this.config = e2, this._cache = Me(e2.env), this._request = rt(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), je(Je, this._onLoginTypeChanged);
  }
  get currentUser() {
    const e2 = this.hasLoginState();
    return e2 && e2.user || null;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
  anonymousAuthProvider() {
    return new ct(this.config);
  }
  customAuthProvider() {
    return new ut(this.config);
  }
  emailAuthProvider() {
    return new ht(this.config);
  }
  usernameAuthProvider() {
    return new lt(this.config);
  }
  async signInAnonymously() {
    return new ct(this.config).signIn();
  }
  async signInWithEmailAndPassword(e2, t2) {
    return new ht(this.config).signIn(e2, t2);
  }
  signInWithUsernameAndPassword(e2, t2) {
    return new lt(this.config).signIn(e2, t2);
  }
  async linkAndRetrieveDataWithTicket(e2) {
    this._anonymousAuthProvider || (this._anonymousAuthProvider = new ct(this.config)), je(ze, this._onAnonymousConverted);
    return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
  }
  async signOut() {
    if (this.loginType === Ge.ANONYMOUS)
      throw new se({ message: "匿名用户不支持登出操作" });
    const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
    if (!s2)
      return;
    const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
    return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), $e(We), $e(Je, { env: this.config.env, loginType: Ge.NULL, persistence: this.config.persistence }), r2;
  }
  async signUpWithEmailAndPassword(e2, t2) {
    return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
  }
  async sendPasswordResetEmail(e2) {
    return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
  }
  onLoginStateChanged(e2) {
    je(We, () => {
      const t3 = this.hasLoginState();
      e2.call(this, t3);
    });
    const t2 = this.hasLoginState();
    e2.call(this, t2);
  }
  onLoginStateExpired(e2) {
    je(He, e2.bind(this));
  }
  onAccessTokenRefreshed(e2) {
    je(Ve, e2.bind(this));
  }
  onAnonymousConverted(e2) {
    je(ze, e2.bind(this));
  }
  onLoginTypeChanged(e2) {
    je(Je, () => {
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    });
  }
  async getAccessToken() {
    return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
  }
  hasLoginState() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
    return this._request.oauth.isAccessTokenExpired(n2, s2) ? null : new at(this.config.env);
  }
  async isUsernameRegistered(e2) {
    if ("string" != typeof e2)
      throw new se({ code: "PARAM_ERROR", message: "username must be a string" });
    const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
    return t2 && t2.isRegistered;
  }
  getLoginState() {
    return Promise.resolve(this.hasLoginState());
  }
  async signInWithTicket(e2) {
    return new ut(this.config).signIn(e2);
  }
  shouldRefreshAccessToken(e2) {
    this._request._shouldRefreshAccessTokenHook = e2.bind(this);
  }
  getUserInfo() {
    return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
  }
  getAuthHeader() {
    const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
    return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
  }
  _onAnonymousConverted(e2) {
    const { env: t2 } = e2.data;
    t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
  }
  _onLoginTypeChanged(e2) {
    const { loginType: t2, persistence: n2, env: s2 } = e2.data;
    s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
  }
}
const pt = function(e2, t2) {
  t2 = t2 || be();
  const n2 = rt(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
    const { data: { url: a2, authorization: c2, token: u2, fileId: h2, cosFileId: l2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": l2, success_action_status: "201", "x-cos-security-token": u2 };
    n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
      201 === e4.statusCode ? t2(null, { fileID: h2, requestId: d2 }) : t2(new se({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
    }).catch((e4) => {
      t2(e4);
    });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, ft = function(e2, t2) {
  t2 = t2 || be();
  const n2 = rt(this.config.env), { cloudPath: s2 } = e2;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
    t2(null, e3);
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, gt = function({ fileList: e2 }, t2) {
  if (t2 = t2 || be(), !e2 || !Array.isArray(e2))
    return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
  for (let t3 of e2)
    if (!t3 || "string" != typeof t3)
      return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
  const n2 = { fileid_list: e2 };
  return rt(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
    e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, mt = function({ fileList: e2 }, t2) {
  t2 = t2 || be(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
  let n2 = [];
  for (let s3 of e2)
    "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
  const s2 = { file_list: n2 };
  return rt(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
    e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, yt = async function({ fileID: e2 }, t2) {
  const n2 = (await mt.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
  if ("SUCCESS" !== n2.code)
    return t2 ? t2(n2) : new Promise((e3) => {
      e3(n2);
    });
  const s2 = rt(this.config.env);
  let r2 = n2.download_url;
  if (r2 = encodeURI(r2), !t2)
    return s2.download({ url: r2 });
  t2(await s2.download({ url: r2 }));
}, _t = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
  const a2 = o2 || be();
  let c2;
  try {
    c2 = t2 ? JSON.stringify(t2) : "";
  } catch (e3) {
    return Promise.reject(e3);
  }
  if (!e2)
    return Promise.reject(new se({ code: "PARAM_ERROR", message: "函数名不能为空" }));
  const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
  return rt(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
    if (e3.code)
      a2(null, e3);
    else {
      let t3 = e3.data.response_data;
      if (s2)
        a2(null, { result: t3, requestId: e3.requestId });
      else
        try {
          t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
        } catch (e4) {
          a2(new se({ message: "response data must be json" }));
        }
    }
    return a2.promise;
  }).catch((e3) => {
    a2(e3);
  }), a2.promise;
}, wt = { timeout: 15e3, persistence: "session" }, vt = {};
class It {
  constructor(e2) {
    this.config = e2 || this.config, this.authObj = void 0;
  }
  init(e2) {
    switch (Oe.adapter || (this.requestClient = new Oe.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...wt, ...e2 }, true) {
      case this.config.timeout > 6e5:
        console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = 6e5;
        break;
      case this.config.timeout < 100:
        console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
    }
    return new It(this.config);
  }
  auth({ persistence: e2 } = {}) {
    if (this.authObj)
      return this.authObj;
    const t2 = e2 || Oe.adapter.primaryStorage || wt.persistence;
    var n2;
    return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
      const { env: t3 } = e3;
      Ne[t3] = new Ue(e3), De[t3] = new Ue({ ...e3, persistence: "local" });
    }(this.config), n2 = this.config, st[n2.env] = new nt(n2), this.authObj = new dt(this.config), this.authObj;
  }
  on(e2, t2) {
    return je.apply(this, [e2, t2]);
  }
  off(e2, t2) {
    return Be.apply(this, [e2, t2]);
  }
  callFunction(e2, t2) {
    return _t.apply(this, [e2, t2]);
  }
  deleteFile(e2, t2) {
    return gt.apply(this, [e2, t2]);
  }
  getTempFileURL(e2, t2) {
    return mt.apply(this, [e2, t2]);
  }
  downloadFile(e2, t2) {
    return yt.apply(this, [e2, t2]);
  }
  uploadFile(e2, t2) {
    return pt.apply(this, [e2, t2]);
  }
  getUploadMetadata(e2, t2) {
    return ft.apply(this, [e2, t2]);
  }
  registerExtension(e2) {
    vt[e2.name] = e2;
  }
  async invokeExtension(e2, t2) {
    const n2 = vt[e2];
    if (!n2)
      throw new se({ message: `扩展${e2} 必须先注册` });
    return await n2.invoke(t2, this);
  }
  useAdapters(e2) {
    const { adapter: t2, runtime: n2 } = xe(e2) || {};
    t2 && (Oe.adapter = t2), n2 && (Oe.runtime = n2);
  }
}
var St = new It();
function bt(e2, t2, n2) {
  void 0 === n2 && (n2 = {});
  var s2 = /\?/.test(t2), r2 = "";
  for (var i2 in n2)
    "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
  return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
}
class kt {
  get(e2) {
    const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
    return new Promise((e3, i2) => {
      re.request({ url: bt("https:", t2), data: n2, method: "GET", header: s2, timeout: r2, success(t3) {
        e3(t3);
      }, fail(e4) {
        i2(e4);
      } });
    });
  }
  post(e2) {
    const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
    return new Promise((e3, i2) => {
      re.request({ url: bt("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
        e3(t3);
      }, fail(e4) {
        i2(e4);
      } });
    });
  }
  upload(e2) {
    return new Promise((t2, n2) => {
      const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = re.uploadFile({ url: bt("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
        const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
        200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
      }, fail(e3) {
        n2(new Error(e3.errMsg || "uploadFile:fail"));
      } });
      "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
        e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
      });
    });
  }
}
const Tt = { setItem(e2, t2) {
  re.setStorageSync(e2, t2);
}, getItem: (e2) => re.getStorageSync(e2), removeItem(e2) {
  re.removeStorageSync(e2);
}, clear() {
  re.clearStorageSync();
} };
var At = { genAdapter: function() {
  return { root: {}, reqClass: kt, localStorage: Tt, primaryStorage: "local" };
}, isMatch: function() {
  return true;
}, runtime: "uni_app" };
St.useAdapters(At);
const Pt = St, Ct = Pt.init;
Pt.init = function(e2) {
  e2.env = e2.spaceId;
  const t2 = Ct.call(this, e2);
  t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
  const n2 = t2.auth;
  return t2.auth = function(e3) {
    const t3 = n2.call(this, e3);
    return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
      var n3;
      t3[e4] = (n3 = t3[e4], function(e5) {
        e5 = e5 || {};
        const { success: t4, fail: s2, complete: r2 } = ne(e5);
        if (!(t4 || s2 || r2))
          return n3.call(this, e5);
        n3.call(this, e5).then((e6) => {
          t4 && t4(e6), r2 && r2(e6);
        }, (e6) => {
          s2 && s2(e6), r2 && r2(e6);
        });
      }).bind(t3);
    }), t3;
  }, t2.customAuth = t2.auth, t2;
};
var xt = Pt;
async function Ot(e2, t2) {
  const n2 = `http://${e2}:${t2}/system/ping`;
  try {
    const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
      re.request({ ...s2, success(t4) {
        e4(t4);
      }, fail(e5) {
        t3(e5);
      } });
    }));
    return !(!e3.data || 0 !== e3.data.code);
  } catch (e3) {
    return false;
  }
  var s2;
}
async function Et(e2, t2) {
  let n2;
  for (let s2 = 0; s2 < e2.length; s2++) {
    const r2 = e2[s2];
    if (await Ot(r2, t2)) {
      n2 = r2;
      break;
    }
  }
  return { address: n2, port: t2 };
}
const Lt = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
var Rt = class {
  constructor(e2) {
    if (["spaceId", "clientSecret"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(`${t2} required`);
    }), !e2.endpoint)
      throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
    this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = re;
  }
  async request(e2, t2 = true) {
    const n2 = t2;
    return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : fe.wrappedRequest(e2, this.adapter.request));
  }
  requestLocal(e2) {
    return new Promise((t2, n2) => {
      this.adapter.request(Object.assign(e2, { complete(e3) {
        if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
          const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
          return n2(new se({ code: t3, message: s2 }));
        }
        t2({ success: true, result: e3.data });
      } }));
    });
  }
  setupRequest(e2) {
    const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
    n2["x-serverless-sign"] = fe.sign(t2, this.config.clientSecret);
    const s2 = pe();
    n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
    const { token: r2 } = oe();
    return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
  }
  async setupLocalRequest(e2) {
    const t2 = pe(), { token: n2 } = oe(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await Et(r2, i2);
    return { url: `http://${o2}:${i2}/${Lt[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
  }
  callFunction(e2) {
    const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
    return this.request(t2, false);
  }
  getUploadFileOptions(e2) {
    const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
    return this.request(t2);
  }
  reportUploadFile(e2) {
    const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
    return this.request(t2);
  }
  uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
    if (!t2)
      throw new se({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
    let r2;
    return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
      const { url: i2, formData: o2, name: a2 } = t3.result;
      return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
        const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
          e3 && e3.statusCode < 400 ? t4(e3) : r3(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          r3(new se({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
      t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
    }));
  }
  deleteFile({ fileList: e2 }) {
    const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
    return this.request(t2).then((e3) => {
      if (e3.success)
        return e3.result;
      throw new se({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
    });
  }
  getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
    if (!Array.isArray(e2) || 0 === e2.length)
      throw new se({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
    const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
    return this.request(n2).then((e3) => {
      if (e3.success)
        return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
      throw new se({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
    });
  }
};
var Ut = { init(e2) {
  const t2 = new Rt(e2), n2 = { signInAnonymously: function() {
    return Promise.resolve();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} }, Nt = n(function(e2, t2) {
  e2.exports = r.enc.Hex;
});
function Dt() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
    var t2 = 16 * Math.random() | 0;
    return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
  });
}
function Mt(e2 = "", t2 = {}) {
  const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = String(Date.now()), u2 = Dt(), h2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), l2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
    const t3 = e3.signedHeaders.join(";"), n3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), s3 = Ie(e3.body).toString(Nt), r3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${n3}
${t3}
${s3}
`, i3 = Ie(r3).toString(Nt), o3 = `HMAC-SHA256
${e3.timestamp}
${i3}
`, a3 = Se(o3, e3.secretKey).toString(Nt);
    return `HMAC-SHA256 Credential=${e3.secretId}, SignedHeaders=${t3}, Signature=${a3}`;
  }({ path: d2, query: p2, method: r2, headers: h2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: l2.sort() });
  return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, h2, { Authorization: f2 }) };
}
function qt({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
  return new Promise((i2, o2) => {
    re.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
      const t3 = s2["x-trace-id"] || "";
      if (!e3.statusCode || e3.statusCode >= 400) {
        const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
        return o2(new se({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
      }
      i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
    } });
  });
}
function Kt(e2, t2) {
  const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = Mt(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": Date.now() + 6e4 }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
  return qt({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
    const t3 = e3.data || {};
    if (!t3.success)
      throw new se({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    return t3.data || {};
  }).catch((e3) => {
    throw new se({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
  });
}
function Ft(e2 = "") {
  const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
  if (n2 <= 0)
    throw new se({ code: "INVALID_PARAM", message: "fileID不合法" });
  const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
  return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
}
function jt(e2 = "") {
  return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
}
class $t {
  constructor(e2) {
    this.config = e2;
  }
  signedURL(e2, t2 = {}) {
    const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Dt(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
      return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
    }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", Ie(i2).toString(Nt)].join("\n"), a2 = Se(o2, this.config.secretKey).toString(Nt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
    return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
  }
}
var Bt = class {
  constructor(e2) {
    if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(`${t2} required`);
    }), e2.endpoint) {
      if ("string" != typeof e2.endpoint)
        throw new Error("endpoint must be string");
      if (!/^https:\/\//.test(e2.endpoint))
        throw new Error("endpoint must start with https://");
      e2.endpoint = e2.endpoint.replace(/\/$/, "");
    }
    this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new $t(this.config);
  }
  callFunction(e2) {
    return function(e3, t2) {
      const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
      r2 && (a2["x-function-invoke-type"] = "async");
      const { url: c2, headers: u2 } = Mt("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
      return qt({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
        let t3 = 0;
        if (r2) {
          const n3 = e4.data || {};
          t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
        }
        if (0 !== t3)
          throw new se({ code: t3, message: e4.errMsg, requestId: e4.requestId });
        return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
      }).catch((e4) => {
        throw new se({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
      });
    }(e2, this.config);
  }
  uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
    return new Promise((i2, o2) => {
      const a2 = re.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
        e3 && e3.statusCode < 400 ? i2(e3) : o2(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }, fail(e3) {
        o2(new se({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
      } });
      "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
        r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
      });
    });
  }
  async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
    if ("string" !== f(t2))
      throw new se({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
    if (!(t2 = t2.trim()))
      throw new se({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
    if (/:\/\//.test(t2))
      throw new se({ code: "INVALID_PARAM", message: "cloudPath不合法" });
    const r2 = await Kt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
    return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
  }
  async getTempFileURL({ fileList: e2 }) {
    return new Promise((t2, n2) => {
      (!e2 || e2.length < 0) && t2({ code: "INVALID_PARAM", message: "fileList不能为空数组" }), e2.length > 50 && t2({ code: "INVALID_PARAM", message: "fileList数组长度不能超过50" });
      const s2 = [];
      for (const n3 of e2) {
        let e3;
        "string" !== f(n3) && t2({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
        try {
          e3 = Ft.call(this, n3);
        } catch (t3) {
          console.warn(t3.errCode, t3.errMsg), e3 = n3;
        }
        s2.push({ file_id: e3, expire: 600 });
      }
      Kt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
        const { file_list: n3 = [] } = e3;
        t2({ fileList: n3.map((e4) => ({ fileID: jt.call(this, e4.file_id), tempFileURL: e4.download_url })) });
      }).catch((e3) => n2(e3));
    });
  }
  async connectWebSocket(e2) {
    const { name: t2, query: n2 } = e2;
    return re.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
    } });
  }
};
var Wt = { init: (e2) => {
  e2.provider = "alipay";
  const t2 = new Bt(e2);
  return t2.auth = function() {
    return { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(true);
    } };
  }, t2;
} };
function Ht({ data: e2 }) {
  let t2;
  t2 = pe();
  const n2 = JSON.parse(JSON.stringify(e2 || {}));
  if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
    const { token: e3 } = oe();
    e3 && (n2.uniIdToken = e3);
  }
  return n2;
}
async function Jt(e2 = {}) {
  await this.__dev__.initLocalNetwork();
  const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${t2}:${n2}/system/check-function`, o2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
  return new Promise((t3, n3) => {
    re.request({ method: "POST", url: i2, data: { name: e2.name, platform: A, provider: s2, spaceId: r2 }, timeout: 3e3, success(e3) {
      t3(e3);
    }, fail() {
      t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
    } });
  }).then(({ data: e3 } = {}) => {
    const { code: t3, message: n3 } = e3 || {};
    return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
  }).then(({ code: t3, message: n3 }) => {
    if (0 !== t3) {
      switch (t3) {
        case "MODULE_ENCRYPTED":
          console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
          break;
        case "FUNCTION_ENCRYPTED":
          console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
          break;
        case "ACTION_ENCRYPTED":
          console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
          break;
        case "NETWORK_ERROR":
          console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
          break;
        case "SWITCH_TO_CLOUD":
          break;
        default: {
          const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
          throw console.error(e3), new Error(e3);
        }
      }
      return this._callCloudFunction(e2);
    }
    return new Promise((t4, n4) => {
      const r3 = Ht.call(this, { data: e2.data });
      re.request({ method: "POST", url: o2, data: { provider: s2, platform: A, param: r3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s3 } = {}) => !e3 || e3 >= 400 ? n4(new se({ code: s3.code || "SYS_ERR", message: s3.message || "request:fail" })) : t4({ result: s3 }), fail(e3) {
        n4(new se({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
      } });
    });
  });
}
const zt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
var Vt = /[\\^$.*+?()[\]{}|]/g, Gt = RegExp(Vt.source);
function Yt(e2, t2, n2) {
  return e2.replace(new RegExp((s2 = t2) && Gt.test(s2) ? s2.replace(Vt, "\\$&") : s2, "g"), n2);
  var s2;
}
const Xt = "request", Zt = "response", en = "both";
const Mn = { code: 2e4, message: "System error" }, qn = { code: 20101, message: "Invalid client" };
function jn(e2) {
  const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
  return new se({ subject: t2 || n2 || "uni-secure-network", code: s2 || i2 || Mn.code, message: r2 || o2, cause: a2 });
}
let Bn;
function Vn({ secretType: e2 } = {}) {
  return e2 === Xt || e2 === Zt || e2 === en;
}
function Gn({ name: e2, data: t2 = {} } = {}) {
  return "app" === A;
}
function Yn({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
  const { appId: s2, uniPlatform: r2, osName: i2 } = he();
  let o2 = r2;
  "app" === r2 && (o2 = i2);
  const a2 = function({ provider: e3, spaceId: t3 } = {}) {
    const n3 = T;
    if (!n3)
      return {};
    e3 = /* @__PURE__ */ function(e4) {
      return "tencent" === e4 ? "tcb" : e4;
    }(e3);
    const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
    return s3 && s3.config;
  }({ provider: e2, spaceId: t2 });
  if (!a2 || !a2.accessControl || !a2.accessControl.enable)
    return false;
  const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
  if (0 === u2.length)
    return true;
  const h2 = function(e3, t3) {
    let n3, s3, r3;
    for (let i3 = 0; i3 < e3.length; i3++) {
      const o3 = e3[i3];
      o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
    }
    return n3 || s3 || r3;
  }(u2, n2);
  if (!h2)
    return false;
  if ((c2[h2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
    return true;
  throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), jn(qn);
}
function Qn({ functionName: e2, result: t2, logPvd: n2 }) {
  if (this.__dev__.debugLog && t2 && t2.requestId) {
    const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
    console.log(`[${n2}-request]${s2}[/${n2}-request]`);
  }
}
function Xn(e2) {
  const t2 = e2.callFunction, n2 = function(n3) {
    const s2 = n3.name;
    n3.data = Ht.call(e2, { data: n3.data });
    const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = Vn(n3), o2 = Gn(n3), a2 = i2 || o2;
    return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && Qn.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && Qn.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
      for (let s3 = 0; s3 < n4.length; s3++) {
        const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
        if (!a3)
          continue;
        let c2 = i3;
        for (let e5 = 1; e5 < a3.length; e5++)
          c2 = Yt(c2, `{$${e5}}`, a3[e5]);
        for (const e5 in t3)
          c2 = Yt(c2, `{${e5}}`, t3[e5]);
        return "replace" === o3 ? c2 : e4 + c2;
      }
      return e4;
    }({ message: `[${n3.name}]: ${e3.message}`, formatter: zt, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
  };
  e2.callFunction = function(t3) {
    const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
    let o2, a2;
    if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && C ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = Jt), o2 = Jt) : o2 = n2, o2 = o2.bind(e2), Gn(t3))
      ;
    else if (function({ name: e3, data: t4 = {} }) {
      return "uni-id-co" === e3 && "secureNetworkHandshakeByWeixin" === t4.method;
    }(t3))
      a2 = o2.call(e2, t3);
    else if (Vn(t3)) {
      a2 = new Bn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
    } else if (Yn({ provider: s2, spaceId: r2, functionName: i2 })) {
      a2 = new Bn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
    } else
      a2 = o2(t3);
    return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => ("undefined" != typeof UTSJSONObject && "undefined" != typeof UTS && (e3.result = UTS.JSON.parse(JSON.stringify(e3.result))), e3));
  };
}
Bn = class {
  constructor() {
    throw jn({ message: `Platform ${A} is not enabled, please check whether secure network module is enabled in your manifest.json` });
  }
};
const Zn = Symbol("CLIENT_DB_INTERNAL");
function es(e2, t2) {
  return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = Zn, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
    if ("_uniClient" === n2)
      return null;
    if ("symbol" == typeof n2)
      return e3[n2];
    if (n2 in e3 || "string" != typeof n2) {
      const t3 = e3[n2];
      return "function" == typeof t3 ? t3.bind(e3) : t3;
    }
    return t2.get(e3, n2, s2);
  } });
}
function ts(e2) {
  return { on: (t2, n2) => {
    e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
  }, off: (t2, n2) => {
    e2[t2] = e2[t2] || [];
    const s2 = e2[t2].indexOf(n2);
    -1 !== s2 && e2[t2].splice(s2, 1);
  } };
}
const ns = ["db.Geo", "db.command", "command.aggregate"];
function ss(e2, t2) {
  return ns.indexOf(`${e2}.${t2}`) > -1;
}
function rs(e2) {
  switch (f(e2 = ie(e2))) {
    case "array":
      return e2.map((e3) => rs(e3));
    case "object":
      return e2._internalType === Zn || Object.keys(e2).forEach((t2) => {
        e2[t2] = rs(e2[t2]);
      }), e2;
    case "regexp":
      return { $regexp: { source: e2.source, flags: e2.flags } };
    case "date":
      return { $date: e2.toISOString() };
    default:
      return e2;
  }
}
function is(e2) {
  return e2 && e2.content && e2.content.$method;
}
class os {
  constructor(e2, t2, n2) {
    this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
  }
  toJSON() {
    let e2 = this;
    const t2 = [e2.content];
    for (; e2.prevStage; )
      e2 = e2.prevStage, t2.push(e2.content);
    return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: rs(e3.$param) })) };
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
  getAction() {
    const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
    return e2 && e2.$param && e2.$param[0];
  }
  getCommand() {
    return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
  }
  get isAggregate() {
    let e2 = this;
    for (; e2; ) {
      const t2 = is(e2), n2 = is(e2.prevStage);
      if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get isCommand() {
    let e2 = this;
    for (; e2; ) {
      if ("command" === is(e2))
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get isAggregateCommand() {
    let e2 = this;
    for (; e2; ) {
      const t2 = is(e2), n2 = is(e2.prevStage);
      if ("aggregate" === t2 && "command" === n2)
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  getNextStageFn(e2) {
    const t2 = this;
    return function() {
      return as({ $method: e2, $param: rs(Array.from(arguments)) }, t2, t2._database);
    };
  }
  get count() {
    return this.isAggregate ? this.getNextStageFn("count") : function() {
      return this._send("count", Array.from(arguments));
    };
  }
  get remove() {
    return this.isCommand ? this.getNextStageFn("remove") : function() {
      return this._send("remove", Array.from(arguments));
    };
  }
  get() {
    return this._send("get", Array.from(arguments));
  }
  get add() {
    return this.isCommand ? this.getNextStageFn("add") : function() {
      return this._send("add", Array.from(arguments));
    };
  }
  update() {
    return this._send("update", Array.from(arguments));
  }
  end() {
    return this._send("end", Array.from(arguments));
  }
  get set() {
    return this.isCommand ? this.getNextStageFn("set") : function() {
      throw new Error("JQL禁止使用set方法");
    };
  }
  _send(e2, t2) {
    const n2 = this.getAction(), s2 = this.getCommand();
    if (s2.$db.push({ $method: e2, $param: rs(t2) }), S) {
      const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
      t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
    }
    return this._database._callCloudFunction({ action: n2, command: s2 });
  }
}
function as(e2, t2, n2) {
  return es(new os(e2, t2, n2), { get(e3, t3) {
    let s2 = "db";
    return e3 && e3.content && (s2 = e3.content.$method), ss(s2, t3) ? as({ $method: t3 }, e3, n2) : function() {
      return as({ $method: t3, $param: rs(Array.from(arguments)) }, e3, n2);
    };
  } });
}
function cs({ path: e2, method: t2 }) {
  return class {
    constructor() {
      this.param = Array.from(arguments);
    }
    toJSON() {
      return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
  };
}
function us(e2, t2 = {}) {
  return es(new e2(t2), { get: (e3, t3) => ss("db", t3) ? as({ $method: t3 }, null, e3) : function() {
    return as({ $method: t3, $param: rs(Array.from(arguments)) }, null, e3);
  } });
}
class hs extends class {
  constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
    this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = R("_globalUniCloudDatabaseCallback")), t2 || (this.auth = ts(this._authCallBacks)), this._isJQL = t2, Object.assign(this, ts(this._dbCallBacks)), this.env = es({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = es({}, { get: (e3, t3) => cs({ path: ["Geo"], method: t3 }) }), this.serverDate = cs({ path: [], method: "serverDate" }), this.RegExp = cs({ path: [], method: "RegExp" });
  }
  getCloudEnv(e2) {
    if ("string" != typeof e2 || !e2.trim())
      throw new Error("getCloudEnv参数错误");
    return { $env: e2.replace("$cloudEnv_", "") };
  }
  _callback(e2, t2) {
    const n2 = this._dbCallBacks;
    n2[e2] && n2[e2].forEach((e3) => {
      e3(...t2);
    });
  }
  _callbackAuth(e2, t2) {
    const n2 = this._authCallBacks;
    n2[e2] && n2[e2].forEach((e3) => {
      e3(...t2);
    });
  }
  multiSend() {
    const e2 = Array.from(arguments), t2 = e2.map((e3) => {
      const t3 = e3.getAction(), n2 = e3.getCommand();
      if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
        throw new Error("multiSend只支持子命令内使用getTemp");
      return { action: t3, command: n2 };
    });
    return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
  }
} {
  _parseResult(e2) {
    return this._isJQL ? e2.result : e2;
  }
  _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
    function r2(e3, t3) {
      if (n2 && s2)
        for (let n3 = 0; n3 < s2.length; n3++) {
          const r3 = s2[n3];
          r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
        }
    }
    const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
    function a2(e3) {
      return i2._callback("error", [e3]), K(F(o2, "fail"), e3).then(() => K(F(o2, "complete"), e3)).then(() => (r2(null, e3), X(B, { type: J, content: e3 }), Promise.reject(e3)));
    }
    const c2 = K(F(o2, "invoke")), u2 = this._uniClient;
    return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: h, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
      const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
      if (u3)
        for (let e4 = 0; e4 < u3.length; e4++) {
          const { level: t4, message: n4, detail: s4 } = u3[e4], r3 = console[t4] || console.log;
          let i3 = "[System Info]" + n4;
          s4 && (i3 = `${i3}
详细信息：${s4}`), r3(i3);
        }
      if (t3) {
        return a2(new se({ code: t3, message: n3, requestId: e3.requestId }));
      }
      e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ae({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), X(H, { token: s3, tokenExpired: c3 }));
      const h2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
      for (let t4 = 0; t4 < h2.length; t4++) {
        const { prop: n4, tips: s4 } = h2[t4];
        if (n4 in e3.result) {
          const t5 = e3.result[n4];
          Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
        }
      }
      return function(e4) {
        return K(F(o2, "success"), e4).then(() => K(F(o2, "complete"), e4)).then(() => {
          r2(e4, null);
          const t4 = i2._parseResult(e4);
          return X(B, { type: J, content: t4 }), Promise.resolve(t4);
        });
      }(e3);
    }, (e3) => {
      /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
      return a2(new se({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
    });
  }
}
const ls = "token无效，跳转登录页面", ds = "token过期，跳转登录页面", ps = { TOKEN_INVALID_TOKEN_EXPIRED: ds, TOKEN_INVALID_INVALID_CLIENTID: ls, TOKEN_INVALID: ls, TOKEN_INVALID_WRONG_TOKEN: ls, TOKEN_INVALID_ANONYMOUS_USER: ls }, fs = { "uni-id-token-expired": ds, "uni-id-check-token-failed": ls, "uni-id-token-not-exist": ls, "uni-id-check-device-feature-failed": ls };
function gs(e2, t2) {
  let n2 = "";
  return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
}
function ms(e2 = [], t2 = "") {
  const n2 = [], s2 = [];
  return e2.forEach((e3) => {
    true === e3.needLogin ? n2.push(gs(t2, e3.path)) : false === e3.needLogin && s2.push(gs(t2, e3.path));
  }), { needLoginPage: n2, notNeedLoginPage: s2 };
}
function ys(e2) {
  return e2.split("?")[0].replace(/^\//, "");
}
function _s() {
  return function(e2) {
    let t2 = e2 && e2.$page && e2.$page.fullPath || "";
    return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : t2;
  }(function() {
    const e2 = getCurrentPages();
    return e2[e2.length - 1];
  }());
}
function ws() {
  return ys(_s());
}
function vs(e2 = "", t2 = {}) {
  if (!e2)
    return false;
  if (!(t2 && t2.list && t2.list.length))
    return false;
  const n2 = t2.list, s2 = ys(e2);
  return n2.some((e3) => e3.pagePath === s2);
}
const Is = !!e.uniIdRouter;
const { loginPage: Ss, routerNeedLogin: bs, resToLogin: ks$1, needLoginPage: Ts, notNeedLoginPage: As, loginPageInTabBar: Ps } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = e) {
  const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = ms(t2), { needLoginPage: h2, notNeedLoginPage: l2 } = function(e2 = []) {
    const t3 = [], n3 = [];
    return e2.forEach((e3) => {
      const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = ms(r3, s3);
      t3.push(...i3), n3.push(...o3);
    }), { needLoginPage: t3, notNeedLoginPage: n3 };
  }(n2);
  return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...h2], notNeedLoginPage: [...u2, ...l2], loginPageInTabBar: vs(i2, r2) };
}();
if (Ts.indexOf(Ss) > -1)
  throw new Error(`Login page [${Ss}] should not be "needLogin", please check your pages.json`);
function Cs(e2) {
  const t2 = ws();
  if ("/" === e2.charAt(0))
    return e2;
  const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
  i2.pop();
  for (let e3 = 0; e3 < r2.length; e3++) {
    const t3 = r2[e3];
    ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
  }
  return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
}
function xs(e2) {
  const t2 = ys(Cs(e2));
  return !(As.indexOf(t2) > -1) && (Ts.indexOf(t2) > -1 || bs.some((t3) => function(e3, t4) {
    return new RegExp(t4).test(e3);
  }(e2, t3)));
}
function Os({ redirect: e2 }) {
  const t2 = ys(e2), n2 = ys(Ss);
  return ws() !== n2 && t2 !== n2;
}
function Es({ api: e2, redirect: t2 } = {}) {
  if (!t2 || !Os({ redirect: t2 }))
    return;
  const n2 = function(e3, t3) {
    return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
  }(Ss, t2);
  Ps ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
  const s2 = { navigateTo: index.navigateTo, redirectTo: index.redirectTo, switchTab: index.switchTab, reLaunch: index.reLaunch };
  setTimeout(() => {
    s2[e2]({ url: n2 });
  }, 0);
}
function Ls({ url: e2 } = {}) {
  const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
    const { token: e3, tokenExpired: t3 } = oe();
    let n3;
    if (e3) {
      if (t3 < Date.now()) {
        const e4 = "uni-id-token-expired";
        n3 = { errCode: e4, errMsg: fs[e4] };
      }
    } else {
      const e4 = "uni-id-check-token-failed";
      n3 = { errCode: e4, errMsg: fs[e4] };
    }
    return n3;
  }();
  if (xs(e2) && n2) {
    n2.uniIdRedirectUrl = e2;
    if (G(W).length > 0)
      return setTimeout(() => {
        X(W, n2);
      }, 0), t2.abortLoginPageJump = true, t2;
    t2.autoToLoginPage = true;
  }
  return t2;
}
function Rs() {
  !function() {
    const e3 = _s(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Ls({ url: e3 });
    t2 || n2 && Es({ api: "redirectTo", redirect: e3 });
  }();
  const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  for (let t2 = 0; t2 < e2.length; t2++) {
    const n2 = e2[t2];
    index.addInterceptor(n2, { invoke(e3) {
      const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Ls({ url: e3.url });
      return t3 ? e3 : s2 ? (Es({ api: n2, redirect: Cs(e3.url) }), false) : e3;
    } });
  }
}
function Us() {
  this.onResponse((e2) => {
    const { type: t2, content: n2 } = e2;
    let s2 = false;
    switch (t2) {
      case "cloudobject":
        s2 = function(e3) {
          if ("object" != typeof e3)
            return false;
          const { errCode: t3 } = e3 || {};
          return t3 in fs;
        }(n2);
        break;
      case "clientdb":
        s2 = function(e3) {
          if ("object" != typeof e3)
            return false;
          const { errCode: t3 } = e3 || {};
          return t3 in ps;
        }(n2);
    }
    s2 && function(e3 = {}) {
      const t3 = G(W);
      te().then(() => {
        const n3 = _s();
        if (n3 && Os({ redirect: n3 }))
          return t3.length > 0 ? X(W, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (Ss && Es({ api: "navigateTo", redirect: n3 }));
      });
    }(n2);
  });
}
function Ns(e2) {
  !function(e3) {
    e3.onResponse = function(e4) {
      Y(B, e4);
    }, e3.offResponse = function(e4) {
      Q(B, e4);
    };
  }(e2), function(e3) {
    e3.onNeedLogin = function(e4) {
      Y(W, e4);
    }, e3.offNeedLogin = function(e4) {
      Q(W, e4);
    }, Is && (R("_globalUniCloudStatus").needLoginInit || (R("_globalUniCloudStatus").needLoginInit = true, te().then(() => {
      Rs.call(e3);
    }), ks$1 && Us.call(e3)));
  }(e2), function(e3) {
    e3.onRefreshToken = function(e4) {
      Y(H, e4);
    }, e3.offRefreshToken = function(e4) {
      Q(H, e4);
    };
  }(e2);
}
let Ds;
const Ms = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", qs = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
function Ks() {
  const e2 = oe().token || "", t2 = e2.split(".");
  if (!e2 || 3 !== t2.length)
    return { uid: null, role: [], permission: [], tokenExpired: 0 };
  let n2;
  try {
    n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Ds(s2).split("").map(function(e3) {
      return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
    }).join(""))));
  } catch (e3) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
  }
  var s2;
  return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
}
Ds = "function" != typeof atob ? function(e2) {
  if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !qs.test(e2))
    throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
  var t2;
  e2 += "==".slice(2 - (3 & e2.length));
  for (var n2, s2, r2 = "", i2 = 0; i2 < e2.length; )
    t2 = Ms.indexOf(e2.charAt(i2++)) << 18 | Ms.indexOf(e2.charAt(i2++)) << 12 | (n2 = Ms.indexOf(e2.charAt(i2++))) << 6 | (s2 = Ms.indexOf(e2.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
  return r2;
} : atob;
var Fs = n(function(e2, t2) {
  Object.defineProperty(t2, "__esModule", { value: true });
  const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
  function r2(e3, t3) {
    return e3.tempFiles.forEach((e4, n3) => {
      e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
    }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
  }
  function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
    return t3.then((e4) => {
      if (s3) {
        const t4 = s3(e4);
        if (void 0 !== t4)
          return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
      }
      return e4;
    }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
      (t5 = Object.assign({}, t5)).errMsg = n2;
      const i3 = t5.tempFiles, o2 = i3.length;
      let a2 = 0;
      return new Promise((n3) => {
        for (; a2 < s4; )
          c2();
        function c2() {
          const s5 = a2++;
          if (s5 >= o2)
            return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
          const u2 = i3[s5];
          e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
            e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
          } }).then((e5) => {
            u2.url = e5.fileID, s5 < o2 && c2();
          }).catch((e5) => {
            u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
          });
        }
      });
    }(e3, t4, 5, r3));
  }
  t2.initChooseAndUploadFile = function(e3) {
    return function(t3 = { type: "all" }) {
      return "image" === t3.type ? i2(e3, function(e4) {
        const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
        return new Promise((e5, a2) => {
          index.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
            e5(r2(t5, "image"));
          }, fail(e6) {
            a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
          } });
        });
      }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
        const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
        return new Promise((e5, c2) => {
          index.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
            const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
            e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
          }, fail(e6) {
            c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
          } });
        });
      }(t3), t3) : i2(e3, function(e4) {
        const { count: t4, extension: n3 } = e4;
        return new Promise((e5, i3) => {
          let o2 = index.chooseFile;
          if ("undefined" != typeof wx$1 && "function" == typeof wx$1.chooseMessageFile && (o2 = wx$1.chooseMessageFile), "function" != typeof o2)
            return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
          o2({ type: "all", count: t4, extension: n3, success(t5) {
            e5(r2(t5));
          }, fail(e6) {
            i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
          } });
        });
      }(t3), t3);
    };
  };
}), js = t(Fs);
const $s = "manual";
function Bs(e2) {
  return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
    this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
      var e3 = [];
      return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
        e3.push(this[t2]);
      }), e3;
    }, (e3, t2) => {
      if (this.loadtime === $s)
        return;
      let n2 = false;
      const s2 = [];
      for (let r2 = 2; r2 < e3.length; r2++)
        e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
      e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
    });
  }, methods: { onMixinDatacomPropsChange(e3, t2) {
  }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
    this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
      this.mixinDatacomLoading = false;
      const { data: s2, count: r2 } = n3.result;
      this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
      const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
      this.mixinDatacomResData = i2, t2 && t2(i2);
    }).catch((e4) => {
      this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
    }));
  }, mixinDatacomGet(t2 = {}) {
    let n2;
    t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
    const s2 = t2.action || this.action;
    s2 && (n2 = n2.action(s2));
    const r2 = t2.collection || this.collection;
    n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
    const i2 = t2.where || this.where;
    i2 && Object.keys(i2).length && (n2 = n2.where(i2));
    const o2 = t2.field || this.field;
    o2 && (n2 = n2.field(o2));
    const a2 = t2.foreignKey || this.foreignKey;
    a2 && (n2 = n2.foreignKey(a2));
    const c2 = t2.groupby || this.groupby;
    c2 && (n2 = n2.groupBy(c2));
    const u2 = t2.groupField || this.groupField;
    u2 && (n2 = n2.groupField(u2));
    true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
    const h2 = t2.orderby || this.orderby;
    h2 && (n2 = n2.orderBy(h2));
    const l2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
    return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (l2 - 1)).limit(d2).get(m2), n2;
  } } };
}
function Ws(e2) {
  return function(t2, n2 = {}) {
    n2 = function(e3, t3 = {}) {
      return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
    }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
    const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
    return new Proxy({}, { get(s3, c2) {
      switch (c2) {
        case "toString":
          return "[object UniCloudObject]";
        case "toJSON":
          return {};
      }
      return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
        return async function(...s4) {
          const r3 = n3 ? n3({ params: s4 }) : {};
          let i3, o3;
          try {
            return await K(F(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await K(F(t3, "success"), { ...r3, result: i3 }), i3;
          } catch (e4) {
            throw o3 = e4, await K(F(t3, "fail"), { ...r3, error: o3 }), o3;
          } finally {
            await K(F(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
          }
        };
      }({ fn: async function s4(...h2) {
        let l2;
        a2 && index.showLoading({ title: r2.title, mask: r2.mask });
        const d2 = { name: t2, type: u, data: { method: c2, params: h2 } };
        "object" == typeof n2.secretMethods && function(e3, t3) {
          const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
          r3 && (t3.secretType = r3);
        }(n2, d2);
        let p2 = false;
        try {
          l2 = await e2.callFunction(d2);
        } catch (e3) {
          p2 = true, l2 = { result: new se(e3) };
        }
        const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = l2.result || {};
        if (a2 && index.hideLoading(), y2 && y2.token && y2.tokenExpired && (ae(y2), X(H, { ...y2 })), g2) {
          let e3 = m2;
          if (p2 && o2) {
            e3 = (await o2({ objectName: t2, methodName: c2, params: h2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
          }
          if (a2)
            if ("toast" === i2.type)
              index.showToast({ title: e3, icon: "none" });
            else {
              if ("modal" !== i2.type)
                throw new Error(`Invalid errorOptions.type: ${i2.type}`);
              {
                const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                  return new Promise((i3, o3) => {
                    index.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                      i3(e5);
                    }, fail() {
                      i3({ confirm: false, cancel: true });
                    } });
                  });
                }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                if (i2.retry && t3)
                  return s4(...h2);
              }
            }
          const n3 = new se({ subject: f2, code: g2, message: m2, requestId: l2.requestId });
          throw n3.detail = l2.result, X(B, { type: V, content: n3 }), n3;
        }
        return X(B, { type: V, content: l2.result }), l2.result;
      }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
        return { objectName: t2, methodName: c2, params: e3 };
      } });
    } });
  };
}
function Hs(e2) {
  return R("_globalUniCloudSecureNetworkCache__{spaceId}".replace("{spaceId}", e2.config.spaceId));
}
async function Js({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
  const n2 = Hs(this);
  if (e2 && t2)
    throw new Error("[SecureNetwork] openid and callLoginByWeixin cannot be passed at the same time");
  if (e2)
    return n2.mpWeixinOpenid = e2, {};
  const s2 = await new Promise((e3, t3) => {
    index.login({ success(t4) {
      e3(t4.code);
    }, fail(e4) {
      t3(new Error(e4.errMsg));
    } });
  }), r2 = this.importObject("uni-id-co", { customUI: true });
  return await r2.secureNetworkHandshakeByWeixin({ code: s2, callLoginByWeixin: t2 }), n2.mpWeixinCode = s2, { code: s2 };
}
async function zs(e2) {
  const t2 = Hs(this);
  return t2.initPromise || (t2.initPromise = Js.call(this, e2).then((e3) => e3).catch((e3) => {
    throw delete t2.initPromise, e3;
  })), t2.initPromise;
}
function Vs(e2) {
  return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
    return zs.call(e2, { openid: t2, callLoginByWeixin: n2 });
  };
}
function Gs(e2) {
  !function(e3) {
    de = e3;
  }(e2);
}
function Ys(e2) {
  const t2 = { getSystemInfo: index.getSystemInfo, getPushClientId: index.getPushClientId };
  return function(n2) {
    return new Promise((s2, r2) => {
      t2[e2]({ ...n2, success(e3) {
        s2(e3);
      }, fail(e3) {
        r2(e3);
      } });
    });
  };
}
class Qs extends class {
  constructor() {
    this._callback = {};
  }
  addListener(e2, t2) {
    this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
  }
  on(e2, t2) {
    return this.addListener(e2, t2);
  }
  removeListener(e2, t2) {
    if (!t2)
      throw new Error('The "listener" argument must be of type function. Received undefined');
    const n2 = this._callback[e2];
    if (!n2)
      return;
    const s2 = function(e3, t3) {
      for (let n3 = e3.length - 1; n3 >= 0; n3--)
        if (e3[n3] === t3)
          return n3;
      return -1;
    }(n2, t2);
    n2.splice(s2, 1);
  }
  off(e2, t2) {
    return this.removeListener(e2, t2);
  }
  removeAllListener(e2) {
    delete this._callback[e2];
  }
  emit(e2, ...t2) {
    const n2 = this._callback[e2];
    if (n2)
      for (let e3 = 0; e3 < n2.length; e3++)
        n2[e3](...t2);
  }
} {
  constructor() {
    super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
  }
  init() {
    return Promise.all([Ys("getSystemInfo")(), Ys("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
      if (!e2)
        throw new Error("Invalid appId, please check the manifest.json file");
      if (!t2)
        throw new Error("Invalid push client id");
      this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
    }, (e2) => {
      throw this.emit("error", e2), this.close(), e2;
    });
  }
  async open() {
    return this.init();
  }
  _isUniCloudSSE(e2) {
    if ("receive" !== e2.type)
      return false;
    const t2 = e2 && e2.data && e2.data.payload;
    return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
  }
  _receivePushMessage(e2) {
    if (!this._isUniCloudSSE(e2))
      return;
    const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
    this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
  }
  _consumMessage() {
    for (; ; ) {
      const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
      if (!e2)
        break;
      this._currentMessageId++, this._parseMessagePayload(e2);
    }
  }
  _parseMessagePayload(e2) {
    const { action: t2, messageId: n2, message: s2 } = e2;
    "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
  }
  _appendMessage({ messageId: e2, message: t2 } = {}) {
    this.emit("message", t2);
  }
  _end({ messageId: e2, message: t2 } = {}) {
    this.emit("end", t2), this.close();
  }
  _initMessageListener() {
    index.onPushMessage(this._uniPushMessageCallback);
  }
  _destroy() {
    index.offPushMessage(this._uniPushMessageCallback);
  }
  toJSON() {
    return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
  }
  close() {
    this._destroy(), this.emit("close");
  }
}
async function Xs(e2) {
  const t2 = e2.__dev__;
  if (!t2.debugInfo)
    return;
  const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await Et(n2, s2);
  if (r2)
    return t2.localAddress = r2, void (t2.localPort = s2);
  const i2 = console["warn"];
  let o2 = "";
  if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === A.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
    throw new Error(o2);
  i2(o2);
}
function Zs(e2) {
  e2._initPromiseHub || (e2._initPromiseHub = new v({ createPromise: function() {
    let t2 = Promise.resolve();
    var n2;
    n2 = 1, t2 = new Promise((e3) => {
      setTimeout(() => {
        e3();
      }, n2);
    });
    const s2 = e2.auth();
    return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
  } }));
}
const er = { tcb: xt, tencent: xt, aliyun: me, private: Ut, dcloud: Ut, alipay: Wt };
let tr = new class {
  init(e2) {
    let t2 = {};
    const n2 = er[e2.provider];
    if (!n2)
      throw new Error("未提供正确的provider参数");
    t2 = n2.init(e2), function(e3) {
      const t3 = {};
      e3.__dev__ = t3, t3.debugLog = "mp-harmony" === A;
      const n3 = P;
      n3 && !n3.code && (t3.debugInfo = n3);
      const s2 = new v({ createPromise: function() {
        return Xs(e3);
      } });
      t3.initLocalNetwork = function() {
        return s2.exec();
      };
    }(t2), Zs(t2), Xn(t2), function(e3) {
      const t3 = e3.uploadFile;
      e3.uploadFile = function(e4) {
        return t3.call(this, e4);
      };
    }(t2), function(e3) {
      e3.database = function(t3) {
        if (t3 && Object.keys(t3).length > 0)
          return e3.init(t3).database();
        if (this._database)
          return this._database;
        const n3 = us(hs, { uniClient: e3 });
        return this._database = n3, n3;
      }, e3.databaseForJQL = function(t3) {
        if (t3 && Object.keys(t3).length > 0)
          return e3.init(t3).databaseForJQL();
        if (this._databaseForJQL)
          return this._databaseForJQL;
        const n3 = us(hs, { uniClient: e3, isJQL: true });
        return this._databaseForJQL = n3, n3;
      };
    }(t2), function(e3) {
      e3.getCurrentUserInfo = Ks, e3.chooseAndUploadFile = js.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
        return Bs(e3);
      } }), e3.SSEChannel = Qs, e3.initSecureNetworkByWeixin = Vs(e3), e3.setCustomClientInfo = Gs, e3.importObject = Ws(e3);
    }(t2);
    return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
      if (!t2[e3])
        return;
      const n3 = t2[e3];
      t2[e3] = function() {
        return n3.apply(t2, Array.from(arguments));
      }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
        return function(n4) {
          let s2 = false;
          if ("callFunction" === t3) {
            const e5 = n4 && n4.type || c;
            s2 = e5 !== c;
          }
          const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
          n4 = n4 || {};
          const { success: o2, fail: a2, complete: u2 } = ne(n4), h2 = i2.then(() => s2 ? Promise.resolve() : K(F(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : K(F(t3, "success"), e5).then(() => K(F(t3, "complete"), e5)).then(() => (r2 && X(B, { type: z, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : K(F(t3, "fail"), e5).then(() => K(F(t3, "complete"), e5)).then(() => (X(B, { type: z, content: e5 }), Promise.reject(e5))));
          if (!(o2 || a2 || u2))
            return h2;
          h2.then((e5) => {
            o2 && o2(e5), u2 && u2(e5), r2 && X(B, { type: z, content: e5 });
          }, (e5) => {
            a2 && a2(e5), u2 && u2(e5), r2 && X(B, { type: z, content: e5 });
          });
        };
      }(t2[e3], e3)).bind(t2);
    }), t2.init = this.init, t2;
  }
}();
(() => {
  const e2 = C;
  let t2 = {};
  if (e2 && 1 === e2.length)
    t2 = e2[0], tr = tr.init(t2), tr._isDefault = true;
  else {
    const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
    let n2;
    n2 = e2 && e2.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", t3.forEach((e3) => {
      tr[e3] = function() {
        return console.error(n2), Promise.reject(new se({ code: "SYS_ERR", message: n2 }));
      };
    });
  }
  if (Object.assign(tr, { get mixinDatacom() {
    return Bs(tr);
  } }), Ns(tr), tr.addInterceptor = M, tr.removeInterceptor = q, tr.interceptObject = j, "web" === A)
    ;
})();
var nr = tr;
const ERR_MSG_OK = "chooseAndUploadFile:ok";
const ERR_MSG_FAIL = "chooseAndUploadFile:fail";
function chooseImage(opts) {
  const {
    count,
    sizeType = ["original", "compressed"],
    sourceType,
    extension
  } = opts;
  return new Promise((resolve2, reject) => {
    index.chooseMedia({
      count,
      sizeType,
      sourceType,
      mediaType: ["image"],
      extension,
      success(res) {
        res.tempFiles.forEach((item) => {
          item.path = item.tempFilePath;
        });
        resolve2(normalizeChooseAndUploadFileRes(res, "image"));
      },
      fail(res) {
        reject({
          errMsg: res.errMsg.replace("chooseImage:fail", ERR_MSG_FAIL)
        });
      }
    });
  });
}
function chooseVideo(opts) {
  const {
    count,
    camera,
    compressed,
    maxDuration,
    sourceType,
    extension
  } = opts;
  return new Promise((resolve2, reject) => {
    index.chooseMedia({
      count,
      compressed,
      maxDuration,
      sourceType,
      extension,
      mediaType: ["video"],
      success(res) {
        const {
          tempFiles
        } = res;
        resolve2(normalizeChooseAndUploadFileRes({
          errMsg: "chooseVideo:ok",
          tempFiles: tempFiles.map((item) => {
            return {
              name: item.name || "",
              path: item.tempFilePath,
              thumbTempFilePath: item.thumbTempFilePath,
              size: item.size,
              type: res.tempFile && res.tempFile.type || "",
              width: item.width,
              height: item.height,
              duration: item.duration,
              fileType: "video",
              cloudPath: ""
            };
          })
        }, "video"));
      },
      fail(res) {
        reject({
          errMsg: res.errMsg.replace("chooseVideo:fail", ERR_MSG_FAIL)
        });
      }
    });
  });
}
function chooseAll(opts) {
  const {
    count,
    extension
  } = opts;
  return new Promise((resolve2, reject) => {
    let chooseFile = index.chooseFile;
    if (typeof wx$1 !== "undefined" && typeof wx$1.chooseMessageFile === "function") {
      chooseFile = wx$1.chooseMessageFile;
    }
    if (typeof chooseFile !== "function") {
      return reject({
        errMsg: ERR_MSG_FAIL + " 请指定 type 类型，该平台仅支持选择 image 或 video。"
      });
    }
    chooseFile({
      type: "all",
      count,
      extension,
      success(res) {
        resolve2(normalizeChooseAndUploadFileRes(res));
      },
      fail(res) {
        reject({
          errMsg: res.errMsg.replace("chooseFile:fail", ERR_MSG_FAIL)
        });
      }
    });
  });
}
function normalizeChooseAndUploadFileRes(res, fileType) {
  res.tempFiles.forEach((item, index2) => {
    if (!item.name) {
      item.name = item.path.substring(item.path.lastIndexOf("/") + 1);
    }
    if (fileType) {
      item.fileType = fileType;
    }
    item.cloudPath = Date.now() + "_" + index2 + item.name.substring(item.name.lastIndexOf("."));
  });
  if (!res.tempFilePaths) {
    res.tempFilePaths = res.tempFiles.map((file) => file.path);
  }
  return res;
}
function uploadCloudFiles(files, max = 5, onUploadProgress) {
  files = JSON.parse(JSON.stringify(files));
  const len = files.length;
  let count = 0;
  let self2 = this;
  return new Promise((resolve2) => {
    while (count < max) {
      next();
    }
    function next() {
      let cur = count++;
      if (cur >= len) {
        !files.find((item) => !item.url && !item.errMsg) && resolve2(files);
        return;
      }
      const fileItem = files[cur];
      const index2 = self2.files.findIndex((v2) => v2.uuid === fileItem.uuid);
      fileItem.url = "";
      delete fileItem.errMsg;
      nr.uploadFile({
        filePath: fileItem.path,
        cloudPath: fileItem.cloudPath,
        fileType: fileItem.fileType,
        onUploadProgress: (res) => {
          res.index = index2;
          onUploadProgress && onUploadProgress(res);
        }
      }).then((res) => {
        fileItem.url = res.fileID;
        fileItem.index = index2;
        if (cur < len) {
          next();
        }
      }).catch((res) => {
        fileItem.errMsg = res.errMsg || res.message;
        fileItem.index = index2;
        if (cur < len) {
          next();
        }
      });
    }
  });
}
function uploadFiles(choosePromise, {
  onChooseFile,
  onUploadProgress
}) {
  return choosePromise.then((res) => {
    if (onChooseFile) {
      const customChooseRes = onChooseFile(res);
      if (typeof customChooseRes !== "undefined") {
        return Promise.resolve(customChooseRes).then((chooseRes) => typeof chooseRes === "undefined" ? res : chooseRes);
      }
    }
    return res;
  }).then((res) => {
    if (res === false) {
      return {
        errMsg: ERR_MSG_OK,
        tempFilePaths: [],
        tempFiles: []
      };
    }
    return res;
  });
}
function chooseAndUploadFile(opts = {
  type: "all"
}) {
  if (opts.type === "image") {
    return uploadFiles(chooseImage(opts), opts);
  } else if (opts.type === "video") {
    return uploadFiles(chooseVideo(opts), opts);
  }
  return uploadFiles(chooseAll(opts), opts);
}
const get_file_ext = (name) => {
  const last_len = name.lastIndexOf(".");
  const len = name.length;
  return {
    name: name.substring(0, last_len),
    ext: name.substring(last_len + 1, len)
  };
};
const get_extname = (fileExtname) => {
  if (!Array.isArray(fileExtname)) {
    let extname = fileExtname.replace(/(\[|\])/g, "");
    return extname.split(",");
  } else {
    return fileExtname;
  }
};
const get_files_and_is_max = (res, _extname) => {
  let filePaths = [];
  let files = [];
  if (!_extname || _extname.length === 0) {
    return {
      filePaths,
      files
    };
  }
  res.tempFiles.forEach((v2) => {
    let fileFullName = get_file_ext(v2.name);
    const extname = fileFullName.ext.toLowerCase();
    if (_extname.indexOf(extname) !== -1) {
      files.push(v2);
      filePaths.push(v2.path);
    }
  });
  if (files.length !== res.tempFiles.length) {
    index.showToast({
      title: `当前选择了${res.tempFiles.length}个文件 ，${res.tempFiles.length - files.length} 个文件格式不正确`,
      icon: "none",
      duration: 5e3
    });
  }
  return {
    filePaths,
    files
  };
};
const get_file_info = (filepath) => {
  return new Promise((resolve2, reject) => {
    index.getImageInfo({
      src: filepath,
      success(res) {
        resolve2(res);
      },
      fail(err) {
        reject(err);
      }
    });
  });
};
const get_file_data = async (files, type = "image") => {
  let fileFullName = get_file_ext(files.name);
  const extname = fileFullName.ext.toLowerCase();
  let filedata = {
    name: files.name,
    uuid: files.uuid,
    extname: extname || "",
    cloudPath: files.cloudPath,
    fileType: files.fileType,
    thumbTempFilePath: files.thumbTempFilePath,
    url: files.path || files.path,
    size: files.size,
    //单位是字节
    image: {},
    path: files.path,
    video: {}
  };
  if (type === "image") {
    const imageinfo = await get_file_info(files.path);
    delete filedata.video;
    filedata.image.width = imageinfo.width;
    filedata.image.height = imageinfo.height;
    filedata.image.location = imageinfo.path;
  } else {
    delete filedata.image;
  }
  return filedata;
};
class MPAnimation {
  constructor(options2, _this) {
    this.options = options2;
    this.animation = index.createAnimation({
      ...options2
    });
    this.currentStepAnimates = {};
    this.next = 0;
    this.$ = _this;
  }
  _nvuePushAnimates(type, args) {
    let aniObj = this.currentStepAnimates[this.next];
    let styles = {};
    if (!aniObj) {
      styles = {
        styles: {},
        config: {}
      };
    } else {
      styles = aniObj;
    }
    if (animateTypes1.includes(type)) {
      if (!styles.styles.transform) {
        styles.styles.transform = "";
      }
      let unit = "";
      if (type === "rotate") {
        unit = "deg";
      }
      styles.styles.transform += `${type}(${args + unit}) `;
    } else {
      styles.styles[type] = `${args}`;
    }
    this.currentStepAnimates[this.next] = styles;
  }
  _animateRun(styles = {}, config = {}) {
    let ref2 = this.$.$refs["ani"].ref;
    if (!ref2)
      return;
    return new Promise((resolve2, reject) => {
      nvueAnimation.transition(ref2, {
        styles,
        ...config
      }, (res) => {
        resolve2();
      });
    });
  }
  _nvueNextAnimate(animates, step = 0, fn) {
    let obj2 = animates[step];
    if (obj2) {
      let {
        styles,
        config
      } = obj2;
      this._animateRun(styles, config).then(() => {
        step += 1;
        this._nvueNextAnimate(animates, step, fn);
      });
    } else {
      this.currentStepAnimates = {};
      typeof fn === "function" && fn();
      this.isEnd = true;
    }
  }
  step(config = {}) {
    this.animation.step(config);
    return this;
  }
  run(fn) {
    this.$.animationData = this.animation.export();
    this.$.timer = setTimeout(() => {
      typeof fn === "function" && fn();
    }, this.$.durationTime);
  }
}
const animateTypes1 = [
  "matrix",
  "matrix3d",
  "rotate",
  "rotate3d",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scale3d",
  "scaleX",
  "scaleY",
  "scaleZ",
  "skew",
  "skewX",
  "skewY",
  "translate",
  "translate3d",
  "translateX",
  "translateY",
  "translateZ"
];
const animateTypes2 = ["opacity", "backgroundColor"];
const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
  MPAnimation.prototype[type] = function(...args) {
    this.animation[type](...args);
    return this;
  };
});
function createAnimation(option, _this) {
  if (!_this)
    return;
  clearTimeout(_this.timer);
  return new MPAnimation(option, _this);
}
exports.Mock = Mock;
exports._export_sfc = _export_sfc;
exports.chooseAndUploadFile = chooseAndUploadFile;
exports.computed = computed;
exports.createAnimation = createAnimation;
exports.createSSRApp = createSSRApp;
exports.createStore = createStore;
exports.dayjs = dayjs;
exports.e = e$1;
exports.f = f$1;
exports.fontData = fontData;
exports.gei = gei;
exports.get_extname = get_extname;
exports.get_file_data = get_file_data;
exports.get_files_and_is_max = get_files_and_is_max;
exports.index = index;
exports.initVueI18n = initVueI18n;
exports.isSameOrAfter = isSameOrAfter;
exports.m = m$1;
exports.mapMutations = mapMutations;
exports.mapState = mapState;
exports.messages = messages;
exports.n = n$1;
exports.nextTick$1 = nextTick$1;
exports.nr = nr;
exports.o = o$1;
exports.onLoad = onLoad;
exports.onMounted = onMounted;
exports.onShow = onShow;
exports.p = p$1;
exports.ref = ref;
exports.resolveComponent = resolveComponent;
exports.s = s$1;
exports.sr = sr;
exports.t = t$1;
exports.unref = unref;
exports.uploadCloudFiles = uploadCloudFiles;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
