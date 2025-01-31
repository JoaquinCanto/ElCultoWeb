
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../models/Routes";
import { supabase } from "../helpers/supabaseClient";
import usePersonaStore from "../stores/personaStore";
import { getLocalTimeZone, today } from "@internationalized/date";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../components/Icons";
import { Form, Input, Button, DatePicker, Link, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

export default function Register() {
	const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	const contrasenaRE = /^(?=.*\d).{8,}$/;
	// const [contrasena, setContrasena] = useState("");

	// const [isVisiblePassword, setIsVisiblePassword] = useState(false);
	// const toggleVisibilityPassword = () => setIsVisiblePassword(!isVisiblePassword);
	// const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
	// const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const {
		updateId,
		updateNombre,
		updateApodo,
		updateFechaNacimiento,
		updateEmail,
		updateTipo,
		updateEstado,
	} = usePersonaStore();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const navigate = useNavigate();
	const [res, setRes] = useState<number>(-1);
	const [err, setErr] = useState<any>(false);

	useEffect(() => {
		if (res === 201 && err === null) {
			navigate(PublicRoutes.MESAS)
		}
		if (res === 400 && err.status === 422) {
			onOpen()
		}
	}, [res, err, navigate]);

	async function onSubmit(e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) {
		e.preventDefault();
		const info = Object.fromEntries(new FormData(e.currentTarget));
		const formattedFechaNacimiento = new Date(info.fechaNacimiento.toString()).toISOString();

		try {
			const { data, error } = await supabase.auth.signUp({
				email: info.email.toString(),
				password: info.contrasena.toString(),
			})

			console.log("Data: ", data);
			console.log("Error1: ", error);
			setErr(error);
		}
		catch (error) {
			console.log("Error2: ", error);
		}

		try {
			await axios.post("http://localhost:3000/persona", {
				nombre: info.nombre,
				apodo: info.apodo,
				fechaNacimiento: formattedFechaNacimiento,
				email: info.email,
				tipo: 'Jugador',
				estado: true
			})
				.then(response => {
					setRes(response.status);
					if (response.status === 201) {
						//Store in Zustand
						updateId(response.data.items.idPersona);
						updateNombre(info.nombre.toString());
						updateApodo(info.apodo.toString());
						updateFechaNacimiento(info.fechaNacimiento.toString());
						updateEmail(info.email.toString());
						updateTipo('Jugador');
						updateEstado(true);
					}
				})
				.catch((error) => {
					setRes(error.status);
					console.error('Error posting data:', error);
				});
		}
		catch (error) {
			console.log("Response Axios error: ", error);
		};
	};

	return (
		<>
			<Form validationBehavior="native" onSubmit={onSubmit} className='h-full p-4 flex flex-wrap gap-4'>
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
						className="max-w-xs"
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
					type="submit"
					color="primary"
					variant="ghost">
					¡Registrarse!
				</Button>
			</Form>
			<div>
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
		</>
	)
}
