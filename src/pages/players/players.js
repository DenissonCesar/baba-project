
let continuar = true
const jogadores = []
const total_estrelas = []


function cadastrar() {
    if (!continuar) {
        alert("[ERRO] Insira os dados corretamente")
        return
    }
    
    //Cadastrar jogador
    const jogador = document.getElementById('nomeJogador').value

    //Se tiver jogador, jogador é adicionado no array
    if (jogador) {
        jogadores.push(jogador)
    }
    //Cadastrar estrelas
    let estrelas = Number(document.getElementById('estrelaJogador').value)

    //Se tiver estrelas, estrelas é adicionado no array
    if (estrelas) {
        total_estrelas.push(estrelas)
    }
    
    const lista_jogadores = document.getElementById('lista_jogadores')
    lista_jogadores.innerHTML += `${jogador}: ${estrelas} estrelas ${jogadores} <br/> <br/> `
    

    

}

function finalizar() {
    continuar = false
    alert("Cadastramento encerrado.")
}
