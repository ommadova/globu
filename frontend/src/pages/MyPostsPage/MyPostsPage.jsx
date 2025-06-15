import { useEffect, useState } from "react";
import * as postService from "../../services/postService";
import PostCard from "../../components/PostCard/PostCard";

export default function MyPostsPage({ user }) {
  const [myPosts, setMyPosts] = useState([]);
  useEffect(() => {
    async function fetchMyPosts() {
      const { posts } = await postService.index();
      const filtered = posts.filter((post) => post.user._id === user._id);
      setMyPosts(filtered);
    }

    if (user) fetchMyPosts();
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
        <p>You haven't created any posts yet.</p>
      )}
    </div>
  );
}
