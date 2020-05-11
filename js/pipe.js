/**
 * @param {[type]} pipeup   [上管道地址]
 * @param {[type]} pipedown [下管道地址]
 * @param {[type]} step     [步长]
 * @param {[type]} x        [管道的x位置]
 */
function Pipe(pipeup,pipedown,step,x) {
	//上管道
	this.pipeup = pipeup;
	//下管道
	this.pipedown = pipedown;
	this.step = step;
	this.x = x;
	//定义上管子高度
	this.pipeup_h = parseInt(Math.random() * 249) + 1;
	//定义下管子高度 512-112-250 = 250
	this.pipedown_h = 250 - this.pipeup_h;
	//计数器
	this.count = 0;
}

//创建新的管子
Pipe.prototype.createPipe = function(argument){
	return new Pipe(this.pipeup,this.pipedown,this.step,this.x);
};