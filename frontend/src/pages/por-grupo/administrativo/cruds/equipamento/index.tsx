import {
	ContainerFlexColumnDiv,
	headerTableStyle,
	titleStyle
} from '@/util/styles'
import {Button} from 'primereact/button'
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {ModalEquipamentos} from './ModalEquipamentos'
import {useEquipamento} from './useEquipamento'
import {
	rowClassName,
	styleActionHeader,
	styleActionTable
} from '@/components/RowTemplate.tsx'
import {EquipamentosResponse} from "@infra/integrations/administrativo/types-equipamentos.ts"
import {useState, useEffect} from 'react'
import {ModalEquipamentoView} from './ModalEquipamentoView'
import {useModalEquipamentoView} from './ModalEquipamentoView/useModalEquipamentoView'
import {PaginatorAndFooter} from '@/components/table-templates/Paginator/PaginatorAndFooter.tsx'
import { ModalEquipamentoQR } from './ModalEquipamentoQR'
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import { ModalManutencao } from './ModalManutencao'
import { Dialog } from 'primereact/dialog'
import { EquipamentosAPI } from '@/infra/integrations/administrativo/equipamentos'
import QRCodeStyling from "livebook-qr-code"
import LogoSVG from "@/assets/logo-short/siscme-s-f.png"

export function EquipamentosPage() {
	const {
		visible,
		setVisible,
		loading,
		equipamentos,
		equipamentoEdit,
		setEquipamentoEdit,
		excluirEquipamento,
		setExcluirEquipamento,
		visibleModalDelete,
		setVisibleModalDelete,
		onPageChange,
		refreshTable,
		editEquipamento,
		first,
		deleteEquipamento,
		situacaoTemplate,
		visibleModalManutencao, setVisibleModalManutencao,
		equipamentoParaManutencao, setEquipamentoParaManutencao,
		visibleModalFinalizarManutencao, setVisibleModalFinalizarManutencao,
		finalizarManutencao,
		user
	} = useEquipamento()

	const {
		getEquipamento,
		equipamento,
	} = useModalEquipamentoView()
	const [loadingPDF, setLoadingPDF] = useState(false)

	const [showModal, setShowModal] = useState(false)
	const [showModalQR, setShowModalQR] = useState(false)

	const [idRegistroManutencao, setIdRegistroManutencao] = useState(0)

	const handleViewEquipamento = async (id: number) => {
		getEquipamento(id)
	}

	const colorAndTooltipManutencao = (data: EquipamentosResponse) => {
		if(!data.disponivel) {
			return {
				color: `yellow`,
				tooltip: `Finalizar manutenção`
			}
		} else {
			return {
				color: `green`,
				tooltip: `Iniciar manutenção`
			}
		}
	}

	const [imagemToPDF, setImagemToPDF] = useState<any>(undefined)

	useEffect(() => {
		if (equipamento) {
			(async () => {
				if (equipamento) {
					const qrCode = new QRCodeStyling({
						width: 600,
						height: 600,
						type: `svg`,
						data: equipamento.data.uuid,
						image: LogoSVG,

						dotsOptions: {
							color: `#014983FF`,
							type: `square`,
						},
						backgroundOptions: {
							color: `rgba(23, 101, 218, 0)`,
						},
						imageOptions: {
							crossOrigin: `anonymous`,
							margin: 10,
						},
					})

					// @ts-ignore
					const imgURL = await qrCode.toDataUrl().then((dataUrl) => {
						// @ts-ignore

						return dataUrl
					})
					setImagemToPDF(imgURL)
				}
			})()
		}
		return () => {}
	}, [equipamento])

	const templateActions = (equipamentoSelect: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					className={styleActionTable(`blue`, 500)}
					outlined
					icon="pi pi-pencil"
					tooltip={`Editar`}
					onClick={() => editEquipamento(equipamentoSelect)}
				/>

				<Button
					className={styleActionTable(`red`, 700)}
					outlined
					icon="pi pi-trash"
					onClick={() => {
						setVisibleModalDelete(true)
						setExcluirEquipamento(equipamentoSelect)
					}}
				/>
				<Button
					className={styleActionTable(`blue`, 900)}
					outlined
					icon='pi pi-eye'
					onClick={() => {
						setLoadingPDF(true)
						getEquipamento(equipamentoSelect.idequipamento).then(
							() => {
								setTimeout(() => {
									setShowModal(true)
									setLoadingPDF(false)
								}, 100)
							},
						)
					}}
				/>
				<Button
					className={styleActionHeader(`orange`, `400`, `600`) + `text-white`}
					outlined
					icon='pi pi-file-pdf'
					onClick={async() => {
						setLoadingPDF(true)
						const resp = await getEquipamento(
							equipamentoSelect.idequipamento,
						).then((data) => {
							return data
						})
						setTimeout(() => {
							setShowModalQR(true)
							setLoadingPDF(false)
						}, 100)
					}}
				/>
				<Button
					className={styleActionHeader(colorAndTooltipManutencao(equipamentoSelect).color, `500`, `600`) + `text-white`}
					outlined
					tooltip={colorAndTooltipManutencao(equipamentoSelect).tooltip}
					icon='pi pi-cog'
					onClick={() => {
						setEquipamentoParaManutencao(equipamentoSelect)
						if(equipamentoSelect?.disponivel) {
							setVisibleModalManutencao(true)
						} else {
							EquipamentosAPI.listarManutencoesPorEquipamento(user, equipamentoSelect?.idequipamento).then(data => {
								setIdRegistroManutencao(data.data[0].id)
							})
							setVisibleModalFinalizarManutencao(true)
						}
					}}
				/>
			</div>
		)
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Equipamentos</h1>
			<div className='flex ml-auto gap-2'>
				<Button
					onClick={() => setVisibleModalManutencao(true)}
					className={`my-2 ml-auto bg-blue-800 hover:bg-blue-600`}
					label="Programar Manutenção"
					icon='pi pi-cog'
					data-testid='botao-novo-equipamento'
				/>

				<Button
					onClick={() => setVisible(true)}
					className={`my-2 ml-auto bg-blue-800 hover:bg-blue-600`}
					label="Novo Equipamento"
					data-testid='botao-novo-equipamento'
				/>

			</div>

			<DataTable
				loading={loading}
				dataKey="idequipamento"
				value={equipamentos?.data}
				className="w-full"
				style={{minWidth: `100px`}}
				rowClassName={rowClassName}
				paginatorClassName={`p-0 mt-0`}
				tableClassName={`p-0`}
				rowHover
				stripedRows
				emptyMessage='Nenhum resultado encontrado'
			>
				<Column
					field="numero_serie"
					header="Serial"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="descricao"
					header="Descrição"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="capacidade"
					header="Capacidade (L)"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="fabricante"
					header="Fabricante"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="ativo"
					header="Situação"
					body={situacaoTemplate}
					headerStyle={headerTableStyle}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				meta={equipamentos?.meta}
				onPageChange={onPageChange}
			/>
			<ModalEquipamentos
				setEquipamento={setEquipamentoEdit}
				equipamento={equipamentoEdit}
				visible={visible}
				onClose={refreshTable}
			/>
			<ModalEquipamentoView
				showModal={showModal}
				setShowModal={setShowModal}
				dadosView={equipamento}
			/>
			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => deleteEquipamento(excluirEquipamento)}
			/>
			<ModalEquipamentoQR
				showModalQR={showModalQR}
				setShowModalQR={setShowModalQR}
				dadosView={{ ...equipamento, img: imagemToPDF }}
			/>
			<ModalManutencao
				visible={visibleModalManutencao}
				equipamento={equipamentoParaManutencao}
				setEquipamento={setEquipamentoParaManutencao}
				onClose={() => {setVisibleModalManutencao(false), refreshTable(true)}}
			/>

			<Dialog
				header='Finalizar manutenção'
				draggable={false}
				resizable={false}
				closeOnEscape={true}
				style={{width: `30vw`}}
				blockScroll={true}
				dismissableMask={true}
				onHide={() => setVisibleModalFinalizarManutencao(false)}
				visible={visibleModalFinalizarManutencao}
			>
				<h3 className="m-0 mb-3">Deseja finalizar manutenção?</h3>
				<div className="flex gap-2">
					<Button
						label="Não"
						onClick={() => setVisibleModalFinalizarManutencao(false)}
					/>
					<Button
						label="Sim"
						onClick={() => {finalizarManutencao(idRegistroManutencao), setEquipamentoParaManutencao(undefined)}}
						data-testid='confirmar-finalizar-manutencao' />
				</div>
			</Dialog>
		</div>
	)
}
