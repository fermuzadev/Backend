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
    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies),this.generateCustomResponse, this.applyCallBacks(callbacks))
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies),this.generateCustomResponse,this.applyCallBacks(callbacks))
    }
    put(path, policies, ...callbacks) {
        this.router.put(path,this.handlePolicies(policies),this.generateCustomResponse, this.applyCallBacks(callbacks))
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies),this.generateCustomResponse,this.applyCallBacks(callbacks))
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

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === 'PUBLIC') {
            return next();
        }
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        //bear admin
        //bear user
        //bear premium
        const token = authorizationHeader.split(' ')[1];
        if(!validateToken(token)) {
            return res.status(401).json({message: 'Unauthorized'})
        }
        const role = this.getRole(token);
        //admin
        //user
        //premium(?)
        if (!policies.includes(token.toUpperCase())) {
            return res.status(403).json({message: 'Unauthorized'});
        }
        next();
    }
    getRole(token){
        return token.toUpperCase();
    }
    validateToken(token) {
        return true;
    }
}