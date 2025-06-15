import { useEffect, useState } from "react";
import * as postService from "../../services/postService";
import PostCard from "../../components/PostCard/PostCard";
import "./HomePage.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const { posts } = await postService.index();
        const sorted = posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sorted.slice(0, 3)); // Get the 3 most recent posts
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    }

    fetchRecentPosts();
  }, []);

  return (
    <div className="home-page">
      <h1 className="recent-posts-title">Recent Posts</h1>

      {posts.length ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No recent posts found.</p>
      )}
    </div>
  );
}
