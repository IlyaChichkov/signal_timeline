<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-3xl font-bold mb-10">Signals encodings</h1>
    <div class="flex flex-col justify-center items-center mb-4">
      <canvas class="object-center" id="canvas" ref="maincanvas" :width="width" :height="height"
              @mousemove="showCoordinates"></canvas>
    </div>
    <input @change.prevent="handleInputString($event)" class="border-solid border-2 border-gray-200 rounded p-2"
           type="text" placeholder="0101001110">
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data() {
    return {
      canvas: null,
      bufferCanvas: null,
      width: 800,
      height: 100,
      stepsCount: 13,
      stepHeight: 20,
      x: 0,
      y: 0,
      sizeChanged: false,
      inputString: '',
      inputSignal: [0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
      signals: []
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
      this.width = document.documentElement.clientWidth / 2;
      this.sizeChanged = true;
    },
    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawTimeline();
      this.drawClockPeriodLines();
      this.drawYAxis();
      this.sizeChanged = false;
    },
    handleInputString(e) {
      this.inputSignal = [];
      console.log(e.target.value);
      let input = e.target.value;
      for (let i = 0; i < input.length; i++) {
        if (input[i] == 1 || input[i] == 0)
          this.inputSignal.push(input[i]);
      }

      this.createSignals('UniP-RZ');
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
    // eslint-disable-next-line no-unused-vars
    drawSegment(index, vol, nextStartVol) {
      let lineWidth = 2;
      let startVol, centerLeftVol, centerRightVol, endVol;
      nextStartVol = -nextStartVol[0];
      startVol = -vol[0];
      centerLeftVol = -vol[1];
      centerRightVol = -vol[2];
      endVol = -vol[3];

      const startX = index * this.getStepWidth;
      const endX = startX + this.getStepWidth;
      const centerX = startX + (endX - startX) / 2;
      const quarter = (endX - startX) / 4;

      this.ctx.beginPath();
      this.ctx.moveTo(startX, this.height / 2 + startVol * this.stepHeight);
      this.ctx.lineTo(startX + quarter, this.height / 2 + startVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      // Center left vertical
      this.ctx.beginPath();
      this.ctx.moveTo(startX + quarter, this.height / 2 + startVol * this.stepHeight);
      this.ctx.lineTo(startX + quarter, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX - quarter, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineTo(centerX, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      // Center vertical
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, this.height / 2 + centerLeftVol * this.stepHeight);
      this.ctx.lineTo(centerX, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineTo(centerX + quarter, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      // Center right vertical
      this.ctx.beginPath();
      this.ctx.moveTo(centerX + quarter, this.height / 2 + centerRightVol * this.stepHeight);
      this.ctx.lineTo(centerX + quarter, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(centerX + quarter, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineTo(endX, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(endX, this.height / 2 + endVol * this.stepHeight);
      this.ctx.lineTo(endX, this.height / 2 + nextStartVol * this.stepHeight);
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    },
    setRandomSignals() {
      for (let i = 0; i < this.visibleSegmentsCount; i++) {
        let vol = Math.round(Math.random() * 2 - 1);
        this.inputSignal[i] = vol;
      }
    },
    drawClockPeriodLines() {
      for (let i = 0; i < this.visibleSegmentsCount; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * this.getStepWidth, 0);
        this.ctx.lineTo(i * this.getStepWidth, this.height);
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        let signal = this.inputSignal[i];
        console.log('>>> P ' + signal + ' i=' + i)
        if (!signal) signal = 0;
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
      switch (encodeType) {
        case 'UniP-RZ':
          this.signals = this.unipolarRZCode(this.inputSignal);
      }
    },
    unipolarRZCode(inputSignal) {
      let signals = []
      for (let i = 0; i < inputSignal.length; i++) {
        let currentBit = inputSignal[i];
        console.log(i + '  ' + currentBit)
        if (currentBit == 1) {
          signals[i] = [1, 1, 0, 0];
        } else {
          signals[i] = [0, 0, 0, 0];
        }
        console.log('transform to ' + signals[i])
      }
      return signals;
    },/*
    unipolarRZCode(inputSignal){
      let signals = []
      for (let i = 0; i < inputSignal.length; i++) {
        let prevBit = inputSignal[i - 1];
        let currentBit = inputSignal[i];
        let nextBit = inputSignal[i + 1];
        if(!prevBit) prevBit = 0;
        if(!nextBit) nextBit = 0;
        if(currentBit == 1 && nextBit == 1){
          signals[i] = [1, 1, 1];
        }
      }
      return signals;
    }*/
  },
  mounted() {
    this.createSignals('UniP-RZ');
    this.stepsCount = this.inputSignal.length;

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
  border: 2px solid grey;
  stroke: black;
  stroke-width: 16px;
  fill: oldlace;
}
</style>
