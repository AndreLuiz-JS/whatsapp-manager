import { Grid, InputGroup, Input, InputLeftAddon, Text } from "@chakra-ui/core";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../pages/_app";
import { RefreshProjects } from "../pages/admin";
const Projects: React.FC = () => {
	const [message, setMessage] = useState("");
	const { token } = useContext(UserContext);
	const [refreshProjects, setRefreshProjects] = useContext(RefreshProjects);
	const [messagesArray, setMessagesArray] = useState([] as string[]);

	async function handleSubmitForm(event) {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;
		const description = form.description.value;
		try {
			const { data } = await axios.post(
				"/api/projects",
				{ name, description, links: [] },
				{ headers: { Authorization: token } }
			);
			if (data.id) {
				setMessage(
					`Projeto ${name} (${description}) criado com sucesso.\nID do projeto: ${data.id}\nSlug do projeto: ${data.slug}`
				);
				setRefreshProjects(!refreshProjects);
			}
		} catch (error) {
			if (error.response.data.code == 11000) {
				setMessage(
					`Projeto com o nome ${name} já está cadastrado, utilize outro nome de projeto`
				);
				form.name.value = "";
			} else {
				setMessage(
					"Não foi possível criar o usuário no momento, tente novamente em alguns instantes."
				);
			}
		}
	}

	useEffect(() => {
		setMessagesArray(message.split("\n"));
	}, [message]);

	return (
		<Grid
			as="form"
			margin="64px auto"
			gap="16px"
			maxWidth="480px"
			onSubmit={handleSubmitForm}>
			<InputGroup>
				<InputLeftAddon children="Nome" />
				<Input
					placeholder="digite um nome para o novo projeto"
					name="name"
					isRequired
				/>
			</InputGroup>
			<InputGroup>
				<InputLeftAddon children="Descrição" />
				<Input
					placeholder="uma breve descrição"
					name="description"
					isRequired
				/>
			</InputGroup>
			<Input
				type="submit"
				backgroundColor="blue.500"
				_hover={{ backgroundColor: "blue.600" }}
				value="CADASTRAR"
				maxWidth="50%"
				margin="0 auto"
			/>
			{messagesArray.map((message, i) => (
				<Text textAlign="center" key={i}>
					{message}
				</Text>
			))}
		</Grid>
	);
};

export default Projects;
