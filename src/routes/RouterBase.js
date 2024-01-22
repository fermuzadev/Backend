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
    get(path, ...callbacks) {
        this.router.get(path, this.applyCallBacks(callbacks))
    }

    post() {
        this.router.post(path, this.applyCallBacks(callbacks))
    }
    put() {
        this.router.put(path, this.applyCallBacks(callbacks))
    }

    delete() {
        this.router.delete(path, this.applyCallBacks(callbacks))
    }
    applyCallBacks(callbacks) {
        return callbacks.map((cb) => {
            return async(...params) => {
                try {
                    await cb.apply(this, params);
                } catch (error) {
                    console.error('Ha ocurrido un error 👀', error.message);
                    params[1].status(500).json({message: error.message});
                }
            }
        })
    }
}