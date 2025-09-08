function renderAnswers(data, containerId = "answerGrid", questionLabels = {}) {
    const grid = document.getElementById(containerId);
    if (!grid) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    grid.innerHTML = "";

    // Group answers by question
    const grouped = {};
    data.forEach(({ name, question, answer }) => {
        if (!grouped[question]) grouped[question] = [];
        grouped[question].push({ name, answer });
    });

    // Render each question column
    Object.entries(grouped).forEach(([question, entries]) => {
        const column = document.createElement("div");
        column.className = "column";

        const label = questionLabels[question] || "";
        const header = document.createElement("h3");
        header.textContent = label ? `${label}: ${question}` : question;
        column.appendChild(header);

        entries.forEach(({ name, answer }) => {
            const entry = document.createElement("div");
            entry.className = "entry";
            entry.textContent = `${name}: ${answer}`;
            column.appendChild(entry);
        });

        grid.appendChild(column);
    });
}