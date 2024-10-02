import {ReactNode} from 'react'
import { AuthContext} from '@/provider/Auth/index.tsx'
import {BrowserRouter} from 'react-router-dom'

interface MockedContextProviderProps {
    children: ReactNode;
    contextValue: any;
  }
const MockedContextProvider = ({ children, contextValue }: MockedContextProviderProps) => {
	return (
		<AuthContext.Provider value={contextValue}>
			<BrowserRouter>
				{children}
			</BrowserRouter>
		</AuthContext.Provider>
	)
}

export default MockedContextProvider
