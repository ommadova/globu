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
      <section className="hero-banner">
        <div
          className="hero-background"
          role="img"
          alt="Mountains and sunrise"
        ></div>
        <div className="hero-text">
          <h1>Share your journey with us!</h1>
        </div>
      </section>

      <section className="home-page">
        <h1 className="home-page-title">
          Every journey has a story. Share yours, explore others', and let the
          world be your guidebook...
        </h1>
        <h2 className="recent-posts-title">Recent Posts</h2>

        {posts.length ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p>No recent posts found.</p>
        )}
      </section>
    </div>
  );
}
