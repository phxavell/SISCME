import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from "@/util/styles"
import {useHome} from "@/pages/general/Home/useHome"
import {Button} from "primereact/button"
import {DataTable} from "primereact/datatable"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {Column} from "primereact/column"
import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ModalEsterilizacao} from "./modal-esterilizacao"
import {useEsterilizacao} from "@pages/por-grupo/tecnico-cme/processos/esterilizacao/useEsterilizacao.ts"
import {RoutersPathName} from "@/routes/schemas.ts"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import { InputText } from "primereact/inputtext"
import { useQRCodeEquipamento } from "@pages/por-grupo/tecnico-cme/processos/components/EquipamentoDropdown/hooks/useQRCodeEquipamento"
import {Controller} from "react-hook-form"
import {QRCodeSchemaType} from "@pages/por-grupo/tecnico-cme/processos/components/EquipamentoDropdown/types.ts"

const bodySituacao = (rowData: any) => {
	return (
		<>
			<div className="flex flex-col">
				<span
					className="text-sm font-semibold">{rowData?.ultima_situacao?? ``} EM {rowData?.ultimo_registro?? ``}</span>
			</div>
		</>
	)
}

export const Esterilizacao = ()=> {
	const {
		caixas,
		paginaAtual,
		loading,
		onPageChange,
		showModal, setShowModal,
		handleClose,
	} = useEsterilizacao()

	const {goRouter} = useHome(0)

	const {
		handleSubmit,
		equipamento,
		handleSubmitQRCode,
		register,
		handleClearEquipamentoUuid, control
	} = useQRCodeEquipamento(`AC`)

	const handleSubimitResquest = async(data: QRCodeSchemaType) => {
		const habilitarModal = await handleSubmitQRCode(data)
		if(habilitarModal) setShowModal(true)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Esterilização</h1>
			<div className="flex gap-1 h-3rem ">
				<div className="flex gap-1 w-full">
					<form
						data-testid='form-modal'
						onSubmit={handleSubmit(handleSubimitResquest)}
					>
						<Controller
							control={control}
							name='qrEquipamento'
							render={({field}) => {
								return (
									<InputText
										data-testid='equipamento'
										placeholder="QR Code do equipamento"
										autoFocus
										className="w-14rem"
										{...register(`qrEquipamento`)}
										id={field.name}
										value={field.value}
										onChange={(e) => field.onChange(e.target.value.toUpperCase())}
									/>
								)

							}}
						/>
					</form>
					<Button
						data-testid='esterilizacao-modal'
						onClick={() => {setShowModal(true)}}
						className={styleActionHeader(`blue`, `800`, `600`)}
						label="Novo Ciclo"
					/>
					<Button
						type="button"
						icon='pi pi-search'
						label="Histórico de esterilização"
						onClick={() => {
							goRouter(RoutersPathName.PesquisarEsterilizacoes)
						}}
						className={styleActionHeader(`blue`, `800`, `600`)}
					/>
					<Button
						type="button"
						label="Histórico de testes"
						icon="pi pi-search"
						iconPos="right"
						onClick={() => {
							goRouter(RoutersPathName.PesquisarTestes)
						}}
						//TODO => REMOVER HIDDEN QUANDO INDICADORES ENTRAR
						className={styleActionHeader(`blue`, `800`, `600`) + `hidden`}
					/>
				</div>
			</div>

			<h1 className={titleStyle}>Caixas prontas para um novo ciclo</h1>
			<DataTable
				loading={loading}
				scrollHeight="500px"
				style={{ minWidth: `100px`, height: 500 }}
				dataKey="serial"
				paginatorClassName={`p-0`}
				tableClassName={`p-0`}
				value={caixas?.data ?? []}
				className={`w-full`}
				emptyMessage="Nenhum resultado encontrado."
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
					header="Situação atual"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
					body={bodySituacao}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={paginaAtual}
				meta={caixas?.meta}
				onPageChange={onPageChange}
			/>
			<ModalEsterilizacao
				onClose={(requerAtualizacao)=> {
					handleClearEquipamentoUuid()
					handleClose(requerAtualizacao)
				}}
				showModal={showModal}
				equipamentos={equipamento}
			/>
		</div>
	)
}
