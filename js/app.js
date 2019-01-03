let velocity = 80;
let nEnemy = 60;

//class character (Personagem) para instanciar jogador e inimigos
//posição eixo x, posição eixo y e caminho da imagem
class Character {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    //desenha as imagens
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//Resetar game.
function resetGame() {
    player = new Player(202, 405, 'images/char-boy.png');
    velocity = 80;
    allEnemies = inicializeEnemies();
}

// Classe de jogador (Player)
class Player extends Character {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.moveUpDown = 85.5; //distância para mover pra cima ou baixo
        this.moveLeftRight = 101; //distância para mover pra esquerda ou direita
        this.life = 2; //inicio com 3 vidas
        this.level = 1;
    }
    //Se o player chegar ao lago acrescenta um level
    update() {
        if (this.y === -22.5) {
            this.increaseLevel();
        }
    }
    //posiciona no início e
    //aumenta o nivel do game.
    increaseLevel() {
        this.y = 405;
        this.level++;

        let texto = document.getElementById("level");
        texto.innerHTML = `Level: ${this.level}`;

        if (this.level < 5) {
            velocity *= 1.9;
            //Adiciona no array de inimigos o novo inimigo
            allEnemies.push(new Enemy(-130, nEnemy, 'images/enemy-bug.png'));
            nEnemy += 60;
            
            if (nEnemy > 200) {
                nEnemy = 60;
            }
        } else {
            alert("Paranbéns você finalizou o desafio Frogger");
            resetGame();
        }
    }
 
    //capturar tecla 
    handleInput(direction) {
        switch (direction) {
            case 'left':
                if (this.x > 0) {
                    this.x -= this.moveLeftRight;
                }
                break;
            case 'up':
                this.y -= this.moveUpDown;
                break;
            case 'right':
                //404 é o limite direito (eixo x)
                if (this.x < 404) {
                    this.x += this.moveLeftRight;
                }
                break;
            case 'down':
                //404 é o limite inferior (eixo y)
                if (this.y < 404) {
                    this.y += this.moveUpDown;
                }
                break;
        }
      
    }
}

//Jogador
let player = new Player(202, 405, 'images/char-boy.png');

// Inimigos que nosso jogador deve evitar
class Enemy extends Character {
    constructor(x, y, sprite) {
        super(x, y, sprite); 
        this.speed = (Math.random() * velocity) + (velocity / 2); 
        //console.log(this.speed); 
    }

    //Verifica se houve colisão
    collision() {
        let widthLimit = 80; //limite distância largura do player
        let heightLimit = 50; //limite distância de altura do player
        
        if (((player.x + widthLimit) > this.x) &&
            (player.x < (this.x + widthLimit)) &&
            ((player.y + heightLimit) > this.y) &&
            (player.y < (this.y + heightLimit))) {
            
            //Reposiciona o player e diminui a life
            if (player.life > 0) {
                player.y = 405;
                player.life--;
                //alert(player.life);
                let texto = document.getElementById("life");
                texto.innerHTML = `Lifes: ${player.life + 1}`; //atualiza lifes
            } else {
                //novo Array
                allEnemies.map((enemy) => {
                    enemy.speed = 0;
                });

                alert('Suas vidas acabaram :(\nTente novamente!');
                let texto = document.getElementById("life");
                texto.innerHTML = 'Lifes: 3';
                texto = document.getElementById("level");
                texto.innerHTML = 'Level: 1';
                resetGame();
            }
        }
    }

     // Verifica a posição do inimigo.
    update(dt) {
        this.collision();
        this.x += this.speed * dt;
        if (this.x > ctx.canvas.width) {
            this.x = -101;
            this.speed = Math.random() * velocity + (velocity / 2);
        }
    }
}

//Inicializar inimigos.
function inicializeEnemies() {
    let bug1 = new Enemy(-75, 230, 'images/enemy-bug.png');
    let bug2 = new Enemy(-200, 150, 'images/enemy-bug.png');
    let bug3 = new Enemy(0, 60, 'images/enemy-bug.png');
    return [bug1, bug2, bug3];
}

//Array com todos inimigos
let allEnemies = inicializeEnemies();


// Isto reconhece cliques em teclas e envia as chaves para seu
// jogador. método handleInput(). Não é preciso mudar nada.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
