const { Book, Category } = require('../models');
const path = require('path');
const fs = require('fs');

class BookService {

    getBooks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const books = await Book.findAll({
                    include: [
                        {
                            model: Category,
                            through: { attributes: [] },
                        }
                    ]
                });
                return resolve(books);
            } catch (error) {
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };

    getBookById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const book = await Book.findOne({
                    where: { BookId: id }, 
                    include: [
                        {
                            model: Category,
                            through: { attributes: [] },
                        }
                    ]
                });
    
                if (!book) {
                    return reject({ code: 404, error: "Không tìm thấy sách" });
                }
    
                return resolve(book);
            } catch (error) {
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };    

    addBook = (title, author, publisher, year, status, price, stock, categoryIds, imageName, fileName) => {
        return new Promise(async (resolve, reject) => {
            if (title.trim().length == 0) {
                return reject({ code: 400, error: "Tiêu đề không được để trống" });
            }
            if (author.trim().length == 0) {
                return reject({ code: 400, error: "Tác giả không được để trống" });
            }
            if (publisher.trim().length == 0) {
                return reject({ code: 400, error: "NSX không được để trống" });
            }
            if (year <= 0 || year > new Date().getFullYear()) {
                return reject({ code: 400, error: "Năm SX không hợp lệ" });
            }
            if (price < 0) {
                return reject({ code: 400, error: "Giá thuê không thể bé hơn 0" });
            }
            if (stock < 0) {
                return reject({ code: 400, error: "Hàng tồn không thể bé hơn 0" });
            }

            const book = await Book.create({
                Title: title,
                Author: author,
                Publisher: publisher,
                Year: year,
                Status: status,
                Price: price,
                Stock: stock,
                File: 'api/book/file/' + fileName,
                Image: 'api/book/image/' + imageName
            });
            if (categoryIds && categoryIds.length > 0) {
                const categories = await Category.findAll({
                    where: { CategoryId: categoryIds }
                });
                await book.addCategories(categories);
            }
            return resolve(book);
        })
    }

    updateBook = (bookId, title, author, publisher, year, status, price, stock, categoryIds, imageName, fileName) => {
        return new Promise(async (resolve, reject) => {
            try {
                const book = await Book.findByPk(bookId);
                if (!book) {
                    return reject({ code: 404, error: "Không tìm thấy sách" });
                }

                if (title.trim().length === 0) {
                    return reject({ code: 400, error: "Tiêu đề không được để trống" });
                }
                if (author.trim().length === 0) {
                    return reject({ code: 400, error: "Tác giả không được để trống" });
                }
                if (publisher.trim().length === 0) {
                    return reject({ code: 400, error: "NSX không được để trống" });
                }
                if (year <= 0 || year > new Date().getFullYear()) {
                    return reject({ code: 400, error: "Năm SX không hợp lệ" });
                }
                if (price < 0) {
                    return reject({ code: 400, error: "Giá thuê không thể bé hơn 0" });
                }
                if (stock < 0) {
                    return reject({ code: 400, error: "Hàng tồn không thể bé hơn 0" });
                }

                const updatedBook = await book.update({
                    Title: title,
                    Author: author,
                    Publisher: publisher,
                    Year: year,
                    Status: status,
                    Price: price,
                    Stock: stock,
                    File: fileName != null ? 'api/book/file/' + fileName : book.File,
                    Image: imageName != null ? 'api/book/image/' + imageName : book.Image
                });

                if (categoryIds && categoryIds.length > 0) {
                    const categories = await Category.findAll({
                        where: { CategoryId: categoryIds }
                    });
                    await book.setCategories(categories);
                }

                return resolve(updatedBook);
            } catch (error) {
                console.log(error)
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };
    
    deleteBook = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const book = await Book.findByPk(id);
                if (!book) {
                    return reject({ code: 404, error: "Không tìm thấy sách" });
                }
    
                if (book.Image) {
                    const imagePath = path.join(__dirname, "../public/uploads/", book.Image.split('/').pop());
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
    
                if (book.File) {
                    const filePath = path.join(__dirname, "../public/uploads/", book.File.split('/').pop());
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
    
                await book.destroy();
    
                return resolve({ message: "Xóa thành công" });
            } catch (error) {
                console.log(error);
                return reject({ code: 500, error: "Lỗi server:", details: error.message });
            }
        });
    };

}

module.exports = new BookService();