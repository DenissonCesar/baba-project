window.addEventListener("DOMContentLoaded", function () {
  const jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
  console.log(jogadores);

  const btnGerarTimes = document.getElementById("btnGerarTimes");
  const listaTimes = document.getElementById("lista_times");

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
      listaTimes.innerHTML = "<h3>Confronto Atual</h3>";
      novoConfronto(times);
    }

    function novoConfronto(times) {
      const embaralhado = [...times].sort(() => Math.random() - 0.5);
      const time1 = embaralhado[0];
      const time2 = embaralhado[1];

      const confrontoEl = document.createElement("div");
      confrontoEl.innerHTML = `
        <p><strong>Time 1:</strong> ${listarJogadores(time1)}</p>
        <p><strong>Time 2:</strong> ${listarJogadores(time2)}</p>
        <button id="vitoria1">Time 1 venceu</button>
        <button id="vitoria2">Time 2 venceu</button>
        <button id="finalizarJogo" style="margin-left: 10px;">Finalizar Jogo</button>
      `;

      listaTimes.appendChild(confrontoEl);

      document.getElementById("vitoria1").addEventListener("click", () => {
        alert("Time 1 venceu!");
        confrontoEl.remove();
        novoConfronto(times);
      });

      document.getElementById("vitoria2").addEventListener("click", () => {
        alert("Time 2 venceu!");
        confrontoEl.remove();
        novoConfronto(times);
      });

      document.getElementById("finalizarJogo").addEventListener("click", () => {
        confrontoEl.remove();
        listaTimes.innerHTML = "<h2>✅ Jogo Finalizado</h2>";
      });
    }

    function listarJogadores(time) {
      return time.map((j) => `${j.nome} (${j.estrelas}⭐)`).join(", ");
    }
  });
});
