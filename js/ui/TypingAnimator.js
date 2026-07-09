export class TypingAnimator {
  constructor(element, speed = 18) {
    this.element = element;
    this.speed = speed;
    this.cursor = null;
    this.timeoutId = null;
  }

  async type(text) {
    this.element.textContent = "";
    this.cursor = document.createElement("span");
    this.cursor.className = "typing-cursor";
    this.element.appendChild(this.cursor);

    for (const character of text) {
      await this.wait(this.speed);
      this.element.insertBefore(document.createTextNode(character), this.cursor);
    }

    this.cursor.remove();
    this.cursor = null;
  }

  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.cursor) {
      this.cursor.remove();
      this.cursor = null;
    }
  }

  wait(duration) {
    return new Promise((resolve) => {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        resolve();
      }, duration);
    });
  }
}
