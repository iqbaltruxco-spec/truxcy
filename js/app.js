import { ChatController } from "./ChatController.js";

document.addEventListener("DOMContentLoaded", () => {
  new ChatController({
    form: document.getElementById("chat-form"),
    input: document.getElementById("question-input"),
    sendButton: document.getElementById("send-button"),
    messagesContainer: document.getElementById("chat-messages"),
    clearButton: document.getElementById("clear-chat-button"),
    reloadButton: document.getElementById("reload-page-button"),
  });
});
