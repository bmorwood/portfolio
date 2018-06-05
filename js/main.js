var dataloaded = false;
var slides = [];
var currentSlide = {};
var _currentCategory;


$('#loadingDiv')
    .hide()  // hide it initially
    .ajaxStart(function () {
        $(this).show();
    })
    .ajaxStop(function () {
        $(this).hide();
    })
;



$(document).ready(function () {
    init();

    $.address.change(function (event) {
        dependenciesCheck(event.pathNames[0], event.pathNames[1]);
    });

    $(".thumb a").live("click", function () {
        window.location.hash = $(this).attr("href");
        return false;
    });
});

function unbindPager() {
    $('#pager-left a').unbind('click', previousPage);
    $('#pager-right a').unbind('click', nextPage);

    $('#pager-left a').unbind('click', previousWork);
    $('#pager-right a').unbind('click', nextWork);
}

function bindPagerForThumbs() {
    
    unbindPager();

    $('#pager-left a').bind('click', previousPage);
    $('#pager-right a').bind('click', nextPage);
}

function bindPagerForWork() {
    
    unbindPager();

    $('#pager-left a').bind('click', previousWork);
    $('#pager-right a').bind('click', nextWork);
    
    updatePager();

}

function nextWork() {
    window.location.hash = 'show/' + (currentSlide.id + 1);

    updatePager();
}

function previousWork() {
    window.location.hash = 'show/' + (currentSlide.id - 1);

    updatePager();
}

function updatePager() {

    $('#pager-right').show();
    $('#pager-right-under').show();

    $('#pager-left').hide();
    $('#pager-left-under').hide();

    if (currentSlide.id > slides.length) {
        $('#pager-right').hide();
        $('#pager-right-under').hide();
    }

    if (currentSlide.id > 0) {
        $('#pager-left').show();
        $('#pager-left-under').show();
    }
    
}

function init() {
    hideCategory();
    loadData();

}

function loadMain() {
    
    $.ajax({
        url: "grid.htm",
        cache: false,
        success: function (html) {
            $("#main-content").html(html);

            if (_currentCategory != null)
                buildGrid(_currentCategory);
            else
                buildGrid();
        }
    });
}

function loadAbout() {

    $('#pager-left').hide();
    $('#pager-left-under').hide();

    $('#pager-right').hide();
    $('#pager-right-under').hide();

    loadContent('about.htm');
}

function loadContent(url) {

    $.ajax({
        url: url,
        cache: false,
        success: function (html) {
            $("#main-content").html(html);
            resizeWork();
        }

    });
}

function load(id) {

    currentSlide = getSlideFromID(id);

    if (!currentSlide) {
        $.address.path('/main');
        return;
    }


    $.ajax({
        url: "content-template.htm",
        cache: false,
        success: function (html) {
            $("#main-content").html(html);

            var imageLoader = new Image();
            imageLoader.src = currentSlide.poster;

            imageLoader.onload = function () {
                $('#content-main-img').attr('src', currentSlide.poster);
                $('#content-main-img').hide();

                $('#show-info').click(function () {
                    viewInfo();
                });

                if (currentSlide.link != null) {
                    $('#show-link').removeClass('disabled');
                    $('#show-link').click(function () { 
                        viewLink();
                    });
                }

                if (currentSlide.swf != null || currentSlide.html != null)
                    $('#show-work').removeClass('disabled');

                if (currentSlide.swf != null) {
                    $('#show-work').click(function () {
                        viewFlash();
                    });
                } else if (currentSlide.html != null) {
                    $('#show-work').click(function () {
                        viewHTML();
                    });
                }

                var a = setInterval(function () {
                    resizeWork();
                    clearInterval(a);
                    $('#content-main-img').fadeIn('slow');
                }, 50);

                bindPagerForWork();

            }
        }
    });
}

function getSlideFromID(id) {
    for (var i = 0; i < slides.length; i++) {
        if (id == slides[i].id)
            return slides[i];
    }

    return null;
}

function viewLink() {
    window.open(currentSlide.link);
    //window.location = currentSlide.link;

}

function viewHTML() {

    var htmlCon = jQuery('<span id="html-content"> </span>');
    var overlay = jQuery('<div id="overlay" class="overlay"> </div>');
    var iframe = jQuery('<iframe />');
    iframe.attr('src', currentSlide.html);
    iframe.attr('width', currentSlide.width);
    iframe.attr('height', currentSlide.height);
    iframe.attr('scrolling', 'no');
    iframe.attr('frameBorder', '0');
    htmlCon.appendTo(overlay);
    iframe.appendTo(htmlCon);
    overlay.appendTo(document.body);

    overlay.click(function () {
        $(this).remove();
    });

}

function viewFlash() {
    var flashCon = jQuery('<span id="flash-content"> </span>');
    var overlay = jQuery('<div id="overlay" class="overlay"> </div>');
    flashCon.appendTo(overlay);
    overlay.appendTo(document.body);

    var flashvars = {
    };

    var params = {
        menu: "false",
        scale: "noScale",
        allowFullscreen: "true",
        allowScriptAccess: "always",
        bgcolor: "#000",
        wmode:'transparent'
    };

    var attributes = {};

    swfobject.embedSWF(currentSlide.swf, "flash-content", currentSlide.width, currentSlide.height, "10.1.0", "expressInstall.swf", flashvars, params, attributes);

    overlay.click(function () {
        $(this).remove();
    });
}

function viewInfo() {
    var infoCon = jQuery("<div class='info-content'> </div>");
    var overlay = jQuery('<div id="overlay" class="overlay"> </div>');
    infoCon.appendTo(overlay);
    overlay.appendTo(document.body);

    infoCon.html(currentSlide.info);

    overlay.click(function () {
        $(this).remove();
    });
}

function showCategory() {
    $('#category').show();

    $('#category').live('click', function () {
        hideCategory();
    });
}

function hideCategory() {
    $('#category').hide();
}


function loadData() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "xml/portfolio-data.xml",
            dataType: "xml",
            success: parseXml
        });
    });
}

function changeCategory(cat) {
    
    buildGrid(cat);
}

function parseXml(xml) {

    slides = [];

    var idCounter = 0;
    //find every Tutorial and print the author
    $(xml).find("slide").each(function () {
        var slide = new Slide();

        var contentPath = $(this).attr('content-path');

        slide.swf = $(this).find("swf").text() || null;
        if (slide.swf != null)
            slide.swf = contentPath + slide.swf;

        slide.width = $(this).find("swf").attr("width") || '300';
        slide.height = $(this).find("swf").attr("height") || '250';
        slide.poster = contentPath + 'poster.jpg';
        slide.icon.on = contentPath + 'thumb.png';
        slide.icon.off = contentPath + 'thumb-mask.png'
        slide.id = idCounter++;
        slide.info = $(this).find("info").text();
        slide.link = $(this).find("link").text() || null;
        slide.type = $(this).find("type").text();
        slide.html = $(this).find("html").text() || null;

        if (slide.html != null) {
            slide.html = contentPath + slide.html;
            slide.width = $(this).find("html").attr("width");
            slide.height = $(this).find("html").attr("height");
        }

        slides.push(slide);
    });

    buildGrid();

    dataloaded = true;

}

var checker;

function dependenciesCheck(content, id) {


    switch (content) {

        case 'show':
            load(id);
            break;

        case 'main':
            loadMain();
            break;

        case 'about':
      
            loadAbout();
            break;

        case 'contact':
            //nothing yet
            break;

        default:
            loadMain();
            break;
    }

}

function nextPage() {
    var nextPage = $('#pager-number').attr('data-page');
    nextPage++;

    buildGrid(_currentCategory, nextPage);
}

function previousPage() {
    var previousPage = $('#pager-number').attr('data-page');
    previousPage--;

    buildGrid(_currentCategory, previousPage);
}



function buildGrid(criteria, page) {

    var cols = 5;
    var rows = cols * 4;

    criteria = (criteria == undefined) ? ['All', 'all'] : criteria;

    $('#category-title').text(criteria[0]);

    page = (page == undefined) ? 1 : page;

    _currentCategory = criteria;

    var slidesToUse = slides;

    if (criteria[1] != 'all')
        slidesToUse = JSLINQ(slides).Where(function (item) { return item.type.toLowerCase().indexOf(criteria[1].toLowerCase()) != -1; }).items;

    $('#grid-content').empty();

   //slides.length
    for (var i = 0; i < rows; i++) {

        var slide = slidesToUse[i + ((page - 1) * rows)];

        var thumb = $('<div />', { 'class': 'thumb' + (((i + 1) % 5 == 0) ? " last" : "") });

        thumb.hide();
        
        if (slide) {

            var link = $('<a />', { 'href': 'show/' + slide.id });

            var img1 = $('<img />', { 'class': 'thumb-holder', src: slide.icon.on });
            var img2 = $('<img />', { 'class': 'mask', src: slide.icon.off });
            var img3 = $('<div />', { 'class': 'highlight' });

            img1.appendTo(link);
            img3.appendTo(link);
            img2.appendTo(link);

            link.appendTo(thumb);
        } else {
            var img1 = $('<img />', { 'src': 'style/img/empty-grid-space.png', 'class':'thumb-empty' });
            img1.appendTo(thumb);
        }

        thumb.appendTo($('#grid-content'));
        thumb.delay(i * 100).fadeIn();
    }

    var totalPages = Math.ceil(slidesToUse.length / rows);

    $('#pager-number').attr('data-page', page);
    $('#pager-number p').html(page + '/' + totalPages);

    $('#pager-right').show();
    $('#pager-right-under').show();

    $('#pager-left').hide();
    $('#pager-left-under').hide();

    if (page >= totalPages) {
        $('#pager-right').hide();
        $('#pager-right-under').hide();
    }

    if (page > 1) {
        $('#pager-left').show();
        $('#pager-left-under').show();
    }


    bindPagerForThumbs();

}

$('.thumb').live('hover', function (e) {

    var mask = $(this).find('.mask');

    if ( e.type == 'mouseenter' ) {
        mask.stop().animate({ opacity: 0 }, { duration: 300 });
        $(this).addClass('thumb-hover');
    } else if ( e.type == 'mouseleave' ) {
        mask.stop().animate({ opacity: 1 }, { duration: 300 });
        $(this).removeClass('thumb-hover');
    }
});


$('#pager-left').live('hover', function (e) {

    if (e.type == 'mouseenter') {
        $(this).stop().animate({ left: -78 }, { duration: 300 });
        $('#pager-left-under').stop().animate({ left: -65 }, { duration: 300 });
        //$(this).addClass('thumb-hover');
    } else if (e.type == 'mouseleave') {
        $(this).stop().animate({ left: -85 }, { duration: 300 });
        $('#pager-left-under').stop().animate({ left: -85 }, { duration: 300 });
        //$(this).removeClass('thumb-hover');
    }
});

$('#pager-right').live('hover', function (e) {

    if (e.type == 'mouseenter') {
        $(this).stop().animate({ right: 0 }, { duration: 300 });
        $('#pager-right-under').stop().animate({ right: -65 }, { duration: 300 });
    } else if (e.type == 'mouseleave') {
        $(this).stop().animate({ right: -10 }, { duration: 300 });
        $('#pager-right-under').stop().animate({ right: -87 }, { duration: 300 });
    }
});

/* Window resizing
-------------------------------------------------------------- */
function resizeHandler() {
    resizeWork();
}
function resizeWork() {

    var img = $('#content-main-img') || $('#aboutMeImg');

    if ($('#aboutMeImg').length == 1)
        img = $('#aboutMeImg');

        var imgRatio = img.width() / img.height();
        var imgWidth = $(window).width();
        var imgHeight = imgWidth / imgRatio;

        if (imgHeight < $(window).height()) {
            imgHeight = $(window).height();
            imgWidth = imgHeight * imgRatio;
        }
        var gapLeft = ($(window).width() - imgWidth) / 2;
        var gapTop = ($(window).height() - imgHeight) / 2;
        img.css({ left: gapLeft, top: gapTop, width: imgWidth, height: imgHeight });

}
$(window).resize(resizeHandler);

var Slide = function () {
    this.swf = "";
    this.poster = "";
    this.icon = {};
    this.icon.on = "";
    this.icon.off = "";
    this.id = "";
    this.info = "";
    this.link = "";
    this.type = "";
}


var preloadImg = function (src) {

    if (src == undefined) return;

    new Image().src = src;
}