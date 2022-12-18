export default class BallesAnime{
    constructor(canvasWidth,canvasHeight,vitesse,xstart,ystart,angle,hauteurcanon,i) {
        this.x = xstart+Math.cos(angle)*hauteurcanon;
        this.y = ystart+Math.sin(angle)*hauteurcanon;
        this.radius = 8;
        this.canvasHeight= canvasHeight
        this.canvasWidth = canvasWidth;
        this.anticoli=vitesse*2;
        this.vx = vitesse*Math.cos(angle);
        this.vy =vitesse*Math.sin(angle);
        this.nb_bounces=3;
        this.index=i
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x+=this.vx;
        this.y+=this.vy;
    }

    bounce(par) {
        if (par==="up"){
            this.vy = -this.vy;
            this.y+=this.anticoli;
        }
        if (par==="down"){
            this.vy = -this.vy;
            this.y-=this.anticoli;
        }
        if (par==="left"){
            this.vx = -this.vx;
            this.x+=this.anticoli;
        }
        if (par==="right"){
            this.vx = -this.vx;
            this.y-=this.anticoli;
        }
        this.nb_bounces--;
    }
    checkdelete(){
        if (this.nb_bounces){
            return false
        }
        return true
    }
}