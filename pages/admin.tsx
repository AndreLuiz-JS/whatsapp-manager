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
import {
	useContext,
	createContext,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import { UserContext } from "./_app";
import Router from "next/router";
import NewUser from "../components/NewUser";
import NewProject from "../components/NewProject";
import Links from "../components/Links";

export const RefreshProjects = createContext({
	refreshProjectsContext: true,
	setRefreshProjectsContext: (S: boolean) => {},
});

const Admin = () => {
	const { token, name } = useContext(UserContext);
	const [refreshProjectsContext, setRefreshProjectsContext] = useState(true);
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
					<Tab>Links</Tab>
					<Tab>Novo Projeto</Tab>
					<Tab>Novo usuário</Tab>
				</TabList>
				<RefreshProjects.Provider
					value={{ refreshProjectsContext, setRefreshProjectsContext }}>
					<TabPanels>
						<TabPanel>
							<Links />
						</TabPanel>
						<TabPanel>
							<NewProject />
						</TabPanel>
						<TabPanel>
							<NewUser />
						</TabPanel>
					</TabPanels>
				</RefreshProjects.Provider>
			</Tabs>
		</>
	);
};
export default Admin;
