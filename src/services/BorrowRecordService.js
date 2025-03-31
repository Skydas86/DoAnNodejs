const { BorrowRecord, Book, User } = require('../models');

class BorrowRecordService {

    getBorrowRecords = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const borrowRecords = await BorrowRecord.findAll({
                    include: [
                        {
                            model: Book,
                        },
                        {
                            model: User,
                        }
                    ]
                });
                return resolve(borrowRecords);
            } catch (error) {
                console.log(error)
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };

    getBorrowRecordById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const borrowRecord = await BorrowRecord.findOne({
                    where: { RecordId: id },
                    include: [
                        {
                            model: Book,
                        },
                         {
                            model: User,
                        }
                    ]
                });

                if (!borrowRecord) {
                    return reject({ code: 404, error: "Không tìm thấy bản ghi mượn" });
                }

                return resolve(borrowRecord);
            } catch (error) {
                console.log(error);
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };

    addBorrowRecord = (bookId, userId, borrowDate, returnDate) => {
        return new Promise(async (resolve, reject) => {
            if (!bookId) {
                return reject({ code: 400, error: "BookId không được để trống" });
            }
            if (!userId) {
                return reject({ code: 400, error: "UserId không được để trống" });
            }
            if (!borrowDate) {
                return reject({ code: 400, error: "Ngày mượn không được để trống" });
            }
            if (!returnDate) {
                return reject({ code: 400, error: "Ngày trả không được để trống" });
            }

            try {
                const book = await Book.findByPk(bookId);
                if (!book) {
                    return reject({ code: 404, error: "Không tìm thấy sách với ID này" });
                }

                const user = await User.findByPk(userId);
                if (!user) {
                    return reject({ code: 404, error: "Không tìm thấy người dùng với ID này" });
                }

                const borrowRecord = await BorrowRecord.create({
                    BookId: bookId,
                    UserId: userId,
                    BorrowDate: borrowDate,
                    ReturnDate: returnDate,
                });
                return resolve(borrowRecord);

            } catch (error) {
                console.log(error);
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };

    updateBorrowRecord = (recordId, bookId, userId, borrowDate, returnDate, status) => {
        return new Promise(async (resolve, reject) => {
            try {
                const borrowRecord = await BorrowRecord.findByPk(recordId);

                if (!borrowRecord) {
                    return reject({ code: 404, error: "Không tìm thấy bản ghi mượn" });
                }

                 // Validation
                 if (!bookId) {
                    return reject({ code: 400, error: "BookId không được để trống" });
                }
                if (!userId) {
                    return reject({ code: 400, error: "UserId không được để trống" });
                }
                if (!borrowDate) {
                    return reject({ code: 400, error: "Ngày mượn không được để trống" });
                }
                if (!returnDate) {
                    return reject({ code: 400, error: "Ngày trả không được để trống" });
                }
                if (!status) {
                    return reject({ code: 400, error: "Trạng thái không được để trống" });
                }
                const book = await Book.findByPk(bookId);
                if (!book) {
                    return reject({ code: 404, error: "Không tìm thấy sách với ID này" });
                }
                const user = await User.findByPk(userId);
                if (!user) {
                    return reject({ code: 404, error: "Không tìm thấy người dùng với ID này" });
                }

                const updatedBorrowRecord = await borrowRecord.update({
                    BookId: bookId,
                    UserId: userId,
                    BorrowDate: borrowDate,
                    ReturnDate: returnDate,
                    Status: status,
                });

                return resolve(updatedBorrowRecord);
            } catch (error) {
                console.log(error);
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    };

    deleteBorrowRecord = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const borrowRecord = await BorrowRecord.findByPk(id);
                if (!borrowRecord) {
                    return reject({ code: 404, error: "Không tìm thấy bản ghi mượn" });
                }
                await borrowRecord.destroy();

                return resolve({ message: "Xóa thành công" });
            } catch (error) {
                console.log(error);
                return reject({ code: 500, error: "Lỗi server:", details: error.message });
            }
        });
    };
}

module.exports = new BorrowRecordService();