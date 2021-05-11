//erp
export const ERP_SYSTEM = {
  development: 'http://192.168.50.87:9999/',
  //   development: 'http://localhost:3000/api/',
  testing: 'https://test-erp.emalacca.com/',
  testing2: 'https://test2-erp.emalacca.com/',
  preproduction: 'https://pre-erp.emalacca.com/',
  production: 'https://erp.emalacca.com/'
}

export const ERP_LOGIN_URL = ERP_SYSTEM[process.env.NODE_ENV]
