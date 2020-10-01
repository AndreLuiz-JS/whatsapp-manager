import { Grid, Input, Text } from "@chakra-ui/core";
import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../pages/admin";
const Users: React.FC = () => {
	const [message, setMessage] = useState("");
	const { token } = useContext(UserContext);
	async function handleSubmitUserForm(event) {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;
		const email = form.email.value;
		const password = form.password.value;
		try {
			const { data } = await axios.post(
				"/api/users",
				{ name, email, password },
				{ headers: { Authorization: token } }
			);
			if (data.token)
				setMessage(`Usuário ${name} (${email}) criado com sucesso.`);
		} catch (error) {
			if (error.response.data.code == 11000) {
				setMessage(`Email ${email} já está cadastrado como usuário`);
				form.reset();
			} else {
				setMessage(
					"Não foi possível criar o usuário no momento, tente novamente em alguns instantes."
				);
			}
		}
	}
	return (
		<Grid
			as="form"
			margin="64px auto"
			gap="16px"
			maxWidth="480px"
			onSubmit={handleSubmitUserForm}>
			<Input placeholder="Nome" name="name" isRequired />
			<Input placeholder="E-mail" type="email" name="email" isRequired />
			<Input placeholder="Senha" type="password" name="password" isRequired />
			<Input
				type="submit"
				backgroundColor="blue.500"
				_hover={{ backgroundColor: "blue.600" }}
				value="CADASTRAR"
				maxWidth="50%"
				margin="0 auto"
			/>

			<Text textAlign="center" marginTop="16px">
				{message}
			</Text>
		</Grid>
	);
};

export default Users;
