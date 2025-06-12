import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import * as postService from "../../services/postService";
import "./PostDetailsPage.css";

export default function PostDetailsPage(props) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await postService.show(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post");
      }
    }
    fetchPost();
  }, [postId]);

  if (error) return <p>{error}</p>;
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
        {post.user._id === post.user._id && (
          <>
            <button
              onClick={() => props.handleDeletePost(postId)}
              className="btn-delete"
            >
              Delete
            </button>
            <Link to={`/posts/${postId}/edit`}>
              {" "}
              <button className="btn-edit">Edit</button> <br />{" "}
            </Link>
          </>
        )}
      </div>
      <div className="post-actions">
        <button className="btn-favorite">Favorite</button>
      </div>
    </div>
  );
}
