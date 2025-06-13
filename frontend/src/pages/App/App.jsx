import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { getUser } from "../../services/authService";
import HomePage from "../HomePage/HomePage";
import PostListPage from "../PostListPage/PostListPage";
import NewPostPage from "../NewPostPage/NewPostPage";
import PostDetailsPage from "../PostDetailsPage/PostDetailsPage";
import SignUpPage from "../SignUpPage/SignUpPage";
import LogInPage from "../LogInPage/LogInPage";
import NavBar from "../../components/NavBar/NavBar";
import * as postService from "../../services/postService";
import MyPostsPage from "../MyPostsPage/MyPostsPage";
import CommentForm from "../../components/CommentForm/CommentForm";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(getUser());
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleAddPost = async (postFormData) => {
    try {
      const newPost = await postService.create(postFormData);
      setPosts([newPost, ...posts]);
      navigate("/posts");
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const deletedPost = await postService.deletePost(postId);
    setPosts(posts.filter((post) => post._id !== postId));
    navigate("/posts");
  };

  const handleUpdatePost = async (postId, postFormData) => {
    const updatedPost = await postService.update(postId, postFormData);
    setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    navigate(`/posts/${postId}`);
  };

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostListPage posts={posts} />} />
          <Route
            path="/posts/:postId"
            element={
              <PostDetailsPage
                user={user}
                handleDeletePost={handleDeletePost}
              />
            }
          />

          {user ? (
            <>
              <Route
                path="/posts/new"
                element={
                  <NewPostPage handleAddPost={handleAddPost} posts={posts} />
                }
              />
              <Route
                path="/posts/:postId/edit"
                element={
                  <NewPostPage
                    handleUpdatePost={handleUpdatePost}
                    posts={posts}
                  />
                }
              />
              <Route
                path="/myposts"
                element={
                  <MyPostsPage
                    user={user}
                    posts={posts}
                    handleDeletePost={handleDeletePost}
                  />
                }
              />
            </>
          ) : (
            <>
              <Route
                path="/signup"
                element={<SignUpPage setUser={setUser} />}
              />
              <Route path="/login" element={<LogInPage setUser={setUser} />} />
            </>
          )}

          <Route path="*" element={null} />
        </Routes>
      </section>
    </main>
  );
}
