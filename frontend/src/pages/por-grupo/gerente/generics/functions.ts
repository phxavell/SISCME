function convertToCSV(objArray: any) {
	const array = typeof objArray !== `object` ? JSON.parse(objArray) : objArray
	let str = ``
	for (let i = 0; i < array.length; i++) {
		let line = ``
		for (const index in array[i]) {
			if (line !== ``) line += `,`
			line += array[i][index]
		}
		str += line + `\r\n`
	}
	return str
}

export function downloadCSV(objArray: any, filename: string) {
	const blob = new Blob([`\ufeff`, convertToCSV(objArray)], { type: `text/csv` })
	const url = window.URL.createObjectURL(blob)
	const a = document.createElement(`a`)
	a.setAttribute(`hidden`, ``)
	a.setAttribute(`href`, url)
	a.setAttribute(`download`, filename)
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
}
