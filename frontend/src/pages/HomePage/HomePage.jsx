import { useEffect, useState } from "react";
import * as postService from "../../services/postService";
import PostCard from "../../components/PostCard/PostCard";
import "./HomePage.css";

export default function HomePage() {
  const [groupedPosts, setGroupedPosts] = useState({});

  useEffect(() => {
    async function fetchRecentPosts() {
      const allPosts = await postService.index();
      const slicedPosts = allPosts.slice(0, 12); // Show more for better grouping

      const grouped = slicedPosts.reduce((acc, post) => {
        const country =
          post.country === "Other" ? post.customCountry : post.country;
        if (!acc[country]) acc[country] = [];
        acc[country].push(post);
        return acc;
      }, {});

      setGroupedPosts(grouped);
    }

    fetchRecentPosts();
  }, []);

  return (
    <div className="home-page">
      <h1 className="recent-posts-title">Recent Posts</h1>

      {Object.keys(groupedPosts).length ? (
        Object.entries(groupedPosts).map(([_, posts]) => (
          <div key={posts[0]._id} className="country-section">
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No recent posts found.</p>
      )}
    </div>
  );
}
