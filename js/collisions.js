
function CollisionDroite(A,B,C){
   let u={x:0,y:0};
   u.x = B.x - A.x;
   u.y = B.y - A.y;
   let AC={x:0,y:0};
   AC.x = C.x - A.x;
   AC.y = C.y - A.y;
   let numerateur = u.x*AC.y - u.y*AC.x;   // norme du vecteur v
   if (numerateur <0)
      numerateur = -numerateur ;   // valeur absolue ; si c'est négatif, on prend l'opposé.
   let denominateur = Math.sqrt(u.x*u.x + u.y*u.y);  // norme de u
   let CI = numerateur / denominateur;

   if (CI<C.radius)
      return true;
   else
      return false;
}

function CollisionSegment(A,B,C){
    if (CollisionDroite(A,B,C) == false)
        return false;  // si on ne touche pas la droite, on ne touchera jamais le segment
    let AB={x:0,y:0};
    let AC={x:0,y:0};
    let BC={x:0,y:0};
    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    AC.x = C.x - A.x;
    AC.y = C.y - A.y;
    BC.x = C.x - B.x;
    BC.y = C.y - B.y;
    let pscal1 = AB.x*AC.x + AB.y*AC.y;  // produit scalaire
    let pscal2 = (-AB.x)*BC.x + (-AB.y)*BC.y;  // produit scalaire
    if (pscal1>=0 && pscal2>=0)
        return true;   // I entre A et B, ok.
    // dernière possibilité, A ou B dans le cercle
    /*
    if (CollisionPointCercle(A,C))
        return true;
    if (CollisionPointCercle(B,C))
        return true;
        */
    return false;
}

function CollisionPointCercle(A,C){
    let x = A.x;
    let y = A.y;
    let d2 = (x-C.x)*(x-C.x) + (y-C.y)*(y-C.y);
    if (d2>C.radius*C.radius)
        return false;
    else
        return true;
}

function Collision_externe(carre,cercle) {
    let A={ x:carre.x , y:carre.y }
    let B={ x:carre.x+carre.width , y:carre.y }
    let C={ x:carre.x , y:carre.y+carre.height }
    let D={ x:carre.x+carre.width ,y:carre.y+carre.height }
    if (CollisionSegment(A,B,cercle)){
        return "up"
    }
    if (CollisionSegment(C,D,cercle)){
        return "down"
    }
    if (CollisionSegment(A,C,cercle)){
        return "left"
    }
    if (CollisionSegment(B,D,cercle)){
        return "right"
    }
    return false
}

function Collision_cercle_carre(carre,cercle) {
    let A={ x:carre.x , y:carre.y }
    let B={ x:carre.x+carre.width , y:carre.y }
    let C={ x:carre.x , y:carre.y+carre.height }
    let D={ x:carre.x+carre.width ,y:carre.y+carre.height }
    if (CollisionSegment(A,B,cercle)){
        return "down"
    }
    if (CollisionSegment(C,D,cercle)){
        return "up"
    }
    if (CollisionSegment(A,C,cercle)){
        return "right"
    }
    if (CollisionSegment(B,D,cercle)){
        return "left"
    }
    return false
}

function Collision_carre_carre(box1,box2){
    let c={x:box2.x+(box2.width/2),y:box2.y+(box2.height/2),radius:((box2.width+box2.height)/4)}
    let a={x:box1.x-10,y:box1.y-10,height:box1.height+10,width:box1.width+10}

    return Collision_cercle_carre(a,c)
}


export {Collision_externe,Collision_cercle_carre,Collision_carre_carre};