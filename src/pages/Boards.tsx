import { useState } from "react";
import Game from "../components/Game";
import { FaPlus } from "react-icons/fa6";
import { BoardGet } from "../types/board";
import { useOpenBoards } from "../services/queries";
import usePersonStore from "../stores/personStore";
import ModalBoardData from "../components/ModalBoardData";
import { Button, Card, Skeleton, Divider } from "@heroui/react";

export default function Boards() {

	const { tipo } = usePersonStore();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModal = () => setIsModalOpen(!isModalOpen);

	const openBoardsQuery = useOpenBoards();

	const renderBoards = () => {
		console.log(openBoardsQuery.data);
		if (!openBoardsQuery.data?.items || !Array.isArray(openBoardsQuery.data.items)) {
			return <p>No hay mesas disponibles</p>
		}
		else {
			return openBoardsQuery.data.items.map((board: BoardGet) => (
				<Game
					key={board.idMesa}
					idMesa={board.idMesa}
					juego={board.juego.nombre}
					narrador={board.narrador.apodo}
					fecha={board.fechaHora}
					lugar={board.lugar}
					descripcion={board.juego.descripcion}
					notas={board.notas}
					minJugadores={board.cupoMin}
					maxJugadores={board.cupoMax}
					cantJugadores={board.jugadores.length}
					inscriptos={board.jugadores}
					updateMesas={openBoardsQuery.refetch}
				/>
			))
		}
	}

	function renderNewBoardButton() {
		if (tipo === "Narrador") {
			return (
				<div className="flex flex-col gap-2">
					<Button className="w-40"
						color='primary'
						variant='ghost'
						startContent={<FaPlus />}
						onPress={toggleModal}
					>
						Agregar Mesa
					</Button>
					<Divider className="w-screen" />
				</div>
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
			{!openBoardsQuery.isPending ?
				renderPage()
				:
				<>
					<div className="flex flex-col gap-3">
						<Card className="w-[200px] space-y-5 p-4" radius="lg">
							<Skeleton className="rounded-lg" >
								<div className="h-24 rounded-lg bg-secondary" />
							</Skeleton>
							<div className="space-y-3">
								<Skeleton className="w-3/5 rounded-lg" >
									<div className="h-3 w-full rounded-lg bg-secondary" />
								</Skeleton>
								<Skeleton className="w-4/5 rounded-lg" >
									<div className="h-3 w-full rounded-lg bg-secondary-300" />
								</Skeleton>
								<Skeleton className="w-2/5 rounded-lg" >
									<div className="h-3 w-full rounded-lg bg-secondary-200" />
								</Skeleton>
							</div>
						</Card>
					</div>
				</>
			}
			<ModalBoardData
				isOpen={isModalOpen}
				onOpenChange={toggleModal}
			/>
		</div>
	)
}
