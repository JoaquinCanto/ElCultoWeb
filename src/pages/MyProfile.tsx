import { Button, Checkbox, DatePicker, Input, Tooltip } from "@heroui/react"
import { usePersonById } from "../services/queries"
import usePersonStore from "../stores/personStore"
import { parseDate } from "@internationalized/date";
import { EditIcon } from "../components/Icons"
import ModalUserEdit from "../components/modals/ModalUserEdit";
import { useState } from "react";

const MyProfile = () => {

	const { id } = usePersonStore()
	const personByIdQuery = usePersonById(id);

	const [isModalUserEditOpen, setIsModalUserEditOpen] = useState(false);
	const toggleModalUserEdit = () => setIsModalUserEditOpen(!isModalUserEditOpen);

	const renderProfile = () => {
		const personData = personByIdQuery.data?.items;
		if (!personData) return null;

		return (
			<div className="flex flex-col gap-4">
				<Input
					className="max-w-xs"
					isReadOnly
					label="Nombre"
					labelPlacement="outside"
					value={personData.nombre}
					type="text"
					variant="bordered"
				/>

				<Input
					className="max-w-xs"
					isReadOnly
					label="Apodo"
					labelPlacement="outside"
					value={personData.apodo}
					type="text"
					variant="bordered"
				/>

				<DatePicker
					isReadOnly
					className="max-w-[284px]"
					label="Fecha de Nacimiento"
					labelPlacement="outside"
					value={parseDate(personData.fechaNacimiento.slice(0, 10))}
				/>

				<Input
					className="max-w-xs"
					isReadOnly
					label="Email"
					labelPlacement="outside"
					value={personData.email}
					type="email"
					variant="bordered"
				/>

				<Input
					className="max-w-xs"
					isReadOnly
					label="Tipo"
					labelPlacement="outside"
					value={personData.tipo}
					type="text"
					variant="bordered"
				/>

				<Input
					className="max-w-xs"
					isReadOnly
					label="Estado"
					labelPlacement="outside"
					value={personData.estado}
					type="text"
					variant="bordered"
				/>

				<Checkbox
					isDisabled
					size="lg"
					isSelected={personData.quiereNarrar}
				>
					¿Quieres ser Narrador?
				</Checkbox>

				{personData.inhabilitadoHasta ?
					<DatePicker
						isReadOnly
						className="max-w-[284px]"
						label="Estas Inhabilitado Hasta"
						labelPlacement="outside"
						value={parseDate(personData.inhabilitadoHasta.slice(0, 10))}
					/>
					: <></>
				}
			</div>
		)
	}


	return (
		<div className="flex flex-row p-4 gap-3">
			{renderProfile()}
			<div className="mt-6">
				<Tooltip content="Editar">
					<Button
						isIconOnly
						color="primary"
						variant="ghost"
						onPress={toggleModalUserEdit}
					>
						<EditIcon />
					</Button>
				</Tooltip>
			</div>

			{!personByIdQuery.isPending &&
				<ModalUserEdit
					personData={personByIdQuery.data?.items!}
					isOpen={isModalUserEditOpen}
					onOpenChange={toggleModalUserEdit}
				/>}
		</div>
	)
}

export default MyProfile