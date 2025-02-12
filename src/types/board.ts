export interface BoardResponse {
	status: number,
	total: number,
	items: BoardGet[]
}
export interface BoardSingleResponse {
	status: number,
	total: number,
	items: BoardGet
}

export interface BoardGet {
	idMesa: number,
	idNarrador: number,
	idJuego: number,
	idLugar: number,
	fechaHora: string,
	notas: string,
	cupoMin: number,
	cupoMax: number,
	juego: {
		nombre: string,
		descripcion: string
	}
	lugar: {
		nombre: string
		direccion: string,
	}
	narrador: {
		apodo: string
	}
	jugadores: any,
	estado: string,
	publica: boolean,
	codigo: string,
	fechaCreacion: string
}

export interface BoardPost {
	idNarrador: number,
	idJuego: number,
	idLugar: number,
	fechaHora: string,
	notas: string,
	cupoMin: number,
	cupoMax: number,
	estado: string,
	publica: boolean,
	codigo?: string,
}
