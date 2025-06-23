# Simple Blog/Post Manager

A simple blog app built with vanilla JavaScript, HTML, and CSS.  
It allows you to view, add, edit, and delete blog posts using a mock REST API.

## Features

- View all blog post titles and images in a sidebar
- Click a post to view its details
- Add a new post with title, author, image, and content
- Edit an existing post's title and content
- Delete a post

## Setup

1. **Clone or download this repository.**
2. **Install [json-server](https://github.com/typicode/json-server) globally if you haven't:**
   
   npm install -g json-server@0.17.4
   
3. **Start the backend API:**
   
   json-server db.json
   
   The API will run at [http://localhost:3000](http://localhost:3000).

4. **Start the frontend:**
   - You can use [live-server](https://www.npmjs.com/package/live-server):
     
     live-server
     
   - Or simply open `index.html` in your browser.

## File Structure


Blog-app/
│
├── css/
│   └── styles.css
├── src/
│   └── index.js
├── db.json
├── index.html
└── README.md


## API Endpoints

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a single post
- `POST /posts` - Add a new post
- `PATCH /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

## Sample Data (`db.json`)

    json
{
  "posts": [
    {
      "id": 1,
      "title": "Welcome to My Blog",
      "author": "Alice",
      "image": "https://placekitten.com/200/200",
      "content": "This is the first post on my blog!",
      "date": "2025-06-24"
    }
  ]
}

## Notes

- Make sure `json-server` is running before using the app.
- All changes (add, edit, delete) are persisted to `db.json`.

