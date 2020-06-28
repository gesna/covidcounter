from flask import Flask, request
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity
from datetime import datetime

app = Flask(__name__)
table_service = TableService(account_name='covidcountstorage', account_key='NE7xyUWKIFiRnUowiB3VPwlT6O5bJn1qxhQtSnUvHtubqnd8MbOFdnMLY385DXAPkc32SkxwWf+Kx++D9mjykQ==')

@app.route('/')
def homepage():
    return "Welcome to the COVID Capacity Counter!"

# parameters: storename (required)
# sample usage:
# /createStore?storename=Walmart
# /createStore?storename=CVS
# /createStore?storename=Chilis
@app.route('/createStore')
def createStore():
    storename = request.args['storename']
    if table_service.create_table(storename):
        return 'Successfully created new table for {}'.format(storename)
    else:
        return 'Failed to create new table for {}'.format(storename)

# parameters: storename (required)     
# sample usage:
# /removeStore?storename=Walmart
# /removeStore?storename=CVS
# /removeStore?storename=Chilis   
@app.route('/removeStore')
def removeStore():
    storename = request.args['storename']
    if table_service.delete_table(storename):
        return 'Successfully deleted table for {}'.format(storename)
    else:
        return 'Failed to delete table for {}'.format(storename)

# parameters: storename (required), address(required), maxcapacity(optional, required if first entry for this address),
# action (inc,dec) (required), value (required), zipcode (optional, required if first entry for this address),
# ip (optional, required if first entry for this address)
# sample usage:
# /addEntry?storename=Walmart&address=503SesameStNoviMI&maxcapacity=101&action=inc&value=4&zipcode=48375&ip=192168012
# /addEntry?storename=Walmart&address=503SesameStNoviMI&action=dec&value=2
# /addEntry?storename=Walmart&address=420MicrosoftBlvdRedmondWA&maxcapacity=467&action=inc&value=26&zipcode=98008&ip=192168014
@app.route('/addEntry')
def addEntry():
    StoreName = request.args['storename']
    Address = request.args['address']
    MaxCapacity = request.args.get('maxcapacity') #optional if not first time
    Action = request.args['action']
    Value = request.args['value']
    ZipCode = request.args.get('zipcode') #optional if not first time
    IP = request.args.get('ip') #optional if not first time
    DateTime = str(datetime.utcnow().timestamp())
    if add_entity(StoreName, Address, MaxCapacity, Action, Value, ZipCode, IP, DateTime):
        return 'Successfully added entry'
    return 'Bad request. Failed to add entry'

# parameters: storename (required), address(required)
# sample usage:
# /getCurrentOccupancy?storename=Walmart&address=503SesameStNoviMI
# /getCurrentOccupancy?storename=Walmart&address=420MicrosoftBlvdRedmondWA
@app.route('/getCurrentOccupancy')
def getCurrentOccupancy():
    StoreName = request.args['storename']
    Address = request.args['address']
    entity = get_most_recent_entity(StoreName, Address)
    if entity is None:
        return '<h1>No data available for {} at {}.<h1>'.format(StoreName, Address)
    else:
        return '''<h1>The current occupancy of {} at {} is {} people.<h1>
                  <h1>The maximum capacity is {} people.<h1>'''.format(StoreName, Address, entity.CurrentOccupancy, entity.MaxCapacity)


# add a row to the table for the given store
# returns True on success, returns False or throws exception on failure
def add_entity(StoreName, Address, MaxCapacity, Action, Value, ZipCode, IP, DateTime):
    #instantiate new entity
    row = Entity()
    row.PartitionKey = Address #store location serves as the partition key
    row.RowKey = DateTime #timestamp serves as the row key
    previous = get_most_recent_entity(StoreName, Address)
    #if this is the first entity we are adding
    if previous is None:
        if MaxCapacity == None or ZipCode == None or IP == None:
            return False
        row.MaxCapacity = MaxCapacity
        row.ZipCode = ZipCode
        row.IP = IP
        if Action == 'inc':
            row.CurrentOccupancy = Value
        elif Action == 'dec':
            row.CurrentOccupancy = str(int(Value) * -1)
        else:
            return False
    # otherwise use previous entity to get previous CurrentOccupancy and other parameters if necessary
    else:
        if MaxCapacity == None:
            row.MaxCapacity = previous.MaxCapacity
        else:
            row.MaxCapacity = MaxCapacity
        if ZipCode == None:
            row.ZipCode = previous.ZipCode
        else:
            row.ZipCode = ZipCode
        if IP == None:
            row.IP = previous.IP
        else:
            row.IP = IP
        if Action == 'inc':
            row.CurrentOccupancy = str(int(previous.CurrentOccupancy) + int(Value))
        elif Action == 'dec':
            row.CurrentOccupancy = str(int(previous.CurrentOccupancy) - int(Value))
        else:
            return False
    #insert entity into table for the given StoreName
    table_service.insert_entity(StoreName, row)
    return True

# retrieve the most recent entity for the given store location
# returns Entity() on success, returns None or throws exception on failure
def get_most_recent_entity(StoreName, Address):
    listEntities = table_service.query_entities(StoreName, accept = 'application/json')
    previousEntity = None
    mostrecent = 0.000
    for entity in listEntities:
        timestamp = float(entity.RowKey)
        if entity.PartitionKey == Address and timestamp > mostrecent:
            mostrecent = timestamp
            previousEntity = entity
    return previousEntity