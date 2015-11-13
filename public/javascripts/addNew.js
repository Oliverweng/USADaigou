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
                itemPrice = $('#itemPrice').val();
            if (images && itemName && itemDes && itemAlias && itemCategory && itemPrice) {
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
                });
            }
        });
    });
});
