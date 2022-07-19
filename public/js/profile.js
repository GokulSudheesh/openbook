const username = location.pathname.split('/')[3];
const tabs = document.querySelectorAll(".tab > button");
let selectedTab = tabs[0];
/* Posts Section */
const seeMorePostsBtn = document.getElementById("loadPosts");
const postContainer = document.getElementById("posts-container");
const postSpinner = document.querySelector(".main-container > #spinner");
const postSection = document.getElementById("main-post-section");
let lastPostId = postContainer?.lastElementChild.getAttribute("id");

/* Comments Section */
const seeMoreCommentsBtn = document.getElementById("loadComments");
const commentSection = document.getElementById("main-comment-section");
const commentsContainer = document.getElementById("comments-wrapper");
const userId = commentsContainer?.getAttribute("user-id");
const commentSpinner = document.querySelector(".comment-section > #spinner");
let lastCommentId = commentsContainer?.lastElementChild.getAttribute("comment-id");
let deleteCommentButtons = document.querySelectorAll(".delete-comment-btn");

function addPostToDOM(post) {
  const postWrapper = document.createElement("a");
  postWrapper.classList.add("post-wrapper");
  postWrapper.href = `/posts/${post._id}`;
  postWrapper.id = post._id;
  postWrapper.innerHTML = `
  <div class="post-container">
    <div class="header">
      <div class="author">
        ${post.isAnonymous ? 
          '<img src="/images/anonymous.jpg" alt="anonymous"><p>Anonymous</p>' : 
          `<img src=${post.author.profilePic} alt=${post.author.username}><p>${post.author.username}</p>`
        }
      </div>
    </div>
    <div class="title-section">
      <h3>${post.title}</h3>
      <p class="post-type">${post.type}</p>
    </div>
    <div class="content-section">
      <p>${post.content}</p>
    </div>
  </div>
  `;
  postContainer.appendChild(postWrapper);
}

const handlePostsButtonClick = async () => {
  postSpinner.style.display = "flex";
  try {
    const res = await fetch(`/account/posts/${username}?postId=${lastPostId}`, { method: "GET" });
    if (!res.ok) return
    const data = await res.json();
    for (const post of data.posts) {
      addPostToDOM(post);
    }
    lastPostId = postContainer.lastElementChild.getAttribute("id");
  } catch (err) {
    console.error(err);
  }
  postSpinner.style.display = "none";
}

seeMorePostsBtn?.addEventListener("click", handlePostsButtonClick);

const handleDeleteCommentButtonClick = (button) => {
  const commentId = button.getAttribute("comment-id");
  return async () => {
    const result = confirm("Are you sure you want to delete?");
    if (!result) return
    const res = await fetch(`/comments/comment?commentId=${commentId}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = `/account/profile/${username}`;
    } else {
      console.error(res);
    }
  }
}

const handleTabClick = (button) => {
  const tabSlug = button.getAttribute("tab-slug");
  return () => {
    button.classList.add("selected-tab");
    selectedTab.classList.remove("selected-tab");
    selectedTab = button;
    if (tabSlug === "post") {
      commentSection?.setAttribute("style", "display: none !important");
      postSection?.setAttribute("style", "display: flex !important");
    } else {
      commentSection?.setAttribute("style", "display: flex !important");
      postSection?.setAttribute("style", "display: none !important");
    }
  }
}

function addCommentToDOM(comment) {
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
    delBtn.addEventListener("click", handleDeleteCommentButtonClick(delBtn));
    commentWrapper.appendChild(delBtn);
  }
  commentsContainer.appendChild(commentWrapper);
}

const handleCommentsButtonClick = async () => {
  commentSpinner.style.display = "flex";
  try {
    const res = await fetch(`/account/comments/${username}?commentId=${lastCommentId}`, { method: "GET" });
    if (!res.ok) return
    const data = await res.json();
    for (const comment of data.comments) {
      addCommentToDOM(comment);
    }
    lastCommentId = commentsContainer.lastElementChild.getAttribute("comment-id");
  } catch (err) {
    console.error(err);
  }
  commentSpinner.style.display = "none";
}

seeMoreCommentsBtn?.addEventListener("click", handleCommentsButtonClick);
deleteCommentButtons.forEach(button => {
  button.addEventListener("click", handleDeleteCommentButtonClick(button));
});

tabs.forEach(button => {
  button.addEventListener("click", handleTabClick(button));
});
