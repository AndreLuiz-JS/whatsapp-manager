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
import NewUser from "../components/NewUser";
import NewProject from "../components/NewProject";

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
					<Tab>Novo Projeto</Tab>
					<Tab>Novo usuário</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<NewProject />
					</TabPanel>
					<TabPanel>
						<NewUser />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};
export default Admin;
