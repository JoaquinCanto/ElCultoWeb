import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
	id: number;
	nombre: string;
	apodo: string;
	fechaNacimiento: string;
	email: string;
	tipo: string;
	quiereNarrar: boolean;
	habilitado: boolean;
	desabilitadoHasta?: string;
};

type Action = {
	updateId: (id: State['id']) => void;
	updateNombre: (nombre: State['nombre']) => void;
	updateApodo: (apodo: State['apodo']) => void;
	updateFechaNacimiento: (fechaNacimiento: State['fechaNacimiento']) => void;
	updateEmail: (email: State['email']) => void;
	updateTipo: (tipo: State['tipo']) => void;
	updateQuiereNarrar: (quiereNarrar: State['quiereNarrar']) => void;
	updateHabilitado: (estado: State['habilitado']) => void;
	updateDesabilitadoHasta: (desabilitadoHasta: State['desabilitadoHasta']) => void;
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
			quiereNarrar: false,
			habilitado: true,
			desabilitadoHasta: '',
			updateId: (id) => set(() => ({ id })),
			updateNombre: (nombre) => set(() => ({ nombre })),
			updateApodo: (apodo) => set(() => ({ apodo })),
			updateFechaNacimiento: (fechaNacimiento) => set(() => ({ fechaNacimiento })),
			updateEmail: (email) => set(() => ({ email })),
			updateTipo: (tipo) => set(() => ({ tipo })),
			updateQuiereNarrar: (quiereNarrar) => set(() => ({ quiereNarrar })),
			updateHabilitado: (habilitado) => set(() => ({ habilitado })),
			updateDesabilitadoHasta: (desabilitadoHasta) => set(() => ({ desabilitadoHasta })),
			clearStore: () =>
				set(() => ({
					id: -1,
					nombre: '',
					apodo: '',
					fechaNacimiento: '',
					email: '',
					tipo: '',
					quiereNarrar: false,
					habilitado: true,
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