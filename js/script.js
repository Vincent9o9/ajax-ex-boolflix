$(document).ready(function() {

    $("#btn-click").click(function() {

        var search = $("#input").val();
        reset();
        var url1 = 'https://api.themoviedb.org/3/search/movie';
        var url2 = 'https://api.themoviedb.org/3/search/tv';

        chiamata(search, url1, "Film");
        chiamata(search, url2, "SerieTV");

    });

    $("#input").keyup(function() {
        if (event.which == 13 || event.keyCode == 13) {
            var search = $("#input").val();
            reset();
            var url1 = 'https://api.themoviedb.org/3/search/movie';
            var url2 = 'https://api.themoviedb.org/3/search/tv';

            chiamata(search, url1, "Film");
            chiamata(search, url2, "SerieTV");
        }
    });
});

// ** FUNZIONI **
function reset() {
    $(".results-film .list").empty();
    $(".results-serietv .list").empty();
    $('.no-risultati').empty();
    $("#input").val("");
};

function chiamata(data, url, type) {
    $.ajax(
        {
            url: url,
            method: "GET",
            data: {
                api_key: "96df83a2ec59d64214d9e5a29ad76f29",
                query: data,
                language: "it-IT"
            },
            success: function(risposta) {
                if (risposta.total_results > 0) {
                    printResult(risposta.results, type);
                } else {
                    noResults(type);
                }
            },
            error: function() {
                alert("Errore");
            }
        }
    );
};

function printResult(data, type) {
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < data.length; i++) {
        if (type == "Film") {
            var title = data[i].title;
            var original_title = data[i].original_title;
        } else if (type == "SerieTV") {
            var title = data[i].name;
            var original_title = data[i].original_name;
        }
        var context = {
            img: insertPoster(data[i].poster_path),
            tipo: type,
            title: title,
            original_title: original_title,
            original_language: flag(data[i].original_language),
            vote_average: stars(data[i].vote_average)
        };
        var html = template(context);
        if (type == "Film") {
            $(".results-film .list").append(html);
        } else if (type == "SerieTV") {
            $(".results-serietv .list").append(html);
        }
    };
};

function insertPoster (img) {
    if (img == null) {
    var urlCompleta = "https://www.wildhareboca.com/wp-content/uploads/sites/310/2018/03/image-not-available.jpg";
    } else {
    var urlBase = "https://image.tmdb.org/t/p/w300";
    var urlCompleta = urlBase + img;
    }
    return urlCompleta;
};

function flag(lingua) {
    var language = ["en", "it"];
    if (language.includes(lingua)) {
        return '<img src="img/'+lingua+'.png">';
    }
    return lingua;
};

function stars(vote) {
    var resto = vote % 2;
    vote = Math.floor(vote / 2);
    var star = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= vote) {
            star += '<i class="fas fa-star"></i>';
        } else if (resto != 0) {
            star += '<i class="fas fa-star-half-alt"></i>';
            resto = 0;
        } else {
            star += '<i class="far fa-star"></i>';
        }
    };
    return star;
};

function noResult(type) {
    var source = $("#no-result-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResult: "non ci sono risultati" + type
    };
    var html = template(context);
    if (type == "Film") {
        $(".results-film .list").append(html);
    } else if (type == "SerieTV") {
        $(".results-serietv .list").append(html);
    }
};
