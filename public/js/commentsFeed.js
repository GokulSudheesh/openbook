const seeMoreBtn = document.getElementById("loadComments");
const commentsContainer = document.getElementById("comments-wrapper");
const userId = commentsContainer?.getAttribute("user-id");
const spinner = document.getElementById("spinner");
let lastCommentId = commentsContainer?.lastElementChild.getAttribute("comment-id");
let currentPostId = seeMoreBtn?.getAttribute("post-id");
let deleteButtons = document.querySelectorAll(".delete-comment-btn");

const handleDeleteButtonClick = (button) => {
  const commentId = button.getAttribute("comment-id");
  return async () => {
    const result = confirm("Are you sure you want to delete?");
    if (!result) return
    const res = await fetch(`/comments/comment?postId=${currentPostId}&commentId=${commentId}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = `/posts/${currentPostId}`;
    } else {
      console.error(res);
    }
  }
}

function addPostToDOM(comment) {
  const commentWrapper = document.createElement("div");
  commentWrapper.setAttribute("comment-id", comment._id);
  commentWrapper.classList.add("comment-wrapper");
  commentWrapper.innerHTML = `
  <div class="header">
    <div class="author">
      <img src=${comment.author.profilePic} alt=${comment.author.username}>
      <a href="/account/profile/${comment.author.username}">${comment.author.username}</a>
    </div>
  </div>
  <p>${comment.comment}</p>
  `;
  if (userId === comment.author._id) {
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-comment-btn", "delete-btn");
    delBtn.setAttribute("comment-id", comment._id);
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.addEventListener("click", handleDeleteButtonClick(delBtn));
    commentWrapper.appendChild(delBtn);
  }
  commentsContainer.appendChild(commentWrapper);
}

const handleButtonClick = async () => {
  spinner.style.display = "flex";
  try {
    const res = await fetch(`/comments/feed?postId=${currentPostId}&commentId=${lastCommentId}`, { method: "GET" });
    if (!res.ok) return
    const data = await res.json();
    for (const comment of data.comments) {
      addPostToDOM(comment);
    }
    lastCommentId = commentsContainer.lastElementChild.getAttribute("comment-id");
  } catch (err) {
    console.error(err);
  }
  spinner.style.display = "none";
}

seeMoreBtn?.addEventListener("click", handleButtonClick);
deleteButtons.forEach(button => {
  button.addEventListener("click", handleDeleteButtonClick(button));
});
