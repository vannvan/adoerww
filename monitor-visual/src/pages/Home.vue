<template>
  <div class="home-page">
    <div class="ghost">
      <div class=" ">
        <div class="face">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="smile"></div>
          <div class="rosy left"></div>
          <div class="rosy right"></div>
        </div>
        <div class="arm left"></div>
        <div class="arm right"></div>
        <div class="bottom">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="shadow"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //
    }
  }
}
</script>
<style>
.ghost {
  position: relative;
  width: 160px;
  height: 200px;
}
.ghost {
  margin: 150px auto;
  position: relative;
  width: 160px;
  height: 200px;
  border-top-right-radius: 80px;
  border-top-left-radius: 80px;
  background-color: #f0efda;
  -webkit-animation: float 4s ease infinite;
  animation: float 4s ease infinite;
}
.ghost .face {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 67px;
  left: 37px;
  width: 72px;
  height: 41px;
}
.ghost .face .eye {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: #272b24;
}
.ghost .face .eye.left {
  margin-right: 32px;
}
.ghost .face .smile {
  margin-top: 6px;
  width: 32px;
  height: 16px;
  margin-left: 20px;
  border-bottom-left-radius: 16px 12px;
  border-bottom-right-radius: 16px 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #272b24;
}
.ghost .face .rosy {
  position: absolute;
  top: 28px;
  width: 22px;
  height: 8px;
  border-radius: 100%;
  background-color: #ffaa9e;
}
.ghost .face .rosy.left {
  left: -6px;
  -webkit-transform: rotate(-8deg);
  transform: rotate(-8deg);
}
.ghost .face .rosy.right {
  right: -6px;
  -webkit-transform: rotate(8deg);
  transform: rotate(8deg);
}
.ghost .arm {
  position: absolute;
  top: 136px;
  width: 60px;
  height: 40px;
  background-color: #f0efda;
}
.ghost .arm.left {
  left: -4px;
  border-radius: 60% 100%;
  -webkit-animation: arms-left 4s ease infinite;
  animation: arms-left 4s ease infinite;
}
.ghost .arm.right {
  right: -65px;
  border-radius: 100% 60%;
  -webkit-animation: arms-right 4s ease infinite;
  animation: arms-right 4s ease infinite;
}
.ghost .bottom {
  display: flex;
  position: absolute;
  top: 100%;
  left: 0px;
  right: -1px;
}
.ghost . bottom div {
  flex-grow: 1;
  position: relative;
  top: -14px;
  height: 28px;
  border-radius: 100%;
  background-color: #f0efda;
}
.ghost . bottom div:nth-child(2n) {
  top: -10px;
  margin: 0 -2px;
  border-top: 10px solid #f0efda;
  background: transparent;
}
.ghost .shadow {
  position: absolute;
  bottom: -100px;
  left: 50%;
  width: 200px;
  height: 12px;
  border-radius: 100%;
  background-color: #191d18;
  -webkit-animation: shadow 4s ease infinite;
  animation: shadow 4s ease infinite;
}

@-webkit-keyframes float {
  0%,
  100% {
    top: 0px;
  }
  40% {
    top: -40px;
  }
}

@keyframes float {
  0%,
  100% {
    top: 0px;
  }
  40% {
    top: -40px;
  }
}
@-webkit-keyframes arms-left {
  0%,
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(50deg);
    transform: translate(-50%, -50%) rotate(50deg);
  }
  40% {
    -webkit-transform: translate(-50%, -50%) rotate(40deg);
    transform: translate(-50%, -50%) rotate(40deg);
  }
}
@keyframes arms-left {
  0%,
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(50deg);
    transform: translate(-50%, -50%) rotate(50deg);
  }
  40% {
    -webkit-transform: translate(-50%, -50%) rotate(40deg);
    transform: translate(-50%, -50%) rotate(40deg);
  }
}
@-webkit-keyframes arms-right {
  0%,
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(-50deg);
    transform: translate(-50%, -50%) rotate(-50deg);
  }
  40% {
    -webkit-transform: translate(-50%, -50%) rotate(-40deg);
    transform: translate(-50%, -50%) rotate(-40deg);
  }
}
@keyframes arms-right {
  0%,
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(-50deg);
    transform: translate(-50%, -50%) rotate(-50deg);
  }
  40% {
    -webkit-transform: translate(-50%, -50%) rotate(-40deg);
    transform: translate(-50%, -50%) rotate(-40deg);
  }
}
@-webkit-keyframes shadow {
  0%,
  100% {
    -webkit-transform: translateX(-50%) scale(1);
    transform: translateX(-50%) scale(1);
  }
  40% {
    -webkit-transform: translateX(-50%) scale(0.5);
    transform: translateX(-50%) scale(0.5);
  }
}
@keyframes shadow {
  0%,
  100% {
    -webkit-transform: translateX(-50%) scale(1);
    transform: translateX(-50%) scale(1);
  }
  40% {
    -webkit-transform: translateX(-50%) scale(0.5);
    transform: translateX(-50%) scale(0.5);
  }
}
</style>
