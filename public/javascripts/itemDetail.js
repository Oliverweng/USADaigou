require(['jquery', 'underscore'], function ($, _) {
    $('.js-thumbnail-image').hover(function(e) {
        var $currentTarget = $(e.currentTarget),
            src = $currentTarget.attr('src');
        $('#js-display-image').attr('src', src);
    });
});
