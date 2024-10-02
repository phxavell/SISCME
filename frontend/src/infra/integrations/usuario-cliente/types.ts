import { newClientFormSchema } from "@/pages/por-grupo/administrativo/cruds/cliente/novo-cliente/schemas"
import * as Z from 'zod'

export type NewClientFormInputs = Z.infer<typeof newClientFormSchema>
