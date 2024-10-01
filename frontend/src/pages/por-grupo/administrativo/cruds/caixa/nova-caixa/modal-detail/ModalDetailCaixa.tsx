import {Dialog} from "primereact/dialog"
import {Button} from "primereact/button"
import {Message} from 'primereact/message'
import {Image} from "primereact/image"
import {useEffect, useMemo, useState} from "react"
import {useModalCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/useModalCaixa.ts"
import {ProgressSpinner} from "primereact/progressspinner"
import {useCaixaStore} from "@/store/store.ts"
import {useAuth} from "@/provider/Auth"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {ItensCaixaAPI} from "@infra/integrations/caixa/itens-caixa.ts"
import "./style.css"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {
	heigthTable,
	style,
	styleContent1,
	styleContentDetail,
	styleContentDetail2,
	styleContentHeader,
	styleLinhaMinimaTabela,
	styleTable2
} from "../../styles-caixa.ts"
import {headerTableStyle, styleMessage} from "@/util/styles"
import {
	ModalDetailsCliente
} from "@/pages/por-grupo/administrativo/cruds/cliente/novo-cliente/modais/ModalDetails.tsx"
import {ModalDetailsProps} from "@pages/por-grupo/administrativo/cruds/caixa/types-caixa.ts"
import { useCaixaPortifolio } from "./useCaixaPortifolio.ts"
import { ModalBaixarPDF } from "@/components/modal-pdf/ModalBaixarPDF.tsx"
import { CaixasPortifolioTemplate } from "@/components/pdf-templates/CaixasPortifolioTemplate.tsx"

// eslint-disable-next-line react-refresh/only-export-components
export const getLabelCriticidade = (idCriticidade: string | number | undefined, optionsForTheForm: any) => {
	const label = optionsForTheForm?.criticidades?.find((option: any) => option.id + `` == idCriticidade)?.valor
	if (label) {
		return label
	}
	return ` `

}

export const CritidadeTemplate = (optionsForTheForm: any) => (data: any) => {

	return (
		<div className={`p-0 m-0`}>
			{getLabelCriticidade(data.criticidade, optionsForTheForm)}
		</div>
	)
}

export function ModalDetailsCaixa(props: ModalDetailsProps) {
	const {
		visible,
		onClose,
		caixa,
		onDelete,
		onEdit,
		seriais,
		setConteudoParaPdf
	} = props
	const {
		optionsForTheForm,
		clientesForTheForm
	} = useModalCaixa()
	const {handleCaixaPortifolio, portifolioCaixa, setShowPortifolioCaixa, showPortifolioCaixa} = useCaixaPortifolio()
	const { user } = useAuth()
	const [showDetailCliente, setShowDetailCliente] = useState(false)
	const { carregandoProdutos, setCarregandoProdutos } = useCaixaStore()

	const headerTemplate = () => {
		return (
			<div className={styleContentHeader}>
				<h3 className="m-0 p-0">Nome do Produto: {caixa?.nome}</h3>
				<div className="flex gap-2 h-2rem mr-5">
					<Button
						icon='pi pi-trash'
						className={styleActionHeader(`red`, `600`, `600`)}
						onClick={() => onDelete(caixa)}
					/>
					<Button
						icon='pi pi-pencil'
						className={styleActionHeader(`green`, `600`, `600`)}
						onClick={() => onEdit(caixa)}
					/>
				</div>
			</div>
		)
	}

	const getLabelCriticidade = (idCriticidade: string | number | undefined) => {
		const label = optionsForTheForm?.criticidades?.find(option => option.id + `` == idCriticidade)?.valor
		if (label) {
			return label
		}
		return ` `

	}

	const messageTemplate = (title: string, label: string | number | undefined, ) => {
		let labelFinal: string | number | undefined
		switch (title) {
		case `Cliente`:
			//TODO pesquisar na API pelo id do cliente as informação exata, pos a query está paginada.
			labelFinal = clientesForTheForm?.find(cliente => cliente.id + `` == label)?.valor
			break
		case `Situação`:
			labelFinal = optionsForTheForm?.situacoes?.find(option => option.id + `` == label)?.valor
			break
		case `Tipo`:
			labelFinal = optionsForTheForm?.tipos_caixa?.find(option => option.id + `` == label)?.valor
			break
		case `Embalagem`:
			labelFinal = optionsForTheForm?.embalagens?.find(option => option.id + `` == label)?.valor
			break
		case `Categoria de uso`:
			labelFinal = optionsForTheForm?.categorias_uso?.find(option => option.id + `` == label)?.valor
			break
		case `Prioridade`:
			labelFinal = optionsForTheForm?.prioridades?.find(option => option.id + `` == label)?.valor
			break
		case `Criticidade`:
			labelFinal = getLabelCriticidade(label)
			break
		case `Temperatura`:
			labelFinal = optionsForTheForm?.temperaturas?.find(option => option.id + `` == label)?.valor
			break
		default:
			labelFinal = label
		}
		if (title === `Cliente`) {
			return (
				<div className={`w-12`}>
					<h4 className="p-0 m-0">{title}</h4>
					<div className={styleContent1}>
						<div className={`mr-4`}>
							{labelFinal}
						</div>

						<Button
							icon='pi pi-eye'
							data-testid='visualizar-cliente'
							className="eye bg-yellow-600 border-none"
							onClick={() => setShowDetailCliente(true)}

						/>
					</div>
				</div>
			)
		}
		return (
			<div className={`w-12`}>
				<h4 className="p-0 m-0">{title}</h4>
				<div className={styleContent1}>{labelFinal}</div>
			</div>
		)
	}

	const templateActions = (serial:any) => {

		return (
			<div className="flex gap-2">
				<div className="flex gap-2">
					<Button
						text
						icon='pi pi-print'
						className={styleActionHeader(`blue`, `600`, `600`)}
						style={{ color: `white` }}
						onClick={() => {
							setConteudoParaPdf(serial)
						}}
						tooltip="Imprimir serial"
					/>
					<Button
						text
						icon='pi pi-file-pdf'
						className={styleActionHeader(`orange`, `600`, `600`)}
						style={{ color: `white` }}
						onClick={() =>handleCaixaPortifolio(serial?.serial)}
						tooltip="Gerar portifólio"
					/>
				</div>

			</div>
		)
	}


	const showImagem = () => {
		if (caixa?.imagem) {
			return (
				<div className="col-6">
					<Image
						src={`${caixa?.imagem}`}
						alt="Image de caixa"
						preview

						width="300"
					/>
				</div>
			)
		}
	}

	const showSpinner = useMemo(() => {
		if (carregandoProdutos) {
			return (
				<div className={`flex flex-column col-12`}>
					<ProgressSpinner />
				</div>
			)
		}

	}, [carregandoProdutos])

	const [itensCaixa, setItensCaixa] = useState<any[]>([])


	useEffect(() => {
		if (caixa && caixa.itens && user) {

			setCarregandoProdutos(true)
			ItensCaixaAPI.itensComDescricaoDeProduto(user, caixa.itens).then((itensAEditar: any[]) => {
				setCarregandoProdutos(false)
				setItensCaixa(itensAEditar)
			})

		}

	}, [caixa, setCarregandoProdutos, user])

	const footer = useMemo(() => {
		const quantidadeTotal = itensCaixa ? itensCaixa.reduce((preV, newV) =>
			preV + newV.quantidade
		, 0) : 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [itensCaixa])

	const footerSerial = useMemo(() => {
		return `Total de  ${seriais.length} itens.`
	}, [seriais])

	return (
		<Dialog
			draggable={false}
			resizable={false}
			focusOnShow={false}
			closeOnEscape={true}
			blockScroll
			dismissableMask
			onHide={() => {
				setItensCaixa([])
				onClose()
			}}
			visible={visible}
			header={headerTemplate}
			style={{ width: `90vw` }}
		>
			<ModalBaixarPDF
				nomeArquivo="Portifólio de caixa"
				documentoPDF={<CaixasPortifolioTemplate {...portifolioCaixa}/>}
				showModal={showPortifolioCaixa}
				closeModal={() => {
					setShowPortifolioCaixa(false)
				}}
			/>
			<div className={style}>
				<ModalDetailsCliente
					visible={showDetailCliente}
					onClose={() => {
						setShowDetailCliente(false)
					}}
					idCliente={caixa?.cliente}
				/>

				<div className="col flex  align-items-center justify-content-center">
					<div className={`grid`}>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-8`}
							severity="info"
							content={() => messageTemplate(`Cliente`, caixa?.cliente)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-4`}
							severity="info"
							content={() => messageTemplate(`Situação`, caixa?.situacao)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-4`}
							severity="info"
							content={() => messageTemplate(`Tipo`, caixa?.tipo_caixa)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-4`}
							severity="info"
							content={() => messageTemplate(`Embalagem`, caixa?.embalagem)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-4`}
							severity="info"
							content={() => messageTemplate(`Categoria de uso`, caixa?.categoria_uso)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-3`}
							content={() => messageTemplate(`Prioridade`, caixa?.prioridade)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-3`}
							content={() => messageTemplate(`Criticidade`, caixa?.criticidade)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-3`}
							content={() => messageTemplate(`Temperatura`, caixa?.temperatura)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail + ` col-3`}
							content={() => messageTemplate(`Validade`, caixa?.validade + ` meses`)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail2 + ` col-6`}
							severity="info"
							content={() => messageTemplate(`Descrição`, caixa?.descricao)}
						/>
						<Message
							style={styleMessage}
							className={styleContentDetail2 + ` col-6`}
							content={() => messageTemplate(`Instruções Especiais`, caixa?.instrucoes_uso)}
						/>
					</div>

				</div>

				{showImagem()}
				{showSpinner}
				<div className={`col-12 p-0 m-0 flex flex-row`}>

					<div className={`w-6`}>
						<DataTable
							scrollHeight={heigthTable}
							style={styleTable2}
							dataKey="item.id"
							value={itensCaixa}
							paginator
							rows={5}
							scrollable={false}
							rowHover
							stripedRows
							emptyMessage="Buscando..."
							rowClassName={rowClassName}
							footer={footer}
							paginatorClassName={`p-0 mt-0`}
							tableClassName={`p-0`}
						>
							<Column
								field="item.id"
								header="#"
								colSpan={1}
								className={styleLinhaMinimaTabela}
								style={{ width: `10%` }}
								headerStyle={headerTableStyle}
							/>
							<Column
								field="item.valor"
								header="Produto"
								className={styleLinhaMinimaTabela + ` text-sm`}
								style={{ width: `50%` }}
								headerStyle={headerTableStyle}
							/>
							<Column
								className={styleLinhaMinimaTabela}
								field="quantidade"
								style={{ width: `40%` }}
								header="Quantidade"
								headerStyle={headerTableStyle}
							/>
							<Column
								className={styleLinhaMinimaTabela}
								field="criticidade"
								style={{ width: `40%` }}
								header="Criticidade"
								body={CritidadeTemplate(optionsForTheForm)}
								headerStyle={headerTableStyle}
							/>

						</DataTable>
					</div>
					<div className={`ml-3 w-6`}>
						<DataTable
							scrollHeight={heigthTable}
							style={styleTable2}
							dataKey="serial"
							value={seriais}
							rows={5}
							scrollable={false}
							paginator
							rowHover
							stripedRows
							emptyMessage="Nenhum serial salvo"
							rowClassName={rowClassName}
							footer={footerSerial}
							paginatorClassName={`p-0 mt-0`}
							tableClassName={`p-0`}
						>
							<Column
								field="serial"
								header="Serial"
								colSpan={1}
								className={styleLinhaMinimaTabela}
								style={{ width: `10%` }}
								headerStyle={headerTableStyle}
							/>
							<Column
								field="situacao"
								header="Situação"
								colSpan={1}
								className={styleLinhaMinimaTabela}
								style={{ width: `10%` }}
								headerStyle={headerTableStyle}
							/>
							<Column
								colSpan={1}
								className={styleLinhaMinimaTabela}
								style={{ width: `10%` }}
								header="Ações"
								headerStyle={headerTableStyle}
								body={templateActions}
							/>
						</DataTable>
					</div>
				</div>
			</div>
		</Dialog>
	)
}
