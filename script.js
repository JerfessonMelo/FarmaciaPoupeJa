document.getElementById('form-cadastro')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem. Tente novamente.');
        return;
    }

    alert('Cadastro realizado com sucesso!');
});

async function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    const regexCep = /^[0-9]{8}$/;
    if (!regexCep.test(cep)) {
        alert('CEP inválido! Verifique e tente novamente.');
        limparCamposEndereco();
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            alert('CEP não encontrado!');
            limparCamposEndereco();
            return;
        }

        document.getElementById('rua').value = dados.logradouro || '';
        document.getElementById('bairro').value = dados.bairro || '';
        document.getElementById('cidade').value = dados.localidade || '';
        document.getElementById('estado').value = dados.uf || '';
    } catch (erro) {
        alert('Erro ao buscar o CEP. Tente novamente mais tarde.');
        console.error('Erro:', erro);
    }
}

function limparCamposEndereco() {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}


function limparCamposEndereco() {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

function exibirDetalhes(nome, preco, imagem, descricao) {
    const produto = { nome, preco, imagem, descricao };
    localStorage.setItem('produtoDetalhado', JSON.stringify(produto));

    window.location.href = 'detalhes.html';
}

function carregarDetalhes() {
    const produto = JSON.parse(localStorage.getItem('produtoDetalhado'));

    if (!produto) {
        document.querySelector('#detalhes-produto').innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }

    const detalhesContainer = document.querySelector('#detalhes-produto');
    detalhesContainer.innerHTML = `
        <img src="${produto.imagem || 'placeholder.jpg'}" alt="${produto.nome}">
        <h1>${produto.nome}</h1>
        <p>${produto.descricao || 'Sem descrição disponível.'}</p>
        <span>R$ ${produto.preco.toFixed(2)}</span>
    `;

    window.produtoAtual = produto;
}

function carregarProdutos() {
    const produtos = [
        {
            nome: "Produto A",
            preco: 49.99,
            imagem: "produtoA.jpg",
            descricao: "Descrição do Produto A."
        },
        {
            nome: "Produto B",
            preco: 29.99,
            imagem: "produtoB.jpg",
            descricao: "Descrição do Produto B."
        }
    ];

    const container = document.querySelector('.product-list');
    container.innerHTML = '';

    produtos.forEach(produto => {
        const produtoHTML = `
            <div class="product">
                <img src="${produto.imagem || 'placeholder.jpg'}" alt="${produto.nome}">
                <p>${produto.nome}</p>
                <span>R$ ${produto.preco.toFixed(2)}</span>
                <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})">Adicionar ao Carrinho</button>
                <button onclick="exibirDetalhes('${produto.nome}', ${produto.preco}, '${produto.imagem}', '${produto.descricao}')">Ver Detalhes</button>
            </div>
        `;
        container.innerHTML += produtoHTML;
    });
}

function adicionarAoCarrinho(nome, preco) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const produto = { nome, preco };
    carrinho.push(produto);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert(`${nome} foi adicionado ao carrinho!`);
}

function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoLista = document.getElementById('carrinho-lista');

    if (carrinho.length === 0) {
        carrinhoLista.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    carrinhoLista.innerHTML = '<ul>';
    carrinho.forEach((produto, index) => {
        carrinhoLista.innerHTML += `
            <li>
                ${produto.nome} - R$ ${produto.preco.toFixed(2)}
                <button onclick="removerDoCarrinho(${index})">Remover</button>
            </li>
        `;
    });
    carrinhoLista.innerHTML += '</ul>';
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

function finalizarCompra() {
    alert('Compra finalizada! Obrigado por comprar conosco.');
    localStorage.removeItem('carrinho');
    carregarCarrinho();
}
