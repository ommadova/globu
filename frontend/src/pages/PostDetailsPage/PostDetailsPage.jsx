import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import * as postService from "../../services/postService";
import CommentForm from "../../components/CommentForm/CommentForm";
import * as commentService from "../../services/commentService";
import "./PostDetailsPage.css";

export default function PostDetailsPage(props) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);

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

  const handleAddComment = async (commentFormData) => {
    const newComment = await postService.createComment(postId, commentFormData);

    setPost({
      ...post,
      comments: [...post.comments, newComment],
    });
    setReplyToCommentId(null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(postId, commentId);
      setPost({
        ...post,
        comments: post.comments.filter((comment) => comment._id !== commentId),
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  const country = post.country === "Other" ? post.customCountry : post.country;

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p className="post-country">{country}</p>

      <div className="post-image-gallery">
        {post.images?.length > 0 &&
          post.images
            .slice(0, 3)
            .map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Post image ${idx + 1}`}
                className="post-image"
              />
            ))}
      </div>

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
      {post.user && (
        <div className="post-comments">
          <h2>Comments</h2>

          {!post.comments.length && <p>There are no comments.</p>}
          {post.comments
            .filter((comment) => !comment.replyTo)
            .map((comment) => (
              <div key={comment._id} className="comment">
                <header>
                  <p className="comment-meta">
                    {`${comment.user.name || "Anonymous"} Posted on 
              ${new Date(comment.createdAt).toLocaleDateString()}`}
                  </p>
                </header>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions">
                  <button onClick={() => setReplyToCommentId(comment._id)}>
                    Reply
                  </button>
                  {comment.user?._id === props.user?._id && (
                    <>
                      <Link
                        to={`/posts/${postId}/comments/${comment._id}/edit`}
                      >
                        <button>✏️</button>
                      </Link>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        ❌
                      </button>
                    </>
                  )}
                </div>

                {/* Replies */}
                <div className="replies">
                  {post.comments
                    .filter((reply) => reply.replyTo === comment._id)
                    .map((reply) => (
                      <div key={reply._id} className="comment reply">
                        <header>
                          <p>
                            <strong>{reply.user?.name || "Anonymous"}</strong>{" "}
                            replied to{" "}
                            <strong>
                              {post.comments.find(
                                (c) => c._id === reply.replyTo
                              )?.user?.name || "Anonymous"}
                            </strong>{" "}
                            on {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </header>
                        <p className="comment-text">{reply.text}</p>
                        <div className="comment-actions">
                          <button
                            onClick={() => setReplyToCommentId(reply._id)}
                          >
                            Reply
                          </button>
                          {reply.user?._id === props.user?._id && (
                            <>
                              <Link
                                to={`/posts/${postId}/comments/${reply._id}/edit`}
                              >
                                <button>✏️</button>
                              </Link>
                              <button
                                onClick={() => handleDeleteComment(reply._id)}
                              >
                                ❌
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          <div className="comment-form-section">
            <h3>Leave a Comment</h3>
            <CommentForm
              postId={post._id}
              handleAddComment={handleAddComment}
              replyTo={replyToCommentId}
            />
          </div>
        </div>
      )}

      <div className="post-favorites">
        <p>
          <strong>Favorites:</strong> {post.favoritedBy.length}
        </p>
        {props.user && props.user._id === post.user._id && (
          <>
            <button
              onClick={() => props.handleDeletePost(postId)}
              className="btn-delete"
            >
              Delete
            </button>
            &nbsp;
            <Link to={`/posts/${postId}/edit`}>
              {" "}
              <button className="btn-edit">Edit</button> &nbsp;{" "}
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
