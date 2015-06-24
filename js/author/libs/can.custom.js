/*!
 * CanJS - 2.2.6
 * http://canjs.com/
 * Copyright (c) 2015 Bitovi
 * Wed, 24 Jun 2015 12:45:10 GMT
 * Licensed MIT

 * Includes: can/util/fixture/fixture,can/util/object/object
 * Download from: http://bitbuilder.herokuapp.com/can.custom.js?configuration=jquery&plugins=can%2Futil%2Ffixture%2Ffixture&plugins=can%2Futil%2Fobject%2Fobject
 */
/*[global-shim-start]*/
(function (exports, global){
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses only the exports objet
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	global.System = {
		define: function(__name, __code){
			global.define = origDefine;
			eval("(function() { " + __code + " \n }).call(global);");
			global.define = ourDefine;
		},
		orig: global.System
	};
})({},window)
/*can/util/can*/
define('can/util/can', [], function () {
    var glbl = typeof window !== 'undefined' ? window : global;
    var can = {};
    if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
        glbl.can = can;
    }
    can.global = glbl;
    can.k = function () {
    };
    can.isDeferred = can.isPromise = function (obj) {
        return obj && typeof obj.then === 'function' && typeof obj.pipe === 'function';
    };
    can.isMapLike = function (obj) {
        return can.Map && (obj instanceof can.Map || obj && obj.__get);
    };
    var cid = 0;
    can.cid = function (object, name) {
        if (!object._cid) {
            cid++;
            object._cid = (name || '') + cid;
        }
        return object._cid;
    };
    can.VERSION = '@EDGE';
    can.simpleExtend = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
    can.last = function (arr) {
        return arr && arr[arr.length - 1];
    };
    var protoBind = Function.prototype.bind;
    if (protoBind) {
        can.proxy = function (fn, context) {
            return protoBind.call(fn, context);
        };
    } else {
        can.proxy = function (fn, context) {
            return function () {
                return fn.apply(context, arguments);
            };
        };
    }
    can.frag = function (item) {
        var frag;
        if (!item || typeof item === 'string') {
            frag = can.buildFragment(item == null ? '' : '' + item, document.body);
            if (!frag.childNodes.length) {
                frag.appendChild(document.createTextNode(''));
            }
            return frag;
        } else if (item.nodeType === 11) {
            return item;
        } else if (typeof item.nodeType === 'number') {
            frag = document.createDocumentFragment();
            frag.appendChild(item);
            return frag;
        } else if (typeof item.length === 'number') {
            frag = document.createDocumentFragment();
            can.each(item, function (item) {
                frag.appendChild(can.frag(item));
            });
            return frag;
        } else {
            frag = can.buildFragment('' + item, document.body);
            if (!frag.childNodes.length) {
                frag.appendChild(document.createTextNode(''));
            }
            return frag;
        }
    };
    can.scope = can.viewModel = function (el, attr, val) {
        el = can.$(el);
        var scope = can.data(el, 'scope') || can.data(el, 'viewModel');
        if (!scope) {
            scope = new can.Map();
            can.data(el, 'scope', scope);
            can.data(el, 'viewModel', scope);
        }
        switch (arguments.length) {
        case 0:
        case 1:
            return scope;
        case 2:
            return scope.attr(attr);
        default:
            scope.attr(attr, val);
            return el;
        }
    };
    can['import'] = function (moduleName) {
        var deferred = new can.Deferred();
        if (typeof window.System === 'object' && can.isFunction(window.System['import'])) {
            window.System['import'](moduleName).then(can.proxy(deferred.resolve, deferred), can.proxy(deferred.reject, deferred));
        } else if (window.define && window.define.amd) {
            window.require([moduleName], function (value) {
                deferred.resolve(value);
            });
        } else if (window.steal) {
            steal.steal(moduleName, function (value) {
                deferred.resolve(value);
            });
        } else if (window.require) {
            deferred.resolve(window.require(moduleName));
        } else {
            deferred.resolve();
        }
        return deferred.promise();
    };
    can.__observe = function () {
    };
    return can;
});
/*can/util/attr/attr*/
define('can/util/attr/attr', ['can/util/can'], function (can) {
    var setImmediate = can.global.setImmediate || function (cb) {
            return setTimeout(cb, 0);
        }, attr = {
            MutationObserver: can.global.MutationObserver || can.global.WebKitMutationObserver || can.global.MozMutationObserver,
            map: {
                'class': 'className',
                'value': 'value',
                'innertext': 'innerText',
                'textcontent': 'textContent',
                'checked': true,
                'disabled': true,
                'readonly': true,
                'required': true,
                src: function (el, val) {
                    if (val == null || val === '') {
                        el.removeAttribute('src');
                        return null;
                    } else {
                        el.setAttribute('src', val);
                        return val;
                    }
                },
                style: function (el, val) {
                    return el.style.cssText = val || '';
                }
            },
            defaultValue: [
                'input',
                'textarea'
            ],
            set: function (el, attrName, val) {
                attrName = attrName.toLowerCase();
                var oldValue;
                if (!attr.MutationObserver) {
                    oldValue = attr.get(el, attrName);
                }
                var tagName = el.nodeName.toString().toLowerCase(), prop = attr.map[attrName], newValue;
                if (typeof prop === 'function') {
                    newValue = prop(el, val);
                } else if (prop === true) {
                    newValue = el[attrName] = true;
                    if (attrName === 'checked' && el.type === 'radio') {
                        if (can.inArray(tagName, attr.defaultValue) >= 0) {
                            el.defaultChecked = true;
                        }
                    }
                } else if (prop) {
                    newValue = val;
                    if (el[prop] !== val) {
                        el[prop] = val;
                    }
                    if (prop === 'value' && can.inArray(tagName, attr.defaultValue) >= 0) {
                        el.defaultValue = val;
                    }
                } else {
                    el.setAttribute(attrName, val);
                    newValue = val;
                }
                if (!attr.MutationObserver && newValue !== oldValue) {
                    attr.trigger(el, attrName, oldValue);
                }
            },
            trigger: function (el, attrName, oldValue) {
                if (can.data(can.$(el), 'canHasAttributesBindings')) {
                    attrName = attrName.toLowerCase();
                    return setImmediate(function () {
                        can.trigger(el, {
                            type: 'attributes',
                            attributeName: attrName,
                            target: el,
                            oldValue: oldValue,
                            bubbles: false
                        }, []);
                    });
                }
            },
            get: function (el, attrName) {
                attrName = attrName.toLowerCase();
                var prop = attr.map[attrName];
                if (typeof prop === 'string' && el[prop]) {
                    return el[prop];
                }
                return el.getAttribute(attrName);
            },
            remove: function (el, attrName) {
                attrName = attrName.toLowerCase();
                var oldValue;
                if (!attr.MutationObserver) {
                    oldValue = attr.get(el, attrName);
                }
                var setter = attr.map[attrName];
                if (typeof setter === 'function') {
                    setter(el, undefined);
                }
                if (setter === true) {
                    el[attrName] = false;
                } else if (typeof setter === 'string') {
                    el[setter] = '';
                } else {
                    el.removeAttribute(attrName);
                }
                if (!attr.MutationObserver && oldValue != null) {
                    attr.trigger(el, attrName, oldValue);
                }
            },
            has: function () {
                var el = can.global.document && document.createElement('div');
                if (el && el.hasAttribute) {
                    return function (el, name) {
                        return el.hasAttribute(name);
                    };
                } else {
                    return function (el, name) {
                        return el.getAttribute(name) !== null;
                    };
                }
            }()
        };
    return attr;
});
/*can/event/event*/
define('can/event/event', ['can/util/can'], function (can) {
    can.addEvent = function (event, handler) {
        var allEvents = this.__bindEvents || (this.__bindEvents = {}), eventList = allEvents[event] || (allEvents[event] = []);
        eventList.push({
            handler: handler,
            name: event
        });
        return this;
    };
    can.listenTo = function (other, event, handler) {
        var idedEvents = this.__listenToEvents;
        if (!idedEvents) {
            idedEvents = this.__listenToEvents = {};
        }
        var otherId = can.cid(other);
        var othersEvents = idedEvents[otherId];
        if (!othersEvents) {
            othersEvents = idedEvents[otherId] = {
                obj: other,
                events: {}
            };
        }
        var eventsEvents = othersEvents.events[event];
        if (!eventsEvents) {
            eventsEvents = othersEvents.events[event] = [];
        }
        eventsEvents.push(handler);
        can.bind.call(other, event, handler);
    };
    can.stopListening = function (other, event, handler) {
        var idedEvents = this.__listenToEvents, iterIdedEvents = idedEvents, i = 0;
        if (!idedEvents) {
            return this;
        }
        if (other) {
            var othercid = can.cid(other);
            (iterIdedEvents = {})[othercid] = idedEvents[othercid];
            if (!idedEvents[othercid]) {
                return this;
            }
        }
        for (var cid in iterIdedEvents) {
            var othersEvents = iterIdedEvents[cid], eventsEvents;
            other = idedEvents[cid].obj;
            if (!event) {
                eventsEvents = othersEvents.events;
            } else {
                (eventsEvents = {})[event] = othersEvents.events[event];
            }
            for (var eventName in eventsEvents) {
                var handlers = eventsEvents[eventName] || [];
                i = 0;
                while (i < handlers.length) {
                    if (handler && handler === handlers[i] || !handler) {
                        can.unbind.call(other, eventName, handlers[i]);
                        handlers.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                if (!handlers.length) {
                    delete othersEvents.events[eventName];
                }
            }
            if (can.isEmptyObject(othersEvents.events)) {
                delete idedEvents[cid];
            }
        }
        return this;
    };
    can.removeEvent = function (event, fn, __validate) {
        if (!this.__bindEvents) {
            return this;
        }
        var events = this.__bindEvents[event] || [], i = 0, ev, isFunction = typeof fn === 'function';
        while (i < events.length) {
            ev = events[i];
            if (__validate ? __validate(ev, event, fn) : isFunction && ev.handler === fn || !isFunction && (ev.cid === fn || !fn)) {
                events.splice(i, 1);
            } else {
                i++;
            }
        }
        return this;
    };
    can.dispatch = function (event, args) {
        var events = this.__bindEvents;
        if (!events) {
            return;
        }
        if (typeof event === 'string') {
            event = { type: event };
        }
        var eventName = event.type, handlers = (events[eventName] || []).slice(0), passed = [event];
        if (args) {
            passed.push.apply(passed, args);
        }
        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i].handler.apply(this, passed);
        }
        return event;
    };
    can.one = function (event, handler) {
        var one = function () {
            can.unbind.call(this, event, one);
            return handler.apply(this, arguments);
        };
        can.bind.call(this, event, one);
        return this;
    };
    can.event = {
        on: function () {
            if (arguments.length === 0 && can.Control && this instanceof can.Control) {
                return can.Control.prototype.on.call(this);
            } else {
                return can.addEvent.apply(this, arguments);
            }
        },
        off: function () {
            if (arguments.length === 0 && can.Control && this instanceof can.Control) {
                return can.Control.prototype.off.call(this);
            } else {
                return can.removeEvent.apply(this, arguments);
            }
        },
        bind: can.addEvent,
        unbind: can.removeEvent,
        delegate: function (selector, event, handler) {
            return can.addEvent.call(this, event, handler);
        },
        undelegate: function (selector, event, handler) {
            return can.removeEvent.call(this, event, handler);
        },
        trigger: can.dispatch,
        one: can.one,
        addEvent: can.addEvent,
        removeEvent: can.removeEvent,
        listenTo: can.listenTo,
        stopListening: can.stopListening,
        dispatch: can.dispatch
    };
    return can.event;
});
/*can/util/array/each*/
define('can/util/array/each', ['can/util/can'], function (can) {
    var isArrayLike = function (obj) {
        var length = 'length' in obj && obj.length;
        return typeof arr !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    };
    can.each = function (elements, callback, context) {
        var i = 0, key, len, item;
        if (elements) {
            if (isArrayLike(elements)) {
                if (can.List && elements instanceof can.List) {
                    for (len = elements.attr('length'); i < len; i++) {
                        item = elements.attr(i);
                        if (callback.call(context || item, item, i, elements) === false) {
                            break;
                        }
                    }
                } else {
                    for (len = elements.length; i < len; i++) {
                        item = elements[i];
                        if (callback.call(context || item, item, i, elements) === false) {
                            break;
                        }
                    }
                }
            } else if (typeof elements === 'object') {
                if (can.Map && elements instanceof can.Map || elements === can.route) {
                    var keys = can.Map.keys(elements);
                    for (i = 0, len = keys.length; i < len; i++) {
                        key = keys[i];
                        item = elements.attr(key);
                        if (callback.call(context || item, item, key, elements) === false) {
                            break;
                        }
                    }
                } else {
                    for (key in elements) {
                        if (elements.hasOwnProperty(key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                            break;
                        }
                    }
                }
            }
        }
        return elements;
    };
    return can;
});
/*can/util/inserted/inserted*/
define('can/util/inserted/inserted', ['can/util/can'], function (can) {
    can.inserted = function (elems) {
        elems = can.makeArray(elems);
        var inDocument = false, doc = can.$(document.contains ? document : document.body), children;
        for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
            if (!inDocument) {
                if (elem.getElementsByTagName) {
                    if (can.has(doc, elem).length) {
                        inDocument = true;
                    } else {
                        return;
                    }
                } else {
                    continue;
                }
            }
            if (inDocument && elem.getElementsByTagName) {
                children = can.makeArray(elem.getElementsByTagName('*'));
                can.trigger(elem, 'inserted', [], false);
                for (var j = 0, child; (child = children[j]) !== undefined; j++) {
                    can.trigger(child, 'inserted', [], false);
                }
            }
        }
    };
    can.appendChild = function (el, child) {
        var children;
        if (child.nodeType === 11) {
            children = can.makeArray(child.childNodes);
        } else {
            children = [child];
        }
        el.appendChild(child);
        can.inserted(children);
    };
    can.insertBefore = function (el, child, ref) {
        var children;
        if (child.nodeType === 11) {
            children = can.makeArray(child.childNodes);
        } else {
            children = [child];
        }
        el.insertBefore(child, ref);
        can.inserted(children);
    };
});
/*can/util/jquery/jquery*/
define('can/util/jquery/jquery', [
    'jquery/dist/jquery',
    'can/util/can',
    'can/util/attr/attr',
    'can/event/event',
    'can/util/array/each',
    'can/util/inserted/inserted'
], function ($, can, attr, event) {
    var isBindableElement = function (node) {
        return node.nodeName && (node.nodeType === 1 || node.nodeType === 9) || node == window;
    };
    $ = $ || window.jQuery;
    $.extend(can, $, {
        trigger: function (obj, event, args, bubbles) {
            if (isBindableElement(obj)) {
                $.event.trigger(event, args, obj, !bubbles);
            } else if (obj.trigger) {
                obj.trigger(event, args);
            } else {
                if (typeof event === 'string') {
                    event = { type: event };
                }
                event.target = event.target || obj;
                if (args) {
                    if (args.length && typeof args === 'string') {
                        args = [args];
                    } else if (!args.length) {
                        args = [args];
                    }
                }
                if (!args) {
                    args = [];
                }
                can.dispatch.call(obj, event, args);
            }
        },
        event: can.event,
        addEvent: can.addEvent,
        removeEvent: can.removeEvent,
        buildFragment: function (elems, context) {
            var ret;
            elems = [elems];
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;
            ret = $.buildFragment(elems, context);
            return ret.cacheable ? $.clone(ret.fragment) : ret.fragment || ret;
        },
        $: $,
        each: can.each,
        bind: function (ev, cb) {
            if (this.bind && this.bind !== can.bind) {
                this.bind(ev, cb);
            } else if (isBindableElement(this)) {
                $.event.add(this, ev, cb);
            } else {
                can.addEvent.call(this, ev, cb);
            }
            return this;
        },
        unbind: function (ev, cb) {
            if (this.unbind && this.unbind !== can.unbind) {
                this.unbind(ev, cb);
            } else if (isBindableElement(this)) {
                $.event.remove(this, ev, cb);
            } else {
                can.removeEvent.call(this, ev, cb);
            }
            return this;
        },
        delegate: function (selector, ev, cb) {
            if (this.delegate) {
                this.delegate(selector, ev, cb);
            } else if (isBindableElement(this)) {
                $(this).delegate(selector, ev, cb);
            } else {
                can.bind.call(this, ev, cb);
            }
            return this;
        },
        undelegate: function (selector, ev, cb) {
            if (this.undelegate) {
                this.undelegate(selector, ev, cb);
            } else if (isBindableElement(this)) {
                $(this).undelegate(selector, ev, cb);
            } else {
                can.unbind.call(this, ev, cb);
            }
            return this;
        },
        proxy: can.proxy,
        attr: attr
    });
    can.on = can.bind;
    can.off = can.unbind;
    $.each([
        'append',
        'filter',
        'addClass',
        'remove',
        'data',
        'get',
        'has'
    ], function (i, name) {
        can[name] = function (wrapped) {
            return wrapped[name].apply(wrapped, can.makeArray(arguments).slice(1));
        };
    });
    var oldClean = $.cleanData;
    $.cleanData = function (elems) {
        $.each(elems, function (i, elem) {
            if (elem) {
                can.trigger(elem, 'removed', [], false);
            }
        });
        oldClean(elems);
    };
    var oldDomManip = $.fn.domManip, cbIndex;
    $.fn.domManip = function (args, cb1, cb2) {
        for (var i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] === 'function') {
                cbIndex = i;
                break;
            }
        }
        return oldDomManip.apply(this, arguments);
    };
    $(document.createElement('div')).append(document.createElement('div'));
    $.fn.domManip = cbIndex === 2 ? function (args, table, callback) {
        return oldDomManip.call(this, args, table, function (elem) {
            var elems;
            if (elem.nodeType === 11) {
                elems = can.makeArray(elem.childNodes);
            }
            var ret = callback.apply(this, arguments);
            can.inserted(elems ? elems : [elem]);
            return ret;
        });
    } : function (args, callback) {
        return oldDomManip.call(this, args, function (elem) {
            var elems;
            if (elem.nodeType === 11) {
                elems = can.makeArray(elem.childNodes);
            }
            var ret = callback.apply(this, arguments);
            can.inserted(elems ? elems : [elem]);
            return ret;
        });
    };
    if (!can.attr.MutationObserver) {
        var oldAttr = $.attr;
        $.attr = function (el, attrName) {
            var oldValue, newValue;
            if (arguments.length >= 3) {
                oldValue = oldAttr.call(this, el, attrName);
            }
            var res = oldAttr.apply(this, arguments);
            if (arguments.length >= 3) {
                newValue = oldAttr.call(this, el, attrName);
            }
            if (newValue !== oldValue) {
                can.attr.trigger(el, attrName, oldValue);
            }
            return res;
        };
        var oldRemove = $.removeAttr;
        $.removeAttr = function (el, attrName) {
            var oldValue = oldAttr.call(this, el, attrName), res = oldRemove.apply(this, arguments);
            if (oldValue != null) {
                can.attr.trigger(el, attrName, oldValue);
            }
            return res;
        };
        $.event.special.attributes = {
            setup: function () {
                can.data(can.$(this), 'canHasAttributesBindings', true);
            },
            teardown: function () {
                $.removeData(this, 'canHasAttributesBindings');
            }
        };
    } else {
        $.event.special.attributes = {
            setup: function () {
                var self = this;
                var observer = new can.attr.MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            var copy = can.simpleExtend({}, mutation);
                            can.trigger(self, copy, []);
                        });
                    });
                observer.observe(this, {
                    attributes: true,
                    attributeOldValue: true
                });
                can.data(can.$(this), 'canAttributesObserver', observer);
            },
            teardown: function () {
                can.data(can.$(this), 'canAttributesObserver').disconnect();
                $.removeData(this, 'canAttributesObserver');
            }
        };
    }
    (function () {
        var text = '<-\n>', frag = can.buildFragment(text, document);
        if (text !== frag.childNodes[0].nodeValue) {
            var oldBuildFragment = can.buildFragment;
            can.buildFragment = function (content, context) {
                var res = oldBuildFragment(content, context);
                if (res.childNodes.length === 1 && res.childNodes[0].nodeType === 3) {
                    res.childNodes[0].nodeValue = content;
                }
                return res;
            };
        }
    }());
    $.event.special.inserted = {};
    $.event.special.removed = {};
    return can;
});
/*can/util/util*/
define('can/util/util', ['can/util/jquery/jquery'], function (can) {
    return can;
});
/*can/util/string/string*/
define('can/util/string/string', ['can/util/util'], function (can) {
    var strUndHash = /_|-/, strColons = /\=\=/, strWords = /([A-Z]+)([A-Z][a-z])/g, strLowUp = /([a-z\d])([A-Z])/g, strDash = /([a-z\d])([A-Z])/g, strReplacer = /\{([^\}]+)\}/g, strQuote = /"/g, strSingleQuote = /'/g, strHyphenMatch = /-+(.)?/g, strCamelMatch = /[a-z][A-Z]/g, getNext = function (obj, prop, add) {
            var result = obj[prop];
            if (result === undefined && add === true) {
                result = obj[prop] = {};
            }
            return result;
        }, isContainer = function (current) {
            return /^f|^o/.test(typeof current);
        }, convertBadValues = function (content) {
            var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
            return '' + (isInvalid ? '' : content);
        };
    can.extend(can, {
        esc: function (content) {
            return convertBadValues(content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(strQuote, '&#34;').replace(strSingleQuote, '&#39;');
        },
        getObject: function (name, roots, add) {
            var parts = name ? name.split('.') : [], length = parts.length, current, r = 0, i, container, rootsLength;
            roots = can.isArray(roots) ? roots : [roots || window];
            rootsLength = roots.length;
            if (!length) {
                return roots[0];
            }
            for (r; r < rootsLength; r++) {
                current = roots[r];
                container = undefined;
                for (i = 0; i < length && isContainer(current); i++) {
                    container = current;
                    current = getNext(container, parts[i]);
                }
                if (container !== undefined && current !== undefined) {
                    break;
                }
            }
            if (add === false && current !== undefined) {
                delete container[parts[i - 1]];
            }
            if (add === true && current === undefined) {
                current = roots[0];
                for (i = 0; i < length && isContainer(current); i++) {
                    current = getNext(current, parts[i], true);
                }
            }
            return current;
        },
        capitalize: function (s, cache) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        camelize: function (str) {
            return convertBadValues(str).replace(strHyphenMatch, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        },
        hyphenate: function (str) {
            return convertBadValues(str).replace(strCamelMatch, function (str, offset) {
                return str.charAt(0) + '-' + str.charAt(1).toLowerCase();
            });
        },
        underscore: function (s) {
            return s.replace(strColons, '/').replace(strWords, '$1_$2').replace(strLowUp, '$1_$2').replace(strDash, '_').toLowerCase();
        },
        sub: function (str, data, remove) {
            var obs = [];
            str = str || '';
            obs.push(str.replace(strReplacer, function (whole, inside) {
                var ob = can.getObject(inside, data, remove === true ? false : undefined);
                if (ob === undefined || ob === null) {
                    obs = null;
                    return '';
                }
                if (isContainer(ob) && obs) {
                    obs.push(ob);
                    return '';
                }
                return '' + ob;
            }));
            return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
        },
        replacer: strReplacer,
        undHash: strUndHash
    });
    return can;
});
/*can/util/object/object*/
define('can/util/object/object', ['can/util/util'], function (can) {
    var isArray = can.isArray;
    can.Object = {};
    var same = can.Object.same = function (a, b, compares, aParent, bParent, deep) {
            var aType = typeof a, aArray = isArray(a), comparesType = typeof compares, compare;
            if (comparesType === 'string' || compares === null) {
                compares = compareMethods[compares];
                comparesType = 'function';
            }
            if (comparesType === 'function') {
                return compares(a, b, aParent, bParent);
            }
            compares = compares || {};
            if (a === null || b === null) {
                return a === b;
            }
            if (a instanceof Date || b instanceof Date) {
                return a === b;
            }
            if (deep === -1) {
                return aType === 'object' || a === b;
            }
            if (aType !== typeof b || aArray !== isArray(b)) {
                return false;
            }
            if (a === b) {
                return true;
            }
            if (aArray) {
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    compare = compares[i] === undefined ? compares['*'] : compares[i];
                    if (!same(a[i], b[i], a, b, compare)) {
                        return false;
                    }
                }
                return true;
            } else if (aType === 'object' || aType === 'function') {
                var bCopy = can.extend({}, b);
                for (var prop in a) {
                    compare = compares[prop] === undefined ? compares['*'] : compares[prop];
                    if (!same(a[prop], b[prop], compare, a, b, deep === false ? -1 : undefined)) {
                        return false;
                    }
                    delete bCopy[prop];
                }
                for (prop in bCopy) {
                    if (compares[prop] === undefined || !same(undefined, b[prop], compares[prop], a, b, deep === false ? -1 : undefined)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };
    can.Object.subsets = function (checkSet, sets, compares) {
        var len = sets.length, subsets = [];
        for (var i = 0; i < len; i++) {
            var set = sets[i];
            if (can.Object.subset(checkSet, set, compares)) {
                subsets.push(set);
            }
        }
        return subsets;
    };
    can.Object.subset = function (subset, set, compares) {
        compares = compares || {};
        for (var prop in set) {
            if (!same(subset[prop], set[prop], compares[prop], subset, set)) {
                return false;
            }
        }
        return true;
    };
    var compareMethods = {
            'null': function () {
                return true;
            },
            i: function (a, b) {
                return ('' + a).toLowerCase() === ('' + b).toLowerCase();
            },
            eq: function (a, b) {
                return a === b;
            },
            similar: function (a, b) {
                return a == b;
            }
        };
    compareMethods.eqeq = compareMethods.similar;
    return can.Object;
});
/*can/util/fixture/fixture*/
define('can/util/fixture/fixture', [
    'can/util/util',
    'can/util/string/string',
    'can/util/object/object'
], function (can) {
    if (!can.Object) {
        throw new Error('can.fixture depends on can.Object. Please include it before can.fixture.');
    }
    var getUrl = function (url) {
        if (typeof steal !== 'undefined') {
            if (steal.joinURIs) {
                var base = steal.config('baseUrl');
                var joined = steal.joinURIs(base, url);
                return joined;
            }
            if (can.isFunction(steal.config)) {
                if (steal.System) {
                    return steal.joinURIs(steal.config('baseURL'), url);
                } else {
                    return steal.config().root.mapJoin(url).toString();
                }
            }
            return steal.root.join(url).toString();
        }
        return (can.fixture.rootUrl || '') + url;
    };
    var updateSettings = function (settings, originalOptions) {
            if (!can.fixture.on || settings.fixture === false) {
                return;
            }
            var log = function () {
            };
            settings.type = settings.type || settings.method || 'GET';
            var data = overwrite(settings);
            if (!settings.fixture) {
                if (window.location.protocol === 'file:') {
                    log('ajax request to ' + settings.url + ', no fixture found');
                }
                return;
            }
            if (typeof settings.fixture === 'string' && can.fixture[settings.fixture]) {
                settings.fixture = can.fixture[settings.fixture];
            }
            if (typeof settings.fixture === 'string') {
                var url = settings.fixture;
                if (/^\/\//.test(url)) {
                    url = getUrl(settings.fixture.substr(2));
                }
                if (data) {
                    url = can.sub(url, data);
                }
                delete settings.fixture;
                settings.url = url;
                settings.data = null;
                settings.type = 'GET';
                if (!settings.error) {
                    settings.error = function (xhr, error, message) {
                        throw 'fixtures.js Error ' + error + ' ' + message;
                    };
                }
            } else {
                if (settings.dataTypes) {
                    settings.dataTypes.splice(0, 0, 'fixture');
                }
                if (data && originalOptions) {
                    originalOptions.data = originalOptions.data || {};
                    can.extend(originalOptions.data, data);
                }
            }
        }, extractResponse = function (status, statusText, responses, headers) {
            if (typeof status !== 'number') {
                headers = statusText;
                responses = status;
                statusText = 'success';
                status = 200;
            }
            if (typeof statusText !== 'string') {
                headers = responses;
                responses = statusText;
                statusText = 'success';
            }
            if (status >= 400 && status <= 599) {
                this.dataType = 'text';
            }
            return [
                status,
                statusText,
                extractResponses(this, responses),
                headers
            ];
        }, extractResponses = function (settings, responses) {
            var next = settings.dataTypes ? settings.dataTypes[0] : settings.dataType || 'json';
            if (!responses || !responses[next]) {
                var tmp = {};
                tmp[next] = responses;
                responses = tmp;
            }
            return responses;
        };
    if (can.ajaxPrefilter && can.ajaxTransport) {
        can.ajaxPrefilter(updateSettings);
        can.ajaxTransport('fixture', function (s, original) {
            s.dataTypes.shift();
            var timeout, stopped = false;
            return {
                send: function (headers, callback) {
                    timeout = setTimeout(function () {
                        var success = function () {
                                if (stopped === false) {
                                    callback.apply(null, extractResponse.apply(s, arguments));
                                }
                            }, result = s.fixture(original, success, headers, s);
                        if (result !== undefined) {
                            callback(200, 'success', extractResponses(s, result), {});
                        }
                    }, can.fixture.delay);
                },
                abort: function () {
                    stopped = true;
                    clearTimeout(timeout);
                }
            };
        });
    } else {
        var AJAX = can.ajax;
        can.ajax = function (settings) {
            updateSettings(settings, settings);
            if (settings.fixture) {
                var timeout, deferred = new can.Deferred(), stopped = false;
                deferred.getResponseHeader = function () {
                };
                deferred.then(settings.success, settings.fail);
                deferred.abort = function () {
                    clearTimeout(timeout);
                    stopped = true;
                    deferred.reject(deferred);
                };
                timeout = setTimeout(function () {
                    var success = function () {
                            var response = extractResponse.apply(settings, arguments), status = response[0];
                            if ((status >= 200 && status < 300 || status === 304) && stopped === false) {
                                deferred.resolve(response[2][settings.dataType]);
                            } else {
                                deferred.reject(deferred, 'error', response[1]);
                            }
                        }, result = settings.fixture(settings, success, settings.headers, settings);
                    if (result !== undefined) {
                        deferred.resolve(result);
                    }
                }, can.fixture.delay);
                return deferred;
            } else {
                return AJAX(settings);
            }
        };
    }
    var overwrites = [], find = function (settings, exact) {
            for (var i = 0; i < overwrites.length; i++) {
                if ($fixture._similar(settings, overwrites[i], exact)) {
                    return i;
                }
            }
            return -1;
        }, overwrite = function (settings) {
            var index = find(settings);
            if (index > -1) {
                settings.fixture = overwrites[index].fixture;
                return $fixture._getData(overwrites[index].url, settings.url);
            }
        }, getId = function (settings) {
            var id = settings.data.id;
            if (id === undefined && typeof settings.data === 'number') {
                id = settings.data;
            }
            if (id === undefined) {
                settings.url.replace(/\/(\d+)(\/|$|\.)/g, function (all, num) {
                    id = num;
                });
            }
            if (id === undefined) {
                id = settings.url.replace(/\/(\w+)(\/|$|\.)/g, function (all, num) {
                    if (num !== 'update') {
                        id = num;
                    }
                });
            }
            if (id === undefined) {
                id = Math.round(Math.random() * 1000);
            }
            return id;
        };
    var $fixture = can.fixture = function (settings, fixture) {
            if (fixture !== undefined) {
                if (typeof settings === 'string') {
                    var matches = settings.match(/(GET|POST|PUT|DELETE) (.+)/i);
                    if (!matches) {
                        settings = { url: settings };
                    } else {
                        settings = {
                            url: matches[2],
                            type: matches[1]
                        };
                    }
                }
                var index = find(settings, !!fixture);
                if (index > -1) {
                    overwrites.splice(index, 1);
                }
                if (fixture == null) {
                    return;
                }
                settings.fixture = fixture;
                overwrites.push(settings);
            } else {
                can.each(settings, function (fixture, url) {
                    $fixture(url, fixture);
                });
            }
        };
    var replacer = can.replacer;
    can.extend(can.fixture, {
        _similar: function (settings, overwrite, exact) {
            if (exact) {
                return can.Object.same(settings, overwrite, { fixture: null });
            } else {
                return can.Object.subset(settings, overwrite, can.fixture._compare);
            }
        },
        _compare: {
            url: function (a, b) {
                return !!$fixture._getData(b, a);
            },
            fixture: null,
            type: 'i'
        },
        _getData: function (fixtureUrl, url) {
            var order = [], fixtureUrlAdjusted = fixtureUrl.replace('.', '\\.').replace('?', '\\?'), res = new RegExp(fixtureUrlAdjusted.replace(replacer, function (whole, part) {
                    order.push(part);
                    return '([^/]+)';
                }) + '$').exec(url), data = {};
            if (!res) {
                return null;
            }
            res.shift();
            can.each(order, function (name) {
                data[name] = res.shift();
            });
            return data;
        },
        store: function (count, make, filter) {
            var currentId = 0, findOne = function (id) {
                    for (var i = 0; i < items.length; i++) {
                        if (id == items[i].id) {
                            return items[i];
                        }
                    }
                }, methods = {}, types, items, reset;
            if (can.isArray(count) && typeof count[0] === 'string') {
                types = count;
                count = make;
                make = filter;
                filter = arguments[3];
            } else if (typeof count === 'string') {
                types = [
                    count + 's',
                    count
                ];
                count = make;
                make = filter;
                filter = arguments[3];
            }
            if (typeof count === 'number') {
                items = [];
                reset = function () {
                    items = [];
                    for (var i = 0; i < count; i++) {
                        var item = make(i, items);
                        if (!item.id) {
                            item.id = i;
                        }
                        currentId = Math.max(item.id + 1, currentId + 1) || items.length;
                        items.push(item);
                    }
                    if (can.isArray(types)) {
                        can.fixture['~' + types[0]] = items;
                        can.fixture['-' + types[0]] = methods.findAll;
                        can.fixture['-' + types[1]] = methods.findOne;
                        can.fixture['-' + types[1] + 'Update'] = methods.update;
                        can.fixture['-' + types[1] + 'Destroy'] = methods.destroy;
                        can.fixture['-' + types[1] + 'Create'] = methods.create;
                    }
                };
            } else {
                filter = make;
                var initialItems = count;
                reset = function () {
                    items = initialItems.slice(0);
                };
            }
            can.extend(methods, {
                findAll: function (request) {
                    request = request || {};
                    var retArr = items.slice(0);
                    request.data = request.data || {};
                    can.each((request.data.order || []).slice(0).reverse(), function (name) {
                        var split = name.split(' ');
                        retArr = retArr.sort(function (a, b) {
                            if (split[1].toUpperCase() !== 'ASC') {
                                if (a[split[0]] < b[split[0]]) {
                                    return 1;
                                } else if (a[split[0]] === b[split[0]]) {
                                    return 0;
                                } else {
                                    return -1;
                                }
                            } else {
                                if (a[split[0]] < b[split[0]]) {
                                    return -1;
                                } else if (a[split[0]] === b[split[0]]) {
                                    return 0;
                                } else {
                                    return 1;
                                }
                            }
                        });
                    });
                    can.each((request.data.group || []).slice(0).reverse(), function (name) {
                        var split = name.split(' ');
                        retArr = retArr.sort(function (a, b) {
                            return a[split[0]] > b[split[0]];
                        });
                    });
                    var offset = parseInt(request.data.offset, 10) || 0, limit = parseInt(request.data.limit, 10) || items.length - offset, i = 0;
                    for (var param in request.data) {
                        i = 0;
                        if (request.data[param] !== undefined && (param.indexOf('Id') !== -1 || param.indexOf('_id') !== -1)) {
                            while (i < retArr.length) {
                                if (request.data[param] != retArr[i][param]) {
                                    retArr.splice(i, 1);
                                } else {
                                    i++;
                                }
                            }
                        }
                    }
                    if (typeof filter === 'function') {
                        i = 0;
                        while (i < retArr.length) {
                            if (!filter(retArr[i], request)) {
                                retArr.splice(i, 1);
                            } else {
                                i++;
                            }
                        }
                    } else if (typeof filter === 'object') {
                        i = 0;
                        while (i < retArr.length) {
                            if (!can.Object.subset(retArr[i], request.data, filter)) {
                                retArr.splice(i, 1);
                            } else {
                                i++;
                            }
                        }
                    }
                    return {
                        'count': retArr.length,
                        'limit': request.data.limit,
                        'offset': request.data.offset,
                        'data': retArr.slice(offset, offset + limit)
                    };
                },
                findOne: function (request, response) {
                    var item = findOne(getId(request));
                    if (typeof item === 'undefined') {
                        return response(404, 'Requested resource not found');
                    }
                    response(item);
                },
                update: function (request, response) {
                    var id = getId(request), item = findOne(id);
                    if (typeof item === 'undefined') {
                        return response(404, 'Requested resource not found');
                    }
                    can.extend(item, request.data);
                    response({ id: id }, { location: request.url || '/' + getId(request) });
                },
                destroy: function (request, response) {
                    var id = getId(request), item = findOne(id);
                    if (typeof item === 'undefined') {
                        return response(404, 'Requested resource not found');
                    }
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id == id) {
                            items.splice(i, 1);
                            break;
                        }
                    }
                    return {};
                },
                create: function (settings, response) {
                    var item = typeof make === 'function' ? make(items.length, items) : {};
                    can.extend(item, settings.data);
                    if (!item.id) {
                        item.id = currentId++;
                    }
                    items.push(item);
                    response({ id: item.id }, { location: settings.url + '/' + item.id });
                }
            });
            reset();
            return can.extend({
                getId: getId,
                find: function (settings) {
                    return findOne(getId(settings));
                },
                reset: reset
            }, methods);
        },
        rand: function randomize(arr, min, max) {
            if (typeof arr === 'number') {
                if (typeof min === 'number') {
                    return arr + Math.floor(Math.random() * (min - arr));
                } else {
                    return Math.floor(Math.random() * arr);
                }
            }
            var rand = randomize;
            if (min === undefined) {
                return rand(arr, rand(arr.length + 1));
            }
            var res = [];
            arr = arr.slice(0);
            if (!max) {
                max = min;
            }
            max = min + Math.round(rand(max - min));
            for (var i = 0; i < max; i++) {
                res.push(arr.splice(rand(arr.length), 1)[0]);
            }
            return res;
        },
        xhr: function (xhr) {
            return can.extend({}, {
                abort: can.noop,
                getAllResponseHeaders: function () {
                    return '';
                },
                getResponseHeader: function () {
                    return '';
                },
                open: can.noop,
                overrideMimeType: can.noop,
                readyState: 4,
                responseText: '',
                responseXML: null,
                send: can.noop,
                setRequestHeader: can.noop,
                status: 200,
                statusText: 'OK'
            }, xhr);
        },
        on: true
    });
    can.fixture.delay = 200;
    can.fixture.rootUrl = getUrl('');
    can.fixture['-handleFunction'] = function (settings) {
        if (typeof settings.fixture === 'string' && can.fixture[settings.fixture]) {
            settings.fixture = can.fixture[settings.fixture];
        }
        if (typeof settings.fixture === 'function') {
            setTimeout(function () {
                if (settings.success) {
                    settings.success.apply(null, settings.fixture(settings, 'success'));
                }
                if (settings.complete) {
                    settings.complete.apply(null, settings.fixture(settings, 'complete'));
                }
            }, can.fixture.delay);
            return true;
        }
        return false;
    };
    can.fixture.overwrites = overwrites;
    can.fixture.make = can.fixture.store;
    return can.fixture;
});
/*[global-shim-end]*/
(function (){
	window._define = window.define;
	window.define = window.define.orig;
	window.System = window.System.orig;
})();