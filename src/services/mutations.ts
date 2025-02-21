import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePersonStoreFill } from "../stores/personStoreFill";
import { BoardPost } from "../types/board";
import { PersonPost } from "../types/person";
import { InscriptionPost } from "../types/inscription";
import { GamePost, GameUpdate } from "../types/game";
import { PlacePost, PlaceUpdate } from "../types/place";
import {
	banPerson,
	createBoard,
	cancelBoard,
	cancelInscription,
	createGame,
	createInscription,
	createPerson,
	createPlace,
	getPersonByEmail,
	unbanPeson,
	unsubscribeGame,
	unsubscribePerson,
	updateBoard,
	updateGame,
	updatePlace,
	unsubscribePlace
} from "./api";

//-- Boards
export function useCreateBoard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BoardPost) => createBoard(data),
		// onMutate: () => {
		// 	console.log("mutate");
		// },

		// onError: () => {
		// 	console.log("error");
		// },

		// onSuccess: () => {
		// 	console.log("success");
		// },

		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on create board.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["openBoards"] });
			}
		},
	})
};

export function useUpdateBoard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, data }: { boardId: number; data: BoardPost }) => updateBoard(boardId, data),

		onSettled: async (_, error) => {
			if (error) {
				console.log("Error on update board.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["openBoards"] });
				await queryClient.invalidateQueries({ queryKey: ["allBoardsNarrated"] });
				await queryClient.invalidateQueries({ queryKey: ["board"] });
			}
		},
	})
};

export function useCancelBoard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (boardId: number) => cancelBoard(boardId),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on cancel board.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["openBoards"] });
				await queryClient.invalidateQueries({ queryKey: ["allBoardsNarrated"] });
			}
		},
	})
};

//-- Persons
export function useCreatePerson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: PersonPost) => createPerson(data),
		onSuccess: async (_, variables) => {
			try {
				const data = await getPersonByEmail(variables.email);
				// Update Zustand state
				usePersonStoreFill(data.items);

				// Also update the React Query cache
				queryClient.setQueryData(["person", variables.email], data);
			} catch (error) {
				console.error("Error fetching person after creation:", error);
			}
		},
		onError: (error) => {
			console.log("Error on create person: ", error);
		},
	})
};

export function useBanPerson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ personId, untilDate }: { personId: number; untilDate: string }) => banPerson(personId, untilDate),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on ban person.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["persons"] });
				// await queryClient.invalidateQueries({ queryKey: ["personById"] });
			}
		},
	})
};

export function useUnbanPerson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (personId: number) => unbanPeson(personId),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on unban person.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["persons"] });
				// await queryClient.invalidateQueries({ queryKey: ["personById"] });
			}
		},
	})
};

export function useUnsubscribePerson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (personId: number) => unsubscribePerson(personId),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on unsubscribe person.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["persons"] });
				await queryClient.invalidateQueries({ queryKey: ["personById"] });
			}
		},
	})
};

//-- Inscriptions
export function useCreateInscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: InscriptionPost) => createInscription(data),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on create inscripcion:", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["openBoards"] });
			}
		},
	})
};

export function useCancelInscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (inscriptionId: number) => cancelInscription(inscriptionId),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on cancel inscripcion:", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["playerInscriptions"] });
			}
		},
	})
};

//--Games
export function useCreateGame() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: GamePost) => createGame(data),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on create game person.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["allGames"] });
				await queryClient.invalidateQueries({ queryKey: ["allowedGames"] });
			}
		},
	})
};

export function useUpdateGame() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ gameId, data }: { gameId: number, data: GameUpdate }) => updateGame(gameId, data),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on create game person.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["allGames"] });
				await queryClient.invalidateQueries({ queryKey: ["allowedGames"] });
			}
		},
	})
}

export function useUnsubscribeGame() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (gameId: number) => unsubscribeGame(gameId),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on unsubscribe game.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["allGames"] });
				await queryClient.invalidateQueries({ queryKey: ["allowedGames"] });
			}
		},
	})
};

//--Places
export function useCreatePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: PlacePost) => createPlace(data),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on create place.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["allPlaces"] });
				await queryClient.invalidateQueries({ queryKey: ["allowedPlaces"] });
			}
		},
	})
};

export function useUpdatePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ placeId, data }: { placeId: number, data: PlaceUpdate }) => updatePlace(placeId, data),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on create game person.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["allPlaces"] });
				await queryClient.invalidateQueries({ queryKey: ["allowedPlaces"] });
			}
		},
	})
}

export function useUnsubscribePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (placeId: number) => unsubscribePlace(placeId),
		onSettled: async (_, error) => {
			// console.log("settled");
			if (error) {
				console.log("Error on unsubscribe game.", error);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["allPlaces"] });
				await queryClient.invalidateQueries({ queryKey: ["allowedPlaces"] });
			}
		},
	})
};