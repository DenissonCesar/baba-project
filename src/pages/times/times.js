window.addEventListener("DOMContentLoaded", function () {
  const jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
  console.log(jogadores);

  const header = this.document.getElementById("header")
  const btnGerarTimes = document.getElementById("btnGerarTimes");
  const listaTimes = document.getElementById("lista_times");
  const divJogadores = this.document.getElementById("times_add")
  

  if (!btnGerarTimes || !listaTimes) {
    console.error(
      "Elemento(s) não encontrado(s): btnGerarTimes ou lista_times."
    );
    return;
  }

  btnGerarTimes.addEventListener("click", function () {
    const jogadoresPorTime = parseInt(
      document.getElementById("numero_jogadores").value
    );

    if (jogadores.length === 0 || jogadoresPorTime <= 0) {
      alert(
        "Certifique-se de ter jogadores cadastrados e de informar um número válido."
      );
      return;
    }

    const totalJogadores = jogadores.length;
    const numTimes = Math.ceil(totalJogadores / jogadoresPorTime);

    jogadores.sort((a, b) => b.estrelas - a.estrelas);

    const times = new Array(numTimes).fill().map(() => []);
    let direcao = 1;
    let timeIndex = 0;

    for (const jogador of jogadores) {
      times[timeIndex].push(jogador);

      if (timeIndex === 0) direcao = 1;
      else if (timeIndex === numTimes - 1) direcao = -1;

      timeIndex += direcao;
    }

    // Limpar times anteriores
    listaTimes.innerHTML = "";

    times.forEach((time, i) => {
      const estrelasTime = time.reduce((acc, j) => acc + j.estrelas, 0);
      const li = document.createElement("li");
      li.innerHTML =
        `<strong>Time ${i + 1}</strong> (${estrelasTime}⭐): ` +
        time.map((j) => `${j.nome} (${j.estrelas}⭐)`).join(", ");
      listaTimes.appendChild(li);
    });
    
    //Tempo de partida
    const btnTempo = document.createElement("h2")
    const inputTempo = document.createElement("input")
    btnTempo.innerHTML = "Tempo de partida:"
    btnTempo.id = "btnTempo"
    inputTempo.id = "inputTempo"
    inputTempo.placeholder="00:00"
    listaTimes.appendChild(btnTempo)
    listaTimes.appendChild(inputTempo)

    

    const btnComecar = document.createElement("button");
    btnComecar.textContent = "Começar";
    btnComecar.id = "btnComecar"; //Id para estilizar no CSS

    listaTimes.appendChild(btnComecar);
    btnComecar.addEventListener("click", function () {
      listaTimes.innerHTML += `Preparando contagem...`;
      let contador = 3;
      const contagem_regressiva = document.createElement("p");
      contagem_regressiva.textContent = contador;
      listaTimes.appendChild(contagem_regressiva);

      const intervalo = setInterval(() => {
        contador--;
        if (contador > 0) {
          contagem_regressiva.textContent = contador;
        } else {
          clearInterval(intervalo);
          contagem_regressiva.textContent = `Iniciando jogos!`;
          iniciarJogos(times);
           
          
        }
      }, 1000);
    });

    
    

    function iniciarJogos(times) {
      header.remove()
      listaTimes.innerHTML = "<h3>Confronto Atual</h3>";
      const fila = [...times]; // Cópia da lista de times
      const timeAtual = fila.shift(); // Primeiro time assume o trono
      novoReiDaMesa(timeAtual, fila); 

    }

    function novoReiDaMesa(rei, fila) {
      if (fila.length === 0) {
        listaTimes.innerHTML += "<p>⚠️ Sem mais times para desafiar.</p>";
        return;
      }
    
      const desafiante = fila.shift();
    
      const confrontoEl = document.createElement("div");
      function listarJogadores(time) {
        return time.map(jogador => `${jogador.nome} (${jogador.estrelas}⭐)`).join(", ");
      }
      confrontoEl.innerHTML = `
        <p><strong>Time Atual (Rei):</strong> ${listarJogadores(rei)}</p>
        <p><strong>Desafiante:</strong> ${listarJogadores(desafiante)}</p>
        <button id="vitoriaRei">Time 1 venceu</button>
        <button id="vitoriaDesafiante">Time 2 venceu</button>
        <button id="finalizarJogo" style="margin-left: 10px;">Finalizar Jogo</button>
      `;
    
      listaTimes.appendChild(confrontoEl);
      
      //Criacão do Timer
      const cronometroEl = document.createElement("p")
      cronometroEl.id ="cronometro"
      listaTimes.appendChild(cronometroEl)
      const controles = document.createElement("div")

      const btnPausar = document.createElement("button")
      btnPausar.textContent = "Pausar"

      const btnRetomar = document.createElement("button")
      btnRetomar.textContent = "Retomar"

      const btnReiniciar = document.createElement("button")
      btnReiniciar.textContent = "Reiniciar"

      controles.appendChild(btnPausar)
      controles.appendChild(btnRetomar)
      controles.appendChild(btnReiniciar)
      listaTimes.appendChild(controles)

      const tempoDigitado = inputTempo.value || "00:00"
      const [min, sec] = tempoDigitado.split(":").map(Number)
      let tempoRestante = (min * 60) + sec
      let tempoInicial = tempoRestante
      let intervaloCronometro = null

      function atualizarDisplay() {
        const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, "0")
        const segundos = String(tempoRestante % 60).padStart(2, "0")
        cronometroEl.textContent = `⏳ ${minutos}:${segundos}`
      }

      function iniciarContagem() {
        if (intervaloCronometro !== null) return 

        intervaloCronometro = setInterval(() => {
          if (tempoRestante <= 0) {
            clearInterval(intervaloCronometro)
            intervaloCronometro = null
            cronometroEl.textContent = "⏱️ Tempo esgotado!"
            return 
          }

          tempoRestante--
          atualizarDisplay()
        }, 1000)
      }

      function pausarContagem() {
        clearInterval(intervaloCronometro)
        intervaloCronometro = null
        
      }

      function reiniciarContagem() {
        tempoRestante = tempoInicial
        atualizarDisplay()
        iniciarContagem()
      }

      atualizarDisplay()
      iniciarContagem()

      btnPausar.addEventListener("click", pausarContagem)
      btnRetomar.addEventListener("click", iniciarContagem)
      btnReiniciar.addEventListener("click", () => {
        pausarContagem()
        reiniciarContagem()
      })
      
    
      const pararContagem = () => pausarContagem


      document.getElementById("vitoriaRei").addEventListener("click", () => {
        alert("🏆 Time 1 venceu e continua!");
        confrontoEl.remove();
        cronometroEl.remove()
        controles.remove()
        fila.push(desafiante); // Desafiante volta pro fim da fila
        novoReiDaMesa(rei, fila);
        pararContagem
      });
    
      document.getElementById("vitoriaDesafiante").addEventListener("click", () => {
        alert("⚔️ Time 2 venceu e assume o lugar!");
        confrontoEl.remove();
        cronometroEl.remove()
        controles.remove()
        fila.push(rei); // Rei derrotado vai pro fim da fila
        novoReiDaMesa(desafiante, fila);
        pararContagem
      });
    
      document.getElementById("finalizarJogo").addEventListener("click", () => {
        confrontoEl.remove();
        cronometroEl.remove()
        controles.remove()
        pararContagem
        listaTimes.innerHTML = `
          <h2>✅ Jogo Finalizado</h2>
          <p>Último time vencedor: ${listarJogadores(rei)}</p>
        `;
      });
    }
    
  });
});
