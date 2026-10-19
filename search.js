console.log("search.js 読み込み成功");
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

  
/* 照会処理 */
form.addEventListener("submit", event => {
  event.preventDefault();
  console.log("照会処理が実行されました");

  const code = parts
    .map(input => input.value.trim().toUpperCase())
    .join("-");

  const item = items[code];
  const result = document.getElementById("item-result");

  if (!item) {
    message.textContent = "該当する物品情報は確認できませんでした。";
    if (result) result.hidden = true;
    return;
  }

  message.textContent = "物品情報が確認されました。";

  if (!result) {
    const resultArea = document.createElement("section");
    resultArea.id = "item-result";
    resultArea.className = "archive-notice";
    resultArea.setAttribute("aria-live", "polite");
    form.insertAdjacentElement("afterend", resultArea);
  }

  const resultArea = document.getElementById("item-result");

  resultArea.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "照会結果";

  const name = document.createElement("p");
  name.textContent = "物品名：" + item.name;

  const category = document.createElement("p");
  category.textContent = "分類：" + item.category;

  const status = document.createElement("p");
  status.textContent = "登録状態：" + item.status;

  const description = document.createElement("p");
  description.textContent = "詳細：" + item.description;

  resultArea.append(heading, name, category, status, description);
  resultArea.hidden = false;
});
})();