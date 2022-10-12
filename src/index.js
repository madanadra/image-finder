import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import axios from 'axios';
import Masonry from 'react-masonry-css';

function App() {
  const [img, setImg] = useState([])
  const [page, setPage] = useState(1)
  const [end, setEnd] = useState(false)
  const [err, setErr] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    refresh();
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setImg([]);
    setErr(false);
    setEnd(false);
    if (search) {
      axios.get(`https://api.unsplash.com/search/photos/?client_id=I4n7kcrPocLgN5Nuc5-qzEaroUNG9RgfMJdPsTQJXhc&query=${search}&page=1&per_page=20`)
      .then((response) => {
        setImg(response.data.results);
        setPage(1);
        if (response.data.total <= 20) {
          setEnd(true);
        } else { setEnd(false); }
        console.log(response.data.results);
      })
      .catch((error) => {
        setErr(true);
        console.log(error);
      });
    } else {
      axios.get('https://api.unsplash.com/photos/random/?client_id=I4n7kcrPocLgN5Nuc5-qzEaroUNG9RgfMJdPsTQJXhc&count=20')
      .then((response) => {
        setImg(response.data);
        setEnd(false);
        console.log(response.data);
      })
      .catch((error) => {
        setErr(true);
        console.log(error);
      });
    }
  }

  const more = () => {
    setErr(false);
    setEnd(false);
    if (search) {
      axios.get(`https://api.unsplash.com/search/photos/?client_id=I4n7kcrPocLgN5Nuc5-qzEaroUNG9RgfMJdPsTQJXhc&query=${search}&page=${page+1}&per_page=20`)
      .then((response) => {
        setImg([...img, ...response.data.results]);
        setPage(page+1);
        if (response.data.results === 0) {
          setEnd(true);
        } else { setEnd(false); }
        console.log(response.data.results);
      })
      .catch((error) => {
        setErr(true);
        console.log(error);
      });
    } else {
      axios.get('https://api.unsplash.com/photos/random/?client_id=I4n7kcrPocLgN5Nuc5-qzEaroUNG9RgfMJdPsTQJXhc&count=20')
      .then((response) => {
        setImg([...img, ...response.data]);
        setEnd(false);
        console.log(response.data);
      })
      .catch((error) => {
        setErr(true);
        console.log(error);
      });
    }
  }

  window.onscroll = () => {
    if (!end && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      more();
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.text.value); 
  }

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2
  };

  return (<>
    <form className='topbar' onSubmit={(e) => handleSearch(e)}>
      <input type="text" name='text' placeholder='Search' autoComplete="off" />
      <button type="submit"><span className="material-symbols-outlined">search</span></button>
    </form>
    {
      img.length === 0 ? [] :
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="list"
        columnClassName="column"
      >
        {
          img.map((item) => 
          <div className='image'>
            <a href={item.urls.full} key={item.id} target="_blank" rel='noreferrer'>
              <img src={item.urls.thumb} alt='img' />
            </a>
          </div>
        )}
      </Masonry>
    }
    {
      err ? <span className='end'>Something went wrong</span> : 
      end ? <span className='end'>No other results</span> : 
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    }
  </>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
