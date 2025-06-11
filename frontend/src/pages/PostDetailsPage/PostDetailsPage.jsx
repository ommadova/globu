import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as postService from "../../services/postService";

export default function PostDetailsPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      const fetchedPost = await postService.show(postId); // Your API call
      setPost(fetchedPost);
    }
    fetchPost();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  const country = post.country === "Other" ? post.customCountry : post.country;

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p className="post-country">{country}</p>

      {post.images?.[0]?.url && (
        <img
          src={post.images[0].url}
          alt={post.title}
          className="post-main-image"
        />
      )}
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-meta">
        <p>
          <strong>Places:</strong> {post.places?.join(", ")}
        </p>
        <p>
          <strong>Foods:</strong> {post.foods?.join(", ")}
        </p>
        <p>
          <strong>Drinks:</strong> {post.drinks?.join(", ")}
        </p>
      </div>
      <div className="post-author">
        <p>
          <strong>Author:</strong> {post.user?.name.toUpperCase() || "Unknown"}
        </p>
      </div>
      <div className="post-comments">
        <h2>Comments</h2>
        {post.comments.length ? (
          post.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p>{comment.text}</p>
              <p className="comment-author">
                <strong>{comment.user?.name || "Anonymous"}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <div className="post-favorites">
        <p>
          <strong>Favorites:</strong> {post.favoritedBy.length}
        </p>
      </div>
      <div className="post-actions">
        <button className="btn-favorite">Favorite</button>
        <button className="btn-edit">Edit</button>
        <button className="btn-delete">Delete</button>
      </div>
    </div>
  );
}
