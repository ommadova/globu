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
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            className="input"
            placeholder="Search by country..."
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          />
          <svg className="search__icon" viewBox="0 0 24 24">
            <path d="M21.71 20.29l-3.388-3.388A8.953 8.953 0 0 0 19 11a9 9 0 1 0-9 9 8.953 8.953 0 0 0 5.902-1.678l3.388 3.388a1 1 0 0 0 1.414-1.414zM11 18a7 7 0 1 1 7-7 7.008 7.008 0 0 1-7 7z" />
          </svg>
        </div>
      </div>
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
