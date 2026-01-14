const studentService = require('../../business/services/studentService');

const getAllStudents = async (req, res, next) => {
    try {
        const result = await studentService.getAllStudents(req.query.major, req.query.status);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const createStudent = async (req, res, next) => {
    try {
        const student = await studentService.createStudent(req.body);
        res.status(201).json(student);
    } catch (error) {
        next(error);
    }
};

const updateStudent = async (req, res, next) => {
    try {
        const student = await studentService.updateStudent(req.params.id, req.body);
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const updateStudentGpa = async (req, res, next) => {
    try {
        const student = await studentService.updateGPA(req.params.id, req.body.gpa); // Corrected to updateGPA
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const updateStudentStatus = async (req, res, next) => {
    try {
        const student = await studentService.updateStatus(req.params.id, req.body.status); // Corrected to updateStatus
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        await studentService.deleteStudent(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    updateStudentGpa,
    updateStudentStatus,
    deleteStudent
};
