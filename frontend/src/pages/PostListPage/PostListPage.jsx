import { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import PostCard from "../../components/PostCard/PostCard"; //  Reused  card
import "./PostListPage.css";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await postService.index();
      setPosts(posts);
    }
    fetchPosts();
  }, []);

  return (
    <div className="post-list-page">
      <h1 className="post-list-title">All Posts</h1>

      {posts.length ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts yet!</p>
      )}
    </div>
  );
}
