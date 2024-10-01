import {headerTableStyle} from "@/util/styles"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Dialog} from "primereact/dialog"
import {rowClassName} from "@/components/RowTemplate.tsx"

export function ModalSequenciais({onClose, sequenciais, visible}: any) {

	const data: any[] = []
	if (Array.isArray(sequenciais?.caixas)) {
		const caixas = sequenciais?.caixas
		// @ts-ignore
		caixas.forEach((caixa) => {
			if (!data.find(item => item.sequencial === caixa.sequencial)) {
				data.push(caixa)
			}
		})

	}
	const footer = () => {
		return `Total de  ${data.length ?? 0} ${data.length === 1 ? `item` : `itens`}`
	}

	return (
		<Dialog
			onHide={onClose}
			header={`Detalhes`}
			visible={visible}
			style={{width: `50vw`}}
			dismissableMask
			position="top"
			blockScroll={false}
			draggable={false}
		>
			<div className={`flex flex-column`}>
				<h4>Cliente: {sequenciais?.nome}</h4>
				<h5>Modelo: {sequenciais?.caixas[0].modelo}</h5>
				<DataTable
					value={data ?? []}
					className="w-full overflow-y-scroll"
					stripedRows
					rowClassName={rowClassName}
					rowHover
					size="small"
					scrollable
					rows={10}
					paginator={true}
					emptyMessage="Nenhum resultado encontrado"
					dataKey={`sequencial`}
				>
					<Column
						header="Serial"
						field="sequencial"
						headerStyle={headerTableStyle}
					/>
					<Column
						header="Produção em"
						field="data_producao"
						headerStyle={headerTableStyle}
					/>
					<Column
						header="Validade"
						field="validade"
						headerStyle={headerTableStyle}
					/>
				</DataTable>
				<div className={`font-bold`}>
					{footer()}
				</div>
			</div>

		</Dialog>
	)
}
