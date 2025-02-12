export interface GameResponse {
	status: number,
	total: number,
	items: Game[]
}
export interface Game {
	idJuego: number,
	nombre: string,
	descripcion: string
}