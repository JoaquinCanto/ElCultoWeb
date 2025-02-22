import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
	id: number;
	nombre: string;
	apodo: string;
	fechaNacimiento: string;
	email: string;
	tipo: string;
	estado: string;
	quiereNarrar: boolean;
	inhabilitadoHasta?: string;
};

type Action = {
	updateId: (id: State['id']) => void;
	updateNombre: (nombre: State['nombre']) => void;
	updateApodo: (apodo: State['apodo']) => void;
	updateFechaNacimiento: (fechaNacimiento: State['fechaNacimiento']) => void;
	updateEmail: (email: State['email']) => void;
	updateTipo: (tipo: State['tipo']) => void;
	updateEstado: (estado: State['estado']) => void;
	updateQuiereNarrar: (quiereNarrar: State['quiereNarrar']) => void;
	updateInhabilitadoHasta: (inhabilitadoHasta: State['inhabilitadoHasta']) => void;
	clearStore: () => void;
};

const usePersonStore = create<State & Action>()(
	persist(
		(set) => ({
			id: -1,
			nombre: '',
			apodo: '',
			fechaNacimiento: '',
			email: '',
			tipo: '',
			estado: '',
			quiereNarrar: false,
			inhabilitadoHasta: '',
			updateId: (id) => set(() => ({ id })),
			updateNombre: (nombre) => set(() => ({ nombre })),
			updateApodo: (apodo) => set(() => ({ apodo })),
			updateFechaNacimiento: (fechaNacimiento) => set(() => ({ fechaNacimiento })),
			updateEmail: (email) => set(() => ({ email })),
			updateTipo: (tipo) => set(() => ({ tipo })),
			updateEstado: (estado) => set(() => ({ estado })),
			updateQuiereNarrar: (quiereNarrar) => set(() => ({ quiereNarrar })),
			updateInhabilitadoHasta: (inhabilitadoHasta) => set(() => ({ inhabilitadoHasta })),
			clearStore: () =>
				set(() => ({
					id: -1,
					nombre: '',
					apodo: '',
					fechaNacimiento: '',
					email: '',
					tipo: '',
					estado: '',
					quiereNarrar: false,
					desabilitadoHasta: '',
				})),
		}),
		{
			name: 'person-store', // Key in localStorage
			// storage: localStorage, // or sessionStorage
		}
	)
);

export default usePersonStore;