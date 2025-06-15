import { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import PostCard from "../../components/PostCard/PostCard"; //  Reused  card
import "./PostListPage.css";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      const { posts, countries } = await postService.index();
      setPosts(posts);
      setCountries(countries);
    }
    fetchPosts();
  }, []);

  const filteredPosts = selectedCountry
    ? posts.filter((post) => {
        const country =
          post.country === "Other" ? post.customCountry : post.country;
        return country.toLowerCase().includes(selectedCountry.toLowerCase());
      })
    : posts;

  return (
    <div className="post-list-page">
      <h1 className="post-list-title">All Posts</h1>

      <label htmlFor="country-input">Search by Country 🔎 </label>
      <input
        type="text"
        id="country-input"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        placeholder="Type a country..."
      />

      {filteredPosts.length ? (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts yet!</p>
      )}
    </div>
  );
}
