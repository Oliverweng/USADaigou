require(['jquery', 'underscore'], function ($, _) {
    $(document).ready(function () {
        $.fn.displayMessage = function(isSuccess, message) {
            this.prepend(message).removeClass('hidden alert success');
            if (isSuccess) {
                this.addClass('success');
            } else {
                this.addClass('alert');
            }
            return this;
        };
        $('#addNewForm').on('valid.fndtn.abide', function(e) {
            // Handle the submission of the form
            e.preventDefault();
            var $currentForm = $(e.currentTarget)
                // $images = $('#MultiFile1_list').find('.MultiFile-preview'),
                //     images = _.map($images, function (element) {
                //         return $(element).attr('src').replace(/^data:image\/png;base64,/, '');
                //     });
                // itemName = $('#itemName').val(),
                // itemDes = $('#itemDescription').val(),
                // itemAlias = $('#itemAlias').val(),
                // itemCategory = $('#itemCategory').val(),
                // itemPrice = $('#itemPrice').val(),
                // $messageContainer = $('.js-message');
            //if (images && images.length > 0 && images.length <= 5) {
                // var data = {
                //     itemCategory: itemCategory, 
                //     itemName: itemName, 
                //     itemDes: itemDes, 
                //     itemAlias: itemAlias,
                //     itemPrice: itemPrice,
                //     itemImages: images
                // };
                // $.ajax({
                //     url: '/itemCreation',
                //     method: 'POST',
                //     data: $currentForm.serialize(),
                //     dataType: 'json'
                // }).done(function (data) {
                //     if (data.success) {
                //         $messageContainer.displayMessage(true, data.message);
                //     } else {
                //         $messageContainer.displayMessage(false, data.message);
                //     }
                // });
            // } else {
            //     $messageContainer.displayMessage(false, 'At least 1 image is needed and no more than 5 images.');
            // }
        });
    });
});
