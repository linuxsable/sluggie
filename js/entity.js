// todo: an abstract Entity, but maybe finish fleshing out functionality first
var WallEntity = function(coord, size, style) {
	this.entityType = 'wall';
	this.id = helpers.getUniqueId();
	this.pos = coord;
	this.size = size;
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	
	this.render = function(context) {
		context.fillStyle = "rgba(56, 254, 19, 1)";  
        context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
	};
};	

var FruitEntity = function(coord, lifespan, style) {
	this.entityType = 'fruit';
	this.id = helpers.getUniqueId();
	this.dob = (new Date()).getTime();
	this.pos = coord;
	this.size = new Size(10, 10);
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.lifespan = lifespan || 5;	// seconds
	
	this.render = function(context) {
        context.fillStyle = "rgba(233, 100, 200, 1)";
        context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
        // context.drawImage(imageCache.fruit, this.pos.x, this.pos.y);
	};
	
	this.update = function() {
		if ((new Date()).getTime() > (this.dob + (this.lifespan * 1000))) {
			this.die();
		}
	};
	
	this.move = function(coord) {
		this.pos = coord;
		this.bounds = new Bounds(this.pos, this.size);
	};
	
	this.die = function() {
		// fireEvent(entityDeath, this.entityType, this.entityId);
		s.entityDeath(this.entityType, this.id);
	};
};

var SaltEntity = function(coord, style) {
	this.entityType = 'salt';
	this.id = helpers.getUniqueId();
	this.dob = (new Date()).getTime();
	this.pos = coord;
	this.size = new Size(15, 15);
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.lifespan = lifespan || 4;	// seconds
	
	this.render = function(context) {
		//context.fillStyle = "rgba(192, 192, 192, 1)";
		//context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
		context.drawImage(imageCache.salt, this.pos.x, this.pos.y);
	};
	
	this.update = function() {
		if ((new Date()).getTime() > (this.dob + (this.lifespan * 1000))) {
			this.die();
		}
	};
	
	this.move = function(coord) {
		this.pos = coord;
		this.bounds = new Bounds(this.pos, this.size);
	};
	
	this.die = function() {
		// fireEvent(entityDeath, this.entityType, this.entityId);
		s.entityDeath(this.entityType, this.id);
	};
};

var SluggieEntity = function(coord, style) {
	this.entityType = 'player';
	this.id = helpers.getUniqueId();
	this.class = 'sluggie-entity';
	this.dob = (new Date()).getTime();
	this.pos = coord;
	this.size = new Size(10, 10);
	this.bounds = new Bounds(this.pos, this.size);
	this.style = style;
	this.direction = [0, 0];
	this.currentDirectionName = '';
	this.speed = 5;
	
	this.render = function(context) {
        context.fillStyle = "rgba(233, 230, 200, 1)";
        context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
	};
	
	this.setDirection = function(newDirection) {
		switch (newDirection) {
			case 'up':
				if (this.currentDirectionName != 'down') {
				    this.currentDirectionName = newDirection;
    				this.direction = [0, -1];
				}
				break;
			case 'down':
			    if (this.currentDirectionName != 'up') {
			        this.direction = [0, 1];
    				this.currentDirectionName = newDirection;
			    }
				break;
			case 'left':
			    if (this.currentDirectionName != 'right') {
			        this.direction = [-1, 0];
    				this.currentDirectionName = newDirection;
			    }
				break;
			case 'right':
			    if (this.currentDirectionName != 'left') {
			        this.direction = [1, 0];
    				this.currentDirectionName = newDirection;
			    }
				break;
			case 'stop':
				this.direction = [0, 0];
				this.currentDirectionName = newDirection;
				break;
		}
	};
	
	this.update = function() {
		this.move(new Coord(
		    this.pos.x + (this.direction[0] * this.speed),
		    this.pos.y + (this.direction[1] * this.speed)
		));
	};
	
	this.move = function(coord) {
		this.pos = coord;
		this.bounds = new Bounds(this.pos, this.size);
	};
	
	this.handleCollision = function(targetEntity) {
		switch (targetEntity.entityType) {
			case 'wall':
			    this.setDirection('stop');
                s.endGame();
			    break;
			case 'poison':
			    break;
			case 'body':
				console.log('OWWWW - cut it out!!  - Sluggie');
				this.setDirection('stop');
                s.endGame();
				break;
			case 'fruit':
				console.log('nom nom nom nom  - Sluggie');
				$('#eat-sound')[0].play();
				Scoreboard.incrementScore();
				Scoreboard.renderUpdate();
				
				targetEntity.die();
				//grow slug
				break;
			default:
				console.log('umm... found this:  - Sluggie');
				console.log(targetEntity);
				// Error - this should not occur
		}
	};
};
