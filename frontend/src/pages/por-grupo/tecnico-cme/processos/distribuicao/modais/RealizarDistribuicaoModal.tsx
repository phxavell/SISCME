import {DistribuicaoAPI} from "@infra/integrations/processo/distribuicao/distribuicao.ts"
import {useAuth} from "@/provider/Auth"
import {headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Dialog} from "primereact/dialog"
import React from "react"
import {InputText} from "primereact/inputtext"
import {DropdownSearch} from "@/components/DropdownSeach/DropdownSearch.tsx"
import {
	IRealizarDistribuicao
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/schema.ts"
import {
	useRealizarDistribuicaoModal
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/useRealizarDistribuicaoModal.ts"
import {EstoqueDistribuicao} from "@infra/integrations/processo/distribuicao/types-distribuicao.ts"

const HeaderDialog = (handleDistribuicao: any, data?: EstoqueDistribuicao) => () => {
	return (
		<div className="w-full flex justify-content-between">
			<div>
				<h4 className="m-0">Realizar distribuição</h4>
				<h6 className="m-0">({data?.nome})</h6>

			</div>
			<Button
				label="Completar"
				className="mr-3 bg-green-600 border-green-600 hover:bg-green-700"
				onClick={handleDistribuicao}
			/>
		</div>
	)
}


export const RealizarDistribuicaoModal: React.FC<IRealizarDistribuicao> = (props) => {
	const {visible, clienteSelecionado} = props
	const {
		listaBipado,
		sequencial, setSerial,
		cautela, setCautela,
		loadingOption,
		setores,
		includeList,
		handleDistribuicao,
		handleCloseModal,
		deletarSerial,
		onFilterItens,
		control,
		formState: {errors},
		clearErrors,

	} = useRealizarDistribuicaoModal(props)

	const AcoesTemplate = (data: any) => {
		return (
			<Button
				className='bg-red-600 h-2rem border-red-600 hover:bg-red-700'
				icon='pi pi-trash'
				onClick={() => deletarSerial(data.serial)}
			/>

		)
	}


	return (
		<Dialog
			onHide={handleCloseModal}
			header={HeaderDialog(handleDistribuicao, clienteSelecionado)}
			visible={visible}
			style={{width: `50rem`}}
			position="top"
			blockScroll={false}
			draggable={false}
			dismissableMask={true}
		>
			<form className="flex gap-2 w-full mb-5 mt-4">
				<span className="p-float-label">
					<InputText
						placeholder="Cautela"
						value={cautela}
						className={`w-8rem h-3rem`}
						id={`cautela`}
						onChange={(e) => setCautela(e.target.value)}
					/>
					<label htmlFor={`cautela`}>Cautela</label>
				</span>
				<div className={`w-15rem  h-3rem`}>
					<DropdownSearch
						label="Setor"
						keyItem="setor"
						control={control}
						errors={errors}
						filter
						clearErrors={clearErrors}
						showAdd={false}
						loadingOptions={loadingOption}
						listOptions={setores}
						optionsObject={{optionValue: `id`, optionLabel: `descricao`}}
						onFilter={onFilterItens}
					/>
				</div>

				<span className="p-float-label ml-auto">
					<InputText
						placeholder="Serial da caixa"
						value={sequencial}
						autoFocus
						className={`w-9rem  h-3rem`}
						id={`sequencial`}
						onChange={(e) => setSerial(e.target.value)}
					/>
					<label htmlFor={`sequencial`}>Serial</label>
				</span>

				<Button
					icon='pi pi-plus'
					onClick={includeList}
					type="submit"
				/>
				<div className="flex gap-1 ">

				</div>
			</form>
			<DataTable
				value={listaBipado}
				emptyMessage={`Nenhum resultado encontrado`}
				dataKey={`serial`}

			>
				<Column
					header='Serial'
					style={{width: `20%`}}
					field="serial"
					headerStyle={headerTableStyle}/>
				<Column
					header='Descrição'
					field="descricao"
					headerStyle={headerTableStyle}/>
				<Column
					header='Ações'
					style={{width: `20%`}}
					headerStyle={headerTableStyle}
					body={AcoesTemplate}/>
			</DataTable>
			<div className={`flex mt-2  font-bold`}>Total de {listaBipado?.length ?? 0} caixas.</div>
		</Dialog>
	)
}
