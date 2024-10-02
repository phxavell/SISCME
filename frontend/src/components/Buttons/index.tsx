
export const showButton = ({ loading }: { loading: boolean} ) => {
	return loading ? `Carregando documento...` :
		<span className="font-bold text-xl"
		> <i className="pi pi-download" /> Exportar para PDF </span>
}
