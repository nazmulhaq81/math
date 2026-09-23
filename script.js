const API_URL = "https://script.google.com/macros/s/AKfycbyYWqt_7Fd1uWuY9l_R6iwEKBsmuJLfXzFeZIHnjJbXGcHWwY-HMkHnXtXtoPLrujCW5w/exec";

let allQuestions = [];
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

function calculate() {
    const num1 = Number(document.getElementById("num1").value);
    const num2 = Number(document.getElementById("num2").value);
    const operator = document.getElementById("operator").value;
    let result;

    if (operator === "+") result = num1 + num2;
    else if (operator === "-") result = num1 - num2;
    else if (operator === "*") result = num1 * num2;
    else if (operator === "/") result = num2 === 0 ? "০ দিয়ে ভাগ করা যায় না" : num1 / num2;

    document.getElementById("result").innerText = "ফলাফল: " + result;
}

function startLearning() {
    document.getElementById("classes").scrollIntoView({behavior: "smooth"});
}

async function loadQuestions() {
    const area = document.getElementById("quizArea");
    area.innerHTML = '<div class="quiz-message">⏳ প্রশ্ন লোড হচ্ছে...</div>';

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        allQuestions = data.filter(q =>
            q.Question && q["Option A"] && q["Option B"] &&
            q["Option C"] && q["Option D"] && q.Answer
        );

        updateChapterFilter();
        area.innerHTML = '<div class="quiz-message success">✅ প্রশ্ন প্রস্তুত। শ্রেণি ও অধ্যায় নির্বাচন করুন।</div>';
    } catch (error) {
        console.error(error);
        area.innerHTML = '<div class="quiz-message error">❌ প্রশ্ন লোড করা যায়নি। পরে আবার চেষ্টা করুন।</div>';
    }
}

function updateChapterFilter() {
    const classFilter = document.getElementById("classFilter");
    const chapterFilter = document.getElementById("chapterFilter");
    if (!classFilter || !chapterFilter) return;

    const selectedClass = classFilter.value;
    const chapters = [...new Set(
        allQuestions
            .filter(q => selectedClass === "all" || String(q.Class).trim() === selectedClass)
            .map(q => String(q.Chapter || "").trim())
            .filter(Boolean)
    )].sort((a,b) => a.localeCompare(b, "bn"));

    chapterFilter.innerHTML = '<option value="all">সব অধ্যায়</option>';
    chapters.forEach(chapter => {
        const option = document.createElement("option");
        option.value = chapter;
        option.textContent = chapter;
        chapterFilter.appendChild(option);
    });
}

function startFilteredQuiz() {
    if (!allQuestions.length) {
        loadQuestions();
        return;
    }

    const selectedClass = document.getElementById("classFilter").value;
    const selectedChapter = document.getElementById("chapterFilter").value;

    quizQuestions = allQuestions.filter(q =>
        (selectedClass === "all" || String(q.Class).trim() === selectedClass) &&
        (selectedChapter === "all" || String(q.Chapter || "").trim() === selectedChapter)
    );

    if (!quizQuestions.length) {
        document.getElementById("quizArea").innerHTML =
            '<div class="quiz-message error">এই নির্বাচন অনুযায়ী কোনো প্রশ্ন পাওয়া যায়নি।</div>';
        return;
    }

    quizQuestions = shuffleArray([...quizQuestions]);
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function startQuiz() {
    startFilteredQuiz();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuestion() {
    const q = quizQuestions[currentQuestion];
    answered = false;

    const options = [
        ["A", q["Option A"]], ["B", q["Option B"]],
        ["C", q["Option C"]], ["D", q["Option D"]]
    ];

    const progress = Math.round(((currentQuestion + 1) / quizQuestions.length) * 100);

    document.getElementById("quizArea").innerHTML = `
        <div class="quiz-box">
            <div class="quiz-top">
                <span>প্রশ্ন ${currentQuestion + 1} / ${quizQuestions.length}</span>
                <span>স্কোর: ${score}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
            <div class="quiz-meta">Class ${q.Class} • ${q.Chapter || "সাধারণ"}</div>
            <h3 class="question">${q.Question}</h3>

            <div class="options">
                ${options.map(([letter, text]) => `
                    <button class="option-btn" onclick="checkAnswer('${letter}')" data-option="${letter}">
                        <span class="option-letter">${letter}</span>
                        <span>${text}</span>
                    </button>
                `).join("")}
            </div>
            <div id="answerFeedback"></div>
        </div>`;
}

function checkAnswer(selected) {
    if (answered) return;
    answered = true;

    const q = quizQuestions[currentQuestion];
    document.querySelectorAll(".option-btn").forEach(button => {
        const option = button.dataset.option;
        if (option === q.Answer) button.classList.add("correct");
        if (option === selected && selected !== q.Answer) button.classList.add("wrong");
        button.disabled = true;
    });

    if (selected === q.Answer) score++;

    const correct = selected === q.Answer;
    document.getElementById("answerFeedback").innerHTML = `
        <div class="feedback ${correct ? "correct-feedback" : "wrong-feedback"}">
            <strong>${correct ? "✅ সঠিক উত্তর!" : "❌ ভুল উত্তর!"}</strong>
            <p><strong>সঠিক উত্তর:</strong> ${q.Answer}</p>
            ${q.Explanation ? `<p><strong>ব্যাখ্যা:</strong> ${q.Explanation}</p>` : ""}
            <button onclick="nextQuestion()">${currentQuestion + 1 < quizQuestions.length ? "পরের প্রশ্ন →" : "ফলাফল দেখুন"}</button>
        </div>`;
}

function nextQuestion() {
    if (currentQuestion + 1 < quizQuestions.length) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    document.getElementById("quizArea").innerHTML = `
        <div class="quiz-result">
            <div class="result-icon">🎉</div>
            <h3>Quiz সম্পন্ন!</h3>
            <p>আপনার ফলাফল</p>
            <div class="score-number">${score} / ${total}</div>
            <div class="percentage">${percentage}%</div>
            <p>${percentage >= 80 ? "চমৎকার! আপনার গণিতের প্রস্তুতি ভালো।" :
                percentage >= 50 ? "ভালো হয়েছে। আরও অনুশীলন করলে আরও ভালো করবেন।" :
                "আরও অনুশীলন করুন এবং আবার চেষ্টা করুন।"}</p>
            <button onclick="startFilteredQuiz()">🔄 আবার Quiz দিন</button>
        </div>`;
}

document.addEventListener("DOMContentLoaded", loadQuestions);
