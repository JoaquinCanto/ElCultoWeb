import { PersonGet } from "../types/person";
import usePersonaStore from "./personaStore";

export function usePersonaStoreFill(data: PersonGet) {
	const {
		updateId,
		updateNombre,
		updateApodo,
		updateFechaNacimiento,
		updateEmail,
		updateTipo,
		updateHabilitado,
		updateDesabilitadoHasta
	} = usePersonaStore.getState();

	updateId(data.idPersona);
	updateNombre(data.nombre);
	updateApodo(data.apodo);
	updateFechaNacimiento(data.fechaNacimiento);
	updateEmail(data.email);
	updateTipo(data.tipo);
	updateHabilitado(data.habilitado);
	updateDesabilitadoHasta(data.desabilitadoHasta);
}