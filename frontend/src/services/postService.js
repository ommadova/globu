import sendRequest from "./sendRequest";

const BASE_URL = "/api/posts";

export async function index(query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  return sendRequest(url);
}

export async function create(formDataToSend) {
  return sendRequest(BASE_URL, "POST", formDataToSend);
}

export async function show(postId) {
  return sendRequest(`${BASE_URL}/${postId}`);
}

export async function deletePost(postId) {
  return sendRequest(`${BASE_URL}/${postId}`, "DELETE");
}

export async function update(postId, postData) {
  return sendRequest(`${BASE_URL}/${postId}`, "PUT", postData);
}

export function createComment(postId, commentData) {
  return sendRequest(`${BASE_URL}/${postId}/comments`, "POST", commentData);
}
