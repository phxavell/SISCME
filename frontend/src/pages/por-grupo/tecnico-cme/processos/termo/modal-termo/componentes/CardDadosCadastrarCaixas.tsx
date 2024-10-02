import React, {useMemo, useRef, useState} from "react"
import {IPropsCadastrarCaixasTermo, MessageType, TitlesCards} from "../types.ts"
import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {headerTableStyle, heigthTable, styleTable} from "@/util/styles"
import {useMountEffect} from "primereact/hooks"
import {Messages} from "primereact/messages"
import {
	styleCard,
	styleColumnCaixa,
	styleSectionBorderTerm
} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {Card} from "primereact/card"
import '../style.css'
import { makeShowMessage } from "../helps.tsx"
import { useAuth } from "@/provider/Auth/index.tsx"

export const CardDadosCadastrarCaixas: React.FC<IPropsCadastrarCaixasTermo> = (props) => {
	const {
		caixasDisponiveis,
		setCaixasSelecionadas,
		caixasSelecionadas,
	} = props
	const [serial, setSerial] = useState(``)
	const msgs = useRef<Messages>(null)

	const { toastError, toastAlert } = useAuth()

	const removerDeSelecionados = (listaOriginal: any[], recebimento: { serial: any }) => {
		const lista = listaOriginal.filter((item: { serial: any }) => item.serial !== recebimento.serial)
		return lista
	}

	const handleRemoverCaixa = (recebimento: any) => {
		setCaixasSelecionadas(removerDeSelecionados(caixasSelecionadas, recebimento))
	}

	const templateActions = (recebimento: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					text
					icon='pi pi-trash'
					className={styleActionHeader(`orange`, `400`, `600`)}
					style={{color: `white`}}
					onClick={(e) => {
						e.preventDefault()
						handleRemoverCaixa(recebimento)
					}}
				/>
			</div>
		)
	}

	const showMessage = useMemo(()=> makeShowMessage(msgs), [msgs])

	const handleClickAdicionar = () => {
    	if (serial) {
    		const caixaValida = caixasDisponiveis?.find((item: any) => item?.serial === serial)
    		if (!caixaValida) {
				toastError(`Caixa ${serial ?? ``} não encontrada.`)
    		} else {
    			if (!caixasSelecionadas.find((item) => item.serial === serial)) {
    				setCaixasSelecionadas([caixaValida, ...caixasSelecionadas])
    			} else {
					toastError(`Caixa ${serial ?? ``} já lida.`)
    			}
    		}
    		setSerial(``)
    	} else {
			toastAlert(`Serial não informado.`)
    	}
	}


	useMountEffect(() => {
		showMessage(MessageType.PrimeiroCarregamento, ``)
	})

	const footer = useMemo(() => {
    	const quantidadeTotal = caixasSelecionadas?.length ?? 0
    	return `Total de  ${quantidadeTotal} itens.`
	}, [caixasSelecionadas])

	return (
    	<Card
			title={<h4 className="m-0 text-3xl">{TitlesCards.CadastrarCaixas}</h4>}
    		className={styleCard}>
    		<div className={`${styleSectionBorderTerm} -mt-5 flex-grow-1`}>
    			<Messages ref={msgs}/>
    			<div className="text-left flex-wrap">
    				<div className=" flex gap-2 mt-2 w-full border-noround">
    					<InputText
    						autoFocus
    						id="serial"
    						placeholder="Serial"
    						value={serial}
    						className={`w-full h-3rem text-2xl`}
    						onChange={(e) =>
    							setSerial(e.target.value.toUpperCase())
    						}
    					/>
    					<div className="align-self-center w-5rem">
    						<Button
    							text
    							icon='pi pi-plus'
    							className={styleActionHeader(`blue`, `600`, `600`) + `h-3rem w-full`}
    							style={{color: `white`}}
    							onClick={(e) => {
    								e.preventDefault()
    								handleClickAdicionar()
    							}}
    						/>
    					</div>
    				</div>
    			</div>

    			<DataTable
    				scrollHeight={heigthTable}
    				style={styleTable}
    				value={caixasSelecionadas}
    				className="mt-2 text-lg"
    				paginator
    				rows={5}
    				scrollable={false}
    				stripedRows
    				rowClassName={rowClassName}
    				emptyMessage='Nenhuma caixa selecionada.'
    				paginatorClassName={`p-0`}
    				tableClassName={`p-0`}
    				footer={footer}
    			>
    				<Column
    					className={styleColumnCaixa}
    					field="serial"
    					header="Serial"
    					style={{width: `3rem`}}
    					headerStyle={headerTableStyle}
    				/>
    				<Column
    					className={styleColumnCaixa}
    					field="descricao"
    					header="Descrição"
    					style={{width: `12rem`}}
    					headerStyle={headerTableStyle}
    				/>
    				<Column
    					className={styleColumnCaixa}
    					header="Ações"
    					headerStyle={headerTableStyle}
    					body={templateActions}
    					style={{width: `1rem`}}
    				/>
    			</DataTable>
    		</div>
    	</Card>

	)
}
