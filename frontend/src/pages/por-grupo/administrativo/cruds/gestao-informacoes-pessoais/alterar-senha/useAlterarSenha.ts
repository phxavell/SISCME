import { useAuth } from '@/provider/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { GereciarInformacoesPessoaisPI } from '@/infra/integrations/gerenciar-informacoes-pessoais'
import { AlterarSenhaInputs, AlterarSenhaSchema } from './shema'

export function useAlterarSenha() {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<AlterarSenhaInputs>({
		resolver: zodResolver(AlterarSenhaSchema)
	})
	const { user, toastSuccess, toastError } = useAuth()

	async function handleSubmitAlterarSenha(dataInput: AlterarSenhaInputs) {
		try {

			const dataForm = {
				senha_atual: dataInput.novaAtual,
				nova_senha: dataInput.novaSenha
			}
			const { data } = await GereciarInformacoesPessoaisPI.onUpdateSenha(user, dataForm)
			toastSuccess(data.message)
			reset()
		} catch (error: any) {
			if (error.data) {

				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível atualizar a senha!`)
			}
		}
	}

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `novaAtual` | `novaSenha` | `confirmarSenha`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `novaAtual` || key === `novaSenha` || key == `confirmarSenha`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.message)
		}
	}
	return {
		register,
		handleSubmit,
		handleSubmitAlterarSenha,
		errors,
	}
}
