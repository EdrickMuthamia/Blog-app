const BASE_URL = "http://localhost:3000";
const postListDiv = document.getElementById("post-list");
const postDetailDiv = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");

function displayPosts() {
  fetch(`${BASE_URL}/posts`)
    .then((res) => res.json())
    .then((posts) => {
      postListDiv.innerHTML = "";
      posts.forEach((post) => {
        const postItem = document.createElement("div");
        postItem.textContent = post.title;
        postItem.className = "post-title";
        postItem.style.cursor = "pointer";
        postItem.addEventListener("click", () => handlePostClick(post.id));
        postListDiv.appendChild(postItem);
      });
    });
}

function handlePostClick(postId) {
  fetch(`${BASE_URL}/posts/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      postDetailDiv.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
      `;
    });
}

function addNewPostListener() {
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-title").value;
    const author = document.getElementById("new-author").value;
    const content = document.getElementById("new-content").value;
    const newPost = { title, author, content };

    // Add to DOM (not persisted for core deliverable)
    const postItem = document.createElement("div");
    postItem.textContent = newPost.title;
    postItem.className = "post-title";
    postItem.style.cursor = "pointer";
    postItem.addEventListener("click", () => {
      postDetailDiv.innerHTML = `
        <h2>${newPost.title}</h2>
        <p><strong>Author:</strong> ${newPost.author}</p>
        <p>${newPost.content}</p>
      `;
    });
    postListDiv.appendChild(postItem);

    newPostForm.reset();
  });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);