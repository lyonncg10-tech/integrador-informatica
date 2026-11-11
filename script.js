function pegarRelatos() {
    let relatos = localStorage.getItem("senacResolveRelatos");

    if (relatos === null) {
        return [
            {
                nome: "Aluno",
                problema: "Internet da sala",
                local: "Laboratório de informática",
                descricao: "A internet está muito lenta durante as aulas.",
                status: "Em análise",
                data: "Exemplo"
            },
            {
                nome: "Aluno",
                problema: "Lâmpada",
                local: "Sala 04",
                descricao: "Uma lâmpada da sala não está funcionando.",
                status: "Em análise",
                data: "Exemplo"
            },
            {
                nome: "Aluno",
                problema: "Limpeza",
                local: "Banheiro",
                descricao: "O banheiro precisa de limpeza.",
                status: "Resolvido",
                data: "Exemplo"
            }
        ];
    }

    return JSON.parse(relatos);
}

function salvarRelatos(relatos) {
    localStorage.setItem("senacResolveRelatos", JSON.stringify(relatos));
}

function enviarRelato(evento) {
    evento.preventDefault();

    let nome = document.getElementById("nome").value.trim();
    let problema = document.getElementById("problema").value.trim();
    let local = document.getElementById("local").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let mensagem = document.getElementById("mensagem-formulario");

    if (nome === "" || problema === "" || local === "" || descricao === "") {
        mensagem.textContent = "Preencha todos os campos antes de enviar.";
        mensagem.className = "mensagem erro";
        return;
    }

    let relato = {
        nome: nome,
        problema: problema,
        local: local,
        descricao: descricao,
        status: "Em análise",
        data: new Date().toLocaleString("pt-BR")
    };

    let relatos = pegarRelatos();
    relatos.unshift(relato);
    salvarRelatos(relatos);

    mensagem.textContent = "Relato enviado! Abrindo a lista de relatos...";
    mensagem.className = "mensagem sucesso";
    document.getElementById("form-relato").reset();

    setTimeout(function () {
        window.location.href = "relatos.html";
    }, 900);
}

function mostrarRelatos() {
    let lista = document.getElementById("lista-relatos");

    if (lista === null) {
        return;
    }

    let relatos = pegarRelatos();

    if (relatos.length === 0) {
        lista.textContent = "Ainda não há relatos.";
        return;
    }

    relatos.forEach(function (relato) {
        let cartao = document.createElement("article");
        cartao.className = "item item-novo";

        let titulo = document.createElement("h3");
        titulo.textContent = relato.problema;
        cartao.appendChild(titulo);

        let textoLocal = document.createElement("p");
        textoLocal.textContent = "Local: " + relato.local;
        cartao.appendChild(textoLocal);

        let textoDescricao = document.createElement("p");
        textoDescricao.textContent = relato.descricao;
        cartao.appendChild(textoDescricao);

        let textoNome = document.createElement("p");
        textoNome.textContent = "Enviado por: " + relato.nome;
        cartao.appendChild(textoNome);

        let textoData = document.createElement("p");
        textoData.textContent = "Data: " + relato.data;
        cartao.appendChild(textoData);

        let status = document.createElement("small");
        status.textContent = relato.status;
        cartao.appendChild(status);

        lista.appendChild(cartao);
    });
}

function mostrarPainelAdmin() {
    let lista = document.getElementById("lista-admin");

    if (lista === null) {
        return;
    }

    let relatos = pegarRelatos();
    lista.innerHTML = "";

    if (relatos.length === 0) {
        lista.textContent = "Não há relatos para gerenciar.";
        return;
    }

    relatos.forEach(function (relato, indice) {
        let cartao = document.createElement("article");
        cartao.className = "item item-admin";

        let titulo = document.createElement("h3");
        titulo.textContent = relato.problema;
        cartao.appendChild(titulo);

        let informacoes = document.createElement("p");
        informacoes.textContent = "Local: " + relato.local + " | Enviado por: " + relato.nome;
        cartao.appendChild(informacoes);

        let descricao = document.createElement("p");
        descricao.textContent = relato.descricao;
        cartao.appendChild(descricao);

        let rotuloStatus = document.createElement("label");
        rotuloStatus.textContent = "Status: ";
        rotuloStatus.setAttribute("for", "status-" + indice);
        cartao.appendChild(rotuloStatus);

        let seletorStatus = document.createElement("select");
        seletorStatus.id = "status-" + indice;

        let opcoesStatus = ["Em análise", "Resolvido"];

        opcoesStatus.forEach(function (opcaoTexto) {
            let opcao = document.createElement("option");
            opcao.value = opcaoTexto;
            opcao.textContent = opcaoTexto;

            if (relato.status === opcaoTexto) {
                opcao.selected = true;
            }

            seletorStatus.appendChild(opcao);
        });

        seletorStatus.addEventListener("change", function () {
            let listaAtualizada = pegarRelatos();
            listaAtualizada[indice].status = seletorStatus.value;
            salvarRelatos(listaAtualizada);
            mostrarPainelAdmin();
        });

        cartao.appendChild(seletorStatus);

        let botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir relato";
        botaoExcluir.className = "botao-excluir";

        botaoExcluir.addEventListener("click", function () {
            let confirmar = confirm("Tem certeza que deseja excluir este relato?");

            if (confirmar) {
                let listaAtualizada = pegarRelatos();
                listaAtualizada.splice(indice, 1);
                salvarRelatos(listaAtualizada);
                mostrarPainelAdmin();
            }
        });

        cartao.appendChild(botaoExcluir);
        lista.appendChild(cartao);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let formulario = document.getElementById("form-relato");

    if (formulario !== null) {
        formulario.addEventListener("submit", enviarRelato);
    }

    mostrarRelatos();
    mostrarPainelAdmin();
});
