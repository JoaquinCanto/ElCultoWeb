export interface PersonResponse {
	status: number,
	total: number,
	items: PersonGet
}

export interface PersonGet {
	idPersona: number,
	nombre: string,
	apodo: string,
	fechaNacimiento: string,
	email: string,
	tipo: string,
	quiereNarrar: boolean,
	habilitado: boolean,
	desabilitadoHasta?: string
}

export interface PersonPost {
	nombre: string,
	apodo: string,
	fechaNacimiento: string,
	email: string,
	tipo: string,
	quiereNarrar: boolean,
	habilitado: boolean,
	borrado: boolean
}