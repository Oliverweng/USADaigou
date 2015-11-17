require(['jquery', 'underscore', 'multiFile'], function ($, _) {
    $(document).ready(function () {
        $('#addNewForm').on('valid.fndtn.abide', function(e) {
            // Handle the submission of the form
            e.preventDefault();
            var $images = $('#MultiFile1_list').find('.MultiFile-preview'),
                images = _.map($images, function (element) {
                    return $(element).attr('src').replace(/^data:image\/png;base64,/, '');
                }),
                itemName = $('#itemName').val(),
                itemDes = $('#itemDescription').val(),
                itemAlias = $('#itemAlias').val(),
                itemCategory = $('#itemCategory').val(),
                itemPrice = $('#itemPrice').val(),
                $messageContainer = $('.js-message');
            if (images && images.length > 0 && images.length <= 5) {
                var data = {
                    itemCategory: itemCategory, 
                    itemName: itemName, 
                    itemDes: itemDes, 
                    itemAlias: itemAlias,
                    itemPrice: itemPrice,
                    itemImages: images
                };
                $.ajax({
                    url: '/itemCreation',
                    method: 'POST',
                    data: data,
                    dataType: 'json'
                }).done(function (data) {
                    if (data.success) {
                        $messageContainer.prepend(data.message).removeClass('hidden alert success').addClass('success');
                    } else {
                        $messageContainer.prepend(data.message).removeClass('hidden alert success').addClass('alert');
                    }
                });
            } else {
                $messageContainer.prepend('At least 1 image is needed and no more than 5 images.').removeClass('hidden alert success').addClass('alert');
            }
        });
    });
});
