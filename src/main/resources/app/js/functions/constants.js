/**
 * Created by Srikanth on 11/1/2015.
 */
(function () {
    'use strict';
    angular.module('myApp.constants', [])

        .constant("NAV", {
            //"HOME": "home",
            "SCOPE": "home.scope",
            "NEW_EMP": {
                "PAGE": "home",
                "ID": "home.id",
                "PROFILE": "home.profile"
            },
            "LIST_EMP": {
                PAGE: "home.list_emp",
                SEARCH: {
                    PAGE: "home.list_emp.search",
                    CRITERIA: "criteria@home.list_emp.search",
                    RESULTS: "results@home.list_emp.search",
                    FOOTER: "footer@home.list_emp.search"
                },
                UPDATE: "home.list_emp.update"
            },
            "PROMISES": "home.promises"
        })
})();
