let showOptions = false;  // 預設不顯示
const boxSize = 100;
const spacing = 10;

// iframe 與按鈕相關
let iframeDiv;
let showIframe = false;
const leftMargin = 130;
let cnv;
let overlayDivs = [];
const introURL = 'https://jjjjiu999.github.io/meeee/';
const classworkURL = 'https://jjjjiu999.github.io/-/';
const notesURL = 'https://hackmd.io/@jjjjiu/rJM3_J96le';
const quizURL = 'https://jjjjiu999.github.io/test/';
let currentContent = '';
let closeDiv;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('display', 'block');
  cnv.style('z-index', '0');
  cnv.elt.style.margin = '0';
  cnv.elt.style.padding = '0';

  // 建立 iframe
  iframeDiv = createDiv('<iframe src="" width="100%" height="100%" frameborder="0" style="border:0;background:transparent;" allow="fullscreen" loading="lazy" referrerpolicy="no-referrer"></iframe>');
  iframeDiv.style('position', 'fixed');
  iframeDiv.style('z-index', '9998');
  iframeDiv.style('pointer-events', 'auto');
  iframeDiv.hide();

  // 建立左側四個透明 overlay 按鈕
  const options = ['自我介紹', '課堂作品', '課堂筆記', '測驗題'];
  for (let i = 0; i < options.length; i++) {
    let d = createDiv('');
    d.style('position', 'fixed');
    d.style('left', '10px');
    d.style('top', (10 + i * (boxSize + spacing)) + 'px');
    d.style('width', boxSize + 'px');
    d.style('height', boxSize + 'px');
    d.style('background', 'transparent');
    d.style('z-index', '10001');
    d.style('cursor', 'pointer');
    d.style('pointer-events', 'auto');

    // 綁定點擊事件，使用 IIFE 捕捉 i
    ((idx) => {
      d.mousePressed(() => {
        const ifr = iframeDiv.elt.querySelector('iframe');
        if (idx === 0) { // 自我介紹
          showIframe = true;
          currentContent = 'intro';
          if (ifr) ifr.src = introURL;
        } else if (idx === 1) { // 課堂作品
          showIframe = true;
          currentContent = 'classwork';
          if (ifr) ifr.src = classworkURL;
        } else if (idx === 2) { // 課堂筆記
          showIframe = true;
          currentContent = 'notes';
          if (ifr) ifr.src = notesURL;
        } else if (idx === 3) { // 測驗題
          showIframe = true;
          currentContent = 'quiz';
          if (ifr) ifr.src = quizURL;
        }
        updateIframePosition();
        iframeDiv.show();
        if (closeDiv) closeDiv.show();
      });
    })(i);

    overlayDivs.push(d);
  }

  // 建立關閉按鈕
  closeDiv = createDiv('✕');
  closeDiv.style('position', 'fixed');
  closeDiv.style('z-index', '10002');
  closeDiv.style('background', 'rgba(0,0,0,0.6)');
  closeDiv.style('color', '#fff');
  closeDiv.style('width', '28px');
  closeDiv.style('height', '28px');
  closeDiv.style('line-height', '28px');
  closeDiv.style('text-align', 'center');
  closeDiv.style('border-radius', '14px');
  closeDiv.style('cursor', 'pointer');
  closeDiv.style('display', 'none');
  closeDiv.mousePressed(() => {
    showIframe = false;
    currentContent = '';
    const ifr = iframeDiv.elt.querySelector('iframe');
    if (ifr) ifr.src = '';
    iframeDiv.hide();
    closeDiv.hide();
  });

  updateIframePosition();
}

function draw() {
  background(200, 177, 228);

  // 判斷滑鼠是否靠近左側按鈕區
  let hoverLeft = mouseX < 110 && mouseX > 0 && mouseY > 0 && mouseY < 450;
  showOptions = hoverLeft || showIframe;

  if (showOptions) {
    const options = ['自我介紹', '課堂作品', '課堂筆記', '測驗題'];
    for (let i = 0; i < options.length; i++) {
      fill(173, 216, 230);
      noStroke();
      drawStar(60, 60 + (i * (boxSize + spacing)), 50);

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(16);
      text(options[i], 60, 60 + (i * (boxSize + spacing)));
    }
  }
}

function drawStar(x, y, radius) {
  let angle = TWO_PI / 5;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * (radius / 2);
    sy = y + sin(a + halfAngle) * (radius / 2);
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function updateIframePosition() {
  const maxWidth = windowWidth - leftMargin - 40;
  const maxHeight = windowHeight - 80;
  const w = Math.max(300, Math.min(maxWidth, 1000));
  const h = Math.max(200, Math.min(maxHeight, Math.round(w * 0.66)));
  const left = leftMargin + Math.round((windowWidth - leftMargin - w) / 2);
  const top = Math.round((windowHeight - h) / 2);

  iframeDiv.style('left', left + 'px');
  iframeDiv.style('top', top + 'px');
  iframeDiv.style('width', w + 'px');
  iframeDiv.style('height', h + 'px');
  iframeDiv.elt.style.borderRadius = '8px';
  iframeDiv.elt.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';

  if (closeDiv) {
    closeDiv.style('left', (left + w - 20) + 'px');
    closeDiv.style('top', (top + 8) + 'px');
    closeDiv.style('display', showIframe ? 'block' : 'none');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (cnv) {
    cnv.position(0, 0);
    cnv.size(windowWidth, windowHeight);
  }
  if (iframeDiv) updateIframePosition();
  for (let i = 0; i < overlayDivs.length; i++) {
    overlayDivs[i].style('top', (10 + i * (boxSize + spacing)) + 'px');
  }
}
