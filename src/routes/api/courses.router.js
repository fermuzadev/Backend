import { Router } from "express";
import { __dirname } from "../../utils.js";
import passport from "passport";
import CourseModel from "../../dao/models/course.model.js";
import { authPolicies } from "../../utils.js";

const router = Router();

router.get("/courses", passport.authenticate('jwt', { session: false }), authPolicies(['student']), async (req, res) => {
    const courses = await CourseModel.find().populate('professor').populate('students.student');
    res.status(200).json(courses);
});

router.post("/courses", passport.authenticate('jwt', { session: false }), authPolicies(['admin', 'professor']), async (req, res) => {
    try {
        const { body } = req;
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' })
        }
        const course = await CourseModel.create({
            ...body,
            professor: req.user.id,
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/courses/:cid", passport.authenticate('jwt', { session: false }), authPolicies(['student', 'professor', 'admin']), async (req, res) => {
    const { cid } = req.params;
    try {
        const course = await CourseModel.findById(cid);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
        } else {
            return res.status(200).json(course);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/courses/:cid", passport.authenticate('jwt', { session: false }), authPolicies(['professor', 'admin']), async (req, res) => {
    const { cid } = req.params;
    const { body } = req;
    const result = await CourseModel.updateOne({ _id: cid }, { $set: body });
    res.status(204).end();
});

router.delete("/courses/:cid", passport.authenticate('jwt', { session: false }), authPolicies(['admin']), async (req, res) => {
    const { cid } = req.params;
    try {
        const deleted = await CourseModel.deleteOne({ _id: cid });
        if (!deleted) {
            res.status(404).json({ message: "User not found" });
        } else {
            return res.status(204).end();
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
