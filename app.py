from flask import Flask
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity

app = Flask(__name__)
table_service = TableService(account_name='covidcountstorage', account_key='NE7xyUWKIFiRnUowiB3VPwlT6O5bJn1qxhQtSnUvHtubqnd8MbOFdnMLY385DXAPkc32SkxwWf+Kx++D9mjykQ==')

@app.route('/')
def hello_world():
    return 'Hello world'
