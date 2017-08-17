/**
 * Created by Administrator on 2017/4/8.
 *老子日狗了
 */
var game={
    data:null,//TODO 保存R和C的的二位数组
    RN:4,//TODO 总行数
    CN:4,// TODO 总列数
    score:0,//TODO 游戏的分数
    top1:0,// TODO 最高分
    state:1,//TODO 保存游戏当前的状态
    RUNNING:1,//TODO 定义运行状态 1
    GAMEOVER:0,//TODO 定义游戏状态 0
    MARGGIN:16,//TODO 每个格之间的间距
    CSIZE:100,//TODO 保存每个格子的宽和高
    getTop:function(){//TODO 获得cookie中最高分
        var cookies=document.cookie.split("; ");
        for(var i=0;i<cookies.length;i++) {
            var kv = cookies[i].split("=");
            cookies[kv[0]] = kv[1];
        }
        return cookies["top1"]||0;
    },
    setTop:function(){
        var now=new Date();
        now.setFullYear(now.getFullYear()+10);
        document.cookie="top1="+this.score+";expires="+now.toGMTString();
    },
    getInnerHTML:function(){
        for(var r= 0,arr=[];r<=this.RN-1;r++){
            for(var c=0;c<=this.CN-1;c++ ) {
                arr.push(""+r+c);
            }
        }
        //TODO 初始化游戏的行数和列数
        var htmlcontent='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
        htmlcontent+='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>'
        return htmlcontent;
    },
    start:function(){//TODO 启动游戏方法
        //TODO 找到id为gridPanel的div
        var div=document.getElementById("gridPanel");
        div.innerHTML=this.getInnerHTML();
        div.style.width=this.CN*this.CSIZE+this.MARGGIN*(this.CN+1)+"px";
        div.style.height=this.RN*this.CSIZE+this.MARGGIN*(this.RN+1)+"px";
        this.state=this.RUNNING;
        this.data=[];
        for(var r=0;r<=this.RN-1;r++){
            this.data.push([]);
            for(var c=0;c<=this.CN-1;c++ ) {
               this.data[r][c]=0;
            }
        }
        this.score=0;//TODO 重置分数
        this.top1=this.getTop();
        this.rendomNum();
        this.rendomNum();
        this.updateView();
        this.getInnerHTML();
        var me=this;
        //TODO 为当前网页绑定键盘按下事件
        if(this.state==this.RUNNING) {
            document.onkeydown = function () {
                var e = window.event || arguments[0];
                switch (e.keyCode) {
                    case 37:
                        me.moveLeft();
                        break;
                    case 39:
                        me.moveRight();
                        break;
                    case 38:
                        me.moveUp();
                        break;
                    case 40:
                        me.moveDown();
                        break;
                }
            }
        }
    },
    rendomNum:function(){//Todo 在随机空白位置生成2或者4
        for(;;) {
            var r = parseInt(Math.random() * this.RN);
            var c = parseInt(Math.random() * this.CN);
            if (this.data[r][c] == 0) {
                this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
                break;
            }

        }
     },
    updateView:function(){//TODO 更新界面
       for(var r=0;r<this.RN;r++){
           for(var c=0;c<this.CN;c++){
              var div=document.getElementById("c"+r+c);

               if(this.data[r][c]){
                   div.innerHTML=this.data[r][c];
                   div.className="cell n"+this.data[r][c];
               }else{
                   div.innerHTML="";
                   div.className="cell";
               }
           }
       }
        //TODO 将游戏分数显示在界面上
        document.getElementById("score").innerHTML=this.score;
        //TODO 显示最高分
        document.getElementById("top").innerHTML=this.top1;
        //TODO 根据游戏状态修改页面
       var div1 = document.getElementById("gameOver");
        if(this.state==this.RUNNING){
            div1.style.display="none";
        }else{
            div1.style.display="block";
            document.getElementById("final").innerHTML=this.score;
        }

    },
    moveLeft:function(){//TODO 左移所有行
        this.move(function(){
            for(var r=0;r<this.RN;r++){
                this.moveLeftInRow(r);
            }
        })
    },
    moveLeftInRow:function(r){//TODO 左移第r行

        for(var c=0;c<this.CN-1;c++){
        var nextc=this.getNextInRow(r,c);
            if(nextc==-1){break}
            else if(this.data[r][c]==0){
                    this.data[r][c]=this.data[r][nextc]
                    this.data[r][nextc]=0;
                    c--;
            }else if(this.data[r][c]==this.data[r][nextc]){
                    this.score+=this.data[r][c]*=2;
                    this.data[r][nextc]=0;
            }
        }

    },
    getNextInRow:function(r,c){//TODO 查找下一个不为0的位置

        for(var nextc=c+1;nextc<this.CN;nextc++){
            if(this.data[r][nextc]!=0){
                return nextc;
            }
        }
        return -1;
    },
    moveRight:function(){
        this.move(function(){
            for(var r=0;r<this.RN;r++){
                this.moveRightInRow(r);
            }
        })
    },
    moveRightInRow:function(r){
        for(var c=this.CN-1;c>0;c--){
            var prevc=this.getPrevcInRow(r,c);
            if(prevc==-1){break}
            else if(this.data[r][c]==0){
                this.data[r][c]=this.data[r][prevc]
                this.data[r][prevc]=0;
                c++;
            }else if(this.data[r][c]==this.data[r][prevc]){
                this.score+=this.data[r][c]*=2;
                this.data[r][prevc]=0;
            }
        }
    },
    getPrevcInRow:function(r,c){
        for(var prevc=c-1;prevc>=0;prevc--){
            if(this.data[r][prevc]!=0){
                return prevc;
            }
        }
        return -1;
    },
    move:function(iterator){
        var before=String(this.data);
        iterator.call(this);
        var after=String(this.data);
        if(before!=after){
            this.rendomNum();
            //TODO 检查游戏是否结束
            if(this.isGameOver()){
                this.state=this.GAMEOVER;
                this.score>this.top1&&this.setTop();
            }
            this.updateView();
        }
    },
    isGameOver:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++ ) {
                if(this.data[r][c]==0){
                    return false;
                }else if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){
                    return false
                }else if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){
                    return false
                }
            }
        }
        return true;
    },
    moveUp:function(){
        this.move(function(){
            for(var c=0;c<this.CN;c++){
                this.moveUpInCol(c);
            }
        })
    },
    moveUpInCol:function(c){
        for(var r=0;r<this.RN-1;r++){
            var nextr=this.getDownInCol(r,c);
            if(nextr==-1){break}
            else if(this.data[r][c]==0){
                this.data[r][c]=this.data[nextr][c];
                this.data[nextr][c]=0;
                r--;
            }else if(this.data[r][c]==this.data[nextr][c]){
                this.score+=this.data[r][c]*=2;
                this.data[nextr][c]=0;
            }
        }
    },
    getDownInCol:function(r,c){

        for(var nextr=r+1;nextr<this.RN;nextr++){
            if(this.data[nextr][c]!=0){
                return nextr;
            }
        }
        return -1;

    },
    moveDown:function(){
        this.move(function(){
            for(var c=0;c<this.CN;c++){
                this.moveDownInCol(c);
            }
        })
    },
    moveDownInCol:function(c){
        for(var r=this.RN-1;r>0;r--){
            var prevr=this.getUpInRow(r,c);
            if(prevr==-1){break}
            else if(this.data[r][c]==0){
                this.data[r][c]=this.data[prevr][c]
                this.data[prevr][c]=0;
                r++;
            }else if(this.data[r][c]==this.data[prevr][c]){
                this.score+=this.data[r][c]*=2;
                this.data[prevr][c]=0;
            }
        }
    },
    getUpInRow:function(r,c){
        for(var prevr=r-1;prevr>=0;prevr--){
            if(this.data[prevr][c]!=0){
                return prevr;
            }
        }
        return -1;
    }

}
function getTime(){
    var now=new Date();
    var h=now.getHours();
    h<10&&(h="0"+h);
    var time=h<12? "上午":"下午";
    var m=now.getMinutes();
    m<10&&(m="0"+m);
    var s=now.getSeconds();
    s<10&&(s="0"+s)
    document.getElementById("timer").innerHTML="现在时刻:"+time+h+":"+m+":"+s;
}
var timer;
window.onload=function(){
    game.start();//TODO 游戏开始
    timer=setInterval(getTime,1000);//TODO 当前时间
}
