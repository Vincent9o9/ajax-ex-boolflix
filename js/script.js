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


$(document).ready(function() {

    $('#btg-search').click(function() {

        var ricercaFilm = $('#inp').val();
        $('.list-film').empty();

        $.ajax(
        {
            url:'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data:{
                api_key: '50aabbde5596b4f1a538a2fbc3fe6ee9',
                language:'it-IT',
                query: ricercaFilm
            },
            success: function(risposta){
                for(var i = 0; i < risposta.results.length; i++) {

                    var source = $("#film-template").html();

                    var template = Handlebars.compile(source);

                    var context = {
                        title: risposta.results[i].title,
                        original_title: risposta.results[i].original_title,
                        original_language: risposta.results[i].original_language,
                        vote_average: risposta.results[i].vote_average
                    };

                    var html = template(context);
                    $('.list-film').append(html);
                };
            },
            error: function(){
                alert('errore');
            }
        }
        )
    });
});
