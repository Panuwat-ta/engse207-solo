// src/presentation/controllers/studentController.js
const studentService = require('../../business/services/studentService');

class StudentController {
    // TODO: Implement getAllStudents
    async getAllStudents(req, res, next) {
        try {
            const { major, status } = req.query;
            const students = await studentService.getAllStudents(major, status);
            res.json(students);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement getStudentById
    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.getStudentById(id);
            res.json(student);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement createStudent
    async createStudent(req, res, next) {
        try {
            const studentData = req.body;
            const newStudent = await studentService.createStudent(studentData);
            res.status(201).json(newStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateStudent
    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const studentData = req.body;
            const updatedStudent = await studentService.updateStudent(id, studentData);
            res.json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateGPA
    async updateGPA(req, res, next) {
        try {
            const { id } = req.params;
            const { gpa } = req.body;
            const updatedStudent = await studentService.updateGPA(id, gpa);
            res.json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateStatus
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedStudent = await studentService.updateStatus(id, status);
            res.json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement deleteStudent
    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            await studentService.deleteStudent(id);
            res.status(204).send(); // No Content
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();