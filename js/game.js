/**
 * @param {[type]} ctx      [画笔]
 * @param {[type]} bird     [鸟类]
 * @param {[type]} pipe     [管子类]
 * @param {[type]} land     [底面类]
 * @param {[type]} mountain [背景（山）]
 */
function Game(ctx, bird, pipe, land, mountain) {
  this.ctx = ctx;
  this.bird = bird;
  this.pipeArr = [pipe];
  this.land = land;
  this.mountain = mountain;
  this.timer = null;

  //执行初始化
  this.init();
}

//初始化游戏
Game.prototype.init = function () {
  //点击事件
  this.bindEvent();
  //游戏开始
  this.start();
};

//游戏开始
Game.prototype.start = function () {
  var that = this;
  var iframe = 0;
  this.timer = setInterval(function () {
    iframe++;
    that.clear();
    that.renderMountain();
    that.renderLand();
    that.birdPoints();
    that.pipePoints();
    that.renderPipe();
    that.pipeMove();
    if (!(iframe % 70)) {
      that.createPipe();
    }
    that.removePipe();
    that.bird.descend();
    that.renderBird();
    //小鸟翅膀动起来
    //判断小鸟的状态，让上升时翅膀扇动得更快
    if (that.bird.state === "d") {
      if (!(iframe % 5)) {
        that.bird.fly();
      }
    } else {
      if (!(iframe % 2)) {
        that.bird.fly();
      }
    }

    that.checkBoom();
  }, 30);
};

//清屏
Game.prototype.clear = function () {
  this.ctx.clearRect(0, 0, 360, 512);
};

//渲染山背景
Game.prototype.renderMountain = function () {
  //获取图片
  var img = this.mountain.img;
  //改变图片的x坐标，让图片动起来
  this.mountain.x -= this.mountain.step;
  //判断，当图片移动了一个图片的宽度时，让x = 0
  if (this.mountain.x < -img.width) {
    this.mountain.x = 0;
  }
  //canvas上渲染图片 
  this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
  this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
  this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);
};

//渲染地面景
Game.prototype.renderLand = function () {
  //获取图片
  var img = this.land.img;
  //改变图片的x坐标，让图片动起来
  this.land.x -= this.land.step;
  //判断，当图片移动了一个图片的宽度时，让x = 0
  if (this.land.x < -img.width) {
    this.land.x = 0;
  }
  //canvas上渲染图片
  this.ctx.drawImage(img, this.land.x, this.land.y);
  this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
  this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
};

//渲染小鸟
Game.prototype.renderBird = function () {
  //获取图片
  var img = this.bird.img;
  var deg = Math.PI / 180;
  //保存当前状态
  this.ctx.save();
  //改变canvas中心点
  this.ctx.translate(this.bird.x, this.bird.y);
  //设置小鸟上升下降的头的方向
  if (this.bird.state === "d") {
    this.ctx.rotate(deg * this.bird.speed);
  } else {
    this.ctx.rotate(-deg * this.bird.speed);
  }
  //渲染小鸟
  this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
  //恢复状态
  this.ctx.restore();
};

//添加点击事件，让小鸟上升
Game.prototype.bindEvent = function () {
  var that = this;
  document.onclick = function () {
    that.bird.rise();
  }
};

//渲染管道
Game.prototype.renderPipe = function () {
  this.pipeArr.forEach(function (element, index) {
    //上管子
    //获取图片
    var img_up = element.pipeup;
    //上管道的数据
    var pipe_x = 0;
    var pipe_y = img_up.height - element.pipeup_h;
    var pipe_w = img_up.width;
    var pipe_h = element.pipeup_h;
    var cvs_x = element.x - element.count * element.step;
    var cvs_y = 0;
    var cvs_w = img_up.width;
    var cvs_h = img_up.height - pipe_y;
    //canvas上 渲染上管道图片
    this.ctx.drawImage(img_up, pipe_x, pipe_y, pipe_w, pipe_h, cvs_x, cvs_y, cvs_w, cvs_h);
    //下管子
    var img_dowm = element.pipedown;
    //下管道的数据
    //图片截取的位置
    var pipe_up_x = 0;
    var pipe_up_y = 0;
    //图片的宽高
    var pipe_up_w = img_dowm.width;
    var pipe_up_h = element.pipedown_h;
    //放置在canvas上的xy位置
    var cvs_up_x = element.x - element.count * element.step;
    var cvs_up_y = element.pipeup_h + 150;
    //放置在canvas上的宽高
    var cvs_up_w = img_dowm.width;
    var cvs_up_h = 250 - element.pipeup_h;
    //canvas上 渲染上管道图片
    this.ctx.drawImage(img_dowm, pipe_up_x, pipe_up_y, pipe_up_w, pipe_up_h, cvs_up_x, cvs_up_y, cvs_up_w, cvs_up_h);
  });
};

//管子移动
Game.prototype.pipeMove = function () {
  this.pipeArr.forEach(function (element, index) {
    element.count++;
  });
}

//创建管子
Game.prototype.createPipe = function () {
  var pipe = this.pipeArr[0].createPipe();
  this.pipeArr.push(pipe);
}

//清理管子
Game.prototype.removePipe = function () {
  var that = this;
  //循环判断 管子在canvas上的x坐标
  this.pipeArr.forEach(function (element, index) {
    var cvs_up_x = element.x - element.count * element.step;
    //当管子完全消失时，在数组中删除这个管子
    if (cvs_up_x < -element.pipeup.width) {
      // that.pipeArr.shift();
      that.pipeArr.splice(index, 1);
    }
  });
}

//小鸟的四个点
Game.prototype.birdPoints = function () {
  //绘制鸟的四个点  顺时针 ABCD
  var bird_A = {
    x: -this.bird.img.width / 2 + this.bird.x + 6,
    y: -this.bird.img.height / 2 + this.bird.y + 6
  }

  var bird_B = {
    x: bird_A.x + this.bird.img.width - 12,
    y: bird_A.y
  }

  var bird_C = {
    x: bird_B.x,
    y: bird_B.y + this.bird.img.height - 12
  }

  var bird_D = {
    x: bird_A.x,
    y: bird_C.y
  }

  //开始绘制
  this.ctx.beginPath();
  this.ctx.lineTo(bird_A.x, bird_A.y);
  this.ctx.lineTo(bird_B.x, bird_B.y);
  this.ctx.lineTo(bird_C.x, bird_C.y);
  this.ctx.lineTo(bird_D.x, bird_D.y);
  this.ctx.closePath();
  // this.ctx.strokeStyle = "red";
  this.ctx.strokeStyle = "rgba(0,0,0,0)";
  this.ctx.stroke();
  // console.log("test");
}

//管子的八个点
Game.prototype.pipePoints = function () {
  this.pipeArr.forEach(function (element, index) {
    //绘制上管子四个点 	顺时针 ABCD
    var pipe_up_A = {
      x: element.x - element.step * element.count,
      y: 0
    };
    var pipe_up_B = {
      x: element.x - element.step * element.count + element.pipeup.width,
      y: 0
    };

    var pipe_up_C = {
      x: pipe_up_B.x,
      y: element.pipeup_h
    };

    var pipe_up_D = {
      x: pipe_up_A.x,
      y: element.pipeup_h
    };

    //绘制
    this.ctx.beginPath();
    this.ctx.lineTo(pipe_up_A.x, pipe_up_A.y);
    this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
    this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
    this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
    this.ctx.closePath();
    // this.ctx.strokeStyle = "red";
    this.ctx.strokeStyle = "rgba(0,0,0,0)";
    this.ctx.stroke();

    //下管子
    var pipe_down_A = {
      x: pipe_up_A.x,
      y: element.pipeup_h + 150
    };
    var pipe_down_B = {
      x: pipe_up_B.x,
      y: pipe_down_A.y
    };

    var pipe_down_C = {
      x: pipe_down_B.x,
      y: pipe_down_B.y + element.pipedown_h
    };

    var pipe_down_D = {
      x: pipe_down_A.x,
      y: pipe_down_C.y
    };

    //绘制
    this.ctx.beginPath();
    this.ctx.lineTo(pipe_down_A.x, pipe_down_A.y);
    this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
    this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
    this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
    this.ctx.closePath();
    // this.ctx.strokeStyle = "bulue";
    this.ctx.strokeStyle = "rgba(0,0,0,0)";
    this.ctx.stroke();

  });
}

// 碰撞检测
Game.prototype.checkBoom = function () {
  var that = this;
  this.pipeArr.forEach(function (element, index) {
    //小鸟的四个点
    var bird_A = {
      x: -that.bird.img.width / 2 + that.bird.x + 6,
      y: -that.bird.img.height / 2 + that.bird.y + 6
    }

    var bird_B = {
      x: bird_A.x + that.bird.img.width - 12,
      y: bird_A.y
    }

    var bird_C = {
      x: bird_B.x,
      y: bird_B.y + that.bird.img.height - 12
    }

    var bird_D = {
      x: bird_A.x,
      y: bird_C.y
    }

    //绘制上管子四个点 	顺时针 ABCD
    var pipe_up_A = {
      x: element.x - element.step * element.count,
      y: 0
    };
    var pipe_up_B = {
      x: element.x - element.step * element.count + element.pipeup.width,
      y: 0
    };

    var pipe_up_C = {
      x: pipe_up_B.x,
      y: element.pipeup_h
    };

    var pipe_up_D = {
      x: pipe_up_A.x,
      y: element.pipeup_h
    };


    //下管子
    var pipe_down_A = {
      x: pipe_up_A.x,
      y: element.pipeup_h + 150
    };
    var pipe_down_B = {
      x: pipe_up_B.x,
      y: pipe_down_A.y
    };

    var pipe_down_C = {
      x: pipe_down_B.x,
      y: pipe_down_B.y + element.pipedown_h
    };

    var pipe_down_D = {
      x: pipe_down_A.x,
      y: pipe_down_C.y
    };

    // 用鸟的B点x值与上管子的C点的x值进行对比
    if (bird_B.x >= pipe_up_D.x && bird_B.y <= pipe_up_D.y && bird_D.x < pipe_up_C.x) {
      console.log("撞到上管子了");
      // 游戏结束
      that.gameOver();
    }

    // 与下管子进行比较
    if (bird_C.x >= pipe_down_A.x && bird_C.y >= pipe_down_A.y && bird_D.x < pipe_down_C.x) {
      console.log("撞到下管子了");
      // 游戏结束
      that.gameOver();
    }

    //与地面比较 (实际上就是比较小鸟的下面y坐标与下管道下面y坐标)
    if (bird_C.y >= pipe_down_C.y) {
      console.log("撞到地面了");
      // 游戏结束
      that.gameOver();
    }
  });

}

// 游戏结束
Game.prototype.gameOver = function () {
  // 清除定时器
  clearInterval(this.timer);
}