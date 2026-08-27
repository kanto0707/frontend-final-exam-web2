import { useState } from "react";

export default function ExamForm({ courses, onSubmit, submitLabel = "Créer l'examen" }) {
    const [courseId, setCourseId] = useState(courses[0]?.id || "");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [error, setError] = useState("");

    function validate() {
        if (!courseId) return "Choisissez un cours.";
        if (!title.trim()) return "Le titre de l'examen est requis.";
        if (!startsAt || !endsAt) return "Renseignez la date de début et de fin.";
        if (new Date(endsAt) <= new Date(startsAt)) {
            return "La date de fin doit être après la date de début.";
        }
        return "";
    }

    function handleSubmit(e) {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");
        onSubmit({
            courseId,
            title: title.trim(),
            description,
            startsAt: new Date(startsAt).toISOString(),
            endsAt: new Date(endsAt).toISOString(),
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="builder-section">
                <div className="field">
                    <label>Cours</label>
                    <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.code} — {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label>Titre de l'examen</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex : Examen final"
                    />
                </div>

                <div className="field">
                    <label>Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Décrivez brièvement l'examen"
                    />
                </div>

                <div className="field-row">
                    <div className="field">
                        <label>Date et heure de début</label>
                        <input
                            type="datetime-local"
                            value={startsAt}
                            onChange={(e) => setStartsAt(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>Date et heure de fin</label>
                        <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
                    </div>
                </div>
            </div>

            <button type="submit" className="btn-primary">
                {submitLabel}
            </button>
        </form>
    );
}
