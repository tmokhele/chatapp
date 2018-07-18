"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var http_2 = require("@angular/common/http");
var http = require('http');
var ChatServer = /** @class */ (function () {
    function ChatServer() {
        this.options = {
            port: 8086,
            path: 'http://localhost:8086/chat"',
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        };
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.httpClientInit();
    }
    ChatServer.prototype.httpClientInit = function () {
        // const injector = Injector.create({
        //     providers: [
        //         { provide: HttpClient, deps: [HttpHandler] },
        //         { provide: HttpHandler, useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest }) },
        //     ],
        // });
        this.httpClient = new http_2.HttpClient(new http_2.HttpXhrBackend({ build: function () { return new XMLHttpRequest(); } }));
    };
    ChatServer.prototype.createApp = function () {
        this.app = express();
    };
    ChatServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    ChatServer.prototype.config = function () {
        this.port = process.env.PORT || ChatServer.PORT;
    };
    ChatServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    ChatServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            http.get(ChatServer.BASE_URL + '/all', function (resp) {
                var data = '';
                resp.on('data', function (chunk) {
                    data += chunk;
                    console.log('MMMM: ' + JSON.stringify(data));
                });
                resp.on('end', function () {
                    console.log('Messagges: ' + JSON.stringify(data));
                });
            }).on("error", function (err) {
                console.log("Error: " + err.message);
            });
            socket.on('message', function (m) {
                console.log('Posting message to web service: ' + JSON.stringify(_this.httpClient));
                var postData = JSON.stringify(m);
                var postheaders = {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                };
                var optionspost = {
                    host: '127.0.0.1',
                    port: 8086,
                    path: '/chat/',
                    method: 'POST',
                    headers: postheaders
                };
                var req = http.request(optionspost, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log("body: " + chunk);
                        console.log('[server](message): %s', JSON.stringify(m));
                    });
                });
                req.write(postData);
                req.end();
                _this.io.emit('message', m);
            }).on("error", function (err) {
                console.log("Error: " + err.message);
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    ChatServer.prototype.getApp = function () {
        return this.app;
    };
    ChatServer.PORT = 8080;
    ChatServer.BASE_URL = "http://localhost:8086/chat";
    return ChatServer;
}());
exports.ChatServer = ChatServer;
