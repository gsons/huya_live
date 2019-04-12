var express = require('express'); 
var RoomData=require('./db/model.js');
var app = express();
var server = require('http').createServer(app);
const Live = require('./index');
const socket = require('./socket')(server);
const roomArray=['896048036','1681752043','1952895812','1186456931','2021320845','520iu','kaerlol','1748573795'];
app.use('/', express.static(__dirname)); 

app.get('/renqiList', function (req, res) {
     var roomid=req.query.roomid;
     var date=req.query.date;
     var roomdata=new RoomData(roomid);
     var resData=roomdata.fetchRenqi(date);
     res.send(JSON.stringify(resData));
  });
app.get('/giftList', function (req, res) {
    var roomid=req.query.roomid;
     var date=req.query.date;
     var roomdata=new RoomData(roomid);
     var resData=roomdata.fetchGift(date);
     res.send(JSON.stringify(resData));
  });

app.get('/rank', function (req, res) {
     var roomid=req.query.roomid;
     var date=req.query.date;
     res.send(getRank(roomid,date));
});


server.listen(8000);
function initRoom(client,roomid) {
    var roomdata=new RoomData(roomid);
    client.on('connect', () => {
        console.log(`已连接虎牙 ${roomid}房间弹幕~`)
    })
    client.on('message', msg => {
    socket.getIO((io) => {
            if(msg.type=='online'){
                roomdata.addRenqi(msg);
                io.emit('online_'+roomid,msg);
                var date = new Date();
                date.setHours(date.getHours()+8);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var today = `${year}-${month}-${day}`;
                io.emit('rank_'+roomid,getRank(roomid,today));
            }
            else if(msg.type=='gift'){
                if(msg.name!='虎粮') roomdata.addGift(msg);
                io.emit('gift_'+roomid,msg);
            }
        });

    })
    client.on('error', e => {
        console.log(`连接虎牙 ${roomid}房间弹幕失败!~`)
    })

    client.on('close', () => {
        console.log(`虎牙 ${roomid}房间弹幕已经关闭连接!~`)
    })

    client.start()
}
roomArray.forEach(function(roomId){
    initRoom(new Live(roomId),roomId);
});

 function getRank(roomid,date){
     var roomdata=new RoomData(roomid);
     var resData=roomdata.fetchGift(date);
     var tmpdata={};
     resData.forEach(function(item){
         let uid=item.from.rid;
         if(tmpdata[uid]){
            var price=tmpdata[uid].price;
            tmpdata[uid]= {from:item.from,price:price+item.price}   
         }else{
            tmpdata[uid]={from:item.from,price:item.price};
         }
         
      });
     return JSON.stringify(tmpdata)
}