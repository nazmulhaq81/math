const API_URL="https://script.google.com/macros/s/AKfycbyYWqt_7Fd1uWuY9l_R6iwEKBsmuJLfXzFeZIHnjJbXGcHWwY-HMkHnXtXtoPLrujCW5w/exec";
let allQuestions=[],quizQuestions=[],currentIndex=0,score=0,answered=false;

document.addEventListener("DOMContentLoaded",()=>{loadQuestions();
const t=document.getElementById("menuToggle"),n=document.getElementById("mainNav");t.addEventListener("click",()=>n.classList.toggle("open"));
n.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>n.classList.remove("open")));});

function calculate(){const a=Number(document.getElementById("num1").value),b=Number(document.getElementById("num2").value),op=document.getElementById("operator").value,r=document.getElementById("calcResult");
if(Number.isNaN(a)||Number.isNaN(b)){r.textContent="দয়া করে দুটি সংখ্যা লিখুন।";return} if(op==="/"&&b===0){r.textContent="০ দিয়ে ভাগ করা যায় না।";return}
let x=op==="+"?a+b:op==="-"?a-b:op==="*"?a*b:a/b;r.textContent=`ফলাফল: ${x}`;}

async function loadQuestions(){const s=document.getElementById("quizStatus");s.className="quiz-status";s.textContent="প্রশ্ন লোড হচ্ছে...";
try{const res=await fetch(API_URL,{cache:"no-store"});if(!res.ok)throw Error("API response failed");const data=await res.json();
if(!Array.isArray(data))throw Error("ডাটা সঠিক নয়");allQuestions=data.filter(q=>q.Question&&q["Option A"]&&q["Option B"]&&q["Option C"]&&q["Option D"]&&q.Answer);
if(!allQuestions.length)throw Error("কোনো MCQ পাওয়া যায়নি");s.textContent=`${allQuestions.length}টি MCQ প্রস্তুত আছে। শ্রেণি নির্বাচন করে Quiz শুরু করুন।`;
}catch(e){console.error(e);s.className="quiz-status error";s.textContent="MCQ লোড করা যাচ্ছে না। Apps Script Web App URL এবং access setting পরীক্ষা করুন।";}}

function selectClass(c){document.getElementById("classFilter").value=String(c);document.getElementById("mcq").scrollIntoView({behavior:"smooth"});setTimeout(startQuiz,400);}
function startQuiz(){const c=document.getElementById("classFilter").value;
if(!allQuestions.length){document.getElementById("quizStatus").className="quiz-status error";document.getElementById("quizStatus").textContent="প্রথমে প্রশ্নগুলো লোড হতে দিন।";return}
quizQuestions=c==="all"?[...allQuestions]:allQuestions.filter(q=>String(q.Class).trim()===c);
if(!quizQuestions.length){document.getElementById("quizStatus").className="quiz-status error";document.getElementById("quizStatus").textContent=`Class ${c}-এর কোনো প্রশ্ন এখনো যোগ করা হয়নি।`;return}
shuffle(quizQuestions);currentIndex=0;score=0;document.getElementById("quizStatus").textContent="";
document.getElementById("quizCard").classList.remove("hidden");document.getElementById("resultCard").classList.add("hidden");showQuestion();}

function showQuestion(){const q=quizQuestions[currentIndex];answered=false;document.getElementById("questionCounter").textContent=`প্রশ্ন ${currentIndex+1}/${quizQuestions.length}`;
document.getElementById("scoreBadge").textContent=`স্কোর: ${score}`;document.getElementById("progressBar").style.width=`${((currentIndex+1)/quizQuestions.length)*100}%`;
document.getElementById("questionMeta").textContent=`Class ${q.Class} • ${q.Chapter||"গণিত"}`;document.getElementById("questionText").textContent=q.Question;
const box=document.getElementById("options");box.innerHTML="";["A","B","C","D"].forEach(l=>{const b=document.createElement("button");b.className="option";b.type="button";
b.innerHTML=`<span class="letter">${l}</span><span>${escapeHtml(q["Option "+l])}</span>`;b.onclick=()=>checkAnswer(l,b);box.appendChild(b);});
const f=document.getElementById("answerFeedback");f.className="feedback hidden";f.textContent="";const next=document.getElementById("nextBtn");next.disabled=true;next.textContent=currentIndex===quizQuestions.length-1?"ফলাফল দেখুন →":"পরের প্রশ্ন →";}

function checkAnswer(sel,btn){if(answered)return;answered=true;const q=quizQuestions[currentIndex],correct=String(q.Answer).trim().toUpperCase();
const bs=document.querySelectorAll(".option");bs.forEach(b=>b.disabled=true);
if(sel===correct){score++;btn.classList.add("correct")}else{btn.classList.add("wrong");bs.forEach(b=>{if(b.querySelector(".letter").textContent===correct)b.classList.add("correct")});}
const f=document.getElementById("answerFeedback"),answerText=q["Option "+correct]||correct;f.className=sel===correct?"feedback correct":"feedback wrong";
f.innerHTML=sel===correct?`<strong>✓ সঠিক উত্তর!</strong><br>ব্যাখ্যা: ${escapeHtml(q.Explanation||"কোনো ব্যাখ্যা দেওয়া হয়নি।")}`:`<strong>✗ ভুল উত্তর। সঠিক উত্তর: ${correct}. ${escapeHtml(answerText)}</strong><br>ব্যাখ্যা: ${escapeHtml(q.Explanation||"কোনো ব্যাখ্যা দেওয়া হয়নি।")}`;
document.getElementById("scoreBadge").textContent=`স্কোর: ${score}`;document.getElementById("nextBtn").disabled=false;}

function nextQuestion(){if(!answered)return;if(currentIndex<quizQuestions.length-1){currentIndex++;showQuestion()}else showResult();}
function showResult(){document.getElementById("quizCard").classList.add("hidden");document.getElementById("resultCard").classList.remove("hidden");const total=quizQuestions.length;
document.getElementById("finalScore").textContent=`আপনার স্কোর: ${score}/${total} — ${Math.round(score/total*100)}%`;}
function restartQuiz(){document.getElementById("resultCard").classList.add("hidden");startQuiz();}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}}
function escapeHtml(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
