jQuery(document).ready(function($) {

    $('.gallery ').cycle({
        fx: 'fade',
        timeout: 1,
        random: 1,
        timeoutFn: calculateTimeout
    });

    function calculateTimeout(numRand) {
        var numRand = Math.floor(Math.random() * 5000) + 2000;
        return numRand;
    }


});