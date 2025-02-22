import { Alert, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react"
import { useCreateSuggestion } from "../../services/mutations";
import { useAllowedGames } from "../../services/queries";
import { GameGet } from "../../types/game";
import { useEffect, useState } from "react";
import usePersonStore from "../../stores/personStore";

interface propTypes {
	isOpen: boolean,
	onOpenChange: () => void,
}

const ModalSuggestion = (props: propTypes) => {

	const { id } = usePersonStore();

	const [juegos, setJuegos] = useState<GameGet[]>([]);
	const [juegoValue, setJuegoValue] = useState<string>("");

	const [alertInfo, setAlertInfo] = useState<{ title: string; description: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined } | null>(null);

	const createSuggestionMutation = useCreateSuggestion();
	const gamesQuery = useAllowedGames();

	const handleSelectionGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setJuegoValue(e.target.value);
	}

	const showAlert = (titleText: string, descriptionText: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined) => {
		setAlertInfo({ title: titleText, description: descriptionText, color: color });
	};

	useEffect(() => {
		if (!gamesQuery.isPending && gamesQuery.isSuccess) {
			setJuegos(gamesQuery.data.items);
		}
		else if (!gamesQuery.isPending && gamesQuery.isError) {
			console.error('Error getting data juegos:', gamesQuery.error);
		}

		if (!createSuggestionMutation.isPending && createSuggestionMutation.isSuccess) {
			props.onOpenChange();
		} else if (!createSuggestionMutation.isPending && createSuggestionMutation.isError) {
			showAlert("¡Error al enviar sugerencia!", null, "danger");
		}
	}, [
		gamesQuery.isPending,
		gamesQuery.isSuccess,
		gamesQuery.isError,
		createSuggestionMutation.isPending,
		createSuggestionMutation.isSuccess,
		createSuggestionMutation.isError
	]);

	const postSuggestion = () => {
		setAlertInfo(null);

		const suggestionData = {
			idPersona: id,
			idJuego: Number(juegoValue),
		}

		createSuggestionMutation.mutate(suggestionData);
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
						<ModalHeader className="flex flex-col gap-1">Nueva Sugerencia</ModalHeader>
						<ModalBody>
							<p>El juego que elijas será mostrado como sugerencia a los narradores a la hora de crear una mesa durante la proxima semana.</p>
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
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Cerrar
							</Button>

							<Button
								color="success"
								onPress={postSuggestion}
								isDisabled={createSuggestionMutation.isPending}
							>
								{createSuggestionMutation.isPending ? "Enviando Sugerencia..." : "Enviar Sugerencia"}
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

export default ModalSuggestion