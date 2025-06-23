const BASE_URL = 'http://localhost:3000/posts';

// Elements
const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');
const editPostForm = document.getElementById('edit-post-form');
const editTitleInput = document.getElementById('edit-title');
const editContentInput = document.getElementById('edit-content');
const cancelEditBtn = document.getElementById('cancel-edit');

let currentPostId = null;

// Load posts from server
async function fetchPosts() {
  const response = await fetch(BASE_URL);
  return await response.json();
}

// Display posts in sidebar (with images)
function displayPosts(posts) {
  postList.innerHTML = '';
  const ul = document.createElement('ul');
  posts.forEach(post => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.cursor = 'pointer';
    li.style.marginBottom = '10px';

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = 'Post Image';
    img.style.width = '40px';
    img.style.height = '40px';
    img.style.objectFit = 'cover';
    img.style.marginRight = '10px';

    li.appendChild(img);

    const span = document.createElement('span');
    span.textContent = post.title;
    li.appendChild(span);

    li.addEventListener('click', () => handlePostClick(post.id));
    ul.appendChild(li);
  });
  postList.appendChild(ul);

  if (posts.length > 0 && !currentPostId) {
    handlePostClick(posts[0].id); // Show first post by default
  }
}

// Get and show single post
async function handlePostClick(id) {
  currentPostId = id;
  const response = await fetch(`${BASE_URL}/${id}`);
  const post = await response.json();
  showPostDetails(post);
}

// Show post details
function showPostDetails(post) {
  postDetail.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>By ${post.author}</strong> • ${post.date ? post.date : ''}</p>
    <img src="${post.image}" alt="Post Image" style="max-width:100%;margin:10px 0;">
    <p>${post.content}</p>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;

  document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
  document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
}

// Show edit form
function showEditForm(post) {
  editTitleInput.value = post.title;
  editContentInput.value = post.content;
  editPostForm.classList.remove('hidden');
}

// Handle edit form submission
async function setupEditForm() {
  editPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentPostId) return;

    const updatedPost = {
      title: editTitleInput.value,
      content: editContentInput.value,
    };
    await fetch(`${BASE_URL}/${currentPostId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost),
    });

    const posts = await fetchPosts();
    displayPosts(posts);
    handlePostClick(currentPostId);
    editPostForm.classList.add('hidden');
  });

  cancelEditBtn.addEventListener('click', () => {
    editPostForm.classList.add('hidden');
  });
}

// Delete post
async function deletePost(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  const posts = await fetchPosts();
  displayPosts(posts);
  postDetail.innerHTML = '<p>Select a post to view details.</p>';
  currentPostId = null;
  editPostForm.classList.add('hidden');
}

// Submit new post
async function addNewPostListener() {
  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById('new-title').value,
      author: document.getElementById('new-author').value,
      image: document.getElementById('new-image').value,
      content: document.getElementById('new-content').value,
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    const createdPost = await response.json();
    const posts = await fetchPosts();
    displayPosts(posts);
    handlePostClick(createdPost.id);
    newPostForm.reset();
  });
}

// Main function
async function main() {
  const posts = await fetchPosts();
  displayPosts(posts);
  addNewPostListener();
  setupEditForm();
}

main();