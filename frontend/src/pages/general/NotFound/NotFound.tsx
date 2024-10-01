import {Button} from "primereact/button"
import {useNavigate} from "react-router-dom"
import {RoutersPathName} from "@/routes/schemas.ts"

import {styleNotFound} from "@pages/general/NotFound/style.ts"

export const NotFound = ()=> {
	const navigation = useNavigate()
	return (
		<div className={styleNotFound}>

			<h2 className={`text-blue-700`}>
                Página não encontrada
			</h2>
			<Button
				size={`large`}
				icon={`pi pi-home`}
				onClick={()=> {
					if(navigation) {
						navigation(RoutersPathName.Home)
					}

				}}
			></Button>
		</div>
	)
}
