import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as commentService from "../../services/commentService";
import * as postService from "../../services/postService";

const CommentForm = (props) => {
  const [formData, setFormData] = useState({ text: "" });
  const navigate = useNavigate();
  const { postId, commentId } = useParams();
  console.log(postId, commentId);

  useEffect(() => {
    async function fetchCommentToEdit() {
      const postData = await postService.show(postId);
      const foundComment = postData.comments.find(
        (comment) => comment._id === commentId
      );
      if (foundComment) {
        setFormData({ text: foundComment.text });
      }
    }

    if (postId && commentId) {
      fetchCommentToEdit();
    }
  }, [postId, commentId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const data = { ...formData };
    if (props.replyTo) data.replyTo = props.replyTo;

    if (postId && commentId) {
      await commentService.update(postId, commentId, data);
      navigate(`/posts/${postId}`);
    } else {
      await props.handleAddComment(data);
      if (props.clearReply) props.clearReply();
    }

    setFormData({ text: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      {props.replyTo && <p className="replying-to">Replying to a comment...</p>}
      <textarea
        id="text"
        name="text"
        value={formData.text}
        onChange={handleChange}
        required
        placeholder="Write your comment here..."
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
