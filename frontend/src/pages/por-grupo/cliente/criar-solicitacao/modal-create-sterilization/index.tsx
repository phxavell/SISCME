import {useCallback, useMemo, useRef, useState} from 'react'
import {SterilizationRequestsSchema, SterilizationRequestsType} from './schemas.ts'
import {ClienteSolicitacoes} from '@/infra/integrations/cliente-solicitacoes.ts'
import {DataTable} from 'primereact/datatable'
import {Dialog} from 'primereact/dialog'
import {Button} from 'primereact/button'
import {Column} from 'primereact/column'
import {useForm} from 'react-hook-form'
import {InputTextarea} from 'primereact/inputtextarea'
import './modal-create.css'
import {zodResolver} from '@hookform/resolvers/zod'
import {Input} from '@/components/Input.tsx'
import {useAuth} from '@/provider/Auth'
import {Toast} from 'primereact/toast'
import {useSterizationRequest} from '../sterization-request/useSterizationRequest.ts'

interface tableData {
    serial: string
    modelo_caixa: string
    situacao: string
}

interface propsModal {
    openDialog: boolean
    closeDialog: (success: boolean) => void
}

interface Feedbacks {
    description?: string;
}

const maxBoxView = 3
const styleBtnFormSubmmit = `h-10rem w-10rem flex justify-content-center align-items-center button-confirm`
const iconBtnFormSubmit = `pi pi-check text-6xl mr-1 mt-1`
const transitionBtn = `transition-all transition-delay-300 hover:opacity-10`
const labelBtn = `labelSelected border-round-right text-3xl`
const findExistents = (item: string | undefined, arrayExistent: tableData[]): tableData | false => {
	const findExistent = arrayExistent.find(box => box.serial === item)
	if (findExistent) return findExistent
	return false
}

const msgErroZeroCaixas = `É necessário fornecer o código das caixas.`

export default function SterizationComponent(props: propsModal) {
	const {boxsRegistred} = useSterizationRequest()
	const {openDialog, closeDialog} = props
	const [boxsSelected, setBoxSelected] = useState<tableData[]>([])
	const [feedbacks, setFeedback] = useState<Feedbacks[]>([])
	const [note, setNote] = useState<string>()

	const toast = useRef<Toast>(null)

	const showToastError = (message: string) => {
		toast.current?.show({severity: `error`, detail: message})
	}
	const showToastSuccess = (message: string) => {
		toast.current?.show({
			severity: `success`,
			detail: message
		})
	}

	const handleRemoveBox = useCallback((e: any, rowData: tableData) => {
		const prevBox = [...boxsSelected]
		prevBox.splice(prevBox.findIndex(box => box.serial === rowData.serial), 1)
		setBoxSelected(prevBox)
		e.preventDefault()
	}, [boxsSelected])

	const ActionBodyTemplate = useMemo(() => {
		return (rowData: tableData) => {
			return (
				<Button
					icon="pi pi-trash"
					rounded
					outlined
					severity="danger"
					onClick={(e) => handleRemoveBox(e, rowData)}
				/>
			)
		}
	}, [handleRemoveBox])

	const {
		register,
		handleSubmit,
		reset,
	} = useForm<SterilizationRequestsType>({
		resolver: zodResolver(SterilizationRequestsSchema)
	})

	const handleAddBox = useCallback((sequencial: SterilizationRequestsType) => {
		const verificarExisteArray = findExistents(sequencial.serial, boxsRegistred)
		if (verificarExisteArray) {
			if (verificarExisteArray.situacao && verificarExisteArray.situacao === `Livre`) {
				if (findExistents(sequencial.serial, boxsSelected)) {
					const prevBox = [...feedbacks]
					prevBox.splice(0, 0, {
						description: `${sequencial.serial} já adicionada`
					})
					setFeedback(prevBox)
				} else {
					const prevBox = [...boxsSelected]
					prevBox.splice(0, 0, {
						serial: verificarExisteArray.serial,
						modelo_caixa: verificarExisteArray.modelo_caixa,
						situacao: verificarExisteArray.situacao
					})
					setBoxSelected(prevBox)
				}
			} else {
				const prevBox = [...feedbacks]
				prevBox.splice(0, 0, {
					description: `${sequencial.serial} Já estar em uso`
				})
				setFeedback(prevBox)
			}
		} else {
			const prevBox = [...feedbacks]
			prevBox.splice(0, 0, {
				description: `${sequencial.serial}  Não registrada, por favor realize o registro`
			})
			setFeedback(prevBox)
		}
		reset()
	}, [boxsRegistred, boxsSelected, feedbacks, reset])

	const boxsLengthMemo = useMemo(() => {
		return `${boxsSelected?.length ? boxsSelected?.length : 0} caixas lidas`
	}, [boxsSelected])

	const {user} = useAuth()

	const clearModal = () => {
		reset()
		closeDialog(true)
		setFeedback([])
		setBoxSelected([])
	}

	const handleSubmitRequest = () => {

		if (boxsSelected.length) {
			const boxes = boxsSelected.map((box) => ({id: box.serial}))
			ClienteSolicitacoes.save(user, {
				note: note,
				boxes: boxes
			}).then((res) => {
				showToastSuccess(res)

				clearModal()
				closeDialog(true)
			}).catch(errMsg => {
				showToastError(errMsg)
			})
		} else {
			showToastError(msgErroZeroCaixas)
		}
	}

	const handleClose = () => {
		clearModal()
		closeDialog(false)
	}

	return (
		<>
			<Dialog
				className="w-10"
				header="Solicitação de Esterilização"
				visible={openDialog}
				onHide={handleClose}
			>
				<div className="container-geral mt-4 w-15">
					<div className="geral-informacao">

						<span className="w-50 flex gap-1">
							<form onSubmit={handleSubmit(handleAddBox)}>
								<Input
									type="text"
									placeholder="Serial da caixa"
									{...register(`serial`)}
								/>
							</form>

							<Button
								onClick={handleSubmit(handleAddBox)}
								icon="pi pi-plus"
								className={transitionBtn}
							>
							</Button>
						</span>

						<div className="container-table">
							<DataTable
								value={boxsSelected}
								size="small"
								showGridlines
								paginator
								rows={maxBoxView}
								className="w-6"
								emptyMessage=' '
							>
								<Column
									field="serial"
									header="Serial">
								</Column>
								<Column
									body={ActionBodyTemplate}
									exportable={false}></Column>
							</DataTable>
							<div className={labelBtn}>
								{boxsLengthMemo}
							</div>
						</div>
						<span className="p-float-label-mt-2 w-full">
							<InputTextarea
								id="observacoes"
								placeholder="Observações"
								value={note}
								onChange={(e) => setNote(e.target.value)}
								className="text-area w-full"
								autoResize={true}
							/>
						</span>
					</div>
					<div className="icone-content">
						<Button
							onClick={handleSubmitRequest}
							className={styleBtnFormSubmmit}
						>
							<i className={iconBtnFormSubmit}></i>
						</Button>
						<DataTable
							emptyMessage=' '
							value={feedbacks}
							size="small"
							className="w-16rem"
							rows={maxBoxView}
							style={{minWidth: `100px`}}
						>
							<Column
								header="Barra de acompanhamento"
								field="description">
							</Column>
						</DataTable>
					</div>
				</div>
			</Dialog>
		</>

	)
}
