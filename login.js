const formAcesso = document.getElementById('form-acesso');
const btnEntrarTab = document.getElementById('botao-entrar');
const btnCriarTab = document.getElementById('botao-criar');
const btnSubmit = document.getElementById('btn-submit');

const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');

let modoCadastro = true;

// alterna para a aba de entrar
btnEntrarTab.addEventListener('click', () => {
    modoCadastro = false;
    inputNome.style.display = 'none';
    inputNome.removeAttribute('required');
    btnSubmit.textContent = 'Entrar';
});

// alterna para a aba de criar conta
btnCriarTab.addEventListener('click', () => {
    modoCadastro = true;
    inputNome.style.display = 'block';
    inputNome.setAttribute('required', 'true');
    btnSubmit.textContent = 'Criar';
});

// formulario de preenchimento
formAcesso.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const email = inputEmail.value;
    const senha = inputSenha.value;

   if (modoCadastro) {
    const nome = inputNome.value;
    
    localStorage.setItem('usuarioNome', nome);
    localStorage.setItem('usuarioEmail', email);
    localStorage.setItem('usuarioSenha', senha);
    localStorage.setItem('usuarioLogado', 'true'); 

    window.location.href = 'perfil.html';
} else {
    const emailSalvo = localStorage.getItem('usuarioEmail');
    const senhaSalva = localStorage.getItem('usuarioSenha');

    if (email === emailSalvo && senha === senhaSalva) {
        localStorage.setItem('usuarioLogado', 'true');
        window.location.href = 'perfil.html';
    } else {
        alert('E-mail ou senha incorretos, ou conta ainda não criada!');
    }
}
});

