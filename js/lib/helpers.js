/* Helper */

var tokenizer = function (object, content) {

    if (!object || !content) return;

    for (var token in object) {
        content = content.replaceAll("^^" + token.toString() + "^^", object[token]);
    }

    return content;
}




Array.prototype.shuffle = function () { //v1.0
    for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};


String.prototype.replaceAll = function (s1, s2) { return this.split(s1).join(s2) }

Array.prototype.clone = function () { return this.slice(0); }

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}