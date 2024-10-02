import {z} from "zod"
import {FieldValues} from "react-hook-form"

export const QRCodeSchema = z.object({
	qrEquipamento: z.string()
})
export type QRCodeSchemaType = z.infer<typeof QRCodeSchema>

export interface EquipamentoProps {
    id: number
    uuid: string
    value: string
}

export type EquipamentoDropdown = {
    field: FieldValues,
    equipamentosuuid: any
}
