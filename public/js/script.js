const rand = document.querySelectorAll('.rand');

const btn = document.querySelector('.sub');
let select = document.querySelector('.postLoc');

let film = document.getElementById('.filme');
const locul = document.getElementById('.locul:not(.ocupat');

let removeLoc = false;
let RandLoc = 0;
let NrLoc = 0;


let NrRand = document.querySelectorAll('.NrRand');

NrRand.forEach(element => {
    element.innerHTML = 'Rand ' + element.getAttribute('value');
});

const updateValues = (NrLoc, RandLoc, removeLoc) => {
    // let locSelectat = document.querySelectorAll('.rand .locul.selectat');
    if (NrLoc && RandLoc !== undefined) {
        if (!removeLoc) {
            select.innerHTML += ` ${NrLoc}/${RandLoc} -`;
        } else {

            select.innerHTML = select.innerHTML.replace(` ${NrLoc}/${RandLoc} -`, "");
        }
    }
};


const loculReincarcat = document.querySelectorAll('.locul:not(.ocupat');
loculReincarcat.forEach(element => {

    element.innerHTML = element.getAttribute('value');
    element.addEventListener('click', () => {
        RandLoc = element.parentElement.getAttribute('value');
        NrLoc = element.getAttribute('value');

        if (element.classList.value == 'locul') {
            element.classList.add('selectat');
            removeLoc = false;
            updateValues(NrLoc, RandLoc, removeLoc);

        } else {
            element.classList.remove('selectat');
            removeLoc = true;
            updateValues(NrLoc, RandLoc, removeLoc);
        }
    });
});




btn.addEventListener('click', () => {
    let data = {};
    let movie = document.getElementById("film");
    data["movie"] = movie.value;
    data["locuri"] = {};
    for (let i = 1; i <= 5; i++) {
        data["locuri"][i.toString()] = [];
    }

    loculReincarcat.forEach(element => {

        if (element.classList.value == 'locul selectat') {
            element.classList.remove('selectat');
            element.classList.add('ocupat');
            select.innerHTML = "";

            data["locuri"][element.parentNode.getAttribute('value').toString()].push(element.getAttribute('value'));
        }

    });
    console.log(data);
    $.ajax({
        type: "POST",
        url: "/inregistrare-locuri",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json',
        success: function() {
            console.log("Trimitere cu succes");
        }
    });


});


$('#film').change(function(){
    // You can access the value of your select field using the .val() method
    console.log('Select field value has changed to ' + $(this).val());

    // You can perform an ajax request using the .ajax() method
    $.ajax({
        type: 'POST',
        url: '/cinema-movies',

        data: {movie_id: $(this).val()},
        dataType: 'json',
        success: function(data){
            console.log(data);
            loculReincarcat.forEach(element => {

                if (element.classList.value == 'locul ocupat') {
                    element.classList.remove('ocupat');
                }

            });
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    for (let i = 0; i < data[key].length; i++){
                        let element = $("#rand" + key + "_coloana" + data[key][i]);
                        element.addClass("ocupat");
                    }
                }
            }

        },
        error: function(){
            console.log("Nu s-a primit nimic");

            loculReincarcat.forEach(element => {

                if (element.classList.value == 'locul ocupat') {
                    element.classList.remove('ocupat');
                }

            });
        },
    });

});