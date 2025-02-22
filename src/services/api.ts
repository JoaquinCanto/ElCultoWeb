import axios from "axios";
import { BoardPost, BoardResponse, BoardSingleResponse } from "../types/board";
import { PersonPost, PersonSingleResponse, PersonsResponse, PersonUpdate } from "../types/person";
import { GamePost, GameResponse, GameSingleResponse, GameUpdate, TopGameResponse } from "../types/game";
import { PlacePost, PlaceResponse, PlaceSingleResponse, PlaceUpdate } from "../types/place";
import { InscriptionPost, InscriptionResponse } from "../types/inscription";
import { SuggestionPost, SuggestionResponse, TopSuggestionResponse } from "../types/suggestion";

const BASE_URL = "http://localhost:3000";
const axiosInstance = axios.create({ baseURL: BASE_URL });

//-- Boards
export const getBoards = async () => {
	return (await axiosInstance.get<BoardResponse>("mesa")).data;
};

export const getOpenBoards = async () => {
	return (await axiosInstance.get<BoardResponse>("mesa/abierta")).data;
};

export const getBoard = async (id: number) => {
	return (await axiosInstance.get<BoardSingleResponse>(`mesa/${id}`)).data;
};

export const getBoardsNarrated = async (narratorId: number) => {
	return (await axiosInstance.get<BoardResponse>(`mesa/narrador/${narratorId}`)).data;
};

export const createBoard = async (data: BoardPost) => {
	await axiosInstance.post("mesa", data);
};

export const updateBoard = async (boardId: number, data: BoardPost) => {
	await axiosInstance.put(`mesa/${boardId}`, data);
};

export const cancelBoard = async (boardId: number) => {
	await axiosInstance.put(`mesa/${boardId}`, { estado: 'Cancelada' });
};

//-- Persons
export const getPersons = async () => {
	return (await axiosInstance.get<PersonsResponse>("persona")).data;
};

export const getPersonById = async (personId: number) => {
	return (await axiosInstance.get<PersonSingleResponse>(`persona/${personId}`)).data;
};

export const getPersonByEmail = async (email: string) => {
	return (await axiosInstance.get<PersonSingleResponse>(`persona/email/${email}`)).data;
};

export const createPerson = async (data: PersonPost) => {
	await axiosInstance.post("persona", data);
};

export const updatePerson = async (personId: number, data: PersonUpdate) => {
	await axiosInstance.put(`persona/${personId}`, data);
}

export const banPerson = async (personId: number, untilDate: string) => {
	await axiosInstance.put(`persona/${personId}`, { estado: 'Inhabilitado', inhabilitadoHasta: untilDate });
};

export const unbanPeson = async (personId: number) => {
	await axiosInstance.put(`persona/${personId}`, { estado: 'Habilitado', inhabilitadoHasta: null });
};

export const unsubscribePerson = async (personId: number) => {
	await axiosInstance.put(`persona/${personId}`, { estado: 'DeBaja', inhabilitadoHasta: new Date("9999-09-09T00:00:00.000Z").toISOString(), fechaBaja: new Date().toISOString() });
};

//-- Games
export const getAllGames = async () => {
	return (await axiosInstance.get<GameResponse>("juego")).data;
};
export const getAllowedGames = async () => {
	return (await axiosInstance.get<GameResponse>("juego/habilitado")).data;
};

export const getGameById = async (id: number) => {
	return (await axiosInstance.get<GameSingleResponse>(`juego/${id}`)).data;
};

export const createGame = async (data: GamePost) => {
	await axiosInstance.post("juego", data);
};

export const updateGame = async (gameId: number, data: GameUpdate) => {
	await axiosInstance.put(`juego/${gameId}`, data);
};

export const getTopGames = async () => {
	return (await axiosInstance.get<TopGameResponse>("juego/top")).data;
};

export const unsubscribeGame = async (gameId: number) => {
	await axiosInstance.put(`juego/${gameId}`, { estado: false, fechaBaja: new Date().toISOString() });
};

//-- Places
export const getAllPlaces = async () => {
	return (await axiosInstance.get<PlaceResponse>("lugar")).data;
};

export const getAllowedPlaces = async () => {
	return (await axiosInstance.get<PlaceResponse>("lugar/habilitado")).data;
};

export const getPlaceById = async (placeId: number) => {
	return (await axiosInstance.get<PlaceSingleResponse>(`lugar/${placeId}`)).data;
}

export const createPlace = async (data: PlacePost) => {
	await axiosInstance.post("lugar", data);
};

export const updatePlace = async (placeId: number, data: PlaceUpdate) => {
	await axiosInstance.put(`lugar/${placeId}`, data);
};

export const unsubscribePlace = async (placeId: number) => {
	await axiosInstance.put(`lugar/${placeId}`, { estado: false, fechaBaja: new Date().toISOString() });
};

//-- Inscription
export const getPlayerInscriptions = async (playerId: number) => {
	return (await axiosInstance.get<InscriptionResponse>(`inscripcion/jugador/${playerId}`)).data;
};

export const createInscription = async (data: InscriptionPost) => {
	await axiosInstance.post("inscripcion", data);
};

export const cancelInscription = async (inscriptionId: number) => {
	await axiosInstance.put(`inscripcion/${inscriptionId}`, { borrado: true });
};

//--Suggestion
export const getSuggestions = async () => {
	return (await axiosInstance.get<SuggestionResponse>("sugerencia")).data;
};

export const getRelevantSuggestions = async () => {
	return (await axiosInstance.get<TopSuggestionResponse>("sugerencia/relevante")).data;
};

export const createSuggestion = async (data: SuggestionPost) => {
	await axiosInstance.post("sugerencia", data);
};