document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizForm");
  const submitBtn = document.getElementById("submitBtn");

  const questions = [
    {
      type: "text",
      label: "1. What is the capital of California?",
      correct: "sacramento",
      id: "q1"
    },
    {
      type: "radio",
      label: "2. Which state is known as the Sunshine State?",
      options: ["Florida", "Ohio", "California", "Texas"],
      correct: "Florida",
      id: "q2"
    },
    {
      type: "checkbox",
      label: "3. Select all states that border Canada:",
      options: [
        { label: "Michigan", correct: true },
        { label: "Nevada", correct: false },
        { label: "Montana", correct: true }
      ],
      id: "q3"
    },
    {
      type: "select",
      label: "4. Which U.S. state has the most lakes?",
      options: ["Select...", "Minnesota", "Alaska", "California", "Michigan"],
      correct: "Alaska",
      id: "q4"
    },
    {
      type: "number",
      label: "5. How many states are there in the U.S.?",
      correct: 50,
      id: "q5"
    },
    {
      type: "range",
      label: "6. Estimate the population of California (in millions)",
      correctRange: [38, 41],
      id: "q6"
    },
    {
      type: "dropdown",
      label: "7. Which U.S. state is the smallest by area?",
      options: ["Select...", "Rhode Island", "Connecticut", "Delaware", "New Jersey"],
      correct: "Rhode Island",
      id: "q7"
    },
    {
      type: "radio",
      label: "8. Which state is home to the Grand Canyon?",
      options: ["Arizona", "Nevada", "Utah"],
      correct: "Arizona",
      id: "q8"
    },
    {
      type: "checkbox",
      label: "9. Select all U.S. territories:",
      options: [
        { label: "Guam", correct: true },
        { label: "Puerto Rico", correct: true },
        { label: "Hawaii", correct: false }
      ],
      id: "q9"
    },
    {
      type: "select",
      label: "10. What is the northernmost U.S. state?",
      options: ["Select...", "Alaska", "North Dakota", "Washington", "Montana"],
      correct: "Alaska",
      id: "q10"
    }
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderQuiz() {
    form.innerHTML = "";
    questions.forEach(q => {
      const wrapper = document.createElement("div");
      wrapper.className = "mb-3";

      const label = document.createElement("label");
      label.className = "form-label fw-bold";
      label.textContent = q.label;
      wrapper.appendChild(label);

      if (q.type === "text" || q.type === "number") {
        const input = document.createElement("input");
        input.type = q.type;
        input.className = "form-control";
        input.id = q.id;
        wrapper.appendChild(input);
      } else if (q.type === "radio") {
        const options = shuffleArray([...q.options]);
        options.forEach((opt, idx) => {
          const optId = q.id + idx;
          wrapper.innerHTML += `
            <div class="form-check">
              <input class="form-check-input" type="radio" name="${q.id}" id="${optId}" value="${opt}">
              <label class="form-check-label" for="${optId}">${opt}</label>
            </div>`;
        });
      } else if (q.type === "checkbox") {
        q.options.forEach((opt, idx) => {
          const optId = q.id + idx;
          wrapper.innerHTML += `
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="${optId}" value="${opt.label}">
              <label class="form-check-label" for="${optId}">${opt.label}</label>
            </div>`;
        });
      } else if (q.type === "select" || q.type === "dropdown") {
        const select = document.createElement("select");
        select.className = "form-select";
        select.id = q.id;
        q.options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          select.appendChild(option);
        });
        wrapper.appendChild(select);
      } else if (q.type === "range") {
  const rangeWrapper = document.createElement("div");
  rangeWrapper.className = "d-flex align-items-center gap-3";

  const range = document.createElement("input");
  range.type = "range";
  range.className = "form-range flex-grow-1";
  range.min = 10;
  range.max = 50;
  range.value = 30;
  range.id = q.id;

  const rangeVal = document.createElement("span");
  rangeVal.textContent = "Selected: 30 million";

  // Add dynamic background fill
  const updateRangeBackground = () => {
    const percent = ((range.value - 10) / 40) * 100;
    range.style.background = `linear-gradient(to right, #0d6efd ${percent}%, #dee2e6 ${percent}%)`;
    rangeVal.textContent = `Selected: ${range.value} million`;
  };

  range.addEventListener("input", updateRangeBackground);
  updateRangeBackground(); // Initialize

  rangeWrapper.appendChild(range);
  rangeWrapper.appendChild(rangeVal);
  wrapper.appendChild(rangeWrapper);
}


      const feedback = document.createElement("div");
      feedback.id = q.id + "-feedback";
      wrapper.appendChild(feedback);
      form.appendChild(wrapper);
    });
  }

  function checkAnswers() {
    let score = 0;
    questions.forEach(q => {
      const feedback = document.getElementById(q.id + "-feedback");
      let correct = false;

      if (q.type === "text" || q.type === "number") {
        const val = document.getElementById(q.id).value.trim().toLowerCase();
        correct = (val === q.correct.toString().toLowerCase());
      } else if (q.type === "select" || q.type === "dropdown") {
        const val = document.getElementById(q.id).value;
        correct = (val === q.correct);
      } else if (q.type === "radio") {
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        if (selected) correct = (selected.value === q.correct);
      } else if (q.type === "range") {
        const val = parseInt(document.getElementById(q.id).value);
        correct = (val >= q.correctRange[0] && val <= q.correctRange[1]);
      } else if (q.type === "checkbox") {
        const inputs = q.options.map((opt, idx) =>
          ({ checked: document.getElementById(q.id + idx).checked, correct: opt.correct })
        );
        correct = inputs.every(i => i.checked === i.correct);
      }

      if (correct) {
  feedback.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="Correct" width="20" class="me-2"> <span class="text-success">Correct</span>`;
  score += 10;
} else {
  feedback.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png" alt="Incorrect" width="20" class="me-2"> <span class="text-danger">Incorrect</span>`;
}

    });

    document.getElementById("scoreArea").innerHTML = `<h4>Your Score: ${score}/100</h4>`;
    if (score >= 80) {
      document.getElementById("scoreArea").innerHTML += `<div class="alert alert-success mt-2">🎉 Great job! You scored above 80!</div>`;
    }

    let quizCount = localStorage.getItem("quizCount") || 0;
    quizCount++;
    localStorage.setItem("quizCount", quizCount);
    document.getElementById("quizCountArea").textContent = `You have taken this quiz ${quizCount} time(s).`;
  }

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    checkAnswers();
  });

  renderQuiz();
});
