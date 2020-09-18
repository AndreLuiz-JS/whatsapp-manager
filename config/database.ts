import { MongoClient, Db } from "mongodb";
import url from "url";

const uriDatabase = process.env.MONGODB_URL || "/";

if (uriDatabase === "/")
	throw new Error("necessário configurar a variável de ambiente MONGODB_URL");

let cachedDb: Db | null = null;

async function connectToDatabase() {
	if (cachedDb) return cachedDb;

	const client = await MongoClient.connect(uriDatabase, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const dbName = url.parse(uriDatabase).pathname?.substr(1);

	const db = client.db(dbName);

	cachedDb = db;

	return db;
}

export { connectToDatabase };
