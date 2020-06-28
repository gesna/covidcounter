from flask import Flask
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity

app = Flask(__name__)
table_service = TableService(account_name='covidcountstorage', account_key='NE7xyUWKIFiRnUowiB3VPwlT6O5bJn1qxhQtSnUvHtubqnd8MbOFdnMLY385DXAPkc32SkxwWf+Kx++D9mjykQ==')

@app.route('/')
def hello_world():
    return 'Hello world'

#add a row to the table 
def add_entity(StoreName, ID, ZipCode, MaxCapacity, Address, CurrentOccupancy, DateTime, IP):
    row = Entity()
    row.PartitionKey = StoreName
    row.RowKey = ID
    row.ZipCode = ZipCode
    row.MaxCapacity = MaxCapacity
    row.Address = Address
    row.CurrentOccupancy = CurrentOccupancy
    row.DateTime = DateTime
    row.IP = IP 
    table_service.insert_entity('StoreOccupancy', row)

def get_entity(StoreName, ID):
    return table_service.get_entity('StoreOccupancy', StoreName, ID)