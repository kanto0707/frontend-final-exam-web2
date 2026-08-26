const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

export default function QuestionForm({ question, index, onChange, onRemove }) {
    function updateText(text) {
        onChange({ ...question, text });
    }

    function updateOptionText(optionId, text) {
        onChange({
            ...question,
            options: question.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
        });
    }

    function setCorrect(optionId) {
        onChange({ ...question, correctOptionId: optionId });
    }

    function addOption() {
        if (question.options.length >= MAX_OPTIONS) return;
        const newOption = { id: crypto.randomUUID(), text: "" };
        onChange({ ...question, options: [...question.options, newOption] });
    }

    function removeOption(optionId) {
        if (question.options.length <= MIN_OPTIONS) return;
        const options = question.options.filter((o) => o.id !== optionId);
        const correctOptionId =
            question.correctOptionId === optionId ? null : question.correctOptionId;
        onChange({ ...question, options, correctOptionId });
    }

    return (
        <div className="question-builder">
            <div className="question-builder-head">
                <span className="tag">Question {index + 1}</span>
                <button type="button" className="btn-danger btn-sm" onClick={onRemove}>
                    Supprimer
                </button>
            </div>

            <div className="field">
                <label>Intitulé de la question</label>
                <input
                    type="text"
                    value={question.text}
                    placeholder="Ex : Quelle est la capitale de Madagascar ?"
                    onChange={(e) => updateText(e.target.value)}
                />
            </div>

            <label>Propositions (2 à 6) — cochez la bonne réponse</label>
            {question.options.map((option, i) => (
                <div className="option-builder-row" key={option.id}>
                    <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctOptionId === option.id}
                        onChange={() => setCorrect(option.id)}
                        aria-label={`Marquer la proposition ${i + 1} comme bonne réponse`}
                    />
                    <input
                        type="text"
                        value={option.text}
                        placeholder={`Proposition ${i + 1}`}
                        onChange={(e) => updateOptionText(option.id, e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn-outline btn-sm"
                        disabled={question.options.length <= MIN_OPTIONS}
                        onClick={() => removeOption(option.id)}
                    >
                        Retirer
                    </button>
                </div>
            ))}

            <button
                type="button"
                className="btn-outline btn-sm"
                disabled={question.options.length >= MAX_OPTIONS}
                onClick={addOption}
            >
                + Ajouter une proposition
            </button>

            {!question.correctOptionId && (
                <p className="hint" style={{ color: "var(--rust)" }}>
                    Sélectionnez la bonne réponse.
                </p>
            )}
        </div>
    );
}
