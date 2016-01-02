require(['jquery', 'underscore'], function ($, _) {
    $('.js-thumbnail-image').hover(function(e) {
        var $currentTarget = $(e.currentTarget),
            src = $currentTarget.attr('src');
        $('#js-display-image').attr('src', src);
    });
    $('.js-plus-btn').click(function (e) {
        var $input = $('.js-quantity-input'),
            val = $input.val();
        if (val) {
            $input.val(parseInt(val, 10) + 1);
        } else {
            $input.val('1');
        }
    });
    $('.js-minus-btn').click(function (e) {
        var $input = $('.js-quantity-input'),
            val = $input.val();
        if (val && val > 1) {
            $input.val(parseInt(val, 10) - 1);
        } else {
            $input.val('1');
        }
    });
});
