#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("../app");
const debug = require("debug")("master:server");
const http = require("http");
const CONFIG = require("../../build/config");

const isDev = process.env.NODE_ENV == "development";

/**
 * Get port from environment and store in Express.
 */

const port = isDev
	? normalizePort(process.env.PORT || CONFIG.PORT)
	: CONFIG.PROD_PORT;
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	console.log("\x1B[44m%s\x1B[49m", "服务已启动:", server.address());
	const addr = server.address();
	const bind =
		typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	debug("Listening on " + bind);
}
