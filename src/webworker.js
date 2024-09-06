import py_script from './main.py';

importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(["pandas",
    "https://files.pythonhosted.org/packages/c2/cf/09d6b2691c08e0a046d3b95bf4a593a2e3bfe6d4514349726d9cd8447383/kye-0.1.2-py3-none-any.whl",
    "https://files.pythonhosted.org/packages/2d/00/d90b10b962b4277f5e64a78b6609968859ff86889f5b898c1a778c06ec00/lark-1.2.2-py3-none-any.whl",
    "https://files.pythonhosted.org/packages/c4/01/72d6472f80651673716d1deda2a5bbb633e563ecf94f4479da5519d69d25/interegular-0.3.3-py37-none-any.whl"
  ]);
  self.run = await self.pyodide.runPythonAsync(py_script);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;
  const { id, ...data } = event.data;
  const result = JSON.parse(self.run(JSON.stringify(data)));
  self.postMessage({ id, result });
};