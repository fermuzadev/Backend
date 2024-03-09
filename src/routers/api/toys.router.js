import { Router } from 'express';

import ToysController from '../../controllers/toys.controller.js';

const router = Router();


router.post('/toys', async (req, res, next) => {
    try {
        const newToy = await ToysController.create(req.body);
        res.status(201).json(newToy)
    }
    catch (error) {
        console.log('An error has occurred while trying to create toy', error);
        next(error);
    }
})

router.get('/toys', async (req, res, next) => {
    try {
        const toys = await ToysController.get(req.query);
        res.status(200).json(toys)

    } catch (error) {
        console.log('An error has occurred while trying to get toys', error);
        next(error);
    }
})

router.get('/toys/:tid', async (req, res, next) => {
    try {
        const { params: { tid } } = req;
        const toy = await ToysController.getById(tid);
        res.status(200).json(toy)

    } catch (error) {
        console.log('An error has occurred while trying to get toy', error);
        next(error);
    }
})

router.put('/toys/:tid', async (req, res, next) => {
    try {
        const { body, params: { tid } } = req;
        await ToysController.updateById(tid, body);
        res.status(204).end();

    } catch (error) {
        console.log('An error has occurred while trying to update toy', error);
        next(error);
    }
})

router.patch('/toys/:tid', async (req, res, next) => {
    try {
        const { body, params: { tid } } = req;
        await ToysController.update(tid, body);
        res.status(204).end();
    }
    catch (error) {
        console.log('An error has occurred while trying to update toy', error);
        next(error);
    }
})

router.delete('/toys/:tid', async (req, res, next) => {
    try {
        const { params: { tid } } = req;
        await ToysController.deleteById(tid);
        res.status(204).end();
    }
    catch (error) {
        console.log('An error has occurred while trying to delete toy', error);
        next(error);
    }
})


export default router;