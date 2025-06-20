import React, { useRef, useState } from "react";
import "./MainPage.css";

function MainPage() {
  const [images, setImages] = useState([]);
  const [border, setBorder] = useState("12 px");
  const [color, setColor] = useState("#ffffff");
  const [collageUrl, setCollageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [layout, setLayout] = useState("horizontal");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000); // Ẩn sau 3s
  };

  // Hàm upload hình lên API
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("path", file);
    try {
      const res = await fetch("http://localhost:3000/api/user/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImages((prev) => [
        ...prev,
        {
          url: `http://localhost:3000/${data.data.imgUrl}`,
          name: data.data.filename,
          path: data.data.imgUrl,
          file, // Lưu thêm đường dẫn đầy đủ
        },
      ]);
    } catch (err) {
      alert("Upload failed!", err.error);
    }
  };

  // Hàm xóa hình khỏi danh sách
  const handleRemove = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Hàm tạo collage (gửi dữ liệu lên API)
  const handleMakeCollage = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    // Kiểm tra border hợp lệ (0-1000)
    const borderValue = parseInt(border.replace(/[^0-9]/g, ""), 10);
    if (isNaN(borderValue) || borderValue < 0 || borderValue > 1000) {
      showMessage("Border chỉ được phép từ 0 đến 1000", "error");
      return;
    }
    // Kiểm tra color hợp lệ (mã hex)
    const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    if (!hexColorRegex.test(color.trim())) {
      showMessage("Color phải là mã màu hex hợp lệ, ví dụ: #fff hoặc #ffffff", "error");
      return;
    }
    if (!border || !color || border.trim() === "" || color.trim() === "") {
      showMessage("Vui lòng nhập đầy đủ border và color", "error");
      return;
    }
    try {
      const formData = new FormData();
      // Thêm tất cả các đường dẫn hình ảnh vào formData
      images.forEach((img) => {
        formData.append("paths", img.file);
      });

      // Thêm các thông tin khác
      formData.append("layout", layout);
      formData.append("border_width", borderValue);
      formData.append("border_color", color);

      const response = await fetch(
        "http://localhost:3000/api/user/create-task",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.data.jobId) {
        const jobId = data.data.jobId;
        const interval = setInterval(async () => {
          const res = await fetch(
            `http://localhost:3000/api/user/check-status/${jobId}`
          );
          const data = await res.json();
          if (data.data.status === "completed") {
            const imageUrl = data.data.result.cloudUrl;
            setCollageUrl(imageUrl);
            showMessage("Make collage successfully!", "success");
            clearInterval(interval);
          }
        }, 1000);
      } else {
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating collage:", error);
      alert("Failed to create collage");
    }
  };

  const handleDownload = async () => {
    if (!collageUrl) return;
    try {
      const response = await fetch(collageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "collage.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Không thể tải ảnh về. Có thể server không cho phép tải trực tiếp.", err);
    }
  };

  return (
    <div className="main-container">
      {message && (
        <div className={`alert-overlay${messageType === "error" ? " error" : ""}`}>{message}</div>
      )}
      <div className="sidebar">
        <div className="upload-section">
          <button
            className="upload-title"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <ul className="image-list">
            {images.map((img, idx) => (
              <li key={idx}>
                <img src={img.url} alt={img.name} className="img-thumb" />
                <span>{img.name}</span>
                <span className="remove" onClick={() => handleRemove(idx)}>
                  &times;
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="options-section">
          <label>
            <input
              type="radio"
              name="collageType"
              value="horizontal"
              checked={layout === "horizontal"}
              onChange={() => setLayout("horizontal")}
            />{" "}
            Horizontal collage
          </label>
          <label>
            <input
              type="radio"
              name="collageType"
              value="vertical"
              checked={layout === "vertical"}
              onChange={() => setLayout("vertical")}
            /> Vertical collage
          </label>
          <div className="input-group">
            <label>Border</label>
            <input
              type="number"
              min={0}
              max={1000}
              value={parseInt(border.replace(/[^0-9]/g, ""), 10) || ""}
              onChange={(e) => {
                let val = e.target.value;
                if (val === "") {
                  setBorder("");
                } else {
                  let num = Math.max(0, Math.min(1000, parseInt(val, 10)));
                  setBorder(num + " px");
                }
              }}
            />
          </div>
          <div className="input-group">
            <label>Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <button className="make-collage" onClick={handleMakeCollage}>
          Make Collage
        </button>
      </div>
      <div className="preview-section">
        <div className="collage-preview">
          <div className={`collage-frame${layout === "vertical" ? " vertical" : ""}`}>
            {collageUrl ? (
              <img
                src={collageUrl}
                alt="Collage"
                className="img-thumb large"
                style={layout === "vertical" ? { maxHeight: "100%", maxWidth: "100%", height: "auto", width: "auto" } : {}}
              />
            ) : images.length === 0 ? (
              <span style={{ color: "#aaa" }}>No images</span>
            ) : (
              images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.name}
                  className="img-thumb large"
                  style={layout === "vertical" ? { height: `${100 / images.length}%`, maxHeight: "none" } : {}}
                />
              ))
            )}
          </div>
        </div>
        <button className="download-btn" onClick={handleDownload} disabled={!collageUrl}>
          Download
        </button>
      </div>
    </div>
  );
}

export default MainPage;
