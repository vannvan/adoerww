import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

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


export default () => {
  return (
    <div>
      <Router>
        <div style={{ position: 'absolute', left: 20, top: 20 }}>
          {routes.map((el) => (
            <span key={el.path} style={{ marginRight: 12 }}>
              <Link to={el.path as string}>{el.path}</Link>
            </span>
          ))}
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map((el) => (
              <Route path={el.path} element={el.component} key={el.path} />
            ))}
          </Routes>
        </Suspense>
      </Router>
    </div>
  )
}
