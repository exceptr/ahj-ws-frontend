import Login from "./Login";

export default class Chat {
  constructor(parentEl, url) {
    this.parentEl = parentEl;
    this.url = url;
    this.login = new Login(parentEl, url);
    this.userPanelList = document.querySelector(".user-panel-list");
    this.chatWindowContainer = document.querySelector(".chat-window-container");
    this.chatWindow = document.querySelector(".chat-window");
    this.chatInput = document.querySelector(".chat-input");
    this.chatWidget = this.chatWidget.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.send = this.send.bind(this);
    this.dateToConvert = this.dateToConvert.bind(this);
  }

  init() {
    this.login.init();
    this.parentEl.addEventListener("connect", this.chatWidget);
  }

  chatWidget() {
    this.nickname = this.login.choiceNicknameTextarea.value;
    console.log(this.nickname);
    this.users = this.login.userList;

    this.getUserList();

    this.login.ws.addEventListener("message", (event) => {
      const request = JSON.parse(event.data);
      if (request.event === "chat") {
        let userMessage;
        if (this.nickname === request.message.name) {
          request.message.name = "You";
        }

        userMessage = this.createMessage(
          request.message.name,
          request.message.created,
          request.message.text
        );
        this.chatWindow.appendChild(userMessage);
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
      }

      if (request.event === "system") {
        this.logout(request);
      }
    });

    this.chatInput.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        this.send();
      }
    });
  }

  createMessage(name, created, text) {
    const date = this.dateToConvert(created);
    if (name === "You") {
      const chatMessagesYou = document.createElement("div");
      chatMessagesYou.classList.add("chat-messages-you");

      const chatUserNameAndDateYou = document.createElement("div");
      chatUserNameAndDateYou.classList.add("chat-user-name-and-date-you");
      chatUserNameAndDateYou.innerHTML = `You, ${date}`;

      const chatMessagesText = document.createElement("div");
      chatMessagesText.classList.add("chat-messages-text");
      chatMessagesText.innerHTML = text;

      chatMessagesYou.appendChild(chatUserNameAndDateYou);
      chatMessagesYou.appendChild(chatMessagesText);

      console.log(chatMessagesYou);
      return chatMessagesYou;
    }
    const chatMessagesAny = document.createElement("div");
    chatMessagesAny.classList.add("chat-messages-any");

    const chatUserNameAndDateAny = document.createElement("div");
    chatUserNameAndDateAny.classList.add("chat-user-name-and-date-any");
    chatUserNameAndDateAny.innerHTML = `${name}, ${date}`;

    const chatMessagesText = document.createElement("div");
    chatMessagesText.classList.add("chat-messages-text");
    chatMessagesText.innerHTML = text;

    chatMessagesAny.appendChild(chatUserNameAndDateAny);
    chatMessagesAny.appendChild(chatMessagesText);

    console.log(chatMessagesAny);
    return chatMessagesAny;
  }

  send() {
    if (!this.chatInput.value) return;

    const data = JSON.stringify({
      event: "chat",
      message: this.chatInput.value,
    });
    this.login.ws.send(data);
    this.chatInput.value = "";
  }

  getUserList() {
    this.userPanelList.innerHTML = "";
    this.users.forEach((item) => {
      const userEl = document.createElement("li");
      userEl.classList.add("user");
      const userCompleted = document.createElement("span");
      userCompleted.classList.add("user-completed");
      userEl.appendChild(userCompleted);

      const userText = document.createElement("span");
      userText.classList.add("user-text");
      userEl.appendChild(userText);

      const userTextName = document.createElement("p");
      userTextName.classList.add("user-text-name");
      userTextName.innerHTML = item;
      userText.appendChild(userTextName);
      this.userPanelList.appendChild(userEl);
    });

    const userYou = document.createElement("li");
    userYou.classList.add("user");
    const userCompleted = document.createElement("span");
    userCompleted.classList.add("user-completed");
    userYou.appendChild(userCompleted);

    const userText = document.createElement("span");
    userText.classList.add("user-text");
    userYou.appendChild(userText);

    const userTextName = document.createElement("p");
    userTextName.classList.add("user-text-name-you");
    userTextName.innerHTML = "You";
    userText.appendChild(userTextName);
    this.userPanelList.appendChild(userYou);
  }

  dateToConvert(dateValue) {
    const dateTimezone = new Date(dateValue);
    const date = dateTimezone.toLocaleDateString();
    const time = dateTimezone.toLocaleTimeString();

    return `${time} ${date}`;
  }

  logout(request) {
    if (request.message.action === "logout") {
      const index = this.users.indexOf(request.message.name);
      this.users.splice(index, 1);
    } else if (request.message.action === "login") {
      if (this.nickname !== request.message.name) {
        this.users.push(request.message.name);
      }
    }
    this.getUserList();
  }
}
