const toggleHiddenLoading = () =>{
    document.querySelector('.screen-loading').classList.toggle('hidden')
}

/* ================== TELA 1 =================*/

const yourQuizzes = [];

const showYourQuizzes = () =>{
    const listYourQuizzes = document.querySelector('.your-quizzes .list-quizzes');
    listYourQuizzes.innerHTML = '';
    yourQuizzes.forEach(quizz =>{
        let templateYQ = `
            <div onclick="funcao${quizz.id}" class="quizz yourQuizz id-${quizz.id}">
                <div class="options">
                    <ion-icon name="create-outline"></ion-icon>
                    <ion-icon name="trash-outline"></ion-icon>
                </div>
                <p>${quizz.title}</p>
            </div>
        `;//lucio adiciona a funcao de exibir o quizz aqui no "onclick="funcao${quizz.id}""
        listYourQuizzes.innerHTML+= templateYQ;
        document.querySelector(`.id-${quizz.id}`).style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.62%, rgba(0, 0, 0, 0.8) 100%),url(${quizz.image})`
    })
    document.querySelector('.your-quizzes-empty').classList.add("hidden");
    document.querySelector('.your-quizzes').classList.remove("hidden");

}

const getKeys = () =>{
    const keys = Object.keys(localStorage);
    console.log(keys)
    keys.forEach(key =>{
        const quizzStr = localStorage.getItem(key);
        const quizzObj = JSON.parse(quizzStr);
        yourQuizzes.push(quizzObj);
    })
    if(yourQuizzes.length > 0)showYourQuizzes();
}
getKeys();
console.log(yourQuizzes)
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
const createQuizzBtn = () =>{
    document.querySelector('.hide-screen-1').classList.add('hidden');
    document.querySelector('.page-3-1').classList.remove('hidden');
    toggleHiddenLoading();
    setTimeout(toggleHiddenLoading , 1000)
}

const showQuizzes = resposta =>{
    document.querySelector('.screen-1').classList.remove('hidden')
    showAllQuizzes(resposta);
    setTimeout(toggleHiddenLoading , 1000)
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

                setTimeout(()=>{
                    finalization.classList.remove('hidden')
                    document.querySelector('.quiz-finalization-2').scrollIntoView()
                },2000);

                break;

            }
    
            nivelsLength = nivelsLength-1;

            i = i+1;
        }
    }else{
        const nextQuestionDiv = document.getElementById(`question-${nextQuestion}`);
        setTimeout(()=>{nextQuestionDiv.scrollIntoView({block: "center"})},2000);
        nextQuestion +=1;
    } 
}

/* ================== TELA 3 =================*/


/*
Informações básicas do quizz
- [ ]  Título do quizz: deve ter no mínimo 20 e no máximo 65 caracteres.
- [ ]  URL da Imagem: deve ter formato de URL.
- [ ]  Quantidade de perguntas: no mínimo 3 perguntas.
- [ ]  Quantidade de níveis: no mínimo 2 níveis.
*/
let user_quizz_title, user_quizz_img, user_quizz_qtd_questions, user_qtd_niveis;
let div_questions;
let obj_questions = [];
let obj_niveis = [];
const urlQuizz = "https://mock-api.driven.com.br/api/v4/buzzquizz/";


function check_lenght_title(info){

    info.value = info.value.trim();
    user_quizz_title = undefined;
    if(info.value.length < 20){
        document.querySelector(".page-3-1 div :nth-child(2)").classList.remove("hidden");
        document.querySelector(".page-3-1 div :nth-child(3)").classList.add("hidden");
        info.classList.add("erro-background-color");
    }
    else if(info.value.length > 65){
        document.querySelector(".page-3-1 div :nth-child(2)").classList.add("hidden");
        document.querySelector(".page-3-1 div :nth-child(3)").classList.remove("hidden");
        info.classList.add("erro-background-color");
    }

    else{
        document.querySelector(".page-3-1 div :nth-child(2)").classList.add("hidden");
        document.querySelector(".page-3-1 div :nth-child(3)").classList.add("hidden");
        info.classList.remove("erro-background-color");
        user_quizz_title = info.value;
    }
}

function check_url(info){
    info.value = info.value.trim();
    user_quizz_img = undefined;
    if(info.checkValidity() === true && info.value.length > 0){
        document.querySelector(".page-3-1 div :nth-child(5)").classList.add("hidden");
        info.classList.remove("erro-background-color");
        user_quizz_img = info.value;
    }
    else{
        document.querySelector(".page-3-1 div :nth-child(5)").classList.remove("hidden");
        info.classList.add("erro-background-color");
    }
}

function check_qtd_questions(info){
    info.value = info.value.trim();
    user_quizz_qtd_questions = undefined;

    if(isNaN(info.value)){
        document.querySelector(".page-3-1 div :nth-child(7)").classList.remove("hidden");
        document.querySelector(".page-3-1 div :nth-child(8)").classList.add("hidden");
        info.classList.add("erro-background-color");
    }

    else if(info.value < 3){
        document.querySelector(".page-3-1 div :nth-child(8)").classList.remove("hidden");
        document.querySelector(".page-3-1 div :nth-child(7)").classList.add("hidden");
        info.classList.add("erro-background-color");
    }

    else{
        info.classList.remove("erro-background-color");
        document.querySelector(".page-3-1 div :nth-child(7)").classList.add("hidden");
        document.querySelector(".page-3-1 div :nth-child(8)").classList.add("hidden");
        user_quizz_qtd_questions = Number(info.value);
    }
}

function check_qtd_niveis(info){
    info.value = info.value.trim();
    user_qtd_niveis = undefined;

    if(isNaN(info.value)){
        document.querySelector(".page-3-1 div :nth-child(10)").classList.remove("hidden");
        document.querySelector(".page-3-1 div :nth-child(11)").classList.add("hidden");
        info.classList.add("erro-background-color");
    }

    else if(info.value < 2){
        document.querySelector(".page-3-1 div :nth-child(11)").classList.remove("hidden");
        document.querySelector(".page-3-1 div :nth-child(10)").classList.add("hidden");
        info.classList.add("erro-background-color");
    }

    else{
        info.classList.remove("erro-background-color");
        document.querySelector(".page-3-1 div :nth-child(10)").classList.add("hidden");
        document.querySelector(".page-3-1 div :nth-child(11)").classList.add("hidden");
        user_qtd_niveis = Number(info.value);
    }
}

function check_page_1_validation(){
    if(user_quizz_title!= undefined && user_quizz_img!= undefined && user_quizz_qtd_questions!= undefined && user_qtd_niveis!= undefined)
    {
        document.querySelector(".page-3-1").classList.add("hidden")
        document.querySelector(".page-3-2").classList.remove("hidden")
        prepare_page_2();
    }

}


/*
Perguntas do quizz
- [ ]  Texto da pergunta: no mínimo 20 caracteres.
- [ ]  Cor de fundo: deve ser uma cor em hexadecimal (começar em "#", seguida de 6 caracteres hexadecimais, ou seja, números ou letras de A a F).
- [ ]  Textos das respostas: não pode estar vazio.
- [ ]  URL das imagens de resposta: deve ter formato de URL.
- [ ]  É obrigatória a inserção da resposta correta e de pelo menos 1 resposta errada. Portanto, é permitido existirem perguntas com só 2 ou 3 respostas em vez de 4.

*/



function prepare_page_2(){ //cria paginas com perguntas, respostas corretas e incorretas
    const container = document.querySelector(".page-3-2 div")

    for(let i = 0; i < user_quizz_qtd_questions; i++){
        container.innerHTML += `   
            <div class="questions-container">
            <div onclick="hide_questions(this)">
                <h6>Pergunta ${(i+1)}</h6>
                <img class=""src="images/Vectoredit.svg" alt="">
            </div>
            
            <div class="questions_text_field hidden">

                <input onfocusout="check_lenght_quest_text(this)"  type="text" placeholder="Texto da pergunta">
                <p class="erro-warning hidden" > O valor deve possuir no mínimo 20 caracteres</p>

                <input onfocusout="check_background_color(this)" class="input-margin-14px" type="text" placeholder="Cor de fundo da pergunta">\
                <p class="erro-warning hidden" > O valor deve estar em um formato válido</p>


                <h6>Resposta correta</h6>
                <input onfocusout="check_text_field_correct(this)" type="text" placeholder="Resposta correta">
                <p class="erro-warning hidden"> O campo não pode estar vazio</p>

                <input onfocusout="check_url_img_correct(this)" class="input-margin-14px" type="url" placeholder="URL da imagem">
                <p class="erro-warning hidden"> O valor informado não é uma URL válida</p>


                <h6>Respostas incorretas</h6>
                <input onfocusout="check_text_field_incorrect(this)" type="text" placeholder="Resposta incorreta 1">
                <p class="erro-warning hidden"> O campo não pode estar vazio</p>

                <input onfocusout="check_url_img_incorrect(this)" class="input-margin-14px"" type="url" placeholder="URL da imagem 1">
                <p class="erro-warning hidden"> O valor informado não é uma URL válida</p>


                <input onfocusout="check_text_field_incorrect(this)" class="input-margin-32pxtop" type="text" placeholder="Resposta incorreta 2">
                <input onfocusout="check_url_img_incorrect(this)" class="input-margin-32px input-margin-14px"" type="url" placeholder="URL da imagem 2">
                <p class="erro-warning hidden"> O valor informado não é uma URL válida</p>


                <input onfocusout="check_text_field_incorrect(this)" type="text" placeholder="Resposta incorreta 3">
                <input onfocusout="check_url_img_incorrect(this)" class="input-margin-14px" type="url" placeholder="URL da imagem 3">
                <p class="erro-warning hidden"> O valor informado não é uma URL válida</p>

            </div>
        </div>`

        obj_questions[i] = {                        
            text: undefined, color:undefined, 
            correct_answer:undefined, url_correct:undefined,
            incorrect_answer1:undefined,url_incorrect1: undefined,
            incorrect_answer2:undefined,url_incorrect2: undefined,
            incorrect_answer3:undefined,url_incorrect3: undefined,};
    }
    container.querySelector("div:nth-child(2)").classList.toggle("hidden");
    container.querySelector("img").classList.toggle("hidden");

    div_questions = document.querySelectorAll(".page-3-2 .questions-container");
}

function hide_questions(question){
    question = question.parentNode;
    const questions_to_hide = document.querySelectorAll(".page-3-2 .questions-container")
    for(let i = 0; i < user_quizz_qtd_questions; i++){
        questions_to_hide[i].querySelector("div:nth-child(2)").classList.add("hidden");
        questions_to_hide[i].querySelector("img").classList.remove("hidden");
    }

    question.querySelector("div:nth-child(2)").classList.remove("hidden");
    question.querySelector("img").classList.add("hidden");

    div_questions = document.querySelectorAll(".page-3-2 .questions-container");
}

function get_index(info){
    let i = (info.parentNode.parentNode).querySelector('h6').innerHTML;
    i = (Number(i.replace("Pergunta ", "")))-1;
    return i;
}

function check_lenght_quest_text(info){

    let  index = get_index(info);
    obj_questions[index].text = undefined;
    info.value = info.value.trim();

    if(info.value.length < 20)
    {
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }

    else
    {
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_questions[index].text = info.value;
    }
}

function is_hexadecimal(test_color) {

    regexp = /^[0-9a-fA-F]+$/;
    if((test_color[0] === "#") && (test_color.length === 7))
    {
        test_color = test_color.replace("#","");
        if (regexp.test(test_color)) {
            return true;
        }
    }
    else{
        return false;
    }
}

function check_background_color(info){
    let  index = get_index(info);
    obj_questions[index].color = undefined;
    info.value = info.value.trim();
    let test_color = info.value;

    if(is_hexadecimal(test_color)){
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_questions[index].color = info.value;
    }
    else{
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }
}

function check_text_field_correct(info)
{
    let  index = get_index(info);
    obj_questions[index].correct_answer = undefined;
    info.value = info.value.trim();
    if(info.value.length < 1)
    {
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }

    else
    {
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_questions[index].correct_answer = info.value;
    }
}

function check_url_img_correct(info){
    let  index = get_index(info);
    obj_questions[index].url_correct = undefined;
    info.value = info.value.trim();

    if(info.checkValidity() === true && info.value.length > 0){
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_questions[index].url_correct = info.value;
    }

    else{
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }
}

function check_text_field_incorrect(info)
{
    let  index = get_index(info);
    info.value = info.value.trim();
    
    if (info.placeholder === "Resposta incorreta 1")
    {
        obj_questions[index].incorrect_answer1 = undefined;   
        if(info.value.length < 1)
        {
            info.nextElementSibling.classList.remove("hidden");
            info.classList.add("erro-background-color");
        }
    
        else
        {
            info.nextElementSibling.classList.add("hidden");
            info.classList.remove("erro-background-color");
            obj_questions[index].incorrect_answer1 = info.value;
        }
    }

    else if (info.placeholder === "Resposta incorreta 2"){
        obj_questions[index].incorrect_answer2 = undefined;   
        if(info.value.length < 1) { }
    
        else
        {
            info.nextElementSibling.classList.add("hidden");
            info.classList.remove("erro-background-color");
            obj_questions[index].incorrect_answer2 = info.value;
        }
    }

    else if (info.placeholder === "Resposta incorreta 3"){
        obj_questions[index].incorrect_answer3 = undefined;   
        if(info.value.length < 1) { }
    
        else
        {
            obj_questions[index].incorrect_answer3 = info.value;
        }
    }
}

function check_url_img_incorrect(info){
    let  index = get_index(info);
    info.value = info.value.trim();

    if (info.placeholder === "URL da imagem 1"){
        obj_questions[index].url_incorrect1 = undefined;   

        if(info.checkValidity() === true && info.value.length > 0){
            info.nextElementSibling.classList.add("hidden");
            info.classList.remove("erro-background-color");
            obj_questions[index].url_incorrect1 = info.value;
        }
        
        else
        {
            info.nextElementSibling.classList.remove("hidden");
            info.classList.add("erro-background-color");
        }
    }

    if (info.placeholder === "URL da imagem 2"){
        obj_questions[index].url_incorrect2 = undefined;  

        if(info.value.length < 1 || info.checkValidity() === false){ 
            
        }
    
        else
        {   
            if(obj_questions[index].incorrect_answer2 != undefined){
                //info.nextElementSibling.classList.remove("hidden");
               // info.classList.add("erro-background-color");
               // obj_questions[index].url_incorrect2 = info.value;
            }

            else{
                //info.nextElementSibling.classList.add("hidden");
                //info.classList.remove("erro-background-color");
                obj_questions[index].url_incorrect2 = info.value;
            }
        }
    }

    if (info.placeholder === "URL da imagem 3"){
        obj_questions[index].url_incorrect3 = undefined;   
        if(info.value.length < 1 || info.checkValidity() === false){ 
            
        }
    
        else
        {
            if(obj_questions[index].incorrect_answer3 != undefined){
                //info.nextElementSibling.classList.remove("hidden");
               // info.classList.add("erro-background-color");
               // obj_questions[index].url_incorrect3 = info.value;
            }

            else
            {
            //info.nextElementSibling.classList.add("hidden");
            //info.classList.remove("erro-background-color");
            obj_questions[index].url_incorrect3 = info.value;
            }
        }
    }
}

function check_page_2_validation(){

    for(let i = 0; i < user_quizz_qtd_questions; i++){
        if(obj_questions[i].incorrect_answer2 === undefined || obj_questions[i].url_incorrect2 === undefined){
            obj_questions[i].incorrect_answer2 = undefined;
            obj_questions[i].url_incorrect2 = undefined;
        }

        if(obj_questions[i].incorrect_answer3 === undefined || obj_questions[i].url_incorrect3 === undefined){
            obj_questions[i].incorrect_answer3 = undefined;
            obj_questions[i].url_incorrect3 = undefined;
        }

        if(obj_questions[i].text === undefined || obj_questions[i].color === undefined){

            return (alert(`Erro de preenchimento na Pergunta ${i+1}. Por favor, confira os campos de Texto da Pergunta e a Cor de fundo`)) 
        }

        if(obj_questions[i].correct_answer === undefined || obj_questions[i].url_correct === undefined){
            return (alert(`Erro de preenchimento na Pergunta ${i+1}. Por favor, confira os campos de Resposta Correta e sua URL`)) 
        }

        if(obj_questions[i].incorrect_answer1 === undefined || obj_questions[i].url_incorrect1 === undefined){
            return (alert(`Erro de preenchimento na Pergunta ${i+1}. Por favor, confira os campos da primeira Resposta Incorreta`)) 
        }
    }

    document.querySelector(".page-3-2").classList.add("hidden")
    document.querySelector(".page-3-3").classList.remove("hidden")
    prepare_page_3();
}

function hide_questions2(question){
    question = question.parentNode;
    const questions_to_hide = document.querySelectorAll(".page-3-3 .questions-container")
    for(let i = 0; i < user_qtd_niveis; i++){
        questions_to_hide[i].querySelector("div:nth-child(2)").classList.add("hidden");
        questions_to_hide[i].querySelector("img").classList.remove("hidden");
    }

    question.querySelector("div:nth-child(2)").classList.remove("hidden");
    question.querySelector("img").classList.add("hidden");

    div_questions = document.querySelectorAll(".page-3-2 .questions-container");
}

function prepare_page_3(){ //Cria pagina com niveis dinamicos
    const container = document.querySelector(".page-3-3 div")
    for(let i = 0; i < user_qtd_niveis; i++){
        container.innerHTML += `   
        <div class="questions-container">
            <div onclick="hide_questions2(this)">
            <h6>Nível ${i+1}</h6>
            <img class=""src="images/Vectoredit.svg" alt="">
        </div>
        
        <div class="hidden">
            <input onfocusout="check_lenght_nivel_title(this)" type="text" placeholder="Título do nível">
            <p class="erro-warning hidden" > O valor deve possuir no mínimo 10 caracteres</p>


            <input onfocusout="check_value_percentage(this)" class="input-margin-14px" type="text" placeholder="% de acerto mínima">
            <p class="erro-warning hidden"> Insira um valor entre 0 e 100</p>

            
            <input onfocusout="check_url_nivel(this)" class="input-margin-14px" type="url" placeholder="URL da imagem do nível">
            <p class="erro-warning hidden"> O valor informado não é uma URL válida</p>

            <input  onfocusout="check_description(this)" class="input-margin-14px" type="text" placeholder="Descrição do nível">
            <p class="erro-warning hidden" > O valor deve possuir no mínimo 30 caracteres</p>


        </div>
    </div>
    `

    container.querySelector("div:nth-child(2)").classList.toggle("hidden");
    container.querySelector("img").classList.toggle("hidden");

    obj_niveis[i] = {                        
        nivel_title: undefined, percentage:undefined, 
        url_nivel_img:undefined, description:undefined
      };

    }
}

function get_index_nvl(info){
    let i = (info.parentNode.parentNode).querySelector('h6').innerHTML;
    i = (Number(i.replace("Nível ", "")))-1;
    return i;
}

function check_lenght_nivel_title(info){

    let  index = get_index_nvl(info);
    
    obj_niveis[index].nivel_title = undefined;
    info.value = info.value.trim();

    if(info.value.length < 10)
    {
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }

    else
    {
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_niveis[index].nivel_title = info.value;
    }
}

function check_value_percentage(info)
{
    let  index = get_index_nvl(info);
    
    obj_niveis[index].percentage = undefined;
    info.value = info.value.trim();

    if(info.value < 0 || info.value > 100 || isNaN(info.value) === true || info.value.length < 1)
    {
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }

    else{
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_niveis[index].percentage = info.value;
    }
}

function check_url_nivel(info)
{
    let  index = get_index_nvl(info);
    obj_niveis[index].url_nivel_img = undefined;
    info.value = info.value.trim();

    if(info.checkValidity() === true && info.value.length > 0){
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_niveis[index].url_nivel_img = info.value;
    }

    else{
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }
}

function check_description(info){
    let  index = get_index_nvl(info);
    
    obj_niveis[index].description = undefined;
    info.value = info.value.trim();

    if(info.value.length < 30)
    {
        info.nextElementSibling.classList.remove("hidden");
        info.classList.add("erro-background-color");
    }

    else
    {
        info.nextElementSibling.classList.add("hidden");
        info.classList.remove("erro-background-color");
        obj_niveis[index].description = info.value;
    }
}

function check_page_3_validation()
{   
    let zero_qtd = 0;
    for(let i = 0; i < user_qtd_niveis; i++){
        if(obj_niveis[i].nivel_title === undefined){
            return (alert(`Erro de preenchimento no Nível ${i+1}. Por favor, confira o campo de Título`)) 
        }

        if(obj_niveis[i].percentage === undefined){
            return (alert(`Erro de preenchimento no Nível ${i+1}. Por favor, confira o campo da %`)) 
        }

        if(obj_niveis[i].url_nivel_img === undefined){
            return (alert(`Erro de preenchimento no Nível ${i+1}. Por favor, confira o campo da URL da imagem`)) 
        }


        if(obj_niveis[i].description === undefined){
            return (alert(`Erro de preenchimento no Nível ${i+1}. Por favor, confira o campo da Descrição`)) 
        }

        if(obj_niveis[i].percentage == 0) {
            zero_qtd++;
        }
    }

    if(zero_qtd == 0){
        return (alert(`É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%`)) 
    }

    send_created_quiz();
}

function send_created_quiz(){
    let all_questions = [];
    let all_niveis = [];

    let created_quizz = {
        title: user_quizz_title,
        image: user_quizz_img,
        questions: all_questions,
        levels: all_niveis
    }
    
    for(let i = 0; i < user_quizz_qtd_questions; i++)
    {

        all_questions.push( {
            title: obj_questions[i].text,
            color: obj_questions[i].color,
            answers: [
                {
                    text: obj_questions[i].correct_answer,
                    image: obj_questions[i].url_correct,
                    isCorrectAnswer: true
                },
    
                {
                    text: obj_questions[i].incorrect_answer1,
                    image: obj_questions[i].url_incorrect1,
                    isCorrectAnswer: false
                }
            ]
        })

       if(obj_questions[i].incorrect_answer2 != undefined){
            all_questions[i].answers.push({
                text: obj_questions[i].incorrect_answer2,
                image: obj_questions[i].url_incorrect2,
                isCorrectAnswer: false
            }
            )
        }

        
        if(obj_questions[i].incorrect_answer3 != undefined){ 
            all_questions[i].answers.push({
                text: obj_questions[i].incorrect_answer3,
                image: obj_questions[i].url_incorrect3,
                isCorrectAnswer: false
            })
        }
    }

    for(let i = 0; i < user_qtd_niveis; i++){
        all_niveis.push( {
            title: obj_niveis[i].nivel_title,
            image: obj_niveis[i].url_nivel_img,
            text: obj_niveis[i].description,
            minValue: obj_niveis[i].percentage
        })
    }

    console.log(created_quizz);
    const sent = axios.post(`${urlQuizz}/quizzes`, created_quizz);
    sent.then(created_quizz_sucess);
    sent.catch(created_quizz_failure);
    document.querySelector(".page-3-3").classList.add("hidden")
    toggleHiddenLoading();
}

function created_quizz_sucess(data){
    setTimeout(() =>{
        document.querySelector(".page-3-3").classList.add("hidden")
        document.querySelector(".page-3-4").classList.remove("hidden");
        toggleHiddenLoading();
    } , 1000)
    
    /*document.querySelector(".page-3-3").classList.add("hidden")
    document.querySelector(".page-3-4").classList.remove("hidden");
    toggleHiddenLoading();*/
    console.log(data.data.id);
    //salvando no local storage
    const quizzSerializado = JSON.stringify(data.data);
    localStorage.setItem(`${data.data.id}`,quizzSerializado);

    getKeys();
    document.querySelector('.access-quizz').innerHTML =`
        <button onclick="funcao(${data.data.id})">Acessar Quiz</button>
        <a href=""> Voltar pra home </a>
    `//lucio adiciona a funcao de exibir o quizz aqui no "onclick="funcao${data.data.id}""
}

function created_quizz_failure(data){
    alert("Erro no envio")
}


/*
Niveis do quizz
- [ ]  Título do nível: mínimo de 10 caracteres.
- [ ]  % de acerto mínima: um número entre 0 e 100.
- [ ]  URL da imagem do nível: deve ter formato de URL.
- [ ]  Descrição do nível: mínimo de 30 caracteres.
- [ ]  É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%.
*/

