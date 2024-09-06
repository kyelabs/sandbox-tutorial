import PyodideWorker from 'web-worker:./webworker';

class WorkerInterface {
  constructor() {
    this.callbacks = {};
    this.id = 0;

    this.worker = new PyodideWorker();
    this.worker.onmessage = this.onmessage.bind(this);
  }

  onmessage(event) {
    const { id, result } = event.data;
    const callback = this.callbacks[id];
    delete this.callbacks[id];
    callback(result);
  }

  async postMessage(data) {
    this.id = (this.id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((resolve) => {
      this.callbacks[this.id] = resolve;
      this.worker.postMessage({ ...data, id: this.id });
    });
  }

  async run(code, data, model_name) {
    return this.postMessage({ code, data, model_name });
  }
}

const pyWorker = new WorkerInterface();
export default pyWorker;