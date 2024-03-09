
import ToysService from "../services/toys.services.js";

export default class ToysController {
    static async create(data) {
        console.log('Creating toy');
        const newToy = await ToysService.create(data);
        console.log('Toy created');
        return newToy;
    }

    static async get(query = {}) {
        const toys = await ToysService.findAll(query);
        return toys;
    }

    static async getById(tid) {
        const toy = await ToysService.findById(tid);
        if (!toy) {
            throw new Error('Toy not found');
        }
        return toy;
    }

    static async updateById(tid, data) {
        await ToysController.getById(tid);
        console.log('Updating toy');
        const toy = await ToysService.updateById(tid, data);
        console.log('Toy updated');
    }

    static async deleteById(tid) {
        await ToysController.getById(tid);
        console.log('Deleting toy');
        const toy = await ToysService.deleteById(tid);
        console.log('Toy deleted');
    }
}