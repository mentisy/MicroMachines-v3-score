$(document).ready(function() {

    App.setup();
});


var App = {

    setup: function() {

        this.monitorPhaseButtons();
        Game.checkExistingGame();
    },

    monitorPhaseButtons: function() {

        // Start button
        this.findRole('start-game').on('click', function() {

            Game.start();
        });
        // Round score selector
        this.findRole('round-score-selector').find('div.btn').on('click', function() {

            var player = $(this).parent().data('player');
            // Score has not been selected, so save round data for player
            if($(this).data('pressed') === false) {
                $(this).data('pressed', true).attr('data-pressed', true);
                var pos = $(this).data('roundpos');
                Game.saveRoundData(player, pos);
            // Regret score given to player, so remove score and open for selection
            } else {

                Game.regretRoundData(player);
                $(this).data('pressed', false).attr('data-pressed', false);
                $(this).parent().find('.btn').show();
            }
            // Count selected players, as to show save round button
            var countScores = App.findRole('round-score-selector').find('[data-pressed=true]').length;
            if(Game.countPlayers() === countScores) {

                App.findRole('save-round').show();
            }
            else {

                App.findRole('save-round').hide();
            }
        });
        // Save round button
        this.findRole('save-round').on('click', function() {

            Game.saveRound();
        });

        this.findRole('reset').on('click', function() {

            Game.reset();
        });

        this.findRole('save').on('click', function() {

            Game.declareWinner();
        });

        this.findRole('continue').on('click', function() {

            $(".winner").hide();
        })
    },

    findRole: function(role) {

        return $('[data-role="' + role + '"]');
    }
};

var Game = {

    defaultPlayers: 5,
    points: {
        1: 30,
        2: 20,
        3: 10,
        4: 0,
        5: 0
    },

    checkExistingGame: function() {
        var round = this.getRound();
        if(!isNaN(round) && round > 0) {

            this.start();
            App.findRole('reset').show();
            App.findRole('save').show();
        }
        var players = this.countPlayers();

        if(isNaN(players) || players === 0) {

            Cookies.write('Players.count', this.defaultPlayers);
        }
    },

    start: function() {

        // Hide Start button
        App.findRole('start-game').hide();
        // Setup Players. Add players to scoresheet table, check for players in storage, and set them into profiles
        this.setupPlayers();
    },

    setupPlayers: function() {

        //var players = this.findPlayers();
        this.setupTablePlayers([]);
        this.beginRound();
    },

    setupTablePlayers: function(players) {

        // Check if game has begun already (for instance refresh site).
        // Fetch data and insert into table
        var countPlayers = this.countPlayers();
        var countRounds = this.getRound();

        var r = 1, p = 0;

        var contents = "";

        while(r <= countRounds) {

            contents += "<tr><td class='pl-2 pl-md-3 pr-2 pr-md-3'>R<span class=\"d-none d-md-inline-block\">unde</span> " + r + "</td>";
            while(p < (countPlayers || 100)) {

                var roundScore = Cookies.read('Round'+r+'.Player'+p+'.score');
                contents += "<td>" + roundScore + "</td>";
                p++;
            }
            contents += "</tr>";
            p = 0;
            r++;
        }

        var tableTotal = App.findRole('scoresheet').show().find('[data-role="table-total"]');
        tableTotal.before(contents);
        p = 0;
        while(p < (countPlayers || 100)) {

            var total = parseInt(Cookies.read('Player'+p+'.score'));
            var col = p+2;
            tableTotal.children(':nth-child('+col+')').html(total);
            p++;
        }
    },

    beginRound: function() {

        App.findRole('round-score-selector').show();
    },

    saveRoundData: function(player, position) {

        // Hide other round positions for that player
        $('[data-role="round-score-selector"][data-player="'+player+'"]').find(':not([data-roundpos="'+position+'"])').hide();
        Cookies.write('roundUnsaved.Player' + player, position);
    },

    regretRoundData: function(player) {

        Cookies.delete('roundUnsaved.Player' + player);
    },

    saveRound: function() {

        var positions = this.getUnsavedRoundPositions();
        var scores = [];

        $.each(positions, function(index, playerPosition) {

            scores.push({player: playerPosition.player, score: Game.points[parseInt(playerPosition.position)]});
        });

        var round = this.getRound();
        if(isNaN(round)) {

            round = 0;
        }
        round++;
        Cookies.write('Round.count', round);
        this.appendScores(scores);

        App.findRole('table-total').children(':not(:first)').each(function(index, col) {

            var score = Cookies.read('Player' + index + '.score');
            $(col).text(score);
        });
        App.findRole('save').show();
        App.findRole('reset').show();
        this.resetRound();
    },

    resetRound: function() {

        App.findRole('save-round').hide();
        App.findRole('round-score-selector').find('div.btn').show().data('pressed', false).attr('data-pressed', false);
    },

    appendScores: function(scores) {

        var round = this.getRound();
        var contents = "<tr><td class=\"pl-2 pl-md-3 pr-2 pr-md-3\">R<span class=\"d-none d-md-inline-block\">unde</span> " + round + "</td>";
        $.each(scores, function(index, score) {

            // Get existing score
            var playerScore = parseInt(Cookies.read('Player' + score.player + '.score'));
            if(isNaN(playerScore)) {

                playerScore = 0;
            }
            Cookies.write('Round'+round+'.Player'+score.player+'.score', score.score);
            Cookies.write('Player' + score.player + '.score', playerScore + score.score);
            // Clear unsaved round data
            Cookies.write('roundUnsaved.Player' + score.player, 0);
            contents += "<td>"+score.score+"</td>";
        });

        contents += "</tr>";

        App.findRole('table-total').before(contents);
    },

    savePlayers: function(players) {

        $.each(players, function(index, player) {

            Cookies.write('Player'+index+'.name', player.value);
        });
        Cookies.write('Players.count', players.length);
    },

    findPlayers: function() {

        var countPlayers = this.countPlayers();
        var players = [];
        var i = 0;
        while(i < countPlayers) {

            players.push(Cookies.read('Player' + i + '.name'));
            i++;
        }
        return players;
    },

    getUnsavedRoundPositions: function() {

        var countPlayers = this.countPlayers();
        i = 0;
        var scores = [];
        while(i < countPlayers) {

            scores.push({player: i, position: Cookies.read('roundUnsaved.Player'+i)});
            i++;
        }
        return scores;
    },

    declareWinner: function() {

        var countPlayers = this.countPlayers();

        var i = -1,
            winningScore = 0,
            winner = 0;
        while(i++ < countPlayers-1) {

            var score = Cookies.read('Player'+i+'.score');
            if(score > winningScore) {

                winningScore = score;
                winner = i;
            }
        }
        winner = $("[data-role='profile'][data-player='"+winner+"']");
        var image = winner.find('img').attr('src');
        var name = winner.find('figcaption').text();

        winner = $(".winner");
        winner.find('h3[data-role="winner-name"]').text(name);
        winner.find('img[data-role="winner-image"]').attr('src', image);
        winner.show();
    },

    countPlayers: function() {

        return parseInt(Cookies.read('Players.count'));
    },

    getRound: function() {

        return parseInt(Cookies.read('Round.count'));
    },

    reset: function() {

        Cookies.clear();
        window.location.href="";
    }
};

var Cookies = {

    prefix: 'MM-',

    read: function(name) {

        return localStorage.getItem(this.prefix + name);
    },

    write: function(name, value) {

        localStorage.setItem(this.prefix + name, value);
    },

    delete: function(name) {

        localStorage.removeItem(this.prefix + name);
    },

    clear: function() {

        var keys = Object.keys(localStorage),
            i = keys.length;

        while(i--) {

            if(keys[i].indexOf(this.prefix) !== -1) {
                localStorage.removeItem(keys[i]);
            }
        }
    }
};