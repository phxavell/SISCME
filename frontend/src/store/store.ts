import {create} from 'zustand'

interface CaixaState {
    carregandoProdutos: boolean
    setCarregandoProdutos: (status: boolean)=> void
    modo_edicao: boolean
    setModoEdicao: (status: boolean)=> void,
    errosList: any[]
    setErrosList:(errosList: any[])=> void,
}

export const useCaixaStore = create<CaixaState>((set) => (
	{
		carregandoProdutos: false,
		modo_edicao: false,
		setModoEdicao: (status: boolean) => set(() => ({
			modo_edicao: status
		})),
		setCarregandoProdutos: (status: boolean) => set(() => ({
			carregandoProdutos: status
		})),
		errosList: [],
		setErrosList:(erros:any[]) => set(() => ({
			errosList: erros
		})),
	}
))
