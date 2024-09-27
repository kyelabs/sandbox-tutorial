const callbacks = {};
let id = 0;

navigator.serviceWorker.register('/sw.js');
navigator.serviceWorker.addEventListener('message', (event) => {
  const { id, result } = event.data;
  const callback = callbacks[id];
  delete callbacks[id];
  callback(result);
});

export function run (cmd, data) {
  id = (id + 1) % Number.MAX_SAFE_INTEGER;
  return new Promise((resolve) => {
    callbacks[id] = resolve;
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({ ...data, cmd, id });
    });
  });
}