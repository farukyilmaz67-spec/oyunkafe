async function getGames(){
const res=await fetch('games.json');
return await res.json();
}

function card(game){
return `<div class="card">
<img src="${game.thumb}">
<div class="card-content">
<h3>${game.title}</h3>
<p>${game.description}</p>
<a class="btn" href="oyun.html?id=${game.id}">Oyna</a>
</div>
</div>`;
}

async function loadHome(){
const wrap=document.getElementById('games');
if(!wrap) return;
const games=await getGames();
wrap.innerHTML=games.map(card).join('');
}

async function loadGame(){
const title=document.getElementById('game-title');
if(!title) return;

const params=new URLSearchParams(location.search);
const id=params.get('id');

const games=await getGames();
const game=games.find(g=>g.id===id);

if(!game) return;

title.textContent=game.title;
document.getElementById('game-description').textContent=game.description;
document.getElementById('game-frame').src=game.embed;
}

loadHome();
loadGame();
