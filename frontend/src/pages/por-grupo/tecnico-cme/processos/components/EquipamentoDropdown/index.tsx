import {Dropdown} from 'primereact/dropdown'
import {EquipamentoDropdown} from "@pages/por-grupo/tecnico-cme/processos/components/EquipamentoDropdown/types.ts"

export function EquipamentoDropdown({field, equipamentosuuid}:EquipamentoDropdown){
	return(
		<Dropdown
			id={field.name}
			value={field.value}
			optionLabel="value"
			optionValue="id"
			placeholder="Equipamento"
			options={equipamentosuuid}
			focusInputRef={field.ref}
			onChange={(e) => field.onChange(e.target.value)}
			disabled
			className="bg-gray-400"
		/>
	)
}
