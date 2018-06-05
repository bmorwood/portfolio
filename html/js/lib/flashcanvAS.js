

var instances = [];
var timer;

function removeChild(obj) {

    if (!contains(obj)) return;

    for (var key in instances) {
        if (instances[key] == obj)
            delete instances[key];
    }
}

function addChild(obj) {

    removeChild(obj);

    instances.push(obj);
}

function play() {
    timer = setInterval(enterFrame, 1000 / 60);
}

function stop() {
    clearInterval(timer);

    //show pause screen
}

function trace(msg) {
    console.log(msg);
}

function contains(obj) {

    for (var key in instances) {

        if (instances[key] == null)
            continue;

        if (instances[key] === obj)
            return true;

    }


    return false;
}

/* Sprite Class */

Sprite = function (context, src) {

    this.context = context;
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = src;
    this.image.entity = this;
    this.image.onload = function () {
        this.entity.width = (this.entity.width == 0) ? this.width : this.entity.width;
        this.entity.height = (this.entity.height == 0) ? this.height : this.entity.height;
    };
    this.width = 0;
    this.height = 0;
    this.rotation = 0; // degrees
    this.name = "";
    this.alpha = 1;
    this.parent = { x: 0, y: 0 };

    this.render = function () {

        var radians = this.rotation * (Math.PI / 180);

        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.translate(this.x + this.parent.x, this.y + this.parent.y);
        this.context.rotate(radians);
        this.context.drawImage(this.image, -(this.width / 2), -(this.height / 2), this.width, this.height);
        this.context.restore();
    }

    this.addChild = function (sprite) {
        sprite.parent = this;
        addChild(sprite);
    }
}

/* Text Item */

TextField = function (context) {

    this.context = context;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.name = "";
    this.alpha = 1;
    this.parent = { x: 0, y: 0 };
    this.text = "";
    this.size = 0;
    this.color = "#ffffff";
    this.font = "Arial";

    this.render = function () {

        var radians = this.rotation * (Math.PI / 180);

        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.translate(this.x + this.parent.x, this.y + this.parent.y);
        this.context.rotate(radians);
        this.context.font = this.size + "px " + this.font;
        this.context.fillStyle = this.color; // text color
        this.context.fillText(this.text, this.x + this.parent.x, this.y + this.parent.y);
        this.context.restore();
    }

    this.addChild = function (sprite) {
        sprite.parent = this;
        addChild(sprite);
    }
}