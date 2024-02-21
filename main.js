'use strict';

const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
    clearCampos();
    document.getElementById('modal').classList.remove('active');
};

const getLocalStorage = () => JSON.parse(localStorage.getItem('dadosCliente')) ?? [];
const setLocalStorage = (dadosCliente) => localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));

// CRUD - CREATE READ UPDATE DELETE

// Create (Função que irá enviar os dados do cliente):
const createCliente = (cliente) => {
    const dadosCliente = getLocalStorage();
    dadosCliente.push(cliente);
    setLocalStorage(dadosCliente);
};

// Read (Função que irá ler os dados do cliente):
const readCliente = () => getLocalStorage();

// Update (Função que irá receber e carregar os novos dados do cliente):
const updateCliente = (index, cliente) => {
    const dadosCliente = readCliente();
    dadosCliente[index] = cliente;
    setLocalStorage(dadosCliente);
};

// Delete (Função que irá deletar os dados do cliente):
const deleteCliente = (index) => {
    const dadosCliente = readCliente();
    dadosCliente.splice(index, 1);
    setLocalStorage(dadosCliente);
};

// Interação com o usuário:
// Traz os campos vazios, verifica se os campos foram preenchidos de forma valida e salva cliente com os dados preenchidos:
const camposValidos = () => document.getElementById('form').reportValidity();

const clearCampos = () => {
    const campos = document.querySelectorAll('.modal-campos');
    campos.forEach(campo => campo.value = '');
};

const saveCliente = () => {
    if (camposValidos()) {
        const cliente = {
            empresa: document.getElementById('empresa').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            contato: document.getElementById('contato').value,
            laudos: document.getElementById('laudos').value,
            revisao: document.getElementById('revisao').value,
            treinamentos: document.getElementById('treinamentos').value,
            responsavel: document.getElementById('responsavel').value
        };

        const index = document.getElementById('empresa').dataset.index;
        if (index == 'new') {
            createCliente(cliente);
        } else {
            updateCliente(index, cliente);
        }
        carregarDados();
        closeModal();
    }
};

// Cria uma nova linha para baixo, a cada novo cliente cadastrado e traz os dados preenchidos do novo cliente:
const createLinha = (cliente, index) => {
    const newLinha = document.createElement('tr');
    newLinha.innerHTML = `
        <td>${cliente.empresa}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.contato}</td>
        <td>${cliente.laudos}</td>
        <td>${cliente.revisao}</td>
        <td>${cliente.treinamentos}</td>
        <td>${cliente.responsavel}</td>
        <td> 
            <button type="button" class="button green" id="edit-${index}">Editar</button> 
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td> 
    `;
    document.querySelector('#tableCliente tbody').appendChild(newLinha);
};

const clearTable = () => {
    const linhas = document.querySelectorAll('#tableCliente tbody tr');
    linhas.forEach(linha => linha.parentNode.removeChild(linha));
};

const sortClientes = () => {
    const dadosCliente = readCliente();
    dadosCliente.sort((a, b) => {
        // Primeiro ordena pelo nome da empresa
        const empresaComparison = a.empresa.localeCompare(b.empresa);
        if (empresaComparison !== 0) return empresaComparison;
        
        // Se as empresas forem diferentes, retorna a comparação alfabética
        // Caso contrário, ordena pela data de revisão mais próxima ou vencida
        const dateA = new Date(a.revisao);
        const dateB = new Date(b.revisao);
        return dateA - dateB;
    });
    setLocalStorage(dadosCliente); // Atualiza a posição no localStorage após a ordenação
    return dadosCliente;
};

const carregarDados = () => {
    const dadosCliente = sortClientes();
    clearTable();
    dadosCliente.forEach(createLinha);
};     

// Aqui quando eu clicar em editar, ele precisa trazer os campos para que sejam editados:
const preencherCampos = (cliente) => {
    document.getElementById('empresa').value = cliente.empresa;
    document.getElementById('email').value = cliente.email;
    document.getElementById('telefone').value = cliente.telefone;
    document.getElementById('contato').value = cliente.contato;
    document.getElementById('laudos').value = cliente.laudos;
    document.getElementById('revisao').value = cliente.revisao;
    document.getElementById('treinamentos').value = cliente.treinamentos;
    document.getElementById('responsavel').value = cliente.responsavel;
    document.getElementById('empresa').dataset.index = cliente.index;
};

const editCliente = (index) => {
    const cliente = readCliente()[index];
    preencherCampos(cliente);
    openModal();
    // Atualizar o índice do botão "Salvar" para o índice do cliente que está sendo editado
    document.getElementById('empresa').dataset.index = index;
};

// Aqui poderia ser adicionado um (data-action) na linha (button) do (td) acima, para distinguir qual botão está sendo chamado.
// Mas optei por adicionar um id= para cada um deles (id="edit" / id="delete")
const editarDeletar = (evento) => {
    if (evento.target.type == 'button') {
        const [action, index] = evento.target.id.split('-');
        if (action == 'edit') {
            editCliente(index);
        } else {
            const cliente = readCliente()[index];
            const response = confirm(`Deseja realmente excluir cadastro do cliente: ${cliente.empresa}?`);
            if (response) {
                deleteCliente(index);
                carregarDados();
            }
        }
    }
};

carregarDados();

// Eventos:
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', saveCliente);

document.querySelector('#tableCliente tbody')
    .addEventListener('click', editarDeletar);