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

function normalizeExam(exam) {
    if (!exam) return exam;
    return {
        ...exam,
        subjectName: exam.course?.name,
        courseName:  exam.course.name,
        startsAt: exam.starts_at,
        endsAt: exam.ends_at,
        questionCount: exam.question_count,
        totalPoints: exam.total_points,
    };
}

export function getExams() {
    return fetch(`${API_URL}/exams`, { headers: authHeaders() }).then(handleResponse).then((exams) => exams.map(normalizeExam));
}

export function getExam(examId) {
    return fetch(`${API_URL}/exams/${examId}`, { headers: authHeaders() }).then(handleResponse).then(normalizeExam);
}

export function createExam(examData) {
    return fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(examData),
    }).then(handleResponse);
}

export function deleteExam(examId) {
    return fetch(`${API_URL}/exams/${examId}`, {
        method: "DELETE",
        headers: authHeaders(),
    }).then(handleResponse);
}

export function getExamQuestions(examId) {
    return fetch(`${API_URL}/exams/${examId}/questions`, { headers: authHeaders() }).then(
        handleResponse
    );
}

export function addExamQuestion(examId, questionData) {
    return fetch(`${API_URL}/exams/${examId}/questions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            statement: questionData.text.trim(),
            points: Number(questionData.points) || 1,
            choices: questionData.options.map((option) => ({
                text: option.text.trim(),
                is_correct: option.id === questionData.correctOptionId,
            })),
        }),
    }).then(handleResponse);
}

export function updateExamQuestion(questionId, questionData) {
    return fetch(`${API_URL}/questions/${questionId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(questionData),
    }).then(handleResponse);
}

export function deleteExamQuestion(questionId) {
    return fetch(`${API_URL}/questions/${questionId}`, {
        method: "DELETE",
        headers: authHeaders(),
    }).then(handleResponse);
}

export function getExamResults(examId) {
    return fetch(`${API_URL}/exams/${examId}/results`, { headers: authHeaders() }).then(
        handleResponse
    );
}

export function getAvailableExams() {
    return fetch(`${API_URL}/my/exams`, { headers: authHeaders() }).then(handleResponse).then((exams) => exams.map(normalizeExam));
}

export function getExamToTake(examId) {
    return fetch(`${API_URL}/my/exams/${examId}`, { headers: authHeaders() }).then(handleResponse).then((exam) => ({
        ...normalizeExam(exam),
        questions: (exam.questions || []).map((question) => ({
            ...question,
            text: question.statement,
            options: question.choices || [],
        })),
    })).then((exam) => {
        sessionStorage.setItem(`exam_detail_${examId}`, JSON.stringify(exam));
        return exam;
    });
}

export function submitExam(examId, answers) {
    return fetch(`${API_URL}/my/exams/${examId}/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ answers }),
    }).then(handleResponse).then((result) => {
        const examDetail = JSON.parse(sessionStorage.getItem(`exam_detail_${examId}`) || "null");
        result.questions = (result.correction || []).map((line) => ({
            id: line.question_id,
            text: line.statement,
            points: line.points,
            options: examDetail?.questions?.find((question) => question.id === line.question_id)?.options || [],
            selectedOptionId: line.student_choice_id,
            correctOptionId: line.correct_choice_id,
            selectedOptionText: examDetail?.questions?.find((question) => question.id === line.question_id)?.options
                ?.find((option) => option.id === line.student_choice_id)?.text,
            correctOptionText: examDetail?.questions?.find((question) => question.id === line.question_id)?.options
                ?.find((option) => option.id === line.correct_choice_id)?.text,
        }));
        result.total = result.total_points;
        sessionStorage.setItem(`exam_result_${examId}`, JSON.stringify(result));
        return result;
    });
}

export function getExamResult(examId) {
    const stored = sessionStorage.getItem(`exam_result_${examId}`);
    if (stored) {
        return Promise.resolve(JSON.parse(stored));
    }
    return getExamHistory().then((results) =>
        results.find((result) => String(result.exam_id) === String(examId)) || null
    );
}

export function getExamHistory() {
    return fetch(`${API_URL}/my/results`, { headers: authHeaders() }).then(handleResponse).then((results) => results.map((result) => ({
        ...result,
        examId: result.exam_id,
        subjectName: result.course_code,
        total: result.total_points,
        submittedAt: result.submitted_at,
    })));
}
