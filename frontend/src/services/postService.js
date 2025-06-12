import sendRequest from "./sendRequest";

const BASE_URL = "/api/posts";

export async function index() {
  return sendRequest(BASE_URL);
}

export async function create(formData) {
  return sendRequest(BASE_URL, "POST", formData);
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
