import Head from "next/head";
import {
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Tab,
	Flex,
	Link,
} from "@chakra-ui/core";
import { useContext } from "react";
import { UserContext } from "./_app";
import Router from "next/router";
import Users from "../components/Users";
import Projects from "../components/Projects";

const Admin = () => {
	const { token, name } = useContext(UserContext);
	return (
		<>
			<Head>
				<title>Gerenciador de Grupos do Whatsapp</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Tabs
				variant="enclosed"
				maxWidth="1280px"
				margin="10px auto"
				position="relative">
				<Flex position="absolute" right="0" top="10px">
					{name} (
					<Link
						href="#"
						onClick={() => {
							localStorage.removeItem("token");
							Router.push("/");
						}}>
						sair
					</Link>
					)
				</Flex>
				<TabList>
					<Tab>Projetos</Tab>
					<Tab>Criar novo usuário</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Projects />
					</TabPanel>
					<TabPanel>
						<Users />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};
export default Admin;
