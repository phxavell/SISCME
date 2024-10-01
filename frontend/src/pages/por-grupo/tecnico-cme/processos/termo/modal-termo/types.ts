export enum TitlesCards {
    IniciarCiclo = `Dados de Equipamento`,
    CadastrarCaixas = `Leitura de caixas`,
}

export interface IPropsIniciarCiclo {
    equipamentosuuid: any
    formOptions: any
}

export interface IPropsCadastrarCaixasTermo {
    caixasDisponiveis: any[]
    setCaixasSelecionadas: (value: any) => void
    caixasSelecionadas: any[]
    setVisibleModalError?: any
    setMessageErrorApi?: any,
}

export type THandlerSalvar = (itensSelecionados: any[], idEditando?: number) => Promise<boolean| undefined>

export interface IPropsHeaderTermo {
    handleClickProsseguir: any
    handleEnviarTermo: any
    etapaCadastro: number
    setEtapaCadastro: (state: number) => void
    setShowModal: (state: boolean) => void
    salvando: boolean
    caixa: any
    setSalvando: any
    setVisibleModalError?: any
    setMessageErrorApi?: any
}

export enum MessageType {
    SerialNaoEncontrado,
    SerialJaLido,
    SerialNaoInformado,
    PrimeiroCarregamento
}
