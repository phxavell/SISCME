import {DropdownProps} from "primereact/dropdown"
import * as React from "react"
import {Button} from "primereact/button"
import {MultiSelectProps} from "primereact/multiselect"

export const TemplateEmptyFilterMessage: (keyItem: string, showAdd: boolean, onclick?: (keyItem: string) => void) => (props: DropdownProps |MultiSelectProps ) => React.ReactNode =
    (keyItem, showAdd, onclick) => () => {

    	const handleClick = () => {
    		if (onclick) {
    			onclick(keyItem)
    		}
    	}

    	const showBtnAdd = (show: boolean) => {
    		if (show) {
    			return (
    				<div className="xs:hidden flex mt-2 ">
    					<Button
    						data-testid="btn-add-item"
    						label="Adicionar item?"
    						icon="pi pi-plus"
    						raised
    						text
    						severity="info"
    						onClick={handleClick}
    					/>
    				</div>
    			)
    		}
    		return (<div></div>)
    	}

    	return (
    		<div className="flex flex-column">
    			<div className="text-xs">Nenhum valor encontrado para a pesquisa acima.</div>
    			{showBtnAdd(showAdd)}
    		</div>
    	)
    }
