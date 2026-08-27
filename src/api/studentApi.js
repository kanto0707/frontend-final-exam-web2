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

export function getStudents() {
    return fetch(`${API_URL}/students`, { headers: authHeaders() }).then(handleResponse);
}

export function getStudent(studentId) {
    return fetch(`${API_URL}/students/${studentId}`, { headers: authHeaders() }).then(
        handleResponse
    );
}

export function createStudent(studentData) {
    return fetch(`${API_URL}/students`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(studentData),
    }).then(handleResponse);
}

export function updateStudentEmail(studentId, email) {
    return fetch(`${API_URL}/students/${studentId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ email }),
    }).then(handleResponse);
}

export function updateStudentPassword(studentId, password) {
    return fetch(`${API_URL}/students/${studentId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ password }),
    }).then(handleResponse);
}

export function setStudentBlocked(studentId, blocked) {
    return fetch(`${API_URL}/students/${studentId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ blocked }),
    }).then(handleResponse);
}
