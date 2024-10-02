import React from 'react'

const GenericError: React.FC = () => {
	return (
		<div>
			<h1>Erro no servidor</h1>
			<p>Ocorreu um erro ao processar a requisição. Por favor, tente novamente mais tarde.</p>
		</div>
	)
}

export default GenericError
