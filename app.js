//Setup
var canvas;
var stage;
var background;
var mainBackground;
var startButton;
var creditsButton;
var credits;
var mainPlayer;
var ball;
var npcPlayer;
var winPopUp;
var losePopUp;
var playerScore;
var npcScore;
var npcSpeed = 6; //Higher number = higher difficulty;
//Ball speed
var xSpeed = 5;
var ySpeed = 5;

var ticker;

//preloader
var preloader;
var manifest;
var stringifiedManifest;
var totalLoaded = 0;

var titleView = new createjs.Container();

window.addEventListener('DOMContentLoaded', initiation, false);

//onload function
function initiation() {

    canvas = document.getElementById('pongGameStage');
    stage = new createjs.Stage(canvas);
    stage.mouseEventsEnabled = true;
    //May not work as not specifically imported flashplayer
    // createjs.SoundJS.FlashPlugin.BASE_PATH = "assets/";
    // if(!SoundJS.checkPlugin(true)) {
    //     alert("Error! cannot find SoundJS FlashPlugin");
    //     return;
    // }

    manifest = [
        {src:"./assets/bg.png", id:"background"},
        {src:"./assets/main.png", id:"mainBackground"},
        {src:"./assets/startB.png", id:"startButton"},
        {src:"./assets/creditsB.png", id:"creditsButton"},
        {src:"./assets/credits.png", id:"credits"},
        {src:"./assets/paddle.png", id:"npcPlayer"},
        {src:"./assets/paddle.png", id:"mainPlayer"},
        {src:"./assets/ball.png", id:"ball"},
        {src:"./assets/win.png", id:"win"},
        {src:"./assets/lose.png", id:"lose"},
        {src:"./assets/playerScore.mp3", id:"playerScore"},
        {src:"./assets/enemyScore.mp3", id:"enemyScore"},
        {src:"./assets/hit.mp3", id:"hit"},
        {src:"./assets/wall.mp3", id:"wall"}
    ]
    stringifiedManifest = JSON.stringify(manifest);
    //2 hours are up.... was about to loop through and stringify everything to work as a JSON OBJ to pass it through createjs.ManifestLoader under LoadQueue()/Preloader
    for(var i = 0; i<manifest.length;i++) {
        
    }
    //Preloader / loadQueue
    preloader = new createjs.LoadQueue();
    preloader.installPlugin(createjs.Sound);
    preloader.onProgress = handleProgress;
    preloader.onComplete = handleComplete;
    preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(manifest);
    //Ticker info ---- FIX
    ticker = createjs.Ticker;
    ticker.framerate = 30;   
    // stage.addChild(Ticker);

}

function handleProgress() {
    console.log('handing progress')
}

function handleComplete() {
    console.log("completed handling")
}

function handleFileLoad(e) {
    console.log('handing file load')
    switch(e.type) {
        case PreloadJS.IMAGE:
            var img = new Image();
            img.src = event.src;
            img.onload = handleLoadComplete;
            window[event.id] = new Bitmap(img);
            break;
        
        case PreloadJS.SOUND:
            handleLoadComplete;
            break;
    }
    console.log('handled file load')
}

function handleLoadComplete(e) {

   totalLoaded++;

   if( manifest.length == totalLoaded ) {
       addTitleView();
   }

}

function addTitleView() {
    startButton.x = 240 - 31.5;
    startButton.y = 160;
    startButton.name = "startButton";

    creditsButton.x = 241 - 42;
    creditsButton.y = 200;

    titleView.addChild(mainBackground, startButton, creditsButton);
    stage.addChild(background, titleView);
    stage.update();

    //event listeners instead of original tutorial option
    startButton.addEventListener('click', tweenTitleView);
    creditsButton.addEventListener('click', tweenTitleView);

    // below used in original tutorial
    // startButton.onPress = tweenTitleView;
    // creditsButton.``
}

function showCredits() {
    credits.x = 480;

    stage.addChild(credits);
    stage.update();
    Tween.get(credits).to({x:0}, 300);
    credits.addEventListener('click', hideCredits);
    // credits.onPress = hideCredits;

}

function hideCredits(e) {
    Tween.get(credits).to({x:480}, 300).call(rmvCredits);
}

function rmvCredits() {
    stage.removeChild(credits);
}

function tweenTitleView() {
    Tween.get(titleView).to({y:-320}, 300).call(addGameView);
}

function addGameView() {
    stage.removeChild(titleView);
    titleView = null;
    credits = null;

    //Setup
    mainPlayer.x = 2;
    mainPlayer.y = 160 - 37.5;
    npcPlayer.x = 480.25;
    npcPlayer.y = 160 - 37.5;
    ball.x = 240 - 15;
    ball.y = 160 - 15;

    //Score
    playerScore = new Text('0', 'bold 20px Arial', '#A3FF24');
    playerScore.x = 211;
    playerScore.y = 20;

    npcScore = new Text('0', 'bold 20px Arial', '#A3FF24');
    npcScore.x = 262;
    npcScore.y = 20;

    stage.addChild(playerScore, npcScore, mainPlayer, npcPlayer, ball);
    stage.update();

    background.addEventListener('click', startGame);
    // background.onPress = startGame;

}

function startGame(e) {
    background.removeEventListener('click', startGame);
    // background.onPress = null;

    stage.addEventListener('mousemove', movePaddle);

    ticker.addEventListener('tick', handleTick, false)

}

function handleTick() {
    console.log("tick")
    update();
}

function movePaddle(e) {
    console.log("mouse movement:" + e)
    mainPlayer.y = e.stageY;
}

function reset() {
    ball.x = 240 - 15;
    ball.y = 160 - 15;
    mainPlayer.y = 160 - 37.5;
    npcPlayer.y = 160 - 37.5;

    stage.addEventListener('mousemove', null);
    ticker.removeEventListener('tick', handleTick, false);
    background.addEventListener('click', startGame);
}

function alert(e) {
    ticker.removeEventListener('tick', handleTick, false);
    stage.removeEventListener('mousemove', null);
    background.removeEventListener('click', startGame);
    if(e == 'win') {
        win.x = 140;
        win.y = -90;
        stage.addChild(win);
        Tween.get(win).to({y: 115}, 300);
    } else {
        lose.x = 140;
        lose.y = -90;
        stage.addChild(lose);
        Tween.get(lose).to({y: 115}, 300);
    }
}

function update() {

    //ball movement
    ball.x = ball.x + xSpeed;
    ball.y = ball.y + ySpeed;

    //npc movement

    if(npcPlayer.y < ball.y) {
        npcPlayer.y = npcPlayer + 4;
    } else if(npcPlayer.y > ball.y) {
        cpu.y = cpu.y - 4;
    }
    //if ball.y is less than 0, invert yspeed and play sound
    if( (ball.y) < 0 ) { 
        ySpeed = -ySpeed; SoundJS.play('wall'); 
    };
    //if ball.y is more than canvas height, invert yspeed and play sound
    if( (ball.y + (30)) > 320 ) { 
        ySpeed = -ySpeed; SoundJS.play('wall');
    };

    //NPC Score
     
    if((ball.x) < 0)
    {
        xSpeed = -xSpeed;
        npcScore.text = parseInt(npcScore.text + 1);
        reset();
        createjs.Sound.play('enemyScore');
    }

    //mainPlayer score
    if((ball.x + (30)) > 480)
    {
        xSpeed = -xSpeed;
        playerScore.text = parseInt(playerScore.text + 1);
        reset();
        createjs.Sound.play('playerScore');
    }

    //npc collision 

}