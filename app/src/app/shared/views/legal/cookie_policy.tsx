import * as React from "react";

import CONFIG from "../../../../shared/config";

export function LegalsCookiePolicy () {

    return (
    <div>
        <h4>What are cookies?</h4>
        <p>
            Cookies are small files of letters and numbers that are downloaded
            onto your computer or mobile phone or other handheld device when
            you visit a website.&nbsp; Cookies allow a website to recognise
            a user's device and help your browser navigate through the website
            by allowing you to log in automatically or remembering settings you
            selected during earlier visits (among other
            functions).&nbsp; Cookies do not harm your computer/device.
        </p>
        <br />

        <h4>How we use cookies</h4>
        <p>
            We use cookies to understand how people use the {CONFIG.APP_NAME}
            website and to help us make your experience of our website
            better.&nbsp; Some of them are essential for the {CONFIG.APP_NAME}
            website to work properly.
        </p>
        <p>
            Generally our cookies perform the following functions:
        </p>
        <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-20">
                <h5>Essential cookies</h5>
                <p>
                    These cookies are used for technical purposes essential
                    to the effective operation of the {CONFIG.APP_NAME}
                    website, particularly in relation to online transactions
                    and securely logging you into and out of your account.
                </p>
            </div>
            <div className="col-md-2"/>
        </div>
        <br />

        <h4>How to manage cookies</h4>
        <p>
            To learn more about cookies and how to manage them, visit <a href="http://aboutcookies.org">
            AboutCookies.org</a>.
        </p>

    </div>);
}
