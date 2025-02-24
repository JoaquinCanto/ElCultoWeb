import { useEffect, useState } from "react";
import { supabase } from "../helpers/supabaseClient";
import { Button, Form, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../components/Icons";
import { PublicRoutes } from "../models/Routes";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { usePersonByEmail } from "../services/queries";
import { usePersonStoreFill } from "../stores/personStoreFill";

export default function LogIn() {
	const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	const contrasenaRE = /^(?=.*\d).{8,}$/;

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [email, setEmail] = useState<string>("");

	const personByEmailQuery = usePersonByEmail(email);

	useEffect(() => {
		if (personByEmailQuery.data && !personByEmailQuery.isPending) {
			usePersonStoreFill(personByEmailQuery.data.items);
			navigate(PublicRoutes.MESAS)
		}
		else if (personByEmailQuery.error) {
			onOpen(); // Open modal on error
		}

	}, [email,
		personByEmailQuery.data,
		personByEmailQuery.error,
		personByEmailQuery.isPending
	]);

	async function onSubmit(e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.currentTarget));

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: formData.email.toString(),
				password: formData.contrasena.toString(),
			})

			// console.log("Sign-in data:", data);
			console.log("Sign-in error:", error);

			if (error) {
				onOpen(); // show error modal if sign-in failed
				localStorage.clear();
				return;
			}

			// Update the email state so the query fires.
			setEmail(formData.email.toString());
			// Invalidate the query to ensure fresh data.
			queryClient.invalidateQueries({ queryKey: ["personByEmail", formData.email.toString()] });
			// Optionally, trigger a refetch:
			personByEmailQuery.refetch();
		}
		catch (error) {
			console.log("Error2: ", error);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<p className="font-bold text-2xl" >Iniciar Sesion</p>
			<Form
				validationBehavior="native"
				onSubmit={onSubmit}
				className="flex items-center gap-4 w-full max-w-sm"
			>
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

				<Button
					className="w-32"
					type="submit"
					color="primary"
					variant="ghost">
					Ingresar
				</Button>
			</Form>
			<div className="flex flex-col items-center gap-4">
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
								<Button
									color="success"
									as={Link} href={PublicRoutes.REGISTRARSE}
									showAnchorIcon
								>
									Registrarse
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}
