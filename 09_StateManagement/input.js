export default class InputHandler {
  constructor() {
    this.lastkey = '';
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
          this.lastkey = 'PRESS_left';
          break;
        case 'ArrowRight':
          this.lastkey = 'PRESS_right';
          break;
        case 'ArrowDown':
          this.lastkey = 'PRESS_down';
          break;
        case 'ArrowUp':
          this.lastkey = 'PRESS_up';
          break;
      }
    });
    window.addEventListener('keyup', e => {
      switch (e.key) {
        case 'ArrowLeft':
          this.lastkey = 'RELEASE_left';
          break;
        case 'ArrowRight':
          this.lastkey = 'RELEASE_right';
          break;
        case 'ArrowDown':
          this.lastkey = 'RELEASE_down';
          break;
        case 'ArrowUp':
          this.lastkey = 'RELEASE_up';
          break;
      }
    });
  }
}