const size = 5;
const width = 100;
const height = 100;

let ctx = null;

let fields = [];
let nextFields = [];

let isWorking = false;

let color = (() => {
  let color = Math.floor(Math.random() * 16777215).toString(16);
  for (let count = color.length; count < 6; count++) {
    color = "0" + color;                     
  }
  const randomColor = "#" + color;
  return randomColor; //'#ff0';
})();

/**
 * フィールドの初期化
 */
const clear = () => {
  // 番兵（実際には使わない値を入れて区切りをわかりやすくして、区切りを調べたりする手間を減らすやりかた。あんまりおすすめしないらしい）
  for (let y = 0; y < height + 2; y++) {
    fields[y] = [];
    nextFields[y] = [];
    for (let x = 0; x < width + 2; x++) {
      fields[y][x] = 0;
      nextFields[y][x] = 0;
    }
  }
};

/**
 * フィールドをランダムで設定
 */
const random = () => {
  for (let y = 1; y < height + 1; y++) {
    for (let x = 1; x < width + 1; x++) {
      fields[y][x] = Math.random() < 0.2 ? 1 : 0;
    }
  }
};

/**
 * フィールドの状況を見て次に状況に更新する
 * ライフゲームのコアの部分
 */
const step = () => {
  for (let y = 1; y < height + 1; y++) {
    for (let x = 1; x < width + 1; x++) {

      // 近隣のマスの生の数を確認
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (fields[y + dy][x + dx]) {
            count++;
          }
        }
      }

      // 自マスが生きていて周りに生きているマスが3 or 4の場合
      // もしくは、自マスが死んでいるが周りのマスが3つ生きている場合には次は生きる
      if (fields[y][x] && (count === 3 || count === 4)
      || !fields[y][x] && (count === 3)) {
        nextFields[y][x] = 1;
      } else {
        nextFields[y][x] = 0;
      }
    }
  }
  // 変数の値を入れ替える
  [fields, nextFields] = [nextFields, fields];
};

/**
 * 今のフィールドの状況を描画する
 */
const render = () => {
  for (let y = 1; y < height + 1; y++) {
    for (let x = 1; x < width + 1; x++) {
      ctx.fillStyle = fields[y][x] ? color : '#000';
      ctx.fillRect((x - 1) * size, (y - 1) * size, size, size);
    }
  }
};

/**
 * 初期化
 */
const init = () => {
  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = size * width;
  canvas.height = size * height;

  document.getElementById('start').addEventListener('click', () => isWorking = true);
  document.getElementById('stop').addEventListener('click', () => isWorking = false);
  document.getElementById('random').addEventListener('click', random);

  clear();
  random();
  render();
};

window.onload = () => {
  init();
  const tick = () => {
    setTimeout(tick, 100);
    if (isWorking) {
      step();
      render();
    }
  }
  tick();
}