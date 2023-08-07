import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.less'
const lazyLoad = (moduleName: string) => {
  const Module = lazy(() => import(`./pages/${moduleName}/index.tsx`))
  return <Module />
}
const modulesFiles = import.meta.glob('./pages/*/index.tsx', { eager: true })

const pages = Object.keys(modulesFiles).map((key) => {
  const match = key.match(/pages\/(\S*)\//)
  if (match) {
    const name = match[1]
    return {
      path: name.toLocaleLowerCase(),
      component: name,
    }
  }
})

const routes = pages
  .filter((item) => item?.path)
  .map((route) => {
    return {
      path: route?.path,
      component: lazyLoad(route?.component as string),
    }
  })
  .concat({
    path: '/',
    component: lazyLoad('Login'),
  })

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map((el) => (
              <Route path={el.path} element={el.component} key={el.path} />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
