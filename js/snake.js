const width = 20;  //单格长度
const height = 20;   //单格长度
let interval;    //将setInterval Id 设置为全局变量
//用于记录上下左右的键盘指令是否被执行
let command = true;
function drawSnake(body, foodPosition) {
    let html = "";
    body.forEach(function (e) {
        let left = (e.x - 1) * width + 'px';
        let top = (e.y - 1) * height + 'px';
        html += "<div class='block_white' style='top:" + top + ";left:" + left + "'></div>";
    })
    let foodLeft = (foodPosition.x - 1) * width + 'px';
    let foodTop = (foodPosition.y - 1) * height + 'px';
    html += "<div class='food_white' style='top:" + foodTop + ";left:" + foodLeft + "'></div>";
    vm.draw(html);
}

let snake = {
    foodExist: false,
    foodPostion: {
        x: parseInt(Math.random() * 30 / 1 + 1),
        y: parseInt(Math.random() * 30 / 1 + 1),
    },
    head: {               //蛇头  初始坐标(15,15)
        x: 15,
        y: 15,
    },
    oldTail: {
        x: 15,
        y: 15,
    },                    //旧蛇尾
    tail: {               //蛇头  初始坐标(15,15)
        x: 15,
        y: 15,
    },                    //蛇尾
    direction: 'static',      //蛇方向
    nextDeirection: 'static',     //预保存下一个方向
    timeInterval: 100,    //蛇运动间隔
    body: [{ x: 15, y: 15 }],    //蛇身数组
    init: function () {
        vm.changeScore(1);
        this.foodExist = false;
        this.head = {
            x: 15,
            y: 15,
        };
        this.foodPostion = {
            x: parseInt(Math.random() * 30 / 1 + 1),
            y: parseInt(Math.random() * 30 / 1 + 1),
        };
        this.oldTail = {
            x: 15,
            y: 15,
        };
        this.tail = {
            x: 15,
            y: 15,
        };
        this.direction = 'static';
        this.nextDeirection = 'static';
        this.body = [{ x: 15, y: 15 }];
    },
    reDirect: function (newDirection) {   //重定向
        if (command) {
            switch (newDirection) {
                case 'up':
                    if (this.direction != 'down' && this.direction != 'up') {
                        this.nextDeirection = newDirection;
                        break;
                    }
                    break;
                case 'down':
                    if (this.direction != 'down' && this.direction != 'up') {
                        this.nextDeirection = newDirection;
                        break;
                    }
                    break;
                case 'left':
                    if (this.direction != 'right' && this.direction != 'left') {
                        this.nextDeirection = newDirection;
                        break;
                    }
                    break;
                case 'right':
                    if (this.direction != 'right' && this.direction != 'left') {
                        this.nextDeirection = newDirection;
                        break;
                    }
                    break;
            }
        }
    },
    Newfood: function () {
        let food_x = parseInt(Math.random() * 30 / 1 + 1);
        let food_y = parseInt(Math.random() * 30 / 1 + 1);
        let foodPos = {
            x: food_x,
            y: food_y,
        }
        return foodPos;
    },
    add: function () {
        this.tail = this.oldTail;   //吃了一个豆，蛇尾位置不变
    },
    mov: function () {
        let pos = {};
        let index;
        this.direction = this.nextDeirection;
        switch (this.direction) {
            case 'up':
                pos.y = this.head.y - 1;
                pos.x = this.head.x;
                break;
            case 'down':
                pos.y = this.head.y + 1;
                pos.x = this.head.x;
                break;
            case 'left':
                pos.y = this.head.y;
                pos.x = this.head.x - 1;
                break;
            case 'right':
                pos.y = this.head.y;
                pos.x = this.head.x + 1;
                break;
            case 'static':
                pos.y = this.head.y;
                pos.x = this.head.x;
                break;
        }
        this.body.push(pos);
        //蛇头变成新推进来的那一块
        this.head = this.body[this.body.length - 1];
        if (this.head.x === this.foodPostion.x && this.head.y === this.foodPostion.y) {
            this.foodPostion = this.Newfood()
            vm.changeScore(this.body.length);
        } else {
            //移除蛇尾的那一块
            this.oldTail = this.body[0];
            this.body.splice(0, 1);
            //新的蛇尾
            this.tail = this.body[0];
        }
        //上下左右指令已经被执行;
        command = true;
    },
    checkDead: function () {
        let dead = false;
        //蛇头撞蛇身
        for (let i = 0; i < this.body.length - 1; i++) {
            if (this.head.x === this.body[i].x && this.head.y === this.body[i].y) {
                dead = true;
                break;
            }
        }
        //蛇头撞墙
        if (this.head.x <= 0 || this.head.x >= 31 || this.head.y <= 0 || this.head.y >= 31) {
            dead = true;
        }
        return dead;
    }
};

function begin() {
    snake.init();
    clearInterval(interval);
    interval = setInterval(function () {
        snake.mov();
        if (snake.checkDead()) {
            console.log('蛇死了')
            clearInterval(interval)
        } else {
            drawSnake(snake.body, snake.foodPostion);
        }
    }, snake.timeInterval)
}
window.addEventListener('keydown', function (ev) {
    switch (ev.key) {
        case 'ArrowLeft':
            snake.reDirect('left');
            command = false;
            break;
        case 'ArrowRight':
            snake.reDirect('right');
            command = false;
            break;
        case 'ArrowDown':
            snake.reDirect('down');
            command = false;
            break;
        case 'ArrowUp':
            snake.reDirect('up');
            command = false;
            break;
    }
})
begin();