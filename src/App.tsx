import type { ReactElement } from 'react'
import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Component from 'pages/home'

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<Suspense fallback={<div />}>
				<Routes>
					<Route path='/' element={<Component />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
