import { AskApi } from "./api/AskApi.js";
import { MessageRenderer } from "./ui/MessageRenderer.js";

export class ChatController {
  constructor({
    form,
    input,
    sendButton,
    messagesContainer,
    clearButton,
    reloadButton,
  }) {
    this.form = form;
    this.input = input;
    this.sendButton = sendButton;
    this.clearButton = clearButton;
    this.reloadButton = reloadButton;
    this.api = new AskApi();
    this.renderer = new MessageRenderer(messagesContainer);
    this.isLoading = false;

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.clearButton.addEventListener("click", () => {
      this.renderer.clearMessages();
      this.input.focus();
    });

    this.reloadButton.addEventListener("click", () => {
      window.location.reload();
    });
  }

  async handleSubmit() {
    const question = this.input.value.trim();

    if (!question || this.isLoading) {
      return;
    }

    this.setLoading(true);
    this.renderer.appendQuestion(question);
    this.input.value = "";
    this.renderer.showThinking();

    try {
      const result = await this.api.ask(question);
      await this.renderer.appendAnswer(result.answer);
    } catch (error) {
      this.renderer.appendError(
        error.message || "Unable to reach the API. Is the server running?"
      );
    } finally {
      this.setLoading(false);
      this.input.focus();
    }
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.sendButton.disabled = isLoading;
    this.input.disabled = isLoading;
    this.sendButton.classList.toggle("is-loading", isLoading);
  }
}
