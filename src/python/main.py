import pandas as pd
from kye.kye import Kye
import json
import dataclasses

print('ready')

def run(raw_input):
    input = json.loads(raw_input)
    print('running',input)
    code = input['code']
    model_name = input['model_name']
    data = input['data']
    kye = Kye()
    if kye.compile(code):
        kye.load_df(model_name, pd.DataFrame(data))
    
    return json.dumps([
      dataclasses.asdict(err)
      for err in kye.reporter.errors
    ])

# return the function to be called by javascript
run