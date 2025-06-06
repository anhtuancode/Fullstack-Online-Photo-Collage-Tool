// Lấy các phần tử cần dùng
const uploadBtn = document.querySelector('.upload-btn');
const uploadModal = document.getElementById('uploadModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const uploadFilesBtn = document.getElementById('uploadFilesBtn');
const fileInput = document.getElementById('fileInput');
const controlPanel = document.querySelector('.control-panel');
const uploadedList = document.getElementById('uploadedList');
const makeCollageBtn = document.querySelector('.make-collage-btn');
const previewArea = document.querySelector('.preview-area');
const downloadBtn = document.querySelector('.download-btn');

let uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
let uploadedImageData = JSON.parse(localStorage.getItem('uploadedImageData') || '{}');
let currentCollageJobId = null;

// Render lại khi load trang
function renderUploadedList() {
    uploadedList.innerHTML = '';
    
    uploadedImages.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = 'uploaded-item';
        
        // Tạo thumbnail preview
        const thumbnail = document.createElement('img');
        thumbnail.className = 'uploaded-item-thumbnail';
        thumbnail.src = uploadedImageData[name] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMyMi43NiAyNSAyNSAyMi43NiAyNSAyMEMyNSAxNy4yNCAyMi43NiAxNSAyMCAxNUMxNy4yNCAxNSAxNSAxNy4yNCAxNSAyMEMxNSAyMi43NiAxNy4yNCAyNSAyMCAyNVoiIGZpbGw9IiNjY2MiLz4KPHA+dGggZD0iTTEwIDMwSDE2TDIwIDI2TDI0IDMwSDMwVjMySDEwVjMwWiIgZmlsbD0iI2NjYyIvPgo8L3N2Zz4K';
        thumbnail.alt = name;
        thumbnail.onerror = () => {
            // Fallback nếu không load được hình
            thumbnail.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMyMi43NiAyNSAyNSAyMi43NiAyNSAyMEMyNSAxNy4yNCAyMi43NiAxNSAyMCAxNUMxNy4yNCAxNSAxNSAxNy4yNCAxNSAyMEMxNSAyMi43NiAxNy4yNCAyNSAyMCAyNVoiIGZpbGw9IiNjY2MiLz4KPHA+dGggZD0iTTEwIDMwSDE2TDIwIDI2TDI0IDMwSDMwVjMySDEwVjMwWiIgZmlsbD0iI2NjYyIvPgo8L3N2Zz4K';
        };
        
        // Tạo span cho tên file
        const nameSpan = document.createElement('span');
        nameSpan.className = 'uploaded-item-name';
        nameSpan.textContent = name;
        
        // Tạo icon X để xóa
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '✕';
        deleteBtn.title = 'Xóa hình ảnh';
        
        // Thêm sự kiện xóa
        deleteBtn.onclick = () => {
            deleteImage(index);
        };
        
        li.appendChild(thumbnail);
        li.appendChild(nameSpan);
        li.appendChild(deleteBtn);
        uploadedList.appendChild(li);
    });
}

// Hàm xóa hình ảnh
function deleteImage(index) {
    // Xác nhận trước khi xóa
    if (confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
        const imageName = uploadedImages[index];
        uploadedImages.splice(index, 1);
        
        // Xóa cả data của hình ảnh
        delete uploadedImageData[imageName];
        
        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
        localStorage.setItem('uploadedImageData', JSON.stringify(uploadedImageData));
        renderUploadedList();
    }
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
        // Tạo preview thumbnail
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImageData[file.name] = e.target.result;
            localStorage.setItem('uploadedImageData', JSON.stringify(uploadedImageData));
            renderUploadedList();
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('path', file);

        try {
            // Gọi API upload
            const res = await fetch('http://localhost:3000/api/user/upload-image', {
                method: 'POST',
                body: formData
            });
            await res.json();

            uploadedImages.push(file.name);
            localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
        } catch (error) {
            console.error('Lỗi upload:', error);
            alert('Có lỗi xảy ra khi upload hình ảnh: ' + file.name);
        }
    }
    
    // Reset input và đóng modal
    fileInput.value = '';
    uploadModal.style.display = 'none';
};

// 4. Tạo collage khi nhấn nút Make Collage
makeCollageBtn.onclick = async (e) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
        alert('Vui lòng upload ít nhất một hình ảnh trước khi tạo collage!');
        return;
    }

    try {
        // Hiển thị loading ngay lập tức
        makeCollageBtn.disabled = true;
        makeCollageBtn.innerHTML = '⏳ Đang tạo collage...';
        
        // Hiển thị loading trong preview area
        previewArea.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
                <p style="font-size: 1.1rem; font-weight: bold;">Đang tạo collage...</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Vui lòng đợi trong giây lát</p>
            </div>
        `;
        
        console.log('Bắt đầu tạo collage...');
        
        // Lấy các giá trị từ form
        const orientation = document.querySelector('input[name="orientation"]:checked').value;
        const borderWidth = document.getElementById('border').value;
        const borderColor = document.getElementById('color').value;

        console.log('Thông số collage:', { orientation, borderWidth, borderColor });

        // Tạo FormData để gửi files
        const formData = new FormData();
        
        // FIX 1: Sửa cách thêm files vào FormData
        for (let i = 0; i < uploadedImages.length; i++) {
            const imageName = uploadedImages[i];
            const imageData = uploadedImageData[imageName];
            
            if (imageData) {
                try {
                    // Chuyển base64 thành blob đúng cách
                    const base64Data = imageData.split(',')[1]; // Loại bỏ "data:image/...;base64,"
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    
                    for (let j = 0; j < byteCharacters.length; j++) {
                        byteNumbers[j] = byteCharacters.charCodeAt(j);
                    }
                    
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'image/jpeg' });
                    
                    formData.append('path', blob, imageName);
                    console.log(`✅ Đã thêm file: ${imageName}, size: ${blob.size} bytes`);
                } catch (error) {
                    console.error(`❌ Lỗi khi xử lý file ${imageName}:`, error);
                }
            } else {
                console.warn(`⚠️ Không tìm thấy data cho file: ${imageName}`);
            }
        }

        // Thêm các thông số collage
        formData.append('layout', orientation);
        formData.append('border_width', borderWidth);
        formData.append('border_color', borderColor);

        // Debug FormData
        console.log('📋 FormData contents:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File || value instanceof Blob) {
                console.log(`${key}: ${value.constructor.name} (${value.size} bytes, type: ${value.type})`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        console.log('📤 Gửi request đến API create-task...');

        // Gọi API tạo collage task
        const response = await fetch('http://localhost:3000/api/user/create-task', {
            method: 'POST',
            body: formData
        });

        console.log('📥 Response status:', response.status);
        
        const result = await response.json();
        console.log('📋 Response data:', result);

        // API trả về jobId như expected
        console.log('🆔 JobId from API:', result.jobId);

        if (response.ok && result.jobId) {
            currentCollageJobId = result.jobId;
            
            // Hiển thị thông báo job đã được tạo
            previewArea.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🎨</div>
                    <p style="font-size: 1.1rem; font-weight: bold;">Đã tạo task thành công!</p>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Job ID: ${result.jobId}</p>
                    <p style="font-size: 0.9rem; color: #666;">Đang xử lý collage...</p>
                </div>
            `;
            
            // Bắt đầu polling để check trạng thái job
            pollJobStatus(result.jobId);
        } else {
            // In ra toàn bộ response để debug
            console.error('❌ API Error - Full response:', result);
            console.error('❌ Response OK:', response.ok);
            console.error('❌ JobId found:', result.jobId);
            
            throw new Error(result.message || result.error || 'Có lỗi xảy ra khi tạo collage task. Không tìm thấy Job ID.');
        }

    } catch (error) {
        console.error('💥 Lỗi tạo collage:', error);
        
        // Hiển thị lỗi trong preview area
        previewArea.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                <p style="font-size: 1.1rem; font-weight: bold; color: #ff4444;">Có lỗi xảy ra!</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${error.message}</p>
            </div>
        `;
        
        alert('Có lỗi xảy ra khi tạo collage: ' + error.message);
    } finally {
        // Reset button sau 1 giây để user thấy được loading
        setTimeout(() => {
            makeCollageBtn.disabled = false;
            makeCollageBtn.innerHTML = '🎨 Make Collage';
        }, 1000);
    }
};

// Hàm polling để check trạng thái job
async function pollJobStatus(jobId) {

    const maxAttempts = 30; // 30 lần, mỗi lần 2 giây = 1 phút
    let attempts = 0;

    const checkStatus = async () => {
        try {
            attempts++;
            console.log(`Checking job status - Attempt ${attempts}/${maxAttempts}`);
            
            // Cập nhật UI để hiển thị progress
            previewArea.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                    <p style="font-size: 1.1rem; font-weight: bold;">Đang xử lý collage...</p>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Job ID: ${jobId}</p>
                    <p style="font-size: 0.9rem; color: #666;">Kiểm tra lần ${attempts}/${maxAttempts}</p>
                    <div style="width: 100%; background: #f0f0f0; border-radius: 10px; margin-top: 1rem;">
                        <div style="width: ${(attempts/maxAttempts)*100}%; background: #4CAF50; height: 8px; border-radius: 10px; transition: width 0.3s;"></div>
                    </div>
                </div>
            `;

            // Gọi API check-status với đúng endpoint
            const response = await fetch(`http://localhost:3000/api/user/check-status/${jobId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Job status:', result);

            if (result.status === 'completed') {
                // Job hoàn thành
                console.log('Job completed successfully!');
                previewArea.innerHTML = `
                    <div style="text-align: center; padding: 1rem;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">✅</div>
                        <p style="font-size: 1.1rem; font-weight: bold; color: #4CAF50;">Collage đã hoàn thành!</p>
                        <img src="${result.collageUrl || result.result}" alt="Collage" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
                    </div>
                `;
                // Hiển thị nút download
                downloadBtn.style.display = 'block';
                downloadBtn.onclick = () => {
                    const imageUrl = result.collageUrl || result.result;
                    const a = document.createElement('a');
                    a.href = imageUrl;
                    a.download = 'my-collage.jpg';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
                return;
            } else if (result.status === 'failed') {
                // Job thất bại
                console.log('Job failed:', result.error);
                previewArea.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                        <p style="font-size: 1.1rem; font-weight: bold; color: #ff4444;">Có lỗi xảy ra khi tạo collage</p>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${result.error || 'Vui lòng thử lại'}</p>
                    </div>
                `;
                return;
            } else if (result.status === 'processing' || result.status === 'pending') {
                // Vẫn đang xử lý, tiếp tục polling
                if (attempts < maxAttempts) {
                    console.log(`Job still processing, will check again in 2 seconds...`);
                    setTimeout(checkStatus, 2000); // Check lại sau 2 giây
                } else {
                    // Timeout
                    console.log('Job polling timeout');
                    previewArea.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 2rem; margin-bottom: 1rem;">⏰</div>
                            <p style="font-size: 1.1rem; font-weight: bold; color: #ff9800;">Timeout</p>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Quá trình tạo collage mất nhiều thời gian hơn dự kiến</p>
                            <p style="font-size: 0.8rem; color: #666;">Job ID: ${jobId}</p>
                        </div>
                    `;
                }
            } else {
                // Trạng thái không xác định, tiếp tục polling
                if (attempts < maxAttempts) {
                    console.log(`Unknown status: ${result.status}, continuing...`);
                    setTimeout(checkStatus, 2000);
                } else {
                    previewArea.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 2rem; margin-bottom: 1rem;">❓</div>
                            <p style="font-size: 1.1rem; font-weight: bold; color: #ff9800;">Trạng thái không xác định</p>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Status: ${result.status}</p>
                            <p style="font-size: 0.8rem; color: #666;">Job ID: ${jobId}</p>
                        </div>
                    `;
                }
            }
            
        } catch (error) {
            console.error('Lỗi check job status:', error);
            
            if (attempts < maxAttempts) {
                // Thử lại nếu chưa hết số lần
                console.log('Retrying in 3 seconds...');
                setTimeout(checkStatus, 3000);
            } else {
                // Hiển thị lỗi nếu đã hết số lần thử
                previewArea.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">🚫</div>
                        <p style="font-size: 1.1rem; font-weight: bold; color: #ff4444;">Không thể kiểm tra trạng thái</p>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${error.message}</p>
                        <p style="font-size: 0.8rem; color: #666;">Job ID: ${jobId}</p>
                    </div>
                `;
            }
        }
    };

    // Bắt đầu check ngay lập tức
    setTimeout(checkStatus, 5000); // Check sau 1 giây
}