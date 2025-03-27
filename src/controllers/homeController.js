const ABC =(req, res)=>{
    res.send('OKAY')
}

const renderBooksPage = (req, res) => {
    res.render('books.ejs');
}

const renderDetailBook =  (req, res) => {
    res.render('bookDetail.ejs');
}

module.exports ={ ABC, renderBooksPage, renderDetailBook }