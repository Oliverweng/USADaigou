require(['jquery', 'underscore'], function ($, _) {
    $(document).ready(function () {
        $('#js-submit-btn').click(function (e) {
            e.preventDefault();
            var $images = $('#MultiFile1_list').find('.MultiFile-preview'),
                images = _.map($images, function (element) {
                    return $(element).attr('src');
                }),
                itemName = $('#itemName').val(),
                itemDes = $('#itemDescription').val();
            if (images && itemName && itemDes) {
                $.post('/itemCreation', {itemName: itemName, itemDescription: itemDes, itemImages: images.toString()}).done(function (data) {
                    console.log('data returned is: ' + data);
                });
            }
        });
    });
});
