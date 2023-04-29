// Importing necessary modules and libraries
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

// Creating a functional component and exporting it as default

export default function App() {
  // Setting up initial state variables using useState hook

  const [bookTitle, setbookTitle] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [bookCoverImg, setBookCoverImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  // useEffect hook for handling user input search

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getBookByTitle(bookTitle);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [bookTitle]);

  const getBookByTitle = async (title) => {
    if (title.length <= 2) return false;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${title}`
      );
      const books = response.data.docs.slice(0, 20);
      setLoading(false);

      setAllBooks(books);
      const promises = books.map(({ cover_edition_key }) =>
        getBookCovers(cover_edition_key)
      );
      const responses = await Promise.all(promises);
      setBookCoverImg(responses);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getBookCovers = async (cover_edition_key) => {
    try {
      const response = await axios.get(
        `https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`
      );
      return response.config.url;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAuthorName = (author) => {
    return author.map((auth) => <li>{auth}</li>);
  };

  const getPublishDate = (dates) => {
    return dates.map((date) => <li>{date}</li>);
  };

  const getBookImg = (cover_edition_key) => {
    const imgLink = bookCoverImg.filter((link) =>
      link.includes(cover_edition_key)
    );
    return <img src={imgLink} alt="Book Cover" width="50%" />;
  };

  const handleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getBookTitle = () => {
    const sortedBooks = allBooks.slice().sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      if (titleA < titleB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (titleA > titleB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortedBooks.map(({ title, author_name, publish_date, cover_edition_key }) => {
        return (
          <div className="card">
            {bookCoverImg.length > 0 && getBookImg(cover_edition_key)}
            <div className="container">
              <h3><u id="bookTitle">{title.toUpperCase()}</u></h3>
              <p>
                <b>Author:</b>
                <ul>{author_name && getAuthorName(author_name)}</ul>
              </p>
              <p>
                <b>Publish Date:</b>
                <ul>{publish_date && getPublishDate(publish_date)}</ul>
              </p>
            </div>
          </div>
        );
      }
    );
  };
  return (
    <div className="App">
      <h1>Build a Book Search Tool</h1>
      <div className="mainDiv">
        <label>Enter Book Title </label>
        <input
          type="text"
          name="search"
          onChange={(e) => setbookTitle(e.target.value)}
        />
  
        <div>
          <label>Sort by: </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            >
            <option value="">Select...</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
  
        {loading && <div class="loader"></div>}
        
        <div className="bookShelf">{getBookTitle()}</div>
      </div>
    </div>
  );
  
}
