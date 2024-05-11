const bufferSize = 22;
let buffer = new Array(bufferSize).fill(null);
let producerIndex = 0;
let consumerIndex = 0;
let producerProcessing = false;
let consumerProcessing = false;
let accessingBuffer = false;
let producerInterval;
let consumerInterval;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function produce() {
  producerInterval = setInterval(async () => {
    if (!producerProcessing && !accessingBuffer) {
      accessingBuffer = true;
      if (buffer[producerIndex] === null) {
        producerProcessing = true;
        updateUI();
        await sleep(1000);

        const elementsToProduce = Math.floor(Math.random() * 4) + 3;
        for (let i = 0; i < elementsToProduce; i++) {
          if (buffer.every(item => item !== null)) {
            producerProcessing = 'trying';
            producerIndex = (producerIndex - 1 + bufferSize) % bufferSize;
          }
          buffer[producerIndex] = 'img/producto.jpg';
          producerIndex = (producerIndex + 1) % bufferSize;
          updateUI();
          await sleep(500);
        }

        producerProcessing = false;
        updateUI();
      }
      accessingBuffer = false;
    }
  }, Math.random() * 2000 + 1000);
}

async function consume() {
  consumerInterval = setInterval(async () => {
    if (!consumerProcessing && !accessingBuffer) {
      accessingBuffer = true;
      if (buffer[consumerIndex] !== null) {
        consumerProcessing = true;
        updateUI();
        await sleep(1000);

        const elementsToConsume = Math.floor(Math.random() * 4) + 3;
        for (let i = 0; i < elementsToConsume; i++) {
          if (buffer.every(item => item === null)) {
            consumerProcessing = 'trying';
            consumerIndex = (consumerIndex - 1 + bufferSize) % bufferSize;
          }
          buffer[consumerIndex] = null;
          consumerIndex = (consumerIndex + 1) % bufferSize;
          updateUI();
          await sleep(500);
        }

        consumerProcessing = false;
        updateUI();
      }
      accessingBuffer = false;
    }
  }, Math.random() * 2000 + 1000);
}

function updateUI() {
  const bufferElement = document.querySelector('.buffer');
  const producerInfoElement = document.querySelector('.producer');
  const consumerInfoElement = document.querySelector('.consumer');

  bufferElement.innerHTML = '';
  for (let i = 0; i < bufferSize; i++) {
    if (buffer[i] !== null) {
      bufferElement.innerHTML += `<div class="buffer-cell"><img src="${buffer[i]}" alt="Producto" width="40"></div>`;
    } else {
      bufferElement.innerHTML += '<div class="buffer-cell empty">-</div>';
    }
  }

  if (producerProcessing === 'trying') {
    producerInfoElement.textContent = `Productor: Intentando`;
    producerInfoElement.classList.remove('idle', 'working');
    producerInfoElement.classList.add('trying');
  } else {
    producerInfoElement.textContent = `Productor: ${producerProcessing ? 'Trabajando' : 'Dormido'}`;
    producerInfoElement.classList.remove('trying', producerProcessing ? 'idle' : 'working');
    producerInfoElement.classList.add(producerProcessing ? 'working' : 'idle');
  }

  if (consumerProcessing === 'trying') {
    consumerInfoElement.textContent = `Consumidor: Intentando`;
    consumerInfoElement.classList.remove('idle', 'working');
    consumerInfoElement.classList.add('trying');
  } else {
    consumerInfoElement.textContent = `Consumidor: ${consumerProcessing ? 'Trabajando' : 'Dormido'}`;
    consumerInfoElement.classList.remove('trying', consumerProcessing ? 'idle' : 'working');
    consumerInfoElement.classList.add(consumerProcessing ? 'working' : 'idle');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.getElementById("start-button");
  const bufferElement = document.querySelector('.buffer');

  startButton.addEventListener("click", function() {
    bufferElement.classList.remove('none');
    startButton.disabled = true;
    produce();
    consume();
  });

  document.addEventListener("keydown", function(event) {
    if (event.keyCode === 27) {
      clearInterval(producerInterval);
      clearInterval(consumerInterval);
    }
  });
}); 
