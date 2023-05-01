var rateBtn = document.getElementsByClassName("rateBtn");
var seenIt = document.getElementsByClassName("seenIt");

Array.from(rateBtn).forEach(function(element) {
      element.addEventListener('click', function(){
        const movieName = this.parentNode.parentNode.childNodes[1].innerText
        const yourRating = parseFloat(this.parentNode.parentNode.querySelector('.rate').value)
        console.log(yourRating);
        fetch('movies', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'movieName': movieName,
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
        const yourRating = parseFloat(this.parentNode.parentNode.querySelector('.rate').value)
        fetch('movies', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'yourRating':yourRating
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
