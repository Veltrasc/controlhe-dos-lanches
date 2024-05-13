window.onload = function() {
    var ingredientesSalvos = JSON.parse(localStorage.getItem('ingredientes'));
    if (ingredientesSalvos) {
        ingredientesSalvos.forEach(function(ingrediente) {
            adicionarLinha(ingrediente);
        });
        recalcularCustos(); 
    }
}

function salvarNoLocalStorage() {
    var ingredientes = [];
    var linhas = document.querySelectorAll('#tabela-corpo tr');
    linhas.forEach(function(linha) {
        var ingrediente = {
            nome: linha.querySelector('input[id^="nome_"]').value,
            preco: parseFloat(linha.querySelector('input[id^="preco_"]').value.replace(',', '.')), // Substitui ',' por '.'
            quantidade: parseFloat(linha.querySelector('input[id^="quantidade_"]').value),
            quantidadeReceita: parseFloat(linha.querySelector('input[id^="quantidade_receita_"]').value)
        };
        ingredientes.push(ingrediente);
    });
    localStorage.setItem('ingredientes', JSON.stringify(ingredientes));
}

function limparTabelaELocalStorage() {
    document.getElementById('tabela-corpo').innerHTML = '';
    localStorage.removeItem('ingredientes');
}

function adicionarLinha(ingrediente) {
    var corpoTabela = document.getElementById('tabela-corpo');
    var numRows = corpoTabela.rows.length + 1;
    var newRow = corpoTabela.insertRow(-1);

    var cells = [];
    for (var i = 0; i < 5; i++) {
        cells[i] = newRow.insertCell(i);
    }
    cells[0].innerHTML = `<input type="text" id="nome_${numRows}" oninput="calcularCusto(${numRows})" placeholder="Nome do ingrediente" value="${ingrediente && ingrediente.nome ? ingrediente.nome : ''}">`;
    cells[1].innerHTML = `<input type="text" id="preco_${numRows}" oninput="calcularCusto(${numRows})" placeholder="Preço" value="${ingrediente && ingrediente.preco ? ingrediente.preco : ''}">`;
    cells[2].innerHTML = `<input type="text" id="quantidade_${numRows}" oninput="calcularCusto(${numRows})" placeholder="Quantidade" value="${ingrediente && ingrediente.quantidade ? ingrediente.quantidade : ''}"> `;
    cells[3].innerHTML = `<input type="text" id="quantidade_receita_${numRows}" oninput="calcularCusto(${numRows})" placeholder="Quantidade na Receita" value="${ingrediente && ingrediente.quantidadeReceita ? ingrediente.quantidadeReceita : ''}">`;
    cells[4].setAttribute('id', `custo_${numRows}`);
    recalcularCustos(); 
}

document.getElementById('btnAddRow').addEventListener('click', function() {
    adicionarLinha();
});
document.getElementById('btnSalvar').addEventListener('click', function() {
    salvarNoLocalStorage();
    alert('Ingredientes salvos localmente.');
});
document.getElementById('btnLimpar').addEventListener('click', function() {
    limparTabelaELocalStorage();
    alert('Tabela e dados salvos foram limpos.');
});

function calcularCusto(index) {
    var precoPorUnidade = parseFloat(document.getElementById('preco_' + index).value.replace(',', '.')); // Substitui ',' por '.'
    var quantidadePorEmbalagem = parseFloat(document.getElementById('quantidade_' + index).value.replace(',', '.')); // Substitui ',' por '.'
    var quantidadeNaReceita = parseFloat(document.getElementById('quantidade_receita_' + index).value.replace(',', '.')); // Substitui ',' por '.'

    var custoIngrediente = (precoPorUnidade * quantidadeNaReceita) / quantidadePorEmbalagem;

    document.getElementById('custo_' + index).innerText = custoIngrediente.toFixed(2);

    calcularCustoTotal();
}

function calcularCustoTotal() {
    var total = 0;
    var custos = document.querySelectorAll('[id^="custo_"]');
    custos.forEach(function(custo) {
        total += parseFloat(custo.innerText);
    });
    document.getElementById('total-cost').innerText = total.toFixed(2);
}

function recalcularCustos() {
    var custos = document.querySelectorAll('[id^="custo_"]');
    custos.forEach(function(custo) {
        var index = custo.id.split("_")[1];
        calcularCusto(index);
    });
}
