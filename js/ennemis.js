export default class Tanks{
    constructor(x,y,i,width,height,vitesse,vitesse_r,canvas,hp) {
        this.x = x;
        this.y = y;
        this.hp=hp;
        this.width=width;
        this.height=height;
        this.vitesse=vitesse;
        this.vitesse_r=vitesse_r;
        this.vx=0;
        this.vy=0;
        this.anticoli=vitesse*2;
        this.index=i;
        this.facing=0;
        this.ang=0;
        this.nb_balles=0;
        this.canvas=canvas;
        this.canon={x_c:x+width/2,y_c:y+height/2,width_c:60,height_c:10,ang_c:0};
    }
    draw(ctx){
        // bonne pratique : quand on dessine, on sauvegarde le contexte
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.translate(this.x+this.width/2, this.y+this.height/2);
        ctx.rotate(this.ang* Math.PI /180);
        ctx.fillRect(0-(this.width/2), 0-(this.height/2), this.width, this.height);
        ctx.rotate(0);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(this.canon.x_c, this.canon.y_c);
        ctx.rotate(this.canon.ang_c* Math.PI /180);
        ctx.beginPath();
        ctx.arc(0,0, 20, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-5,-5,this.canon.width_c,this.canon.height_c);


        ctx.fillStyle = "darkblue";
        ctx.beginPath();
        ctx.arc(0,0, 19, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-5,-4,this.canon.width_c-2,this.canon.height_c-2);

        ctx.restore();
    }
    update(){
        if ((this.x)<0){
            this.x=0
            this.canon.x_c=35
        }
        else if((this.x+this.width)>this.canvas.width){
            this.x=this.canvas.width-this.width
            this.canon.x_c=this.canvas.width-35
        } 
        else{
            this.x+=this.vx
            this.canon.x_c+=this.vx
        }
        if ((this.y)<0){
            this.y=0
            this.canon.y_c=25
        }
        else if((this.y+this.height)>this.canvas.height){
            this.y=this.canvas.height-this.height
            this.canon.y_c=this.canvas.height-25
        } 
        else{
            this.y+=this.vy
            this.canon.y_c+=this.vy
        }
        if (this.facing>this.ang){
            this.ang += this.vitesse_r;
        }
        if (this.facing<this.ang){
            this.ang -= this.vitesse_r;
        }
    }
    random(){
        let a=Math.floor(Math.random() * 3);
        let b=Math.floor(Math.random() * 3);
        if (a===0){
            this.vx=-this.vitesse
            this.facing=180
        }
        if (a===1){
            this.vx=this.vitesse
            this.facing=0
        }
        if (a===2){
            this.vx=0
        }
        if (b===0){
            this.vy=-this.vitesse
            this.facing=90
        }
        if (b===1){
            this.vy=this.vitesse
            this.facing=270
        }
        if (b===2){
            this.vy=0
        }
    }
    avoid_murs(par){
        if (par==="up"){
            this.y+=5;
            this.canon.y_c+=5;
        }
        if (par==="down"){
            this.y-=5;
            this.canon.y_c-=5;
        }
        if (par==="left"){
            this.x+=5;
            this.canon.x_c+=5;
        }
        if (par==="right"){
            this.x-=5;
            this.canon.x_c-=5;
        }
    }
    take_damage(){
        this.hp--;
        if (this.hp<1){
            return this.index
        }
        return -1
    }
    /*
    shoot(){
        if (this.nb_balles<3){
            balles[this.nb_balles]=new BallesAnime(canvas.width,canvas.height,2,this.canon.x,this.canon.y,this.canon.ang* Math.PI /180,this.canon.width,this.nb_balles)
            this.nb_balles++
        }
    }
    */
}

