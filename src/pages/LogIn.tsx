import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "../helpers/supabaseClient";
import usePersonaStore from "../stores/personaStore";
import { Button, Form, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../components/Icons";
import { PublicRoutes } from "../models/Routes";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
	const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	const contrasenaRE = /^(?=.*\d).{8,}$/;

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
		updateBanHasta,
	} = usePersonaStore();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const navigate = useNavigate();
	const [res, setRes] = useState<number>(-1);
	const [err, setErr] = useState<any>(false);

	useEffect(() => {
		if (res === 200 && err === null) {
			navigate(PublicRoutes.MESAS)
		}
		if (res === 400 && err.status === 422) {
			onOpen()
		}
	}, [res, err, navigate]);

	async function onSubmit(e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) {
		e.preventDefault();
		const info = Object.fromEntries(new FormData(e.currentTarget));

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
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
			await axios.get(`http://localhost:3000/persona/email/${info.email.toString()}`)
				.then(response => {
					setRes(response.status);
					if (response.status === 200) {
						const user = response.data.items;
						//Store in Zustand
						updateId(user.idPersona);
						updateNombre(user.nombre);
						updateApodo(user.apodo);
						updateFechaNacimiento(user.fechaNacimiento);
						updateEmail(user.email);
						updateTipo(user.tipo);
						updateEstado(user.estado);
						updateBanHasta(user.banHasta);
					}
				})
				.catch((error) => {
					setRes(error.status);
					console.error('Error posting data:', error);
				});

		} catch (error) {
			console.log("Response Axios error: ", error);
		};
	};

	return (
		<>
			<Form validationBehavior="native" onSubmit={onSubmit} className='h-full p-4 flex flex-wrap gap-4'>
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

				<Input
					className="max-w-xs"
					isRequired
					isClearable
					label="Contrasena"
					labelPlacement="outside"
					name="contrasena"
					placeholder="Ingresa una contraseña válida."
					type={isVisible ? "text" : "password"}
					validate={(value) => {
						if (!value.match(contrasenaRE)) {
							return "La contraseña ingresada es inválida.";
						}
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

				<Button type="submit" color="primary" variant="ghost">
					Ingresar
				</Button>
			</Form>
			<div>
				<p>
					¿No tienes cuenta?
				</p>
				<Button
					showAnchorIcon
					color="success"
					variant="bordered"
					as={Link}
					href={PublicRoutes.REGISTRARSE}
				>
					Registrate
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
									No existe un usuario registrado con ese email.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cerrar
								</Button>
								<Button color="success" as={Link} href={PublicRoutes.REGISTRARSE}>
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
