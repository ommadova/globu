import { useEffect, useState } from "react";
import * as postService from "../../services/postService";
import PostCard from "../../components/PostCard/PostCard";
import "./MyPostsPage.css";

export default function MyPostsPage({ user }) {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    async function fetchMyPosts() {
      if (!user) return;

      // Pass user ID as query
      const posts = await postService.index({ user: user._id });
      setMyPosts(posts);
    }

    fetchMyPosts();
  }, [user]);

  return (
    <div className="my-posts-page">
      <h1>My Posts</h1>
      {myPosts.length ? (
        <div className="posts-grid">
          {myPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>You haven’t created any posts yet.</p>
      )}
    </div>
  );
}
