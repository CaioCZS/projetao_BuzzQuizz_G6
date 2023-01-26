const toggleHiddenLoading = () =>{
    document.querySelector('.screen-loading').classList.toggle('hidden')
}

/* ================== TELA 1 =================*/
const showAllQuizzes = (resposta) =>{
    let listaAllQuizzes =document.querySelector('.all-quizzes .list-quizzes');
    listaAllQuizzes.innerHTML='';
    resposta.data.forEach(quizz => {
        let template = `
        <div class="quizz id-${quizz.id}">
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

/* ================== TELA 3 =================*/