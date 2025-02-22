export interface GameResponse {
	status: number,
	total: number,
	items: GameGet[]
}

export interface GameSingleResponse {
	status: number,
	total: number,
	items: GameGet
}

export interface GameGet {
	idJuego: number,
	agregado: string,
	nombre: string,
	descripcion: string,
	estado: boolean,
	fechaBaja?: string
}

export interface GamePost {
	nombre: string,
	descripcion: string,
	estado: boolean,
}

export interface GameUpdate {
	nombre: string,
	descripcion: string,
	estado?: boolean,
	fechaBaja?: string
}

export interface TopGameResponse {
	status: number,
	total: number,
	items: TopGameGet[]
}

export interface TopGameGet {
	nombre: string,
	cantidadInscripciones: number
}
