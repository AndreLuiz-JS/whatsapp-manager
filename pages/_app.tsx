import Router from "next/router";
import axios from "axios";
import ThemeContainer from "../contexts/theme/ThemeContainer";
import { Flex, Text } from "@chakra-ui/core";
import { useState, useEffect, createContext } from "react";

interface IUser {
	token: string;
	name: string;
}
export const UserContext = createContext({} as IUser);

function MyApp({ Component, pageProps }) {
	const [loading, setLoading] = useState(true);
	const [userInfo, setUserInfo] = useState({} as IUser);
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
						setUserInfo({ token, name: data.userName });
						await Router.push("/admin");
					}
				} else {
					await Router.push("/");
				}
			} catch (err) {
				localStorage.removeItem("token");
				await Router.push("/");
			} finally {
				setLoading(false);
			}
		}
	}, []);

	if (loading)
		return (
			<ThemeContainer>
				<Flex
					height="100vh"
					width="100vw"
					justifyContent="center"
					alignItems="center">
					<Text fontSize="lg">Carregando...</Text>
				</Flex>
			</ThemeContainer>
		);

	return (
		<UserContext.Provider value={userInfo}>
			<ThemeContainer>
				<Component {...pageProps} />
			</ThemeContainer>
		</UserContext.Provider>
	);
}

export default MyApp;
