// Main game object
var SluggieGame = function() {
	this.GAME_LOOP_INTERVAL = 200.0;
	this.BOARD_WIDTH = 100;
	this.BOARD_HEIGHT = 50;
	this.CELL_SIZE = 8;
	
	this.canvas = null;
    this.canvasContext = null;
    this.canvasBuffer = null;
    this.canvasBufferContext = null;
    
    this.board = new Board();
    this.board.init(this.BOARD_WIDTH, this.BOARD_HEIGHT);
    
    this.entities = {
        fruits: [],
        walls: []
    };
    
    this.initCanvas = function() {    
		this.canvas = $('#canvas')[0];
		$(this.canvas).attr({
			'width': this.BOARD_WIDTH * this.CELL_SIZE,
			'height': this.BOARD_HEIGHT * this.CELL_SIZE
		});
		
		if (this.canvas && this.canvas.getContext) {
		    this.canvasContext = this.canvas.getContext('2d');
		    this.canvasBuffer = document.createElement('canvas');
		    this.canvasBuffer.width = this.canvas.width;
		    this.canvasBuffer.height = this.canvas.height;
		    this.canvasBufferContext = this.canvasBuffer.getContext('2d');
		    
		    return true;
		}
		
		return false;
    };
	
	this.init = function() {
		// Check to make sure the canvas is supported
		if (!this.initCanvas()) {
			this.htmlError();
			return false;
		}

		this.plotWalls().drawWalls();
		
		// todo: place the snake in a random position, and set direction to least-dangerous
		
		this.gameLoop();
		
		this.run = setInterval(function() {
			this.gameLoop();
		}.bind(this), this.GAME_LOOP_INTERVAL);
	};
	
	this.gameLoop = function() {
		this.update();
		this.draw();
	};

	this.update = function() {
		// update game variables, handle user input, perform calculations etc.
	};

	this.draw = function() {
		this.plotAndDrawNewFruit();
        this.canvasContext.drawImage(this.canvasBuffer, 0, 0);
	};
	
    // Returns false is fruit is already present,
    // true if a new fruit has been plotted.
	this.plotAndDrawNewFruit = function() {
	    if (!this.entities.fruits.empty()) {
            return false;
	    }
	    
	    // Check to make sure this is going to be the only
        // occupant of the new coordinates.
        var that = this;
	    var createCoords = function() {
            var o = [];
            
            // coords[0] = helpers.generateRandomNumber(this.BOARD_WIDTH - 1);
            // coords[1] = helpers.generateRandomNumber(this.BOARD_HEIGHT - 1);
            
	        o[0] = helpers.generateRandomNumber(that.BOARD_WIDTH - 1);
            o[1] = helpers.generateRandomNumber(that.BOARD_HEIGHT - 1);
	        
	        if (that.board.getOccupant(o)) {
	            return createCoords();
	        } else {
	            return o;
	        }
	    };
	    
	    var coords = createCoords();
        var fruit = new FruitEntity(coords, 1);
        
        this.board.setOccupant(coords, fruit);
        this.drawFruit(fruit);
        this.entities.fruits.push(fruit);
        
        return true;
	};
	
	this.drawFruit = function(fruitEntity) {
        this.canvasBufferContext.fillStyle = "rgba(233, 100, 200, 1)";
        this.canvasBufferContext.fillRect((fruitEntity.coords[0] * this.CELL_SIZE), (fruitEntity.coords[1] * this.CELL_SIZE), (this.CELL_SIZE - 1), (this.CELL_SIZE - 1));
	};
	
	// todo: paint walls around the outside edge of the matrix
	this.plotWalls = function() {
		// Horizontal
		for (var i = 0, length = this.BOARD_WIDTH; i < length; i++) {
			this.board.setOccupant([i, 0], new WallEntity([i, 0], 1));
			this.board.setOccupant([i, this.BOARD_HEIGHT - 1], new WallEntity([i, this.BOARD_HEIGHT - 1], 1));
		}
		
		// Vertical
		for (var i = 1, length = this.BOARD_HEIGHT - 1; i < length; i++) {
			this.board.setOccupant([0, i], new WallEntity([0, i], 1));
			this.board.setOccupant([this.BOARD_WIDTH - 1, i], new WallEntity([this.BOARD_WIDTH - 1, i], 1));
		}
		
        // For chaining
		return this;
	};
	
	this.drawWalls = function() {
	    var layout = this.board.getLayout();

		for (var i = 0, length = layout.length; i < length; i++) {
			for (var j = 0, l2 = layout[i].length; j < l2; j++) {
				if (layout[i][j]) {
					this.canvasBufferContext.fillStyle = "rgba(15, 100, 50, 1)";  
			        this.canvasBufferContext.fillRect((i * this.CELL_SIZE), (j * this.CELL_SIZE), this.CELL_SIZE - 1, this.CELL_SIZE - 1); 
				}
			}
		}
	};
	
	this.htmlError = function() {
		alert('html error');
	};
};

// The main board
var Board = function(width, height) {
	this.matrix = [];
	
	this.init = function(width, height) {
		for (var i = 0; i < width; i++) {
			this.matrix.push([]);
		}
	};
	
	this.setOccupant = function(coord, occupant) {
		this.matrix[coord[0]][coord[1]] = occupant;
	};
	
	this.getOccupant = function(coord) {
	    if (!coord) {
	        return false;
	    }
        else if (!this.matrix[coord[0]]) {
            return false;
        }
        else if (!this.matrix[coord[0]][coord[1]]) {
            return false;
        } 
        else if (this.matrix[coord[0]][coord[1]]) {
            return this.matrix[coord[0]][coord[1]];
        }
	};
	
	this.getLayout = function() {
		return this.matrix;
	};
	
	this.debugMatrix = function() {
		var output = '';
		for (var j = 0; j < this.matrix[0].length; j++) {
			for (var i = 0, length = this.matrix.length; i < length; i++) {
				output += ((this.matrix[i][j]) ? 'X' : '.');
			}
			output += '\n';
		}
		return output;
	};
};

var WallEntity = function(coord, style) {
	this.coords = [coord[0], coord[1]];
	this.style = style;
};	

var FruitEntity = function(coord, style) {
	this.coords = [coord[0], coord[1]];
	this.style = style;
};

var SluggieEntity = function(coord, style) {
	this.coords = [coord[0], coord[1]];
	this.style = style;
};