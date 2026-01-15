// src/business/services/studentService.js
const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    async getAllStudents(major = null, status = null) {
        if (major) {
            const error = studentValidator.validateMajor(major);
            if (error) {
                const e = new Error(error);
                e.statusCode = 400;
                throw e;
            }
        }
        if (status) {
            const error = studentValidator.validateStatus(status);
            if (error) {
                const e = new Error(error);
                e.statusCode = 400;
                throw e;
            }
        }

        const students = await studentRepository.findAll(major, status);

        const total = students.length;
        const active = students.filter(s => s.status === 'active').length;
        const graduated = students.filter(s => s.status === 'graduated').length;
        const suspended = students.filter(s => s.status === 'suspended').length;
        const withdrawn = students.filter(s => s.status === 'withdrawn').length;
        
        const studentsWithGPA = students.filter(s => s.gpa !== null && s.gpa !== undefined);
        const totalGPA = studentsWithGPA.reduce((sum, s) => sum + s.gpa, 0);
        const avgGPA = studentsWithGPA.length > 0 ? (totalGPA / studentsWithGPA.length) : 0;
        
        const statistics = {
            total,
            active,
            graduated,
            suspended,
            withdrawn,
            avgGPA: parseFloat(avgGPA.toFixed(2))
        };

        return { students, statistics };
    }

    async getStudentById(id) {
        const idError = studentValidator.validateId(id);
        if (idError) {
            const e = new Error(idError);
            e.statusCode = 400;
            throw e;
        }
        const validatedId = parseInt(id, 10);
        const student = await studentRepository.findById(validatedId);
        if (!student) {
            const e = new Error(`Student with id '${validatedId}' not found`);
            e.statusCode = 404;
            throw e;
        }
        return student;
    }

    async createStudent(studentData) {
        const dataError = studentValidator.validateStudentData(studentData);
        if (dataError) {
            const e = new Error(dataError);
            e.statusCode = 400;
            throw e;
        }
        
        const newStudent = await studentRepository.create(studentData);
        return newStudent;
    }

    async updateStudent(id, studentData) {
        const idError = studentValidator.validateId(id);
        if (idError) {
            const e = new Error(idError);
            e.statusCode = 400;
            throw e;
        }
        const validatedId = parseInt(id, 10);

        const student = await studentRepository.findById(validatedId);
        if (!student) {
            const e = new Error(`Student with id '${validatedId}' not found`);
            e.statusCode = 404;
            throw e;
        }

        const dataError = studentValidator.validateStudentData(studentData);
        if (dataError) {
            const e = new Error(dataError);
            e.statusCode = 400;
            throw e;
        }
        const updatedStudent = await studentRepository.update(validatedId, studentData);
        return updatedStudent;
    }

    async updateGPA(id, gpa) {
        const idError = studentValidator.validateId(id);
        if (idError) {
            const e = new Error(idError);
            e.statusCode = 400;
            throw e;
        }
        const validatedId = parseInt(id, 10);

        const gpaError = studentValidator.validateGpa(gpa);
        if (gpaError) {
            const e = new Error(gpaError);
            e.statusCode = 400;
            throw e;
        }

        const student = await studentRepository.findById(validatedId);
        if (!student) {
            const e = new Error(`Student with id '${validatedId}' not found`);
            e.statusCode = 404;
            throw e;
        }
        const updatedStudent = await studentRepository.updateGPA(validatedId, gpa);
        return updatedStudent;
    }

    async updateStatus(id, status) {
        const idError = studentValidator.validateId(id);
        if (idError) {
            const e = new Error(idError);
            e.statusCode = 400;
            throw e;
        }
        const validatedId = parseInt(id, 10);

        const statusError = studentValidator.validateStatus(status);
        if (statusError) {
            const e = new Error(statusError);
            e.statusCode = 400;
            throw e;
        }

        const student = await studentRepository.findById(validatedId);
        if (!student) {
            const e = new Error(`Student with id '${validatedId}' not found`);
            e.statusCode = 404;
            throw e;
        }

        if (student.status === 'withdrawn') {
            const e = new Error('Cannot change status of a withdrawn student');
            e.statusCode = 400;
            throw e;
        }
        const updatedStudent = await studentRepository.updateStatus(validatedId, status);
        return updatedStudent;
    }

    async deleteStudent(id) {
        const idError = studentValidator.validateId(id);
        if (idError) {
            const e = new Error(idError);
            e.statusCode = 400;
            throw e;
        }
        const validatedId = parseInt(id, 10);

        const student = await studentRepository.findById(validatedId);
        if (!student) {
            const e = new Error(`Student with id '${validatedId}' not found`);
            e.statusCode = 404;
            throw e;
        }

        if (student.status === 'active') {
            const e = new Error('Cannot delete an active student');
            e.statusCode = 400;
            throw e;
        }
        await studentRepository.delete(validatedId);
    }
}

module.exports = new StudentService();