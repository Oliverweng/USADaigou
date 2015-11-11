require(['jquery', 'underscore'], function ($, _) {
    $(document).ready(function () {
        $('#js-submit-btn').click(function (e) {
            e.preventDefault();
            var $images = $('#MultiFile1_list').find('.MultiFile-preview'),
                images = _.map($images, function (element) {
                    return $(element).attr('src');
                }),
                itemName = $('#itemName').val(),
                itemDes = $('#itemDescription').val(),
                itemAlias = $('#itemAlias').val(),
                itemCategory = $('#itemCategory').val();
            if (images && itemName && itemDes) {
                $.post('/itemCreation', {itemCategory: itemCategory, itemName: itemName, itemDes: itemDes, itemAlias: itemAlias, itemImages: images.toString()}).done(function (data) {
                    console.log('data returned is: ' + data);
                });
            }
        });
    });
});
