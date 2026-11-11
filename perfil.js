// Perfil

const navBtnEntrar = document.getElementById('nav-btn-entrar');
const navPerfilContainer = document.getElementById('nav-perfil-container');
const btnAbrirMenu = document.getElementById('btn-abrir-menu');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownNome = document.getElementById('dropdown-nome');

const perfilNome = document.getElementById('perfil-nome');
const perfilEmail = document.getElementById('perfil-email');

const btnAbaPedidos = document.getElementById('btn-aba-pedidos');
const btnAbaConta = document.getElementById('btn-aba-conta');
const secaoPedidos = document.getElementById('secao-pedidos');
const secaoConta = document.getElementById('secao-conta');

const formConfiguracoes = document.getElementById('form-configuracoes');
const inputNovoNome = document.getElementById('novo-nome');
const inputNovaSenha = document.getElementById('nova-senha');

function ativarAba(aba) {
    if (aba === 'conta') {
        btnAbaConta.classList.add('ativo');
        btnAbaPedidos.classList.remove('ativo');
        secaoConta.classList.remove('oculto');
        secaoPedidos.classList.add('oculto');
        inputNovoNome.value = localStorage.getItem('usuarioNome') || '';
    } else {
        btnAbaPedidos.classList.add('ativo');
        btnAbaConta.classList.remove('ativo');
        secaoPedidos.classList.remove('oculto');
        secaoConta.classList.add('oculto');
    }
}
    //mais uma parte de json pra vc lucca KKKKKKKKK
window.addEventListener('DOMContentLoaded', () => {
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const emailSalvo = localStorage.getItem('usuarioEmail');

    const barraBusca = document.querySelector('#move input[type="search"]');

if (barraBusca) {
    barraBusca.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            const termo = barraBusca.value.trim();
            
            if (termo !== '') {
                window.location.href = `cardapio.html?busca=${encodeURIComponent(termo)}`;
            } else {
                window.location.href = 'cardapio.html';
            }
        }
    });
}

    if (estaLogado && nomeSalvo && emailSalvo) {
        navBtnEntrar.classList.add('oculto');
        navPerfilContainer.classList.remove('oculto');
        atualizarTextosNaTela(nomeSalvo, emailSalvo);
        carregarPedidos();

        const parametrosUrl = new URLSearchParams(window.location.search);
        const abaSolicitada = parametrosUrl.get('aba');
        if (abaSolicitada === 'conta') {
            ativarAba('conta');
        } else {
            ativarAba('pedidos');
        }
    } else {
        window.location.href = 'login.html';
    }
});

function atualizarTextosNaTela(nome, email) {
    perfilNome.textContent = nome;
    dropdownNome.textContent = nome;
    perfilEmail.textContent = `Email: ${email}`;
}

btnAbaPedidos.addEventListener('click', () => ativarAba('pedidos'));
btnAbaConta.addEventListener('click', () => ativarAba('conta'));
document.getElementById('link-menu-pedidos').addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.remove('ativo');
    ativarAba('pedidos');
});

document.getElementById('link-menu-conta').addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.remove('ativo');
    ativarAba('conta');
});

btnAbrirMenu.addEventListener('click', (evento) => {
    evento.stopPropagation();
    dropdownMenu.classList.toggle('ativo');
});

window.addEventListener('click', (evento) => {
    if (!dropdownMenu.contains(evento.target) && evento.target !== btnAbrirMenu) {
        dropdownMenu.classList.remove('ativo');
    }
});

//Carregar lista de pedidos do json (se vira ai lucca)
function carregarPedidos() {
    const containerLista = document.getElementById('lista-pedidos');
    //Busca pedidos salvos (parte do json do lucca))
    const pedidosSalvos = JSON.parse(localStorage.getItem('usuarioPedidos')) || [];

    if (pedidosSalvos.length === 0) {
        containerLista.innerHTML = `
            <div class="sem-pedidos">
                <p>Você ainda não fez nenhum pedido na Alla Romana.</p>
                <p style="margin-top: 8px;"><a href="cardapio.html" style="color: #C72323; text-decoration: underline;">Ir para o Cardápio</a></p>
            </div>
        `;
        return;
    }

    containerLista.innerHTML = pedidosSalvos.map(pedido => `
        <div class="item-pedido">
            <div class="pedido-info">
                <h3>Pedido #${pedido.id} - ${pedido.itens}</h3>
                <p>Data: ${pedido.data} · Total: R$ ${pedido.total}</p>
            </div>
            <span class="pedido-status">${pedido.status}</span>
        </div>
    `).join('');
}

// salvar a alteraçao do nome e senha
formConfiguracoes.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const novoNome = inputNovoNome.value.trim();
    const novaSenha = inputNovaSenha.value.trim();
    const emailAtual = localStorage.getItem('usuarioEmail');

    if (novoNome) {
        localStorage.setItem('usuarioNome', novoNome);
        atualizarTextosNaTela(novoNome, emailAtual);
    }

    if (novaSenha) {
        localStorage.setItem('usuarioSenha', novaSenha);
        inputNovaSenha.value = '';
    }

    alert('Suas informações foram atualizadas com sucesso!');
});

document.getElementById('btn-sair-menu').addEventListener('click', () => {
    localStorage.setItem('usuarioLogado', 'false');
    window.location.href = 'login.html';
});