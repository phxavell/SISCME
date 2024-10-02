
import {create} from "zustand"
import { SetorAPI, SetoresProps } from "@/infra/integrations/setor"
import { LoginResponse } from "@/infra/integrations/login"
import { SetorProps } from ".."

type Props = {
    setores: SetoresProps | null
    isLoading: boolean
    getSetores: (user: LoginResponse) => Promise<void>
    error: any
    openModalPreview: (data: SetorProps) => void
    closeModalPreview: () => void
    openModalEditar: (data: SetorProps) => void
    closeModalEditar: () => void
    openModalDelete: (data: SetorProps) => void
    closeModalDelete: () => void
    setor: SetorProps | null
    visibleModalPreview: boolean
    visibleModalEditar: boolean
    visibleModalDelete: boolean
    first: number
    setFirst: (atual:number)=> void
}

export const useSetorStore = create<Props>((set,get) => {
	return {
		setores: null,
		isLoading: false,
		error: null,
		setor: null,
		visibleModalPreview: false,
		visibleModalEditar: false,
		visibleModalDelete: false,
		first: 0,
		setFirst: (atual: number)=>set({first:atual}),
		getSetores: async (user) => {
			try {
				set({isLoading: true})
				const resp = await SetorAPI.listar(user, get().first+1)
				set({ setores: resp, isLoading: false})
			} catch (error) {
				set({error: error, isLoading: false})
			}
		},
		openModalPreview: (data) => {
			set({setor: data, visibleModalPreview: true})
		},
		closeModalPreview: () => {
			set({visibleModalPreview: false})
		},
		openModalEditar: (data) => {
			set({setor: data, visibleModalEditar: true})
		},
		closeModalEditar: () => {
			set({visibleModalEditar: false})
		},
		openModalDelete: (data) => {
			set({setor: data, visibleModalDelete: true})
		},
		closeModalDelete: () => {
			set({visibleModalDelete: false})
		}

	}
})
