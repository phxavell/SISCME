export const optionsGraph = (
	title: string,
	xTitle: string,
	yTitle: string,
	xMaximo: number,
	yStepSize: number) => ({
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: true,
			text: title,
			font: {
				size: 20
			}
		},
		tooltip: {
			enabled: true
		}
	},
	scales: {
		x: {
			max: xMaximo * 1.25,
			stacked: false,
			title: {
				display: false,
				text: xTitle,
				font: {
					size: 20
				}
			},
		},
		y: {
			stacked: false,
			beginAtZero: true,
			title: {
				display: false,
				text: yTitle,
				font: {
					size: 20
				}
			},
			ticks: {
				stepSize: yStepSize,
			}
		},
	},
	indexAxis: `y`
})


export const randomColor = () => {
	const cores: any[] = [
		`#323fd9`,
		`#39b927`,
		`#2b9db3`,
		`#be0001`
	]
	return cores
}
