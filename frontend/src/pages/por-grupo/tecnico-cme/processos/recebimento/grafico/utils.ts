export const coresChart = {
	// Array de cores sugerido
	colors: [
		`rgba(75, 192, 192, 1)`,   // Verde
		`rgba(16, 133, 211, 1)`,   // Azul escuro

		`rgba(17, 143, 1, 1)`,   // Verde escuro
		// `rgba(184, 196, 14, 1)`,  // Amarelo
		`rgba(5, 106, 99, 1)`,   // Verde sistema

		`rgba(6, 213, 158, 1)`,   // Azul+ claro
		`rgba(71, 97, 175, 1)`,   // Azul
		`rgba(2, 225, 21, 1)`,   // Amarelo
		`rgba(54, 10, 143, 1)`,    // Roxo


	],
	// Array de cores de borda correspondentes
	borderColor: [
		`rgba(75, 192, 192, 1)`,   // Verde
		`rgba(16, 133, 211, 1)`,   // Azul escuro

		`rgba(17, 143, 1, 1)`,   // Verde escuro
		`rgba(184, 196, 14, 1)`,  // Amarelo
		`rgba(5, 106, 99, 1)`,   // Verde sistema

		`rgba(6, 213, 158, 1)`,   // Azul+ claro
		`rgba(71, 97, 175, 1)`,   // Azul
		`rgba(2, 225, 21, 1)`,   // Amarelo
		`rgba(54, 10, 143, 1)`,    // Roxo

	]
}

export const configurarChart = (
	documentStyle: any,
	labels: string[],
	dados: number[],
	tooltips: any[]
) => {
	const textColor = documentStyle.getPropertyValue(`--text-color`)
	const textColorSecondary = documentStyle.getPropertyValue(`--text-color-secondary`)
	const surfaceBorder = documentStyle.getPropertyValue(`--surface-border`)

	const suggestedMax = Math.max(...dados)

	const data = {
		labels: labels,
		datasets: [
			{
				label: `Caixas Pendentes`,
				data: dados,
				backgroundColor: coresChart.colors,
				borderColor: coresChart.borderColor,
				borderWidth: 1,
			}
		]
	}

	let delayed = false
	const options = {
		responsive: true,
		animation: {
			onComplete: () => { delayed = true },
			delay: (context: any) => {
				let delay = 0
				if (context.type === `data` && context.mode === `default` && !delayed) {
					delay = context.dataIndex * 30 + context.datasetIndex * 10
				}
				return delay
			},
		},
		indexAxis: `y`,
		maintainAspectRatio: false,
		aspectRatio: 0.50,
		plugins: {
			tooltip: {
				callbacks: {
					title: function (context:any) {
						let title = context[0]?.label || ``
						if (title) {
							title += `: `
						}
						const clientName = tooltips[context[0]?.dataIndex]
						title += `${clientName}`
						return title
					}
				}
			},
			legend: {
				display: false
			},
			title: {
				display: false
			},
		},
		scales: {
			x: {
				stacked: true,
				ticks: {
					color: textColorSecondary
				},
				grid: {
					color: surfaceBorder
				},
				suggestedMax: suggestedMax * 1.25,
			},
			y: {
				stacked: true,
				ticks: {
					color: textColorSecondary
				},
				grid: {
					color: surfaceBorder
				},
			}
		}
	}

	return [data, options]
}
