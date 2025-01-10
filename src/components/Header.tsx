import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@nextui-org/react';
import criticat from '../assets/CriticatSinFondo.png';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicRoutes } from '../models/Routes';


export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	// const isQuienesSomosActive = location.pathname === PublicRoutes.QUIENES_SOMOS;
	const isMesasActive = location.pathname === PublicRoutes.MESAS;

	const menuItems = [
		'¿Quiénes somos?',
		'Mesas',
		'Proximos Eventos',
		'F.A.Q.',
	];

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
					<Link color='foreground' href='#'>
						{/* <Link as={Link} href={PublicRoutes.QUIENES_SOMOS} color={isQuienesSomosActive ? 'primary' : 'foreground'} className={isQuienesSomosActive ? 'font-bold' : 'font-normal'}> */}
						¿Quiénes somos?
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MESAS} color={isMesasActive ? 'primary' : 'foreground'} className={isMesasActive ? 'font-bold' : 'font-normal'}>
						Mesas
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color='foreground' href='#'>
						Proximos Eventos
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color='foreground' href='#'>
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
							name='Jason Hughes'
							size='sm'
							src=''
						/>
					</DropdownTrigger>
					<DropdownMenu aria-label='Profile Actions' variant='flat'>
						<DropdownItem key='profile' className='h-14 gap-2'>
							<p className='font-semibold'>Signed in as</p>
							<p className='font-semibold'>zoey@example.com</p>
						</DropdownItem>
						<DropdownItem key='settings'>My Settings</DropdownItem>
						<DropdownItem key='team_settings'>Team Settings</DropdownItem>
						<DropdownItem key='analytics'>Analytics</DropdownItem>
						<DropdownItem key='system'>System</DropdownItem>
						<DropdownItem key='configurations'>Configurations</DropdownItem>
						<DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
						<DropdownItem key='logout' color='danger'>Log Out</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>

			<NavbarMenu className='dark text-foreground bg-neutral-900'>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							// color={(item === '¿Quiénes somos?' && isMM1Active) ? 'primary' : (item === 'Mesas' && isMesasActive) ? 'primary' : (item === 'Proximos Eventos' && isMM2Active) ? 'primary' : (item === 'F.A.Q.' && isMG1Active) ? 'primary' : 'foreground'}
							className='w-full'
							// href={item === '¿Quiénes somos?' ? PublicRoutes.MM1 : item === 'Mesas' ? PublicRoutes.MM1N : item === 'Proximos Eventos' ? PublicRoutes.MM2 : PublicRoutes.MG1}
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
