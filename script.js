function calculate() {

    let num1 = Number(document.getElementById("num1").value);
    let num2 = Number(document.getElementById("num2").value);

    let operator =
        document.getElementById("operator").value;

    let result;

    if (operator === "+") {
        result = num1 + num2;
    }

    else if (operator === "-") {
        result = num1 - num2;
    }

    else if (operator === "*") {
        result = num1 * num2;
    }

    else if (operator === "/") {

        if (num2 === 0) {
            result = "০ দিয়ে ভাগ করা যায় না";
        } else {
            result = num1 / num2;
        }
    }

    document.getElementById("result").innerText =
        "ফলাফল: " + result;
}


function startLearning() {

    document.getElementById("classes")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function startQuiz() {

    alert(
        "খুব শিগগিরই এখানে Math Quiz চালু হবে!"
    );
}