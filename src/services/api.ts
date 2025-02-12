import axios from "axios";
import { BoardPost, BoardResponse, BoardSingleResponse } from "../types/board";
import { PersonPost, PersonResponse } from "../types/person";
import { GameResponse } from "../types/game";
import { PlaceResponse } from "../types/place";
import { InscriptionPost, InscriptionResponse } from "../types/inscription";

const BASE_URL = "http://localhost:3000";
const axiosInstance = axios.create({ baseURL: BASE_URL });

//-- Boards
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
	return (await axiosInstance.get<PersonResponse[]>("persona")).data;
};

export const getPersonByEmail = async (email: string) => {
	return (await axiosInstance.get<PersonResponse>(`persona/email/${email}`)).data;
};

export const createPerson = async (data: PersonPost) => {
	await axiosInstance.post("persona", data);
};

//-- Games
export const getGames = async () => {
	return (await axiosInstance.get<GameResponse>("juego")).data;
};

//-- Places
export const getPlaces = async () => {
	return (await axiosInstance.get<PlaceResponse>("lugar")).data;
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