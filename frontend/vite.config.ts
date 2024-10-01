import { defineConfig as defineVite}  from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig,configDefaults, mergeConfig  } from 'vitest/config'
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

const configVite = defineVite({
	plugins: [
		react(  ),
		tsconfigPaths(),
		reactRefresh({
			// @ts-ignore
			excludeExports: [`mapStateToProps`, `mapDispatchToProps`]
		})
	],
	esbuild: {
		pure: [`console.log`],
	},
	worker: {
		plugins: [react()],
	},
	server: {
		host: true,
		port: 8000, // This is the port which we will use in docker
		// Thanks @sergiomoura for the window fix
		// add the next lines if you're using windows and hot reload doesn't work
		watch: {
			usePolling: true
		}
	},
})

export default mergeConfig(configVite, defineConfig({

	test: {
		server: {
			deps: {
				inline: [
					`moment`
				]
			}
		},
		globals: true,
		environment: `jsdom`,
		setupFiles: `jest-setup.js`,
		css: true,
		dangerouslyIgnoreUnhandledErrors:true,
		logHeapUsage: true,
		allowOnly:true,
		coverage: {
			lines: 20,
			branches: 20,
			functions: 20,
			statements: 20,
			enabled: true,
			reportOnFailure:true,
			exclude:[
				...configDefaults.exclude,
				// `**`, // Excluir tudo inicialmente
				// `!**/src/**`, // Exceto a pasta 'src'
				`**/src/components/pdf-templates/**`,
				`**/src/infra/integrations/__mocks__/**`,
				`**/types.ts`,
				`**/schema.ts`,
				`**/**/schemas.ts`,

				`**/src/routes/**`,
				`**/src/routes/schemas.ts`,
				`**/src/util/**`,

				`**/src/vite-env.d.ts`,
				`**/style*.ts`,

			],
			provider:  `v8`,
			reporter: [
				`text`,
				`json-summary`,
				`json`,
				`html`,
			],
			reportsDirectory: `./tests/coverage`,
		},
		cache: {
			dir: `./tests/cache`
		}
	},
}))
