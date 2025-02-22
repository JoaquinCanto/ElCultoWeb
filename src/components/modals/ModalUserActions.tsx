import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker, DateValue } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";

interface ModalUserActionsProps {
	type: "view" | "ban" | "unban" | "unsubscribe" | "add" | "edit" | "cancel" | null;
	userId: number;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: (date?: string) => void;
}

function renderModalUnban() {
	return (
		<div>
			<p>¿Quieres rehabilitar este usuario antes de tiempo?</p>
		</div>
	)
}

function renderModalUnsubscribe() {
	return (
		<p>¿Quieres dar de baja a este usuario?</p>
	)
}

export default function ModalUserActions({
	type,
	isOpen,
	onOpenChange,
	onConfirm,
}: ModalUserActionsProps) {
	const [date, setDate] = useState<DateValue | null>();

	function renderModal(type: ModalUserActionsProps["type"]) {
		switch (type) {
			case "ban":
				return renderModalBan();
			case "unban":
				return renderModalUnban();
			case "unsubscribe":
				return renderModalUnsubscribe();
			default:
				return null;
		}
	}

	function renderModalBan() {
		return (
			<div>
				<DatePicker
					isRequired
					showMonthAndYearPickers
					minValue={today(getLocalTimeZone())}
					label="El Usuario será inhabilitado hasta: "
					labelPlacement="outside"
					name="fechaInhabilitado"
					value={date}//as unknown as import("@heroui/system/node_modules/@internationalized/date").DateValue
					onChange={(newDate) => newDate && setDate(newDate)}
					errorMessage={(value) => {
						if (value.isInvalid) {
							return "Ingresa una fecha válida.";
						}
					}}
				/>
			</div>
		)
	}
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark text-foreground bg-background">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							{type === "ban"
								? "Banear Usuario"
								: type === "unban"
									? "Desbanear Usuario"
									: "Dar Usuario de Baja"}
						</ModalHeader>
						<ModalBody>
							{renderModal(type)}
						</ModalBody>

						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Cancelar
							</Button>
							<Button
								color="primary"
								variant="solid"
								onPress={type === "ban" ? () => { onConfirm((new Date(date as unknown as string)).toISOString()); onClose(); } : () => { onConfirm(); onClose(); }}
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
