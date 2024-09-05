import pandas as pd
from pyscript import when, window
from kye.kye import Kye

print('ready')

@when('', 'body')
def on_click(event):
    kye = Kye()
    if kye.compile(window.code):
        data = window.DATA[0]
        df = pd.DataFrame(data.rows, columns=data.columns)
        kye.load_df(data.name, df)
    
    if not kye.reporter.had_error:
        print('no errors')
    else:
        kye.reporter.report()