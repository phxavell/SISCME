import { Demands } from "../DemandasHome"
import {ContainerFlexColumnDiv, titleStyle} from "@/util/styles"

export function DemandasPorClientes() {
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Gerenciamento por Clientes</h1>
			<div>
				<Demands />
			</div>
		</div>
	)
}
