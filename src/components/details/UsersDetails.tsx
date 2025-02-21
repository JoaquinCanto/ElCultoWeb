import { usePersons } from "../../services/queries";
import { PersonGet } from "../../types/person";
import DisplayTable from "../DisplayTable";


const UsersDetails = () => {
	const columnsUsers = [
		{ key: "fechaAlta", label: "Miembro Desde" },
		{ key: "nombre", label: "Nombre" },
		{ key: "apodo", label: "Apodo" },
		{ key: "fechaNacimiento", label: "Fecha de Nacimiento" },
		{ key: "email", label: "Email" },
		{ key: "tipo", label: "Tipo" },
		{ key: "estado", label: "Estado" },
		{ key: "quiereNarrar", label: "¿Quiere Narrar?" },
		{ key: "inhabilitadoHasta", label: "Inhabilitado Hasta" },
		{ key: "fechaBaja", label: "Fecha de Baja" },
		{ key: "acciones", label: "Acciones" }
	]

	const usersQuery = usePersons();

	const dataUsers = usersQuery.data?.items.map((userData: PersonGet) => (
		{
			key: userData.idPersona,
			nombre: userData.nombre,
			apodo: userData.apodo,
			fechaNacimiento: userData.fechaNacimiento,
			email: userData.email,
			tipo: userData.tipo,
			estado: userData.estado,
			quiereNarrar: userData.quiereNarrar,
			fechaAlta: userData.fechaAlta,
			inhabilitadoHasta: userData.inhabilitadoHasta,
			fechaBaja: userData.fechaBaja
		}
	)) ?? [];

	const pagesUsers = usersQuery.data !== undefined ? Math.ceil(usersQuery.data.items.length / 10) : 0;

	return (
		<DisplayTable
			pages={pagesUsers}
			columns={columnsUsers}
			data={dataUsers}
			actionType="user"
		/>
	)
}

export default UsersDetails