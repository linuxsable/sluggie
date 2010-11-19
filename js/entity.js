// todo: an abstract Entity, but maybe finish fleshing out functionality first
var WallEntity = function(coord, size, style) {
	this.entityType = 'wall';
	this.id = helpers.getUniqueId();
	this.pos = coord;
	this.size = size;
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.render = function (context) {
		context.fillStyle = "rgba(15, 100, 50, 1)";  
        context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
	};
};	

var FruitEntity = function(coord, lifespan, style) {
	this.entityType = 'fruit';
	this.id = helpers.getUniqueId();
	this.dob = (new Date()).getTime();
	this.pos = coord;
	this.size = new Size(15, 15);
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.lifespan = lifespan || 3;	// seconds
	
	this.render = function (context) {
		//context.fillStyle = "rgba(233, 100, 200, 1)";
		//context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
		context.drawImage(imageCache.fruit, this.pos.x, this.pos.y);
	};
	this.update = function () {
		if((new Date()).getTime() > (this.dob + (this.lifespan * 1000))) {
			this.die();
		}
	};
	this.move = function (coord) {
		this.pos = coord;
		this.bounds = new Bounds(this.pos, this.size);
	};
	this.collision = function (targetEntity) {
		this.die();
	};
	this.die = function() {
		// fireEvent(entityDeath, this.entityType, this.entityId);
		s.entityDeath(this.entityType, this.id);
	};
};

var SaltEntity = function (coord, style) {
	this.entityType = 'salt';
	this.id = helpers.getUniqueId();
	this.dob = (new Date()).getTime();
	this.pos = coord;
	this.size = new Size(15, 15);
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.lifespan = lifespan || 4;	// seconds
	
	this.render = function (context) {
		//context.fillStyle = "rgba(192, 192, 192, 1)";
		//context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
		context.drawImage(imageCache.salt, this.pos.x, this.pos.y);
	};
	this.update = function () {
		if((new Date()).getTime() > (this.dob + (this.lifespan * 1000))) {
			this.die();
		}
	};
	this.move = function (coord) {
		this.pos = coord;
		this.bounds = new Bounds(this.pos, this.size);
	};
	this.collision = function (targetEntity) {
		this.die();
	};
	this.die = function() {
		// fireEvent(entityDeath, this.entityType, this.entityId);
		s.entityDeath(this.entityType, this.id);
	};
};

var SluggieEntity = function(coord, style) {
	this.entityType = 'player';
	this.id = helpers.getUniqueId();
	this.dob = (new Date()).getTime();
	this.pos = coord;
	this.size = new Size(15, 15);
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.direction = [0, 0];
	this.speed = 1;
	
	this.render = function (context) {
		//context.fillStyle = "rgba(233, 233, 200, 1)";
		//context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
		context.drawImage(imageCache.slug, this.pos.x, this.pos.y);
	};
	
	this.setDirection = function (newDirection) {
		switch(newDirection) {
			case 'up':
				this.direction = [0, -1];
				break;
			case 'down':
				this.direction = [0, 1];
				break;
			case 'left':
				this.direction = [-1, 0];
				break;
			case 'right':
				this.direction = [1, 0];
				break;
			default:
				$.noop();
		}
	};
	this.update = function () {
		this.move(new Coord(this.pos.x + (this.direction[0] * this.speed), this.pos.y + (this.direction[0] * this.speed) ));
	};
	this.move = function (coord) {
		this.pos = coord;
		this.bounds = new Bounds(this.pos, this.size);
	};
	this.collision = function (targetEntity) {
		switch(targetEntity.entityType) {
			case 'wall':
			case 'poison':
			case 'body':
				// fireEvent EndGame
				break;
			case 'food':
				//grow slug
				break;
			default:
				// Error - this should not occur
		}
	};
};
