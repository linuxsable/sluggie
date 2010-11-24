// Helper methods
var helpers = {
    // Generate a random number. Max length is the largest
    // value the random number will go to. This generator
    // includes 0 in the range.
    generateRandomNumber: function(maxLength) {
        return Math.floor(Math.random() * ++maxLength);
    },

	detectRectangleIntersect: function(b1, b2) {
		return !( (b1.top > b2.bottom) || (b1.bottom < b2.top)
				|| (b1.right < b2.left) || (b1.left > b2.right) );
	},
	
	getUniqueId: (function () {
		var unique = 0;
		return function () {
			unique++;
			return unique;
		};
	})()	
};

// Some augmentation
Array.prototype.empty = function() {
    if (this.length > 0) {
        return false;
    }
    return true;
};

// Some more
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}