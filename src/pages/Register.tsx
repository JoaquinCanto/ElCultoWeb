import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../models/Routes";
import { supabase } from "../helpers/supabaseClient";
import { getLocalTimeZone, today } from "@internationalized/date";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../components/Icons";
import { Form, Input, Button, DatePicker, Link, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useCreatePerson } from "../services/mutations";

export default function Register() {
	const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	const contrasenaRE = /^(?=.*\d).{8,}$/;

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const navigate = useNavigate();

	const [err, setErr] = useState<any>(false);

	const createPersonMutation = useCreatePerson();

	useEffect(() => {
		if (createPersonMutation.isSuccess && err === null) {
			navigate(PublicRoutes.MESAS)
		}
		if (createPersonMutation.isError && err.status === 422) {
			onOpen()
		}
	}, [err, navigate, createPersonMutation.isSuccess, createPersonMutation.isError]);

	async function onSubmit(e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.currentTarget));
		const formattedFechaNacimiento = new Date(formData.fechaNacimiento.toString()).toISOString();

		try {
			const { error } = await supabase.auth.signUp({
				email: formData.email.toString(),
				password: formData.contrasena.toString(),
			})

			console.log("Error1: ", error);
			setErr(error);
		}
		catch (error) {
			console.log("Error2: ", error);
		}

		createPersonMutation.mutate({
			nombre: formData.nombre.toString(),
			apodo: formData.apodo.toString(),
			fechaNacimiento: formattedFechaNacimiento,
			email: formData.email.toString(),
			tipo: 'Jugador',
			estado: 'Habilitado',
			quiereNarrar: false
		});
	};

	return (
		<div className="flex flex-col items-center p-4 gap-3 ">
			<p className="font-bold text-2xl">Registrate</p>
			<Form
				validationBehavior="native"
				onSubmit={onSubmit}
				className='h-full flex items-center gap-4'>
				<Input
					isRequired
					isClearable
					label="Nombre"
					labelPlacement="outside"
					name="nombre"
					placeholder="¿Cuál es tu nombre?"
					type="text"
					validate={(value) => {
						if (value.length < 2) {
							return "Tu nombre debe tener por lo menos dos letras.";
						}
					}}
				/>

				<Input
					isRequired
					isClearable
					label="Apodo"
					labelPlacement="outside"
					name="apodo"
					placeholder="¿Cómo quieres que te llamen?"
					type="text"
					validate={(value) => {
						if (value.length < 2) {
							return "Tu apodo debe tener por lo menos dos letras.";
						}
					}}
				/>

				<DatePicker
					isRequired
					showMonthAndYearPickers
					maxValue={today(getLocalTimeZone())}
					label="Fecha de Nacimiento"
					labelPlacement="outside"
					name="fechaNacimiento"
					errorMessage={(value) => {
						if (value.isInvalid) {
							return "Ingresa una fecha válida.";
						}
					}}
				/>

				<Input
					isRequired
					isClearable
					label="Email"
					labelPlacement="outside"
					name="email"
					placeholder="¿Cuál es tu email?"
					type="email"
					validate={(value) => {
						if (!value.match(emailRE)) {
							return "Ingresa un mail válido.";
						}
					}}
				/>

				<div>
					<Input

						isRequired
						label="Contrasena"
						labelPlacement="outside"
						name="contrasena"
						placeholder="Ingresa una contraseña válida."
						type={isVisible ? "text" : "password"}
						validate={(value) => {
							if (!value.match(contrasenaRE)) {
								return "La contraseña ingresada es inválida.";
							}
							// else {
							// 	setContrasena(value);
							// }
						}}
						endContent={
							<button
								aria-label="toggle password visibility"
								className="focus:outline-none"
								type="button"
								onClick={toggleVisibility}
							>
								{isVisible ? (
									<EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
								) : (
									<EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
								)}
							</button>
						}
					/>
					<p className="text-gray-500 text-xs p-1">Ingresa una contraseña con al menos 8 caracteres y un número.</p>
				</div>

				{/* <Input
					isRequired
					isClearable
					label="Repetir Contrasena"
					labelPlacement="outside"
					name="reContrasena"
					placeholder="Vuelve a ingresar la contraseña."
					type={isVisibleRepeat ? "text" : "password"}
					validate={(value) => {
						if (!value.match(contrasenaRE) || value !== contrasena) {
							return "La contraseña ingresada es inválida o diferente.";
						}
					}}
					endContent={
						<button
							aria-label="toggle password visibility"
							className="focus:outline-none"
							type="button"
							onClick={toggleVisibilityRepeat}
						>
							{isVisibleRepeat ? (
								<EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
							) : (
								<EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
							)}
						</button>
					}
				/> */}

				<Button
					className="w-32"
					type="submit"
					color="primary"
					variant="ghost">
					¡Registrarse!
				</Button>
			</Form>
			<div className="flex flex-col items-center gap-4">
				<p>
					¿Ya tienes cuenta?
				</p>
				<Button
					showAnchorIcon
					color="success"
					variant="bordered"
					as={Link}
					href={PublicRoutes.INGRESAR}
				>
					Pagina de ingreso
				</Button>
			</div>
			<Modal
				className="dark text-foreground bg-background"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				placement="center"
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-red-500">Error</ModalHeader>
							<ModalBody>
								<p>
									Ya existe un usuario registrado con ese email.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cerrar
								</Button>
								<Button color="success" as={Link} href={PublicRoutes.INGRESAR}>
									Ingresar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}
