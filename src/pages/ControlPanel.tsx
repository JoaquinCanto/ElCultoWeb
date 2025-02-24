import { useState } from "react";
import { Button, ButtonGroup, Tooltip } from "@heroui/react"
import BoardsDetails from "../components/details/BoardsDetails";
import UsersDetails from "../components/details/UsersDetails";
import InscriptionsDetails from "../components/details/InscriptionsDetails";
import GamesDetails from "../components/details/GamesDetails";
import PlacesDetails from "../components/details/PlacesDetails";
import ModalGameActions from "../components/modals/ModalGameActions";
import { useCreateGame, useCreatePlace } from "../services/mutations";
import ModalPlaceActions from "../components/modals/ModalPlaceActions";
import { GiSpellBook } from "react-icons/gi";
import { MdPlace } from "react-icons/md";

const ControlPanel = () => {
	type ActiveView = "boards" | "users" | "games" | "places" | "inscriptions";
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
		<div className="flex flex-col gap-4 p-4">
			<div className="flex flex-row justify-center gap-4">
				<ButtonGroup variant="ghost">
					<Button
						onPress={() => setActiveView("boards")}
						color={activeView === "boards" ? "primary" : "default"}
					>
						Mesas</Button>
					<Button
						onPress={() => setActiveView("users")}
						color={activeView === "users" ? "primary" : "default"}
					>
						Usuarios</Button>
					<Button
						onPress={() => setActiveView("inscriptions")}
						color={activeView === "inscriptions" ? "primary" : "default"}
					>
						Inscripciones</Button>
					<Button
						onPress={() => setActiveView("games")}
						color={activeView === "games" ? "primary" : "default"}
					>
						Juegos</Button>
					<Button
						onPress={() => setActiveView("places")}
						color={activeView === "places" ? "primary" : "default"}
					>
						Lugares</Button>
				</ButtonGroup>

				{activeView === "games" &&
					<Tooltip
						content="Nuevo Juego"
						color="success"
					>
						<Button
							// className="w-10 h-10"
							isIconOnly
							color="success"
							variant="ghost"
							onPress={() => openGameModal("add")}
						>
							<GiSpellBook />
						</Button>
					</Tooltip>
				}
				{activeView === "places" &&
					<Tooltip
						content="Nuevo Lugar"
						color="success"
					>
						<Button
							isIconOnly
							color="success"
							variant="ghost"
							onPress={() => openPlaceModal("add")}
						>
							<MdPlace />
						</Button>
					</Tooltip>
				}
			</div>
			<div>
				{activeView === "boards" && <BoardsDetails />}
				{activeView === "users" && <UsersDetails />}
				{activeView === "inscriptions" && <InscriptionsDetails />}
				{activeView === "games" && <GamesDetails />}
				{activeView === "places" && <PlacesDetails />}
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