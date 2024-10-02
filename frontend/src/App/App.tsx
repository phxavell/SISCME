import './App.css'
import {BrowserRouter} from 'react-router-dom'
import {Router} from '@/routes/Router.tsx'
import {AuthProvider} from '@/provider/Auth'

import { locale, addLocale} from 'primereact/api'

export default function App() {
	locale(`pt`)
	locale(`pt`)
	addLocale(`pt`, {
		firstDayOfWeek: 1,
		showMonthAfterYear: true,
		dayNames: [`domingo`, `segunda`, `terça`, `quarta`, `quinta`, `sexta`, `sábado`],
		dayNamesShort: [`dom`, `seg`, `ter`, `qua`, `qui`, `sex`, `sáb`],
		dayNamesMin: [`D`, `S`, `T`, `Q`, `Q`, `S`, `S`],
		monthNames: [`janeiro`, `fevereiro`, `março`, `abril`, `maio`, `junho`, `julho`, `agosto`, `setembro`, `outubro`, `novembro`, `dezembro`],
		monthNamesShort: [`jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`],
		today: `Hoje`,
		clear: `Limpar`,
	})
	return (
		<BrowserRouter>
			<AuthProvider>
				<Router/>
			</AuthProvider>
		</BrowserRouter>
	)
}
