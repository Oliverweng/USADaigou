// TO DO Needs require.$(document).ready(function () {    var $headerCategory = $('.js-header-category');    $headerCategory.click(function (e) {        $headerCategory.removeClass('active');        $(e.currentTarget).addClass('active');    });    $(document).foundation();});