const axios = require("axios");
let BASE_URL = "";
if (process.env.NODE_ENV === "development") {
	// BASE_URL = "https://test-mg.emalacca.com/api/";
	BASE_URL = "https://mg-erp.emalacca.com/api/";
	// BASE_URL = 'http://192.168.50.147:9995'
	// BASE_URL = "http://192.168.50.59:9995";
} else {
	// BASE_URL = "/api";
	// BASE_URL = "http://192.168.50.59:9995";
	// BASE_URL = "https://test-mg.emalacca.com/api/";
	BASE_URL = "https://mg-erp.emalacca.com/api/";
}

const service = axios.create({
	baseURL: BASE_URL,
	timeout: 60 * 1000,
});
function http({ url, method, ...args }) {
	return new Promise((resolve, reject) => {
		service({ url, method, ...args }).then(
			(res) => {
				const { code } = res.data;
				if (code === 0) {
					resolve(res.data);
				}
			},
			(error) => {
				console.log("ERROR:", url, error.response);
				reject(error);
			}
		);
	});
}

module.exports = {
	http,
};
