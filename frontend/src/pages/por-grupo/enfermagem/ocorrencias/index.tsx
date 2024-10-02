import {ContainerFlexColumnDiv, headerTableStyle, styleColumn, titleStyle} from "@/util/styles"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import React, {useState} from "react"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {Button} from "primereact/button"
import TableColumn from "@/components/table-templates/TableColumn.tsx"
import {useOcorrencias} from "@pages/por-grupo/enfermagem/ocorrencias/useOcorrencias.ts"
import {ModalOcorrencias} from "src/pages/por-grupo/enfermagem/ocorrencias/modal-ocorrencias-criar"
import {ModalOcorrenciasFechar} from "@pages/por-grupo/enfermagem/ocorrencias/modal-ocorrencias-finalizar"
import {ModalOcorrenciasAnexar} from "@pages/por-grupo/enfermagem/ocorrencias/modal-ocorrencias-anexar"
import {ModalBaixarPDF} from "@/components/modal-pdf/ModalBaixarPDF.tsx"
import {OcorrenciaTemplate} from "@/components/pdf-templates/OcorrenciaTemplate.tsx"
import {OcorrenciasAPI} from "@infra/integrations/enfermagem/ocorrencias.ts"
import {Calendar} from "primereact/calendar"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {Dropdown} from "primereact/dropdown"
import { classeNameExcluir, styleExcluir, classNameTable, classesFilter } from "./styles"

export const DiarioDeOcorrencias: React.FC = () => {
	const {
		user, toastSuccess, toastError,
		loading,
		first,
		onPageChange,
		ocorrencias,
		showModal, setShowModal,
		updateListagem,
		showModalFechar, setShowModalFechar,
		ocorrenciaSelecionada, setOcorrenciaSelecionada,
		showModalAnexar, setShowModalAnexar,
		excluindoAnexo, setExcluindoAnexo,


		fromDate, setFromDate,
		toDate, setToDate,
		status, setStatus,
		setor, setSetor,
		cliente, setCliente,
		setModoPesquisa,
		limparPesquisa,
		opcoes, clientes,
	} = useOcorrencias()

	const excluirAnexo = (ocorrencia: any) => {
		//TODO chamar modal de confirmar exclusão;
		setExcluindoAnexo(true)
		OcorrenciasAPI.excluirAnexar(user, ocorrencia.id).then((r) => {
			if (r) {
				toastSuccess(`Arquivo removido com sucesso.`)
				updateListagem().then(() => {
					setExcluindoAnexo(false)
				})
			} else {
				toastError(`Erro ao tentar remover arquivo. Tente mais tarde.`)
				setExcluindoAnexo(false)
			}
		}).catch(() => {
			toastError(`Erro ao tentar remover arquivo. Tente mais tarde.`)
			setExcluindoAnexo(false)
		})
	}
	const handleConfirmar = (ocorrencia: any) => {
		setOcorrenciaSelecionada(ocorrencia)
		setShowModalFechar(true)
	}

	const AcoesDiarioTemplate = (ocorrencia: any) => {

		if (ocorrencia?.status === `ATIVO`) {
			return (
				<div className="flex gap-2 h-3rem">
					<Button
						tooltip={`Finalizar`}
						icon="pi pi-check-circle"
						size={`large`}
						className={styleActionHeader(`green`, `600`, `800`)}
						onClick={() => {
							handleConfirmar(ocorrencia)
						}}
					/>
					<Button
						tooltip={`Editar`}
						icon={`pi pi-file-edit`}
						size={`large`}
						className={styleActionHeader(`orange`, `600`, `800`)}
						onClick={() => {
							setOcorrenciaSelecionada(ocorrencia)
							setShowModal(true)
						}}
					/>
				</div>
			)
		}
	}

	const TBaixarAnexo = (ocorrencia: any) => {

		const showExcluir = (ocorrencia: any) => {
			if (ocorrencia.status === `ATIVO` && !excluindoAnexo) {
				return (
					<i
						className={classeNameExcluir}
						style={styleExcluir}
						aria-disabled={excluindoAnexo}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							excluirAnexo(ocorrencia)
						}}
					></i>
				)
			}
		}

		if (ocorrencia.arquivo) {
			return (
				<div className="flex gap-2 h-3rem w-min relative">

					<a href={ocorrencia.arquivo} download
						target={`_blank`}
						aria-disabled={excluindoAnexo} rel="noreferrer"
					>
						<Button
							text
							loading={excluindoAnexo}
							className={styleActionHeader(`orange`, `400`, `600`) + ` h-3rem`}
						>
							<i
								className={`pi pi-cloud-download ${excluindoAnexo ? ` pi-spin` : ``}`}
								style={{
									color: `white`,
									fontSize: `1rem`,
								}}
							></i>
						</Button>
					</a>
					{showExcluir(ocorrencia)}
				</div>
			)
		} else if (ocorrencia.status === `ATIVO`) {
			return (
				<div className="flex gap-2 h-3rem w-min relative">
					<Button
						tooltip={`Anexar`}
						text
						className={styleActionHeader(`orange`, `400`, `600`)}
						onClick={() => {
							// setTermoToPDF(termo)
							// setShowModal(true)
							setOcorrenciaSelecionada(ocorrencia)
							setShowModalAnexar(true)
						}
						}
					>
						<i className={`pi pi-cloud-upload`}
							style={{
								color: `white`,
								fontSize: `1rem`,
							}}
						></i>

					</Button>
				</div>
			)
		}

	}

	const TChamarPDF = (ocorrencia: any) => {

		return (
			<div className="flex gap-2 h-3rem">
				<Button
					text
					size="large"
					icon="pi pi-file-pdf"
					className={styleActionHeader(`orange`, `400`, `600`)}
					style={{color: `white`}}
					onClick={() => {
						setOcorrenciaSelecionada(ocorrencia)
						setShowModalBaixarPDF(true)
					}
					}
				/>

			</div>
		)
	}

	const [showModalBaixarPDF, setShowModalBaixarPDF] = useState(false)

	const classResponsiveButtons = `
    w-5 md:4 lg:w-2 text-left
    `
	const classResponsiveButtons2 = `
	flex align-self-end h-3rem

	align-itens-end

     gap-1
    `

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Diário de Ocorrências</h1>
			<ModalOcorrencias
				closeDialog={async (close: any) => {
					if (close) {
						updateListagem().then(() => {

						})
					}
					setOcorrenciaSelecionada(undefined)
					setShowModal(false)
				}}
				conteudo={ocorrenciaSelecionada}
				openDialog={showModal}
			/>
			<ModalOcorrenciasFechar
				closeDialog={async (close: any) => {
					if (close) {
						updateListagem().then(() => {
						})
					}
					setShowModalFechar(false)
					setOcorrenciaSelecionada(undefined)
					return
				}}
				conteudo={ocorrenciaSelecionada}
				openDialog={showModalFechar}
			/>
			<ModalOcorrenciasAnexar
				closeDialog={async (close: any) => {
					if (close) {
						updateListagem().then(() => {

						})
					}
					setShowModalAnexar(false)
					return
				}}
				conteudo={ocorrenciaSelecionada}
				openDialog={showModalAnexar}
			/>
			<ModalBaixarPDF
				nomeArquivo={`Ocorrencia`}
				documentoPDF={<OcorrenciaTemplate {...ocorrenciaSelecionada}/>}
				showModal={showModalBaixarPDF}
				closeModal={() => {
					setOcorrenciaSelecionada(undefined)
					setShowModalBaixarPDF(false)
				}}
			/>
			<div className={`flex flex-row justify-content-between ${classNameTable} mb-2`}>

				<div className={classesFilter}>
					<Calendar
						className={classResponsiveButtons}
						id="fromDate"
						value={fromDate}
						onChange={(e) => {
							//@ts-ignore
							setFromDate(e?.value)
						}}
						showTime
						placeholder="Dt. Início"
						maxDate={new Date()}
						showIcon
						dateFormat="dd/mm/yy"/>
					<Calendar
						className={classResponsiveButtons}
						id="toDate"
						value={toDate}
						onChange={(e) => {
							//@ts-ignore
							setToDate(e?.value)
						}}
						placeholder="Dt. Fim"
						showTime
						maxDate={new Date()}
						showIcon
						dateFormat="dd/mm/yy"/>

					<Dropdown
						ariaLabel={`Setor`}
						placeholder={`Setor`}
						id="setorsearch"
						value={setor}
						className={classResponsiveButtons}
						options={opcoes?.setores}
						optionLabel="value"
						optionValue="value"
						onChange={(e) => setSetor(e.value)}
						filter
					/>

					<Dropdown
						ariaLabel={`Status`}
						placeholder={`Status`}
						id="statussearch"
						value={status}
						className={classResponsiveButtons}
						options={[
							{ value: `ATIVO` },
							{ value: `FECHADO` },
						]}
						optionLabel="value"
						optionValue="value"
						onChange={(e) => setStatus(e.value)}

					/>

					<Dropdown
						className={`w-2 text-left`}
						ariaLabel={`Cliente`}
						placeholder={`Cliente`}
						value={cliente}
						options={clientes}
						optionLabel="value"
						optionValue="nome"
						onChange={(e) => setCliente(e.value)}
						filter
					/>


					<div className={classesFilter+classResponsiveButtons2}>
						<Button
							icon="pi pi-times"
							tooltip={`Limpar pesquisa`}
							onClick={() => {

								setModoPesquisa(false)

								updateListagem().then(()=>{
									limparPesquisa()
								})
							}}
							className={styleActionHeader(`blue`, `600`, `700`)}
						/>
					</div>

				</div>
				<div className={classesFilter+` h-1rem`}>
					<Button
						onClick={() => {
							setShowModal(true)
						}}
						className={styleActionHeader(`blue`, `800`, `600`)}
						label="Novo Diário"
					/>
				</div>
			</div>

			<DataTable
				loading={loading}
				scrollHeight="500px"
				rows={10}
				style={{minWidth: `100px`, height: 500}}
				value={ocorrencias?.data || []}
				className={classNameTable}
				emptyMessage="Nenhuma ocorrência registrada."
				paginator={false}
				stripedRows
				rowClassName={rowClassName}
				rowHover
				dataKey="id"
			>
				<Column
					field="id"
					header="#"
					headerStyle={headerTableStyle}
					className={styleColumn}
				/>

				<Column
					field="setor.nome"
					header="Setor"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>
				<Column
					field="cliente.nome"
					header="Cliente"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>
				<Column
					field="tipodediariodeocorrencia"
					header="Tipo de diário"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>
				<Column
					field="status"
					header="Situação"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>
				<Column
					field="indicador.nome"
					header="Ocorrências"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>
				<Column
					field="dt_registro"
					header="Data Registro"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>
				<Column
					field="dt_ocorrencia"
					header="Data Ocorrência"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TableColumn}
				/>

				{/*TODO colocar no body de downloads a opção de remove*/}
				{/*r se o itens não tiver com status=fechado.*/}
				{/*TODO icone de add ou ícone de deletar+ itens em tag para dowloand*/}
				<Column
					field="downloads"
					header="Anexos"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TBaixarAnexo}
				/>
				<Column
					header="PDF"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={TChamarPDF}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={AcoesDiarioTemplate}
				/>
			</DataTable>
			<PaginatorAndFooter
				wClassCustom={classNameTable}
				first={first}
				meta={ocorrencias?.meta}
				onPageChange={onPageChange}
			/>
		</div>
	)
}
