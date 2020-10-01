import { NowRequest, NowResponse } from "@vercel/node";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
import { connectToDatabase } from "../../../config/database";
import { ILink } from "../projects";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async (req: NowRequest, res: NowResponse) => {
	await cors(req, res);
	if (req.method == "GET") {
		/* Verificação da validade do slug */
		const slug = req.query.slug.toString();
		const db = await connectToDatabase();
		const projectsCollection = db.collection("projects");
		const project = await projectsCollection.findOne({ slug });

		/*link aleatório por Projeto*/
		if (project) {
			const links: ILink[] = project?.links.filter(
				(link) => link.active == true
			);

			if (!links || links.length == 0)
				return res.json({ message: "Nenhum link ativo neste projeto." });
			const iRandom = Math.floor(Math.random() * links.length);
			return res.json(links[iRandom]);
		}

		return res
			.status(404)
			.json({ message: `Nenhum projeto encontrado com o slug "${slug}".` });
	} else {
		return res
			.status(400)
			.json({ message: "Esta rota só aceita requisições GET" });
	}
};
