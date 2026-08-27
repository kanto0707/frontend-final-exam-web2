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

export function getCourses() {
    return fetch(`${API_URL}/admin/courses`, { headers: authHeaders() }).then(handleResponse);
}

export function createCourse(courseData) {
    return fetch(`${API_URL}/admin/courses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(courseData),
    }).then(handleResponse);
}

export function updateCourse(courseId, courseData) {
    return fetch(`${API_URL}/admin/courses/${courseId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(courseData),
    }).then(handleResponse);
}

export function deleteCourse(courseId) {
    return fetch(`${API_URL}/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: authHeaders(),
    }).then(handleResponse);
}
