const MainCanvas = document.getElementById("MainCanvas");
const MainContext = MainCanvas.getContext("2d");
const CanvasWrapper = document.querySelector("#wrapper");
const GameArea = new CanvasManager(new Vector2(1280, 720), MainCanvas, CanvasWrapper);
const keyInput = new keyInputManager();
const Sound = new SoundManager();
GameArea.refresh();

let IsGameRunning = false;

const character = new CanvasComponents({
    ctx: MainContext,
    img: "assets/bird.png",
    size: new Vector2(80, 80),
    position: new Vector2(GameArea.x / 4, GameArea.y / 2),
    motion: new Vector2(0, 0),
    update: function () {
        if(IsGameRunning){
            //↓重力
            if (this.motion.y < 20) {
                this.motion.y += 2;
            }
            //↓動き
            this.position = this.position.add(this.motion);
            //↓回転
            this.rotate = this.motion.y * 2;
            //↓下ゲームオーバー
            if (this.position.y > GameArea.y + this.size.y / 2) {
                gameOver();
            }
            //↓上ゲームオーバー
            if (this.position.y < (.0) - this.size.y / 2) {
                gameOver();
            }
        }
    }
});
//↓スペースが下がっている
window.addEventListener("keydown", (e) => {
    //↓もしスペースが押される＆連続ではない＆ゲームが始まっている
    if (e.key === " " && e.repeat === false && IsGameRunning) {
        character.motion.y = -20;
        Sound.PlaySound("jump");
    }
});

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

function update() {
    
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
