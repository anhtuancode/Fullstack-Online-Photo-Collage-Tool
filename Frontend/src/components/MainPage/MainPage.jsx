import React from 'react'
import './MainPage.css'

function MainPage() {
  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="upload-section">
          <button className="upload-title">Upload Image</button>
          <ul className="image-list">
          </ul>
        </div>
        <div className="options-section">
          <label><input type="radio" name="collageType" defaultChecked /> Horizontal collage</label>
          <label><input type="radio" name="collageType" /> Vertical collage</label>
          <div className="input-group">
            <label>Border</label>
            <input type="text" value="12 px"/>
          </div>
          <div className="input-group">
            <label>Color</label>
            <input type="text" value="#ffffff"/>
          </div>
        </div>
        <button className="make-collage">Make Collage</button>
      </div>
      <div className="preview-section">
        <div className="collage-preview">
          <div className="collage-frame">
            <span className="img-thumb img1 large"></span>
            <span className="img-thumb img2 large"></span>
            <span className="img-thumb img3 large"></span>
          </div>
        </div>
        <button className="download-btn">Download</button>
      </div>
    </div>
  )
}

export default MainPage 