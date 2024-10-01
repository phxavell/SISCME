
import {Button} from 'primereact/button'
import {DataTableRowEditCompleteEvent} from 'primereact/datatable'

export const AcoesTemplate = () => {
	return (
		<div className="flex flex-row pr-0 ">
			<Button icon="pi pi-trash" rounded text severity="danger" />
		</div>
	)
}
// eslint-disable-next-line react-refresh/only-export-components
export const onRowEditComplete = (onPut:any) => ({newData}: DataTableRowEditCompleteEvent) => {
	onPut({...newData} as any)
}
