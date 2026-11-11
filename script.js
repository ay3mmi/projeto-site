window.addEventListener('DOMContentLoaded', () => {
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const nomeSalvo = localStorage.getItem('usuarioNome');

    const navBtnEntrar = document.getElementById('nav-btn-entrar');
    const navPerfilContainer = document.getElementById('nav-perfil-container');
    const dropdownNome = document.getElementById('dropdown-nome');

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

    // troca do botao entrar pela foto de perfil
    if (estaLogado && nomeSalvo) {
        navBtnEntrar.classList.add('oculto');
        navPerfilContainer.classList.remove('oculto');
        dropdownNome.textContent = nomeSalvo;
    } else {
        navBtnEntrar.classList.remove('oculto');
        navPerfilContainer.classList.add('oculto');
    }

    // Menu abrindo e fechando
    const btnAbrirMenu = document.getElementById('btn-abrir-menu');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (btnAbrirMenu && dropdownMenu) {
        btnAbrirMenu.addEventListener('click', (evento) => {
            evento.stopPropagation();
            dropdownMenu.classList.toggle('ativo');
        });

        // menu fecha quando voce clica fora dele
        window.addEventListener('click', (evento) => {
            if (!dropdownMenu.contains(evento.target) && evento.target !== btnAbrirMenu) {
                dropdownMenu.classList.remove('ativo');
            }
        });
    }

    const btnSairMenu = document.getElementById('btn-sair-menu');
    if (btnSairMenu) {
        btnSairMenu.addEventListener('click', () => {
            localStorage.setItem('usuarioLogado', 'false');
            window.location.reload();
        });
    }
});