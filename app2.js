var myGamePiece;
const myObstacles=[];
const myBridies=[];

let birdW=60;
let birdH=40;
let birdY;

let beckyH=55;
let beckyW=45;
let cactus_gap;
let cactus_height;
let canvas_height=400;
let canvas_width=600;
const cactus_width=45;
let fps=60;
let obstaclehit=false;
let showEndScreen=false;
let showStartScreen=true;
//keyboard setup
const SPACEBAR=32;
var keyboardMoveUp=false;

let ctx;
let score=100;
let lives=3;
const life=[];

const beckysIMG=["./assets/evil_dino.svg","./assets/dinosaur.svg","./assets/T_rex.svg"];



function startGame(){
       gameArea.start();
       
    
       becky=new imageBuilder(100,canvas_height-beckyH,beckyW,beckyH,beckysIMG[1]);
       
      //needs to move in drawEverythig if any changes need to happen


     window.onkeydown=keyDownHandler;//keyboard setup
    window.onkeyup=keyUpHandler;
    
}


var gameArea = {///////////the whole game area is in a object///////////////
    canvas:document.getElementById("test"),
   

    start:function(){
        
        this.canvas.width=canvas_width;
        this.canvas.height=canvas_height;
        this.canvas.style.backgroundImage="url(./assets/desert2.jpg)";
        this.context=this.canvas.getContext("2d");
        this.frameNo=0;
        this.interval=setInterval(function(){
            moveBecky();
            drawEverything();
        },1000/fps);
        document.body.addEventListener("touchstart",moveup);
        document.body.addEventListener("touchend",motion);
    },

    clear:function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop:function(){
        
        clearInterval(this.interval);
    }
}


function drawEverything(){//...................THE DRAW EVERYTHING FUNCTION>>>>>>>>>>>>>>>
    if(showStartScreen){
        gameArea.clear();
        becky.endScreen();
        return;
    }
    if(showEndScreen){
        gameArea.clear();
        becky.endScreen();
        return;
    }

    
    
    myObstacles.forEach(function(cactus,i){
        if(becky.crashWith(cactus)){///checking collsion with the cactus trees//////////////////////////
            console.log("hit");
            myObstacles.splice(i,2);//......using array splice method t delete that hit cactus +1 upcoming cactus
            i--;
            becky.reset()  ;   
        }
    })//checking collsion!!
        
        
    

    for(let i=0;i<myBridies.length;i++){//checking clash with the birds........................................!!!!
        if(becky.crashWith(myBridies[i])){
            console.log('hit_bird');
            myBridies.splice(i,2);
            i--;
            becky.reset();
        }
    }

    gameArea.clear();/////////...............calling the game clear function here...........................////////
    
    gameArea.frameNo+=1;
    if(gameArea.frameNo==1||everyinterval(150)){//creating obstacle array!!
        birdY=(getRndInteger(20,500)/5);
        cactus_gap=(getRndInteger(-500,300)/10);
        cactus_height=(getRndInteger(450,800)/10);
       // console.log(gameArea.canvas.width+cactus_gap);
        myObstacles.push(new imageBuilder(gameArea.canvas.width+cactus_gap,gameArea.canvas.height-cactus_height,cactus_width,cactus_height,"./assets/cactus.svg"));
        myBridies.push(new imageBuilder(gameArea.canvas.width+cactus_gap,70+birdY,birdW,birdH,"./assets/dino_bird2.svg"))
    }
    // for(let i=0;i<myObstacles.length;i++){//drawing obstacles!!
    //     myObstacles[i].x-=2;
    //     myObstacles[i].draw();      
    // }
    myObstacles.forEach(function(cactus){
               cactus.x-=2;
               cactus.draw();
    })
    myBridies.forEach(function(bird){
        bird.x-=3;
        bird.y+=.5;
        bird.draw();
    })
       
    
    for(let i=0;i<lives;i++){//couldnt replace forEach here,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
        life.push(new imageBuilder(10+(i*35),85,30,30,"./assets/life.svg"));
          life[i].draw();
    }

    becky.draw(); 
    becky.scoredraw();
    becky.livesDraw();
}


function moveBecky(){//..............will make becky dance here............................



    becky.newpos();
    becky.hitbottom();
}


class imageBuilder{//......................ECMA6 clss/object constructor...........
    constructor(x,y,width,height,color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.image = new Image();
        this.image.src = color;   
        this.speedX=0;
        this.speedY=0; 
        this.bounce=0.2; 
        this.gravity = 0;
        this.gravitySpeed = 0;  
    }
    draw(){
         ctx=gameArea.context;
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
    crashWith(otherobj){
        var myleft = this.x+5;
        var myright = this.x + (this.width-5);
        var mytop = this.y;
        var mybottom = this.y + (this.height-5);
        var otherleft = otherobj.x+5;
        var otherright = otherobj.x + (otherobj.width-5);
        var othertop = otherobj.y+5;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    newpos(){
        console.log(this.gravitySpeed);
        this.gravitySpeed += this.gravity;
        this.y +=this.gravitySpeed;
        
        if(this.y<=270){
            //console.log("exceeds");        
            return this.gravity=+.28;//.......the gravitional pull when he reaches maximum height..........!!!!!!!!!!
        // this.x+=this.speedX;         
        }    
    }
    hitbottom(){
        let rockbottom=gameArea.canvas.height-this.height;
        if(this.y>rockbottom){
            this.y=rockbottom;
            
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            keyboardMoveUp=true;
        }
    }
    scoredraw(){///score draw
            ctx = gameArea.context;
            ctx.font = "30px Arial";
            score=gameArea.frameNo;
            ctx.fillText("Score : "+score,10,50);
    } 
    livesDraw(){
        ctx = gameArea.context;
         ctx.font = "30px Arial";
         ctx.fillText("lives : "+lives,10,80);
         
    }
    reset(){
               console.log("reset called")
              this.y=180;
              lives--;
              if(lives<=0){
                showEndScreen=true;
               // gameArea.stop();
              }
              this.image.src=beckysIMG[1];
    }
    endScreen(){
        ctx=gameArea.context;
        gameArea.canvas.style.backgroundImage="url(./assets/desert2.jpg)";
        ctx.font="30px arial";
        ctx.fillText("Game Over||Your Score : " + score,100,150)
        
    }
}


function everyinterval(n) {
    return ((gameArea.frameNo / n) % 1 == 0) ?  true : false;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  function moveup(){
      if(keyboardMoveUp){
          console.log("up called")
          becky.gravitySpeed=-4;
        becky.gravity=-.10;
      keyboardMoveUp=false;
      }
      
  }
  function motion(){
     console.log('motion called');
      becky.gravity=.11;
  }

  //keyboard setup

  function keyDownHandler(e){
    switch (e.keyCode){
        // case KEYCODE_LEFT: keyboardMoveLeft=true;break;
        // case KEYCODE_RIGHT: keyboardMoveRight=true;break;
        case SPACEBAR:moveup();break;
    }
}

function keyUpHandler(e){
   switch(e.keyCode){//capital c is must camel case
         case SPACEBAR:motion();break;
   }
}
function mouseClick(){
    if(showEndScreen){
        becky.reset();
        lives=3;
        gameArea.frameNo=0;
        showEndScreen=false;
    }
    if(showStartScreen){
        becky.reset();
        
        lives=3;
        gameArea.frameNo=0;
        showStartScreen=false;
    }
}