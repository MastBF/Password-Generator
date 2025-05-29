const messages = {};

function generatePassword(length, includeSpecialChars) {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let chars = letters + digits;
  if (includeSpecialChars) {
    chars += special;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

function loadMessages(lang) {
  return fetch(`/_locales/${lang}/messages.json`)
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(key => {
        messages[key] = data[key].message;
      });
    });
}

function localizeHtmlPage() {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.dataset.i18n;
    const message = messages[key];
    if (message) elem.textContent = message;
  });
}

function updateLocaleUI(lang) {
  return loadMessages(lang).then(() => {
    localStorage.setItem("lang", lang);
    localizeHtmlPage();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const savedLang = localStorage.getItem("lang") || "en";
  await updateLocaleUI(savedLang);

  const toggle = document.getElementById("languageToggle");
  const lengthInput = document.getElementById("length");
  const specialCharsCheckbox = document.getElementById("special-chars");
  const passwordField = document.getElementById("password");
  const generateBtn = document.getElementById("generate");
  const copyBtn = document.getElementById("copy");

  toggle.checked = savedLang === "de";

  toggle.addEventListener("change", async () => {
    const lang = toggle.checked ? "de" : "en";
    await updateLocaleUI(lang);
  });

  generateBtn.onclick = () => {
    let length = parseInt(lengthInput.value, 10);

    if (length > 20) length = 20;

    const includeSpecial = specialCharsCheckbox.checked;
    passwordField.value = generatePassword(length, includeSpecial);
  };

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(passwordField.value).catch(() => {
      passwordField.select();
      document.execCommand("copy");
    });
  };
});
