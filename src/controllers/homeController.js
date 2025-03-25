const ABC =(req, res)=>{
    res.send('OKAY')
}

const renderBooksPage = (req, res) => {
    res.render('books.ejs');
}

module.exports ={ ABC, renderBooksPage }