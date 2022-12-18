import BallesAnime from "./ball.js";
import Murs from "./obstacles.js";
import * as col from "./collisions.js";
import Tanks from "./ennemis.js";

let level=1;
let canvas, ctx;
let balles=["","","","",""];
let murs=[];
let tanks=[];
let tank_player = {
    x: 50,
    y: 50,
    width: 70,
    height: 50,
    vitesse_r: 1,
    vitesse :1,
    vx:0,
    vy:0,
    facing:180,
    ang:0,
    nb_balles:0,
    canon:{
        x:85,
        y:75,
        width:60,
        height:10,
        ang:0
    },
    draw: function (ctx) {
        // bonne pratique : quand on dessine, on sauvegarde le contexte
        ctx.save();
        ctx.fillStyle = "green";
        ctx.translate(this.x+this.width/2, this.y+this.height/2);
        ctx.rotate(this.ang* Math.PI /180);
        ctx.fillRect(0-(this.width/2), 0-(this.height/2), this.width, this.height);
        ctx.rotate(0);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(this.canon.x, this.canon.y);
        ctx.rotate(this.canon.ang* Math.PI /180);
        ctx.beginPath();
        ctx.arc(0,0, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-5,-5,this.canon.width,this.canon.height);


        ctx.fillStyle = "darkgreen";
        ctx.beginPath();
        ctx.arc(0,0, 19, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-5,-4,this.canon.width-2,this.canon.height-2);

        ctx.restore();
    },
    update: function () {
        if ((this.x)<0){
            this.x=0
            this.canon.x=35
        }
        else if((this.x+this.width)>canvas.width){
            this.x=canvas.width-this.width
            this.canon.x=canvas.width-35
        } 
        else{
            this.x+=this.vx
            this.canon.x+=this.vx
        }
        if ((this.y)<0){
            this.y=0
            this.canon.y=25
        }
        else if((this.y+this.height)>canvas.height){
            this.y=canvas.height-this.height
            this.canon.y=canvas.height-25
        } 
        else{
            this.y+=this.vy
            this.canon.y+=this.vy
        }

        if (this.facing>this.ang){
            this.ang += this.vitesse_r;
        }
        if (this.facing<this.ang){
            this.ang -= this.vitesse_r;
        }
    },
    shoot:function(){
        if (this.nb_balles<5){
            balles[this.nb_balles]=new BallesAnime(canvas.width,canvas.height,2,this.canon.x,this.canon.y,this.canon.ang* Math.PI /180,this.canon.width,this.nb_balles)
            this.nb_balles++
        }
    },
    avoid_murs(par){
        if (par==="up"){
            this.y+=5;
            this.canon.y+=5;
        }
        if (par==="down"){
            this.y-=5;
            this.canon.y-=5;
        }
        if (par==="left"){
            this.x+=5;
            this.canon.x+=5;
        }
        if (par==="right"){
            this.x-=5;
            this.canon.x-=5;
        }
    }
}

window.onload = init; // la fonction init sera appelée par le navigateur quand la page sera chargée

function init() {
    console.log("Page chargée, j'ai accès à tous les éléments de la page");
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");
    definirTouchesClavier();
    createlevel1();
    requestAnimationFrame(mainloop);
}

function definirTouchesClavier() {
    window.onkeydown = (evt) => {
        switch (evt.key) {
            case "ArrowUp":
                tank_player.vy = -tank_player.vitesse;
                tank_player.facing=90;
                break;
            case "ArrowDown":
                tank_player.vy = tank_player.vitesse;
                tank_player.facing=90;
                break;
            case "ArrowLeft":
                tank_player.vx = -tank_player.vitesse;
                tank_player.facing=180;
                break;
            case "ArrowRight":
                tank_player.vx = tank_player.vitesse;
                tank_player.facing=180;
                break;
        }
    }
    window.onkeyup = (evt) => {
        switch (evt.key) {
            case "ArrowUp":
                tank_player.vy =0;
                break;
            case "ArrowDown":
                tank_player.vy =0;
                break;
            case "ArrowLeft":
                tank_player.vx =0;
                break;
            case "ArrowRight":
                tank_player.vx =0;
                break;
        }
    }
  

    window.onmousemove = (evt) => {
        // get canvas x,y mouse position
        let rect = canvas.getBoundingClientRect();
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;
        let a=tank_player.canon.x-x;
        let b=tank_player.canon.y-y;
        let rad=Math.atan2(a,b);
        let degrees = (rad * 180) / Math.PI - 90; // rotate
        while (degrees >= 360) degrees -= 360;
        while (degrees < 0) degrees += 360;
        tank_player.canon.ang=180-degrees
    }
    canvas.onclick=(evt)=> {
        tank_player.shoot();
    }
}

function mainloop() {
    // 1 on efface le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 2 on dessine les objets
    tank_player.draw(ctx);
    drawBall();
    drawMurs();
    drawTanks();
    // 3 on met à jour les objets
    tank_player.update()
    updateBall();
    updateTanks();
    // 4 - on teste les collisions
    checkCollisionsBall({x:0,y:0,width:canvas.width,height:canvas.height},1);
    checkCollisionsMurs();
    checkCollisionsPlayer();
    checkCollisionsTanks();
    damageTanks();

    if(CheckEndLevel()){
        ClearLevel();
        StartLevel(level)
    }
    requestAnimationFrame(mainloop);
}


function drawBall() {
    balles.forEach(o => {
        if (o instanceof BallesAnime){
            o.draw(ctx);
        }
    });
}

function updateBall(){
    balles.forEach(o => {
        if (o instanceof BallesAnime){
            o.update(ctx);
            if (o.checkdelete()){
                let a=o.index;
                balles[a]=balles[tank_player.nb_balles-1];
                balles[a].index=a;
                balles[tank_player.nb_balles-1]="";
                tank_player.nb_balles--;
            }
        }
    });
}

function updateTanks(){
    tanks.forEach(o => {
        if (o instanceof Tanks){
            o.update(ctx);
        }
    });
}

function drawTanks(){
    tanks.forEach(o => {
        if (o instanceof Tanks){     
            o.draw(ctx);
        }
    });
}

function checkCollisionsBall(carre,i){
    balles.forEach(o => {
        if (o instanceof BallesAnime){
            let x=''
            if (i){
                x=col.Collision_externe(carre,o);
            }
            else{
                x=col.Collision_cercle_carre(carre,o);
            }
            if (x){
                o.bounce(x)
            }
        }
    });
}

function call_interval(o){
    o.random()
}

function drawMurs(){
    murs.forEach(o => {
        if (o instanceof Murs){     
            o.draw(ctx);
        }
    });
}

function checkCollisionsMurs(){
    murs.forEach(o => {
        if (o instanceof Murs){     
            checkCollisionsBall(o,0);
        }
    });
}

function checkCollisionsPlayer(){
    murs.forEach(o => {
        if (o instanceof Murs){     
            let x=col.Collision_carre_carre(o,tank_player)
            if (x){
                tank_player.avoid_murs(x)
            }
        }
    });
}

function checkCollisionsTanks(){
    murs.forEach(o => {
        if (o instanceof Murs){     
            tanks.forEach(k => {
                if(k instanceof Tanks){
                    let x=col.Collision_carre_carre(o,k)
                    if (x){
                        k.avoid_murs(x)
                    }
                }
            })
        }
    });
}

function damageTanks(){
    balles.forEach(o => {
        if (o instanceof BallesAnime){     
            tanks.forEach(k => {
                if(k instanceof Tanks){
                    let x=col.Collision_cercle_carre(k,o)
                    if (x){
                        let i=k.take_damage()
                        if (i!=-1){
                            tanks[i]=""
                        }
                        o.nb_bounces=0;
                        DeleteBall(o)
                    }
                }
            })
        }
    });
}

function DeleteBall(o){
    if (o instanceof BallesAnime){
        if (o.checkdelete()){
            let a=o.index;
            balles[a]=balles[tank_player.nb_balles-1];
            balles[a].index=a;
            balles[tank_player.nb_balles-1]="";
            tank_player.nb_balles--;
        }
    }
};

function CheckEndLevel(){
    let x=0;
    tanks.forEach(o => {
        if (o instanceof Tanks){     
            x++;
        }
    });
    if (x>0){
        return false
    }
    else{
        level++;
        return true
    }
}

function ClearLevel(){
    balles.forEach(o =>{
        if (o instanceof BallesAnime){
            o.nb_bounces=0;
            DeleteBall(o);
        }
    })
    tanks=[];
    murs=[];
}

function StartLevel(level){
    switch (level) {
        case 1:
            createlevel1()
            break;
        case 2:
            createlevel2()
            break;
        case 3:
            createlevel3()
            break;
        case 4:
            alert("You Finised The Demo Congratulation");
        default:
            return "end";
    }
}

function createlevel1(){
    tank_player.x= 50;
    tank_player.y= 50;
    tank_player.canon.x=85;
    tank_player.canon.y=75;
    murs.push(new Murs(200,0,600,200))
    murs.push(new Murs(700,200,600,200))
    tanks.push(new Tanks(1000,700,0,70,50,1,1,canvas,1))
    tanks.forEach(o => {
        if (o instanceof Tanks){     
            setInterval(call_interval,300,o);
        }
    });
}

function createlevel2(){
    tank_player.x= 50;
    tank_player.y= 375;
    tank_player.canon.x=85;
    tank_player.canon.y=400;
    tanks.push(new Tanks(1000,200,0,70,50,1,1,canvas,2))
    tanks.push(new Tanks(1000,600,1,70,50,1,1,canvas,2))
    tanks.forEach(o => {
        if (o instanceof Tanks){     
            setInterval(call_interval,500,o);
        }
    });
}

function createlevel3(){
    tank_player.x= 565;
    tank_player.y= 375;
    tank_player.canon.x=600;
    tank_player.canon.y=400;
    murs.push(new Murs(200,200,300,200))
    murs.push(new Murs(800,0,300,200))
    murs.push(new Murs(800,500,300,200))
    tanks.push(new Tanks(1100,200,0,70,50,1,1,canvas,2))
    tanks.push(new Tanks(1100,600,1,70,50,1,1,canvas,2))
    tanks.push(new Tanks(50,375,2,70,50,1,1,canvas,2))
    tanks.forEach(o => {
        if (o instanceof Tanks){     
            setInterval(call_interval,500,o);
        }
    });
}

