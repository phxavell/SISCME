import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DadosPessoaisInputs, DadosPessoaisSchema } from './shema'
import moment from 'moment/moment'
import { useAuth } from '@/provider/Auth'
import { useCallback, useEffect, useState } from 'react'
import { ContaProps, GereciarInformacoesPessoaisPI } from '@/infra/integrations/gerenciar-informacoes-pessoais'
export function useDadosPessoais() {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<DadosPessoaisInputs>({
		resolver: zodResolver(DadosPessoaisSchema)
	})
	const { user, toastSuccess } = useAuth()
	const [usuario, setUsuario] = useState<ContaProps>()
	const [visible, setVisible] = useState(false)

	const onListUsuario = useCallback(async () => {
		try {
			const data = await GereciarInformacoesPessoaisPI.onList(user)
			const info = data?.infos
			const sexos = info?.sexo === `M` ? { sexo: `Masculino` } : { sexo: `Feminino` }
			const dataNascimento = moment(info?.dtnascimento)
				.format(`DD/MM/YYYY`)
			const dataCadastro = moment(info?.dtcadastro)
				.format(`DD/MM/YYYY`)
			const dataAdmissao = moment(info?.dtadmissao)
				.format(`DD/MM/YYYY`)
			setUsuario(data?.conta)

			reset({
				nome: info?.nome,
				contato: info?.contato,
				coren: info?.coren,
				email: info?.email,
				sexo: sexos,
				profissao: info?.profissao,
				dtnascimento: dataNascimento,
				cpf: info?.cpf,
				cliente: info?.cliente,
				dtcadastro: dataCadastro,
				dtadmissao: dataAdmissao,
				matricula: info?.matricula,
				responsável_tecnico: info?.responsável_tecnico === `N` ? `Não` : `SIM`
			})
		} catch (error) {
			console.log(error)
		}
	}, [user, reset])
	useEffect(() => {
		onListUsuario()
	}, [onListUsuario])
	function handleOpenModal() {
		setVisible(true)
	}
	function handleCloseModal() {
		setVisible(false)
	}
	async function handleSubmitDadosPessoais(data: DadosPessoaisInputs) {
		try {
			const dataNascimento = moment(data?.dtnascimento, `DD/MM/YYYY`)
				.format(`YYYY-MM-DD`)
			const dataForm = {
				nome: data.nome,
				contato: data.contato,
				coren: data.coren,
				email: data.email,
				sexo: data.sexo.sexo === `Masculino` ? `M` : `F`,
				dtnascimento: dataNascimento
			}
			const resp = await GereciarInformacoesPessoaisPI.onUpdateDadosPessoais(user, dataForm)
			toastSuccess(resp.message)
		} catch (error) {
			console.log(error)
		}
	}

	return {
		register,
		handleSubmit,
		Controller,
		control,
		handleSubmitDadosPessoais,
		errors,
		usuario,
		handleOpenModal,
		handleCloseModal,
		visible
	}
}
