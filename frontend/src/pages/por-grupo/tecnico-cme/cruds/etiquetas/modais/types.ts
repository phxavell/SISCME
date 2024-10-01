import React from "react"
import { z } from "zod"
export interface ModalProps {
    visible: boolean;
    onClose: (prop: boolean) => void;
}
export const complementoForm = z.object({
	descricao: z.string().min(1, `Campo Obrigatório`),
})
export type ComplementoFormSchema = z.infer<typeof complementoForm>

export type ModalComplementoProps = {
    onClose: (success?: boolean) => void
    visible: boolean
    setComplemento: (data: any) => void
}
