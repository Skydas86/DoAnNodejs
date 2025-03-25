const renderDashboard = (req, res) => {
    res.render('admin/index.ejs');
}

const renderDashboardBook = (req, res) => {
    res.render('admin/books.ejs');
}

const renderDashboardMember = (req, res) => {
    res.render('admin/members.ejs');
}

const renderAddBook = (req, res) => {
    res.render('admin/addBook.ejs');
}

const renderEditBook = (req, res) => {
    res.render('admin/editBook.ejs');
}

module.exports = { renderDashboard, renderDashboardBook, renderDashboardMember, renderAddBook, renderEditBook };