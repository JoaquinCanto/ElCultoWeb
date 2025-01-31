import axios from "axios";
import Game from "../components/Game";
import { useEffect, useState } from "react";
import { Button, Card, Skeleton, Divider } from "@heroui/react";
import usePersonaStore from "../stores/personaStore";
import { FaPlus } from "react-icons/fa6";
import ModalNewMesa from "../components/ModalNewBoard";

interface BoardsTypes {
	idMesa: number,
	juego: any,
	narrador: any,
	fechaHora: string,
	lugar: any,
	descripcion: any,
	notas: string,
	cupoMin: number,
	cupoMax: number
	jugadores: any
}

export default function Boards() {

	const { tipo } = usePersonaStore();

	const [boards, setBoards] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModal = () => setIsModalOpen(!isModalOpen);

	const fetchBoards = async () => {
		axios
			.get("http://localhost:3000/mesa/abierta")
			.then((response) => {
				setBoards(response.data.items);
				// console.log(response.data.items);
				setIsLoaded(true);
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
	};

	useEffect(() => {
		fetchBoards();
	}, [])

	const renderBoards = () => {
		if (boards.length < 1) {
			return <p>No hay mesas disponibles</p>
		}
		else {
			return boards.map((board: BoardsTypes) => (
				<Game
					key={board.idMesa}
					idMesa={board.idMesa}
					juego={board.juego.nombre}
					narrador={board.narrador.apodo}
					fecha={board.fechaHora}
					lugar={board.lugar.nombre}
					descripcion={board.juego.descripcion}
					notas={board.notas}
					minJugadores={board.cupoMin}
					maxJugadores={board.cupoMax}
					cantJugadores={board.jugadores.length}
					inscriptos={board.jugadores}
					updateMesas={fetchBoards}
				/>
			))
		}
	}

	function renderNewBoardButton() {
		if (tipo === "Narrador") {
			return (
				<>
					<Button color='primary'
						variant='ghost'
						startContent={<FaPlus />}
						onPress={toggleModal}
					>
						Agregar Mesa
					</Button>
					<Divider className="w-screen" />
				</>
			)
		}
	}

	function renderPage() {
		return (
			<div className='h-full p-4 flex flex-wrap gap-4'>
				{renderNewBoardButton()}
				{renderBoards()}
			</div>
		)
	}

	return (
		<div className='h-full p-4 flex flex-wrap gap-4'>
			{isLoaded ?
				renderPage()
				:
				<>
					<div className="flex flex-col gap-3">
						<Card className="w-[200px] space-y-5 p-4" radius="lg">
							<Skeleton className="rounded-lg" isLoaded={isLoaded}>
								<div className="h-24 rounded-lg bg-secondary" />
							</Skeleton>
							<div className="space-y-3">
								<Skeleton className="w-3/5 rounded-lg" isLoaded={isLoaded}>
									<div className="h-3 w-full rounded-lg bg-secondary" />
								</Skeleton>
								<Skeleton className="w-4/5 rounded-lg" isLoaded={isLoaded}>
									<div className="h-3 w-full rounded-lg bg-secondary-300" />
								</Skeleton>
								<Skeleton className="w-2/5 rounded-lg" isLoaded={isLoaded}>
									<div className="h-3 w-full rounded-lg bg-secondary-200" />
								</Skeleton>
							</div>
						</Card>
					</div>
				</>
			}
			<ModalNewMesa
				isOpen={isModalOpen}
				onOpenChange={toggleModal}
				boards={boards}
				newBoardAdded={() => {
					fetchBoards(); // Refresh the boards list
					setIsModalOpen(false); // Close the modal
				}}
			/>
		</div>
	)
}
