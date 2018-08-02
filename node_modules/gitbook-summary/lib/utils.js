module.exports = {
    // copy `from`'s value which is not in `to`
    merge: function(from, to) {
        for (var key in from) {
            if (typeof to[key] === "undefined") {
                to[key] = from[key]
            }
        }
    },

    // copy `from`'s value which key is the same as  `to`'s key to `to`
    rewrite: function(from, to) {
        for (var key in to) {
            if (typeof from[key] !== "undefined") {
                to[key] = from[key];
            }
        }
    }    
};
