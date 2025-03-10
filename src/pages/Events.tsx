import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";

const Events = () => {
	return (
		<div className="flex flex-col justify-center gap-4 p-4">
			<Card className="w-full sm:w-80">
				<CardHeader>
					<h1 className="text-2xl font-bold">3º Cumpleaños</h1>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="flex flex-col items-center">
						<p>¡Estan todos invitados al tercer cumpleaños de El Culto!</p>
						<p>Proximamente estaremos dando más detalles</p>
					</div>
				</CardBody>
				<Divider />
				<CardFooter className="flex justify-end">
					<Button>Ver mas</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default Events