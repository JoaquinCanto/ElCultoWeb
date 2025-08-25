import axios from "axios";
import { BoardPost, BoardResponse, BoardSingleResponse } from "../types/board";
import { PersonPost, PersonSingleResponse, PersonsResponse, PersonUpdate } from "../types/person";
import { GamePost, GameResponse, GameSingleResponse, GameUpdate, TopGameResponse } from "../types/game";
import { PlacePost, PlaceResponse, PlaceSingleResponse, PlaceUpdate } from "../types/place";
import { InscriptionPost, InscriptionResponse } from "../types/inscription";
import { SuggestionPost, SuggestionResponse, TopSuggestionResponse } from "../types/suggestion";
import { supabase } from "../helpers/supabaseClient";

const BASE_URL = "http://localhost:10000";
// const BASE_URL = "https://elcultoback.onrender.com";

const axiosInstance = axios.create({ baseURL: BASE_URL });
const { data: { session } } = await supabase.auth.getSession();
axiosInstance.defaults.headers.common['Authorization'] = session?.access_token;
const auth = { headers: { 'Authorization': session?.access_token } };

//-- Boards
export const getBoards = async () => {
	return (await axiosInstance.get<BoardResponse>("mesa", auth)).data;
};

export const getOpenBoards = async () => {
	return (await axiosInstance.get<BoardResponse>("mesa/abierta")).data;
};

export const getBoard = async (id: number) => {
	return (await axiosInstance.get<BoardSingleResponse>(`mesa/${id}`, auth)).data;
};

export const getBoardsNarrated = async (narratorId: number) => {
	return (await axiosInstance.get<BoardResponse>(`mesa/narrador/${narratorId}`, auth)).data;
};

export const createBoard = async (data: BoardPost) => {
	await axiosInstance.post("mesa", data, auth);
};

export const updateBoard = async (boardId: number, data: BoardPost) => {
	await axiosInstance.put(`mesa/${boardId}`, data, auth);
};

export const cancelBoard = async (boardId: number) => {
	await axiosInstance.put(`mesa/${boardId}`, { estado: 'Cancelada' }, auth);
};

//-- Persons
export const getPersons = async () => {
	return (await axiosInstance.get<PersonsResponse>("persona", auth)).data;
};

export const getPersonById = async (personId: number) => {
	return (await axiosInstance.get<PersonSingleResponse>(`persona/${personId}`, auth)).data;
};

export const getPersonByEmail = async (email: string) => {
	return (await axiosInstance.get<PersonSingleResponse>(`persona/email/${email}`, auth)).data;
};

export const createPerson = async (data: PersonPost) => {
	await axiosInstance.post("persona", data, auth);
};

export const updatePerson = async (personId: number, data: PersonUpdate) => {
	await axiosInstance.put(`persona/${personId}`, data, auth);
}

export const banPerson = async (personId: number, untilDate: string) => {
	await axiosInstance.put(`persona/${personId}`, { estado: 'Inhabilitado', inhabilitadoHasta: untilDate, auth });
};

export const unbanPeson = async (personId: number) => {
	await axiosInstance.put(`persona/${personId}`, { estado: 'Habilitado', inhabilitadoHasta: null, auth });
};

export const unsubscribePerson = async (personId: number) => {
	await axiosInstance.put(`persona/${personId}`, { estado: 'DeBaja', inhabilitadoHasta: new Date("9999-09-09T00:00:00.000Z").toISOString(), fechaBaja: new Date().toISOString() }, auth);
};

//-- Games
export const getAllGames = async () => {
	return (await axiosInstance.get<GameResponse>("juego", auth)).data;
};
export const getAllowedGames = async () => {
	return (await axiosInstance.get<GameResponse>("juego/habilitado", auth)).data;
};

export const getGameById = async (id: number) => {
	return (await axiosInstance.get<GameSingleResponse>(`juego/${id}`, auth)).data;
};

export const createGame = async (data: GamePost) => {
	await axiosInstance.post("juego", data, auth);
};

export const updateGame = async (gameId: number, data: GameUpdate) => {
	await axiosInstance.put(`juego/${gameId}`, data, auth);
};

export const getTopGames = async () => {
	return (await axiosInstance.get<TopGameResponse>("juego/top", auth)).data;
};

export const unsubscribeGame = async (gameId: number) => {
	await axiosInstance.put(`juego/${gameId}`, { estado: false, fechaBaja: new Date().toISOString() }, auth);
};

//-- Places
export const getAllPlaces = async () => {
	return (await axiosInstance.get<PlaceResponse>("lugar", auth)).data;
};

export const getAllowedPlaces = async () => {
	return (await axiosInstance.get<PlaceResponse>("lugar/habilitado", auth)).data;
};

export const getPlaceById = async (placeId: number) => {
	return (await axiosInstance.get<PlaceSingleResponse>(`lugar/${placeId}`, auth)).data;
}

export const createPlace = async (data: PlacePost) => {
	await axiosInstance.post("lugar", data, auth);
};

export const updatePlace = async (placeId: number, data: PlaceUpdate) => {
	await axiosInstance.put(`lugar/${placeId}`, data), auth;
};

export const unsubscribePlace = async (placeId: number) => {
	await axiosInstance.put(`lugar/${placeId}`, { estado: false, fechaBaja: new Date().toISOString() }, auth);
};

//-- Inscription
export const getInscriptions = async () => {
	return (await axiosInstance.get<InscriptionResponse>("inscripcion", auth)).data;
}

export const getPlayerInscriptions = async (playerId: number) => {
	return (await axiosInstance.get<InscriptionResponse>(`inscripcion/jugador/${playerId}`, auth)).data;
};

export const createInscription = async (data: InscriptionPost) => {
	await axiosInstance.post("inscripcion", data, auth);
};

export const cancelInscription = async (inscriptionId: number) => {
	await axiosInstance.put(`inscripcion/${inscriptionId}`, { baja: true }, auth);
};

//--Suggestion
export const getSuggestions = async () => {
	return (await axiosInstance.get<SuggestionResponse>("sugerencia", auth)).data;
};

export const getRelevantSuggestions = async () => {
	return (await axiosInstance.get<TopSuggestionResponse>("sugerencia/relevante", auth)).data;
};

export const createSuggestion = async (data: SuggestionPost) => {
	await axiosInstance.post("sugerencia", data, auth);
};