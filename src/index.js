const BASE_URL = 'http://localhost:3000/posts';

const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');
const editPostForm = document.getElementById('edit-post-form');
const editTitleInput = document.getElementById('edit-title');
const editContentInput = document.getElementById('edit-content');
const cancelEditBtn = document.getElementById('cancel-edit');

let postsCache = [];
let currentPostId = null;

// Main function
function main() {
  fetchPosts().then(posts => displayPosts(posts));
  addNewPostListener();
  setupEditForm();
}

main();


// Fetch all posts from server
async function fetchPosts() {
  const res = await fetch(BASE_URL);
  const posts = await res.json();
  postsCache = posts;
  return posts;
}

// Display all posts in sidebar with images
function displayPosts(posts) {
  postList.innerHTML = '';
  const ul = document.createElement('ul');
  posts.forEach(post => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.cursor = 'pointer';
    li.style.marginBottom = '10px';
        if (post.id === currentPostId) li.classList.add('selected'); // Highlight


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

  // Show first post details on load
  if (posts.length > 0 && !currentPostId) {
    handlePostClick(posts[0].id);
  }
}

// Fetch and show single post details
async function handlePostClick(id) {
  currentPostId = id;
  const res = await fetch(`${BASE_URL}/${id}`);
  const post = await res.json();
  showPostDetails(post);
}

// Show post details and Edit button
function showPostDetails(post) {
  editPostForm.classList.add('hidden'); // Hide edit form when showing details
  postDetail.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>By ${post.author}</strong> • ${post.date ? post.date : ''}</p>
    <img src="${post.image}" alt="Post Image" style="max-width:100%;margin:10px 0;">
    <p>${post.content}</p>
    <button id="edit-btn">Edit</button>
  `;
  document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
}

// Show edit form for post
function showEditForm(post) {
  editTitleInput.value = post.title;
  editContentInput.value = post.content;
  editPostForm.classList.remove('hidden');
}

// Handle edit form submission (frontend only)
function setupEditForm() {
  editPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentPostId) return;

    // Update post in cache and UI only (not persisted for this deliverable)
    const updatedTitle = editTitleInput.value;
    const updatedContent = editContentInput.value;
    const post = postsCache.find(p => p.id === currentPostId);
    if (post) {
      post.title = updatedTitle;
      post.content = updatedContent;
      displayPosts(postsCache);
      showPostDetails(post);
    }
    editPostForm.classList.add('hidden');
  });

  cancelEditBtn.addEventListener('click', () => {
    editPostForm.classList.add('hidden');
  });
}

// Add new post (frontend only for core deliverable)
function addNewPostListener() {
  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    editPostForm.classList.add('hidden');
    const newPost = {
      title: document.getElementById('new-title').value,
      author: document.getElementById('new-author').value,
      image: document.getElementById('new-image').value,
      content: document.getElementById('new-content').value,
      date: new Date().toISOString().split('T')[0]
    };

    // Persist to backend
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
    const createdPost = await res.json();

    // Fetch updated posts and update UI
    const posts = await fetchPosts();
    displayPosts(posts);
    showPostDetails(createdPost);
    newPostForm.reset();
  });
}