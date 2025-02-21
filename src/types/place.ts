export interface PlaceResponse {
	status: number,
	total: number,
	items: PlaceGet[]
}

export interface PlaceSingleResponse {
	status: number,
	total: number,
	items: PlaceGet
}

export interface PlaceGet {
	idLugar: number,
	agregado: string,
	nombre: string,
	direccion: string,
	estado: boolean,
	fechaBaja?: string
}

export interface PlacePost {
	nombre: string,
	direccion: string,
	estado: boolean,
}

export interface PlaceUpdate {
	nombre: string,
	direccion: string,
	estado?: boolean,
	fechaBaja?: string
}