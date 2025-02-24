import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, useDisclosure, Tooltip, Button } from "@heroui/react";
import { useState, useMemo } from "react";
import { EyeIcon, EditIcon, DeleteIcon } from "../components/Icons";
import { LuTimer, LuTimerOff } from "react-icons/lu";
import { MdOutlineCancel } from "react-icons/md";
import ModalUserActions from "./modals/ModalUserActions";
import { useBanPerson, useCancelBoard, useCancelInscription, useUnbanPerson, useUnsubscribeGame, useUnsubscribePerson, useUnsubscribePlace, useUpdateGame, useUpdatePlace } from "../services/mutations";
import { useBoard } from "../services/queries";
import ModalBoardData from "./modals/ModalBoardData";
import ModalBoardActions from "./modals/ModalBoardActions";
import ModalGameActions from "./modals/ModalGameActions";
import ModalPlaceActions from "./modals/ModalPlaceActions";
import ModalInscriptionActions from "./modals/ModalInscriptionActions";

interface Column {
	key: string;
	label: string;
}

interface DisplayTableProps<T> {
	pages: number;
	columns: Column[];
	data: T[];
	actionType: "player" | "narrator" | "admin" | "board" | "user" | "inscription" | "game" | "place";
}

export default function DisplayTable<T extends { key: number, mesa?: number, estado?: string, habilitado?: boolean }>({ // 
	pages,
	columns,
	data,
	actionType
}: DisplayTableProps<T>) {
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	const [selectedItem, setSelectedItem] = useState<T | null>(null);
	const [modalAction, setModalAction] = useState<"view" | "ban" | "unban" | "unsubscribe" | "add" | "edit" | "cancel" | null>(null);
	const [activeModal, setActiveModal] = useState<"board" | "user" | "inscription" | "game" | "place" | null>(null);
	const [isBoardDataOpen, setIsBoardDataOpen] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const paginatedData = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return data.slice(start, end);
	}, [page, data]);

	const handleOpenModal = (
		item: T,
		entity: "board" | "user" | "inscription" | "game" | "place",
		action: "view" | "ban" | "unban" | "unsubscribe" | "add" | "edit" | "cancel"
	) => {
		setSelectedItem(item);
		setActiveModal(entity);
		setModalAction(action);
		if (entity === "board") {
			// If we are editing a board, open the dedicated edit modal
			if (action === "edit" && item.mesa !== undefined) {
				setIsBoardDataOpen(true);
			} else {
				onOpen();
			}
		} else {
			// For other entity types, simply open the modal
			onOpen();
		}
	};

	//--Board Mutations
	const cancelInscription = useCancelInscription();
	const cancelBoard = useCancelBoard();

	//--User Mutations
	const banPersonMutation = useBanPerson();
	const unbanPersonMutation = useUnbanPerson();
	const unsubscribePersonMutation = useUnsubscribePerson();

	//--Game Mutation
	const updateGameMutation = useUpdateGame();
	const unsubscribeGameMutation = useUnsubscribeGame();

	//--Place Mutations
	const updatePlaceMutation = useUpdatePlace();
	const unsubscribePlaceMutation = useUnsubscribePlace();

	const handleConfirm = (arg1?: string, arg2?: string) => {
		if (selectedItem) {
			if (activeModal === "board") {
				switch (modalAction) {
					case "view":
						// Do nothing extra for view
						break;
					case "unsubscribe":
						cancelInscription.mutate(selectedItem.key);
						break;
					case "edit":
						console.log(`Editing board ${selectedItem.key}`);
						break;
					case "cancel":
						cancelBoard.mutate(selectedItem.mesa!);
						break;
					default:
						break;
				}
			}
			if (activeModal === "user") {
				switch (modalAction) {
					case "ban":
						banPersonMutation.mutate({ personId: selectedItem.key, untilDate: arg1! });
						break;
					case "unban":
						unbanPersonMutation.mutate(selectedItem.key);
						break;
					case "unsubscribe":
						unsubscribePersonMutation.mutate(selectedItem.key);
						break;
				}
			}
			if (activeModal === "inscription") {
				switch (modalAction) {
					case "view":
						// Do nothing extra for view
						break;
					case "unsubscribe":
						cancelInscription.mutate(Number(arg1));
						break;
				}
			}
			if (activeModal === "game") {
				switch (modalAction) {
					case "edit":
						const data = {
							nombre: arg1!,
							descripcion: arg2!,
						}
						updateGameMutation.mutate({ gameId: selectedItem.key, data: data });
						break;
					case "unsubscribe":
						unsubscribeGameMutation.mutate(selectedItem.key);
						break;
				}
			}
			if (activeModal === "place") {
				switch (modalAction) {
					case "edit":
						const data = {
							nombre: arg1!,
							direccion: arg2!,
						}
						updatePlaceMutation.mutate({ placeId: selectedItem.key, data: data });
						break;
					case "unsubscribe":
						unsubscribePlaceMutation.mutate(selectedItem.key);
						break;
				}
			}
		}
	};

	const renderActions = (item: T) => {
		if (actionType === "player") {
			return (
				<div className="relative flex items-center gap-2">
					<Tooltip content="Ver Mesa">
						<Button
							className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0" //text-default-400
							isIconOnly
							color="primary"
							variant="light"
							onPress={() => handleOpenModal(item, "board", "view")}
						>
							<EyeIcon />
						</Button>
					</Tooltip>
					<Tooltip content="Desinscribirse" color="danger">
						<Button
							className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
							isIconOnly
							color="danger"
							variant="light"
							onPress={() => handleOpenModal(item, "board", "unsubscribe")}
						>
							<MdOutlineCancel />
						</Button>
					</Tooltip>
				</div>
			);
		}
		else if (actionType === "narrator") {
			return (
				<div className="relative flex items-center gap-2">
					<Tooltip content="Ver Mesa">
						<Button
							className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
							isIconOnly
							color="primary"
							variant="light"
							onPress={() => handleOpenModal(item, "board", "view")}
						>
							<EyeIcon />
						</Button>
					</Tooltip>
					{(item.estado === "Abierta" || item.estado === "Cerrada") &&
						<>
							<Tooltip content="Editar Mesa">
								<Button
									className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
									isIconOnly
									color="primary"
									variant="light"
									onPress={() => handleOpenModal(item, "board", "edit")}
								>
									<EditIcon />
								</Button>
							</Tooltip>

							<Tooltip content="Cancelar Mesa" color="danger">
								<Button
									className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
									isIconOnly
									color="danger"
									variant="light"
									onPress={() => handleOpenModal(item, "board", "cancel")}
								>
									<DeleteIcon />
								</Button>
							</Tooltip>
						</>
					}
				</div>
			);
		}
		else if (actionType === "board") {
			return (

				<div className="relative flex items-center gap-2">
					<Tooltip content="Ver Mesa">
						<Button
							className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
							isIconOnly
							color="primary"
							variant="light"
							onPress={() => handleOpenModal(item, "board", "view")}
						>
							<EyeIcon />
						</Button>
					</Tooltip>
					{(item.estado === "Abierta" || item.estado === "Cerrada") &&
						<Tooltip content="Cancelar Mesa" color="danger">
							<Button
								className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
								isIconOnly
								color="danger"
								variant="light"
								onPress={() => handleOpenModal(item, "board", "cancel")}
							>
								<DeleteIcon />
							</Button>
						</Tooltip>
					}
				</div>
			)
		}
		else if (actionType === "user") {
			return (
				<div className="relative flex items-center gap-2">
					{item.estado === 'Habilitado' &&
						<Tooltip content="Inhabilitar" color="danger">
							<Button
								className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
								isIconOnly
								color="danger"
								variant="light"
								onPress={() => handleOpenModal(item, "user", "ban")}
							>
								<LuTimer />
							</Button>
						</Tooltip>
					}
					{item.estado === 'Inhabilitado' &&
						<Tooltip content="Rehabilitar" color="success">
							<Button
								className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
								isIconOnly
								color="success"
								variant="light"
								onPress={() => handleOpenModal(item, "user", "unban")}
							>
								<LuTimerOff />
							</Button>
						</Tooltip>
					}
					{item.estado !== 'DeBaja' &&
						<Tooltip content="Dar de Baja" color="danger">
							<Button
								className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
								isIconOnly
								color="danger"
								variant="light"
								onPress={() => handleOpenModal(item, "user", "unsubscribe")}
							>
								<MdOutlineCancel />
							</Button>
						</Tooltip>
					}
				</div>
			)
		}
		else if (actionType === "inscription") {
			return (
				<div className="relative flex items-center gap-2">
					<Tooltip content="Ver Mesa">
						<Button
							className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
							isIconOnly
							color="primary"
							variant="light"
							onPress={() => handleOpenModal(item, "inscription", "view")}
						>
							<EyeIcon />
						</Button>
					</Tooltip>
					{item.estado === "false" &&
						<Tooltip content="Cancelar Inscripcion" color="danger">
							<Button
								className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
								isIconOnly
								color="danger"
								variant="light"
								onPress={() => handleOpenModal(item, "inscription", "unsubscribe")}
							>
								<MdOutlineCancel />
							</Button>
						</Tooltip>
					}
				</div>
			)
		}
		else if (actionType === "game") {
			return (
				<>
					{item.habilitado &&
						<div className="relative flex items-center gap-2">
							<Tooltip content="Editar" >
								<Button
									className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
									isIconOnly
									color="primary"
									variant="light"
									onPress={() => handleOpenModal(item, "game", "edit")}
								>
									<EditIcon />
								</Button>
							</Tooltip>
							<Tooltip content="Dar de Baja" color="danger">
								<Button
									className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
									isIconOnly
									color="danger"
									variant="light"
									onPress={() => handleOpenModal(item, "game", "unsubscribe")}
								>
									<MdOutlineCancel />
								</Button>
							</Tooltip>
						</div>
					}
				</>
			)
		}
		else if (actionType === "place") {
			return (
				<>
					{item.habilitado &&
						<div className="relative flex items-center gap-2">
							<Tooltip content="Editar" >
								<Button
									className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
									isIconOnly
									color="primary"
									variant="light"
									onPress={() => handleOpenModal(item, "place", "edit")}
								>
									<EditIcon />
								</Button>
							</Tooltip>
							<Tooltip content="Dar de Baja" color="danger">
								<Button
									className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
									isIconOnly
									color="danger"
									variant="light"
									onPress={() => handleOpenModal(item, "place", "unsubscribe")}
								>
									<MdOutlineCancel />
								</Button>
							</Tooltip>
						</div>
					}
				</>
			)
		}
		return null;
	};
	// };

	const boardQuery = useBoard(selectedItem?.mesa ?? 0);

	return (
		<>
			<Table
				isStriped
				aria-label="Data Table"
				bottomContent={
					<div className="flex w-full justify-center">
						<Pagination
							isCompact
							showControls
							showShadow
							color="secondary"
							page={page}
							total={pages}
							onChange={(newPage) => setPage(newPage)}
						/>
					</div>
				}
				classNames={{
					wrapper: "min-h-[222px]",
				}}
			>
				<TableHeader columns={columns}>
					{(column) => <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>}
				</TableHeader>
				<TableBody items={paginatedData}>
					{(item) => (
						<TableRow key={item.key}>
							{columns.map((column) => (
								<TableCell key={column.key}>
									{column.key === "acciones" ? renderActions(item) : <p>{String(item[column.key as keyof T])}</p>}
								</TableCell>
							))}
						</TableRow>
					)}
				</TableBody>
			</Table>

			{activeModal === "board" && selectedItem && modalAction && (
				<ModalBoardActions
					title={
						modalAction === "view"
							? "Mesa"
							: modalAction === "unsubscribe"
								? "Desinscribirse de la mesa:"
								: modalAction === "edit"
									? "Editar Mesa"
									: "Cancelar Mesa"
					}
					type={modalAction}
					boardId={selectedItem.mesa!}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onConfirm={handleConfirm}
				/>
			)}

			{activeModal === "user" && selectedItem && (
				<ModalUserActions
					type={modalAction}
					userId={selectedItem.key}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onConfirm={handleConfirm}
				/>
			)}

			{activeModal === "inscription" && selectedItem && (
				<ModalInscriptionActions
					type={modalAction}
					inscriptionId={selectedItem.key}
					boardId={selectedItem.mesa!}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onConfirm={handleConfirm}
				/>
			)}

			{activeModal === "game" && selectedItem && (
				<ModalGameActions
					type={modalAction}
					gameId={selectedItem.key}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onConfirm={handleConfirm}
				/>
			)}

			{activeModal === "place" && selectedItem && (
				<ModalPlaceActions
					type={modalAction}
					placeId={selectedItem.key}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onConfirm={handleConfirm}
				/>
			)}

			{isBoardDataOpen && selectedItem && (
				<ModalBoardData
					isOpen={isBoardDataOpen}
					onOpenChange={() => setIsBoardDataOpen(false)}
					boardToEdit={boardQuery.data?.items}
				/>
			)}
		</>
	);
}
