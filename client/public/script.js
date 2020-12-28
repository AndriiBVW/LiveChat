window.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect();

  const $form = document.querySelector("#messForm");
  const $colorMsg = document.querySelector("#colorMsg");
  const $name = document.querySelector("#name");
  const $textarea = document.querySelector("#message");
  const $online = document.querySelector("#online");
  const $all_messages = document.querySelector("#all_mess");

  [$name, $textarea].forEach((item) => {
    item.addEventListener("focus", () => {
      item.style.borderColor = "#80bdff";
      item.style.boxShadow = "0 0 0 0.2rem rgba(0,123,255,.25)";
    });
    item.addEventListener("input", () => {
      item.style.borderColor = "#80bdff";
      item.style.boxShadow = "0 0 0 0.2rem rgba(0,123,255,.25)";
    });
    item.addEventListener("blur", () => {
      item.style.borderColor = "#ced4da";
      item.style.boxShadow = "none";
    });
    item.addEventListener("keydown", (e) => {
      if (e.which == 13) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target == $name) {
          $textarea.focus();
        } else {
          sendForm();
        }
      }
    });
  });

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm();
  });

  socket.on("add mess", (data) => {
    buildMsg(data);
    const soundMsg = new Audio("sound.mp3");
    soundMsg.play();
  });

  socket.on("online users", (data) => {
    $online.textContent = data;
  });

  function sendForm() {
    if ($name.value.trim() && $textarea.value.trim()) {
      let mainDate = new Date();
      let dateSend = {
        hours: correctionDate(mainDate.getHours()),
        minutes: correctionDate(mainDate.getMinutes()),
        seconds: correctionDate(mainDate.getSeconds()),
      };

      let msgData = {
        mess: $textarea.value,
        name: $name.value,
        color: $colorMsg.value,
        timeHour: dateSend.hours,
        timeMin: dateSend.minutes,
        timeSec: dateSend.seconds,
      };
      socket.emit("send mess", msgData);
      $textarea.value = "";
    } else if ($name.value.trim().length == 0) {
      $name.style.borderColor = "#cc0000";
      $name.style.boxShadow = "0 0 0 0.2rem rgba(255, 0, 0, .25)";
    } else if ($textarea.value.trim().length == 0) {
      $textarea.style.borderColor = "#cc0000";
      $textarea.style.boxShadow = "0 0 0 0.2rem rgba(255, 0, 0, .25)";
    }
  }

  function correctionDate(value) {
    if (value < 10) {
      return `0${value}`;
    } else {
      return value;
    }
  }

  function buildMsg(data) {
    if (data) {
      let div = document.createElement("div");
      div.classList.add("alert");
      div.classList.add("animate");
      div.classList.add(`alert-${data.color}`);
      div.classList.add(`pt-1`);
      div.classList.add(`pb-1`);
      div.classList.add(`pl-2`);
      div.classList.add(`pr-2`);
      div.classList.add(`msgName`);
      div.innerHTML = `<b>${data.name}</b> (${data.timeHour}:${data.timeMin}:${data.timeSec})<br>${data.mess}`;
      $all_messages.prepend(div);
    }
  }
});
