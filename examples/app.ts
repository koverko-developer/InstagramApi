import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/UserRoutes";
import * as fs from 'fs';
import { promisify } from 'util';
// @ts-ignore
import { IgApiClient, IgLoginTwoFactorRequiredError } from '../src';

class App {

    public app: express.Application;
    public UserRoutes: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.UserRoutes.routes(this.app, IgApiClient, IgLoginTwoFactorRequiredError, fs, promisify);

    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }


}

export default new App().app;
