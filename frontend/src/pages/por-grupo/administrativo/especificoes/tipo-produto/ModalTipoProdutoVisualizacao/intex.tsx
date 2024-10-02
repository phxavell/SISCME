import {Dialog} from 'primereact/dialog'
import {useMemo} from 'react'
import moment from 'moment'
import RenderObject from '@/components/RenderObject.tsx'
import {ModalPropsTipoProduto} from "@pages/por-grupo/administrativo/especificoes/tipo-produto/types.ts"

export function ModalTipoProdutoVisualizacao({ visible, onClose, tipoProdutoData }: ModalPropsTipoProduto) {

	const idTipoProduto = `#${tipoProdutoData.id}`
	const dataAtualizacao = moment(tipoProdutoData.atualizado_em)
		.format(`DD/MM/YYYY HH:mm`)
	const dataCriacao = moment(tipoProdutoData.criado_em)
		.format(`DD/MM/YYYY HH:mm`)

	const criadoPor = tipoProdutoData?.criado_por

	const atualizadoPor = tipoProdutoData?.atualizado_por

	const CriadoPor = useMemo(() => {

		if (criadoPor?.nome) {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Criado por: <div className="ml-2 font-normal"><RenderObject data={criadoPor} keyObject='nome' /></div>
					</h3>
					<h3 className="flex flex-row p-0 m-0 font-normal">Em: {dataCriacao}</h3>
				</div>
			)
		} else {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Criado por: <div className="ml-2 font-normal"><RenderObject data={criadoPor} keyObject='nome' /></div>
					</h3>
				</div>
			)
		}

	}, [criadoPor, dataCriacao])
	const AtualizadoPor = useMemo(() => {
		if (atualizadoPor?.nome) {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Atualizado por: <div className="ml-2 font-normal"><RenderObject data={atualizadoPor} keyObject='nome' /></div>
					</h3>
					<h3 className="flex flex-row p-0 m-0 te font-normal">Em: {dataAtualizacao}</h3>
				</div>
			)
		} else {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Atualizado por: <div className="ml-2 font-normal"><RenderObject data={atualizadoPor} keyObject='nome' /></div>
					</h3>
				</div>
			)
		}
	}, [atualizadoPor, dataAtualizacao])

	return (
		<Dialog
			header={idTipoProduto}
			visible={visible}
			data-testid="modal-visualizar"
			style={{ width: `50vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
			}}
		>
			<div className="w-full">
				<div className="w-full flex flex-row ">
					<div className="w-full flex flex-column gap-3">
						<h3 className="flex flex-row p-0 m-0">Descrição: <div className="ml-2 font-normal">{tipoProdutoData?.descricao}</div></h3>
						{CriadoPor}
						{AtualizadoPor}
					</div>
				</div>
			</div>
		</Dialog>
	)
}
