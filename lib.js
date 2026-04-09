/*
This file contains all of the default helper classes and base classes and stuff.
Edit them if you need to idk
*/

class Camera{
    static position = { x:0, y:0 };
    static offset = { x:0, y:0 };
    static dScale = 320;
    static scaleDiff = { hScale:1, wScale: 1.85 };

    static getPos(){
        return { x:this.position.x + this.offset.x, 
                 y:this.position.y + this.offset.y }
    }

    static setScale(width, height){
        this.scaleDiff.wScale = width/this.dScale;
        this.scaleDiff.hScale = height/this.dScale;
    }

    static setScaleAndDScale(dScale, width, height){
        this.dScale = dScale;
        this.setScale(width,height);
    }

    static screenToWorldPos(screenX, screenY) {
        const worldX = (screenX / this.scaleDiff.hScale + this.position.x) + this.offset.x;
        const worldY = (screenY / this.scaleDiff.hScale + this.position.y) + this.offset.y;
        return { x: worldX, y: worldY };
    }
}

class CanvasDrawHelper{
    // This is the class used for rendering with the Camera. 
    // It is very large and has some issues, but it should be good enough

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static fillRect(ctx,x,y,w,h){
        ctx.fillRect(Math.floor((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        Math.floor((y - Camera.getPos().y) * Camera.scaleDiff.hScale),
        Math.floor((w * Camera.scaleDiff.hScale)+1),
        Math.floor((h * Camera.scaleDiff.hScale)+1));
    }
    
    /**
     *  note: it does not account for offset in the calculation of the
     *  start and end of the lines properly, so when trying to use this
     *  on a square with an offset it will most likely break.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {number} spacing 
     * @param {number} offset 
     */
    static lineFillRect(ctx,x,y,w,h,spacing,offset){
        let pos = offset
        ctx.beginPath()
        if(h > w){
            for (let i = 0; i <= Math.floor(w/spacing); i++){
                let over = pos-w
                this.moveTo(ctx,x,y+pos)
                if(pos > w){
                    this.lineTo(ctx,x+pos-over,y+over)
                }else{
                    this.lineTo(ctx,x+pos,y)
                }
                pos+=spacing
            }
            for (let i = 0; i < Math.floor((h/spacing)-(w/spacing)); i++){
                let over = pos-w
                let under = pos-h
                if(pos > h){
                    this.moveTo(ctx,x+under,y+pos-under)
                }else{
                    this.moveTo(ctx,x,y+pos)
                }
                this.lineTo(ctx,x+pos-over,y+over)
                pos+=spacing
            }
            for (let i = 0; i < Math.floor(w/spacing)+1; i++){
                let over = pos-w
                let under = pos-h
                if(pos < h + w){
                    this.moveTo(ctx,x+under,y+pos-under)
                    this.lineTo(ctx,x+pos-over,y+over)
                }
                pos+=spacing
            }
        }else {
            for (let i = 0; i <= Math.floor(h / spacing); i++) {
                let over = pos - h;
                this.moveTo(ctx, x + pos, y);
                if (pos > h) {
                    this.lineTo(ctx, x + over, y + pos - over);
                } else {
                    this.lineTo(ctx, x, y + pos);
                }
                pos += spacing;
            }
            for (let i = 0; i < Math.floor((w / spacing) - (h / spacing)); i++) {
                let over = pos - h;
                let under = pos - w;
                if (pos > w) {
                    this.moveTo(ctx, x + pos - under, y + under);
                } else {
                    this.moveTo(ctx, x + pos, y);
                }
                this.lineTo(ctx, x + over, y + pos - over);
                pos += spacing;
            }
            for (let i = 0; i < Math.floor(h / spacing) + 1; i++) {
                let over = pos - h;
                let under = pos - w;
                if (pos < w + h) {
                    this.moveTo(ctx, x + pos - under, y + under);
                    this.lineTo(ctx, x + over, y + pos - over);
                }
                pos += spacing;
            }
        }

        ctx.stroke()
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {number} r 
     */
    static roundRect(ctx,x,y,w,h,r){
        ctx.roundRect(((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        ((y - Camera.getPos().y) * Camera.scaleDiff.hScale),
        ((w * Camera.scaleDiff.hScale)+1),
        ((h * Camera.scaleDiff.hScale)+1),r);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} r
     */
    static circle(ctx,x,y,r){
        ctx.arc(Math.floor((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        Math.floor((y - Camera.getPos().y) * Camera.scaleDiff.hScale),
        Math.floor((r * Camera.scaleDiff.hScale)),0,Math.PI*2);//todo? fix jitter? idk if theis needs to get fixed
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static drawImage(ctx, image,x,y,w,h){
        ctx.drawImage(image,((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        ((y - Camera.getPos().y) * Camera.scaleDiff.hScale),
        ((w * Camera.scaleDiff.hScale)+1),
        ((h * Camera.scaleDiff.hScale)+1));
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {HTMLImageElement} image 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {number} tileW
     * @param {number} tileH
     * @param {number} tileMarginX
     * @param {number} tileMarginY
     * @param {number} xTile
     * @param {number} yTile
     */
    static drawImageFromSpritesheet(ctx, image,x,y,w,h, tileW,tileH,tileMarginX,tileMarginY,xTile,yTile){
        let startx = (xTile*tileW)+(xTile*tileMarginX)
        let starty = (yTile*tileH)+(yTile*tileMarginY)
        ctx.drawImage(image,startx,starty,tileW,tileH,
        ((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        ((y - Camera.getPos().y) * Camera.scaleDiff.hScale),
        ((w * Camera.scaleDiff.hScale)+1),
        ((h * Camera.scaleDiff.hScale)+1));
    }
    
    /**
     * image can be any type of image that works the same way
     * @param {HTMLImageElement} image 
     * @param {number} tileW
     * @param {number} tileH
     * @param {number} tileMarginX
     * @param {number} tileMarginY
     */
    static getSpritesheetCells(image,tileW,tileH,tileMarginX,tileMarginY){
        return {x:Math.round((image.width+tileMarginX)/(tileW+tileMarginX)),
                y:Math.round((image.height+tileMarginY)/(tileH+tileMarginY))}
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static fillText(ctx,text,x,y){
        ctx.fillText(text,((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        ((y - Camera.getPos().y) * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static strokeText(ctx,text,x,y){
        ctx.strokeText(text,((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        ((y - Camera.getPos().y) * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static text(ctx,text,x,y){
        this.strokeText(ctx,text,x,y)
        this.fillText(ctx,text,x,y)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static fillTextStatic(ctx,text,x,y){
        ctx.fillText(text,(x * Camera.scaleDiff.hScale),
        (y * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static strokeTextStatic(ctx,text,x,y){
        ctx.strokeText(text,(x * Camera.scaleDiff.hScale),
        (y * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static textStatic(ctx,text,x,y){
        this.strokeTextStatic(ctx,text,x,y)
        this.fillTextStatic(ctx,text,x,y)
    }
    
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    static strokeRect(ctx,x,y,w,h){
        ctx.strokeRect(Math.floor((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
        Math.floor((y - Camera.getPos().y) * Camera.scaleDiff.hScale),
        Math.floor((w * Camera.scaleDiff.hScale)+1),
        Math.floor((h * Camera.scaleDiff.hScale)+1));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     */
    static createPath(ctx,x1,y1,x2,y2){
        ctx.moveTo(Math.floor((x1 - Camera.getPos().x) * Camera.scaleDiff.hScale),
            Math.floor((y1 - Camera.getPos().y) * Camera.scaleDiff.hScale));
        ctx.lineTo(Math.floor((x2 - Camera.getPos().x) * Camera.scaleDiff.hScale), 
            Math.floor((y2 - Camera.getPos().y) * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y
     */
    static moveTo(ctx,x,y){
        ctx.moveTo(Math.floor((x - Camera.getPos().x) * Camera.scaleDiff.hScale),
            Math.floor((y - Camera.getPos().y) * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y
     */
    static lineTo(ctx,x,y){
        ctx.lineTo(Math.floor((x - Camera.getPos().x) * Camera.scaleDiff.hScale), 
            Math.floor((y - Camera.getPos().y) * Camera.scaleDiff.hScale));
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} width
     */
    static setLineWidth(ctx,width){
        ctx.lineWidth = width*Camera.scaleDiff.hScale
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} differance
     */
    static changeLineWidth(ctx,differance){
        ctx.lineWidth -= differance*Camera.scaleDiff.hScale
    }
}

class CollisionHelper{
    /* Thanks to https://www.jeffreythompson.org/collision-detection/ for help with the collision functions
    It used it to check some of the collision fuction's correctness
    */

    static RectRect(x1,y1,w1,h1,x2,y2,w2,h2){
        return x1 + w1 >= x2 &&
               x1 <= x2 + w2 &&
               y1 + h1 >= y2 &&
               y1 <= y2 + h2
    }

    static CircleCircle(x1,y1,r1,x2,y2,r2){
        return Math.sqrt(((x2-x1)**2)+((y2-y1)**2)) <= r1 + r2
    }

    static CircleRect(rx,ry,rw,rh,cx,cy,cr){
        var testX = cx;
        var testY = cy;

        if (cx < rx) testX = rx;
        else if (cx > rx+rw) testX = rx+rw;
        if (cy < ry) testY = ry;
        else if (cy > ry+rh) testY = ry+rh;

        return Math.sqrt(((cx-testX)**2) + ((cy-testY)**2)) <= cr;
    }
}

class KeyboardHelper{
    static keyMap = []
    static bindings = []

    static MapKey(ID, keyID){
        if(!(Number.isFinite(keyID))) console.warn(`${keyID} is not an int`)
        else{
            if(!this.keyMap.find(m=>m.id==ID)) this.keyMap.push({id:ID, key:keyID})
            else this.keyMap[this.keyMap.findIndex(m=>m.id==ID)] = {id:ID, key:keyID}
        }
    }

    static MapBinding(BindingID, ...keyMapIDs){
        if(!this.bindings.find(m=>m.id==BindingID)) this.bindings.push({id:BindingID, keys:keyMapIDs})
        else this.bindings[this.bindings.findIndex(m=>m.id==BindingID)] = {id:BindingID, keys:keyMapIDs}
    }

    static AddRange(object){
        //object format: {keys:[],bindings:[]}
        //inside of each array, put another array with the parameters
        const keys = object.keys
        const bindings = object.bindings

        keys.forEach(k => this.MapKey(...k));
        bindings.forEach(b => this.MapBinding(...b));
    }

    static GetKey(id){
        const k = this.keyMap.find(m=>m.id==id)
        if(k){
            if(k.key > 0){
                return keyboard[k.key]
            }else{
                return mouse[this.MousestringOfkeyID(k.key)]
            }
        }
        return false // key not mapped
    }

    static GetBinding(id){
        const b = this.bindings.find(m=>m.id==id)
        if(b){
            return b.keys.some(k => this.GetKey(k))
        }
        return false
    }

    static MousestringOfkeyID(keyID){
        if(keyID == -1){
            return "left"
        }
        if(keyID == -2){
            return "middle"
        }
        if(keyID == -3){
            return "right"
        }
        if(keyID == -4){
            return "front"
        }
        if(keyID == -5){
            return "back"
        }
        return ""
    }
}