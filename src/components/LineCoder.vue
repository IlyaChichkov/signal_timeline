<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-3xl font-bold mb-10">The Line-coded Signal</h1>
    <div class="flex flex-col justify-center items-center mb-4">
      <canvas class="object-center rounded" id="canvas" ref="maincanvas" :width="width" :height="height"
              @mousemove="showCoordinates"></canvas>
    </div>
    <div class="flex-row flex w-full">
      <select class="p-2 font-bold rounded" v-model="encodeType">
        <option value="UniNRZ" selected>Unipolar NRZ</option>
        <option value="BiNRZ">Bipolar NRZ</option>
        <option value="UniRZ">Unipolar RZ</option>
        <option value="BiRZ">Bipolar RZ</option>
        <option value="NRZI">NRZI</option>
        <option value="AMI">AMI</option>
        <option value="MH-2">Manchester-2</option>
        <option value="FM">Frequency modulation</option>
      </select>
      <input ref="signalInput" @change.prevent="handleInputString($event)" class="mx-2 flex-1 border-solid border-2 border-gray-200 rounded p-2"
             type="text" placeholder="0101001110">
      <button @click.prevent="setRandomSignals()" class="p-1 bg-white min-w-[42px] rounded flex flex-row justify-center items-center">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.5 14.5A7 7 0 013.17 2M7.5.5A7 7 0 0111.83 13m-.33-3v3.5H15M0 1.5h3.5V5" stroke="currentColor"></path></svg>
      </button>
    </div>
    <!--
    <div class="flex flex-row w-full mt-2">
      <button @click.prevent="startMove()" class="p-2 flex-1 bg-white min-w-[42px] rounded flex flex-row justify-center items-center">
        Start move
      </button>
      <button @click.prevent="stopMove()" class="p-2 ml-2 flex-1 bg-white min-w-[42px] rounded flex flex-row justify-center items-center">
        Stop move
      </button>
    </div>
    -->
  </div>
</template>

<script>
import {BiNRZ, BiRZ, NRZI, UniNRZ, UniRZ, AMI, Manchester2, FrequencyModulation} from "@/core/encode.algorithms";

export default {
  name: 'HelloWorld',
  data() {
    return {
      canvas: null,
      bufferCanvas: null,
      encodeType: 'UniNRZ',
      width: 800,
      maxWidth: 800,
      height: 100,
      stepsCount: 13,
      stepHeight: 20,
      x: 0,
      y: 0,
      sizeChanged: false,
      inputString: '10101000011',
      inputSignal: [],
      signals: [],
      signalMovePromise: null
    }
  },
  watch: {
    encodeType(){
      this.createSignals(this.encodeType);
    }
  },
  computed: {
    getStepWidth() {
      return this.width / this.stepsCount;
    },
    getCanvas() {
      return document.getElementById('canvas');
    },
    ctx() {
      return this.getCanvas.getContext('2d');
    },
    visibleSegmentsCount() {
      return this.width / this.getStepWidth;
    }
  },
  methods: {
    showCoordinates(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
    },
    updateCanvasWidth() {
      this.width = document.documentElement.clientWidth / 1.12;
      if(this.width > this.maxWidth){
        this.width = this.maxWidth;
      }
      this.sizeChanged = true;
    },
    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawTimeline();
      this.drawClockPeriodLines();
      this.drawYAxis();
      this.sizeChanged = false;
    },
    createSignalFromString(input){
      this.inputSignal = [];
      for (let i = 0; i < input.length; i++) {
        if (input[i] == 1 || input[i] == 0)
          this.inputSignal.push(input[i]);
      }
    },
    handleInputString(e) {
      let input = e.target.value;
      this.createSignalFromString(input);

      this.createSignals(this.encodeType);
      this.stepsCount = this.inputSignal.length;
      this.draw();
      this.sizeChanged = true;
    },
    drawTimeline() {
      for (let i = 0; i < this.visibleSegmentsCount; i++) {
        let vol = this.signals[i];
        let nextStartVol = this.signals[i + 1];
        if (!vol) {
          vol = 0;
        }
        if (!nextStartVol) {
          nextStartVol = 0;
        }
        this.drawSegment(i, vol, nextStartVol);
      }
    },
    drawSegment(index, vol, nextStartVol) {
      let lineWidth = 2.2;
      const lineColor = 'white';
      let startVol, centerLeftVol, centerRightVol, endVol;
      nextStartVol = -nextStartVol[0];
      startVol = -vol[0];
      centerLeftVol = -vol[1];
      centerRightVol = -vol[2];
      endVol = -vol[3];
      console.log(vol)

      const startX = index * this.getStepWidth;
      const endX = startX + this.getStepWidth;
      const centerX = startX + (endX - startX) / 2;
      const quarter = (endX - startX) / 4;

      this.ctx.beginPath();
      this.ctx.moveTo(startX, this.height / 2 + startVol * this.stepHeight);
      this.ctx.lineTo(startX + quarter, this.height / 2 + startVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      // Center left vertical
      this.ctx.beginPath();
      this.ctx.moveTo(startX + quarter, this.height / 2 + startVol * this.stepHeight);
      this.ctx.lineTo(startX + quarter, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX - quarter, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineTo(centerX, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      // Center vertical
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineTo(centerX, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineTo(centerX + quarter, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      // Center right vertical
      this.ctx.beginPath();
      this.ctx.moveTo(centerX + quarter, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineTo(centerX + quarter, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX + quarter, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineTo(endX, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(endX, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineTo(endX, this.height / 2 + nextStartVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = lineColor;
      this.ctx.stroke();
    },
    setRandomSignals(randomLength = 9) {
      let randomCode = ''
      for (let i = 0; i < randomLength; i++) {
        randomCode += Math.round(Math.random());
      }
      this.createSignalFromString(randomCode);
      this.$refs.signalInput.placeholder = randomCode;
      this.createSignals(this.encodeType);
      this.stepsCount = this.inputSignal.length;
      this.draw();
      this.sizeChanged = true;
    },
    drawClockPeriodLines() {
      const textColor = 'white';
      for (let i = 0; i < this.visibleSegmentsCount; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * this.getStepWidth, 0);
        this.ctx.lineTo(i * this.getStepWidth, this.height);
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        let signal = this.inputSignal[i];
        if (!signal) signal = 0;
        this.ctx.fillStyle = textColor;
        this.ctx.fillText(signal.toString(), i * this.getStepWidth + this.getStepWidth / 2 - 2, 20);
      }
    },
    drawYAxis() {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height / 2);
      this.ctx.lineTo(this.width, this.height / 2);
      this.ctx.lineWidth = 0.2;
      this.ctx.stroke();
    },
    createSignals(encodeType) {
      console.log('Created Signal: ' + encodeType)
      switch (encodeType) {
        case 'UniNRZ':
          this.signals = UniNRZ(this.inputSignal);
          break;
        case 'BiNRZ':
          this.signals = BiNRZ(this.inputSignal);
          break;
        case 'UniRZ':
          this.signals = UniRZ(this.inputSignal);
          break;
        case 'BiRZ':
          this.signals = BiRZ(this.inputSignal);
          break;
        case 'NRZI':
          this.signals = NRZI(this.inputSignal);
          break;
        case 'AMI':
          this.signals = AMI(this.inputSignal);
          break;
        case 'MH-2':
          this.signals = Manchester2(this.inputSignal);
          break;
        case 'FM':
          this.signals = FrequencyModulation(this.inputSignal);
          break;
        default:
          console.log('Default')
          this.signals = UniNRZ(this.inputSignal);
          break;
      }
      this.draw();
    },
    startMove(){
      let delay = 1060;
      this.signalMovePromise = setInterval(this.moveSignal, delay);
    },
    stopMove(){
      clearInterval(this.signalMovePromise);
      this.createSignals(this.encodeType);
      this.stepsCount = this.inputSignal.length;
      this.draw();
      this.sizeChanged = true;
    },
    moveSignal() {
      /*
      console.log('moving')
      // const newSignal = Math.round(Math.random());
      const newSignal = this.inputSignal[this.inputSignal.length - 1];

      console.log(this.inputSignal)
      this.inputSignal = [newSignal, ...this.inputSignal.slice(0, this.inputSignal.length - 1)]
      this.createSignals(this.encodeType);
      this.stepsCount = this.inputSignal.length;
      this.draw();
      this.sizeChanged = true;*/

      console.log('moving w')
      const lastSignal = this.signals[this.signals.length - 1][3];
      this.signals[0][0] = lastSignal;
      console.log('moving w' + lastSignal)
      for (let i = this.signals.length - 1; i > 0; i--) {
        for (let j = this.signals.length - 1; j > 1; j--) {
          this.signals[i][j] = this.signals[i][j - 1];
        }
        if(i > 0){
          this.signals[i][0] = this.signals[i - 1][3];
        }
      }
      this.draw();
      this.sizeChanged = true;
    }
  },
  mounted() {
    this.setRandomSignals();

    this.updateCanvasWidth();
    window.addEventListener('resize', () => {
      this.updateCanvasWidth();
    }, true)
  },
  updated() {
    if (this.sizeChanged) {
      this.draw();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#canvas {
  border: 2px solid #e8e9ef;
  stroke: #B8FFA1FF;
  stroke-width: 16px;
  fill: oldlace;
}
</style>
