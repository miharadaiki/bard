class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  normalized() {
    let normalized = new Vector2();
    normalized.x = this.x / Math.sqrt(this.x * this.x + this.y * this.y);
    normalized.y = this.y / Math.sqrt(this.x * this.x + this.y * this.y);
    return normalized;
  }
  add(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }
  multiply(num) {
    if (typeof num === "number") {
      return new Vector2(this.x * num, this.y * num);
    } else {
      return new Vector2(this.x * num.x, this.y * num.y);
    }
  }
}

class GameLoopManager {
  constructor(func, cps, debug = false) {
    this.func = func;
    this.cps = cps;
    this.mpc = 1000 / this.cps;
    this.debug = debug;
    this.total_count = 0; //[tickcount]
    this.total_time = 0; //[ms]
  }
  start() {
    this.leastDelta = 0;
    this.start_time = Date.now();
    this.leastTime = Date.now();
    this.done();
  }

  done() {
    let now = Date.now();
    let deltaTime = now - this.leastTime;
    let delta = this.leastDelta - deltaTime;
    this.leastDelta = Math.max(0, this.mpc + delta);
    if (this.debug) console.log(deltaTime, "(", this.leastDelta, ")", this.total_time / this.total_count);
    setTimeout(() => {
      this.func();
      GameLoop.done();
    }, this.leastDelta);
    this.leastTime = now;

    this.total_count++;
    this.total_time += deltaTime;
  }

  refresh_total() {
    this.total_count = 1;
    this.total_time = this.leastDelta;
  }
}

class CanvasComponents {
  static components = [];
  constructor({ ctx = false, img = "assets/error.png", size = new Vector2(50, 50), position = new Vector2(0, 0), motion = new Vector2(0, 0), rotate = 0, rotation = 0, update = () => {} } = {}) {
    this.ctx = ctx ? ctx : undefined;
    this.image = new Image();
    this.image.src = img;
    this.size = size;
    this.position = position;
    this.motion = motion;
    this.rotate = rotate;
    this.rotation = rotation;
    this.update = update;
    CanvasComponents.components.push(this);
  }
  render() {
    let x = this.position.x;
    let y = this.position.y;
    let phi = this.rotate * (Math.PI / 180);
    let X = x * Math.cos(-phi) - y * Math.sin(-phi);
    let Y = y * Math.cos(-phi) + x * Math.sin(-phi);
    this.ctx.rotate(phi);
    this.ctx.drawImage(this.image, X - this.size.x / 2, Y - this.size.y / 2, this.size.x, this.size.y);
    this.ctx.rotate(-phi);
  }
}

class CanvasManager {
  constructor(size, elem, wrapper) {
    this.size = size;
    this.elem = elem;
    this.elem.width = this.size.x;
    this.elem.height = this.size.y;
    this.wrapper = wrapper;
    window.addEventListener("resize", () => {
      this.refresh();
    });
  }
  refresh() {
    if (this.ratio_mode !== window.innerHeight / window.innerWidth < this.size.y / this.size.x) {
      let flag = window.innerHeight / window.innerWidth < this.size.y / this.size.x;
      this.elem.style.height = !flag ? `calc(100vw * ${this.size.y / this.size.x})` : "100%";
      this.elem.style.width = flag ? `calc(100vh * ${this.size.x / this.size.y})` : "100%";
      this.wrapper.style.height = !flag ? `calc(100vw * ${this.size.y / this.size.x})` : "100%";
      this.wrapper.style.width = flag ? `calc(100vh * ${this.size.x / this.size.y})` : "100%";
    }
    this.ratio_mode = window.innerHeight / window.innerWidth < this.size.y / this.size.x;
    document.querySelector(":root").style.setProperty("--width", this.elem.clientWidth);
    document.querySelector(":root").style.setProperty("--height", this.elem.clientHeight);
  }
  get x() {
    return this.size.x;
  }
  get y() {
    return this.size.y;
  }
}

class SoundManager {
  constructor() {
    this.list = [];
    this.instances = [];
    this.i = 0;
    for (let i = 0; i < 16; i++) {
      this.instances[i] = new Audio();
    }
  }
  LoadSound(name, url) {
    if (typeof this.list[name] === "undefined") {
      this.list[name] = new Audio(url);
    }
  }
  PlaySound(name) {
    if (this.list[name].readyState >= 2 && this.instances[this.i].paused) {
      let sound = this.instances[this.i];
      this.i++;
      if (this.i >= 16) this.i = 0;
      sound.src = this.list[name].src;
      try {
        sound.play();
      } catch (e) {}
    }
  }
}

class keyInputManager {
  constructor() {
    this.key = {};
    window.addEventListener("keydown", (e) => {
      this.key[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.key[e.key] = false;
    });
  }
  IsPressed(key) {
    return this.key[key];
  }
}
