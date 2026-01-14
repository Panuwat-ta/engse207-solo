// Global state
let currentStatusFilter = 'all';
let currentMajorFilter = 'all';

// Load students on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();

    // Event listeners for modals and forms
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('student-form').addEventListener('submit', handleSubmit);

    document.getElementById('gpa-close').addEventListener('click', closeGPAModal);
    document.getElementById('gpa-cancel').addEventListener('click', closeGPAModal);
    document.getElementById('gpa-form').addEventListener('submit', handleGPASubmit);

    document.getElementById('status-close').addEventListener('click', closeStatusModal);
    document.getElementById('status-cancel').addEventListener('click', closeStatusModal);
    document.getElementById('status-form').addEventListener('submit', handleStatusSubmit);

    // Event listeners for filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = e.target.dataset.filter;
            filterStudents(filterValue, currentMajorFilter);
        });
    });
});

// Load students from API
async function loadStudents(status = 'all', major = 'all') {
    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('student-list').style.display = 'none';

        const data = await api.getAllStudents(
            major === 'all' ? null : major,
            status === 'all' ? null : status
        );

        displayStudents(data.students);
        updateStatistics(data.statistics);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('student-list').style.display = 'grid';

    } catch (error) {
        console.error('Error loading students:', error);
        alert('Failed to load students. Please try again.');
        document.getElementById('loading').style.display = 'none';
    }
}

// Display students in grid
function displayStudents(students) {
    const container = document.getElementById('student-list');

    if (students.length === 0) {
        container.innerHTML = '<div class="no-students">🎓 No students found</div>';
        return;
    }

    container.innerHTML = students.map(student => {
        const gpaClass = getGPAClass(student.gpa || 0);
        return `
            <div class="student-card">
                <div class="student-header">
                    <div>
                        <h3>${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</h3>
                        <span class="student-code">🆔 ${escapeHtml(student.student_code)}</span>
                    </div>
                    <span class="status-badge status-${student.status}">
                        ${student.status.toUpperCase()}
                    </span>
                </div>
                
                <div class="student-details">
                    <div class="detail-row">
                        <span class="detail-label">📧 Email:</span>
                        <span class="detail-value">${escapeHtml(student.email)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📚 Major:</span>
                        <span class="detail-value">${escapeHtml(student.major)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📊 GPA:</span>
                        <span class="gpa-badge ${gpaClass}">${(student.gpa || 0).toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="actions">
                    <button class="btn btn-info" onclick="showGPAModal(${student.id}, ${student.gpa})">Update GPA</button>
                    <button class="btn btn-warning" onclick="showStatusModal(${student.id}, '${student.status}')">Change Status</button>
                    <button class="btn btn-secondary" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id}, '${student.status}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Get GPA class for color coding
function getGPAClass(gpa) {
    if (gpa >= 3.5) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-fair';
    return 'gpa-poor';
}

// Update statistics
function updateStatistics(stats) {
    document.getElementById('stat-active').textContent = stats.active;
    document.getElementById('stat-graduated').textContent = stats.graduated;
    document.getElementById('stat-suspended').textContent = stats.suspended;
    document.getElementById('stat-total').textContent = stats.total;
    
    // --- แก้ไขตรงจุดนี้ ---
    // ตรวจสอบว่ามีค่า averageGPA หรือไม่ ถ้าไม่มีให้ใช้ 0
    const gpa = stats.averageGPA || 0; 
    document.getElementById('stat-gpa').textContent = Number(gpa).toFixed(2);
}

// Filter students
function filterStudents(status, major) {
    currentStatusFilter = status;
    currentMajorFilter = major;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === status) {
            btn.classList.add('active');
        }
    });
    
    loadStudents(status, major);
}

// Show add student modal
function showAddModal() {
    document.getElementById('modal-title').textContent = 'Add New Student';
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('student-modal').style.display = 'none';
}

// Handle form submit
async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('student-id').value;
    const studentData = {
        student_code: document.getElementById('student_code').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        major: document.getElementById('major').value
    };

    try {
        if (id) {
            await api.updateStudent(id, studentData);
        } else {
            await api.createStudent(studentData);
        }

        alert(id ? 'Student updated successfully!' : 'Student added successfully!');
        closeModal();
        loadStudents(currentStatusFilter, currentMajorFilter);

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Edit student
async function editStudent(id) {
    try {
        const student = await api.getStudentById(id);

        document.getElementById('modal-title').textContent = 'Edit Student';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student_code').value = student.student_code;
        document.getElementById('first_name').value = student.first_name;
        document.getElementById('last_name').value = student.last_name;
        document.getElementById('email').value = student.email;
        document.getElementById('major').value = student.major;

        document.getElementById('student-modal').style.display = 'flex';

    } catch (error) {
        alert('Error loading student details: ' + error.message);
    }
}

// Show GPA modal
function showGPAModal(id, currentGPA) {
    document.getElementById('gpa-student-id').value = id;
    document.getElementById('gpa').value = currentGPA.toFixed(2);
    document.getElementById('gpa-modal').style.display = 'flex';
}

// Close GPA modal
function closeGPAModal() {
    document.getElementById('gpa-modal').style.display = 'none';
}

// Handle GPA submit
async function handleGPASubmit(event) {
    event.preventDefault();

    const id = document.getElementById('gpa-student-id').value;
    const gpa = parseFloat(document.getElementById('gpa').value);

    try {
        await api.updateGPA(id, gpa);

        alert('GPA updated successfully!');
        closeGPAModal();
        loadStudents(currentStatusFilter, currentMajorFilter);

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Show status modal
function showStatusModal(id, currentStatus) {
    document.getElementById('status-student-id').value = id;
    document.getElementById('status').value = currentStatus;
    document.getElementById('status-modal').style.display = 'flex';
}

// Close status modal
function closeStatusModal() {
    document.getElementById('status-modal').style.display = 'none';
}

// Handle status submit
async function handleStatusSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('status-student-id').value;
    const status = document.getElementById('status').value;

    try {
        await api.updateStatus(id, status);

        alert('Status updated successfully!');
        closeStatusModal();
        loadStudents(currentStatusFilter, currentMajorFilter);

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete student
async function deleteStudent(id, status) {
    if (status === 'active') {
        alert('Cannot delete active student. Change status first.');
        return;
    }

    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        await api.deleteStudent(id);

        alert('Student deleted successfully!');
        loadStudents(currentStatusFilter, currentMajorFilter);

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}