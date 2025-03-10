import { useEffect, useState } from "react";
import usePersonStore from "../../stores/personStore";
import { CalendarDate, getLocalTimeZone, Time, today } from "@internationalized/date";
import { Alert, Button, Checkbox, DatePicker, DateValue, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Snippet, Textarea, TimeInput, TimeInputValue } from "@heroui/react";
import { ClockCircleLinearIcon } from "../Icons";
import PassGenerator from "../PassGenerator";
import { useCreateBoard, useUpdateBoard } from "../../services/mutations";
import { useAllowedGames, useOpenBoards, useAllowedPlaces } from "../../services/queries";
import { GameGet } from "../../types/game";
import { PlaceGet } from "../../types/place";
import { BoardGet } from "../../types/board";

interface propTypes {
	isOpen: boolean,
	onOpenChange: () => void,
	boardToEdit?: BoardGet;
}

export default function ModalBoardData(props: propTypes) {

	const { id, apodo } = usePersonStore();

	const [juegos, setJuegos] = useState<GameGet[]>([]);
	const [juegoValue, setJuegoValue] = useState<string>("");

	const [date, setDate] = useState<DateValue | null>();
	const [time, setTime] = useState<TimeInputValue | null>();

	const [lugares, setLugares] = useState<PlaceGet[]>([]);
	const [lugarValue, setLugarValue] = useState<string>("");

	const [notas, setNotas] = useState<string>("");

	const [isPublica, setIsPublica] = useState<boolean>(true);
	const password = PassGenerator();

	const [cupMin, setCupMin] = useState<number>();
	const [cupMax, setCupMax] = useState<number>();

	const [cod, setCod] = useState<string | undefined>(undefined);
	const [alertInfo, setAlertInfo] = useState<{ title: string; description: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined } | null>(null);

	const createBoardMutation = useCreateBoard();
	const updateBoardMutation = useUpdateBoard();
	const openBoardsQuery = useOpenBoards();

	const gamesQuery = useAllowedGames();

	const handleSelectionGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setJuegoValue(e.target.value);
	}

	const placesQuery = useAllowedPlaces();

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

		if (props.boardToEdit) {
			const dateTime = new Date(props.boardToEdit.fechaHora).toLocaleString();
			setJuegoValue(String(props.boardToEdit.idJuego));
			const [day, month, year] = dateTime.split(",")[0].split("/").map(Number);
			setDate(new CalendarDate(year, month, day));
			const [hour, minute] = dateTime.split(",")[1].split(":").map(Number);
			setTime(new Time(hour, minute));
			setLugarValue(String(props.boardToEdit.idLugar));
			setNotas(props.boardToEdit.notas);
			setCupMin(props.boardToEdit.cupoMin);
			setCupMax(props.boardToEdit.cupoMax);
			setIsPublica(props.boardToEdit.publica);
			setCod(props.boardToEdit.codigo || undefined);
		}

		if (!gamesQuery.isPending && gamesQuery.isSuccess) {
			setJuegos(gamesQuery.data.items);
		}
		else if (!gamesQuery.isPending && gamesQuery.isError) {
			console.error('Error getting data juegos:', gamesQuery.error);
		}

		if (!placesQuery.isPending && placesQuery.isSuccess) {
			setLugares(placesQuery.data.items);
		}
		else if (!placesQuery.isPending && placesQuery.isError) {
			console.error('Error getting data lugares:', placesQuery.error);
		}

		if (!createBoardMutation.isPending && createBoardMutation.isSuccess) {
			props.onOpenChange();
		} else if (!createBoardMutation.isPending && createBoardMutation.isError) {
			showAlert("¡Error al crear la mesa!", null, "danger");
		}

		if (!updateBoardMutation.isPending && updateBoardMutation.isSuccess) {
			props.onOpenChange();
		} else if (!updateBoardMutation.isPending && updateBoardMutation.isError) {
			showAlert("¡Error al editar la mesa!", null, "danger");
		}

	}, [
		props.boardToEdit,
		createBoardMutation.isPending,
		createBoardMutation.isSuccess,
		createBoardMutation.isError,
		updateBoardMutation.isPending,
		updateBoardMutation.isSuccess,
		updateBoardMutation.isError,
		gamesQuery.isPending,
		gamesQuery.isSuccess,
		gamesQuery.isError,
		placesQuery.isPending,
		placesQuery.isSuccess,
		placesQuery.isError
	]);

	async function postBoard() {
		setAlertInfo(null);

		const dateTime = new Date(`${date?.toString()}T${time?.toString()}.000`).toISOString();

		if (!(openBoardsQuery.data?.items.find((mesa: any) => mesa.idNarrador === id && mesa.fechaHora === dateTime))) {
			if (cupMin === undefined || cupMax === undefined) {
				showAlert("Ingresa un cupo minimo o maximo.", null, "danger");
				return;
			}

			const boardData = {
				idNarrador: id,
				idJuego: Number(juegoValue),
				idLugar: Number(lugarValue),
				fechaHora: dateTime,
				notas: notas,
				cupoMin: cupMin,
				cupoMax: cupMax,
				estado: "Abierta",
				publica: isPublica,
				codigo: isPublica ? undefined : cod,
			};

			if (props.boardToEdit) {
				updateBoardMutation.mutate({ boardId: props.boardToEdit.idMesa, data: boardData });
			} else {
				createBoardMutation.mutate(boardData);
			}
		}

		else {
			showAlert("Ya existe una mesa para esa fecha y hora narrada por vos.", null, "danger");
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
								{juegos.map((juego: GameGet) => (
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
								value={date} //as unknown as import("@heroui/system/node_modules/@internationalized/date").DateValue
								onChange={(newDate) => newDate && setDate(newDate)}
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
								{lugares.map((lugar: PlaceGet) => (
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
							{props.boardToEdit ?
								<Button
									color="success"
									onPress={postBoard}
									isDisabled={updateBoardMutation.isPending}
								>
									{updateBoardMutation.isPending ? "Editando Mesa..." : "Editar Mesa"}
								</Button>
								:
								<Button
									color="success"
									onPress={postBoard}
									isDisabled={createBoardMutation.isPending}
								>
									{createBoardMutation.isPending ? "Creando Mesa..." : "Publicar Mesa"}
								</Button>
							}

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
