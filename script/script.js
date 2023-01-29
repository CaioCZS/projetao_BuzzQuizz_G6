const toggleHiddenLoading = () =>{
    document.querySelector('.screen-loading').classList.toggle('hidden')
}

/* ================== TELA 1 =================*/
const showAllQuizzes = (resposta) =>{
    let listaAllQuizzes =document.querySelector('.all-quizzes .list-quizzes');
    listaAllQuizzes.innerHTML='';
    resposta.data.forEach(quizz => {
        let template = `
        <div class="quizz id-${quizz.id}" onclick="searchQuiz(${quizz.id})">
            <p>${quizz.title}</p>
        </div>
        `;
        listaAllQuizzes.innerHTML+=template
        document.querySelector(`.id-${quizz.id}`).style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.62%, rgba(0, 0, 0, 0.8) 100%),url(${quizz.image})`
        console.log(document.querySelector(`.id-${quizz.id}`))
    })
}

const showQuizzes = resposta =>{
    document.querySelector('.screen-1').classList.remove('hidden')
    showAllQuizzes(resposta);
    toggleHiddenLoading()
}

const errorGetQuizzes = error =>{
    console.log(error)
    alert('deu erro na hora de buscar os quizzes')
}

const getQuizzes = () =>{
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
    promise.then(showQuizzes).catch(errorGetQuizzes)
    document.querySelector('.screen-1').classList.add('hidden')
    toggleHiddenLoading();
}
getQuizzes();

/* ================== TELA 2 =================*/

let fullQuiz;

function searchQuiz(quiz){
    document.querySelector('.your-quizzes').classList.add('hidden');
    document.querySelector('.all-quizzes').classList.add('hidden');
    document.querySelector('.screen-loading').classList.remove('hidden');
    document.querySelector('.screen-loading').scrollIntoView();
    if(fullQuiz !== undefined){
        fullQuiz.catch(goBack);
        fullQuiz.then(openQuiz);
    }else{
        fullQuiz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quiz}`);
        fullQuiz.catch(goBack);
        fullQuiz.then(openQuiz);
    }
}

let quizBody;
let answersLength = 0;

function openQuiz(quiz){

    document.querySelector('.screen-loading').classList.add('hidden');
    document.querySelector('.quiz-body-2').classList.remove('hidden');

   quizBody = document.querySelector('.quiz-body-2');

   const quizData = quiz.data;
   const quizTitle = quizData.title;
   const quizImageTitle = quizData.image;

   quizBody.innerHTML = `<div class="banner-2" style="background-image:url('${quizImageTitle}')">
   <div class="img-banner-2"></div>
   <div class="quiz-title-2">${quizTitle}</div>
    </div>` + quizBody.innerHTML;

    const quizQuestions = quizData.questions;
    answersLength = quizQuestions.length;

    for(let i=0;i<quizQuestions.length;i++){

        const questionTitle = quizQuestions[i].title;
        const questionColor = quizQuestions[i].color;

        quizBody.innerHTML = quizBody.innerHTML + `<div id="question-${i}" class="question-2">
        <div class="question-title-2" style="background-color:${questionColor}">${questionTitle}</div>
        <div class="answers-2">
        </div>
    </div>`
    }

    const answers = document.querySelectorAll('.answers-2');

    for(let i=0;i<answers.length;i++){

        const answer = answers[i];

        let answerImages = [];
        let answerTexts = [];
        let answerCorrects = [];

        for(let j=0;j<quizQuestions[i].answers.length;j++){
            answerImages.push(quizQuestions[i].answers[j].image);
            answerTexts.push(quizQuestions[i].answers[j].text);
            answerCorrects.push(quizQuestions[i].answers[j].isCorrectAnswer);
        }

        for(let j=0;j<quizQuestions[i].answers.length;j++){

            let random = (min,max) => Math.floor(Math.random()*(max - min) + min);
            let randomNumber = random(0,answerImages.length);
            let image = answerImages[randomNumber];
            let text = answerTexts[randomNumber];
            let isCorrectAnswer = answerCorrects[randomNumber];

            answer.innerHTML = answer.innerHTML + `<div class="answer-2" onclick="answerTest(this)">
            <img id="${isCorrectAnswer}" src="${image}">
            <div class="text-answer-2">${text}</div>
        </div>`

            answerCorrects.splice(randomNumber,1);
            answerImages.splice(answerImages.indexOf(image),1);
            answerTexts.splice(answerTexts.indexOf(text),1);
        }

    }

    quizBody.innerHTML = quizBody.innerHTML + `<div class="quiz-finalization-2 hidden">
    </div>
    <button class="restart-quiz-2" onclick="restartQuiz()">Reiniciar Quizz</button>
    <button class="return-home-2" onclick="backToHome()">Voltar pra home</button>`

    nivelsPercent(quizData);
}

function restartQuiz(){
    quizBody.innerHTML = '';
    nextQuestion = 1;
    numberPercent = 0;
    numberNivel = 0;
    searchQuiz(fullQuiz);
}

function backToHome(){
    document.location.reload(true);
}

let numberNivel = 0;
let numberPercent = 0;
let nextQuestion = 1;  

function answerTest(test){

    const answer = test.querySelector('#true');

    if(answer !== null){
        numberNivel +=1;
    }

    const divPai = test.parentNode;

    const answers = divPai.querySelectorAll('.answer-2');

    for(let i=0;i<answers.length;i++){

        const answerColor = answers[i];

        answerColor.classList.add('opacity-answer-2');
        answerColor.removeAttribute("onclick");

        const vdd = answerColor.querySelector('#true');

        if(vdd === null){
            answerColor.querySelector('.text-answer-2').classList.add('red-text-2');
        }else{
            answerColor.querySelector('.text-answer-2').classList.add('green-text-2');
        }

    }

    test.classList.remove('opacity-answer-2');

    numberPercent +=1;

    quizFinalization();

}

function goBack(){
    alert('Não foi possível carregar o quiz :(');
    document.location.reload(true);
}

let imageOfNivels;
let valuesOfNivels;
let textOfNivels;
let titleOfNivels;

function nivelsPercent(nivels){

    const dataNivels = nivels.levels;
    imageOfNivels = [];
    valuesOfNivels = [];
    textOfNivels = [];
    titleOfNivels = [];

    for(let i=0;i<dataNivels.length;i++){
        imageOfNivels.push(dataNivels[i].image);
        valuesOfNivels.push(dataNivels[i].minValue);
        textOfNivels.push(dataNivels[i].text);
        titleOfNivels.push(dataNivels[i].title);
    }

}

let finalization;

function quizFinalization(){

    let i=0

    let nivelsLength = (valuesOfNivels.length-1);

    if(numberPercent === answersLength){
        finalization = document.querySelector('.quiz-finalization-2');

        while(i<valuesOfNivels.length){

            let percentOfNivel = valuesOfNivels[nivelsLength];
            let percent = Number((numberNivel/answersLength)*100);
            percent = Math.round(percent);
    
            if(percent >= percentOfNivel){

                let image = imageOfNivels[nivelsLength];
                let text = textOfNivels[nivelsLength];
                let title = titleOfNivels[nivelsLength];

                finalization.innerHTML = `<div class="quiz-finalization-title-2">
                ${percent}% de acerto: ${title}
                </div>
                <div class="text-img-finalization-2">
                <img class='img-finalization-2' src="${image}">
                <div class="text-finalization-2">${text}</div>
                </div>`
        
                finalization.classList.remove('hidden');

                document.querySelector('.quiz-finalization-2').scrollIntoView();

                break;

            }
    
            nivelsLength = nivelsLength-1;

            i = i+1;
        }
    }else{
        const nextQuestionDiv = document.getElementById(`question-${nextQuestion}`);
        nextQuestionDiv.scrollIntoView({block: "center"});
        nextQuestion +=1;
    } 
}


/* ================== TELA 3 =================*/