// Helper methods
var helpers = {
    // Generate a random number. Max length is the largest
    // value the random number will go to. This generator
    // includes 0 in the range.
    generateRandomNumber: function(maxLength) {
        return Math.floor(Math.random() * ++maxLength);
    }
};