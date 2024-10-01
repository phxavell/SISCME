export const makeChart = (mapLabels: any, dados: [], basesDataset: any) => {
	const colors = [
		{
			bgColor: `rgba(27, 77, 62, 0.8)`,
		},
	]
	const datasets: any = []
	basesDataset?.forEach((base: any, index: number) => {
		datasets.push({
			label: base.label,
			data: dados?.map((dado: any) => dado[base.keyValue] ?? 0),
			backgroundColor: [
				colors[index].bgColor,
			],
			borderWidth: 0,
		})
	})

	return {
		labels: dados?.map(mapLabels),
		datasets: datasets
	}
}
export const mapLabelsMateriais = (dado: any) => {
	return `${dado?.tipoetiqueta}`
}
