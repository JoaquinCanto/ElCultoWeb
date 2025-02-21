export interface PersonsResponse {
	status: number,
	total: number,
	items: PersonGet[]
}

export interface PersonSingleResponse {
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
	estado: string,
	quiereNarrar: boolean,
	fechaAlta: string,
	inhabilitadoHasta?: string,
	fechaBaja?: string
}

export interface PersonPost {
	nombre: string,
	apodo: string,
	fechaNacimiento: string,
	email: string,
	tipo: string,
	estado: string,
	quiereNarrar: boolean
}