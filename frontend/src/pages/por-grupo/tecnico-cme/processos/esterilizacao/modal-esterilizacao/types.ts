export enum TitlesCards {
    IniciarCiclo = `Dados de Equipamento`,
    CadastrarCaixas = `Leitura de caixas`,
    Visualizar = `Visualizar`,
}

export interface IPropsIniciarCiclo {
    formOptions: any
    equipamentouuid: any
}

export interface IPropsSelecionarProfissoes {
    profissoes: any
    handleSetProfissoes: (value: any) => void
    control: any
    register: any
    formOptions: any
}

export interface IPropsCadastrarCaixasEsterilizacao {
    caixas: any
    caixa: any
    listaCaixas: any
    handleSetCaixas: (value: any) => void

}

export interface IHeaderEsterilizacao {
    handleClickProsseguir: any
    handleEnviarEsterilizacao: any
    etapaCadastro: number
    setEtapaCadastro: (state: number) => void
    onClose: (success?:boolean)=> void
    salvando: boolean
    caixasSelecionadas: any
}
