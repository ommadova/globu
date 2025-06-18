import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as postService from "../../services/postService";
import "./NewPostPage.css";

export default function NewPostPage({
  handleAddPost,
  handleUpdatePost,
  posts,
}) {
  const { postId } = useParams();
  const isEdit = Boolean(postId);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    customCountry: "",
    content: "",
    places: [{ name: "", link: "" }],
    foods: [{ name: "", link: "" }],
    drinks: [{ name: "", link: "" }],
    images: [""],
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await postService.show(postId);
      setFormData({
        title: postData.title || "",
        country: postData.country || "",
        customCountry: postData.customCountry || "",
        content: postData.content || "",
        places: postData.places || [{ name: "", link: "" }],
        foods: postData.foods || [{ name: "", link: "" }],
        drinks: postData.drinks || [{ name: "", link: "" }],
        images: (postData.images || []).map((img) => img.url),
      });
    };

    if (isEdit) fetchPost();

    return () =>
      setFormData({
        title: "",
        country: "",
        customCountry: "",
        content: "",
        places: [{ name: "", link: "" }],
        foods: [{ name: "", link: "" }],
        drinks: [{ name: "", link: "" }],
        images: [""],
      });
  }, [isEdit, postId]);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("customCountry", formData.customCountry);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("places", JSON.stringify(formData.places));
    formDataToSend.append("foods", JSON.stringify(formData.foods));
    formDataToSend.append("drinks", JSON.stringify(formData.drinks));

    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      const files = Array.from(fileInputRef.current.files).slice(0, 3);
      for (const file of files) {
        formDataToSend.append("images", file);
      }
    }

    try {
      if (isEdit && handleUpdatePost) {
        await handleUpdatePost(postId, formDataToSend);
      } else if (handleAddPost) {
        await handleAddPost(formDataToSend);
      } else {
        await postService.create(formDataToSend);
        navigate("/posts");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save post.");
    }
  }

  function handleArrayChange(type, idx, field, value) {
    const updated = [...formData[type]];
    updated[idx][field] = value;
    setFormData({ ...formData, [type]: updated });
  }

  const essentialsFilled =
    formData.title.trim() && formData.country.trim() && formData.content.trim();

  return (
    <div className="new-post-page">
      <h1>{postId ? "Edit Post" : "Create New Post"}</h1>

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
            <label>Places (optional)</label>
            {formData.places.map((place, idx) => (
              <div key={idx} className="input-pair">
                <input
                  type="text"
                  placeholder="Place name"
                  value={place.name}
                  onChange={(e) =>
                    handleArrayChange("places", idx, "name", e.target.value)
                  }
                />
                <input
                  type="url"
                  placeholder="Place link (optional)"
                  value={place.link}
                  onChange={(e) =>
                    handleArrayChange("places", idx, "link", e.target.value)
                  }
                />
              </div>
            ))}

            <label>Foods (optional)</label>
            {formData.foods.map((food, idx) => (
              <div key={`food-${idx}`} className="input-pair">
                <input
                  type="text"
                  placeholder="Food name"
                  value={food.name}
                  onChange={(e) =>
                    handleArrayChange("foods", idx, "name", e.target.value)
                  }
                />
                <input
                  type="url"
                  placeholder="Food link"
                  value={food.link}
                  onChange={(e) =>
                    handleArrayChange("foods", idx, "link", e.target.value)
                  }
                />
              </div>
            ))}

            <label>Drinks (optional)</label>
            {formData.drinks.map((drink, idx) => (
              <div key={`drink-${idx}`} className="input-pair">
                <input
                  type="text"
                  placeholder="Drink name"
                  value={drink.name}
                  onChange={(e) =>
                    handleArrayChange("drinks", idx, "name", e.target.value)
                  }
                />
                <input
                  type="url"
                  placeholder="Drink link"
                  value={drink.link}
                  onChange={(e) =>
                    handleArrayChange("drinks", idx, "link", e.target.value)
                  }
                />
              </div>
            ))}

            <label>Upload up to 3 Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="styled-file-input"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files.length > 3) {
                  alert("You can only upload up to 3 images.");
                  e.target.value = ""; // Reset the input
                }
              }}
            />
          </>
        )}

        <button type="submit" className="buttons">
          {isEdit ? "Update Post" : "Create Post"}
        </button>
      </form>

      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </div>
  );
}
