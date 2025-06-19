import sendRequest from "./sendRequest";

const BASE_URL = "/api/users";

export async function uploadProfilePhoto(formData) {
  return sendRequest(`${BASE_URL}/profile-photo`, "POST", formData, true);
}

export async function getCurrentUser() {
  return sendRequest(`${BASE_URL}/me`);
}
