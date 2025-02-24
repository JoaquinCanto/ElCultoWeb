import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Button, Card, CardHeader, CardBody, CardFooter, Progress, Divider, Modal, ModalContent, ModalFooter, ModalBody, ModalHeader, useDisclosure } from "@heroui/react";
import usePersonaStore from '../stores/personStore';
import { useEffect, useState } from 'react';
import { useCancelBoard, useCreateInscription, useCancelInscription } from '../services/mutations';
import { DeleteIcon, EditIcon } from './Icons';
import { BoardGet } from '../types/board';
import ModalBoardData from './ModalBoardData';

interface GameProps {
	board: BoardGet;
}

export default function Game({ board }: GameProps) {

	const {
		id,
		apodo
	} = usePersonaStore();

	const [isInscribed, setIsInscribed] = useState<boolean>();
	const [isNarrator, setIsNarrator] = useState<boolean>();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isBoardDataOpen, setIsBoardDataOpen] = useState(false);

	function checkNarrator() {
		if (board.narrador.apodo === apodo) {
			setIsNarrator(true);
		}
		else {
			setIsNarrator(false);
		}
	}

	const cancelBoardMutation = useCancelBoard();

	const createInscriptionMutation = useCreateInscription();
	const cancelInscriptionMutation = useCancelInscription();

	function checkInscription() {

		if (!board.jugadores || board.jugadores.length === 0) {
			setIsInscribed(false);
			return;
		}

		if (id !== -1) {
			if (board.jugadores.find((jugador: any) => jugador.idJugador === id)) {
				setIsInscribed(true);
			}
			else {
				setIsInscribed(false);
			}
		}
	}

	useEffect(() => {
		if (board.jugadores) {
			checkInscription();
		}

		checkNarrator();

		if (!createInscriptionMutation.isPending && createInscriptionMutation.isSuccess) {
			checkInscription();
		}
		if (!cancelInscriptionMutation.isPending && cancelInscriptionMutation.isSuccess) {
			checkInscription();
		}

	}, [
		board.jugadores,
		createInscriptionMutation.isPending,
		createInscriptionMutation.isSuccess,
		cancelInscriptionMutation.isPending,
		cancelInscriptionMutation.isSuccess,
		isInscribed, setIsInscribed, checkInscription
	]);

	const inscription = () => {
		createInscriptionMutation.mutate({
			idJugador: id,
			idMesa: board.idMesa,
			baja: false
		})
	}

	const unsubscribe = () => {
		const inscripcion = board.jugadores.find((jugador: any) => jugador.idJugador === id);

		cancelInscriptionMutation.mutate(inscripcion.idInscripcion);
	}

	const cancelBoard = async () => {
		const idMesa = board.idMesa;

		cancelBoardMutation.mutateAsync(idMesa);
	}

	const renderButtons = () => {
		if (isNarrator) {
			return (
				<div className='flex gap-2'>
					<Button
						isIconOnly
						color='primary'
						variant='bordered'
						onPress={() => setIsBoardDataOpen(true)}
					>
						<EditIcon />
					</Button>
					<Button
						isIconOnly
						color='danger'
						variant='ghost'
						onPress={onOpen}
					>
						<DeleteIcon />
					</Button>
				</div>
			)
		}
		if (isInscribed) {
			return (
				<Button
					className='w-32 text-xs'
					color='primary'
					variant='ghost'
					startContent={<FaMinus />}
					isDisabled={cancelInscriptionMutation.isPending}
					onPress={unsubscribe}
				>
					Desinscribirse
				</Button>
			)
		}
		if (!isInscribed) {
			return (
				<Button
					className='w-32'
					color='primary'
					variant='ghost'
					startContent={<FaPlus />}
					isDisabled={createInscriptionMutation.isPending}
					onPress={inscription}
				>
					Anotarse
				</Button>
			)
		}
	}

	return (
		<>
			<Card className='w-screen sm:w-80'>
				<CardHeader>
					<div>
						<h3 className='font-bold'>{board.juego.nombre}</h3>
						<p className='font-normal text-neutral-400'>Narrado por: {board.narrador.apodo}</p>
					</div>
				</CardHeader>

				<Divider />

				<CardBody >
					<p>Cuándo: {(new Date(board.fechaHora)).toLocaleString().slice(0, 17).concat(" hs.")}</p>
					<p>Dónde: {board.lugar.nombre}, {board.lugar.direccion}</p>
					<p>Descripción: {board.juego.descripcion}</p>
					<p>Cupos: Minimo {board.cupoMin} - Máximo {board.cupoMax}</p>
					<p>Notas: {board.notas}</p>
				</CardBody>

				<Divider />

				<CardFooter
					className='flex flex-row items-center justify-around'
				>
					<Progress className='w-1/2 flex flex-col'
						size='md'
						color='secondary'
						label={`Reservas: ${board.jugadores.length}/${board.cupoMax}`}
						value={board.jugadores.length}
						maxValue={board.cupoMax}
					/>

					<div className='w-1/2 flex justify-center'>
						{renderButtons()}
					</div>
				</CardFooter>
			</Card>

			<Modal
				className="dark text-foreground bg-background"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				placement="center"
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-red-500">Cancelar Mesa</ModalHeader>
							<ModalBody>
								<p>
									¿Seguro que quieres cancelar la mesa?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="default" variant="ghost" onPress={onClose}>
									Cerrar
								</Button>
								<Button
									color="danger"
									onPress={cancelBoard}
									isDisabled={cancelBoardMutation.isPending}
								>
									{cancelBoardMutation.isPending ? "Cancelando..." : "Cancelar"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{isBoardDataOpen && (
				<ModalBoardData
					isOpen={isBoardDataOpen}
					onOpenChange={() => setIsBoardDataOpen(false)}
					boardToEdit={board}
				/>
			)}
		</>
	)
}
