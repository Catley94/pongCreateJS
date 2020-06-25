//Setup
var canvas;
var stage;
var background;
var main;
var startB;
var creditsB;
var credits;
var mainPlayer;
var ball;
var npcPlayer;
var win;
var lose;
var playerScore;
var npcScore;
var npcSpeed = 6; //Higher number = higher difficulty;

//Ball speed
var xSpeed = 5;
var ySpeed = 5;

var ticker = new Object();

//preloader variable
var preloader;

var titleView = new createjs.Container();
window.addEventListener('DOMContentLoaded', initiation, false);

function initiation() {
    /* Link Canvas */
     
    canvas = document.getElementById('pongGameStage');
    stage = new createjs.Stage(canvas);
    // canvas.addEventListener('mousemove', (e) => console.log(e))
    stage.mouseEventsEnabled = true;
     
     
    /* Set The Flash Plugin for browsers that don't support SoundJS */
    // SoundJS.FlashPlugin.BASE_PATH = "assets/";
    // if (!SoundJS.checkPlugin(true)) {
    //   alert("Error!");
    //   return;
    // }
 

    preloader = new createjs.LoadQueue();
    preloader.installPlugin(createjs.Sound);
    // preloader.installPlugin(createjs.Image);
    //sound files - issues with loading image files via loadManifest
    preloader.loadManifest("./manifest.json");
    //image files
    preloader.loadFile({id:"background", src:"/assets/bg.png"});
    preloader.loadFile({id:"startB", src:"assets/startB.png"});
    preloader.loadFile({id:"main", src:"/assets/main.png"});
    preloader.loadFile({id:"creditsB", src:"/assets/creditsB.png"});
    preloader.loadFile({id:"credits", src:"/assets/credits.png"});
    preloader.loadFile({id:"npcPlayer", src:"/assets/paddle.png"});
    preloader.loadFile({id:"mainPlayer", src:"/assets/paddle.png"});
    preloader.loadFile({id:"ball", src:"/assets/ball.png"});
    preloader.loadFile({id:"win", src:"/assets/win.png"});
    preloader.loadFile({id:"lose", src:"/assets/lose.png"});

    preloader.on("progress", handleProgress, this);
    preloader.on("fileload", handleFileLoad, this);
    // preloader.on("complete", handleComplete, this);
    preloader.addEventListener("complete", handleComplete);
    
    
    
 
    /* Ticker */
     
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);

}

function handleProgress(event) {
    //use event.loaded to get the percentage of the loading
    // console.log("handling progress " + event.progress * 100+"%")
    
}

function handleFileLoad(event) {
    //triggered when an individual file completes loading
    // console.log("handling file load " + event.type)
    // console.log(event.item.type)
    var item = event.item;
    var type = item.type

    if(type == createjs.Types.IMAGE) {
        // image loaded
        
        var img = new Image();
        img.src = item.src;
        // img.onload = handleComplete();
        window[item.id] = new createjs.Bitmap(img);
        
    }
}

function handleComplete(event) {
    //triggered when all loading is complete
    // console.log("handled progress")

    
    if(event !== undefined) {
        // startB = document.getElementById("startB")
        // console.log(startB)
        addTitleView();
    }
    
}

function addTitleView() {
    startB.x = 240 - 31.5;
    startB.y = 160;
    startB.name = 'startB';
     
    creditsB.x = 241 - 42;
    creditsB.y = 200;
     
    titleView.addChild(main, startB, creditsB);
    stage.addChild(background, titleView);
    stage.update();
     
    // Button Listeners
     
    // startB.onPress = tweenTitleView;
    // creditsB.onPress = showCredits;
    startB.addEventListener('click', tweenTitleView);
    creditsB.addEventListener('click', showCredits);
    
}

function showCredits()
{
    // Show Credits
         
    credits.x = 480;
         
    stage.addChild(credits);
    stage.update();
    createjs.Tween.get(credits).to({x:0}, 300);
    // credits.onPress = hideCredits;
    credits.addEventListener('click', hideCredits);
}
 
// Hide Credits
 
function hideCredits(e)
{
    createjs.Tween.get(credits).to({x:480}, 300).call(rmvCredits);
}
 
// Remove Credits
 
function rmvCredits()
{
    stage.removeChild(credits);
}
 
// Tween Title View
 
function tweenTitleView()
{       
    // Start Game
    // console.log("started!")
    createjs.Tween.get(titleView).to({y:-320}, 300).call(addGameView);
}

function addGameView()
{
    // Destroy Menu & Credits screen
     
    stage.removeChild(titleView);
    titleView = null;
    credits = null;
     
    // Add Game View
     
    mainPlayer.x = 2;
    mainPlayer.y = 160 - 37.5;
    npcPlayer.x = 480 - 25;
    npcPlayer.y = 160 - 37.5;
    ball.x = 240 - 15;
    ball.y = 160 - 15;
    ball.width = 100;
     
    // Score
     
    playerScore = new createjs.Text('0', 'bold 20px Arial', '#A3FF24');
    playerScore.x = 211;
    playerScore.y = 20;
     
    npcScore = new createjs.Text('0', 'bold 20px Arial', '#A3FF24');
    npcScore.x = 262;
    npcScore.y = 20;
     
    stage.addChild(playerScore, npcScore, mainPlayer, npcPlayer, ball);
    stage.update();
     
    // Start Listener 
    // background.onPress = startGame;
    background.addEventListener('click', startGame);

}

function startGame(event)
{
    // background.onPress = null;
    background.removeEventListener('click', startGame);
    // stage.onMouseMove = movePaddle;
    canvas.addEventListener('mousemove', movePaddle);
     
    ticker = createjs.Ticker;
    ticker.addEventListener('tick', update);
    
}

function movePaddle(event)
{
    // Mouse Movement
    // console.log(event);
    mainPlayer.y = event.y;
}
 
/* Reset */
 
function reset()
{
    ball.x = 240 - 15;
    ball.y = 160 - 15;
    mainPlayer.y = 160 - 37.5;
    npcPlayer.y = 160 - 37.5;
     
    // stage.onMouseMove = null;
    stage.removeEventListener('mousemove', movePaddle);
    ticker.removeEventListener('tick', update);
    // Ticker.removeListener(tkr);
    background.addEventListener('click', startGame);

}

function alert(event)
{
    ticker.removeEventListener('tick', update);
    stage.removeEventListener('mousemove', movePaddle);
    background.removeEventListener('click', startGame);
     
    if(event == 'win')
    {
        win.x = 140;
        win.y = -90;
     
        stage.addChild(win);
        createjs.Tween.get(win).to({y: 115}, 300);
    }
    else
    {
        lose.x = 140;
        lose.y = -90;
     
        stage.addChild(lose);
        createjs.Tween.get(lose).to({y: 115}, 300);
    }
}

function update()
{   
    // Ball Movement 
 
    ball.x = ball.x + xSpeed;
    ball.y = ball.y + ySpeed;
     
    // Cpu Movement
     
    if(npcPlayer.y < ball.y) {
        npcPlayer.y = npcPlayer.y + 4;
    }
    else if(npcPlayer.y > ball.y) {
        npcPlayer.y = npcPlayer.y - 4;
    }
     
    // Wall Collision 
 
    if((ball.y) < 0) { ySpeed = -ySpeed; createjs.Sound.play('wall'); };//Up
    if((ball.y + (30)) > 320) { ySpeed = -ySpeed; createjs.Sound.play('wall');};//down
     
    /* CPU Score */
     
    if((ball.x) < 0)
    {
        xSpeed = -xSpeed;
        npcScore.text = parseInt(npcScore.text + 1);
        reset();
        createjs.Sound.play('enemyScore');
    }
     
    /* Player Score */
     
    if((ball.x + (30)) > 480)
    {
        xSpeed = -xSpeed;
        playerScore.text = parseInt(playerScore.text + 1);
        reset();
        createjs.Sound.play('playerScore');
    }
     
    /* Cpu collision */
     
    if(ball.x + 30 > npcPlayer.x && ball.x + 30 < npcPlayer.x + 22 && ball.y >= npcPlayer.y && ball.y < npcPlayer.y + 75)
    {
        xSpeed *= -1;
        createjs.Sound.play('hit');
    }
     
    /* Player collision */
     
    if(ball.x <= mainPlayer.x + 22 && ball.x > mainPlayer.x && ball.y >= mainPlayer.y && ball.y < mainPlayer.y + 75)
    {
        console.log("player collision with ball")
        xSpeed *= -1;
        createjs.Sound.play('hit');
    }
     
    /* Stop Paddle from going out of canvas */
     
    if(mainPlayer.y >= 249)
    {
        mainPlayer.y = 249;
    }
     
    /* Check for Win */
     
    if(playerScore.text == '10')
    {
        alert('win');
    }
     
    /* Check for Game Over */
     
    if(npcScore.text == '10')
    {
        alert('lose');
    }
}