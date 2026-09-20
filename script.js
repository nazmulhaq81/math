function calculate(){
    const first=document.getElementById("num1");
    const second=document.getElementById("num2");
    const num1=Number(first.value);
    const num2=Number(second.value);
    const operator=document.getElementById("operator").value;
    const resultBox=document.getElementById("result");

    if(first.value==="" || second.value===""){
        resultBox.textContent="দুটি সংখ্যাই লিখুন।";
        return;
    }

    let result;
    if(operator==="+") result=num1+num2;
    else if(operator==="-") result=num1-num2;
    else if(operator==="*") result=num1*num2;
    else if(operator==="/") result=num2===0 ? "০ দিয়ে ভাগ করা যায় না" : num1/num2;

    resultBox.textContent="ফলাফল: "+result;
}

function startLearning(){
    document.getElementById("classes").scrollIntoView({behavior:"smooth"});
}

function comingSoon(name){
    alert(name+" — এই ফিচারটি পরবর্তী ধাপে চালু করা হবে।");
}
