import { API_URL, getToken } from "./authApi";

function authHeaders() {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function handleResponse(res) {
    return res.text().then((text) => {
        const data = text ? JSON.parse(text) : null;
        if (!res.ok) {
            throw new Error((data && data.message) || `Erreur ${res.status}`);
        }
        return data;
    });
}

function normalizeStudent(student) {
    return {
        ...student,
        first_name: student.first_name || student.name?.split(" ")[0] || "",
        last_name: student.last_name || student.name?.split(" ").slice(1).join(" ") || "",
        blocked: student.is_active === false,
    };
}

export function getStudents() {
    return fetch(`${API_URL}/students`, { headers: authHeaders() }).then(handleResponse).then((students) => students.map(normalizeStudent));
}

export function getStudent(studentId) {
    return getStudents().then((students) => {
        const student = students.find((item) => String(item.id) === String(studentId));
        if (!student) {
            throw new Error("Étudiant introuvable.");
        }
        return normalizeStudent(student);
    });
}

export function createStudent(studentData) {
    return fetch(`${API_URL}/students`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(studentData),
    }).then(handleResponse).then(normalizeStudent);
}

export function updateStudentEmail(studentId, firstName, lastName, email) {
    return fetch(`${API_URL}/students/${studentId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email }),
    }).then(handleResponse).then(normalizeStudent);
}

export function updateStudentPassword(studentId, firstName, lastName, email, password) {
    return fetch(`${API_URL}/students/${studentId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    }).then(handleResponse).then(normalizeStudent);
}

export function setStudentBlocked(studentId, firstName, lastName, email, isActive) {
    return fetch(`${API_URL}/students/${studentId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, is_active: isActive }),
    }).then(handleResponse).then(normalizeStudent);
}
