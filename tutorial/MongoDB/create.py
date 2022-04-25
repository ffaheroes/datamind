from pymongo import MongoClient

# Connecting to the Server
client = MongoClient("mongodb+srv://ffaheroes:Vanaskew1@cluster0-jr6sc.mongodb.net")
# Listing All Databases
dblist = client.list_database_names()
print('current databases : ',dblist)
# Creating a DB, handling if exists
# An important note: neither the database nor the collection are created until you attempt to write a document. 
# That's adequate for most applications, but it's good to know.

dbname = 'datamind'
collectionname = 'blog'
document = {
            "id": 1,
            "userId": 1,
            "name": "Datamind",
            "description": "Let’s learn"
          }
documentlist = [
          {
            "id": 2,
            "userId": 2,
            "name": "Dan",
            "description": "My Personal Blog"
          },
          {
            "id": 3,
            "userId": 3,
            "name": "Linh",
            "description": "My Personal Blog"
          }
        ]

if dbname in dblist:
    print("The database exists.")
else :
    db = client[dbname]
    collection = db[collectionname]
    x = collection.insert_one(document) # x will hold the id of the inserted document
    y = collection.insert_many(documentlist) # y.inserted_ids = list of _id values
    print("Documents Inserted")
