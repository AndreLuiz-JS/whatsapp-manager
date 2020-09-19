import Head from "next/head";
import Router from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Flex, Text } from "@chakra-ui/core";
import Input from "../components/Input";
import Divider from "../components/Divider";

export default function Home() {
	const [statusMessage, setStatusMessage] = useState(
		"Faça seu login na plataforma"
	);
	const [statusMessageColor, setStatusMessageColor] = useState("white");
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		verifyToken();
		async function verifyToken() {
			try {
				const token = localStorage.getItem("token");
				if (token) {
					const { data } = await axios.post("/api/validate_token", null, {
						headers: { Authorization: token },
					});
					if (data.pass) {
						Router.push("/admin");
					}
				}
			} catch (err) {
			} finally {
				setLoading(false);
			}
		}
	}, []);
	async function handleSubmitForm(event) {
		event.preventDefault();
		const form = event.target;
		const email = form.querySelector("input[type=email]").value;
		const password = form.querySelector("input[type=password]").value;
		try {
			const { token } = (
				await axios.post("/api/login", { email, password })
			).data;
			if (token) {
				localStorage.setItem("token", token);
				Router.push("/admin");
			}
		} catch (err) {
			setStatusMessage(err.response.data.message);
			setStatusMessageColor("red.400");
		}
	}

	if (loading)
		return (
			<Flex
				height="100vh"
				width="100vw"
				justifyContent="center"
				alignItems="center">
				<Text fontSize="lg">Carregando...</Text>
			</Flex>
		);

	return (
		<div>
			<Head>
				<title>Gerenciador de Grupos do Whatsapp</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Grid
					as="main"
					height="100vh"
					templateColumns="1fr 480px 480px 1fr"
					templateRows="1fr 480px 1fr"
					templateAreas="
        '. . . .'
        '. form form .'
        '. . . .'
      "
					justifyContent="center"
					alignItems="center">
					<Flex
						as="form"
						gridArea="form"
						height="100%"
						borderRadius="md"
						flexDir="column"
						alignItems="stretch"
						padding={16}
						onSubmit={handleSubmitForm}>
						<Input type="email" placeholder="E-mail" />

						<Input
							type="password"
							placeholder="Senha"
							marginTop={2}
							isRequired
						/>

						<Input
							type="submit"
							backgroundColor="blue.500"
							height="50px"
							borderRadius="sm"
							marginTop={6}
							_hover={{ backgroundColor: "blue.600" }}
							value="ENTRAR"
							isRequired
						/>

						<Divider />

						<Flex justifyContent="center">
							<Text
								textAlign="center"
								width="100%"
								verticalAlign="center"
								fontSize="3xl"
								color={statusMessageColor}>
								{statusMessage}
							</Text>
						</Flex>
					</Flex>
				</Grid>
			</main>
		</div>
	);
}
