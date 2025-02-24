import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import criticat from '../assets/CriticatSinFondo.png';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes } from '../models/Routes';
import usePersonStore from "../stores/personStore";
import { supabase } from "../helpers/supabaseClient";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const isMesasActive = location.pathname === PublicRoutes.MESAS || location.pathname === PublicRoutes.HOME;
	const isNosotrosActive = location.pathname === PublicRoutes.NOSOTROS;
	const isEventosActive = location.pathname === PublicRoutes.EVENTOS;
	const isFAQActive = location.pathname === PublicRoutes.FAQ;

	const menuItems = [
		'Mesas',
		'¿Quiénes somos?',
		'Proximos Eventos',
		'F.A.Q.',
	];

	const { id, apodo, tipo, updateApodo } = usePersonStore();
	const navigate = useNavigate();

	async function logOut() {
		const { error } = await supabase.auth.signOut()
		console.log(error);
		updateApodo("");
		usePersonStore.persist.clearStorage();
		localStorage.removeItem("person-store");

		if (location.pathname === PublicRoutes.MESAS) {
			window.location.reload();
		} else {
			navigate(PublicRoutes.MESAS);
		}
	}

	return (
		<Navbar shouldHideOnScroll isBordered onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent className='flex md:hidden'>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}

				/>
			</NavbarContent>

			<NavbarContent>
				<NavbarBrand className='justify-center md:justify-start'>
					<img src={criticat} className='max-w-16 max-h-16 ' />
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className='hidden md:flex gap-4' justify='center'>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MESAS} color={isMesasActive ? 'primary' : 'foreground'} className={isMesasActive ? 'font-bold' : 'font-normal'}>
						Mesas
					</Link>

				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.NOSOTROS} color={isNosotrosActive ? 'primary' : 'foreground'} className={isNosotrosActive ? 'font-bold' : 'font-normal'}>
						¿Quiénes somos?
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.EVENTOS} color={isEventosActive ? 'primary' : 'foreground'} className={isEventosActive ? 'font-bold' : 'font-normal'}>
						Proximos Eventos
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.FAQ} color={isFAQActive ? 'primary' : 'foreground'} className={isFAQActive ? 'font-bold' : 'font-normal'}>
						F.A.Q.
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent as='div' justify='end'>
				<Dropdown placement='bottom-end' className='dark text-foreground'>
					<DropdownTrigger>
						<Avatar
							isBordered
							as='button'
							className='transition-transform'
							color='secondary'
							name={apodo}
							size='sm'
							src=''
						/>
					</DropdownTrigger>
					<DropdownMenu aria-label='Profile Actions' variant='flat'>
						<DropdownItem key='profile' className='h-14 gap-2'>
							{apodo === '' ?
								<p className='font-semibold'>¡Aún no has ingresado!</p> :
								<>
									<p className='font-semibold'>Has ingresado como:</p>
									<p className='font-semibold'>{apodo}</p>
								</>}
						</DropdownItem>
						{(tipo === 'Administrador' && id !== -1) ?
							<DropdownItem key='administration' href={PrivateRoutes.ADMINISTRACION}>Panel de Administacion</DropdownItem> : <></>}
						{(tipo !== 'Jugador' && id !== -1) ?
							<DropdownItem key='reportes' href={PrivateRoutes.REPORTES}>Reportes</DropdownItem> : <></>}
						{/* <DropdownItem key='team_settings'>Team Settings</DropdownItem> */}
						{(id !== -1) ? <>
							<DropdownItem key='myBoards' href={PrivateRoutes.MISMESAS}>Mis Mesas</DropdownItem>
							<DropdownItem key='myProfile' href={PrivateRoutes.MIPERFIL}>Mi Perfil</DropdownItem>
						</> : <></>}
						{apodo === '' ? <>
							<DropdownItem key='register' color='primary' href={PublicRoutes.REGISTRARSE}>Registrate</DropdownItem>
							<DropdownItem key='login' color='success' href={PublicRoutes.INGRESAR}>Entrar</DropdownItem>

						</> :
							<DropdownItem key='logout' color='danger' onPress={logOut}>Salir</DropdownItem>
						}
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>

			<NavbarMenu className='dark text-foreground bg-neutral-900'>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							color={(item === 'Mesas' && isMesasActive) ? 'primary' : (item === '¿Quiénes somos?' && isNosotrosActive) ? 'primary' : (item === 'Proximos Eventos' && isEventosActive) ? 'primary' : (item === 'F.A.Q.' && isFAQActive) ? 'primary' : 'foreground'}
							className='w-full'
							href={item === 'Mesas' ? PublicRoutes.MESAS : item === '¿Quiénes somos?' ? PublicRoutes.NOSOTROS : item === 'Proximos Eventos' ? PublicRoutes.EVENTOS : PublicRoutes.FAQ}
							size='lg'
						>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	)
}
