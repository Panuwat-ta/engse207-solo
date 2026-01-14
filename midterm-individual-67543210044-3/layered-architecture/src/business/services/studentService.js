// src/business/services/studentService.js
const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    // TODO: Implement getAllStudents
    async getAllStudents(major = null, status = null) {
        // 1. Validate filters (if provided)
        if (major) {
            studentValidator.validateMajor(major);
        }
        if (status) {
            studentValidator.validateStatus(status);
        }

        // 2. เรียก studentRepository.findAll(major, status)
        const students = await studentRepository.findAll(major, status);

        // 3. คำนวณสถิติ (active, graduated, suspended, total, avgGPA)
        const total = students.length;
        const active = students.filter(s => s.status === 'active').length;
        const graduated = students.filter(s => s.status === 'graduated').length;
        const suspended = students.filter(s => s.status === 'suspended').length;
        const withdrawn = students.filter(s => s.status === 'withdrawn').length;
        const totalGPA = students.reduce((sum, s) => sum + s.gpa, 0);
        const avgGPA = total > 0 ? (totalGPA / total) : 0;
        
        const statistics = {
            total,
            active,
            graduated,
            suspended,
            withdrawn,
            avgGPA: parseFloat(avgGPA.toFixed(2))
        };

        // 4. return { students, statistics }
        return { students, statistics };
    }

    // TODO: Implement getStudentById
    async getStudentById(id) {
        // 1. Validate ID
        const validatedId = studentValidator.validateId(id);
        // 2. เรียก repository
        const student = await studentRepository.findById(validatedId);
        // 3. ถ้าไม่เจอ throw NotFoundError
        if (!student) {
            throw new Error(`Student with id '${validatedId}' not found`);
        }
        // 4. return student
        return student;
    }

    // TODO: Implement createStudent
    async createStudent(studentData) {
        // 1. Validate student data
        studentValidator.validateStudentData(studentData);
        // 2. Validate student_code format
        studentValidator.validateStudentCode(studentData.student_code);
        // 3. Validate email format
        studentValidator.validateEmail(studentData.email);
        // 4. Validate major
        studentValidator.validateMajor(studentData.major);

        // 5. เรียก repository.create()
        const newStudent = await studentRepository.create(studentData);
        // 6. return created student
        return newStudent;
    }

    // TODO: Implement updateStudent
    async updateStudent(id, studentData) {
        const validatedId = studentValidator.validateId(id);
        const student = await studentRepository.findById(validatedId);
        if (!student) {
            throw new Error(`Student with id '${validatedId}' not found`);
        }
        studentValidator.validateStudentData(studentData);
        studentValidator.validateStudentCode(studentData.student_code);
        studentValidator.validateEmail(studentData.email);
        studentValidator.validateMajor(studentData.major);
        const updatedStudent = await studentRepository.update(validatedId, studentData);
        return updatedStudent;
    }

    // TODO: Implement updateGPA
    async updateGPA(id, gpa) {
        // 1. Validate GPA range (0.0 - 4.0)
        const validatedId = studentValidator.validateId(id);
        studentValidator.validateGPA(gpa);
        // 2. ดึงนักศึกษาจาก repository
        const student = await studentRepository.findById(validatedId);
        if (!student) {
            throw new Error(`Student with id '${validatedId}' not found`);
        }
        // 3. เรียก repository.updateGPA(id, gpa)
        const updatedStudent = await studentRepository.updateGPA(validatedId, gpa);
        // 4. return updated student
        return updatedStudent;
    }

    // TODO: Implement updateStatus
    async updateStatus(id, status) {
        // 1. Validate status
        const validatedId = studentValidator.validateId(id);
        studentValidator.validateStatus(status);
        // 2. ดึงนักศึกษาจาก repository
        const student = await studentRepository.findById(validatedId);
        if (!student) {
            throw new Error(`Student with id '${validatedId}' not found`);
        }
        // 3. ตรวจสอบ business rule: ไม่สามารถเปลี่ยนสถานะ withdrawn ได้
        if (student.status === 'withdrawn') {
            throw new Error('Cannot change status of a withdrawn student');
        }
        // 4. เรียก repository.updateStatus(id, status)
        const updatedStudent = await studentRepository.updateStatus(validatedId, status);
        // 5. return updated student
        return updatedStudent;
    }

    // TODO: Implement deleteStudent
    async deleteStudent(id) {
        // 1. ดึงนักศึกษาจาก repository
        const validatedId = studentValidator.validateId(id);
        const student = await studentRepository.findById(validatedId);
        if (!student) {
            throw new Error(`Student with id '${validatedId}' not found`);
        }
        // 2. ตรวจสอบ business rule: ไม่สามารถลบ active student
        if (student.status === 'active') {
            throw new Error('Cannot delete an active student');
        }
        // 3. เรียก repository.delete(id)
        await studentRepository.delete(validatedId);
    }
}

module.exports = new StudentService();