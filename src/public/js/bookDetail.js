document.addEventListener("DOMContentLoaded", function () {
    const bookDetailContainer = document.getElementById("book-detail");
    
    const pathSegments = window.location.pathname.split("/");
    const bookId = pathSegments[pathSegments.length - 1] || 7; 
    
    function fetchBookDetail() {
        fetch(`/api/book/${bookId}`)
            .then(response => response.json())
            .then(book => {
                renderBookDetail(book);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu sách:", error);
                bookDetailContainer.innerHTML = "<p class='text-danger text-center'>Không thể tải thông tin sách.</p>";
            });
    }

    function renderBookDetail(book) {
        let categories = book.Categories.map(cat => `<span class='badge badge-info me-1'>${cat.CategoryName}</span>`).join(" ");
        document.title = book.Title;

        let bookHtml = `
            <div class="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center justify-content-center bg-light">
                        <img src="/${book.Image}" class="img-fluid p-3 rounded" alt="${book.Title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body p-4">
                            <h3 class="card-title text-primary fw-bold">${book.Title}</h3>
                            <p class="card-text mb-1"><strong>Tác giả:</strong> ${book.Author}</p>
                            <p class="card-text mb-1"><strong>Nhà xuất bản:</strong> ${book.Publisher}</p>
                            <p class="card-text mb-1"><strong>Năm xuất bản:</strong> ${book.Year}</p>
                            <p class="card-text mb-1"><strong>Giá:</strong> <span class='text-danger fw-bold'>${book.Price.toLocaleString()} VND</span></p>
                            <p class="card-text mb-1"><strong>Tồn kho:</strong> ${book.Stock}</p>
                            <p class="card-text"><strong>Thể loại:</strong> ${categories}</p>
                            <div class="mt-3">
                                <a href="/books" class="btn btn-primary me-2">Quay lại danh sách</a>
                                ${book.Status === "true" ? `<a target="__blank" href="/${book.File}" class="btn btn-success">Xem nội dung sách</a>` : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        
        bookDetailContainer.innerHTML = bookHtml;
    }

    fetchBookDetail();
});
