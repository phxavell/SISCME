import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {headerTableStyle, heigthTable2, titleStyle2} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Dialog} from "primereact/dialog"
import {useSerial} from "./useSerial"
import {InputNumber} from "primereact/inputnumber"
import React, {useEffect} from "react"
import {IModalSerial} from "@pages/por-grupo/administrativo/cruds/caixa/types-caixa.ts"
import { styleSerial } from "../../styles-caixa"

export const DialogNovoSerial: React.FC<IModalSerial> = (props) => {
	const { showModal, setShowModal, data, setConteudoParaPdf } = props

	const {
		seriais, setSeriais,
		handleEnviarQuantidade,
		loading,
		quantidade,
		setQuantidade,listarSeriais,toastAlert
	} = useSerial()

	const enviarQuantidade = async (quantidade:any,id: any) => {
		const body = {
			quantidade: quantidade,
			serial: data.codigo_modelo
		}
		handleEnviarQuantidade(id,body)
	}


	useEffect(() => {
		if(showModal){
			listarSeriais
		}
	}, [listarSeriais, showModal])

	const templateActions = (serial:any) => {

		return (
			<div className="flex gap-2 h-3rem">
				<div className="flex gap-2 h-3rem">
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
				</div>

			</div>
		)
	}

	return (
		<Dialog
			header="Geração de Seriais"
			visible={showModal}
			onHide={() => {
				setShowModal(false)
				setSeriais([])
			}}
			blockScroll={false}
			resizable={false}
			draggable={false}
		>
			<div className={styleSerial}>
				<InputNumber
					id="qtd"
					autoFocus={true}
					placeholder="Quantidade"
					value={quantidade ? quantidade : 0}
					onChange={(e) => {
						if(e.value !== null && e.value > 100){
							toastAlert(`Quantidade máxima de seriais é 100 por iteração.`)
						}
						setQuantidade(e.value)
					}}
					onKeyUpCapture={(e) => {
						if (e.key === `Enter`) {
							if(quantidade > 100){
								enviarQuantidade(100,data.id)
								return
							}
							enviarQuantidade(quantidade,data.id)
						}
					}
					}
					min={0}
					max={100}

				/>
				<Button
					style={{ width: `80px` , height: `40px`}}
					onClick={() => {
						if(quantidade > 100){
							enviarQuantidade(100,data.id)
							return
						}
						enviarQuantidade(quantidade,data.id)
					}}
					label={loading ? `` : `Gerar`}
					loading={loading}
				/>
			</div>

			<h1 className={titleStyle2}>Seriais Gerados</h1>

			<DataTable
				id="serial"
				value={seriais}
				rows={5}
				scrollHeight={heigthTable2}
				emptyMessage="Nenhum serial gerado"
				paginatorClassName={`p-0 mt-0`}
				tableClassName={`p-0`}
				rowClassName={rowClassName}
				paginator
			>
				<Column
					field="serial"
					header="Serial"
					headerStyle={headerTableStyle}
					className={`w-10`}
				/>
				<Column
					header="Ações"
					body={templateActions}
					headerStyle={headerTableStyle}
				/>
			</DataTable>

		</Dialog>
	)
}
