(function () {
  if (window.__FORTEXA_LOADED__) return;
  window.__FORTEXA_LOADED__ = true;

  const logo = "logo.png";

  const css = `
    #fortexa-launcher {
      position: fixed;
      right: 22px;
      bottom: 22px;
      width: 64px;
      height: 64px;
      border: 0;
      border-radius: 50%;
      background: #f7bd4b;
      box-shadow: 0 12px 35px rgba(0,0,0,.25);
      z-index: 999999;
      padding: 7px;
      cursor: pointer;
    }

    #fortexa-launcher img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
    }

    #fortexa-chat {
      position: fixed;
      right: 22px;
      bottom: 98px;
      width: 390px;
      height: 610px;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 120px);
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 21px;
      box-shadow: 0 25px 80px rgba(0,0,0,.25);
      z-index: 999998;
      display: none;
      overflow: hidden;
      font-family: Arial, sans-serif;
      color: #111827;
    }

    #fortexa-chat.open {
      display: flex;
      flex-direction: column;
    }

    .fortexa-header {
      background: #111827;
      color: white;
      padding: 13px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fortexa-brand {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .fortexa-brand img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      background: white;
      border-radius: 9px;
    }

    .fortexa-brand b {
      font-size: 15px;
    }

    .fortexa-brand small {
      display: block;
      color: #cbd5e1;
      font-size: 11px;
      margin-top: 2px;
    }

    .fortexa-close {
      border: 0;
      background: transparent;
      color: white;
      font-size: 25px;
      cursor: pointer;
    }

    .fortexa-messages {
      flex: 1;
      overflow-y: auto;
      background: #f8fafc;
      padding: 14px;
    }

    .fortexa-message {
      max-width: 84%;
      padding: 10px 12px;
      border-radius: 14px;
      margin: 8px 0;
      font-size: 13px;
      line-height: 1.45;
    }

    .fortexa-bot {
      background: white;
      border: 1px solid #e5e7eb;
      border-top-left-radius: 5px;
    }

    .fortexa-user {
      background: #111827;
      color: white;
      margin-left: auto;
      border-top-right-radius: 5px;
    }

    .fortexa-quote {
      background: #fff8e5;
      border: 1px solid #efd48c;
      border-radius: 12px;
      padding: 10px;
      margin-top: 7px;
    }

    .fortexa-form {
      border-top: 1px solid #e5e7eb;
      padding: 10px;
      background: white;
    }

    .fortexa-compose {
      display: flex;
      gap: 7px;
    }

    .fortexa-compose textarea {
      flex: 1;
      height: 44px;
      resize: none;
      border: 1px solid #e5e7eb;
      border-radius: 11px;
      padding: 10px;
      outline: none;
    }

    .fortexa-send,
    .fortexa-attach {
      width: 44px;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
    }

    .fortexa-send {
      background: #111827;
      color: white;
    }

    .fortexa-attach {
      background: #f0f1f3;
      display: grid;
      place-items: center;
    }

    @media (max-width: 500px) {
      #fortexa-launcher {
        right: 14px;
        bottom: 14px;
      }

      #fortexa-chat {
        right: 10px;
        bottom: 88px;
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const widget = document.createElement("div");

  widget.innerHTML = `
    <button id="fortexa-launcher" aria-label="Open Fortexa">
      <img src="${logo}" alt="Fortexa">
    </button>

    <section id="fortexa-chat">

      <div class="fortexa-header">

        <div class="fortexa-brand">
          <img src="${logo}" alt="Fortexa">
          <div>
            <b>Fortexa</b>
            <small>Automated chat service · online</small>
          </div>
        </div>

        <button class="fortexa-close">×</button>

      </div>

      <div class="fortexa-messages" id="fortexa-messages"></div>

      <div class="fortexa-form">

        <div class="fortexa-compose">

          <label class="fortexa-attach">
            📎
            <input
              id="fortexa-files"
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
            >
          </label>

          <textarea
            id="fortexa-input"
            placeholder="Type your message..."
          ></textarea>

          <button
            class="fortexa-send"
            id="fortexa-send"
          >
            ➤
          </button>

        </div>

      </div>

    </section>
  `;

  document.body.appendChild(widget);

  const chat = document.getElementById("fortexa-chat");
  const messages = document.getElementById("fortexa-messages");
  const input = document.getElementById("fortexa-input");
  const launcher = document.getElementById("fortexa-launcher");
  const closeButton = document.querySelector(".fortexa-close");
  const sendButton = document.getElementById("fortexa-send");
  const files = document.getElementById("fortexa-files");

  const customer = {
    name: "",
    phone: "",
    email: "",
    request: ""
  };

  function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function addMessage(text, user) {

    const message = document.createElement("div");

    message.className =
      "fortexa-message " +
      (user ? "fortexa-user" : "fortexa-bot");

    message.innerHTML = text;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
  }

  function openChat() {

    chat.classList.add("open");

    if (!messages.children.length) {

      addMessage(
        "Hi! I'm <b>Fortexa</b>. Tell me what you need help with and I'll gather the details for the business."
      );

    }
  }

  function closeChat() {
    chat.classList.remove("open");
  }

  function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    addMessage(
      escapeHTML(text),
      true
    );

    input.value = "";

    setTimeout(function () {
      respond(text);
    }, 500);
  }

  function respond(text) {

    const lower = text.toLowerCase();

    const emailMatch =
      text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

    if (emailMatch) {
      customer.email = emailMatch[0];
    }

    const phoneMatch =
      text.match(/(?:\+44|0)\s?\d[\d\s-]{8,}/);

    if (phoneMatch) {
      customer.phone = phoneMatch[0].trim