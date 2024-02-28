import { Router } from 'express'
import userModel from '../../dao/models/user.model.js';
import { createHash, isValidPassword, tokenGenerator } from "../../utils.js";


const router = Router()
router.post('/auth/register', async (req, res) => {
    const {
        first_name,
        last_name,
        dni,
        email,
        role,
        password
    } = req.body;
    if (!first_name || !last_name || !dni || !email || !password) {
        return res.status(400).json({ message: "Missing fields" })
    }
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(409).json({ message: "User already exists." })
    }
    user = await userModel.create({
        first_name,
        last_name,
        dni,
        email,
        role,
        password: createHash(password)
    })

    res.status(201).json({ message: 'User successfully created' })
})

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: 'Email or password invalid' });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Email or password invalid' });
    }
    const validPassword = isValidPassword(password, user);
    if (!validPassword) {
        return res.status(401).json({ message: 'Email or password invalid' });
    }
    const token = tokenGenerator(user);
    res.cookie('access_token', token, { maxAge: 60000, httpOnly: true, signed: true }).status(200).json({ message: 'Login successfully' })
})

export default router;

