export interface SuggestionResponse {
	status: number,
	total: number,
	items: SuggestionGet[]
}

export interface SuggestionSingleResponse {
	status: number,
	total: number,
	items: SuggestionGet
}

export interface SuggestionGet {
	idSugerencia: number,
	idPersona: number,
	idJuego: number,
	persona: any,
	juego: any,
	fechaSugerencia: string,
	vieja: boolean
}

export interface SuggestionPost {
	idPersona: number,
	idJuego: number
}

export interface TopSuggestionResponse {
	status: number,
	total: number,
	items: TopSuggestionsGet[]
}

export interface TopSuggestionsGet {
	juego: string,
	cantidad: number
}