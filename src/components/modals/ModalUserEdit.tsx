import { Alert, Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch } from "@heroui/react";
import { useUpdatePerson } from "../../services/mutations";
import { PersonGet } from "../../types/person";
import { useEffect, useState } from "react";
import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import usePersonStore from "../../stores/personStore";

interface propTypes {
	personData: PersonGet,
	isOpen: boolean,
	onOpenChange: () => void,
}
const ModalUserEdit = (props: propTypes) => {
	const updatePersonMutation = useUpdatePerson();

	const { id } = usePersonStore();

	const [nombre, setNombre] = useState<string>(props.personData.nombre);
	const [apodo, setApodo] = useState<string>(props.personData.apodo);
	const [fechaNacimiento, setFechaNacimiento] = useState<CalendarDate>(parseDate(props.personData.fechaNacimiento.slice(0, 10)));
	const [quiereNarrar, setQuiereNarrar] = useState<boolean>(props.personData.quiereNarrar);

	const [alertInfo, setAlertInfo] = useState<{ title: string; description: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined } | null>(null);

	const showAlert = (titleText: string, descriptionText: string | null, color: "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined) => {
		setAlertInfo({ title: titleText, description: descriptionText, color: color });
	};

	useEffect(() => {
		if (!updatePersonMutation.isPending && updatePersonMutation.isSuccess) {
			props.onOpenChange();
		} else if (!updatePersonMutation.isPending && updatePersonMutation.isError) {
			showAlert("¡Error al editar la mesa!", null, "danger");
		}
	}, [
		updatePersonMutation.isPending,
		updatePersonMutation.isSuccess,
		updatePersonMutation.isError
	]);

	const updatePerson = () => {
		setAlertInfo(null);

		const updatedPersonData = {
			nombre: nombre,
			apodo: apodo,
			fechaNacimiento: fechaNacimiento.toString() + "T00:00:00.000Z",
			quiereNarrar: quiereNarrar
		}

		updatePersonMutation.mutate({ personId: id, data: updatedPersonData });
	}

	return (
		<Modal
			className="dark text-foreground bg-background"
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			placement="center"
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Agregar Nueva Mesa</ModalHeader>
						<ModalBody>
							<div className="flex flex-col gap-5">

								<Input
									className="w-full"
									isRequired
									label="Nombre"
									labelPlacement="outside"
									placeholder={props.personData.nombre}
									value={nombre}
									onValueChange={setNombre}
									type="text"
									variant="bordered"
								/>

								<Input
									isRequired
									className="w-full"
									label="Apodo"
									labelPlacement="outside"
									placeholder={props.personData.apodo}
									value={apodo}
									onValueChange={setApodo}
									type="text"
									variant="bordered"
								/>

								<DatePicker
									isRequired
									className="w-full"
									showMonthAndYearPickers
									maxValue={today(getLocalTimeZone())}
									label="Fecha de Nacimiento"
									labelPlacement="outside"
									variant="bordered"
									placeholderValue={parseDate(props.personData.fechaNacimiento.slice(0, 10))}
									value={fechaNacimiento}
									onChange={(newDate) => newDate && setFechaNacimiento(newDate)}
									errorMessage={(value) => {
										if (value.isInvalid) {
											return "Ingresa una fecha válida.";
										}
									}}
								/>

								<Switch
									size="sm"
									defaultSelected={props.personData.quiereNarrar}
									isSelected={quiereNarrar}
									onValueChange={setQuiereNarrar}
								>
									¿Quieres ser Narrador?
								</Switch>

							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Cerrar
							</Button>
							<Button
								color="success"
								onPress={updatePerson}
								isDisabled={updatePersonMutation.isPending}
							>
								{updatePersonMutation.isPending ? "Editando Datos..." : "Ediat Datos"}
							</Button>
						</ModalFooter>
						{alertInfo && (
							<Alert
								color={alertInfo.color}
								title={alertInfo.title}
								description={alertInfo.description}
								className="mb-4"
							/>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	)

}
export default ModalUserEdit