const APILINK = 'http://localhost:8000/api/v1/reviews/';
//Here, instead of using themoviedb api, we're using the api that we made for the backend

const url = new URL(location.href);   //URL object to extract parameters
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const main = document.getElementById('section');
const title = document.getElementById('title');

title.innerText = movieTitle;
//innerText and innerHTML have similar use except it's better to use innerText so you don't mess up the HTML of the page

const div_new = document.createElement('div');
div_new.innerHTML = `
    <div class='row'>
        <div class='column'>
            <div class='card'>
                <p><strong>Review: </strong>
                    <input type='text' id='new_review' value=''>
                </p>
                <p><strong>User: </strong>
                    <input type='text' id='new_user' value=''>
                </p>
                <p><a href='#' onclick='saveReview("new_review", "new_user")'>Save</a></p>
            </div>
        </div>
    </div>`;
main.appendChild(div_new);
//Because we're not using any variables in the div_new innerHTML, it means that it was okay for us to write that HTML in the movie.html file also
//But for simplicity and ease of understanding, we wrote it out here

returnReviews(APILINK);

function returnReviews(url) {
    fetch(url + 'movie/' + movieId)
    .then(res => res.json())
    .then(function(data) {
        console.log(data);
        data.forEach(review => {
            const div_card = document.createElement('div');

            div_card.innerHTML = `
            <div class='row'>
                <div class='column'>
                    <div class='card' id='${review._id}'>
                        <p><strong>Review: </strong>${review.review}</p>
                        <p><strong>User: </strong>${review.user}</p>
                        <p><a href='#' onclick='editReview("${review._id}", "${review.review}", "${review.user}")'>✏️</a></p>
                        <p><a href='#' onclick='deleteReview("${review._id}")'>🗑️</a></p>
                    </div>
                </div>
            </div>`;

            main.appendChild(div_card);
        });
    });
}

function editReview(id, review, user) {
    const element = document.getElementById(id);
    //id that we passed to edit function which is, in reality, the id of the div card
    const reviewInputId = 'review' + id;
    const userInputId = 'user' + id;
    //We make these ids so that there is a unique name for every html element on the page, to send it over to the backend

    element.innerHTML = `
    <p><strong>Review: </strong>
        <input type='text' id='${reviewInputId}' value='${review}'>
    </p>
    <p><strong>User: </strong>
        <input type='text' id='${userInputId}' value='${user}'>
    </p>
    <p>
        <a href='#' onclick='saveReview("${reviewInputId}", "${userInputId}", "${id}")'>Save</a>
    </p>`;
}

//Sending data over to backend to save
function saveReview(reviewInputId, userInputId, id='') {
    //id='' in params of this fn gives a default value to id (empty string) if no value is specified on function call
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    //if id is not an empty string => if editReview called the save Review function
    if (id) {
        //fetch() is a js method that allows us to send an http request to a url and get response back
        //By default it makes use of the GET method, though you can explicitly specify what method you intend to use as shown below
        fetch(APILINK + id, {
            method: 'PUT', //Update review api route
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'user': user, 'review': review}) //js command to get a string from an object
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload(); //js method to reload the url because we now want to see the new review also
        });
    } else {
        fetch(APILINK + 'new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'user': user, 'review': review, 'movieId': movieId})
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload();
        });
    } 
}

function deleteReview(id) {
    fetch(APILINK + id, {
        method: 'DELETE'
    }).then(res => res.json())
    .then(res => {
        console.log(res);
        location.reload();
    });
}
    