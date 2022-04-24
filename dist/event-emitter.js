
module.exports = (storage = {}) => ({
	emit (event_name, ...args) {
		(storage[event_name] ?? []).forEach(fn => fn(...args));
	},
	on (event_name, fn) {
		storage[event_name] = (storage[event_name] ?? new Set()).add(fn);
		return () => storage[event_name].delete(fn);
	},
	once (event_name, fn, off) {
		return off = this.on(
			event_name,
			(...args) => {
				off();
				fn(...args);
			},
		);
	},
});
