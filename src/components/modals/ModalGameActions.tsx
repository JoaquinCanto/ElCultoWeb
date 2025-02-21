import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { useGameById } from "../../services/queries";


interface ModalGameActionsProps {
	type: "view" | "ban" | "unban" | "unsubscribe" | "add" | "edit" | "cancel" | null;
	gameId?: number;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: (nombreJuego?: string, descripcionJuego?: string) => void;
}

export default function ModalGameActions({
	type,
	gameId,
	isOpen,
	onOpenChange,
	onConfirm
}: ModalGameActionsProps) {

	const [game, setGame] = useState<string>("");
	const [gameDescription, setGameDescription] = useState<string>("");

	function renderModal(type: ModalGameActionsProps["type"]) {
		switch (type) {
			case "add":
				return renderModalAdd();
			case "edit":
				return renderModalEdit();
			case "unsubscribe":
				return (
					<div>
						<p>¿Quieres dar de baja a este juego?</p>
					</div>
				)
			default:
				return null;
		}
	}

	function renderModalAdd() {
		return (
			<div>
				<Input
					isRequired
					isClearable
					label="Nombre: "
					labelPlacement="outside"
					placeholder=" "
					name="gameName"
					type="text"
					value={game}
					onValueChange={setGame}
				/>

				<Textarea
					isRequired
					isClearable
					minRows={2}
					maxRows={3}
					disableAutosize
					label="Descripcion: "
					labelPlacement="outside"
					placeholder=""
					variant="faded"
					description="Descripción del juego."
					type="text"
					value={gameDescription}
					onValueChange={setGameDescription}
				/>
			</div>
		)
	}

	function renderModalEdit() {
		const gameByIdQuery = useGameById(gameId!);

		useEffect(() => {
			if (gameByIdQuery.data) {
				setGame(gameByIdQuery.data.items.nombre || "");
				setGameDescription(gameByIdQuery.data.items.descripcion || "");
			}
		}, [gameByIdQuery.data]);

		return renderModalAdd();
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark text-foreground bg-background">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							{type === "add"
								? "Agregar Nuevo Juego"
								: type === "edit"
									? "Editar Juego"
									: "Dar Juego de Baja"}
						</ModalHeader>
						<ModalBody>
							{renderModal(type)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Cancelar
							</Button>
							<Button
								color="primary"
								variant="solid"
								onPress={type !== "unsubscribe" ? () => { onConfirm(game, gameDescription); onClose(); } : () => { onConfirm(); onClose(); }}
							>
								Confirmar
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
