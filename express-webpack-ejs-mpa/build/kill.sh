var order='lsof -i :3000';
var exec = require('child_process').exec;
exec(order, function(err, stdout, stderr) {
    if(err){ return console.log('端口未占用:',err); }
    stdout.split('\n').filter(function(line){
        var p=line.trim().split(/\s+/);
        var address=p[1];
        if(address!=undefined && address!="PID"){
            exec('kill '+ address,function(err, stdout, stderr){
                    if(err){
                        return console.log('释放指定端口失败！！');
                    }
                    console.log('3000端口已释放');
                });
        }
    });
});
