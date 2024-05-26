
// @ts-check

import {
	test,
	expect } from 'bun:test';

import createEventEmitter from './main.js';

const emitter = createEventEmitter();

test('emit', () => {
	let result;

	emitter.on('emit', (...args) => {
		result = args;
	});

	emitter.emit('emit', 1, 2, 3);

	expect(result).toEqual([1, 2, 3]);
});

test('emit once', () => {
	let count = 0;

	emitter.once('emit-once', () => {
		count++;
	});

	emitter.emit('emit-once');
	emitter.emit('emit-once');

	expect(count).toBe(1);
});
