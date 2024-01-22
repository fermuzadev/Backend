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
        this.router.get(path, this.generateCustomResponse, this.applyCallBacks(callbacks))
    }

    post() {
        this.router.post(path, this.generateCustomResponse,this.applyCallBacks(callbacks))
    }
    put() {
        this.router.put(path,this.generateCustomResponse, this.applyCallBacks(callbacks))
    }

    delete() {
        this.router.delete(path, this.generateCustomResponse,this.applyCallBacks(callbacks))
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
    generateCustomResponse(req, res , next) {
        res.sendSuccess = (payload) => {
            res.status(200).json({success: true, payload});
        };

        res.sendServerError = (error) => {
            res.status(500).json({success:false, error});
        };
        res.sendUserError = (error) => {
            res.status(400).json({success:false, error})
        };
        res.sendNotFoundError = (error) => {
            res.status(404).json({success:false, error})
        };

        next();
        
    }
}