export enum TMessageAlert {
    Alert = `Alerta!`,
    Error = `Erro!`,
    Success = `Sucesso!`
}

export interface IMessagemApi {
    visibleModalError: boolean
    setVisibleModalError: any
    messageErrorApi: {
        type: TMessageAlert
        description: string
    }
}
