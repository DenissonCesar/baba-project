window.addEventListener("DOMContentLoaded", function () {
  const jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
  console.log(jogadores);

  const btnGerarTimes = document.getElementById("btnGerarTimes");
  if (btnGerarTimes) {
    btnGerarTimes.addEventListener("click", function () {
      const jogadoresPorTime = parseInt(document.getElementById("numero_jogadores").value);
      
      if (jogadores.length === 0 || jogadoresPorTime <= 0) {
        alert("Certifique-se de ter jogadores cadastrados e de informar um número válido.");
        return;
      }

      const totalJogadores = jogadores.length;
      const numTimes = Math.ceil(totalJogadores / jogadoresPorTime);

      jogadores.sort((a, b) => b.estrelas - a.estrelas); // ordenar por estrelas

      const times = new Array(numTimes).fill().map(() => []);
      let direcao = 1;
      let timeIndex = 0;

      for (const jogador of jogadores) {
        times[timeIndex].push(jogador);

        if (timeIndex === 0) direcao = 1;
        else if (timeIndex === numTimes - 1) direcao = -1;

        timeIndex += direcao;
      }

      const listaTimes = document.getElementById("lista_times");
      listaTimes.innerHTML = "";

      times.forEach((time, i) => {
        const estrelasTime = time.reduce((acc, j) => acc + j.estrelas, 0);
        const li = document.createElement("li");
        li.innerHTML = `<strong>Time ${i + 1}</strong> (${estrelasTime}⭐): ` +
          time.map(j => `${j.nome} (${j.estrelas}⭐)`).join(", ");
        listaTimes.appendChild(li);
      });
    });
  }
});


