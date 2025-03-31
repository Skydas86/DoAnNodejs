// BorrowRecordController.js
const BookService = require('../../services/BookService');
const BorrowRecordService = require("../../services/BorrowRecordService");
const { User } = require('../../models');

class BorrowRecordController {

    
    // getUserRole = (req) => {
    //     try {
    //         const authHeader = req.header('Authorization');
    //         console.log("Authorization Header:", authHeader);
    //         if (!authHeader) {
    //             console.log("Authorization header is missing!");
    //             return null;
    //         }
    
    //         const token = authHeader.replace('Bearer ', '');
    //         console.log("Token:", token);
    //         const decoded = verifyToken(token);
    //         console.log("Decoded Token:", decoded);
    //         const role = decoded.role;
    //         console.log("Role:", role);
    //         return role;
    //     } catch (error) {
    //         console.error("Error getting user role:", error);
    //         return null;
    //     }
    // };

    createBorrowRecord = async (req, res) => {
        console.log("Dữ liệu nhận từ request:", req.body);
        //const userRole = this.getUserRole(req);

        // if (userRole === 'Admin') {
        //     return res.status(403).json({ error: "Admin không được phép mượn sách." });
        // }

        const { userId, bookId } = req.body;
        const borrowDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 7);

        try {
            const book = await BookService.getBookById(bookId);
            if (!book) {
                return res.status(404).json({ error: "Sách không tồn tại." });
            }
            if (book.Stock <= 0) {
                return res.status(400).json({ error: "Sách đã hết, không thể mượn." });
            }
            const existingRecords = await BorrowRecordService.getBorrowRecords();
            const activeRecords = existingRecords.filter(record =>
                record.BookId == bookId &&
                record.UserId == userId &&
                (record.Status === 'pending' || record.Status === 'resolved')
            );

            if (activeRecords.length >= book.Stock) {
                return res.status(400).json({ error: "Vượt quá số lượng sách còn lại trong kho. Vui lòng thử lại sau" });
            }
            if (activeRecords.length > 0) {
                const record = activeRecords[0];

                if (record.Status === 'resolved' || record.Status === 'received') {
                    return res.status(400).json({ error: "Không thể gia hạn hoặc tạo mới vì sách đã được duyệt hoặc đã nhận." });
                }
                const newReturnDate = new Date();
                newReturnDate.setDate(newReturnDate.getDate() + 7);

                await BorrowRecordService.updateBorrowRecord(record.RecordId, bookId, userId, record.BorrowDate, newReturnDate, record.Status);
                return res.status(200).json({ message: "Đã gia hạn thêm thời gian mượn sách." });
            }

            const newBorrowRecord = await BorrowRecordService.addBorrowRecord(
                bookId,
                userId,
                borrowDate,
                returnDate
            );

            await BookService.updateBook(bookId, book.Title, book.Author, book.Publisher, book.Year, book.Status, book.Price, book.Stock - 1, [], null, null);

            return res.status(201).json(newBorrowRecord);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Lỗi server", details: error.message });
        }
    };

    deleteBorrowRecord = async (req, res) => {
        const { id } = req.params;

        try {
            const borrowRecord = await BorrowRecordService.getBorrowRecordById(id);
            if (!borrowRecord) {
                return res.status(404).json({ error: "Không tìm thấy bản ghi mượn" });
            }

            if (borrowRecord.Status === 'resolved' || borrowRecord.Status === 'received') {
                return res.status(400).json({ error: "Không thể xóa bản ghi mượn đã được duyệt hoặc đã nhận." });
            }
            await BorrowRecordService.deleteBorrowRecord(id);
            return res.status(200).json({ message: "Xóa thành công" });
        } catch (error) {
            console.error(error);
            return res.status(error.code || 500).json({ error: error.error });
        }
    };

    updateBorrowRecordStatus = async (req, res) => {
        const userRole = this.getUserRole(req);

        if (userRole !== 'admin') {
            return res.status(403).json({ error: "Chỉ admin mới có quyền duyệt trạng thái." });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (status !== 'resolved' && status !== 'received') {
            return res.status(400).json({ error: "Trạng thái không hợp lệ. Chỉ chấp nhận 'resolved' hoặc 'received'." });
        }

        try {
            const borrowRecord = await BorrowRecordService.getBorrowRecordById(id);
            if (!borrowRecord) {
                return res.status(404).json({ error: "Không tìm thấy bản ghi mượn" });
            }
            if (borrowRecord.Status === 'received') {
                return res.status(400).json({ error: "Không thể thay đổi trạng thái khi sách đã được nhận." });
            }

            const updatedRecord = await BorrowRecordService.updateBorrowRecord(id, borrowRecord.BookId, borrowRecord.UserId, borrowRecord.BorrowDate, borrowRecord.ReturnDate, status);
            res.status(200).json(updatedRecord);
        } catch (error) {
            console.error(error);
            res.status(error.code || 500).json({ error: error.error, details: error.details });
        }
    };

    getBorrowRecordById = async (req, res) => {
        const { id } = req.params;
        try {
            const borrowRecord = await BorrowRecordService.getBorrowRecordById(id);
            if (!borrowRecord) {
                return res.status(404).json({ error: "Không tìm thấy bản ghi mượn" });
            }
            return res.status(200).json(borrowRecord);
        } catch (error) {
            console.error(error);
            return res.status(error.code || 500).json({ error: error.error });
        }
    };

    getAllBorrowRecords = async (req, res) => {
        try {
            const borrowRecords = await BorrowRecordService.getBorrowRecords();
            return res.status(200).json(borrowRecords);
        } catch (error) {
            console.error(error);
            return res.status(error.code || 500).json({ error: error.error });
        }
    };
}

module.exports = new BorrowRecordController();