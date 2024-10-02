import {DropdownProps} from "primereact/dropdown"
import * as React from "react"
import {ProgressBar} from "primereact/progressbar"
import {Button} from "primereact/button"

export const TemplateEmptyMessage: (keyItem: string, showAdd: boolean, loading: boolean, onclick?: (keyItem: string) => void) => (props: DropdownProps) =>
    React.ReactNode =
    (keyItem, showAdd, loading, onclick) => () => {

    	const handleClick = () => {
    		if (onclick) {
    			onclick(keyItem)
    		}
    	}
    	if (loading) {
    		return (
    			<div className="flex flex-column">
    				<div className="text-xs">Carregando...</div>
    				<ProgressBar mode="indeterminate" style={{height: `6px`}}></ProgressBar>
    			</div>
    		)
    	}
    	const mostrarAdd = () => {
    		if (!showAdd) return
    		return (
    			<div className="flex mt-2 ">
    				<Button
    					label="Adicionar item?"
    					data-testid="btn-add-item"
    					icon="pi pi-plus"
    					raised
    					text
    					severity="info"
    					onClick={handleClick}
    				/>
    			</div>
    		)
    	}

    	return (
    		<div className="flex flex-column">
    			<div className="text-xs">Nenhum item encontrado.</div>
    			{mostrarAdd()}
    		</div>
    	)
    }
