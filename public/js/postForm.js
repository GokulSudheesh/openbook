const titleInput = document.querySelector("input[name=title]");
const contentInput = document.querySelector("textarea[name=content]");
const titleCount = document.getElementById("title-count");
const contentCount = document.getElementById("content-count");

titleCount.innerText = `${titleInput.value?.length || 0}/100`;
contentCount.innerText = `${contentInput.value?.length || 0}/800`;

function truncat(str, len) {
  if (str.length >= len) return str.slice(0, len - 1);
  return str;
}

titleInput.addEventListener("input", (event) => {
  titleCount.innerText = `${event.target.value.length}/100`;
  titleInput.value = truncat(titleInput.value, 100);
})

contentInput.addEventListener("input", (event) => {
  contentCount.innerText = `${event.target.value.length}/800`;
  contentInput.value = truncat(contentInput.value, 800);
})

