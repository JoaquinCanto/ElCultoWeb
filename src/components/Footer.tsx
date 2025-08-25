import { FaInstagram } from "react-icons/fa6";
import { BiLogoDiscordAlt } from "react-icons/bi";
import { Button, Link, Tooltip } from "@heroui/react";


export default function Footer() {
	return (
		<footer>
			<div className='w-full flex flex-col items-center gap-4 border-t-1 border-neutral-800 p-4'>
				{/* <div className='flex gap-4'>
					<span><a href=''>Terminos y Condiciones</a></span>
					<span><a href=''>Política de Privacidad</a></span>

				</div> */}
				<div className="flex flex-row items-center gap-3">
					<p className="text-lg">Nuestras Redes:</p>
					<Tooltip
						className="dark bg-background text-purple-700 "
						content="Instagram"
					>
						<Link
							className="flex justify-center w-10 h-10 p-0"
							isBlock
							isExternal
							href="https://www.instagram.com/elculto.tallerderol/">
							<Button
								isIconOnly
								color="primary"
								variant="ghost"
							>
								<FaInstagram />
							</Button>
						</Link>
					</Tooltip>

					<Tooltip
						className="dark bg-background text-indigo-500 "
						content="Unite a nuestro Discord"
					>
						<Link
							className="flex justify-center w-10 h-10 p-0 text-indigo-500"
							isBlock
							isExternal
							href="https://discord.com/invite/cTd9VQhvAz">
							<Button
								className="text-indigo-500"
								isIconOnly
								variant="ghost"
							>
								<BiLogoDiscordAlt />
							</Button>
						</Link>
					</Tooltip>
				</div>
			</div>
		</footer>
	)
}
