import React from "react"
import { Message } from "primereact/message"
import { styleMessageChart } from "@/util/styles"
import { Button } from "primereact/button"
import { styleActionHeader } from "@/components/RowTemplate"

export type TotalGraph = {
    total: any,
    canvas: any,
	setShowModal: any
}
export const TotalOccurrences: React.FC<TotalGraph> = (props) => {
	const {total, canvas, setShowModal} = props
	return (
		<div>
			<div className="flex flex-col justify-content-center">
				<div className="flex flex-col gap-5 py-4">
					<Message
						style={styleMessageChart(`#117c38`, `rgba(6, 66, 6, 0.897)`)}
						className="h-4rem"
						severity="info"
						content={`Total de Ocorrências: ${total ?? `0`}`}
					/>
				</div>
			</div>
			<div className="flex flex-column align-items-center gap-3">
				<div className='flex gap-3'>
					<Button
						onClick={() => {
							setShowModal(true)
						}}
						className={styleActionHeader(`blue`, `600`, `800`)}
						label="Visualizar em tabela"
					/>
				</div>
				<div style={{height: `36rem`}}>
					<canvas ref={canvas} className='h-full' />
				</div>
			</div>
		</div>
	)
}
