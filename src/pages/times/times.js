const numero_jogadores = document.getElementById('numero_jogadores')
window.addEventListener("DOMContentLoaded", function () {
    const jogadoresTimes = JSON.parse(localStorage.getItem("jogadores")) || [];
    console.log(jogadoresTimes);
  });



