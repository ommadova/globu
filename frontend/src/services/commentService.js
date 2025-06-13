import sendRequest from "./sendRequest";
const BASE_URL = "/api/posts";
export function create(postId, commentData) {
  return sendRequest(`${BASE_URL}/${postId}/comments`, "POST", commentData);
}

export function deleteComment(postId, commentId) {
  return sendRequest(`${BASE_URL}/${postId}/comments/${commentId}`, "DELETE");
}

export function updateComment(postId, commentId, updatedData) {
  return sendRequest(
    `${BASE_URL}/${postId}/comments/${commentId}`,
    "PUT",
    updatedData
  );
}
