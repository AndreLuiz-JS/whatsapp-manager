import { NowRequest, NowResponse } from "@vercel/node";
import { connectToDatabase } from "../../config/database";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";

const cors = initMiddleware(
	Cors({
		methods: ["POST", "GET"],
	})
);
export interface ILink {
	_id: ObjectId;
	name: string;
	link: string;
	active: boolean;
	numLeads: number;
}

export interface IProject {
	_id: ObjectId;
	name: string;
	description: string;
	slug: string;
	trackerGoogleAnalytics?: string;
	trackerGoogleAds?: string;
	trackerFacebook?: string;
	links: ILink[];
}

function stringToSlug(str: string) {
	str = str.replace(/^\s+|\s+$/g, ""); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	var to = "aaaaeeeeiiiioooouuuunc------";
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
		.replace(/\s+/g, "-") // collapse whitespace and replace by -
		.replace(/-+/g, "-"); // collapse dashes

	return str;
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
		const usersCollection = db.collection("users");
		const user = await usersCollection.findOne(
			{ _id },
			{ projection: { name: true } }
		);
		if (!user) return res.status(403).json({ message: "Token inválida" });

		const projectsCollection = db.collection("projects");
		if (req.method == "GET") {
			if (req.body.id) {
				if (!ObjectId.isValid(req.body.id))
					return res.status(400).json({
						message:
							"O id precisa ser uma número hexadecimal com 24 caracteres.",
					});
				const project = await projectsCollection.findOne({
					_id: new ObjectId(req.body.id),
				});
				return res.json(project);
			}
			const projects = [] as Array<IProject>;
			await projectsCollection.find().forEach((project: IProject) => {
				const id = project._id.toHexString();
				const serializedProject = { id, ...project };
				delete serializedProject["_id"];
				projects.push(serializedProject);
			});

			return res.json(projects);
		}

		if (req.method == "POST") {
			const {
				name,
				description,
				links,
				trackerGoogleAnalytics,
				trackerGoogleAds,
				trackerFacebook,
			} = req.body;
			console.log(req.body);
			const slug = stringToSlug(name);
			const { ops } = await projectsCollection.insertOne({
				name,
				description,
				slug,
				trackerGoogleAnalytics,
				trackerGoogleAds,
				trackerFacebook,
				links: links || [],
			});
			const id = ops[0]._id.toHexString();
			return res.json({ id, slug });
		}
	} catch (err) {
		return res.status(400).json(err);
	}
};
