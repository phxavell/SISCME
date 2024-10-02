import {InputNumberValueChangeEvent} from 'primereact/inputnumber'
import {TItemCaixa} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/schemas.ts'
import {DropdownFilterEvent} from "primereact/dropdown"

export enum TitlesCards {
    OrigemEIdentificacao = `Dados de origem e identificação`,
    DadosDeCriticidade = `Dados de esterilização`,
    DetalhesEspecificos = `Detalhes específicos`
}

export interface IPropsCardOrigemIdenticacao {
    clientesForTheForm: any[]
    tipos_caixa: any[]
    loadingOption: any
    handleAddTiposDeCaixa: any
    embalagens: any []
    uploadErro: any
    caixaEditando?: any
}

export interface IPropsDadosDeCriticidade {
    criticidades: any[]
    prioridades: any[]
    temperaturas: any[]
    loadingOption: any
}

export interface IPropsDetalhesEspecificos {
    situacoes: any[]
    categorias_uso: any[]
    loadingOption: any,
}

export const styleTdTitleInputDiv = `
    flex
    flex-column
    justify-content-center
    align-content-center
    justify-self-center
    `

export type THandlerSalvar = (itensSelecionados: any[], idEditando?: number) => Promise<boolean| undefined>
export interface IPropsHeader {
    itensSelecionadosParaCaixa: any []
    handleClickProsseguir: any
    loadingOption: boolean
    etapaCadastro: number
    salvando: boolean
    handleSalvar: THandlerSalvar
    setEtapaCadastro: (state: number) => void
    setShowModal: (state: boolean) => void
    idEditando?: number
}

export namespace ItensDinamicos {
    export type TOnChange = (keyItem: string, index: number) =>
        (event: InputNumberValueChangeEvent) => void
    export type TOnDelete = (index: number) => () => void
}

export interface IShowItensProps {
    handleChange: ItensDinamicos.TOnChange
    handleDelete: ItensDinamicos.TOnDelete
    itensCaixa: TItemCaixa[],
    criticidadesOptions: any[]
}

export interface IIDProps {
    itensSelecionadosParaCaixa: any
    setItensSelecionadosParaCaixa: any
    loadingOption: boolean
    itensParaSelecao: any[]
    onFilterItens: (e: DropdownFilterEvent) => void
    criticidadesOptions: any[]
}

export interface IUseProps {
    itensSelecionadosParaCaixa: any
    setItensSelecionadosParaCaixa: any
}
