const validateStudentData = (data) => {
    const { student_code, first_name, last_name, email, major } = data;
    if (!student_code || !first_name || !last_name || !email || !major) {
        return 'student_code, first_name, last_name, email, and major are required';
    }

    const codeError = validateStudentCode(student_code);
    if (codeError) return codeError;

    const emailError = validateEmail(email);
    if (emailError) return emailError;

    const majorError = validateMajor(major);
    if (majorError) return majorError;


    return null;
};

const validateStudentCode = (student_code) => {
    const codePattern = /^\d{10}$/;
    if (!codePattern.test(student_code)) {
        return 'Invalid student code format (must be 10 digits)';
    }
    return null;
}

const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return 'Invalid email format';
    }
    return null;
}

const validateMajor = (major) => {
    const validMajors = ['CS', 'SE', 'IT', 'CE', 'DS'];
    if (!major || !validMajors.includes(major)) {
        return 'Invalid major. Must be one of: CS, SE, IT, CE, DS';
    }
    return null;
}

const validateGpa = (gpa) => {
    if (gpa === undefined || gpa < 0 || gpa > 4.0) {
        return 'GPA must be between 0.0 and 4.0';
    }
    return null;
};

const validateStatus = (status) => {
    const validStatuses = ['active', 'graduated', 'suspended', 'withdrawn'];
    if (!status || !validStatuses.includes(status)) {
        return 'Invalid status. Must be one of: active, graduated, suspended, withdrawn';
    }
    return null;
};

const validateId = (id) => {
    if (id === undefined || isNaN(parseInt(id, 10))) {
        return 'ID must be a number';
    }
    return null;
}

module.exports = {
    validateStudentData,
    validateStudentCode,
    validateEmail,
    validateMajor,
    validateGpa,
    validateStatus,
    validateId
};
