//erp
export const ERP_SYSTEM = {
  development: 'https://test-erp.emalacca.com/',
  // development: 'http://localhost:2333/',
  testing: 'https://test-erp.emalacca.com/',
  preproduction: 'https://pre-erp.emalacca.com/',
  production: 'https://erp.emalacca.com/'
}

export const ERP_LOGIN_URL = ERP_SYSTEM[process.env.NODE_ENV]
