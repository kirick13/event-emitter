
const createEventEmitter = require('event-emitter');

const emitter = createEventEmitter();

emitter.on(
    'test',
    (data) => {
        console.log('got event:', data);
    },
);

emitter.emit('test', 'hello world');
