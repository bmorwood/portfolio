(function () {
    var canvas;
    var stage;
    var container;
    var captureContainers;
    var captureIndex;

    function init() {
        // create a new stage and point it at our canvas:
        canvas = document.getElementById("canvas-sprites");

        canvas.width = $(window).width();
        canvas.height = $(window).height();

        stage = new Stage(canvas);

        var w = canvas.width;
        var h = canvas.height;

        container = new Container();
        stage.addChild(container);

        captureContainers = [];
        captureIndex = 0;

        var img = new Image();
        img.src = "style/img/thumb-bg2.png";

        // create a large number of slightly complex vector shapes, and give them random positions and velocities:
        for (var i = 0; i < 20; i++) {
            var heart = new Bitmap(img);
            heart.y = -100;

            container.addChild(heart);
        }

        Ticker.addListener(window);
        Ticker.setFPS(30);

        window.tick = tick;
    }

    function tick() {

        var w = canvas.width;
        var h = canvas.height;
        var l = container.getNumChildren();

        // iterate through all the children and move them according to their velocity:
        for (var i = 0; i < l; i++) {
            var heart = container.getChildAt(i);
            if (heart.y < -99) {
                heart._x = Math.random() * w;
                heart.y = h * (1 + Math.random()) + 50;
                heart.perX = (1 + Math.random()) * h;
                heart.offX = Math.random() * h;
                heart.ampX = heart.perX * 0.1 * (0.2 + Math.random());
                heart.velY = -Math.random() * 2 - 2;
                heart.scaleX = heart.scaleY = Math.random() + 1;
                heart.rotation = Math.random() * 40 - 20;
                heart.alpha = Math.random();
            }

            //heart.rotation += heart.velY;
            heart.y += heart.velY;
            heart.x = heart._x + Math.cos((heart.offX + heart.y) / heart.perX * Math.PI * 2) * heart.ampX;
        }

        stage.update();
    }

    function resizeCanvasHandler() {

        var canvas = document.getElementById("canvas-sprites");

        canvas.width = $(window).width();
        canvas.height = $(window).height();
    }

    $(window).resize(resizeCanvasHandler);

    init();

})();