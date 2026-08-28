import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getStudent,
    updateStudentEmail,
    updateStudentPassword,
    setStudentBlocked,
} from "../../api/studentApi";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminStudent() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        getStudent(id)
            .then((data) => {
                setStudent(data);
                setEmail(data.email);
            })
            .catch((err) => setError(err.message || "Impossible de charger cet étudiant."))
            .finally(() => setLoading(false));
    }, [id]);

    function handleEmailSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        updateStudentEmail(id, student.first_name, student.last_name, email)
            .then((updated) => {
                setStudent(updated);
                setSuccess("Email mis à jour.");
            })
            .catch((err) => setError(err.message || "Modification impossible."));
    }

    function confirmPasswordChange() {
        setError("");
        setSuccess("");
        updateStudentPassword(id, student.first_name, student.last_name, student.email, newPassword)
            .then(() => {
                setSuccess("Mot de passe mis à jour par l'administrateur.");
                setNewPassword("");
            })
            .catch((err) => setError(err.message || "Modification impossible."))
            .finally(() => setPendingAction(null));
    }

    function confirmToggleBlock() {
        setError("");
        setStudentBlocked(id, student.first_name, student.last_name, student.email, !student.is_active)
            .then((updated) => setStudent(updated))
            .catch((err) => setError(err.message || "Action impossible."))
            .finally(() => setPendingAction(null));
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container loading-block">
                    <span className="spinner" /> Chargement...
                </div>
            </div>
        );
    }

    if (error && !student) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Étudiant</span>
                    <h1>{student.first_name} {student.last_name}</h1>
                    <span className={`status ${student.blocked ? "status-blocked" : "status-available"}`}>
            {student.blocked ? "Bloqué" : "Actif"}
          </span>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="builder-section">
                    <h3>Adresse email</h3>
                    <form onSubmit={handleEmailSubmit}>
                        <div className="field">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary">
                            Mettre à jour l'email
                        </button>
                    </form>
                </div>

                <div className="builder-section">
                    <h3>Mot de passe</h3>
                    <p className="hint" style={{ marginBottom: 12 }}>
                        L'étudiant ne peut pas modifier lui-même son mot de passe. Seul un Admin peut le faire.
                    </p>
                    <div className="field">
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                        />
                    </div>
                    <button
                        className="btn-primary"
                        disabled={!newPassword}
                        onClick={() => setPendingAction("password")}
                    >
                        Modifier le mot de passe
                    </button>
                </div>

                <div className="builder-section">
                    <h3>Accès au compte</h3>
                    <p className="hint" style={{ marginBottom: 12 }}>
                        {student.blocked
                            ? "Ce compte est actuellement bloqué : l'étudiant ne peut pas se connecter."
                            : "Ce compte est actif."}
                    </p>
                    <button
                        className={student.blocked ? "btn-outline" : "btn-danger"}
                        onClick={() => setPendingAction("block")}
                    >
                        {student.blocked ? "Débloquer l'étudiant" : "Bloquer l'étudiant"}
                    </button>
                </div>
            </div>

            {pendingAction === "password" && (
                <ConfirmModal
                    title="Modifier le mot de passe ?"
                    message="Le nouveau mot de passe remplacera immédiatement l'ancien."
                    confirmLabel="Confirmer"
                    onConfirm={confirmPasswordChange}
                    onCancel={() => setPendingAction(null)}
                />
            )}

            {pendingAction === "block" && (
                <ConfirmModal
                    title={student.blocked ? "Débloquer cet étudiant ?" : "Bloquer cet étudiant ?"}
                    message={
                        student.blocked
                            ? "L'étudiant pourra de nouveau se connecter."
                            : "L'étudiant ne pourra plus se connecter ni passer d'examen."
                    }
                    confirmLabel={student.blocked ? "Débloquer" : "Bloquer"}
                    danger={!student.blocked}
                    onConfirm={confirmToggleBlock}
                    onCancel={() => setPendingAction(null)}
                />
            )}
        </div>
    );
}
