// Milestone 1:
// Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono
// ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori
// per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5,
// così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva,
// non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera
// della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione
// ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv.
// Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query,
// sia le serie tv, stando attenti ad avere alla fine dei valori simili
// (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)

// "page": 1,
//     "total_results": 247,
//     "total_pages": 13,
//     "results": [
//         {
//             "original_name": "Friends",
//             "genre_ids": [
//                 35,
//                 18
//             ],
//             "name": "Friends",
//             "popularity": 137.282,
//             "origin_country": [
//                 "US"
//             ],
//             "vote_count": 2973,
//             "first_air_date": "1994-09-22",
//             "backdrop_path": "/l0qVZIpXtIo7km9u5Yqh0nKPOr5.jpg",
//             "original_language": "en",
//             "id": 1668,
//             "vote_average": 8.2,
//             "overview": "Friends è una sitcom americana trasmessa in USA dal 1994 al 2004. La serie descrive un gruppo di amici (da cui il titolo) del circondario di Manhattan a New York, i loro rapporti e le loro interazioni reciproche.  E' stata una delle serie più seguite del decennio, la puntata finale è stata vista da più di 52 milioni di persone nei soli Stati Uniti, facendone il quarto finale più visto di tutti i tempi e il primo dell'ultimo decennio.",
//             "poster_path": "/f496cm9enuEsZkSPzCwnTESEK5s.jpg"
//         },



$(document).ready(function() {
    $('#btg-search').click(function() {
        var ricercaFilm = $('#inp').val();
        reset ();
        searchFilm(ricercaFilm);
        searchTv(ricercaFilm);
    });

    $("#inp").keyup(function() {
        if (event.which == 13 || event.keyCode == 13) {
            var ricercaFilm = $("#inp").val();
            reset();
            searchFilm(ricercaFilm);
            searchTv(ricercaFilm);
        }
    });
});


//*** FUNZIONI ***

function reset() {
    $('.list-film').empty();
    $('#inp').val('');
};

function searchFilm(data) {
    $.ajax(
    {
        url:'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data:{
            api_key: '50aabbde5596b4f1a538a2fbc3fe6ee9',
            language:'it-IT',
            query: data
        },
        success: function(risposta){
            if (risposta.total_results > 0) {
                    printFilm(risposta.results);
                } else {
                    noResults();
                }
        },
        error: function(){
            alert('errore');
        }
    }
    )
};

function printFilm(data) {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    for(var i = 0; i < data.length; i++) {

        var context = {
            title: data[i].title,
            original_title: data[i].original_title,
            original_language: flag(data[i].original_language),
            vote_average: stella(data[i].vote_average)
        };

        var html = template(context);
        $('.list-film').append(html);
    };
};

function searchTv(data) {
    $.ajax(
    {
        url:'https://api.themoviedb.org/3/search/tv',
        method: 'GET',
        data:{
            api_key: '50aabbde5596b4f1a538a2fbc3fe6ee9',
            language:'it-IT',
            query: data
        },
        success: function(risposta){
            if (risposta.total_results > 0) {
                    printTv(risposta.results);
                } else {
                    noResults();
                }
        },
        error: function(){
            alert('errore');
        }
    }
    )
};

function printTv(data) {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    for(var i = 0; i < data.length; i++) {

        var context = {
            title: data[i].name,
            original_title: data[i].original_name,
            original_language: flag(data[i].original_language),
            vote_average: stella(data[i].vote_average)
        };

        var html = template(context);
        $('.list-film').append(html);
    };
};



function noResult() {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResult: "non ci sono risultati"
    };
    var html = template(context);
    $(".lista-film").append(html);
};

function flag(stringa) {
    var flag = "";
    if (stringa == "it") {
        flag = "<img src='img/it.png' width='30px'>";
    } else if (stringa == "en") {
        flag = "<img src='img/en.png' width='30px'>";
    }
    return flag;
};

function stella(numero) {
    var divisione = numero / 2;
    var arrotondamento = Math.ceil(divisione);
    var star = '';
    for (var i = 1; i <= 5; i++) {
        if(i <= arrotondamento) {
            star += '<i class="fa fa-star"></i>'
        }else {
            star += '<i class="fa fa-star-o"></i>'
        }
    };
    return star;
};
