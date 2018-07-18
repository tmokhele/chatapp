import { ChatServer } from './chat-server';
import { HttpClient } from '../node_modules/@angular/common/http';

let app = new ChatServer().getApp();
export { app };