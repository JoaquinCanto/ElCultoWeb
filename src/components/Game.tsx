import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Button, Card, CardHeader, CardBody, CardFooter, Progress, Divider } from "@heroui/react";
import usePersonaStore from '../stores/personStore';
import { useEffect, useState } from 'react';
import { useCancelBoard, useCreateInscription, useCancelInscription } from '../services/mutations';
import { DeleteIcon, EditIcon } from './Icons';

interface propTypes {
	idMesa: number,
	juego: string,
	narrador: string,
	fecha: string,
	lugar: any,
	descripcion: string,
	notas: string,
	minJugadores: number,
	maxJugadores: number,
	cantJugadores: number,
	inscriptos: any,
	updateMesas: any
}

export default function Game(props: propTypes) {

	const {
		id,
		apodo
	} = usePersonaStore();

	const [isInscribed, setIsInscribed] = useState<boolean>();
	const [isNarrator, setIsNarrator] = useState<boolean>();

	function checkNarrator() {
		if (props.narrador === apodo) {
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

		if (!props.inscriptos || props.inscriptos.length === 0) {
			setIsInscribed(false);
			return;
		}

		if (id !== -1) {
			if (props.inscriptos.find((jugador: any) => jugador.idJugador === id)) {
				setIsInscribed(true);
			}
			else {
				setIsInscribed(false);
			}
		}
	}

	useEffect(() => {
		if (props.inscriptos) {
			console.log("idMesa: ", props.idMesa, " isInscribed: ", isInscribed);
			checkInscription();
		}
		checkNarrator();

		if (!createInscriptionMutation.isPending && createInscriptionMutation.isSuccess) {
			setIsInscribed(true);
		}
		if (!cancelInscriptionMutation.isPending && cancelInscriptionMutation.isSuccess) {
			setIsInscribed(false);
		}

	}, [
		props.inscriptos,
		createInscriptionMutation.isPending,
		createInscriptionMutation.isSuccess,
		cancelInscriptionMutation.isPending,
		cancelInscriptionMutation.isSuccess,
		isInscribed, setIsInscribed, checkInscription
	]);

	const inscription = () => {
		createInscriptionMutation.mutate({
			idJugador: id,
			idMesa: props.idMesa,
			baja: false
		})
	}

	// async function inscription() {
	// 	try {
	// 		await axios.post("http://localhost:3000/inscripcion", {
	// 			idJugador: id,
	// 			idMesa: props.idMesa,
	// 			baja: false
	// 		})
	// 			.then(response => {
	// 				// console.log("Response: ", response)
	// 				if (response.status === 201) {
	// 					setIsInscribed(true);
	// 					props.updateMesas();
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error posting data:', error);
	// 			});
	// 	}
	// 	catch (error) {
	// 		console.log("Response Axios error: ", error);
	// 	};
	// }

	const unsubscribe = () => {
		const idInscripcion = props.inscriptos.find((jugador: any) => jugador.idJugador === id);

		cancelInscriptionMutation.mutateAsync(idInscripcion);
	}

	// async function unsubscribe() {
	// 	const idInscripcion = props.inscriptos.find((jugador: any) => jugador.idJugador === id).idInscripcion;

	// 	try {
	// 		await axios.delete(`http://localhost:3000/inscripcion/${idInscripcion.toString()}`)
	// 			.then(response => {
	// 				// console.log("Response: ", response)
	// 				if (response.status === 200) {
	// 					setIsInscribed(false);
	// 					props.updateMesas();
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting inscripcion:', error);
	// 			});
	// 	}
	// 	catch (error) {
	// 		console.log("Response Axios error: ", error);
	// 	};
	// }
	const cancelBoard = async () => {
		const idMesa = props.idMesa;

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
					// onPress={toggleModal} editar mesa
					>
						<EditIcon />
					</Button>
					<Button
						isIconOnly
						color='danger'
						variant='ghost'
						onPress={cancelBoard}
					>
						<DeleteIcon />
					</Button>
				</div>
			)
		}
		if (isInscribed) {
			return (
				<Button color='primary'
					variant='ghost'
					startContent={<FaMinus />}
					onPress={unsubscribe}
				>
					Desinscribirse
				</Button>
			)
		}
		if (!isInscribed) {
			return (
				<Button color='primary'
					variant='ghost'
					startContent={<FaPlus />}
					onPress={inscription}
				>
					Unirse
				</Button>
			)
		}
	}

	return (
		<Card className='w-screen sm:w-80'>
			<CardHeader>
				<div>
					<h3 className='font-bold'>{props.juego}</h3>
					<p className='font-normal text-neutral-400'>Narrado por: {props.narrador}</p>
				</div>
			</CardHeader>

			<Divider />

			<CardBody >
				<p>Cuándo: {(new Date(props.fecha)).toLocaleString().slice(0, 17).concat(" hs.")}</p>
				<p>Dónde: {props.lugar.nombre}, {props.lugar.direccion}</p>
				<p>Descripción: {props.descripcion}</p>
				<p>Cupos: Minimo {props.minJugadores} - Máximo {props.maxJugadores}</p>
				<p>Notas: {props.notas}</p>
			</CardBody>

			<Divider />

			<CardFooter>
				<Progress className='w-1/2 flex flex-col'
					size='md'
					color='secondary'
					label={`Reservas: ${props.cantJugadores}/${props.maxJugadores}`}
					value={props.cantJugadores}
					maxValue={props.maxJugadores}
				/>

				<div className='w-1/2 flex justify-center'>
					{renderButtons()}
				</div>
			</CardFooter>
		</Card>
	)
}
