import { InputGroup, InputLeftAddon, Input, Grid, Text } from "@chakra-ui/core";
import { useEffect, useState } from "react";

export interface IProjectFields {
	name?: string;
	description?: string;
	trackerGoogleAnalytics?: string;
	trackerGoogleAds?: string;
	trackerFacebook?: string;
	update?: Function;
}

export default function ProjectFields({
	name,
	description,
	trackerGoogleAnalytics,
	trackerGoogleAds,
	trackerFacebook,
	update,
}: IProjectFields) {
	const [projectValues, setProjectValues] = useState({
		name,
		description,
		trackerFacebook,
		trackerGoogleAds,
		trackerGoogleAnalytics,
	} as IProjectFields);

	useEffect(() => {
		setProjectValues({
			name: name || "",
			description: description || "",
			trackerFacebook: trackerFacebook || "",
			trackerGoogleAds: trackerGoogleAds || "",
			trackerGoogleAnalytics: trackerGoogleAnalytics || "",
		});
	}, [
		name,
		description,
		trackerFacebook,
		trackerGoogleAds,
		trackerGoogleAnalytics,
	]);

	useEffect(() => {
		if (update) update(projectValues);
	}, [projectValues]);

	return (
		<>
			<InputGroup>
				<InputLeftAddon children="Nome" />
				<Input
					placeholder="digite um nome para o novo projeto"
					name="name"
					value={projectValues.name}
					onChange={(event) => {
						setProjectValues({ ...projectValues, name: event.target.value });
					}}
					isRequired
				/>
			</InputGroup>
			<InputGroup>
				<InputLeftAddon children="Descrição" />
				<Input
					placeholder="uma breve descrição"
					name="description"
					value={projectValues.description}
					onChange={(event) => {
						setProjectValues({
							...projectValues,
							description: event.target.value,
						});
					}}
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
						value={projectValues.trackerGoogleAnalytics}
						onChange={(event) => {
							setProjectValues({
								...projectValues,
								trackerGoogleAnalytics: event.target.value,
							});
						}}
					/>
				</InputGroup>
				<InputGroup>
					<InputLeftAddon children="Google Ads" />
					<Input
						placeholder="id do Google Ads tracker"
						name="trackerGoogleAds"
						value={projectValues.trackerGoogleAds}
						onChange={(event) => {
							setProjectValues({
								...projectValues,
								trackerGoogleAds: event.target.value,
							});
						}}
					/>
				</InputGroup>
				<InputGroup>
					<InputLeftAddon children="Facebook (pixel)" />
					<Input
						placeholder="id do Facebook tracker"
						name="trackerFacebook"
						value={projectValues.trackerFacebook}
						onChange={(event) => {
							setProjectValues({
								...projectValues,
								trackerFacebook: event.target.value,
							});
						}}
					/>
				</InputGroup>
			</Grid>
		</>
	);
}
