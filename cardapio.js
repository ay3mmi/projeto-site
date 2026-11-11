function executarBuscaNoCardapio(termoPesquisado, rolarAteProduto = false) {
    const termo = termoPesquisado.toLowerCase().trim();
    const campoBusca = document.getElementById('campo-busca');
    const todosCards = document.querySelectorAll('.card-prato');
    let visiveis = 0;
    let primeiroCardEncontrado = null;

    if (campoBusca && campoBusca.value !== termoPesquisado) {
        campoBusca.value = termoPesquisado;
    }

    if (termo !== '') {
        document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('ativo'));
        const titulo = document.getElementById('titulo-categoria');
        if (titulo) titulo.textContent = `Resultados para "${termoPesquisado}"`;
    }

    todosCards.forEach(card => {
        const nome = card.getAttribute('data-nome').toLowerCase();
        if (nome.includes(termo)) {
            card.classList.remove('oculto');
            visiveis++;
            if (!primeiroCardEncontrado) {
                primeiroCardEncontrado = card;
            }
        } else {
            card.classList.add('oculto');
        }
    });

    const contador = document.getElementById('contador-pratos');
    if (contador) {
        contador.textContent = visiveis === 1 
            ? '1 prato encontrado' 
            : `${visiveis} pratos encontrados`;
    }


    if (primeiroCardEncontrado && termo !== '') {
        const botaoMais = primeiroCardEncontrado.querySelector('.btn-mais-card');
        if (botaoMais) botaoMais.click();

        if (rolarAteProduto) {
            primeiroCardEncontrado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

const campoBuscaCardapio = document.getElementById('campo-busca');
if (campoBuscaCardapio) {
    campoBuscaCardapio.addEventListener('input', (e) => {
        executarBuscaNoCardapio(e.target.value, false);
    });

    campoBuscaCardapio.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executarBuscaNoCardapio(e.target.value, true);
        }
    });
}

// verificação do cardapio pra ver se ta tudo certo na busca
const parametrosUrl = new URLSearchParams(window.location.search);
const termoVindoDeOutraPagina = parametrosUrl.get('busca');

if (termoVindoDeOutraPagina) {
    executarBuscaNoCardapio(termoVindoDeOutraPagina, true);
}

function verificarUsuarioLogado() {
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const nomeSalvo = localStorage.getItem('usuarioNome');

    const navBtnEntrar = document.getElementById('nav-btn-entrar');
    const navPerfilContainer = document.getElementById('nav-perfil-container');
    const dropdownNome = document.getElementById('dropdown-nome');

    if (estaLogado && nomeSalvo) {
        if (navBtnEntrar) navBtnEntrar.classList.add('oculto');
        if (navPerfilContainer) navPerfilContainer.classList.remove('oculto');
        if (dropdownNome) dropdownNome.textContent = nomeSalvo;
    } else {
        if (navBtnEntrar) navBtnEntrar.classList.remove('oculto');
        if (navPerfilContainer) navPerfilContainer.classList.add('oculto');
    }
}
// verfica se o usuario esta logado
verificarUsuarioLogado();

const btnAbrirMenu = document.getElementById('btn-abrir-menu');
const dropdownMenu = document.getElementById('dropdown-menu');

if (btnAbrirMenu && dropdownMenu) {
    btnAbrirMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('ativo');
    });

    window.addEventListener('click', () => {
        dropdownMenu.classList.remove('ativo');
    });
}

const btnSairMenu = document.getElementById('btn-sair-menu');
if (btnSairMenu) {
    btnSairMenu.addEventListener('click', () => {
        localStorage.setItem('usuarioLogado', 'false');
        window.location.reload();
    });
}