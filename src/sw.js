import py_script from './main.py';

importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

async function loadPyodideAndPackages() {
  const pyodide = await loadPyodide();
  await pyodide.loadPackage(["pandas",
    "https://files.pythonhosted.org/packages/c2/cf/09d6b2691c08e0a046d3b95bf4a593a2e3bfe6d4514349726d9cd8447383/kye-0.1.2-py3-none-any.whl",
    "https://files.pythonhosted.org/packages/2d/00/d90b10b962b4277f5e64a78b6609968859ff86889f5b898c1a778c06ec00/lark-1.2.2-py3-none-any.whl",
    "https://files.pythonhosted.org/packages/c4/01/72d6472f80651673716d1deda2a5bbb633e563ecf94f4479da5519d69d25/interegular-0.3.3-py37-none-any.whl"
  ])
  return pyodide;
}

const API = {}

async function runPython(pyodide) {
  let namespace = pyodide.globals.get('dict')();
  await pyodide.runPythonAsync(py_script, { globals: namespace });
  namespace.get('__all__').forEach((name) => {
    API[name] = namespace.get(name);
  });
  namespace.destroy();
}

async function init() {
  self.pyodide = await loadPyodideAndPackages();
  await runPython(self.pyodide);
}
let initializationPromise = init();

async function run(cmd, data) {
  // make sure loading is done
  await initializationPromise;
  const kwargs = {}
  for (const [key, value] of Object.entries(data)) {
    kwargs[key] = self.pyodide.toPy(value);
  }
  const result_py = API[cmd].callKwargs(kwargs);
  const result_js = result_py.toJs({
    create_proxies: false,
    dict_converter: Object.fromEntries,
  });
  result_py.destroy();
  return result_js;
}

self.onmessage = async (event) => {
  const { id, cmd, ...data } = event.data;
  const result = await run(cmd, data);
  event.source.postMessage({ id, result });
};