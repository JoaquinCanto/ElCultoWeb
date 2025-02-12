export interface InscriptionResponse {
	status: number,
	total: number,
	items: InscriptionGet[]
}

export interface InscriptionGet {
	idInscripcion: number,
	idJugador: number,
	idMesa: number,
	asistencia: string,
	fechaInscripcion: string,
	mesa: {
		estado: string,
		fechaHora: string,
		// notas: string,
		juego: {
			nombre: string,
			// descripcion: string
		}
		lugar: {
			nombre: string
			direccion: string,
		}
		narrador: {
			apodo: string
		}
	}
}

export interface InscriptionPost {
	idJugador: number,
	idMesa: number,
	borrado: boolean
}