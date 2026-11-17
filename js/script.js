function myScope(){

    const registerUser = document.querySelector('#register-contact');
    const boxModal = document.querySelector('.box-modal');
    const closeModal = document.querySelector('.closed-modal');
    const formModal = document.querySelector('#formModal');

    const name = document.querySelector('.name');
    const email = document.querySelector('.email');
    const telphone = document.querySelector('.telphone');
    const job = document.querySelector('.job');
    const enterprise = document.querySelector('.enterprise');
    const city = document.querySelector('.city');
    const state = document.querySelector('.state');
    const datebirth = document.querySelector('.datebirth');
    const observation = document.querySelector('.observation');

    let database = []

    function openModal(){
        boxModal.classList.remove('hidden');
    }

    function closedModal(){
        boxModal.classList.add('hidden');
    }

    function atualizationForm(e){
        e.preventDefault();
        getData();
    }

    // function getData(){ BUILDING HEHE
    //     const data = database.push({
    //         name: name.value,
    //         email: email.value,
    //         telphone: telphone.value,
    //         job: job.value,
    //         enterprise: enterprise.value,
    //         city: city.value,
    //         state: state.value,
    //         datebirth: datebirth.value,
    //         observation: observation.value
    //     })
    // }

    registerUser.addEventListener('click', openModal);
    closeModal.addEventListener('click', closedModal);
    formModal.addEventListener('submit', atualizationForm);
}

myScope();