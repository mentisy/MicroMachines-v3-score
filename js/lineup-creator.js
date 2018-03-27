/**
 * Created by alexa on 22.12.2017.
 */
$(document).ready(function() {

    App.setup();
});

var App = {

    starter: undefined,
    substitutes: undefined,
    reserve: undefined,

    // Set up sortable lists
    setup: function() {

        this.starter = $("ul.lineup-starter");
        this.substitutes = $("ul.lineup-substitutes");
        this.reserve = $("ul.lineup-reserve");

        this.starter.sortable({

            handle: '.live-lineup-handle',
            connectWith: [App.substitutes, App.reserve],
            remove: function (event, ui) {

                App.countLists();
            }
        });
        this.substitutes.sortable({

            handle: '.live-lineup-handle',
            connectWith: [App.starter, App.reserve],
            remove: function (event, ui) {

                App.countLists();
            }
        });
        this.reserve.sortable({

            handle: '.live-lineup-handle',
            connectWith: [App.starter, App.substitutes],
            remove: function (event, ui) {

                App.countLists();
            }
        });
    },

    // Count sortable lists by category. Returns count.
    countLists: function() {

        var countStarter = App.starter.find('li').length,
            countSubstitutes = App.substitutes.find('li').length;

        App.starter.prev().find('.live-lineup-counter').find('span').text(countStarter);
        App.substitutes.prev().find('.live-lineup-counter').find('span').text(countSubstitutes);

        return {starters: countStarter, substitutes: countSubstitutes};
    },


    // Save lineup using sortable lists
    save: function() {

        // Get count of players in each of list (starter, substitutes)
        var count = this.countLists();

        // Check for errors (too many, too few players etc.)
        var errors = [];
        if(count.starters < 11)
            errors.push('Less than 11 starters.');
        if(count.starters > 11)
            errors.push('More than 11 starters.');
        if(count.substitutes > 7)
            errors.push('More than 7 substitutes');
        var startersJson,
            substitutesJson,
            reservesJson;

        // show error message, containing the relevant errors
        if(errors.length !== 0) {

            var errorMsg = "";
            jQuery.each(errors, function(index, error) {

                errorMsg += error;

                if(index < errors.length)
                    errorMsg += "\n";
            });
            alert(errorMsg);
            return false;
        }

        // Create json table with starters
        startersJson = jQuery(App.starter.find('li')).map(function() {

            return { playerid: ($(this).data('playerid')), playername: $(this).data('playername') };
        }).get();

        // Create json table with substitutes
        substitutesJson = jQuery(App.substitutes.find('li')).map(function() {

            return ($(this).data('playerid'));
        }).get();

        // Create json table with reserves
        reservesJson = jQuery(App.reserve.find('li')).map(function() {

            return {playerid: ($(this).data('playerid')), cause: $(this).find('input').val() };
        }).get();

        // Send lineup in ajax request, to be stored in database.
        $.ajax({
            type: 'post',
            data: { starters: startersJson,  substitutes: substitutesJson, reserves: reservesJson },
            url: '/ymze/lineup/create.php'
        }).done(function (data) {

            data = JSON.parse(data);

            $(".response").html(data['response']);
        });
    }
};