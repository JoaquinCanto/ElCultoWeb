import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, useDisclosure, Tooltip, Button } from "@heroui/react";
import { useState, useMemo } from "react";
import { EyeIcon, EditIcon, DeleteIcon } from "../components/Icons";
import { MdOutlineCancel } from "react-icons/md";
import ModalAction from "./ModalAction";
import { useCancelBoard, useCancelInscription } from "../services/mutations";
import { useBoard } from "../services/queries";
import ModalBoardData from "./ModalBoardData";

interface Column {
	key: string;
	label: string;
}

interface DisplayTableProps<T> {
	pages: number;
	columns: Column[];
	data: T[];
	actionType: "player" | "narrator";
}

export default function DisplayTable<T extends { key: number, mesa: number, estado: string }>({
	pages,
	columns,
	data,
	actionType
}: DisplayTableProps<T>) {
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	const [selectedItem, setSelectedItem] = useState<T | null>(null);
	const [modalType, setModalType] = useState<"view" | "unsubscribe" | "edit" | "cancel" | null>(null);
	const [isBoardDataOpen, setIsBoardDataOpen] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();


	const paginatedData = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return data.slice(start, end);
	}, [page, data]);

	const handleOpenModal = (item: T, type: "view" | "unsubscribe" | "edit" | "cancel") => {
		setSelectedItem(item);
		setModalType(type);

		if (type === "edit") {
			setIsBoardDataOpen(true)
		} else {
			onOpen();
		}
	};

	const cancelInscription = useCancelInscription();
	const cancelBoard = useCancelBoard();

	const handleConfirm = () => {
		if (selectedItem) {
			switch (modalType) {
				case "view":
					// console.log(`Nothing`);
					break;
				case "unsubscribe":
					cancelInscription.mutate(selectedItem.key);
					break;
				case "edit":
					console.log(`Editing table ${selectedItem.key}`);
					break;
				case "cancel":
					cancelBoard.mutate(selectedItem.mesa);
					break;
				default:
					break;
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
							onPress={() => handleOpenModal(item, "view")}
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
							onPress={() => handleOpenModal(item, "unsubscribe")}
						>
							<MdOutlineCancel />
						</Button>
					</Tooltip>
				</div>
			);
		} else if (actionType === "narrator") {
			return (
				<div className="relative flex items-center gap-2">
					<Tooltip content="Ver Mesa">
						<Button
							className="text-lg cursor-pointer active:opacity-50 w-[18px] h-[18px] flex items-center justify-center bg-transparent rounded p-0 min-w-0"
							isIconOnly
							color="primary"
							variant="light"
							onPress={() => handleOpenModal(item, "view")}
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
									onPress={() => handleOpenModal(item, "edit")}
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
									onPress={() => handleOpenModal(item, "cancel")}
								>
									<DeleteIcon />
								</Button>
							</Tooltip>
						</>
					}
				</div>
			);
		}
		return null;
	};

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

			{/* ModalAction Component */}
			{selectedItem && modalType && (
				<ModalAction
					title={
						modalType === "view"
							? "Mesa"
							: modalType === "unsubscribe"
								? "Desinscribirse de la mesa:"
								: modalType === "edit"
									? "Editar Mesa"
									: "Cancelar Mesa"
					}
					type={modalType}
					boardId={modalType === "view" || modalType === "edit" ? selectedItem.mesa : -1}
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
