var rateBtns = document.getElementsByClassName("rateBtn");
var seenIt = document.getElementsByClassName("seenIt");

Array.from(rateBtns).forEach(function(btn) {
      btn.addEventListener('click', function(){
        const movieid = btn.dataset.movieid
        console.log("this is the movie name", movieid)
        console.log('btn',btn.dataset.movieid)
        const yourRating = parseFloat(document.getElementById(movieid).value)
        console.log(yourRating);
        fetch('movies', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'movieid': movieid,
            'yourRating': yourRating
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(seenIt).forEach(function(element) {
  element.addEventListener('click', function(){
    // const movieName = this.dataset.movieName;
    // const description = this.dataset.description;
    // const yourRating = this.dataset.yourRating;
    // const year = this.dataset.year;
    const movieid = btn.dataset.movieid
    fetch('movies', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'movieid': movieid,
        
      })
    }).then(function (response) {
      window.location.reload();
    });
  });
});

