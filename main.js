
const createEventBus = () => {
	try {
		if(typeof process !== 'undefined' && null !== process.versions && null !== process.versions.node){
			const EventEmitter = require('events');
			return [
				new EventEmitter(),
				true,
			];
		}
	}
	catch{}

	try {
		return [
			new EventTarget(),
		];
	}
	catch{}

	try {
		return [
			document.createElement('p'),
		];
	}
	catch{}

	try {
		return [
			self,
			false,
			true,
		];
	}
	catch{}

	throw new Error('Cannot create event listener. Check your environment');
};

const EventEmitter = module.exports = function EventEmitter () {
	const [ bus, is_nodejs_emitter, need_prefix ] = createEventBus();

	this._bus = bus;
	this._is_nodejs_emitter = true === is_nodejs_emitter;
	this._event_name_prefix = (true === need_prefix) ? `eventemitter-${Math.random()}-` : '';
};

EventEmitter.prototype.on = function (event_name, listener) {
	event_name = this._event_name_prefix + event_name;

	const bus = this._bus;

	if(this._is_nodejs_emitter){
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

	if(this._is_nodejs_emitter){
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
