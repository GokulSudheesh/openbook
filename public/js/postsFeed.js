const seeMoreBtn = document.getElementById("loadPosts");
const postContainer = document.getElementById("posts-container");
const spinner = document.getElementById("spinner");
let lastPostId = postContainer.lastElementChild.getAttribute("id");

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

const handleButtonClick = async () => {
  spinner.style.display = "flex";
  try {
    const res = await fetch(`/feed/${lastPostId}`, { method: "GET" });
    if (!res.ok) return
    const data = await res.json();
    for (const post of data.posts) {
      addPostToDOM(post);
    }
    lastPostId = postContainer.lastElementChild.getAttribute("id");
  } catch (err) {
    console.error(err);
  }
  spinner.style.display = "none";
}

seeMoreBtn.addEventListener("click", handleButtonClick);
