const deleteBtn = document.getElementById("delete-post-btn");
const postId = deleteBtn?.getAttribute("post-id");
const commentInput = document.querySelector("textarea[name=comment]");
const commentCount = document.getElementById("comment-count");

commentCount.innerText = "0/500";

const handleDeleteClick = async () => {
  const result = confirm("Are you sure you want to delete?");
  if (!result) return
  const res = await fetch(`/posts/${postId}`, { method: "DELETE" });
  if (res.ok) {
    window.location.href = "/";
  } else {
    console.error(res);
  }
}

deleteBtn?.addEventListener("click", handleDeleteClick);


function truncat(str, len) {
  if (str.length >= len) return str.slice(0, len - 1);
  return str;
}

commentInput.addEventListener("input", (event) => {
  commentCount.innerText = `${event.target.value.length}/500`;
  commentInput.value = truncat(commentInput.value, 500);
})
