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
collectionname = 'author'
# document = {

  
#             "id": 1,
#             "userId": 1,
#             "name": "Datamind",
#             "description": "Let’s learn"
#           }
documentlist = [
          {
            "id": 1,
            "username": "Dan C.",
            "passwordHash": "$2b$10$3hjkzdg2VjtwsIDcWQludebM.jUfq6vSicB4vwna78JW3UqtwSi06",
            "avatarUrl": "https://cdn-images-1.medium.com/fit/c/120/120/1*9ZtET_L1852yXaDZJUo9CQ.png",
            "bio": "<3 Linh"
          }
        ]


db = client[dbname]
collection = db[collectionname]
# x = collection.insert_one(document) # x will hold the id of the inserted document
y = collection.insert_many(documentlist) # y.inserted_ids = list of _id values
print("Documents Inserted")
