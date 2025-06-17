/////////////////////////////////////////////////////////// CONSTANTES ET VARIBALES ///////////////////////////////////////////////////////////


// CONSTANTES

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

const bonusCountDown = document.getElementById('bonusCountDown')

const imageIds = {
    Enclos1: "imgEnclos1",
    Enclos2: "imgEnclos2",
    Enclos3: "imgEnclos3",
    Enclos4: "imgEnclos4",
    Enclos5: "imgEnclos5"
}

// VARIABLES

let moneySeconde = 0
let money = 0;
let multiplicateurGainPassageNiveauEnclos = 2
let multiplicateurPrixPassageNiveauEnclos = 2

let listeEnclos = ["ZEBRE", "HYENNE", "GIRAFE", "ELEPHANT", "LION"]

let bonusInfos = null

//Level, combien gagne par clic, cout passage niveau suivant, gain au niveau 1
let level = {
  Enclos1: [1, 1, 200, 1],
  Enclos2: [0, 0, 2_000, 10],
  Enclos3: [0, 0, 20_000, 100],
  Enclos4: [0, 0, 200_000, 1_000],
  Enclos5: [0, 0, 2_000_000, 10_000]
}

let multiplicateurGainPassageNiveauAutoClick = 1.5
let multiplicateurPrixPassageNiveauAutoClick = 2

// Level, cb gagne par seconde, cout passage niveau suivant, gain au niveau 1, gain totale par seconde
let levelAutoClick = {
  Enclos1: [0, 0, 50, 1, 0],
  Enclos2: [0, 0, 500, 10, 0],
  Enclos3: [0, 0, 5_000, 100, 0],
  Enclos4: [0, 0, 50_000, 1_000, 0],
  Enclos5: [0, 0, 500_000, 10_000, 0]
}


/////////////////////////////////////////////////////////// FONCTIONS ///////////////////////////////////////////////////////////


// Fonction qui va sauvegarder les stats de la partie en cours dans les cookies pour pouvoir reprendre la partie si on refresh la page
function saveGameToCookies() {
  const data = {
    money,
    moneySeconde,
    level,
    levelAutoClick
  }

  const d = new Date()
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000))
  const expires = "expires=" + d.toUTCString()

  document.cookie = "zooSave=" + encodeURIComponent(JSON.stringify(data)) + ";" + expires + ";path=/"
}

// Fonction qui va charger les stats sauvegarder dans les cookies et les appliquer au jeu actuel pour reprendre la partie
function loadGameFromCookies() {
  const name = "zooSave="
  const cookie = decodeURIComponent(document.cookie).split(';')

  for (let i = 0; i < cookie.length; i++) {
    let c = cookie[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      const jsonData = c.substring(name.length, c.length)
      const data = JSON.parse(jsonData)

      money = data.money
      moneySeconde = data.moneySeconde
      level = data.level
      levelAutoClick = data.levelAutoClick

      upgradeImage('Enclos1', 'Zebre')
      upgradeImage('Enclos2', 'Hyennes')
      upgradeImage('Enclos3', 'Girafe')
      upgradeImage('Enclos4', 'Elephant')
      upgradeImage('Enclos5', 'Lion')

      return;
    }
  }
}

// Fonction qui va reset les stats du jeu pour recommencer à 0
function resetGame() {
  if (confirm("Es-tu sûr de vouloir réinitialiser le jeu ?")) {
    money = 0
    moneySeconde = 0

    level = {
      Enclos1: [1, 1, 200, 1],
      Enclos2: [0, 0, 2_000, 10],
      Enclos3: [0, 0, 20_000, 100],
      Enclos4: [0, 0, 200_000, 1_000],
      Enclos5: [0, 0, 2_000_000, 10_000]
    }

    levelAutoClick = {
      Enclos1: [0, 0, 50, 1, 0],
      Enclos2: [0, 0, 500, 10, 0],
      Enclos3: [0, 0, 5_000, 100, 0],
      Enclos4: [0, 0, 50_000, 1_000, 0],
      Enclos5: [0, 0, 500_000, 10_000, 0]
    };

    upgradeImage('Enclos1', 'Zebre')
    upgradeImage('Enclos2', 'Hyennes')
    upgradeImage('Enclos3', 'Girafe')
    upgradeImage('Enclos4', 'Elephant')
    upgradeImage('Enclos5', 'Lion')

    document.cookie = "zooSave=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    updateDisplay()
  }
}

// Fonction qui va charger un element pour l'adapter a la sauvegarde
function loadElement(element, enclos, text, type) {
  btnArgentSeconde.textContent = convertirArgent(moneySeconde) + "$/s";

  if (type == 'level') {
    element.textContent = convertirArgent(level[enclos][2]) + '$';
    document.getElementById(text).textContent = 'NIVEAU ' + level[enclos][0];
    document.getElementById('nbArgentClic' + enclos).textContent = convertirArgent(level[enclos][1]) + "$/clic";
  } else if (type == 'autoclic') {
    element.textContent = convertirArgent(moneySeconde) + '$/s';
    document.getElementById(text).textContent = '$/S | NIVEAU ' + (levelAutoClick[enclos][0]);
    document.getElementById('nbArgenSeconde' + enclos).textContent = convertirArgent(levelAutoClick[enclos][4]) + "$/s";
  }

  requestAnimationFrame(() => loadElement(element, enclos, text, type))
}

//Fonction qui va convertir la somme d'argent passé en abréviation
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

//Fonction pour afficher ou non le menu
function toggleMenu() {
    menu.classList.toggle("show");
    btnArgentEntier.classList.toggle("show");
    btnArgentSecondeEniter.classList.toggle("show");
}

//Fonction pour faire disparaitre le tuto
function hideTuto(btn) {
  btn.style.display = 'none'
  persoTuto.style.display = 'none'
}

//Fonction pour mettre a jour l'image de l'enclos en coordance avec le niveau
function upgradeImage(enclos, animal) {
  if (level[enclos][0] <= 5) {
    const enclosImg = document.getElementById(imageIds[enclos])
    enclosImg.src = './assets/' + animal + '/enclosLevel' + level[enclos][0] + '.png'
  }
}

//Fonction qui va en fonction du type d'amelioration, changer le gain, le prochain prix, et l'affichage du gain et aussi appeler un changement de l'image
function upgrade(type, enclos, button, text, animal) {

  // Si c'est une amelioration du gain par clic
  if (type == 'level' && money >= level[enclos][2]) {
    // Changement des stats
    level[enclos][0] = level[enclos][0] + 1
    if (level[enclos][0] == 1) {
      level[enclos][1] = level[enclos][3]
    }
    level[enclos][1] = Math.round(level[enclos][1] * multiplicateurGainPassageNiveauEnclos)
    money -= level[enclos][2]
    level[enclos][2] *= multiplicateurPrixPassageNiveauEnclos

    // Changer l'image
    upgradeImage(enclos, animal)

    // Changement des interfaces
    btnArgent.textContent = convertirArgent(money) + "$"
    button.textContent = convertirArgent(level[enclos][2]) + '$'
    document.getElementById(text).textContent = 'NIVEAU ' + level[enclos][0]
    document.getElementById('nbArgentClic' + enclos).textContent = convertirArgent(level[enclos][1]) + "$/clic"


    // Si c'est une amelioration du gain par seconde
  } else if (type == 'autoclic' && money >= levelAutoClick[enclos][2]) {
    // Pour ameliorer le clic par seconde l'enclo doit d'abord etre debloquer
    if (level[enclos][0] < 1) {
      return
    }
    // Changement des stats
    levelAutoClick[enclos][0] += 1
    if (levelAutoClick[enclos][0] == 1) {
      levelAutoClick[enclos][1] = levelAutoClick[enclos][3]
    }
    levelAutoClick[enclos][1] = Math.round(levelAutoClick[enclos][1] * multiplicateurGainPassageNiveauAutoClick)
    levelAutoClick[enclos][4] += levelAutoClick[enclos][1]
    money -= levelAutoClick[enclos][2]

    levelAutoClick[enclos][2] *= multiplicateurPrixPassageNiveauAutoClick
    button.textContent = convertirArgent(levelAutoClick[enclos][2]) + '$'

    moneySeconde += levelAutoClick[enclos][1]

    // Changement des interfaces
    btnArgent.textContent = convertirArgent(money) + "$"
    btnArgentSeconde.textContent = convertirArgent(moneySeconde) + '$/s'
    document.getElementById(text).textContent = '$/S | NIVEAU ' + (levelAutoClick[enclos][0])
    document.getElementById('nbArgenSeconde' + enclos).textContent = convertirArgent(levelAutoClick[enclos][4]) + "$/s"
  }
}

// Fonction qui va ajouter de l'argent a chaque clic et faire l'animation
function moreMoney(enclos, event) {
    const gain = level[enclos][1];
    money += gain;
    btnArgent.textContent = convertirArgent(money) + "$";

    if (event) {
        spawnPiece(event.clientX, event.clientY);
    }
}

// Fonction qui chaque seconde va ajouter de l'argent en fonction du gain generer par les enclos
function autoClick() {
    money = money + moneySeconde
    btnArgent.textContent = convertirArgent(money) + "$" 
}

// Fonction qui verifie si on peut debloquer une amelioration
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

// Fonction qui verifie si on peut debloquer un enclos dans le menu
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

// Fonction utiliser dans l'animation qui fais spawn une piece quand on clic sur en enclos
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

// Fonction qui fais apparaitre une pièce pour avoir un bonus
function spawnBonus() {
  let left = (Math.random() * (90 - 10) + 10)
  let top = (Math.random() * (80 - 10) + 10)
  coinBonus.style.display = 'block';
  coinBonus.style.left = left + '%'
  coinBonus.style.top = top + '%'
}

// Fonction qui lance le popup du bonus une fois que on a cliquer sur la pièce bonus
function generateBonus() {
  // Gere les elements graphiques
  coinBonus.style.display = 'none'
  popupBonus.classList.add("showBonus")
  bonusCountDown.style.display = 'block'

  const dureeBonus = (Math.random() * (60 - 20) + 20) * 1000
  const multiplicateurBonus = Math.floor(Math.random() * (5 - 2 + 1)) + 2

  let enclo;
  do {
    enclo = 'Enclos' + (Math.floor(Math.random() * 5) + 1)
  } while (level[enclo][0] == 0)

  txtBonus.textContent = "CHAQUE CLIC SUR L'ENCLO " + listeEnclos[enclo[6] - 1] + " EST MULTIPLIÉ PAR " + multiplicateurBonus + " PENDANT " + Math.round(dureeBonus / 1000) + " SECONDES"

  bonusInfos = {
    enclo,
    dureeBonus,
    multiplicateurBonus,
    ancienGain: level[enclo][1],
  }
}

// Animation qui pendant un bonus fait apparaitre des pieces du haut vers la bas
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

// Ecouteur d'evenement pour fermer le menu popup et lancer le bonus
document.getElementById("btnCloseMenuBonus").addEventListener("click", () => {
  if (!bonusInfos) return

  popupBonus.classList.remove("showBonus")

  const { enclo, dureeBonus, multiplicateurBonus, ancienGain} = bonusInfos
  level[enclo][1] *= multiplicateurBonus

  let tempsRestant = Math.floor(dureeBonus / 1000)
  bonusCountDown.style.display = 'block'
  menu.style.display = 'none'
  btnMenu.style.pointerEvents = 'none'

  let animationBonus = setInterval(animationCoinTombe, 200)
  const countdownInterval = setInterval(() => {
  const minutes = Math.floor(tempsRestant / 60)
  const secondes = tempsRestant % 60
  bonusCountDown.textContent = `Bonus : ${minutes}:${secondes < 10 ? '0' + secondes : secondes}`
  tempsRestant--

  if (tempsRestant < 0) {
    clearInterval(countdownInterval)
    bonusCountDown.style.display = 'none'
    clearInterval(animationBonus)
    btnMenu.style.pointerEvents = 'auto'
    menu.style.display = 'block'

    level[enclo][1] = ancienGain
    bonusInfos = null

    const min = 2 * 60 * 1000
    const max = 5 * 60 * 1000

    setTimeout(spawnBonus, Math.floor(Math.random() * (max - min + 1)) + min)
  }
  }, 1000)
})

// Fonction pour fairee apparaitre le tuto
function tuto() {
  persoTuto.style.display = 'block'
}

// Sauvegarder la partie toute les secondes
setInterval(saveGameToCookies, 1000);

// Au chargement de window
window.onload = function () {
  // Charger la sauvegarde
  loadGameFromCookies();
  // Faire apparaitre le premier bonus
  setTimeout(spawnBonus, 1 * 60 * 1000);
  // Argent gagner chaque seconde
  setInterval(autoClick, 1000)
  // Afficher tuto
  persoTuto.classList.toggle('tuto')

  // Chargement des elements graphiques
  loadElement(document.getElementById('btnAmeliorerLevelEnclos1'), 'Enclos1', 'niveauEnclos1', 'level')
  loadElement(document.getElementById('btnAmeliorerLevelEnclos2'), 'Enclos2', 'niveauEnclos2', 'level')
  loadElement(document.getElementById('btnAmeliorerLevelEnclos3'), 'Enclos3', 'niveauEnclos3', 'level')
  loadElement(document.getElementById('btnAmeliorerLevelEnclos4'), 'Enclos4', 'niveauEnclos4', 'level')
  loadElement(document.getElementById('btnAmeliorerLevelEnclos5'), 'Enclos5', 'niveauEnclos5', 'level')

  loadElement(document.getElementById('btnAmeliorerClicEnclos1'), 'Enclos1', 'niveauClicEnclos1', 'autoclic')
  loadElement(document.getElementById('btnAmeliorerClicEnclos2'), 'Enclos2', 'niveauClicEnclos2', 'autoclic')
  loadElement(document.getElementById('btnAmeliorerClicEnclos3'), 'Enclos3', 'niveauClicEnclos3', 'autoclic')
  loadElement(document.getElementById('btnAmeliorerClicEnclos4'), 'Enclos4', 'niveauClicEnclos4', 'autoclic')
  loadElement(document.getElementById('btnAmeliorerClicEnclos5'), 'Enclos5', 'niveauClicEnclos5', 'autoclic')
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