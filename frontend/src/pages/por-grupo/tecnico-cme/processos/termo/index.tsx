import { ContainerFlexColumnDiv, headerTableStyle, titleStyle } from "@/util/styles"
import { useHome } from "@/pages/general/Home/useHome"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { rowClassName, styleActionHeader } from "@/components/RowTemplate.tsx"
import { Column } from "primereact/column"
import { styleColumnCaixa } from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { ModalTermo } from "./modal-termo"
import { useTermo } from "./useTermo"
import {RoutersPathName} from "@/routes/schemas.ts"
import { InputText } from "primereact/inputtext"
import { useQRCodeEquipamento } from "@pages/por-grupo/tecnico-cme/processos/components/EquipamentoDropdown/hooks/useQRCodeEquipamento"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {useCallback} from "react"
import {QRCodeSchemaType} from "@pages/por-grupo/tecnico-cme/processos/components/EquipamentoDropdown/types.ts"

const bodySituacao = (rowData: any) => {
	return (
		<>
			<div className="flex flex-col">
				<span className="text-sm font-semibold">{rowData?.ultima_situacao  ?? ``} EM {rowData?.ultimo_registro ?? ``}</span>
			</div>
		</>
	)
}

export function Termo() {

	const {
		caixas,
		paginaAtual,
		refreshTable,
		loading,
		onPageChange,
		showModal,
		setShowModal,
	} = useTermo()

	const { goRouter } = useHome(0)
	const {
		handleSubmit,
		equipamento,
		handleSubmitQRCode,
		register,
		handleClearEquipamentoUuid
	} = useQRCodeEquipamento(`TD`)

	const handleSubimitResquest = async(data: QRCodeSchemaType) => {
		const habilitarModal = await handleSubmitQRCode(data)
		if(habilitarModal) setShowModal(true)
	}
	const handleOnClose = useCallback( () => {
		handleClearEquipamentoUuid()
		setShowModal(false)
		refreshTable()
	}, [handleClearEquipamentoUuid, refreshTable, setShowModal])

	return (
		<div id="termo" className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Termodesinfecção</h1>
			<div className="flex gap-1 h-3rem ">
				<div className="flex gap-1 w-full">
					<form
						data-testid='form-modal'
						onSubmit={handleSubmit(handleSubimitResquest)}
					>
						<InputText
							data-testid='equipamento'
							placeholder="QR Code do equipamento"
							autoFocus
							className="w-14rem"
							{...register(`qrEquipamento`)}
						/>
					</form>
					<Button
						data-testid='termo-modal'
						label="Novo Ciclo"
						onClick={() => setShowModal(true)}
						className={styleActionHeader(`blue`, `800`, `600`)}
					/>
				</div>
				<Button type="button"
					icon='pi pi-search'
					onClick={() => { goRouter(RoutersPathName.PesquisarTermos) }}
					className={styleActionHeader(`blue`, `800`, `600`)}
				/>
			</div>
			<h1 className={titleStyle}>Caixas prontas para um novo ciclo</h1>
			<DataTable
				loading={loading}
				scrollHeight="500px"
				style={{ minWidth: `100px`, height: 500 }}
				dataKey="serial"
				value={caixas?.data || []}
				className={`w-full`}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				paginator={false}
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					field="serial"
					header="Serial"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="cliente"
					header="Cliente"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="nome_caixa"
					header="Caixa"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="ultimo_registro"
					header="Situação Atual"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
					body={bodySituacao}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={paginaAtual}
				onPageChange={onPageChange}
				meta={caixas?.meta}/>

			<ModalTermo
				showModal={showModal}
				onClose={handleOnClose}
				equipamentoPorQrCode={equipamento}
			/>
		</div>
	)
}
