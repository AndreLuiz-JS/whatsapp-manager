import { NowRequest, NowResponse } from "@vercel/node";
import { connectToDatabase } from "../../config/database";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import Cors from "cors";
import bcrypt from "bcrypt";
import initMiddleware from "../../lib/init-middleware";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

interface IUser {
	_id: ObjectId;
	name: string;
	email: string;
	password: string;
}

export default async (req: NowRequest, res: NowResponse) => {
	await cors(req, res);

	const token = req.headers.authorization;
	if (!token)
		return res
			.status(403)
			.json({ message: "Token não informada no cabeçalho" });
	try {
		const { id }: any = await jwt.verify(
			token,
			process.env.TOKEN_SECRET as string
		);
		const _id = new ObjectId(id);
		const db = await connectToDatabase();
		const collection = db.collection("users");
		const user: IUser | null = await collection.findOne(
			{ _id },
			{ projection: { name: true } }
		);
		if (!user) return res.status(403).json({ message: "Token inválida" });

		if (req.method == "GET") {
			const users = [] as Array<IUser>;
			await collection
				.find({}, { projection: { password: false } })
				.forEach((user: IUser) => {
					const serializedUser = { id: user._id.toHexString(), ...user };
					delete serializedUser["_id"];
					users.push(serializedUser);
				});

			return res.json(users);
		}

		if (req.method == "POST") {
			const { name, email, password } = req.body;
			const hash = await bcrypt.hash(password, 5);
			const { ops } = await collection.insertOne({
				name,
				email,
				password: hash,
			});
			const id = ops[0]["_id"];
			const token = jwt.sign({ id }, process.env.TOKEN_SECRET as string);
			return res.json({ token });
		}
	} catch (err) {
		return res.status(400).json({ err });
	}
};
