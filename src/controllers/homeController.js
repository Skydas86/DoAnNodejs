const renderBooksPage = (req, res) => {
    res.render('books.ejs');
}

const renderBookDetail = (req, res) => {
    res.render('bookDetail.ejs');
}

const renderBookRecord = (req, res) => {
    res.render('borrowrecords.ejs');
}

const renderFullTextSearch = (req, res) => {
    res.render('fullTextSearch.ejs');
}

module.exports ={ renderBooksPage, renderBookDetail, renderBookRecord, renderFullTextSearch }
