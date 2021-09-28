
/* global self, document, EventTarget, CustomEvent */

module.exports = (value_undefined => {
	const typeof_undefined = String(value_undefined);
	const [
		is_emitter_nodejs,
		is_emitter_eventtarget,
		is_emitter_element,
		is_emitter_self,
		is_event_name_need_prefix,
	] = (() => {
		if (typeof process !== typeof_undefined && null !== process.versions && null !== process.versions.node) {
			return [ true ];
		}
		if (typeof EventTarget !== typeof_undefined) {
			return [ false, true ];
		}
		if (typeof document !== typeof_undefined && typeof document.createElement === 'function') {
			return [ false, false, true ];
		}
		if (typeof self !== typeof_undefined) {
			return [ false, false, false, true, true ];
		}
		throw new Error('Cannot create event listener. Check your environment');
	})();

	const createEventBus = () => {
		if (is_emitter_nodejs) {
			const EventEmitter = require('events');
			return new EventEmitter();
		}

		if (is_emitter_eventtarget) {
			return new EventTarget();
		}

		if (is_emitter_element) {
			return document.createElement('p');
		}

		if (is_emitter_self) {
			return self;
		}
	};

	const EventEmitter = function EventEmitter () {
		this._bus = createEventBus();
		this._event_name_prefix = is_event_name_need_prefix ? `eventemitter-${Math.random()}-` : '';
	};

	EventEmitter.prototype.on = function (event_name, listener) {
		event_name = this._event_name_prefix + event_name;

		const bus = this._bus;

		if (is_emitter_nodejs) {
			bus.on(event_name, listener);
			return () => {
				bus.off(event_name, listener);
			};
		}
		else {
			const listener_this = (event) => {
				listener(...event.detail);
			};

			bus.addEventListener(event_name, listener_this);
			return () => {
				bus.removeEventListener(event_name, listener_this);
			};
		}
	};
	EventEmitter.prototype.once = function (event_name, listener) {
		const off = this.on(
			event_name,
			(...args) => {
				off();
				listener(...args);
			},
		);
		return off;
	};
	EventEmitter.prototype.emit = function (event_name, ...args) {
		event_name = this._event_name_prefix + event_name;

		const bus = this._bus;

		if (is_emitter_nodejs) {
			bus.emit(
				event_name,
				...args,
			);
		}
		else {
			bus.dispatchEvent(
				new CustomEvent(
					event_name,
					{
						bubbles: false,
						cancelable: false,
						detail: args,
					},
				),
			);
		}
	};

	return EventEmitter;
})();
