/**
 * /
 * @param {[type]} imgArr [鸟图片地址]
 * @param {[type]} x      [鸟出现的x位置]
 * @param {[type]} y      [鸟出现的y位置]
 * @param {[type]} step   [步长]
 */
function Bird(imgArr,x,y,step) {
	this.imgArr = imgArr;
	this.x = x;
	this.y = y;
	this.step = step;
	this.index = 0;
	this.img = this.imgArr[this.index];
	//定义变量，控制小鸟的状态
	this.state = "d";
	//定义变量，控制小鸟上升下降的速度
	this.speed = 0;
}

Bird.prototype.fly = function() {
	this.index++;
	if (this.index > this.imgArr.length-1) {
		this.index = 0;
	}
	this.img = this.imgArr[this.index];
}

Bird.prototype.descend = function() {
	if (this.state === "d") {
		this.speed++;
		this.y += Math.sqrt(this.speed);
	}else{
		this.speed--;
		//当speed等于0时，改变小鸟的状态
		if (this.speed === 0) {
			this.state = "d";
		}
		this.y -= Math.sqrt(this.speed);
	}
}

Bird.prototype.rise = function(){
	this.speed = 20;
	this.state = "u";
}