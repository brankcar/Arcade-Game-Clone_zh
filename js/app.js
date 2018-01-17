var config = {
    // 容器宽度
    max: 606,
    // 图片参数
    img: {
        height: 171,
        width: 101,
        middle: 85.5, //171/2
    },
    // 敌人与玩家可活动边界
    min_y: 50,
    max_y: 382,
    min_x: 0,
    max_x: 404,
    // 初始化玩家位置
    resetPlayer: {
        x: 202,
        y: 50 + 85.5 * 3,
        row: 4
    },
    // 玩家角色图片名称数组
    player_img_arr: ['char-boy','char-cat-girl','char-horn-girl','char-pink-girl','char-princess-girl'],
    // 返回图片路径拼接字符串
    stringSplit: function(imgName, type){
        return 'images/'+ imgName +'.' + (type || 'png');
    },
    // 某个范围随机数
    randomNumBoth: function(Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.round(Rand * Range); //四舍五入
    }
};

// 这是我们的玩家要躲避的敌人 
var Enemy = function(x, y, row, speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    
    // 敌人的位置
    this.x = x;
    this.y = y;
    // 敌人层数
    this.row = row;
    // 速度
    this.speed = Math.random() * (speed || 300);

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = config.stringSplit('enemy-bug');
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += dt * this.speed;
    // 瓢虫超出边界再次从左侧出发
    if(this.x > config.max){
        this.x = -(config.img.width);
    }
    this.checkCollision();
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 敌人与玩家是否碰撞
Enemy.prototype.checkCollision = function(){
    if(this.row === player.row && this.x >= player.x && this.x <= player.x + config.img.width){
        for(var k in config.resetPlayer){
            player[k] = config.resetPlayer[k];
        }
        if(player.hp === 1){
            alert(`游戏结束！！`);
            player.score = 0;
            player.hp = 3;
        }else{
            player.hp--;
        }
        player.updateScore();
        player.updateHp();
        // console.log(config.stringSplit(config.player_img_arr[config.randomNumBoth(0,config.player_img_arr.length - 1)]))
        player.sprite = config.stringSplit(config.player_img_arr[config.randomNumBoth(0,config.player_img_arr.length - 1)]);
    }/*else{
        // console.log(`游戏进行中。。。enemy.x: ${this.x}, player.x: ${player.x}`)
    }*/
}
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

var Player = function(x, y, row){
    // 玩家位置
    this.x = x;
    this.y = y;
    // 玩家图片
    this.sprite = config.stringSplit(config.player_img_arr[config.randomNumBoth(0,config.player_img_arr.length - 1)]);
    // 玩家所在格子层数
    this.row = row;
    // 玩家生命值
    this.hp = 3;
    // 玩家分数
    this.score = 0;
};
// 重置玩家位置
Player.prototype.reset = function(){
    for(var k in config.resetPlayer){
        this[k] = config.resetPlayer[k];
    }
    this.updateScore();
    this.updateHp();
}
// 更新玩家地址
Player.prototype.update = function(dt){
    
};
// 更新玩家分数
Player.prototype.updateScore = function(){
    document.getElementsByClassName('score')[0].innerHTML = this.score;
};
// 更新玩家生命值
Player.prototype.updateHp = function(){
    var text = '';
    for(var i = 0; i < this.hp; i++){
        text += '❤';
    }
    document.getElementsByClassName('hp')[0].innerHTML = text;
};
// 画出玩家位置
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/**
 * [handleInput 判断键盘操作方向并移动相应位置]
 * @param  {[字符串]} direction [根据事件监听获取到方向字符串]
 */
Player.prototype.handleInput = function(direction){
    // 边界判断
    /*if((this.x <= 0 && direction === 'left') || (this.x >= 404 && direction === 'right') || (this.y <= 40 && direction === 'up') || (this.y >= 382 && direction === 'down')){
        return;
    }*/
    switch(direction){
        case 'left': 
            if(this.x > config.min_x){
                this.x -= 101; 
            }
            break;
        case 'right': 
            if(this.x < config.max_x){
                this.x += 101; 
            }
            break;
        case 'up': 
            if(this.y > config.min_y){
                this.y -= 85.5;
                this.row -= 1;
            }else{
                this.score += 100;
                this.reset();
            }
            break;
        case 'down': 
            if(this.y < config.max_y){
                this.y += 85.5; 
                this.row += 1;
            }
            break;
    };
};


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
/* 
image = {
    height: 171,
    width: 101,
    middle: 85.5 //171/2
}
*/
var allEnemies = [];
// 敌人数量默认为9，生成随机速度，随机层数的敌人
for(var i = 0; i < 9; i++){
    var math = config.randomNumBoth(1, 3);
    allEnemies.push(new Enemy(-101, 50 + 85.5 * (math - 1), math, config.randomNumBoth(300, 1000)))
}
var player = new Player(202, 50 + 85.5 * 3, 4);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
