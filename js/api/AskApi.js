export class AskApi {
  constructor(baseUrl = "http://127.0.0.1:8000") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async ask(question) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      throw new Error("Question cannot be empty.");
    }

    const url = `${this.baseUrl}/ask?question=${encodeURIComponent(trimmedQuestion)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Something went wrong`);
    }

    const data = await response.json();

    return {
      question: data.question ?? trimmedQuestion,
      answer: data.answer ?? "No answer received.",
    };
  }
}
