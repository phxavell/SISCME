export interface Ocorrencia {
    tipo: string;
    quantidade: number;
  }

export interface ModalGeralUnicaOcorrenciaProps {

      total: number;
      tipos: Ocorrencia[];

  }


export interface IClienteTipo {
    [key: string]: number;
}

export interface ICliente {
    total_ocorrencias: number;
    tipos: IClienteTipo;
}

export interface IDadosGrafico {
    total: number;
    tipos: Array<{
        idindicador: number;
        quantidade: number;
        tipo: string;
    }>;
    clientes: { [key: string]: ICliente };
}

export interface IModalDadosGrafico {
    data: IDadosGrafico;
    showModal: boolean;
    closeModal: () => void;
}

export interface IHospitalData {
    hospitalName: string;
    quantidade: number;
    tipo: string;
}
