import { Link } from "react-router-dom";

export function formatDateTime(isoString) {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const STATUS_LABELS = {
    upcoming: "À venir",
    available: "Disponible",
    done: "Terminé",
    expired: "Expiré",
};

export const STATUS_CLASSES = {
    upcoming: "status-upcoming",
    available: "status-available",
    done: "status-done",
    expired: "status-expired",
};

export function computeDisplayStatus(exam) {
    if (exam.status) return exam.status;
    if (exam.submitted) return "done";

    const now = new Date();
    const start = new Date(exam.startsAt);
    const end = new Date(exam.endsAt);

    if (now < start) return "upcoming";
    if (now >= end) return "expired";
    return "available";
}


export default function ExamCard({ exam, viewer = "student" }) {
    const status = computeDisplayStatus(exam);
    const statusLabel = STATUS_LABELS[status];
    const statusClass = STATUS_CLASSES[status];

    const detailLink =
        viewer === "admin" ? `/admin/exams/${exam.id}` : `/student/exams/${exam.id}`;

    const canStart = viewer === "student" && status === "available";
    const canReview = viewer === "student" && status === "done";

    return (
        <article className="exam-card">
            <div className="exam-card-top">
                <div>
                    <span className="exam-card-subject">{exam.subjectName}</span>
                    <h3 style={{ marginTop: 4 }}>{exam.title || exam.subjectName}</h3>
                </div>
                <span className={`status ${statusClass}`}>{statusLabel}</span>
            </div>

            {exam.description && <p className="exam-card-desc">{exam.description}</p>}

            <div className="exam-card-meta">
                <div className="meta-item">
                    <span className="meta-label">Début</span>
                    <span className="mono">{formatDateTime(exam.startsAt)}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Fin</span>
                    <span className="mono">{formatDateTime(exam.endsAt)}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Questions</span>
                    <span className="mono">{exam.questionCount ?? exam.questions?.length ?? 0}</span>
                </div>
            </div>

            <div className="exam-card-footer">
                {viewer === "admin" ? (
                    <Link to={detailLink} className="btn-outline btn-sm">
                        Consulter
                    </Link>
                ) : canStart ? (
                    <Link to={`/student/exams/${exam.id}`} className="btn-gold btn-sm">
                        Commencer
                    </Link>
                ) : canReview ? (
                    <Link to={`/student/result/${exam.id}`} className="btn-outline btn-sm">
                        Voir le résultat
                    </Link>
                ) : (
                    <span className="hint">
            {status === "upcoming" ? "Pas encore ouvert" : "Non disponible"}
          </span>
                )}
            </div>
        </article>
    );
}
