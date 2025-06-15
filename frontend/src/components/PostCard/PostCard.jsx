import { Link } from "react-router";
import "./PostCard.css";

export default function PostCard({ post }) {
  const country = post.country === "Other" ? post.customCountry : post.country;

  return (
    <div className="post-card">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="post-image" />
      )}
      <div className="post-card-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-country">{country}</p>{" "}
        <p className="post-snippet">{post.content?.slice(0, 100)}...</p>
        <div className="post-footer">
          <Link to={`/posts/${post._id}`} className="read-more">
            Read More ...
          </Link>
        </div>
      </div>
    </div>
  );
}
