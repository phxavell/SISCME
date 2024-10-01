import {render, renderHook, screen, waitFor, fireEvent} from '@testing-library/react'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { ModalCliente } from './ModalCliente'

const arrayNaoVazio = {
	data: [
		{
			idcli: 4,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
			criado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital e Pronto Socorro 28 de Agosto`,
			nomefantasiacli: `Hospital 28 de Agosto`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
	]
}

const options = {
	idcli: {
		type: `integer`,
		required: false,
		read_only: true,
		label: `Idcli`
	},
	inscricaoestadualcli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Inscrição Estadual`
	},
	inscricaomunicipalcli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Inscrição Municipal`
	},
	cnpjcli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `CNPJ`,
		min_length: 14,
		max_length: 20
	},
	cepcli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `CEP`,
		min_length: 7,
		max_length: 10
	},
	emailcli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `E-mail`,
		max_length: 60
	},
	telefonecli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Telefone`,
		max_length: 15
	},
	created_by: {
		type: `nested object`,
		required: false,
		read_only: true,
		label: `Created by`,
		children: {
			id: {
				type: `integer`,
				required: false,
				read_only: true,
				label: `ID`
			},
			username: {
				type: `string`,
				required: false,
				read_only: false,
				label: `Username`,
				max_length: 60
			},
			nome: {
				type: `field`,
				required: false,
				read_only: true,
				label: `Nome`
			}
		}
	},
	updated_by: {
		type: `nested object`,
		required: false,
		read_only: true,
		label: `Updated by`,
		children: {
			id: {
				type: `integer`,
				required: false,
				read_only: true,
				label: `ID`
			},
			username: {
				type: `string`,
				required: false,
				read_only: false,
				label: `Username`,
				max_length: 60
			},
			nome: {
				type: `field`,
				required: false,
				read_only: true,
				label: `Nome`
			}
		}
	},
	created_at: {
		type: `datetime`,
		required: false,
		read_only: true,
		label: `Created_at`
	},
	updated_at: {
		type: `datetime`,
		required: false,
		read_only: true,
		label: `Updated_at`
	},
	bairrocli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Bairro`,
		max_length: 90
	},
	cidadecli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Cidade`,
		max_length: 90
	},
	codigocli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Código`,
		max_length: 15
	},
	contatocli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Contatocli`,
		max_length: 14
	},
	datacadastrocli: {
		type: `date`,
		required: false,
		read_only: true,
		label: `Datacadastrocli`
	},
	horacadastrocli: {
		type: `time`,
		required: false,
		read_only: true,
		label: `Horacadastrocli`
	},
	nomeabreviado: {
		type: `string`,
		required: true,
		read_only: false,
		label: `Sigla`,
		max_length: 90
	},
	nomecli: {
		type: `string`,
		required: true,
		read_only: false,
		label: `Razão Social`,
		max_length: 90
	},
	nomefantasiacli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Nome Fantasia`,
		max_length: 90
	},
	numerocli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Nº`,
		max_length: 10
	},
	ruacli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `Rua`,
		max_length: 90
	},
	ufcli: {
		type: `string`,
		required: false,
		read_only: false,
		label: `UF`,
		max_length: 50
	},
	ativo: {
		type: `boolean`,
		required: false,
		read_only: false,
		label: `Ativo`
	},
	foto: {
		type: `image upload`,
		required: false,
		read_only: false,
		label: `Foto`,
		max_length: 100
	}
}

const arrayVazio: any = {
	data: []
}
const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: {data: undefined},
}


const renderComponente = () => {
	const { result} = renderHook(() => useAuth())
	    act(() => {
		// @ts-ignore
		result.current={ user: { id: 1, nome: `ADMIN` },
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}
	})
	render(
		<MockedContextProvider contextValue={result.current}>
			<ModalCliente visible={true} cliente={undefined} options={options} onClose={ function (): void {
				throw new Error(`Function not implemented.`)
			} }
			setClientes={function (): void {
				throw new Error(`Function not implemented.`)
			} }/>
		</MockedContextProvider>
	)
}



describe(`Cliente modal[caixa preta]`, () => {
	it(`Abrir modal com lista vazia => mostrar campos iguais a options`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/api/cliente/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByTestId(`input-nomecli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-nomeabreviado`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-nomefantasiacli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-cnpjcli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-inscricaoestadualcli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-inscricaomunicipalcli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-cepcli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-ruacli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-numerocli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-bairrocli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-cidadecli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-ufcli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-emailcli`)).toBeInTheDocument()
			expect(screen.getByTestId(`input-telefonecli`)).toBeInTheDocument()
		})
	})
	it(`Abrir modal com lista não vazia => teste de validação de erros de input`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/api/cliente/`).reply(200, mock_cenarios.cenario1)

		renderComponente()
		await waitFor(() => {
			const inputNomeCli = screen.getByTestId(`input-nomecli`)
			fireEvent.change(inputNomeCli, {target: {value: `a`.repeat(91)}})
			expect(screen.getByText(`Nome deve ter no máximo ` + options.nomecli.max_length + ` caracteres`)).toBeInTheDocument()

			const inputNomeAbreviado = screen.getByTestId(`input-nomeabreviado`)
			fireEvent.change(inputNomeAbreviado, {target: {value: `a`.repeat(91)}})
			expect(screen.getByText(`Sigla deve ter no máximo ` + options.nomeabreviado.max_length + ` caracteres`)).toBeInTheDocument()

			const inputNomeFantasiaCli = screen.getByTestId(`input-nomefantasiacli`)
			fireEvent.change(inputNomeFantasiaCli, {target: {value: `a`.repeat(91)}})
			expect(screen.getByText(`Nome fantasia deve ter no máximo ` + options.nomefantasiacli.max_length + ` caracteres`)).toBeInTheDocument()

			const inputEmailCli = screen.getByTestId(`input-emailcli`)
			fireEvent.change(inputEmailCli, {target: {value: `a`.repeat(61)}})
			expect(screen.getByText(`E-mail deve ter no máximo ` + options.emailcli.max_length + ` caracteres`)).toBeInTheDocument()

			const inputBairoCli = screen.getByTestId(`input-bairrocli`)
			fireEvent.change(inputBairoCli, {target: {value: `a`.repeat(91)}})
			expect(screen.getByText(`Bairro deve ter no máximo ` + options.bairrocli.max_length + ` caracteres`)).toBeInTheDocument()

			const inputRuaCli = screen.getByTestId(`input-ruacli`)
			fireEvent.change(inputRuaCli, {target: {value: `a`.repeat(91)}})
			expect(screen.getByText(`Rua deve ter no máximo ` + options.ruacli.max_length + ` caracteres`)).toBeInTheDocument()

			const inputNumeroCli = screen.getByTestId(`input-numerocli`)
			fireEvent.change(inputNumeroCli, {target: {value: `a`.repeat(11)}})
			expect(screen.getByText(`Número deve ter no máximo ` + options.numerocli.max_length + ` caracteres`)).toBeInTheDocument()

			const inputCidadeCli = screen.getByTestId(`input-cidadecli`)
			fireEvent.change(inputCidadeCli, {target: {value: `a`.repeat(91)}})
			expect(screen.getByText(`Cidade deve ter no máximo ` + options.cidadecli.max_length + ` caracteres`)).toBeInTheDocument()
		})
	})
	it(`Abrir modal com lista não vazia => teste de criação de cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/api/cliente/`).reply(200, mock_cenarios.cenario1)
		mock.onPost(`/api/cliente/`).reply(200, {})
		renderComponente()
		await waitFor(() => {
			const inputNomeCli = screen.getByTestId(`input-nomecli`)
			fireEvent.change(inputNomeCli, {target: {value: `Hospital e Pronto Socorro 28 de Agosto`}})

			const inputNomeAbreviado = screen.getByTestId(`input-nomeabreviado`)
			fireEvent.change(inputNomeAbreviado, {target: {value: `HPA`}})

			const inputNomeFantasiaCli = screen.getByTestId(`input-nomefantasiacli`)
			fireEvent.change(inputNomeFantasiaCli, {target: {value: `Hospital 28 de Agosto`}})

			const inputEmailCli = screen.getByTestId(`input-emailcli`)
			fireEvent.change(inputEmailCli, {target: {value: `hr@bringel.com`}})

			const inputBairoCli = screen.getByTestId(`input-bairrocli`)
			fireEvent.change(inputBairoCli, {target: {value: `Adrianópolis`}})

			const inputRuaCli = screen.getByTestId(`input-ruacli`)
			fireEvent.change(inputRuaCli, {target: {value: `Av. Mário Ypiranga`}})

			const inputNumeroCli = screen.getByTestId(`input-numerocli`)
			fireEvent.change(inputNumeroCli, {target: {value: `1581`}})

			const inputCidadeCli = screen.getByTestId(`input-cidadecli`)
			fireEvent.change(inputCidadeCli, {target: {value: `Manaus`}})

			const inputCnpjCli = screen.getByTestId(`input-cnpjcli`)
			fireEvent.change(inputCnpjCli, {target: {value: `09.628.825/0001-20`}})

			const inputInscricaoEstadualCli = screen.getByTestId(`input-inscricaoestadualcli`)
			fireEvent.change(inputInscricaoEstadualCli, {target: {value: `14233142`}})

			const inputInscricaoMunicipalCli = screen.getByTestId(`input-inscricaomunicipalcli`)
			fireEvent.change(inputInscricaoMunicipalCli, {target: {value: `415381524`}})

			const inputCepCli = screen.getByTestId(`input-cepcli`)
			fireEvent.change(inputCepCli, {target: {value: `69084-070`}})

			const inputTelefoneCli = screen.getByTestId(`input-telefonecli`)
			fireEvent.change(inputTelefoneCli, {target: {value: `(92)99123-3123`}})

			const buttonSalvar = screen.getByTestId(`botao-cadastrar`)
			fireEvent.click(buttonSalvar)

		})
	})
})
