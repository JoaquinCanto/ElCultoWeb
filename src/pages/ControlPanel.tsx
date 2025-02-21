import { useState } from "react";
import { Button, ButtonGroup } from "@heroui/react"
import BoardsDetails from "../components/details/BoardsDetails";
import UsersDetails from "../components/details/UsersDetails";
import GamesDetails from "../components/details/GamesDetails";
import PlacesDetails from "../components/details/PlacesDetails";
import ModalGameActions from "../components/modals/ModalGameActions";
import { useCreateGame, useCreatePlace } from "../services/mutations";
import ModalPlaceActions from "../components/modals/ModalPlaceActions";

const ControlPanel = () => {
	type ActiveView = "boards" | "users" | "games" | "places";
	const [activeView, setActiveView] = useState<ActiveView>("boards");

	const [isGameModalOpen, setGameModalOpen] = useState(false);
	const [isPlaceModalOpen, setPlaceModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"add" | null>(null);

	const createGameMutation = useCreateGame();
	const createPlaceMutation = useCreatePlace();

	const openGameModal = (type: "add") => {
		setModalType(type);
		setGameModalOpen(true);
	};

	const handleConfirmGame = (game?: string, gameDescription?: string) => {
		setGameModalOpen(false);
		const data = {
			nombre: game!,
			descripcion: gameDescription!,
			estado: true
		}
		createGameMutation.mutate(data);
	};
	const openPlaceModal = (type: "add") => {
		setModalType(type);
		setPlaceModalOpen(true);
	};

	const handleConfirmPlace = (place?: string, placeAddress?: string) => {
		setGameModalOpen(false);
		const data = {
			nombre: place!,
			direccion: placeAddress!,
			estado: true
		}
		createPlaceMutation.mutate(data);
	};

	return (
		<div>
			<ButtonGroup variant="ghost">
				<Button onPress={() => setActiveView("boards")}>Mesas</Button>
				<Button onPress={() => setActiveView("users")}>Usuarios</Button>
				<Button onPress={() => setActiveView("games")}>Juegos</Button>
				<Button onPress={() => setActiveView("places")}>Lugares</Button>
			</ButtonGroup>
			<div>
				{activeView === "boards" && <BoardsDetails />}
				{activeView === "users" && <UsersDetails />}
				{activeView === "games" &&
					<div>
						<GamesDetails />
						<Button
							onPress={() => openGameModal("add")}
						>
							Nuevo Juego
						</Button>
					</div>
				}
				{activeView === "places" &&
					<div>
						<PlacesDetails />
						<Button
							onPress={() => openPlaceModal("add")}
						>
							Nuevo Lugar
						</Button>
					</div>
				}
			</div>

			{isGameModalOpen && (
				<ModalGameActions
					type={modalType}
					isOpen={isGameModalOpen}
					onOpenChange={setGameModalOpen}
					onConfirm={handleConfirmGame}
				/>
			)}

			{isPlaceModalOpen && (
				<ModalPlaceActions
					type={modalType}
					isOpen={isPlaceModalOpen}
					onOpenChange={setPlaceModalOpen}
					onConfirm={handleConfirmPlace}
				/>
			)}
		</div>
	)
}

export default ControlPanel