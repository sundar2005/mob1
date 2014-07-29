<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
        <title>GAP Scan</title>
        <link href="css/common.css" rel="stylesheet" type="text/css" />
        <script src="js/jquery-1.11.1.js"></script>
        <script src="js/common.js"></script>
        <script src="js/iscroll.js"></script>
    </head>
    <body onload="loaded();">
        <section id="header" class="header-wrapper bg-header">
            <label class="login-back back-btn text-color-green">Back</label>
        </section>
        <div id="wrapper" class="login-wrapper bg-content">
            <div id="scroller">
                
                <section class="content-wrapper login bg-content">
                    <div class="login-text text-color-green">Login to GAP Scan</div>
                    <div class="login-bar">
                        <div class="bg-input text-color-gray input-div"><input type="text" placeholder="Username" class="text-box username-field"/></div>
                        <div class="bg-input text-color-gray input-div"><input type="password" placeholder="Password" class="text-box password-field"/></div>
                        <div class="bg-green login-btn text-color-gray">Login</div>
                        <label class="text-color forgot-password">Forgot your Password?</label>
                    </div>
                    <div class="bg-error error-field text-error-color display-none"><img src="images/warningGray.png" alt="warning-logo" class="warning-img"/><label class="error-text"></label></div>
                </section>
            </div>
        </div>
        <div class="bg-overlay display-none"></div>
        <div class="loader display-none">
            <img src="images/loader.gif" height="28" alt="sort-img" class="loader-img"/>
            <div>Please Wait...</div>
    </body>
</html>