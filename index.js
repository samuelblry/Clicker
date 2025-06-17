const btnArgent = document.getElementById("txtArgent")
const btnArgentEntier = document.getElementById("btnArgent")

const btnArgentSeconde = document.getElementById("txtArgentSeconde")
const btnArgentSecondeEniter = document.getElementById("btnArgentSeconde")

const persoTuto = document.getElementById("persoTuto")

const menu = document.getElementById("menu");
const btnMenu = document.getElementById('btnMenu')

const coinBonus = document.getElementById("coinBonus")
const popupBonus = document.getElementById("popupBonus")
const txtBonus = document.getElementById('txtBonus')
const enclos1 = document.getElementById("enclo1")

const bonusCountdown = document.getElementById('bonusCountdown');


const imageIds = {
    Enclos1: "imgEnclos1",
    Enclos2: "imgEnclos2",
    Enclos3: "imgEnclos3",
    Enclos4: "imgEnclos4",
    Enclos5: "imgEnclos5"
}

let moneySeconde = 0
let money = 0;
let multiplicateurGainPassageNiveauEnclos = 2
let multiplicateurPrixPassageNiveauEnclos = 2

let listeEnclos = ["ZEBRE", "HYENNE", "GIRAFE", "ELEPHANT", "LION"]

//Level, combien gagne par clic, cout passage niveau suivant, gain au niveau 1
let level = {
  Enclos1: [
    1,
    1,
    200,
    1
  ],
  Enclos2: [
    0,
    0,
    2_000,
    10
  ],
  Enclos3: [
    0,
    0,
    20_000,
    100
  ],
  Enclos4: [
    0,
    0,
    200_000,
    1_000
  ],
  Enclos5: [
    0,
    0,
    2_000_000,
    10_000
  ]
};

let multiplicateurGainPassageNiveauAutoClick = 1.5
let multiplicateurPrixPassageNiveauAutoClick = 2

// Level, cb gagne par seconde, cout passage niveau suivant, gain au niveau 1, gain totale par seconde
let levelAutoClick = {
  Enclos1: [
    0,
    0,
    50,
    1,
    0
  ],
  Enclos2: [
    0,
    0,
    500,
    10,
    0
  ],
  Enclos3: [
    0,
    0,
    5_000,
    100,
    0
  ],
  Enclos4: [
    0,
    0,
    50_000,
    1_000,
    0
  ],
  Enclos5: [
    0,
    0,
    500_000,
    10_000,
    0
  ]
};


function convertirArgent(valeur) {
    if (valeur >= 1000000000) {
        return Math.round(valeur / 100000000) / 10 + "Md";
    } else if (valeur >= 1000000) {
        return Math.round(valeur / 100000) / 10 + "M";
    } else if (valeur >= 1000) {
        return Math.round(valeur / 100) / 10 + "k";
    } else {
        return valeur + "";
    }
}

function toggleMenu() {
    menu.classList.toggle("show");
    btnArgentEntier.classList.toggle("show");
    btnArgentSecondeEniter.classList.toggle("show");
}

function hideTuto(btn) {
  btn.style.display = 'none'
  persoTuto.style.display = 'none'
}

function upgradeImage(enclos, animal) {
  if (level[enclos][0] <= 5) {
    const enclosImg = document.getElementById(imageIds[enclos])
    enclosImg.src = './assets/' + animal + '/enclosLevel' + level[enclos][0] + '.png'
  }
}

function upgrade(type, enclos, button, text, animal) {
  if (type == 'level' && money >= level[enclos][2]) {
    level[enclos][0] = level[enclos][0] + 1;
    if (level[enclos][0] == 1) {
      level[enclos][1] = level[enclos][3];
    }
    level[enclos][1] = Math.round(level[enclos][1] * multiplicateurGainPassageNiveauEnclos);

    upgradeImage(enclos, animal);
    money -= level[enclos][2];

    level[enclos][2] *= multiplicateurPrixPassageNiveauEnclos;

    btnArgent.textContent = convertirArgent(money) + "$";
    button.textContent = convertirArgent(level[enclos][2]) + '$';
    document.getElementById(text).textContent = 'NIVEAU ' + level[enclos][0];
    document.getElementById('nbArgentClic' + enclos).textContent = convertirArgent(level[enclos][1]) + "$/clic";
  } else if (type == 'autoclic' && money >= levelAutoClick[enclos][2]) {
    if (level[enclos][0] < 1) {
      return
    }
    levelAutoClick[enclos][0] += 1;
    if (levelAutoClick[enclos][0] == 1) {
      levelAutoClick[enclos][1] = levelAutoClick[enclos][3];
    }
    levelAutoClick[enclos][1] = Math.round(levelAutoClick[enclos][1] * multiplicateurGainPassageNiveauAutoClick);
    levelAutoClick[enclos][4] += levelAutoClick[enclos][1];
    money -= levelAutoClick[enclos][2];

    levelAutoClick[enclos][2] *= multiplicateurPrixPassageNiveauAutoClick;
    button.textContent = convertirArgent(levelAutoClick[enclos][2]) + '$';

    btnArgent.textContent = convertirArgent(money) + "$";
    moneySeconde += levelAutoClick[enclos][1];
    btnArgentSeconde.textContent = convertirArgent(moneySeconde) + '$/s';
    document.getElementById(text).textContent = '$/S | NIVEAU ' + (levelAutoClick[enclos][0]);
    document.getElementById('nbArgenSeconde' + enclos).textContent = convertirArgent(levelAutoClick[enclos][4]) + "$/s";
  }
}

function moreMoney(enclos, event) {
    const gain = level[enclos][1];
    money += gain;
    btnArgent.textContent = convertirArgent(money) + "$";

    if (event) {
        spawnPiece(event.clientX, event.clientY);
    }
}


function autoClick() {
    money = money + moneySeconde
    btnArgent.textContent = convertirArgent(money) + "$" 
}

function isPosible(button, enclos, type) {
  let cout = 0
  const menuDuBoutton = document.getElementById('enclo' + enclos[enclos.length - 1] + 'Menu')

  if (type == 'level') {
    if (menuDuBoutton.style.backgroundColor == 'rgba(133, 133, 133, 0.7)') {
      requestAnimationFrame(() => isPosible(button, enclos, type))
      return
    }
    cout = level[enclos][2]
  } else if (type == 'autoclic') {
    if (level[enclos][0] < 1) {
      button.style.backgroundColor = 'rgba(99, 43, 10, 0.4)'
      button.style.pointerEvents = 'none'
      requestAnimationFrame(() => isPosible(button, enclos, type))
      return
    }
    cout = levelAutoClick[enclos][2]
  }

  if (cout <= money) {
    button.style.backgroundColor = 'rgba(99, 43, 10, 0.7)'
    button.style.pointerEvents = 'auto'
  } else {
    button.style.backgroundColor = 'rgba(99, 43, 10, 0.4)'

    button.style.pointerEvents = 'none'
  }
  requestAnimationFrame(() => isPosible(button, enclos, type))
}

function lockCase(menu, numEnclosPrecedent, numEnclos) {

  const enclo = 'Enclos' + numEnclos
  const encloAvant = 'Enclos' + numEnclosPrecedent

  const btnAmeliorerLevel = document.getElementById('btnAmeliorerLevel' + enclo)
  const btnAmeliorerClic = document.getElementById('btnAmeliorerClic' + enclo)

  const nbArgentClic = document.getElementById('nbArgentClic' + enclo)
  const nbArgenSeconde = document.getElementById('nbArgenSeconde' + enclo)

  if (level[encloAvant][0] >= 3) {
    menu.style.backgroundColor = 'rgba(223, 176, 110, 0.5)'
    menu.style.borderTop = '5px solid #DFB06E'
    menu.style.borderBottom = '5px solid #DFB06E'

    btnAmeliorerLevel.style.pointerEvents = 'auto';
    btnAmeliorerClic.style.pointerEvents = 'auto';

    btnAmeliorerLevel.style.backgroundColor = 'rgba(99, 43, 10, 0.4)';
    btnAmeliorerClic.style.backgroundColor = 'rgba(99, 43, 10, 0.4)';

    btnAmeliorerLevel.style.border = '3px solid #DFB06E';
    btnAmeliorerClic.style.border = '3px solid #DFB06E';

    btnAmeliorerLevel.style.color = '#DFB06E';
    btnAmeliorerClic.style.color = '#DFB06E';

    nbArgentClic.style.backgroundColor = 'rgba(99, 43, 10, 0.3)'
    nbArgenSeconde.style.backgroundColor = 'rgba(99, 43, 10, 0.3)'

    nbArgentClic.style.border = '2px solid #DFB06E'
    nbArgenSeconde.style.border = '2px solid #DFB06E'

    return

  } else {
    menu.style.backgroundColor = 'rgba(133, 133, 133, 0.7)'
    menu.style.borderTop = '5px solid rgb(202, 202, 202)'
    menu.style.borderBottom = '5px solid rgb(202, 202, 202)'

    btnAmeliorerLevel.style.backgroundColor = 'rgba(223, 176, 110, 0.0)'
    btnAmeliorerClic.style.backgroundColor = 'rgba(223, 176, 110, 0.0)' 

    btnAmeliorerLevel.style.border = '3px solid rgb(202, 202, 202)'
    btnAmeliorerClic.style.border = '3px solid rgb(202, 202, 202)'

    btnAmeliorerLevel.style.color = 'rgb(255, 255, 255)'
    btnAmeliorerClic.style.color = 'rgb(255, 255, 255)'

    nbArgentClic.style.backgroundColor = 'rgba(223, 176, 110, 0.0)'
    nbArgenSeconde.style.backgroundColor = 'rgba(223, 176, 110, 0.0)'

    nbArgentClic.style.border = '2px solid rgb(255, 255, 255)'
    nbArgenSeconde.style.border = '2px solid rgb(255, 255, 255)'
  }
  requestAnimationFrame(() => lockCase(menu, numEnclosPrecedent, numEnclos))
}

function spawnPiece(x, y) {
  const piece = document.createElement('img')
  piece.src = './assets/coin.png'
  piece.className = 'flyingPiece'

  piece.style.left = `${x}px`
  piece.style.top = `${y}px`

  document.body.appendChild(piece)

  setTimeout(() => {
    piece.remove()
  }, 1000)
}

let bonusInfos = null; // <-- variable globale

function spawnBonus() {
  let left = (Math.random() * (90 - 10) + 10)
  let top = (Math.random() * (80 - 10) + 10)
  coinBonus.style.display = 'block';
  coinBonus.style.left = left + '%'
  coinBonus.style.top = top + '%'
}

function generateBonus() {
  coinBonus.style.display = 'none';
  popupBonus.classList.add("showBonus");
  bonusCountdown.style.display = 'block';

  const dureeBonus = (Math.random() * (60 - 20) + 20) * 1000;
  const multiplicateurBonus = Math.floor(Math.random() * (5 - 2 + 1)) + 2;

  let enclo;
  do {
    enclo = 'Enclos' + (Math.floor(Math.random() * 5) + 1);
  } while (level[enclo][0] == 0);

  txtBonus.textContent = "CHAQUE CLIC SUR L'ENCLO " + listeEnclos[enclo[6] - 1] + " EST MULTIPLIÉ PAR " + multiplicateurBonus + " PENDANT " + Math.round(dureeBonus / 1000) + " SECONDES";

  // On stocke les infos sans activer le bonus tout de suite
  bonusInfos = {
    enclo,
    dureeBonus,
    multiplicateurBonus,
    ancienGain: level[enclo][1],
  };
}

function animationCoinTombe() {
  const piece = document.createElement('img')
  piece.src = './assets/coin.png'
  piece.className = 'pieceHaut'
  piece.style.right = Math.random() * 100 + '%'
  
  document.body.appendChild(piece)

  setTimeout(() => {
    piece.remove()
  }, 1000)
}

document.getElementById("btnCloseMenuBonus").addEventListener("click", () => {
  if (!bonusInfos) return;

  popupBonus.classList.remove("showBonus");

  const { enclo, dureeBonus, multiplicateurBonus, ancienGain} = bonusInfos;
  level[enclo][1] *= multiplicateurBonus;

  let tempsRestant = Math.floor(dureeBonus / 1000);
  bonusCountdown.style.display = 'block';
  menu.style.display = 'none';
  btnMenu.style.pointerEvents = 'none';

  let animationBonus = setInterval(animationCoinTombe, 200);
  const countdownInterval = setInterval(() => {
    const minutes = Math.floor(tempsRestant / 60);
    const secondes = tempsRestant % 60;
    bonusCountdown.textContent = `Bonus : ${minutes}:${secondes < 10 ? '0' + secondes : secondes}`;
    tempsRestant--;

    if (tempsRestant < 0) {
      clearInterval(countdownInterval);
      bonusCountdown.style.display = 'none';
      clearInterval(animationBonus);
      btnMenu.style.pointerEvents = 'auto';
      menu.style.display = 'block';

      level[enclo][1] = ancienGain;
      bonusInfos = null;

      const min = 2 * 60 * 1000
      const max = 5 * 60 * 1000

      setTimeout(spawnBonus, Math.floor(Math.random() * (max - min + 1)) + min);
    }
  }, 1000);
});

function tuto() {
  persoTuto.style.display = 'block'
}


window.onload = function () {
  setTimeout(spawnBonus, 1 * 60 * 1000);
  setInterval(autoClick, 1000)
  persoTuto.classList.toggle('tuto')
};

window.addEventListener('DOMContentLoaded', function() {

  const caseMenuEnclos2 = document.getElementById('enclo2Menu')
  const caseMenuEnclos3 = document.getElementById('enclo3Menu')
  const caseMenuEnclos4 = document.getElementById('enclo4Menu')
  const caseMenuEnclos5 = document.getElementById('enclo5Menu')

  const btnAmeliorerLevelEnclos1 = document.getElementById('btnAmeliorerLevelEnclos1')
  const btnAmeliorerClicEnclos1 = document.getElementById('btnAmeliorerClicEnclos1')
  const btnAmeliorerLevelEnclos2 = document.getElementById('btnAmeliorerLevelEnclos2')
  const btnAmeliorerClicEnclos2 = document.getElementById('btnAmeliorerClicEnclos2')
  const btnAmeliorerLevelEnclos3 = document.getElementById('btnAmeliorerLevelEnclos3')
  const btnAmeliorerClicEnclos3 = document.getElementById('btnAmeliorerClicEnclos3')
  const btnAmeliorerLevelEnclos4 = document.getElementById('btnAmeliorerLevelEnclos4')
  const btnAmeliorerClicEnclos4 = document.getElementById('btnAmeliorerClicEnclos4')
  const btnAmeliorerLevelEnclos5 = document.getElementById('btnAmeliorerLevelEnclos5')
  const btnAmeliorerClicEnclos5 = document.getElementById('btnAmeliorerClicEnclos5')

  isPosible(btnAmeliorerLevelEnclos1, 'Enclos1', 'level')
  isPosible(btnAmeliorerClicEnclos1, 'Enclos1', 'autoclic')

  isPosible(btnAmeliorerLevelEnclos2, 'Enclos2', 'level')
  isPosible(btnAmeliorerClicEnclos2, 'Enclos2', 'autoclic')
  lockCase(caseMenuEnclos2, '1', '2')

  isPosible(btnAmeliorerLevelEnclos3, 'Enclos3', 'level')
  isPosible(btnAmeliorerClicEnclos3, 'Enclos3', 'autoclic')
  lockCase(caseMenuEnclos3, '2', '3')

  isPosible(btnAmeliorerLevelEnclos4, 'Enclos4', 'level')
  isPosible(btnAmeliorerClicEnclos4, 'Enclos4', 'autoclic')
  lockCase(caseMenuEnclos4, '3', '4')

  isPosible(btnAmeliorerLevelEnclos5, 'Enclos5', 'level')
  isPosible(btnAmeliorerClicEnclos5, 'Enclos5', 'autoclic')
  lockCase(caseMenuEnclos5, '4', '5')

})