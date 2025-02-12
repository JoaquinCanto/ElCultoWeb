import { useQuery } from "@tanstack/react-query";
import { getBoard, getBoardsNarrated, getGames, getOpenBoards, getPersonByEmail, getPersons, getPlaces, getPlayerInscriptions } from "./api";

//-- Boards
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
export function usePersonByEmail(email: string) {
	return useQuery({
		queryKey: ["personByEmail", email],
		queryFn: () => getPersonByEmail(email),
		// enabled: !!email, // Only run when email is available
	});
};

//-- Games
export function useGames() {
	return useQuery({
		queryKey: ["games"],
		queryFn: () => getGames(),
	})
};

//-- Places
export function usePlaces() {
	return useQuery({
		queryKey: ["places"],
		queryFn: () => getPlaces(),
	})
};

//-- Inscriptions
export function usePlayerInscriptions(playerId: number) {
	return useQuery({
		queryKey: ["playerInscriptions"],
		queryFn: () => getPlayerInscriptions(playerId),
	})
};