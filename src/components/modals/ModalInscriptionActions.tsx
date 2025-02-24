import { useBoard } from "../../services/queries";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Skeleton } from "@heroui/react";

interface ModalInscriptionProps {
	type: "view" | "ban" | "unban" | "unsubscribe" | "add" | "edit" | "cancel" | null;
	inscriptionId: number;
	boardId: number;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: (inscripcionId?: string) => void;
}

function renderModal(type: ModalInscriptionProps["type"], boardQuery: ReturnType<typeof useBoard>) {
	switch (type) {
		case "view":
			return renderModalView(boardQuery);
		case "unsubscribe":
			return renderModalUnsubscribe();
		default:
			return null;
	}
}

function renderModalView(boardQuery: ReturnType<typeof useBoard>) {
	if (boardQuery.isLoading || !boardQuery.data) {
		return (
			<div className="flex flex-col gap-2">
				<Skeleton className="h-3 w-4/5 rounded-lg" />
				<Skeleton className="h-3 w-3/5 rounded-lg" />
				<Skeleton className="h-3 w-2/5 rounded-lg" />
				<Skeleton className="h-3 w-2/5 rounded-lg" />
				<Skeleton className="h-3 w-2/5 rounded-lg" />
				<Skeleton className="h-3 w-2/5 rounded-lg" />
				<Skeleton className="h-3 w-2/5 rounded-lg" />
			</div>
		)
	}

	const board = boardQuery.data;
	return (
		<div>
			<p className='font-bold'>Juego: {board.items.juego.nombre}</p>
			<p className='font-normal text-neutral-400'>Narrado por: {board.items.narrador.apodo}</p>
			<p>Cuándo: {(new Date(board.items.fechaHora)).toLocaleString().slice(0, 17).concat(" hs.")}</p>
			<p>Dónde: {board.items.lugar.nombre}, {board.items.lugar.direccion}</p>
			<p>Descripción: {board.items.juego.descripcion}</p>
			<p>Cupos: Minimo {board.items.cupoMin} - Máximo {board.items.cupoMax}</p>
			<p>Notas: {board.items.notas}</p>
		</div>
	);
}

function renderModalUnsubscribe() {
	return (
		<p>¿Quieres desinscribir a esta persona de la mesa?</p>
	)
}


export default function ModalAction({ isOpen, onOpenChange, onConfirm, inscriptionId, boardId, type }: ModalInscriptionProps) {

	const boardQuery = useBoard(boardId ?? 0);

	return (
		<>
			<Modal
				className="dark text-foreground bg-background"
				isDismissable={false}
				isOpen={isOpen}
				onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className={(type === "unsubscribe" || type === "cancel") ? "flex flex-col gap-1 text-red-500" : "flex flex-col gap-1"}>
								{type === "view" ?
									"Mesa" :
									"Cancelar Inscripción"}
							</ModalHeader>
							<ModalBody>
								{renderModal(type, boardQuery)}
							</ModalBody>
							<ModalFooter>
								{!(type === "view") &&
									<Button color="danger" variant="light" onPress={onClose}>
										Cancelar
									</Button>
								}
								<Button
									color="primary"
									onPress={type === "view" ? () => { onConfirm(); onClose(); } : () => { onConfirm(inscriptionId.toString()); onClose(); }}>
									Confirmar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
