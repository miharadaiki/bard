const MainCanvas = document.getElementById("MainCanvas");
const MainContext = MainCanvas.getContext("2d");
const CanvasWrapper = document.querySelector("#wrapper");
const GameArea = new CanvasManager(new Vector2(1280, 720), MainCanvas, CanvasWrapper);
const keyInput = new keyInputManager();
const Sound = new SoundManager();
GameArea.refresh();

let IsGameRunning = false;

Sound.LoadSound("click", "assets/click.mp3");
Sound.LoadSound("hit", "assets/hit.mp3");
function gameStart() {
    Sound.PlaySound("click");
    document.querySelector("#menu").style.display = "none";
    document.querySelector("#game").style.display = "block";
    IsGameRunning = true;
}

function gameOver() {
    document.querySelector("#gameEnd").style.display = "block";
    IsGameRunning = false;
}

function backMenu() {
    Sound.PlaySound("click");
    document.querySelector("#menu").style.display = "block";
    document.querySelector("#game").style.display = "none";
    document.querySelector("#gameEnd").style.display = "none";
}
const piperate = 50; //パイプの間隔 [tick]
const pipeheight = 250; //パイプの隙間 [px]
const pipespeed = 10; //パイプの速度 [px/tick]
const piperandomize = 300; //前回の隙間の位置からのランダムなズレ [px]
const pipegaprange = 400; //隙間の発生する範囲 [px]
let rate = 0;
let lastpipepos = GameArea.y / 2;
let pipes = [];
function update() {
    if (IsGameRunning) {
        if (rate % piperate === 0) {
            let center = Math.min(
                Math.max(
                    GameArea.y / 2 - pipegaprange / 2,
                    Math.round(lastpipepos + (Math.random() - 0.5) * piperandomize)
                ),
                GameArea.y / 2 + pipegaprange / 2
            );    
            lastpipepos = center;
            pipes.push(
                new CanvasComponents({
                    ctx: MainContext,
                    img: "assets/pipe_top.png",
                    size: new Vector2(100, 400),
                    position: new Vector2(GameArea.x, center - pipeheight / 2 - 200),
                    update: function () {
                        this.position.x -= pipespeed;

                        if(
                            (character.position.x > this.position.x - this.size.x / 2 - character.size.x / 2 &&
                                character.position.x < this.position.x + this.size.x / 2 + character.size.x / 2 &&
                                character.position.y > this.position.y - this.size.y / 2 &&
                                character.position.y < this.position.y + this.size.y / 2) ||

                            (character.position.x > this.position.x - this.size.x / 2 &&
                                character.position.x < this.position.x + this.size.x / 2 &&
                                character.position.y > this.position.y - this.size.y / 2 - character.size.y / 2 &&
                                character.position.y < this.position.y + this.size.y / 2 + character.size.y / 2)  
                        ) {
                            gameOver();
                        }    
                        if (this.position.x < -this.size.x / 2) {
                            pipes.splice(pipes.indexOf(this), 1);
                        }  
                    }
                })
            ); 
            pipes.push(
                new CanvasComponents({
                    ctx: MainContext,
                    img: "assets/pipe_bottom.png",
                    size: new Vector2(100, 400),
                    position: new Vector2(GameArea.x, center + pipeheight / 2 + 200),
                    motion: new Vector2(-pipespeed, 0),
                    update: function () {
                        this.position.x -= pipespeed;
                
                               
                            
            }
    }    
        
        

}

//ゲームループの定義・開始
const GameLoop = new GameLoopManager(() => {
    MainContext.clearRect(0, 0, GameArea.x, GameArea.y);
    CanvasComponents.components.forEach((component) => {
        component.update();
        component.render();
    });
    update();
}, 30);
GameLoop.start();
