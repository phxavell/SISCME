import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { ModalEquipamentos } from '.'
import { useModalEquipamentos } from './useModalEquipamentos'
import { defaultValuesEquipamentos } from './types'

const equipamento = {
	"idequipamento": 1,
	"descricao": `Equipamento Hospitalar`,
	"numero_serie": `2332323`,
	"criado_por": {
		"id": 1,
		"username": `administrador`,
		"nome": `Mestre dos Magos`
	},
	"atualizado_por": {
		"id": 1,
		"username": `administrador`,
		"nome": `Mestre dos Magos`
	},
	"criado_em": `2023-11-28T08:37:34.288457-04:00`,
	"atualizado_em": `2023-11-28T09:38:12.482318-04:00`,
	"data_fabricacao": `2023-11-08`,
	"registro_anvisa": `7845123`,
	"capacidade": `10`,
	"fabricante": `Fametro`,
	"tipo": `TD`,
	"ativo": true,
	"ultima_manutencao": null,
	"proxima_manutencao": null
}

describe(`EquipamentosPage [caixa branca]`, () => {
	it.skip(`Renderiza o componente ModalEquipamentos corretamente`, () => {
		render(<ModalEquipamentos visible={true} equipamento={equipamento} onClose={() => {
		}} setEquipamento={() => {
		}} />)

		const titulo = screen.getByText(`Novo Equipamento`)

		expect(titulo).toBeInTheDocument()
	})

	it.skip(`Renderizar mensagens de campo obrigatório`, async () => {
		render(<ModalEquipamentos visible={true} equipamento={equipamento} onClose={() => {
		}} setEquipamento={() => {
		}} />)

		const botaoCadastrar = screen.getByTestId(`botao-cadastrar-equipamento`)
		fireEvent.click(botaoCadastrar)

		waitFor(() => {
			expect(screen.getByText(`Campo Obrigatório`)).toBeInTheDocument()
			const erros = screen.getAllByText(`Campo Obrigatório`)
			expect(erros.length).toEqual(4)
		})
	})
})

describe(`useEquipamento [caixa branca]`, () => {
	it.skip(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const onClose = () => {
		}
		const equipamento = defaultValuesEquipamentos
		const setEquipamento = () => {
		}
		const visible = true
		const { result } = renderHook(() => useModalEquipamentos({ onClose, equipamento, setEquipamento, visible }))

		expect(result.current.salvando).toEqual(false)
		expect(result.current.opcoes).toEqual([])
		expect(result.current.miniModalVisible).toEqual(false)
	})
})
