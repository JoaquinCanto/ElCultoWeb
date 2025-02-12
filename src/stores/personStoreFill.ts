import { PersonGet } from "../types/person";
import usePersonStore from "./personStore";

export function usePersonStoreFill(data: PersonGet) {
	const {
		updateId,
		updateNombre,
		updateApodo,
		updateFechaNacimiento,
		updateEmail,
		updateTipo,
		updateHabilitado,
		updateDesabilitadoHasta
	} = usePersonStore.getState();

	updateId(data.idPersona);
	updateNombre(data.nombre);
	updateApodo(data.apodo);
	updateFechaNacimiento(data.fechaNacimiento);
	updateEmail(data.email);
	updateTipo(data.tipo);
	updateHabilitado(data.habilitado);
	updateDesabilitadoHasta(data.desabilitadoHasta);
}