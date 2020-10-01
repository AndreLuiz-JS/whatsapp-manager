import { Flex, Text } from "@chakra-ui/core";

export default function Loading() {
	return (
		<Flex
			height="100vh"
			width="100vw"
			justifyContent="center"
			alignItems="center">
			<Text fontSize="lg">Carregando...</Text>
		</Flex>
	);
}
