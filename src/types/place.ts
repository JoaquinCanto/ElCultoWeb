export interface PlaceResponse {
	status: number,
	total: number,
	items: Place[]
}
export interface Place {
	idLugar: number,
	nombre: string,
	direccion: string
}