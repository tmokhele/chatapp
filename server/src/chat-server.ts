
import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { HttpClient, HttpXhrBackend, HttpHandler } from '@angular/common/http';

import { Message } from './model';
import { Injector } from '../node_modules/@angular/core';

const http = require('http');

export class ChatServer {
    public static readonly PORT: number = 8080;
    public static readonly BASE_URL: string = "http://localhost:8086/chat"
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private httpClient: HttpClient;

    private options = {
        port: 8086,
        path: 'http://localhost:8086/chat"',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        }
    };

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.httpClientInit();
    }

    private httpClientInit(): void {

        // const injector = Injector.create({
        //     providers: [
        //         { provide: HttpClient, deps: [HttpHandler] },
        //         { provide: HttpHandler, useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest }) },
        //     ],
        // });
        this.httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
    }


    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            http.get(ChatServer.BASE_URL+'/all', (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                    console.log('MMMM: '+JSON.stringify(data));
                });
                resp.on('end', () => {
                    console.log('Messagges: '+JSON.stringify(data));
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
            socket.on('message', (m: Message) => {
                console.log('Posting message to web service: ' + JSON.stringify(this.httpClient))
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
                        console.log('[server](message): %s', JSON.stringify(m))
                    });
                });

                req.write(postData);
                req.end();
                this.io.emit('message', m);
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
