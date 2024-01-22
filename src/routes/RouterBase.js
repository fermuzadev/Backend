import {Router} from 'express';


export default class RouterBase {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }
    init() {};
    get(path, ...callback) {
        this.router.get(path, this.applyCallBacks(callback))
    }

    post() {

    }
    put() {

    }

    delete() {

    }
    applyCallBacks(callbacks) {
        return callback.map((callback) => {
            return async(...params) => {
                try {
                    await callback.apply(this, params);
                } catch (error) {
                    console.error('Ha ocurrido un error 👀', error.message);
                    params[1].status(500).json({message: error.message});
                }
            }
        })
    }
}