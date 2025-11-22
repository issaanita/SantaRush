class Santa extends Sprite {
    constructor(path, width, height,  count, speed, started) {
        super();

        this.image = new Image();
        this.image.src = path;

        this.width = width;
        this.height = height;
        this.count = count;
        this.speed = speed;

        this.current = 0;
        this.animCounter = 0;

        this.x = -30;
        this.y = 420;
        this.scale = 0.5;
        this.widthScaled = this.width * this.scale;
        this.heightScaled = this.height * this.scale;
        this.started = false;
        this.count = this.count;
        
        this.dy = 0;
        this.gravity = 1;
        this.jumpForce = -25;
        this.groundY = 420;
        this.started=started;
        this.canJump=true;
        this.walkSound = new SoundManager("sfx/running-on-wet-snow.wav");
        this.jumpSound = new SoundManager("sfx/jump.wav");
    }
    update(sprites, keys) {
        if (!this.started ){
            return false;
        }
        if (this.animCounter===0 && this.walkSound.isReady() && this.y === this.groundY) {
            this.walkSound.play();
        }

        if (keys['ArrowUp'] && this.y >= this.groundY && this.canJump) {
            this.dy = this.jumpForce;
            this.walkSound.stop();
            this.canJump=false;
            if (this.jumpSound.isReady()) {
                const sfx = new Audio(this.jumpSound.audio.src);
                sfx.play();
            }            
        }
    
        this.dy += this.gravity;
        this.y += this.dy;
    
        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.dy = 0;
        }
        if(this.y===this.groundY){
            this.animCounter++;
            if (this.animCounter >= this.speed) {
                this.current = (this.current + 1) % this.count;
                this.animCounter = 0;
            }
        }
        if(!keys['ArrowUp']){
            this.canJump=true;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.image,(this.current * this.width), 0,this.width, this.height,this.x, this.y,
            (this.width * this.scale), (this.height * this.scale));
    }
}

class Chimney extends Sprite {
    constructor(path, x, y, speed, width, height, radius, color, started) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.radius = radius;
        this.color=color;
        this.started = false;
        this.collided = false;
        this.hitByGift = false;

        this.image = new Image();
        this.image.src = path;
        this.scale = 1.5;
        this.started = started;
    }
    update(){
        if(!this.started){return false;}
        if (this.started) {
			this.x -= this.speed;
			if (this.x + this.width < 0) {
				this.x = canvas.width + Math.random() * 200;
				this.collided = false;
                this.hitByGift = false;
			}
		}
        return false;
    }    

    draw(ctx) {
		ctx.drawImage(this.image,this.x,this.y,this.width * this.scale,this.height * this.scale);
	}
}

class Cookie extends Sprite{
    constructor(path, x, y, started){
        super();

        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;

        this.vx = 0;
        this.vy = 0;
        this.gravity = 1;
        this.rotation = 0;
        this.rotationSpeed = 0.3;

        this.image = new Image();
        this.image.src = path;

        this.scale = 1.5;
        this.canThrow = true;
        this.maxCookies = 10;
        this.cookiesThrown = 0;
        this.started = started;
        // this.throwSound = new SoundManager("sfx/object-throw.wav");
        // this.hitSound = new SoundManager("sfx/hit-cookie.wav");
        this.gameEnded = false;
    }
    update(){

    }
    draw(ctx){

    }
}

class Miss extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.font = '40px Verdana';
        this.color = 'white';
        this.miss = 0
    }

    update() {
        return false;
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(`Miss: ${this.miss}`, this.x, this.y);
    }
}

class GiftsRemaining extends Sprite {
    constructor(x, y, giftTracker) {
        super();
        this.x = x;
        this.y = y;
        this.font = '40px Verdana';
        this.color = 'white';
        this.giftTracker = giftTracker;
    }

    update() {
        return false;
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(`Gifts: ${this.giftTracker.maxGifts - this.giftTracker.giftsDropped}`, this.x, this.y);
    }
}

class Win extends Sprite {
    constructor(x, y, message) {
        super();
        this.x = x;
        this.y = y;
        this.message=message;
    }
    update() {
        return false;
    }
    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.font = '50px Arial';
        ctx.textAlign='center';
        ctx.fillText(this.message, canvas.width / 2, canvas.height / 2);
    }
}

class Lose extends Sprite {
    constructor(x, y, message) {
        super();
        this.x = x;
        this.y = y;
        this.message=message;
        this.loseSound = new SoundManager("sfx/player-losing.wav");
        this.played = false;
    }
    update() {
        if (!this.played) {
            const bgMusic = sprites.find(s => s instanceof BackgroundMusic);
            if (bgMusic) {
                bgMusic.sound.stop();
            }

            const santa = sprites.find(s => s instanceof Santa);
            if (santa && santa.walkSound) {
                santa.walkSound.stop();
            }

            if (this.loseSound.isReady()) {
                this.loseSound.play();
            }

            this.played = true;
        }
        return false;
    }
    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.textAlign='center';
        ctx.fillText(this.message, canvas.width / 2, canvas.height / 2);
    }
}

class Background extends Sprite {
    constructor(imagePath, speed, started) {
        super();
        this.image = new Image();
        this.image.src = imagePath;
        this.dx = 0;
        this.speed = speed;
        this.started = started;
    }

    update() {
        if (!this.started) {
            return false;
        }
        if (this.started) {
            this.dx -= this.speed;
            if (this.dx <= -canvas.width) {
                this.dx = 0;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.dx, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, this.dx + canvas.width, 0, canvas.width, canvas.height);
    }
}

class BackgroundMenu extends Sprite {
    constructor(imagePath, started) {
        super();
        this.image = new Image();
        this.image.src = imagePath;
        this.started = started;
    }

    update() {
        if (!this.started) {
            return false;
        }
        return false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    }
}

class SoundManager {
    constructor(url, { loop = false } = {}) {
        this.audio = new Audio(url);
        this.audio.loop = loop;
    }

    isReady() {
        return this.audio.readyState >= 2;
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

class BackgroundMusic extends Sprite {
    constructor(started) {
        super();
        this.sound = new SoundManager("bg/bgMusic/Here Comes Santa Claus Instrumental.wav", { loop: true });
        this.started = started;
        this.isPlaying = false;
    }

    update() {
        if (this.started && this.sound.isReady() && !this.isPlaying) {
            this.sound.play();
            this.started = true;
            this.isPlaying = true;
        }
        return false;
    }

    draw(ctx) { }
}

class Button extends Sprite {
    constructor(x, y, width, height, text, onClick) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;
        this.isHovered = false;
    }

    update(sprites, keys, mouse) {
        this.isHovered = this.isMouseOver(mouse);

        if (mouse.clicked && this.isHovered) {
            this.onClick();
            mouse.clicked = false; // Prevent multiple triggers
        }
    }

    isMouseOver(mouse) {
        if (mouse == undefined){
            return false;
        }
        return (
            mouse.x >= canvas.width / 2 - this.width / 2 &&
            mouse.x <= canvas.width / 2 - this.width / 2 + this.width &&
            mouse.y >= this.y &&
            mouse.y <= this.y + this.height
        );
    }

    draw(ctx) {
        ctx.fillStyle = this.isHovered ? "#666" : "#333"; // Darker color when hovered

        ctx.fillRect((canvas.width/2 - this.width/2), this.y, this.width, this.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, canvas.width/2, this.y + this.height/2);
    }
}

class LevelMenu extends Level {
    constructor(game) {
        super();
        this.game = game;
    }

    initialize() {
        this.game.addSprite(new BackgroundMenu("bg/bgMenu/cute-menu-bg.png", true));

        this.game.addSprite(new Button(150, 330, 300, 70, "Start Game", () => {
            this.game.changeLevel(1);
        }));
        this.game.addSprite(new Button(150, 430, 300, 70, "Exit", () => {
            alert("Game Closed!");
        }));
    }
}

class Level1 extends Level {
    constructor(game) {
        super();
        this.game = game;
        this.started = false;
    }
    initialize() {
        this.started = true;
        this.game.addSprite(new Background("bg/bgImages/snowyTown.png",10, true));
        this.game.addSprite(new BackgroundMusic(true));
        this.game.addSprite(new Chimney("miscellaneous/chimney.png",600, 550,10,120,120,40,"black", true));
        this.game.addSprite(new Chimney("miscellaneous/chimney.png",1400, 520,10,120,120,40,"black", true));
        this.game.addSprite(new Santa("santasprites/SpriteSheet/Run.png", 934, 641, 11, 5, true));
        var gift = new Gift("miscellaneous/gift.png",200,600, true);
        this.game.addSprite(gift);
        this.game.addSprite(new Miss(80, 50));
        this.game.addSprite(new GiftsRemaining(300, 50, gift));
    }
}

class Level2 extends Level {
    constructor(game) {
        super();
        this.game = game;
    }
    initialize() {
    }
}

var game = new Game();
game.addLevel(new LevelMenu(game));
game.addLevel(new Level1(game));
game.addLevel(new Level2(game));
game.animate();