import { NowRequest, NowResponse } from "@vercel/node";
import { connectToDatabase } from "../../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async (req: NowRequest, res: NowResponse) => {
	await cors(req, res);

	const { email, password } = req.body;
	if (!email || !password)
		return res.status(403).json({
			message:
				"Por favor, entre com seu email e senha cadastrado na plataforma",
		});

	const db = await connectToDatabase();

	const collection = db.collection("users");

	const user = await collection.findOne({ email });

	if (email === process.env.ADMIN_EMAIL && !user) {
		const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 5);
		const { ops } = await collection.insertOne({
			name: "Administrador",
			email,
			password: hash,
		});
		if (password !== process.env.ADMIN_PASSWORD)
			return res.status(403).json({ message: "Senha incorreta" });

		const id = ops[0]["_id"];
		const token = jwt.sign({ id }, process.env.TOKEN_SECRET as string);

		return res.json({ token });
	}

	if (!user) return res.status(403).json({ message: "Email não cadastrado" });

	if (!(await bcrypt.compare(password, user.password)))
		return res.status(403).json({ message: "Senha incorreta" });

	const id = user["_id"];
	const token = jwt.sign({ id }, process.env.TOKEN_SECRET as string);
	return res.json({ token });
};
