import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import * as authApi from "./api/authApi";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./page/Login";
import PageIntrouvable from "./page/PageIntrouvable";

import AdminHome from "./page/admin/AdminHome";
import AdminStudents from "./page/admin/AdminStudents";
import AdminStudent from "./page/admin/AdminStudent";
import AdminCourses from "./page/admin/AdminCourses";
import AdminExams from "./page/admin/AdminExams";
import AdminExamCreate from "./page/admin/AdminExamCreate";
import AdminExamQuestions from "./page/admin/AdminExamQuestions";
import AdminExamResults from "./page/admin/AdminExamResults";

import StudentHome from "./page/student/StudentHome";
import StudentExam from "./page/student/StudentExam.jsx";
import StudentResult from "./page/student/StudentResults.jsx";
import StudentResults from "./page/student/StudentResults";
import StudentProfile from "./page/student/StudentProfile";

export default function App() {
    const [user, setUser] = useState(() => authApi.getStoredUser());

    const handleLogin = useCallback((email, password, role) => {
        return authApi.login(email, password, role).then((loggedInUser) => {
            setUser(loggedInUser);
            return loggedInUser;
        });
    }, []);

    const handleLogout = useCallback(() => {
        authApi.logout();
        setUser(null);
    }, []);

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />

            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* ---- Admin ---- */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminHome user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminStudents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/students/:id"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminStudent />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminCourses />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/exams"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminExams />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/exams/create"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminExamCreate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/exams/:id/questions"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminExamQuestions />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/exams/:id/results"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["admin"]}>
                            <AdminExamResults />
                        </ProtectedRoute>
                    }
                />

                {/* ---- Student ---- */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["student"]}>
                            <StudentHome user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/exams/:id"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["student"]}>
                            <StudentExam />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/exams/:id/result"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["student"]}>
                            <StudentResult />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/results"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["student"]}>
                            <StudentResults />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/profile"
                    element={
                        <ProtectedRoute user={user} allowedRoles={["student"]}>
                            <StudentProfile user={user} />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<PageIntrouvable user={user} />} />
            </Routes>
        </>
    );
}
