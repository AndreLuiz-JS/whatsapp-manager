import { InputGroup, InputLeftAddon, Input, Grid, Text } from "@chakra-ui/core";

export interface IProjectFields {
	name?: string;
	description?: string;
	trackerGoogleAnalytics?: string;
	trackerGoogleAds?: string;
	trackerFacebook?: string;
}

export default function ProjectFields({
	name,
	description,
	trackerGoogleAnalytics,
	trackerGoogleAds,
	trackerFacebook,
}: IProjectFields) {
	return (
		<>
			<InputGroup>
				<InputLeftAddon children="Nome" />
				<Input
					placeholder="digite um nome para o novo projeto"
					name="name"
					value={name}
					isRequired
				/>
			</InputGroup>
			<InputGroup>
				<InputLeftAddon children="Descrição" />
				<Input
					placeholder="uma breve descrição"
					name="description"
					value={description}
					isRequired
				/>
			</InputGroup>
			<Grid gap="8px 0">
				<Text>Trackers</Text>
				<InputGroup>
					<InputLeftAddon children="Google Analytics" />
					<Input
						placeholder="id do Google Analytics tracker"
						name="trackerGoogleAnalytics"
						value={trackerGoogleAnalytics}
						isRequired
					/>
				</InputGroup>
				<InputGroup>
					<InputLeftAddon children="Google Ads" />
					<Input
						placeholder="id do Google Ads tracker"
						name="trackerGoogleAds"
						value={trackerGoogleAds}
						isRequired
					/>
				</InputGroup>
				<InputGroup>
					<InputLeftAddon children="Facebook (pixel)" />
					<Input
						placeholder="id do Facebook tracker"
						name="trackerFacebook"
						value={trackerFacebook}
						isRequired
					/>
				</InputGroup>
			</Grid>
		</>
	);
}
