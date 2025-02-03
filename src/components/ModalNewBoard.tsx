import axios from "axios";
import { useEffect, useState } from "react";
import usePersonaStore from "../stores/personaStore";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Alert, Button, CalendarDate, Checkbox, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Snippet, Textarea, TimeInput, TimeInputValue } from "@heroui/react";
import { ClockCircleLinearIcon } from "../components/Icons";
import PassGenerator from "./PassGenerator";

interface propTypes {
	isOpen: boolean,
	onOpenChange: () => void,
	boards: any,
	newBoardAdded: () => void,
}
interface juegoTypes {
	idJuego: number,
	nombre: string,
	descripcion: string,
}

interface lugarTypes {
	idLugar: number,
	nombre: string,
	direccion: string,
}

export default function ModalNewBoard(props: propTypes) {

	const { id, apodo } = usePersonaStore();

	const [juegos, setJuegos] = useState([]);
	const [juegoValue, setJuegoValue] = useState<string>("");

	const [date, setDate] = useState<CalendarDate | null>();
	const [time, setTime] = useState<TimeInputValue | null>();

	const [lugares, setLugares] = useState([]);
	const [lugarValue, setLugarValue] = useState<string>("");

	const [notas, setNotas] = useState<string>("");

	const [isPublica, setIsPublica] = useState<boolean>(true);
	const password = PassGenerator();

	const [cupMin, setCupMin] = useState<number>();
	const [cupMax, setCupMax] = useState<number>();

	const [cod, setCod] = useState<string | null>(null);
	const [alertInfo, setAlertInfo] = useState<{ title: string; description: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined } | null>(null);

	async function getGames() {
		try {
			await axios.get("http://localhost:3000/juego")
				.then(response => {
					setJuegos(response.data.items);
				})
				.catch((error) => {
					console.error('Error getting data juegos:', error);
				});
		}
		catch (error) {
			console.log("Response Axios Error Juegos: ", error);
		};
	}

	const handleSelectionGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setJuegoValue(e.target.value);
	}

	async function getPlaces() {
		try {
			await axios.get("http://localhost:3000/lugar")
				.then(response => {
					setLugares(response.data.items);
				})
				.catch((error) => {
					console.error('Error getting data lugares:', error);
				});
		}
		catch (error) {
			console.log("Response Axios Error Lugares: ", error);
		}
	}

	const handleSelectionPlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLugarValue(e.target.value);
	};

	const validateMin = (value: any) => {
		if (Number(value) < 0) {
			return "Ingresa un número válido.";
		}
		return true;
	}

	const validateMax = (value: any) => {
		if (Number(value) < 0 || Number(value) < Number(cupMin)) {
			return "Ingresa un número válido.";
		}
		return true;
	}

	const showAlert = (titleText: string, descriptionText: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined) => {
		setAlertInfo({ title: titleText, description: descriptionText, color: color });
	};

	useEffect(() => {
		getGames();
		getPlaces();
	}, [])

	async function postNewBoard() {
		const dateTime = new Date(`${date?.toString()}T${time?.toString()}.000`).toISOString();

		if (!(props.boards.find((mesa: any) => mesa.idNarrador === id && mesa.fechaHora === dateTime))) {

			if (!isPublica) {
				setCod(password);
			} else {
				setCod(null);
			}

			try {
				await axios.post("http://localhost:3000/mesa", {
					idNarrador: id,
					idJuego: Number(juegoValue),
					idLugar: Number(lugarValue),
					fechaHora: dateTime,
					notas: notas,
					cupoMin: cupMin,
					cupoMax: cupMax,
					estado: 'Abierta',
					publica: isPublica,
					codigo: cod,
				})
					.then(response => {
						// console.log("Response Axios: ", response);

						if (response.status === 201) {
							props.newBoardAdded();	// Agregar la nueva mesa al array de mesas
							props.onOpenChange();	// Cerrar el modal
						}
						else {
							console.log("Error al crear la mesa"); //continuar aqui
							showAlert("Error al crear la mesa", null, "danger");
						}

					})
					.catch((error) => {

						console.error('Error posting data:', error);
						showAlert("Error al crear la mesa", null, "danger");
					});
			}
			catch (error) {
				console.log("Response Axios error: ", error);
			};
		}
		else {
			console.log("Ya existe una mesa para esa fecha y hora narrada por vos.");
			showAlert("Ya existe una mesa para esa fecha y hora narrada por vos.", null, "danger");
			// <Alert color="danger" title="Ya existe una mesa para esa fecha y hora narrada por vos." />
		}
	}

	return (
		<Modal
			className="dark text-foreground bg-background"
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			placement="center"
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Agregar Nueva Mesa</ModalHeader>
						<ModalBody>
							<Input
								isRequired
								isReadOnly
								label="Narrador: "
								labelPlacement="outside"
								defaultValue={apodo}
								name="narrador"
								type="text"
							/>

							<Select
								isRequired
								label="Juego: "
								labelPlacement="outside"
								name="juego"
								placeholder="Seleccione un juego"
								selectedKeys={[juegoValue]}
								onChange={handleSelectionGameChange}
							>
								{juegos.map((juego: juegoTypes) => (
									<SelectItem key={juego.idJuego}>{juego.nombre}</SelectItem>
								))}
							</Select>

							<DatePicker
								isRequired
								showMonthAndYearPickers
								minValue={today(getLocalTimeZone())}
								label="Fecha de la Mesa: "
								labelPlacement="outside"
								name="fechaMesa"
								value={date}
								onChange={setDate}
								errorMessage={(value) => {
									if (value.isInvalid) {
										return "Ingresa una fecha válida.";
									}
								}}
							/>

							<TimeInput
								//   defaultValue={new Time(11, 45)}
								isRequired
								endContent={
									<ClockCircleLinearIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
								}
								label="Hora de la Mesa: "
								labelPlacement="outside"
								name="horaMesa"
								hourCycle={24}
								value={time}
								onChange={setTime}
							/>

							<Select
								isRequired
								label="Lugar: "
								labelPlacement="outside"
								name="juego"
								placeholder="Seleccione un Lugar:"
								selectedKeys={[lugarValue]}
								onChange={handleSelectionPlaceChange}
							>
								{lugares.map((lugar: lugarTypes) => (
									<SelectItem key={lugar.idLugar}>{lugar.nombre}</SelectItem>
								))}
							</Select>

							<Textarea
								isRequired
								isClearable
								label="Notas: "
								labelPlacement="outside"
								placeholder=" "
								name="notas"
								type="text"
								value={notas}
								onValueChange={setNotas}
							/>

							<Input
								isRequired
								isClearable
								label="Cupo Mínimo: "
								labelPlacement="outside"
								placeholder="2"
								name="cupoMin"
								type="number"
								validate={validateMin}
								onChange={(e) => setCupMin(Number(e.target.value))}
							/>

							<Input
								isRequired
								isClearable
								label="Cupo Máximo: "
								labelPlacement="outside"
								placeholder="5"
								name="cupoMax"
								type="number"
								validate={validateMax}
								onChange={(e) => setCupMax(Number(e.target.value))}
							/>

							<Checkbox
								defaultSelected
								size="lg"
								color="primary"
								radius="md"
								name="publica"
								isSelected={isPublica}
								onValueChange={setIsPublica}
							>
								Mesa Pública
							</Checkbox>

							{!isPublica &&
								<>
									<Snippet
										symbol="#"
										variant="bordered"
									>
										{password}
									</Snippet>
									<p>¡Compartí este código solo con tus jugadores!</p>
								</>
							}

						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Cerrar
							</Button>
							<Button color="success" onPress={postNewBoard}>
								Publicar Mesa
							</Button>
						</ModalFooter>
						{alertInfo && (
							<Alert
								color={alertInfo.color}
								title={alertInfo.title}
								description={alertInfo.description}
								className="mb-4"
							/>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
