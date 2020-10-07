import { MongoClient, Db } from "mongodb";
import url from "url";

const uriDatabase =
	(process.env.NODE_ENV == "production"
		? process.env.MONGODB_URL_PRODUCTION
		: process.env.MONGODB_URL_TEST) || "/";

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
