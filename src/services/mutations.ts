import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardPost } from "../types/board";
import { cancelBoard, cancelInscription, createBoard, createInscription, createPerson, getPersonByEmail, updateBoard } from "./api";
import { PersonPost } from "../types/person";
import { usePersonStoreFill } from "../stores/personStoreFill";
import { InscriptionPost } from "../types/inscription";

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
