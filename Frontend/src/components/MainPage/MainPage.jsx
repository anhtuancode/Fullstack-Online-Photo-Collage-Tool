import React, { useRef, useState } from 'react'
import './MainPage.css'

function MainPage() {
  const [images, setImages] = useState([])
  const [border, setBorder] = useState('12 px')
  const [color, setColor] = useState('#ffffff')
  const fileInputRef = useRef(null)

  // Hàm upload hình lên API
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('path', file)
    try {
      const res = await fetch('http://localhost:3000/api/user/upload-image', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      console.log(data.data.imgUrl)
      setImages(prev => [...prev, { 
        url: `http://localhost:3000/${data.data.imgUrl}`, 
        name: data.data.filename,
        path: data.data.imgUrl,
        file // Lưu thêm đường dẫn đầy đủ
      }])
    } catch (err) {
      alert('Upload failed!', err.error)
    }
  }

  // Hàm xóa hình khỏi danh sách
  const handleRemove = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  // Hàm tạo collage (gửi dữ liệu lên API)
  const handleMakeCollage = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image')
      return
    }

    try {
      const formData = new FormData()
      // Thêm tất cả các đường dẫn hình ảnh vào formData
      images.forEach(img => {
        formData.append('paths', img.file)
      })
      
      // Thêm các thông tin khác
      const layout = document.querySelector('input[name="collageType"]:checked').value
      console.log(layout) 
      formData.append('layout', layout)
      formData.append('border_width', border.replace(' px', ''))
      formData.append('border_color', color)

      const response = await fetch('http://localhost:3000/api/user/create-task', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.data.jobId) {
        alert('Task created successfully! Job ID: ' + data.data.jobId)
        // TODO: Có thể thêm logic để kiểm tra trạng thái task ở đây
      } else {
        alert('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating collage:', error)
      alert('Failed to create collage')
    }
  }

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="upload-section">
          <button className="upload-title" onClick={() => fileInputRef.current.click()}>Upload Image</button>
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleUpload} />
          <ul className="image-list">
            {images.map((img, idx) => (
              <li key={idx}>
                <img src={img.url} alt={img.name} className="img-thumb" />
                <span>{img.name}</span>
                <span className="remove" onClick={() => handleRemove(idx)}>&times;</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="options-section">
          <label><input type="radio" name="collageType" value="horizontal" defaultChecked /> Horizontal collage</label>
          <label><input type="radio" name="collageType" value="vertical" /> Vertical collage</label>
          <div className="input-group">
            <label>Border</label>
            <input type="text" value={border} onChange={e => setBorder(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Color</label>
            <input type="text" value={color} onChange={e => setColor(e.target.value)} />
          </div>
        </div>
        <button className="make-collage" onClick={handleMakeCollage}>Make Collage</button>
      </div>
      <div className="preview-section">
        <div className="collage-preview">
          <div className="collage-frame">
            {images.length === 0 ? (
              <span style={{color:'#aaa'}}>No images</span>
            ) : (
              images.map((img, idx) => (
                <img key={idx} src={img.url} alt={img.name} className="img-thumb large" />
              ))
            )}
          </div>
        </div>
        <button className="download-btn">Download</button>
      </div>
    </div>
  )
}

export default MainPage 