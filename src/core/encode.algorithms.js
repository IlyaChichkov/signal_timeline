// eslint-disable-next-line no-unused-vars
const zeroSignal = [0, 0, 0, 0]
// eslint-disable-next-line no-unused-vars
const posSignal = [1, 1, 1, 1]
// eslint-disable-next-line no-unused-vars
const negSignal = [-1, -1, -1, -1]

export function DefaultSignal(input) {
    UniNRZ(input);
}

export function UniNRZ(inputSignal) {
    let signals = []
    for (let i = 0; i < inputSignal.length; i++) {
        let currentBit = inputSignal[i];

        if (currentBit == 1) {
            signals[i] = [1, 1, 1, 1];
        } else {
            signals[i] = [0, 0, 0, 0];
        }
    }
    return signals;
}

export function BiNRZ(inputSignal) {
    let signals = []
    for (let i = 0; i < inputSignal.length; i++) {
        let currentBit = inputSignal[i];

        if (currentBit == 1) {
            signals[i] = [1, 1, 1, 1];
        } else {
            signals[i] = [-1, -1, -1, -1];
        }
    }
    return signals;
}

export function UniRZ(inputSignal) {
    let signals = []
    for (let i = 0; i < inputSignal.length; i++) {
        let currentBit = inputSignal[i];

        if (currentBit == 1) {
            signals[i] = [1, 1, 0, 0];
        } else {
            signals[i] = zeroSignal;
        }
    }
    return signals;
}

export function BiRZ(inputSignal) {
    let signals = []
    for (let i = 0; i < inputSignal.length; i++) {
        let currentBit = inputSignal[i];

        if (currentBit == 1) {
            signals[i] = [1, 1, 0, 0];
        } else {
            signals[i] = [-1, -1, 0, 0];
        }
    }
    return signals;
}

export function NRZI(inputSignal) {
    let signals = []
    for (let i = 0; i < inputSignal.length; i++) {
        let prevBit = inputSignal[i - 1];
        let currentBit = inputSignal[i];
        let nextBit = inputSignal[i + 1];
        if (!prevBit) prevBit = 0;
        if (!nextBit) nextBit = 0;
        if (currentBit == 0) {
            if (i > 0) {
                if (signals[i - 1] === negSignal) {
                    signals[i] = posSignal;
                }else{
                    signals[i] = negSignal;
                }
            } else {
                signals[i] = negSignal;
            }
        }
        if (currentBit == 1) {
            if (i > 0) {
                signals[i] = signals[i - 1];
            } else {
                signals[i] = [1, 1, 1, 1];
            }
        }
    }
    return signals;
}

export function AMI(inputSignal) {
    let signals = []
    let isLastPositive = false;
    for (let i = 0; i < inputSignal.length; i++) {
        let prevBit = inputSignal[i - 1];
        let currentBit = inputSignal[i];
        let nextBit = inputSignal[i + 1];
        if (!prevBit) prevBit = 0;
        if (!nextBit) nextBit = 0;
        console.log('---start---')
        if (currentBit == 1) {
            console.log('signal 1')
            if (i > 0) {
                if (isLastPositive === true) {
                    signals[i] = [0, -1, -1, 0];
                    isLastPositive = false;
                }else{
                    signals[i] = [0, 1, 1, 0];
                    isLastPositive = true;
                }
            } else {
                signals[i] = [0, 1, 1, 0];
                isLastPositive = true;
            }
        }
        if (currentBit == 0) {
            console.log('signal 0')
            signals[i] = zeroSignal;
        }
    }
    console.log('---end---')
    return signals;
}

export function Manchester2(inputSignal) {
    let signals = []
    for (let i = 0; i < inputSignal.length; i++) {
        let currentBit = inputSignal[i];

        if (currentBit == 1) {
            signals[i] = [1, 1, -1, -1];
        } else {
            signals[i] = [-1, -1, 1, 1];
        }
    }
    return signals;
}

export function FrequencyModulation(inputSignal) {
    let signals = []
    let isLastPositive = false;
    for (let i = 0; i < inputSignal.length; i++) {
        let prevBit = inputSignal[i - 1];
        let currentBit = inputSignal[i];
        let nextBit = inputSignal[i + 1];
        if (!prevBit) prevBit = 0;
        if (!nextBit) nextBit = 0;
        console.log('---start---')
        console.log('currentBit ' +  currentBit)
        if (currentBit == 1) {
            console.log('signal 1')
            if (i > 0) {
                if (isLastPositive === true) {
                    signals[i] = negSignal;
                    isLastPositive = false;
                }else{
                    signals[i] = posSignal;
                    isLastPositive = true;
                }
            } else {
                signals[i] = posSignal;
                isLastPositive = true;
            }
        }
        if (currentBit == 0) {
            console.log('signal 0')
            signals[i] = [-1, -1, 1, 1];
        }
    }
    console.log('---end---')
    return signals;
}