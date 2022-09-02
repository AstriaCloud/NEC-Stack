
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const client = new MongoClient('mongodb+srv://##########.mongodb.net/#########?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: './middleware/database/key.pem',
  sslCert: './middleware/database/cert.pem',
  serverApi: ServerApiVersion.v1
});

// QueryData(database.client, "Main", "statistics", { name: "user-count" })
async function QueryData(Client,DatabaseName,Collection,Query) {
  try {
    await Client.connect();
    const database = await Client.db(`${DatabaseName}`);
    col = await database.collection(`${Collection}`)
    const data = await col.findOne(Query);
    if(!data || data == null){await Client.close();return false}else{await Client.close();return data}
  } catch(error) {
    await Client.close()
    return null
  }
}

exports.QueryData = QueryData;
exports.client = client;

