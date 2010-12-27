Scoreboard = (function() {
   var my = {}, 
   scoreCount = 0,
   scoreValue = 0,
   scoreMultiplier = 10000;
   
   my.setScoreMultiplier = function(value) {
       this.scoreMultiplier = value;
   };
   
   my.incrementScore = function(multiplier) {
       if (multiplier) {
           my.setScoreMultiplier(multiplier);
       }
       
       scoreCount++;
       scoreValue += scoreMultiplier;
   };
   
   my.multiplyScore = function(operand, multiplier) {
       if (multiplier) {
           my.setScoreMultiplier(multiplier);
       }
       
       if (!operand || !parseInt(operand)) {
           throw('Operand must be set and a number');
       }
       
       scoreValue += operand * scoreMultiplier;
   };
   
   my.resetScore = function() {
       scoreCount = 0;
       scoreValue = 0;
   };
   
   my.getScoreValue = function() {
       return scoreValue;
   };
   
   my.getscoreCount = function() {
       return scoreCount;
   };
   
   my.renderUpdate = function() {
       $('#score-num').html(my.getScoreValue());
   };
   
   my.renderEndGameScore = function() {
       $('#end-score').html(my.getScoreValue);
   };
   
   my.debug = function() {
       debugger;
   }
   
   return my;
}());