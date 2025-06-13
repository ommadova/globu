import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as commentService from "../../services/commentService";
import * as postService from "../../services/postService";

const CommentForm = (props) => {
  const [formData, setFormData] = useState({ text: "" });
  const navigate = useNavigate();
  const { postId, commentId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await postService.show(postId);
      const existingComment = postData.comments.find(
        (comment) => comment._id === commentId
      );
      if (existingComment) {
        setFormData({ text: existingComment.text });
      }
    };
    if (postId && commentId) fetchPost();
  }, [postId, commentId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      if (postId && commentId) {
        await commentService.updateComment(postId, commentId, formData);
        navigate(`/posts/${postId}`);
      } else {
        props.handleAddComment(formData);
        setFormData({ text: "" });
      }
    } catch (err) {
      console.error("Error submitting comment:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Comment</label>
      <textarea
        id="text"
        name="text"
        value={formData.text}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
