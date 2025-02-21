import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { usePlaceById } from "../../services/queries";
import { useEffect, useState } from "react";

interface ModalPlaceActionsProps {
	type: "view" | "ban" | "unban" | "unsubscribe" | "add" | "edit" | "cancel" | null;
	placeId?: number;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: (nombreLugar?: string, direccionLugar?: string) => void;
}

export default function ModalPlaceActions({
	type,
	placeId,
	isOpen,
	onOpenChange,
	onConfirm
}: ModalPlaceActionsProps) {

	const [place, setPlace] = useState<string>("");
	const [placeAddress, setPlaceAddress] = useState<string>("");

	function renderModal(type: ModalPlaceActionsProps["type"]) {
		switch (type) {
			case "add":
				return renderModalAdd();
			case "edit":
				return renderModalEdit();
			case "unsubscribe":
				return (
					<div>
						<p>¿Quieres dar de baja a este lugar?</p>
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
					label="Lugar: "
					labelPlacement="outside"
					placeholder=" "
					name="placeName"
					type="text"
					value={place}
					onValueChange={setPlace}
				/>

				<Input
					isRequired
					isClearable
					label="Dirección: "
					labelPlacement="outside"
					placeholder=" "
					name="placeAddress"
					type="text"
					value={placeAddress}
					onValueChange={setPlaceAddress}
				/>
			</div>
		)
	}
	function renderModalEdit() {
		const placeByIdQuery = usePlaceById(placeId!);

		useEffect(() => {
			if (placeByIdQuery.data) {
				setPlace(placeByIdQuery.data.items.nombre || "");
				setPlaceAddress(placeByIdQuery.data.items.direccion || "");
			}
		}, [placeByIdQuery.data]);

		return renderModalAdd();
	}


	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark text-foreground bg-background">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							{type === "add"
								? "Agregar Nuevo Lugar"
								: type === "edit"
									? "Editar Lugar"
									: "Dar Lugar de Baja"}
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
								onPress={type !== "unsubscribe" ? () => { onConfirm(place, placeAddress); onClose(); } : () => { onConfirm(); onClose(); }}
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
