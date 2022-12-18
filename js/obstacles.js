
export default class Murs {
    constructor(x,y,height,width) {
        this.x = x;
        this.y = y;
        this.height=height;
        this.width=width;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x,this.y, this.width,this.height);
        ctx.restore();
    }
}