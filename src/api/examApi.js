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

export function getExams() {
    return fetch(`${API_URL}/admin/exams`, { headers: authHeaders() }).then(handleResponse);
}

export function getExam(examId) {
    return fetch(`${API_URL}/admin/exams/${examId}`, { headers: authHeaders() }).then(handleResponse);
}

export function createExam(examData) {
    return fetch(`${API_URL}/admin/exams`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(examData),
    }).then(handleResponse);
}

export function deleteExam(examId) {
    return fetch(`${API_URL}/admin/exams/${examId}`, {
        method: "DELETE",
        headers: authHeaders(),
    }).then(handleResponse);
}

export function getExamQuestions(examId) {
    return fetch(`${API_URL}/admin/exams/${examId}/questions`, { headers: authHeaders() }).then(
        handleResponse
    );
}

export function addExamQuestion(examId, questionData) {
    return fetch(`${API_URL}/admin/exams/${examId}/questions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(questionData),
    }).then(handleResponse);
}

export function updateExamQuestion(questionId, questionData) {
    return fetch(`${API_URL}/admin/questions/${questionId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(questionData),
    }).then(handleResponse);
}

export function deleteExamQuestion(questionId) {
    return fetch(`${API_URL}/admin/questions/${questionId}`, {
        method: "DELETE",
        headers: authHeaders(),
    }).then(handleResponse);
}

export function getExamResults(examId) {
    return fetch(`${API_URL}/admin/exams/${examId}/results`, { headers: authHeaders() }).then(
        handleResponse
    );
}

export function getAvailableExams() {
    return fetch(`${API_URL}/student/exams`, { headers: authHeaders() }).then(handleResponse);
}

export function getExamToTake(examId) {
    return fetch(`${API_URL}/student/exams/${examId}`, { headers: authHeaders() }).then(handleResponse);
}

export function submitExam(examId, answers) {
    return fetch(`${API_URL}/student/exams/${examId}/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ answers }),
    }).then(handleResponse);
}

export function getExamResult(examId) {
    return fetch(`${API_URL}/student/exams/${examId}/result`, { headers: authHeaders() }).then(
        handleResponse
    );
}

export function getExamHistory() {
    return fetch(`${API_URL}/student/results`, { headers: authHeaders() }).then(handleResponse);
}
