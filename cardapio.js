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


document.addEventListener("DOMContentLoaded", () => {
    // 1. Banco de descrições para enriquecer os itens no carrinho
    const descricoesPratos = {
        "Tagliatelle al Ragù (Bolonhesa)": "Massa fresca artesanal servida com ragù tradicional de carne cozido lentamente.",
        "Pizza Napoletana": "Massa de fermentação natural, molho de tomate pelati, mozzarella di bufala e manjericão.",
        "Spaghetti alla Carbonara": "Massa al dente envolvida em creme de gemas, queijo pecorino romano, guanciale e pimenta.",
        "Lasanha Bolonhesa": "Camadas de massa fresca, molho à bolonhesa, bechamel cremoso e parmesão gratinado.",
        "Tiramisù": "Biscoitos savoiardi embebidos em café expresso, creme de mascarpone e cacau em pó.",
        "Parmigiana di Melanzane": "Fatias de berinjela empanadas, intercaladas com molho de tomate rústico e queijos.",
        "Ossobuco": "Jarrete bovino cozido lentamente no vinho branco e ervas, acompanhado de risoto.",
        "Panna Cotta": "Creme de nata cozido com fava de baunilha e finalizado com calda de frutas vermelhas.",
        "Sfogliatella": "Massa folhada crocante tradicional recheada com creme de ricota doce e frutas cítricas."
    };

    // 2. Garante que a estrutura do Drop Lateral (Gaveta) e Overlay existam no HTML
    let overlay = document.querySelector(".overlay-carrinho");
    let gaveta = document.querySelector(".gaveta-carrinho");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay-carrinho oculto";
        document.body.appendChild(overlay);
    }

    if (!gaveta) {
        gaveta = document.createElement("aside");
        gaveta.className = "gaveta-carrinho";
        gaveta.innerHTML = `
            <div class="carrinho-topo">
                <h2>🛒 Seu Carrinho</h2>
                <button class="btn-fechar-carrinho" title="Fechar">&times;</button>
            </div>
            <div class="carrinho-lista"></div>
            <div class="carrinho-rodape">
                <div class="linha-total">
                    <span>Total a pagar:</span>
                    <span class="preco-total-verde">R$ 0,00</span>
                </div>
                <button class="btn-confirmar-pedido">Confirmar Pedido</button>
            </div>
        `;
        document.body.appendChild(gaveta);
    }

    // 3. Seleção dos elementos da tela
    const btnCarrinhoTopo = document.querySelector(".carrinho");
    const contadorCarrinho = document.querySelector(".carrinho span");
    const btnFechar = gaveta.querySelector(".btn-fechar-carrinho");
    const listaCarrinho = gaveta.querySelector(".carrinho-lista");
    const totalCarrinhoEl = gaveta.querySelector(".preco-total-verde");
    const btnConfirmar = gaveta.querySelector(".btn-confirmar-pedido");
    const botoesAdicionar = document.querySelectorAll(".btn-mais-card");

    // 4. Estado do Carrinho (salvo no navegador)
    let carrinho = JSON.parse(localStorage.getItem("carrinho_alla_romana")) || [];

    // 5. Funções para Abrir e Fechar o Drop Lateral
    function abrirDropLateral() {
        gaveta.classList.add("aberto");
        overlay.classList.remove("oculto");
    }

    function fecharDropLateral() {
        gaveta.classList.remove("aberto");
        overlay.classList.add("oculto");
    }

    if (btnCarrinhoTopo) btnCarrinhoTopo.addEventListener("click", abrirDropLateral);
    if (btnFechar) btnFechar.addEventListener("click", fecharDropLateral);
    overlay.addEventListener("click", fecharDropLateral);

    // 6. Captura o clique no botão "+" de cada card de produto
    botoesAdicionar.forEach((botao) => {
        botao.addEventListener("click", (evento) => {
            evento.stopPropagation();
            const card = botao.closest(".card-prato");
            if (!card) return;

            const nome = card.querySelector("h3").innerText.trim();
            const imagem = card.querySelector("img").src;
            const precoTexto = card.querySelector(".card-preco").innerText.trim();
            
            // Converte "R$ 44,90" para número 44.90
            const preco = parseFloat(
                precoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
            );

            const descricao = descricoesPratos[nome] || "Especialidade artesanal preparada na hora.";

            adicionarProduto({ nome, imagem, preco, descricao });
        });
    });

    // 7. Lógica de Adicionar, Alterar Quantidade e Remover
    function adicionarProduto(produto) {
        const existente = carrinho.find((item) => item.nome === produto.nome);

        if (existente) {
            existente.quantidade += 1;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }

        atualizarCarrinho();
        abrirDropLateral(); // Abre o drop lateral automaticamente ao adicionar
    }

    window.mudarQtdCarrinho = function (index, delta) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        atualizarCarrinho();
    };

    window.removerDoCarrinho = function (index) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    };

    // 8. Atualiza o contador do ícone, o HTML interno do drop e salva os dados
    function formatarReal(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function atualizarCarrinho() {
        localStorage.setItem("carrinho_alla_romana", JSON.stringify(carrinho));
        listaCarrinho.innerHTML = "";

        let valorTotal = 0;
        let quantidadeTotal = 0;

        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = `
                <p style="text-align: center; color: #777; margin-top: 40px; font-size: 16px;">
                    Seu carrinho está vazio. Clique no <strong>+</strong> de um prato para adicionar!
                </p>
            `;
        } else {
            carrinho.forEach((item, index) => {
                const subtotal = item.preco * item.quantidade;
                valorTotal += subtotal;
                quantidadeTotal += item.quantidade;

                const itemDiv = document.createElement("div");
                itemDiv.className = "item-carrinho";
                itemDiv.style.alignItems = "flex-start";
                itemDiv.style.gap = "12px";

                itemDiv.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}" 
                         style="width: 68px; height: 68px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
                    
                    <div class="item-carrinho-info" style="flex: 1;">
                        <h4>${item.nome}</h4>
                        <p style="font-size: 12px; color: #666; line-height: 1.3; margin: 4px 0 8px 0;">
                            ${item.descricao}
                        </p>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button onclick="mudarQtdCarrinho(${index}, -1)" 
                                    style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #C72323; background: #fff; color: #C72323; font-weight: bold; cursor: pointer;">-</button>
                            <span style="font-weight: 700; font-size: 15px;">${item.quantidade}</span>
                            <button onclick="mudarQtdCarrinho(${index}, 1)" 
                                    style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #C72323; background: #fff; color: #C72323; font-weight: bold; cursor: pointer;">+</button>
                        </div>
                    </div>

                    <div style="text-align: right; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                        <span class="item-carrinho-preco">${formatarReal(subtotal)}</span>
                        <button class="btn-remover-item" onclick="removerDoCarrinho(${index})">Remover</button>
                    </div>
                `;

                listaCarrinho.appendChild(itemDiv);
            });
        }

        // Atualiza o número ao lado do ícone 🛒 no menu superior
        if (contadorCarrinho) {
            contadorCarrinho.innerText = quantidadeTotal;
        }

        // Atualiza o valor total no rodapé do drop lateral
        if (totalCarrinhoEl) {
            totalCarrinhoEl.innerText = formatarReal(valorTotal);
        }
    }

    // 9. Ação do botão Confirmar Pedido
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", () => {
            if (carrinho.length === 0) {
                alert("Adicione algum item ao carrinho antes de confirmar o pedido.");
                return;
            }
            alert("Pedido confirmado com sucesso! Em breve começaremos o preparo.");
            carrinho = [];
            atualizarCarrinho();
            fecharDropLateral();
        });
    }

    // Carrega os itens salvos assim que a página abre
    atualizarCarrinho();
});
