import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/core";
import axios from "axios";
import Loading from "../../components/Loading";

export default function RandomLink() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const { slug } = router.query;
	useEffect(() => {
		getLinkAndRedirect();
		async function getLinkAndRedirect() {
			try {
				setLoading(true);
				setMessage("");
				if (slug) {
					const { data } = await axios.get(`/api/links/${slug}`);
					console.log(data);
					if (data.link) {
						const link = data.link;
						router.push(link);
					}
					if (data.message) {
						setMessage(data.message);
						setLoading(false);
					}
				}
			} catch (error) {
				if (error.response.data.message) {
					setMessage(error.response.data.message);
				} else {
					setMessage("Erro na solicitação do link");
				}
				setLoading(false);
			}
		}
	}, [slug]);
	if (loading) return <Loading />;
	return (
		<Flex
			height="100vh"
			width="100vw"
			justifyContent="center"
			alignItems="center">
			<Text fontSize="lg">{message}</Text>
		</Flex>
	);
}
