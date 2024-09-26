import pandas as pd
from kye.kye import Kye
from kye.compiled import Compiled
import json
import dataclasses

print('ready')

__all__ = ['compile', 'validate']

def compile(code):
    kye = Kye()
    if kye.compile(code):
      return {
        'compiled': kye.compiled.to_dict(),
      }
    else:
      return {
        'errors': [
          dataclasses.asdict(err)
          for err in kye.reporter.errors
        ]
      }

def validate(compiled, data, model_name):
    kye = Kye()
    kye.load_compiled(Compiled.from_dict(compiled))
    kye.load_df(model_name, pd.DataFrame(data))
    return {
      'errors': [
        dataclasses.asdict(err)
        for err in kye.reporter.errors
      ]
    }