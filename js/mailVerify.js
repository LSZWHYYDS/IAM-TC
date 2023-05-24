require.config({
    paths: {
        jquery: '../js/lib/jquery.min',
        underscore: '../js/lib/underscore',
        text: '../js/lib/text-2.0.0',
        bootstrap: '../js/lib/bootstrap/bootstrap'
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});
require(['jquery'],
    function ($) {
        mailVerify.sendVerifyReq();
    }
);

var mailVerify = {
    sendVerifyReq: function () {
        var username = $("#username").val();
        var tokenValue = $("#token").val();
        $.ajax({
            type: "GET",
            contentType :"application/json",
            url: "/api/self/verify_email_address/" + tokenValue,
            success: function (data) {
                console.log(data);
                $("#hint").text(data.message);
            },
            error: function(XMLHttpRequest) {
                $("#hint").text(XMLHttpRequest.responseJSON.message);
            }
        });
    }
};
