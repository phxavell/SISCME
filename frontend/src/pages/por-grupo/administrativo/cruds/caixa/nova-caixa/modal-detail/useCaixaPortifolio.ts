import { CaixaAPI } from "@/infra/integrations/caixa/caixa"
import { useAuth } from "@/provider/Auth"
import { useState } from "react"
// import { PortifolioProps } from "../modal-portifolio/types"

export function useCaixaPortifolio(){
	const { user } = useAuth()
	const [showPortifolioCaixa, setShowPortifolioCaixa] = useState(false)
	const [portifolioCaixa, setPortifolioCaixa] = useState<any>({} as any)
	const handleCaixaPortifolio = async(serial: string) => {
		try {
			const {data} = await CaixaAPI.listarCaixaPorSerial(user, serial)
			setPortifolioCaixa(data)
			setShowPortifolioCaixa(true)
		} catch (error) {
			console.log(error)
		}
	}
	return {
		handleCaixaPortifolio,
		showPortifolioCaixa,
		portifolioCaixa,
		setShowPortifolioCaixa
	}
}
