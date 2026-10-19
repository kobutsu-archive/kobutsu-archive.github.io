
(() => {
  /* ナビゲーション制御 */
  const nav = document.querySelector("nav");

  if (nav) {
    const links = [...nav.querySelectorAll("a")];

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    const foundIndex = links.findIndex(
      link => link.getAttribute("href") === currentPage
    );

    const currentIndex = foundIndex >= 0 ? foundIndex : 0;

    links.forEach((link, index) => {
      const isCurrentPage = index === currentIndex;

      link.classList.toggle("active", isCurrentPage);

      if (isCurrentPage) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    function highlightLink(index) {
      nav.style.setProperty("--active-index", index);
    }

    function resetHighlight() {
      nav.style.setProperty("--active-index", currentIndex);
    }

    resetHighlight();

    links.forEach((link, index) => {
      link.addEventListener("mouseenter", () => {
        highlightLink(index);
      });

      link.addEventListener("focus", () => {
        highlightLink(index);
      });
    });

    nav.addEventListener("mouseleave", resetHighlight);

    nav.addEventListener("focusout", event => {
      if (!nav.contains(event.relatedTarget)) {
        resetHighlight();
      }
    });
  }

  /* シリアルコード入力制御 */
  const form = document.getElementById("serial-form");
  const parts = [...document.querySelectorAll(".serial-part")];
  const message = document.getElementById("serial-message");

  if (!form || parts.length !== 4 || !message) return;

  parts.forEach((input, index) => {
    input.addEventListener("input", () => {
      const previousValue = input.value;

      if (index === 0) {
        input.value = previousValue
          .replace(/[^a-zA-Z]/g, "")
          .toUpperCase()
          .slice(0, 3);
      } else {
        input.value = previousValue
          .replace(/\D/g, "")
          .slice(0, 4);
      }

      message.textContent = "";

      if (
        input.value.length === input.maxLength &&
        index < parts.length - 1
      ) {
        parts[index + 1].focus();
      }
    });

    input.addEventListener("keydown", event => {
      if (
        event.key === "Backspace" &&
        input.value === "" &&
        index > 0
      ) {
        parts[index - 1].focus();
      }

      if (event.key === "ArrowLeft" && index > 0) {
        parts[index - 1].focus();
      }

      if (
        event.key === "ArrowRight" &&
        index < parts.length - 1
      ) {
        parts[index + 1].focus();
      }
    });
  });

  /* 照会処理：現在は仮動作 */
  form.addEventListener("submit", event => {
    event.preventDefault();

    const code = parts
      .map(input => input.value)
      .join("-");

    message.textContent = "照会システム未接続：" + code;
  });
})();
