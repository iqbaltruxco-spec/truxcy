import { TypingAnimator } from "./TypingAnimator.js";

export class MessageRenderer {
  constructor(container) {
    this.container = container;
    this.activeAnimator = null;
    this.thinkingElement = null;
  }

  appendQuestion(text) {
    const row = this.createRow("user");
    const content = document.createElement("div");

    const meta = document.createElement("div");
    meta.className = "message__meta";
    meta.textContent = "You";

    const bubble = document.createElement("div");
    bubble.className = "message__bubble";
    bubble.textContent = text;

    content.append(meta, bubble);
    row.appendChild(content);
    this.container.appendChild(row);
    this.scrollToBottom();
  }

  showThinking() {
    this.removeThinking();

    const row = this.createRow("bot");
    const content = document.createElement("div");

    const meta = document.createElement("div");
    meta.className = "message__meta";
    meta.textContent = "truxcy is thinking";

    const bubble = document.createElement("div");
    bubble.className = "message__bubble";
    bubble.appendChild(this.createThinkingDots());

    content.append(meta, bubble);
    row.appendChild(content);
    this.container.appendChild(row);
    this.thinkingElement = row;
    this.scrollToBottom();
  }

  removeThinking() {
    if (this.thinkingElement) {
      this.thinkingElement.remove();
      this.thinkingElement = null;
    }
  }

  async appendAnswer(text) {
    this.removeThinking();

    const row = this.createRow("bot");
    const content = document.createElement("div");

    const meta = document.createElement("div");
    meta.className = "message__meta";
    meta.textContent = "truxcy";

    const bubble = document.createElement("div");
    bubble.className = "message__bubble";

    content.append(meta, bubble);
    row.appendChild(content);
    this.container.appendChild(row);
    this.scrollToBottom();

    this.activeAnimator = new TypingAnimator(bubble);
    await this.activeAnimator.type(text);
    this.activeAnimator = null;
    this.scrollToBottom();
  }

  appendError(text) {
    this.removeThinking();
    this.cancelTyping();

    const row = this.createRow("error");
    const content = document.createElement("div");

    const meta = document.createElement("div");
    meta.className = "message__meta";
    meta.textContent = "Error";

    const bubble = document.createElement("div");
    bubble.className = "message__bubble";
    bubble.textContent = text;

    content.append(meta, bubble);
    row.appendChild(content);
    this.container.appendChild(row);
    this.scrollToBottom();
  }

  clearMessages() {
    this.cancelTyping();
    this.removeThinking();
    this.container.innerHTML = "";
  }

  cancelTyping() {
    if (this.activeAnimator) {
      this.activeAnimator.cancel();
      this.activeAnimator = null;
    }
  }

  createRow(type) {
    const row = document.createElement("article");
    row.className = `message-row message-row--${type}`;

    if (type === "bot" || type === "error") {
      row.appendChild(this.createBotAvatar());
    }

    return row;
  }

  createBotAvatar() {
    const avatar = document.createElement("div");
    avatar.className = "message__avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.innerHTML = `
      <svg viewBox="0 0 24 24" class="bot-icon">
        <rect x="5" y="8" width="14" height="11" rx="3"></rect>
        <circle cx="9.5" cy="13" r="1.2"></circle>
        <circle cx="14.5" cy="13" r="1.2"></circle>
        <path d="M12 4v3"></path>
        <circle cx="12" cy="3" r="1.2"></circle>
        <path d="M5 12H3M21 12h-2"></path>
      </svg>
    `;
    return avatar;
  }

  createThinkingDots() {
    const wrapper = document.createElement("span");
    wrapper.className = "thinking-dots";
    wrapper.setAttribute("aria-label", "Thinking");

    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("span");
      dot.className = "thinking-dots__dot";
      wrapper.appendChild(dot);
    }

    return wrapper;
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }
}
