require(['jquery', 'underscore'], function ($, _) {
    $(document).ready(function () {
        $('#js-submit-btn').click(function () {
            var $images = $('#MultiFile1_list').find('.MultiFile-preview'),
                images = _.map($images, function (element) {
                    return $(element).attr('src');
                });
            $.post('/itemCreation', {test: 'test'}).done(function (data) {
                console.log('data returned is: ' + data);
            });
        });
    });
});
