!function(){for(var t=125,a=["52,168,83","117,95,147","199,108,23","194,62,55","0,172,212","120,120,120"],i=["52,168,83","117,95,147","199,108,23","194,62,55","0,172,212","120,120,120"],e=.85,n=Math.min(canvas.width,canvas.height)/2.4,o=[],s=[],r=0;r<24;r++)o.push(new h);for(r=0;r<12;r++)s.push(new h(!0));function h(n){this.background=n||!1,this.x=c(-canvas.width/2,canvas.width/2),this.y=c(-canvas.height/2,canvas.height/2),this.radius=n?l(5,t)*e:l(5,t),this.filled=this.radius<25?!(d(0,100)>60)&&"full":!(d(0,100)>30)&&"concentric",this.color=n?i[d(0,i.length-1)]:a[d(0,a.length-1)],this.borderColor=n?i[d(0,i.length-1)]:a[d(0,a.length-1)],this.opacity=.05,this.speed=n?c(.3,2.5)/e:c(.3,2.5),this.speedAngle=2*Math.random()*Math.PI,this.speedx=Math.cos(this.speedAngle)*this.speed,this.speedy=Math.sin(this.speedAngle)*this.speed;var o=Math.abs((this.x-(this.speedx<0?-1:1)*(canvas.width/2+this.radius))/this.speedx),s=Math.abs((this.y-(this.speedy<0?-1:1)*(canvas.height/2+this.radius))/this.speedy);this.ttl=Math.min(o,s)}function d(t,a){return Math.floor(Math.random()*(a-t+1)+t)}function c(t,a){return Math.random()*(a-t)+t}function l(t,a){return Math.random()*Math.random()*Math.random()*(a-t)+t}function u(t,a){var i=a.background?a.radius*=1:a.radius/=1;t.beginPath(),t.arc(a.x,a.y,1*i,0,2*Math.PI,!1),t.lineWidth=Math.max(1,10*(5-a.radius)/-120),t.strokeStyle=["rgba(",a.borderColor,",",a.opacity,")"].join(""),"full"==a.filled&&(t.fillStyle=["rgba(",a.borderColor,",",a.background?.8*a.opacity:a.opacity,")"].join(""),t.fill(),t.lineWidth=0,t.strokeStyle=["rgba(",a.borderColor,",",0,")"].join("")),t.stroke(),"concentric"==a.filled&&(t.beginPath(),t.arc(a.x,a.y,i/2,0,2*Math.PI,!1),t.lineWidth=Math.max(1,10*(5-a.radius)/-120),t.strokeStyle=["rgba(",a.color,",",a.opacity,")"].join(""),t.stroke()),a.x+=a.speedx,a.y+=a.speedy,a.opacity<(a.background?.6:1)&&(a.opacity+=.01),a.ttl--}function g(){var t=document.getElementById("canvas").getContext("2d"),a=document.getElementById("canvasbg").getContext("2d");function i(t,a){for(var i=0;i<a.length;i++){var e=a[i];e.ttl,canvas.width,e.radius,canvas.height,e.radius,e.ttl<-20&&a[i].init(a[i].background),u(t,e)}for(i=0;i<a.length-1;i++)for(var o=i+1;o<a.length;o++){var s=a[i].x-a[o].x,r=a[i].y-a[o].y,h=Math.pow(Math.pow(s,2)+Math.pow(r,2),.5);if(!(h<=a[i].radius+a[o].radius)&&h<n){var d=(a[i].x<a[o].x?1:-1)*Math.abs(a[i].radius*s/h),c=(a[i].y<a[o].y?1:-1)*Math.abs(a[i].radius*r/h),l=(a[i].x<a[o].x?-1:1)*Math.abs(a[o].radius*s/h),g=(a[i].y<a[o].y?-1:1)*Math.abs(a[o].radius*r/h);t.beginPath(),t.moveTo(a[i].x+d,a[i].y+c),t.lineTo(a[o].x+l,a[o].y+g),a[i].color,a[o].color,t.strokeStyle=["rgba(",a[i].borderColor,",",Math.min(a[i].opacity,a[o].opacity)*((n-h)/n),")"].join(""),t.lineWidth=(a[i].background?2.125:2.5)*((n-h)/n),t.stroke()}}}t.globalCompositeOperation="destination-over",t.clearRect(0,0,canvas.width,canvas.height),a.globalCompositeOperation="destination-over",a.clearRect(0,0,canvas.width,canvas.height),t.save(),t.translate(canvas.width/2,canvas.height/2),a.save(),a.translate(canvas.width/2,canvas.height/2);var e=Date.now();i(t,o),i(a,s),deltaT=Date.now()-e,t.restore(),a.restore(),window.requestAnimationFrame(g)}h.prototype.init=function(){h.call(this,this.background)},window.requestAnimationFrame(g)}();