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
        $("#submit").click(function () {
            resetPwd.sendResetReq();
        });
    }
);

var resetPwd = {
    sendResetReq: function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var tokenValue = $("#token").val();

        var loginInfo = {"username":username,"new_password":password, "reset_password_token": tokenValue};
        $.ajax({
            type: "POST",
            contentType :"application/json",
            url: "/api/self/reset_password",
            dataType: "json",
            data: JSON.stringify(loginInfo),
            success: function (data) {
                console.log(data);
                $("#hint").text(data.message);
            },
            error: function(XMLHttpRequest) {
                $("#hint").text(XMLHttpRequest.responseJSON.message);
            }
        });
    }
}
