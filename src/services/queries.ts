import { useQuery } from "@tanstack/react-query";
import { getAllGames, getAllowedGames, getAllowedPlaces, getAllPlaces, getBoard, getBoards, getBoardsNarrated, getGameById, getOpenBoards, getPersonByEmail, getPersonById, getPersons, getPlaceById, getPlayerInscriptions } from "./api";

//-- Boards
export function useBoards() {
	return useQuery({
		queryKey: ["boards"],
		queryFn: getBoards,
	})
};

export function useOpenBoards() {
	return useQuery({
		queryKey: ["openBoards"],
		queryFn: getOpenBoards,
	});
};

export function useBoard(boardId: number) {
	return useQuery({
		queryKey: ["board", boardId],
		queryFn: () => getBoard(boardId!),
		enabled: !!boardId, // Ensures query only runs when boardId is valid
		refetchOnWindowFocus: false, // Prevents unnecessary refetches on focus
	})
};

export function useBoardsNarrated(narratorId: number) {
	return useQuery({
		queryKey: ["allBoardsNarrated"],
		queryFn: () => getBoardsNarrated(narratorId),
	})
};

//--Persons
export function usePersons() {
	return useQuery({
		queryKey: ["persons"],
		queryFn: getPersons,
	});
};

export function usePersonById(personId: number) {
	return useQuery({
		queryKey: ["personById", personId],
		queryFn: () => getPersonById(personId),
	})
};

export function usePersonByEmail(email: string) {
	return useQuery({
		queryKey: ["personByEmail", email],
		queryFn: () => getPersonByEmail(email),
		// enabled: !!email, // Only run when email is available
	});
};

//-- Games
export function useAllGames() {
	return useQuery({
		queryKey: ["allGames"],
		queryFn: () => getAllGames(),
	})
};

export function useAllowedGames() {
	return useQuery({
		queryKey: ["allowedGames"],
		queryFn: () => getAllowedGames(),
	})
};

export function useGameById(gameId: number) {
	return useQuery({
		queryKey: ["gameById", gameId],
		queryFn: () => getGameById(gameId),
	})
};

//-- Places
export function useAllPlaces() {
	return useQuery({
		queryKey: ["allPlaces"],
		queryFn: () => getAllPlaces(),
	})
};

export function useAllowedPlaces() {
	return useQuery({
		queryKey: ["allowedPlaces"],
		queryFn: () => getAllowedPlaces(),
	})
};

export function usePlaceById(placeId: number) {
	return useQuery({
		queryKey: ["placeById", placeId],
		queryFn: () => getPlaceById(placeId),
	})
};

//-- Inscriptions
export function usePlayerInscriptions(playerId: number) {
	return useQuery({
		queryKey: ["playerInscriptions"],
		queryFn: () => getPlayerInscriptions(playerId),
	})
};