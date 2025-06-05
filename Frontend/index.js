// Lấy các phần tử cần dùng
const uploadBtn = document.querySelector('.upload-btn');
const uploadModal = document.getElementById('uploadModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const uploadFilesBtn = document.getElementById('uploadFilesBtn');
const fileInput = document.getElementById('fileInput');
const controlPanel = document.querySelector('.control-panel');
const uploadedList = document.getElementById('uploadedList');

let uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');

// Render lại khi load trang
function renderUploadedList() {
    uploadedList.innerHTML = '';
    uploadedImages.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        uploadedList.appendChild(li);
    });
}
renderUploadedList();

// 1. Hiện modal khi nhấn nút Upload image
uploadBtn.onclick = () => {
  uploadModal.style.display = 'flex';
};

// 2. Đóng modal khi nhấn Hủy
closeModalBtn.onclick = () => {
  uploadModal.style.display = 'none';
  fileInput.value = '';
};

// 3. Upload file khi nhấn Upload trong modal
uploadFilesBtn.onclick = async () => {
  const files = Array.from(fileInput.files);
  if (files.length === 0) return;

  for (const file of files) {
    const formData = new FormData();
    formData.append('path', file);

    // Gọi API upload
    const res = await fetch('http://localhost:3000/api/user/upload-image', {
      method: 'POST',
      body: formData
    });
    await res.json();

    uploadedImages.push(file.name);
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  }
  renderUploadedList();
  // Reset input và đóng modal
  fileInput.value = '';
  uploadModal.style.display = 'none';
};