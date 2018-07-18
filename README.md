

A Socket.io Chat Example Using TypeScript
=========================================

This repository contains server & client side code using `TypeScript` language. SpringBoot Application for Rest Services to save and retrieve chats. 
Firebase for authentication and database 


# Running Server and Client locally
## Prerequisites

First, ensure you have the following installed:

1. NodeJS - Download and Install latest version of Node: [NodeJS](https://nodejs.org)
2. Git - Download and Install [Git](https://git-scm.com)
3. Angular CLI - Install Command Line Interface for Angular [https://cli.angular.io/](https://cli.angular.io/)
4. Apache Maven -Download https://maven.apache.org/docs/3.5.0/release-notes.html
5. Java Run Time Environment - http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

After that, use `Git bash` to run all commands if you are on Windows platform.

## Clone repository

In order to start the project use:

```bash
$ git clone https://github.com/tmokhele/chatapp.git
$ cd Chat/Chat
```

## Run Server

To run server locally, just install dependencies and run `gulp` task to create a build:

```bash
$ cd server
$ npm install -g gulp-cli
$ npm install
$ gulp build
$ npm start
```

The `socket.io` server will be running on port `8080`

## Run Angular Client

Open other command line window and run following commands:

```bash
$ cd client
$ npm install
$ ng serve
```

Now open your browser in following URL: [http://localhost:4200](http://localhost:4200/)

## Run SpringBoot App

Open other command line window and run following commands:

```bash
$ cd tebogochat
$ mvn spring-boot:run
```

