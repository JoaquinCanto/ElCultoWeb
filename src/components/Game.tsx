import { Button, Card, CardHeader, CardBody, CardFooter, Progress, Checkbox, Divider, Modal, ModalHeader, ModalBody, ModalFooter, Input } from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa6';


interface propTypes {
	idMesa: number,
	juego: string,
	narrador: string,
	fecha: string,
	lugar: string,
	descripcion: string,
	notas: string,
	minJugadores: number,
	maxJugadores: number,
	cantJugadores: number,
}

export default function Game(props: propTypes) {
	return (
		<Card className='w-screen sm:w-80'>
			<CardHeader>
				<div>
					<h3 className='font-bold'>{props.juego}</h3>
					<p className='font-normal text-neutral-400'>Narrado por: {props.narrador}</p>
				</div>
			</CardHeader>

			<Divider />

			<CardBody>
				<p>Cuándo: {props.fecha}</p>
				<p>Dónde: {props.lugar}</p>
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
					<Button className='dark' color='primary' variant='ghost' startContent={<FaPlus />}
						onPress={() => {
							console.log('Te uniste a la mesa');
						}}>Unirse</Button>
					{/* <Input color='primary' placeholder='Compartir mesa' /> */}
				</div>
			</CardFooter>
		</Card>
	)
}
