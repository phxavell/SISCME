import React from "react"
import {EquipamentosResponse} from "@infra/integrations/administrativo/types-equipamentos.ts"

export interface ModalUsuarioEquipamentoProps {
    visible: boolean
    onClose: (prop: boolean) => void
    equipamento: any
    setEquipamento: React.Dispatch<React.SetStateAction<EquipamentosResponse | undefined>>
}
export const defaultValuesEquipamentos = {
	idequipamento: 0,
	numero_serie: ``,
	descricao: ``,
	data_fabricacao: ``,
	registro_anvisa: 0,
	capacidade: 0,
	fabricante: ``,
	fornecedor: ``,
	ativo: ``
}
