import sendRequest from "./sendRequest";
const BASE_URL = "/api/posts";

export function deleteComment(postId, commentId) {
  return sendRequest(`${BASE_URL}/${postId}/comments/${commentId}`, "DELETE");
}

export function update(postId, commentId, updatedData) {
  return sendRequest(
    `${BASE_URL}/${postId}/comments/${commentId}`,
    "PUT",
    updatedData
  );
}
