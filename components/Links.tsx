import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionIcon,
	Box,
	Grid,
	InputGroup,
	Input,
	Button,
	InputLeftAddon,
	Text,
	Select,
	Checkbox,
} from "@chakra-ui/core";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../pages/_app";
import { RefreshProjects } from "../pages/admin";
import { IProject } from "./NewProject";

export interface ILink {
	_id: string;
	name: string;
	link: string;
	active: boolean;
	numLeads: number | string;
}

const Links: React.FC = () => {
	const [message, setMessage] = useState("");
	const { token } = useContext(UserContext);
	const [messagesArray, setMessagesArray] = useState([] as string[]);
	const [projects, setProjects] = useState([{}] as IProject[]);
	const [selectedProject, setSelectedProject] = useState({
		links: [{ _id: "", name: "", link: "", active: false, numLeads: 0 }],
	} as IProject);
	const [selectedLink, setSelectedLink] = useState({} as ILink);
	const [readOnlyForm, setReadOnlyForm] = useState(true);
	const headers = { headers: { Authorization: token } };
	const { refreshProjectsContext, setRefreshProjectsContext } = useContext(
		RefreshProjects
	);

	async function refreshProjects() {
		try {
			const { data } = await axios.get("/api/projects", headers);
			setProjects(data);
			if (!selectedProject.id) {
				setSelectedProject(data[0]);
				const hasLinks = Boolean(data[0].links[0]);
				setReadOnlyForm(!hasLinks);
			}
			const projectToSelect = data.find(
				(project) => selectedProject.id == project.id
			);
			if (projectToSelect) {
				setSelectedProject(projectToSelect);
			}
			unselectLink();
		} catch (error) {
			console.log(error);
		}
	}

	async function handleSubmitNewLink(event) {
		event.preventDefault();
		const form = event.target;
		const projectID = form.projectID.value;
		const name = form.name.value;
		const link = form.link.value;
		const numLeads = form.numLeads.value;
		const active = form.active.checked;
		const formData = { projectID, name, link, numLeads, active };
		try {
			const { data } = await axios.post("/api/links", formData, headers);
			if (data.id)
				setMessage(
					`Link ${name} (${link}) criado com sucesso.\nID do link: ${data.id}`
				);
			setRefreshProjectsContext(!refreshProjectsContext);
			form.name.value = "";
			form.link.value = "";
			form.numLeads.value = "";
			form.active.checked = true;
		} catch (error) {
			setMessage(
				error.response.data.message || "Não foi possível criar um novo link"
			);
		}
	}
	async function handleChangeLink(event) {
		event.preventDefault();
		const form = event.target;
		const projectID = form.projectID.value;
		const id = form.id.value;
		const name = form.name.value;
		const link = form.link.value;
		const numLeads = form.numLeads.value;
		const active = form.active.checked;
		const formData = { projectID, id, name, link, numLeads, active };
		try {
			const { data } = await axios.patch("/api/links", formData, headers);
			if (data.updated) {
				setMessage(`Link ${name} (${link}) alterado com sucesso.`);
				setRefreshProjectsContext(!refreshProjectsContext);
				unselectLink();
			} else {
				setMessage("Link não atualizado.");
			}
		} catch (error) {
			setMessage(
				error.response.data.message ||
					"Não foi possível atualizar o link no momento, tente novamente em alguns instantes."
			);
		}
	}

	async function handleDeleteLink() {
		if (
			selectedLink._id !== "" &&
			window.confirm(
				`Deseja realmente apagar o link ${selectedLink.name}(${selectedLink.link})`
			)
		)
			try {
				const { data } = await axios.delete(
					`/api/links?id=${selectedLink._id}`,
					headers
				);
				if (data.updated) {
					setMessage(
						`Link ${selectedLink.name} (${selectedLink.link}) apagado com sucesso.`
					);
					setRefreshProjectsContext(!refreshProjectsContext);
					unselectLink();
				} else {
					setMessage("Link não atualizado.");
				}
			} catch (error) {
				setMessage(
					error.response.data.message ||
						"Não foi possível atualizar o link no momento, tente novamente em alguns instantes."
				);
			}
	}

	function unselectLink() {
		const linkSelect = document.querySelector(
			"#selectLinkId"
		) as HTMLSelectElement;
		linkSelect.selectedIndex = 0;
		setSelectedLink({
			_id: "",
			name: "",
			link: "",
			active: false,
			numLeads: "",
		});
	}

	useEffect(() => {
		refreshProjects();
	}, [refreshProjectsContext]);

	useEffect(() => {
		setMessagesArray(message.split("\n"));
	}, [message]);

	return (
		<Accordion>
			<AccordionItem>
				<AccordionHeader>
					<Box flex="1" textAlign="left">
						Novo Link
					</Box>
					<AccordionIcon />
				</AccordionHeader>
				<AccordionPanel pb={0}>
					<Grid
						as="form"
						margin="64px auto"
						gap="16px"
						maxWidth=""
						onSubmit={handleSubmitNewLink}
						id="createLinkForm">
						<InputGroup>
							<InputLeftAddon children="Projeto" />
							<Select
								variant="filled"
								color="gray.600"
								name="projectID"
								isRequired>
								{projects.map((project, i) => (
									<option value={project.id} key={i}>
										{project.name}
									</option>
								))}
							</Select>
						</InputGroup>
						<InputGroup>
							<InputLeftAddon children="Nome" />
							<Input
								placeholder="digite um nome para o novo link"
								name="name"
								isRequired
							/>
						</InputGroup>
						<InputGroup>
							<InputLeftAddon children="URL" />
							<Input
								placeholder="link do grupo de whatsapp"
								name="link"
								type="url"
								isRequired
							/>
						</InputGroup>
						<InputGroup>
							<InputLeftAddon children="Leads" />
							<Input
								placeholder="número de leads entre 0 e 257"
								name="numLeads"
								type="number"
								isRequired
							/>
						</InputGroup>
						<Checkbox name="active" defaultIsChecked>
							Ativo
						</Checkbox>
						<Input
							type="submit"
							backgroundColor="blue.500"
							_hover={{ backgroundColor: "blue.600" }}
							value="CADASTRAR"
							maxWidth="50%"
							margin="0 auto"
						/>
					</Grid>
				</AccordionPanel>
			</AccordionItem>

			<AccordionItem>
				<AccordionHeader>
					<Box flex="1" textAlign="left">
						Alterar Link
					</Box>
					<AccordionIcon />
				</AccordionHeader>
				<AccordionPanel pb={10}>
					<Grid
						as="form"
						margin="64px auto"
						gap="16px"
						maxWidth=""
						onSubmit={handleChangeLink}
						id="updateLinkForm">
						<InputGroup>
							<InputLeftAddon children="Projeto" />
							<Select
								variant="filled"
								color="gray.600"
								name="projectID"
								onChange={(event) => {
									const hasLinks = Boolean(
										projects[event.target.selectedIndex].links[0]
									);
									setSelectedProject(projects[event.target.selectedIndex]);
									unselectLink();
									setReadOnlyForm(!hasLinks);
								}}>
								{projects.map((project, i) => (
									<option value={project.id} key={i}>
										{project.name}
									</option>
								))}
							</Select>
						</InputGroup>
						<InputGroup>
							<InputLeftAddon children="Link" />
							<Select
								placeholder={
									readOnlyForm && !selectedProject?.links[0]
										? "nenhum link cadastrado neste projeto"
										: "Selecione um link para alterar"
								}
								variant="filled"
								color="gray.600"
								name="id"
								id="selectLinkId"
								onChange={(event) => {
									const index = event.target.selectedIndex;
									setReadOnlyForm(index === 0);
									setSelectedLink(selectedProject.links[index - 1]);
								}}
								isRequired>
								{selectedProject.links?.map((link, i) => (
									<option value={link._id} key={i}>
										{link.name} ({link.link})
									</option>
								))}
							</Select>
						</InputGroup>

						<InputGroup>
							<InputLeftAddon children="Nome" />
							<Input
								placeholder={
									readOnlyForm && !selectedProject.links[0]
										? "nenhum link cadastrado neste projeto"
										: "digite um novo nome para o link"
								}
								name="name"
								id="inputName"
								value={selectedLink?.name}
								onChange={(event) =>
									setSelectedLink({
										...selectedLink,
										name: event.target.value,
									})
								}
								isDisabled={readOnlyForm}
								isRequired
							/>
						</InputGroup>
						<InputGroup>
							<InputLeftAddon children="URL" />
							<Input
								placeholder={
									readOnlyForm && !selectedProject.links[0]
										? "nenhum link cadastrado neste projeto"
										: "link do grupo de whatsapp"
								}
								name="link"
								id="inputLink"
								type="url"
								isRequired
								value={selectedLink?.link}
								onChange={(event) =>
									setSelectedLink({
										...selectedLink,
										link: event.target.value,
									})
								}
								isDisabled={readOnlyForm}
							/>
						</InputGroup>
						<InputGroup>
							<InputLeftAddon children="Leads" />
							<Input
								placeholder={
									readOnlyForm && !selectedProject.links[0]
										? "nenhum link cadastrado neste projeto"
										: "número de leads entre 0 e 257"
								}
								name="numLeads"
								type="number"
								value={selectedLink?.numLeads}
								onChange={(event) =>
									setSelectedLink({
										...selectedLink,
										numLeads: event.target.value,
									})
								}
								isRequired
								isDisabled={readOnlyForm}
							/>
						</InputGroup>
						<Checkbox
							name="active"
							isChecked={selectedLink?.active}
							onChange={(event) =>
								setSelectedLink({
									...selectedLink,
									active: !selectedLink.active,
								})
							}
							isDisabled={readOnlyForm}>
							Ativo
						</Checkbox>
						<InputGroup>
							<Input
								type="submit"
								backgroundColor="blue.500"
								_hover={{ backgroundColor: "blue.600" }}
								value="ATUALIZAR"
								maxWidth="50%"
								margin="0 auto"
							/>
							<Button
								backgroundColor="red.500"
								_hover={{ backgroundColor: "red.600" }}
								children="APAGAR"
								maxWidth="150px"
								margin="0 auto"
								onClick={handleDeleteLink}
								isDisabled={readOnlyForm}
							/>
						</InputGroup>
					</Grid>
				</AccordionPanel>
			</AccordionItem>
			{messagesArray.map((message, i) => (
				<Text textAlign="center" key={i}>
					{message}
				</Text>
			))}
		</Accordion>
	);
};

export default Links;
