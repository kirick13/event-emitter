
/**
 * @typedef {Object} EventEmitter
 * @property {(event: string, ...args: any[]) => void} emit - Emit an event.
 * @property {(event: string, listener: (...args: any[]) => void) => void} on - Register an event listener.
 * @property {(event: string, listener: (...args: any[]) => void) => void} once - Register an event listener that will be called only once.
 */

/**
 * Creates a new event emitter.
 * @returns {EventEmitter} An event emitter with `emit`, `on`, and `off` methods.
 */
export default (storage = {}) => ({
	/**
	 * Emit an event.
	 * @param {string} event - The event name.
	 * @param {...any} args - Arguments to pass to the event listeners.
	 * @returns {void}
	 */
	emit(event_name, ...args) {
		(storage[event_name] ?? []).forEach(fn => fn(...args));
	},
	/**
	 * Register an event listener.
	 * @param {string} event - The event name.
	 * @param {function(...any): void} listener - The event listener.
	 * @returns {function(): void} - A function that unregisters the event listener.
	 */
	on(event_name, fn) {
		storage[event_name] = (storage[event_name] ?? new Set()).add(fn);
		return () => storage[event_name].delete(fn);
	},
	/**
	 * Register an event listener that will be called only once.
	 * @param {string} event - The event name.
	 * @param {function(...any): void} listener - The event listener.
	 * @returns {function(): void} - A function that unregisters the event listener.
	 */
	once(event_name, fn, off) {
		return off = this.on(
			event_name,
			(...args) => {
				off();
				fn(...args);
			},
		);
	},
});
