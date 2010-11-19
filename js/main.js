
var Coord = function(x, y) {
	this.x = x;
	this.y = y;
};

var Size = function(width, height) {
	this.width = width;
	this.height = height || width;
};

var Bounds = function(pos, size) {
	if ($.isArray(pos)) {
		this.top = pos[0];
		this.right = pos[1];
		this.bottom = pos[2];
		this.left = pos[3];
	} else {
		this.top = pos.y;
		this.right = pos.x + size.width;
		this.bottom = pos.y + size.height;
		this.left = pos.x;
	}
};

var imageCache = {};

// Main game object
var SluggieGame = function() {
	this.GAME_LOOP_INTERVAL = 200.0;
	this.CANVAS_WIDTH = 800;
	this.CANVAS_HEIGHT = 600;
	this.WALL_SIZE = 15;
	this.DEFAULT_ENTITY_SIZE = 32;
	
	this.canvas = null;
    this.canvasContext = null;
    this.canvasBuffer = null;
    this.canvasBufferContext = null;
    
    this.entities = {
		player: {},
        fruit: {},
		salt: {},
        wall: {}
    };
   
    this.initCanvas = function() {    
		this.canvas = $('#canvas')[0];
		$(this.canvas).attr({
			'width': this.CANVAS_WIDTH,
			'height': this.CANVAS_HEIGHT
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
		
		imageCache.fruit = document.createElement('image');
		imageCache.fruit.src = 'assets/fruit.gif';
		imageCache.slug = document.createElement('image');
		imageCache.slug.src = 'assets/slug.png';
		
		
		this.plotWalls();
		this.plotSluggie();
		
		// todo: this to be sequenced after a startup screen, and eventually even level selector
		this.startGame();
		return true;
	};
	
	this.startGame = function () {
		// todo: place the snake in a random position, and set direction to least-dangerous
		// if there is already an interval, clear it
		// set up a new game and start the loop
		var context = this;
		this.interval = setInterval(function() {
			context.gameLoop();
		}, this.GAME_LOOP_INTERVAL);
	};
	
	this.endGame = function () {
		// clear the interval
		clearInterval(this.interval);
		
		// spawn the endgame overlay
	};
	this.gameLoop = function() {
		if ($.isEmptyObject(this.entities.fruit)) {
			this.plotFruit();
		}
		
		this.update();
		this.drawFrame();
		
	};

	this.update = function() {
		// update game variables, handle user input, perform calculations etc.
		for(var catIdx in this.entities) {
			for(var entityIdx in this.entities[catIdx]) {
				if(this.entities[catIdx][entityIdx].update) {
					this.entities[catIdx][entityIdx].update();
				}
			}
		}
	};
	
	this.drawFrame = function() {
		this.renderToBuffer();
		this.canvasContext.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		this.canvasContext.drawImage(this.canvasBuffer, 0, 0);
	};
	
	// render the walls around the outside edge of the universe
	this.plotWalls = function() {
		var walls = [];
		
		// Horizontal
		walls.push(new WallEntity(
			new Coord(0, 0), 
			new Size(this.CANVAS_WIDTH, this.WALL_SIZE)));
		walls.push(new WallEntity(
			new Coord(0, this.CANVAS_HEIGHT - this.WALL_SIZE), 
			new Size(this.CANVAS_WIDTH, this.WALL_SIZE)));
		
		// Vertical
		walls.push(new WallEntity(
			new Coord(0, this.WALL_SIZE), 
			new Size(this.WALL_SIZE, this.CANVAS_HEIGHT - (this.WALL_SIZE * 2))));
		walls.push(new WallEntity(
			new Coord(this.CANVAS_WIDTH - this.WALL_SIZE, this.WALL_SIZE), 
			new Size(this.WALL_SIZE, this.CANVAS_HEIGHT - (this.WALL_SIZE * 2))));
		
		for(var i = 0, length = walls.length; i < length; i++) {
			this.entities.wall[walls[i].id] = walls[i];
		}
	};
	
	// Returns false is fruit is already present,
	// true if a new fruit has been plotted.
	this.plotFruit = function() {
		if (!$.isEmptyObject(this.entities.fruit)) {
			return false;
		}
		var fruitSize = new Size(this.DEFAULT_ENTITY_SIZE);
		var fruitMargin = 15;

		var fruitCoord = this.getRandomEmptySpace(fruitSize, fruitMargin);

		var fruit = new FruitEntity(fruitCoord);

		this.entities.fruit[fruit.id] = fruit;

		return true;
	};
	
	this.plotSluggie = function() {
		if (!$.isEmptyObject(this.entities.fruit)) {
			return false;
		}
		
		var slugSize = new Size(this.DEFAULT_ENTITY_SIZE);
		var slugMargin = 15;

		var slugCoord = this.getRandomEmptySpace(slugSize, slugMargin);

		var slug = new SluggieEntity(slugCoord);

		this.entities.player[slug.id] = slug;

		return true;
	};

	this.renderToBuffer = function(param) {
		param = param || {};
		this.canvasBufferContext.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		
		for (var catIdx in this.entities) {
			if(!param.cat || param.cat == catIdx) {
				for(var entityIdx in this.entities[catIdx]) {
					this.entities[catIdx][entityIdx].render(this.canvasBufferContext);
				}
			}
		}
	};

	this.checkForCollisions = function (bounds) {
		for(var catIdx in this.entities) {
			for(var foreignEnt in this.entities[catIdx]) {
				if(helpers.detectRectangleIntersect(bounds, this.entities[catIdx][foreignEnt].bounds)) {
					return foreignEnt;
				}
			}
		}
		return false;
	};
	
	this.getRandomEmptySpace = function(size, margin) {
		// Check to make sure this is going to be the only
 		// occupant of the new coordinates.
		margin = margin || 0;
		var createCoords = function() {
			var o = new Coord(helpers.generateRandomNumber(this.CANVAS_WIDTH - 1), helpers.generateRandomNumber(this.CANVAS_HEIGHT - 1));
			var bounds = new Bounds([o.y - margin, o.x + size.width + margin, o.y + size.height + margin, o.x - margin]);
			if(this.checkForCollisions(bounds)) {
				return createCoords.apply(this);
			} else {
				return o;
			}
		};

		return createCoords.apply(this);
	};
	
	this.entityDeath = function (category, entityId) {
		if(this.entities[category][entityId]) {
			delete this.entities[category][entityId];
		}
	};
	
	this.htmlError = function() {
		alert('html error');
	};
};
