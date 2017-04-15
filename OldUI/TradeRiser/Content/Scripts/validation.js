var validation = {
   reset: function ($control) {
    }
};

(function ($) {
   // validator.defaults.alerts = false;
    $.fn.validate = function () {
        //e.preventDefault();
        validator.checkAll($(this));
        return false;
       };
})(jQuery);

