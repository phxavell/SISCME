// import {render, screen} from "@testing-library/react"
// import {vi} from "vitest"
// import {vitest} from "vitest"
// import { TotalGraph, TotalOccurrences } from "./containers"


// const mocks = {
// 	cenario1: {
// 		canvas: undefined,
// 		total: undefined,
// 	} as TotalGraph,
// 	cenario2: {
// 		//Não necessário testar o componente da lib.
// 		// Presupõe-se que a lib já traz imbutido seus próprios testes;
// 		canvas: undefined,
// 		total: 10,
// 	} as TotalGraph
// }


// describe(`totalOccurrences.tsx [Caixa Preta]`, () => {
// 	it(`Deve renderizar o componente em caso de params total nulos`, () => {
// 		render(<TotalOccurrences {...mocks.cenario1}/>)
// 		expect(screen.getByText(`Total de Ocorrências: 0`)).toBeInTheDocument()
// 	})
// 	it(`Deve renderizar o componente em caso de total sendo fornecido`, () => {
// 		render(<TotalOccurrences {...mocks.cenario2}/>)
// 		expect(screen.getByText(`Total de Ocorrências: ${mocks.cenario2.total}`)).toBeInTheDocument()
// 	})
// })
