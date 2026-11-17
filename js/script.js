function myScope(){

    const registerUser = document.querySelector('#register-contact');
    const boxModal = document.querySelector('.box-modal');
    const closeModal = document.querySelector('.closed-modal');
    const formModal = document.querySelector('#formModal');
    const formError = document.querySelector('.form-error');
    const cepStatus = document.querySelector('.cep-status');
    const tableBody = document.querySelector('.table-full tbody');
    const search = document.querySelector('.search');
    const labels = [...document.querySelectorAll('.table-full th')].map(th => th.textContent);
    const fields = ['name', 'email', 'telphone', 'job', 'enterprise', 'cep', 'city', 'state', 'datebirth', 'observation'];

    const name = document.querySelector('.name');
    const email = document.querySelector('.email');
    const telphone = document.querySelector('.telphone');
    const job = document.querySelector('.job');
    const enterprise = document.querySelector('.enterprise');
    const cep = document.querySelector('.cep');
    const city = document.querySelector('.city');
    const state = document.querySelector('.state');
    const datebirth = document.querySelector('.datebirth');
    const observation = document.querySelector('.observation');

    let database = JSON.parse(localStorage.getItem('contacts')) || [];
    let editingId = null;

    function openModal(){
        formModal.reset();
        formError.textContent = '';
        cepStatus.textContent = '';
        editingId = null;
        boxModal.classList.remove('hidden');
        boxModal.scrollIntoView({ block: 'center' });
    }

    function closedModal(){
        boxModal.classList.add('hidden');
    }

    function atualizationForm(e){
        e.preventDefault();
        const data = getData();

        const error = validate(data);
        formError.textContent = error;
        if (error) return;

        if (editingId === null) {
            database.push({ id: crypto.randomUUID(), ...data });
        } else {
            const index = database.findIndex(contact => contact.id === editingId);
            database[index] = { id: editingId, ...data };
        }

        saveDatabase();
        renderTable();
        closedModal();
    }

    function getData(){
        return {
            name: name.value.trim(),
            email: email.value.trim(),
            telphone: telphone.value.trim(),
            job: job.value.trim(),
            enterprise: enterprise.value.trim(),
            cep: cep.value.trim(),
            city: city.value.trim(),
            state: state.value.trim(),
            datebirth: datebirth.value,
            observation: observation.value.trim()
        };
    }

    function validate(data){
        if (!data.name) return 'Preencha o nome.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Digite um e-mail válido.';
        if (!/^\d{10,11}$/.test(data.telphone.replace(/\D/g, ''))) return 'Digite um telefone válido com DDD.';
        return '';
    }

    function fillForm(contact){
        name.value = contact.name;
        email.value = contact.email;
        telphone.value = contact.telphone;
        job.value = contact.job;
        enterprise.value = contact.enterprise;
        cep.value = contact.cep;
        city.value = contact.city;
        state.value = contact.state;
        datebirth.value = contact.datebirth;
        observation.value = contact.observation;
    }

    function saveDatabase(){
        localStorage.setItem('contacts', JSON.stringify(database));
    }

    function editContact(id){
        openModal();
        editingId = id;
        fillForm(database.find(contact => contact.id === id));
    }

    function deleteContact(id){
        const contact = database.find(contact => contact.id === id);
        if (!confirm(`Excluir o contato ${contact.name}?`)) return;

        if (id === editingId) closedModal();

        database = database.filter(contact => contact.id !== id);
        saveDatabase();
        renderTable();
    }

    function renderTable(){
        const term = search.value.toLowerCase();
        tableBody.innerHTML = '';

        database.forEach(contact => {
            const text = fields.map(key => contact[key]).join(' ').toLowerCase();
            if (!text.includes(term)) return;

            const row = document.createElement('tr');

            fields.forEach((key, i) => {
                const cell = document.createElement('td');
                cell.dataset.label = labels[i];
                cell.textContent = contact[key];
                row.appendChild(cell);
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => editContact(contact.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteContact(contact.id));

            const buttons = document.createElement('span');
            buttons.append(editButton, ' | ', deleteButton);

            const actions = document.createElement('td');
            actions.className = 'edit-delete';
            actions.dataset.label = labels.at(-1);
            actions.appendChild(buttons);

            row.appendChild(actions);
            tableBody.appendChild(row);
        });
    }

    async function searchCep(){
        const cleanCep = cep.value.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            cepStatus.textContent = cleanCep ? 'O CEP precisa ter 8 números.' : '';
            return;
        }

        cepStatus.textContent = 'Buscando endereço...';

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const address = await response.json();

            if (address.erro) {
                cepStatus.textContent = 'CEP não encontrado.';
                return;
            }

            city.value = address.localidade;
            state.value = address.uf;
            cepStatus.textContent = '';
        } catch {
            cepStatus.textContent = 'Erro ao buscar o CEP. Tente novamente.';
        }
    }

    registerUser.addEventListener('click', openModal);
    closeModal.addEventListener('click', closedModal);
    formModal.addEventListener('submit', atualizationForm);
    cep.addEventListener('blur', searchCep);
    search.addEventListener('input', renderTable);

    renderTable();
}

myScope();
