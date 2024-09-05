import PyodideWorker from 'web-worker:./webworker';

const callbacks = {};

const pyodideWorker = new PyodideWorker();

pyodideWorker.onmessage = (event) => {
  const { id, result } = event.data;
  const onSuccess = callbacks[id];
  delete callbacks[id];
  onSuccess(result);
};

const asyncRun = (() => {
  let id = 0; // identify a Promise
  return (data) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      pyodideWorker.postMessage({
        ...data,
        id,
      });
    });
  };
})();

export { asyncRun };