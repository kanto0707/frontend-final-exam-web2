export default function Question({
                                     question,
                                     index,
                                     selectedOptionId,
                                     onSelect,
                                     review = false,
                                     correctOptionId,
                                 }) {
    return (
        <div className="question-block">
            <span className="question-index">Question {index + 1}</span>
            <p className="question-text">{question.text}</p>

            <div className="option-list">
                {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    let classes = "option-item";

                    if (review) {
                        classes += " disabled";
                        if (correctOptionId && option.id === correctOptionId) {
                            classes += " correct";
                        } else if (isSelected && option.id !== correctOptionId) {
                            classes += " incorrect";
                        }
                    } else if (isSelected) {
                        classes += " selected";
                    }

                    return (
                        <label key={option.id} className={classes}>
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={isSelected}
                                disabled={review}
                                onChange={() => onSelect && onSelect(question.id, option.id)}
                            />
                            {option.text}
                        </label>
                    );
                })}
            </div>

            {review && (
                <p className="hint" style={{ marginTop: 12 }}>
                    {selectedOptionId
                        ? selectedOptionId === correctOptionId
                            ? "Bonne réponse"
                            : "Réponse incorrecte"
                        : "Aucune réponse sélectionnée — 0 point"}
                </p>
            )}
        </div>
    );
}
