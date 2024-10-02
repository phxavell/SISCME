// import {useNavigate} from "react-router-dom";
import * as Z from "zod"

export type LoginFormInputs = Z.infer<typeof loginFormSchema>
export const loginFormSchema = Z.object({
	username: Z.string().nonempty(`Campo Obrigatório`),
	password: Z.string().nonempty(`Campo Obrigatório`),
})
export const defaultValues = {
	username: ``,
	password: ``
}
