import { useState } from "react";
import { useNavigate } from "react-router";
import * as postService from "../../services/postService";

export default function NewPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    customCountry: "",
    content: "",
    places: "",
    foods: "",
    drinks: "",
    images: [""],
  });

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const payload = {
      ...formData,
      places: formData.places.split(",").map((item) => item.trim()),
      foods: formData.foods.split(",").map((item) => item.trim()),
      drinks: formData.drinks.split(",").map((item) => item.trim()),
      images: formData.images.filter(Boolean).map((url) => ({ url })),
    };

    try {
      await postService.create(payload);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create post.");
    }
  }
  const essentialsFilled =
    formData.title.trim() && formData.country.trim() && formData.content.trim();

  return (
    <div className="new-post-page">
      <h2>Create a New Post</h2>

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Country</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Country --</option>
          <option value="Other">Other</option>
          <option value="France">France</option>
          <option value="Japan">Japan</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="United States">United States</option>
          <option value="Italy">Italy</option>
          <option value="Turkey">Turkey</option>
          <option value="Spain">Spain</option>
          <option value="Thailand">Thailand</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="China">China</option>
          <option value="Austria">Austria</option>
          <option value="Greece">Greece</option>
          <option value="Portugal">Portugal</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
          <option value="Russia">Russia</option>
          <option value="Switzerland">Switzerland</option>
          <option value="Belgium">Belgium</option>
          <option value="Brazil">Brazil</option>
          <option value="South Africa">South Africa</option>
          <option value="Poland">Poland</option>
          <option value="Netherlands">Netherlands</option>
          <option value="South Korea">South Korea</option>
          <option value="Other">Other</option>
        </select>

        {formData.country === "Other" && (
          <>
            <label>Custom Country</label>
            <input
              name="customCountry"
              value={formData.customCountry}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
        />

        {essentialsFilled && (
          <>
            <hr />
            <h4>Optional Details</h4>

            <label>Places (comma separated)</label>
            <input
              name="places"
              value={formData.places}
              onChange={handleChange}
              placeholder="e.g. Blue Bottle Coffee - Tokyo (https://goo.gl/maps/abc123)"
            />

            <label>Foods (comma separated)</label>
            <input
              name="foods"
              value={formData.foods}
              onChange={handleChange}
              placeholder="e.g. Sushi - Tsukiji Market (https://example.com/sushi)"
            />

            <label>Drinks (comma separated)</label>
            <input
              name="drinks"
              value={formData.drinks}
              onChange={handleChange}
              placeholder="e.g. Matcha Latte - Nara Café (https://goo.gl/maps/matcha123)"
            />

            <label>Image URL</label>
            <input
              name="images"
              value={formData.images[0] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, images: [e.target.value] }))
              }
              placeholder="https://your-image-url.com"
            />
          </>
        )}

        <button type="submit">Create Post</button>
      </form>

      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </div>
  );
}
