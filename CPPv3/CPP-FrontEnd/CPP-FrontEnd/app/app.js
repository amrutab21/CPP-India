'use strict';

//var serviceBasePath = 'http://localhost:1832/';
//var serviceBasePath = 'http://192.168.0.19:1832/';
var serviceBasePath = 'http://localhost:29980/api/';
//var license4jPath = 'http://cpp.birdi-inc.io:8091/license4j-1.0/'; //test server
var license4jPath = 'http://localhost:8080/'; //local
var premiseActivation = false;
var isBrowserClosed = false;
//var serviceBasePath = 'http://localhost/CPP_API/';
//var serviceBasePath = 'http://dev.birdi-inc.com/CPP_API/';
//var serviceBasePath = 'http://birdi-dev02/CPP_API/';

var tabCount = parseInt(localStorage.getItem("tabCount"));
tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;
if (tabCount <= 0)
    tabCount = 1;
localStorage.setItem('tabCount', tabCount.toString());

/*ENABLE THIS IN PROD*/
//console.log = function () { };
//console.debug = function () { };
var app = angular.module('xenon-app', [
    'LocalStorageModule',
    'ngCookies',
    'ngResource',

    'ui.router',
    'ui.bootstrap',

    'oc.lazyLoad',

    'xenon.controllers',
    'xenon.Gantt_Controller',
    'xenon.ViewProgramElementGanttController',   //Manasi 06-01-2020
    'xenon.ViewContractGanttController',   //Manasi 11-01-2020
    'xenon.baseline_controller',
    'xenon.future_project_controller',
    'xenon.directives',
    'xenon.factory',
    'xenon.services',
    'xenon.filters',
    // Added in v1.3
    'FBAngular',
    'angularSpinner',
    // Added by Rohit Mani
    'smart-table',
    'angularMoment',
    'ngGrid',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.cellNav',
    'ui.grid.moveColumns',
    'ngIdle',
    'ui.select',
    'ngSanitize',
    'cpp.controllers',
    'cpp.services',
    'ngFileUpload',
    'angularjs-dropdown-multiselect'

]);

var isBrowserClosed = false;

app.run(function ($rootScope, localStorageService, authService) {
    // Page Loading Overlay
    public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');



    jQuery(window).load(function () {
        public_vars.$pageLoadingOverlay.addClass('loaded');
    });



    


    window.addEventListener("beforeunload", function (event) {

        console.log("Unload on sign out tab/browser closed===");
        console.log(event.returnValue);

        var auth = localStorageService.get("authorizationData");
        var userName = "";
        if (auth != null) {
            userName = auth.userName;
        }
        var getlic_key = localStorage.getItem("lckey").toString();
        debugger;
        var pageReloaded = window.performance
            .getEntriesByType('navigation')
            .map((nav) => nav.type)
            .includes('reload');
        if (pageReloaded)
            //return;
            dhtmlx.alert(pageReloaded);
        if (!pageReloaded) { // The pageReloaded boolean we set earlier

            var localStorageTime = parseInt(localStorage.getItem('storageTime'));
            //to be used to detect browser close
            if (localStorageTime === null || isNaN(localStorageTime) || localStorageTime == "undefined"
                || (localStorageTime - new Date().getTime()) > 1000) {
                console.log(new Date().getTime());
                localStorage.setItem("storageTime", new Date().getTime());
            }
            //end

            //dhtmlx.alert(pageReloaded);
            var tbCount = parseInt(localStorage.getItem('tabCount'));
            --tbCount;
            localStorage.setItem('tabCount', tbCount.toString());

            //for browser close
            var localStorageTime1 = parseInt(localStorage.getItem('storageTime'));
            var currentTime = new Date().getTime();
            var timeDifference = currentTime - localStorageTime1;
            // updating condition
            debugger;
            if (tbCount == 0) {
                localStorage.removeItem('tabCount');
                navigator.sendBeacon(license4jPath + 'releaselicense/' + userName + '/' + getlic_key);

                authService.logOut();
            }

      /*      if (tbCount == 0 || timeDifference < 8000000) {
                dhtmlx.alert("Time diff==>");
                navigator.sendBeacon(license4jPath + 'releaselicense/' + userName + '/' + getlic_key);
                
                authService.logOut();
                //$location.path('/login');
                //isBrowserClosed = false;
            }*/

          

        }
        /*if (event.returnValue === '') {
          
            console.log("Close on sign out tab/browser closed===");
            dhtmlx.alert("Close on sign out tab/browser closed===");  
            isBrowserClosed = true;

        }*/


    });
   /* document.addEventListener('visibilitychange', function logData() {
        debugger;
        console.log("Signed out tab/browser closed===");
        console.log(localStorageService);
        console.log(localStorageService);
        var auth = localStorageService.get("authorizationData");
        var userName = "";
        if (auth != null) {
            userName = auth.userName;
        }
        var getlic_key = localStorage.getItem("lckey").toString();
        console.log(getlic_key);

        if (document.visibilityState === 'hidden' && isBrowserClosed) {

            navigator.sendBeacon(license4jPath + 'releaselicense/' + userName + '/' + getlic_key);
            authService.logOut();
            $location.path('/login');
            isBrowserClosed = false;

        }
    });*/


});

app.config(function (IdleProvider, KeepaliveProvider, $httpProvider, $locationProvider) {
    // configure Idle settings
    //IdleProvider.idle(72000); // in seconds
    //IdleProvider.timeout(30); // in seconds
    IdleProvider.idle(120);
    IdleProvider.timeout(60);
    KeepaliveProvider.interval(1); // in seconds

    //IdleProvider.idle(5); // in seconds
    //IdleProvider.timeout(5); // in seconds
    //KeepaliveProvider.interval(1); // in seconds
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = { 'Content-Type': 'application/json' };
    //$httpProvider.defaults.cache = true; //Enable cache to minimize the # of request to backend
    //$httpProvider.defaults.headers.patch = {};

    //disable IE ajax request caching

    $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    // disable IE ajax request caching
    // $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json'
    }

    $httpProvider.interceptors.push('httpInterceptor');
    $locationProvider.html5Mode(false);
    //Location Provider
    $locationProvider.hashPrefix('');
});

app.factory('httpInterceptor', function ($q, $rootScope, $log, $timeout, usSpinnerService, $window, $location, localStorageService) {

    var numLoadings = 0;

    return {
        request: function (config) {
            //console.log('request');
            // alert();
            //  console.log(config);

            var auth = localStorageService.get("authorizationData");
            //TODO -- Enale for authentication
            //         if (!auth) {

            //         	$location.path('/login');
            //}
            //  console.log(auth);
            if (auth && !config.ignore)
                config.headers = {
                    "Authorization": "Token " + auth.token,
                    "Content-Type": "application/json"
                }

            if (!config.ignore) {
                numLoadings++;
                angular.element(document.querySelector('#my-spinner')).addClass('fademe');
                usSpinnerService.spin('spinner-1');
            }

            return config || $q.when(config)

        },
        response: function (response) {

            //console.log('response');
            numLoadings--;
            if (numLoadings <= 0) {
                angular.element(document.querySelector('#my-spinner')).removeClass('fademe');
                usSpinnerService.stop('spinner-1');
            }

            return response || $q.when(response);

        },
        responseError: function (response) {
            //console.log('error');
            numLoadings--;
            if (numLoadings <= 0) {
                angular.element(document.querySelector('#my-spinner')).removeClass('fademe');
                usSpinnerService.stop('spinner-1');
            }

            return $q.reject(response);
        }
    };
});
app.run(function ($location, authService, $rootScope, Idle, $timeout, Session, localStorageService) {

    Idle.watch();
    $rootScope.$on('IdleStart', function () {
        var path = $location.path();
        console.log(path);
        if (path == "/password-recovery" || path == "/signup" || path == "/login") {

        }
        else {
            if ($(".dhtmlx_modal_box").is(":visible") == false) {
                //var sec = 30;
                var sec = 60;
                dhtmlx.confirm({
                    title: "Session Timeout Warning",
                    type: "confirm-warning",
                    width: "650px",
                    ok: "Yes",
                    cancel: "No",
                    text: "<span>Your session is about to expire! You will be logged out in <span id='time' ng-model ='ct'>60</span> seconds.Do you want to stay signed in?</span>",
                    callback: function (response) {
                        console.log(response);
                        if (response == false) {
                            console.log("Signed out auto===");
                           // $scope.logout();
                            var getlic_key = localStorage.getItem("lckey").toString();
                            var auth = localStorageService.get("authorizationData");
                            var userName = auth.userName;
                            console.log(getlic_key);
                            navigator.sendBeacon(license4jPath + 'releaselicense/' + userName + '/' + getlic_key);
                       /*     authService.releaselicense(userName, getlic_key).then(function (responseData) {
                                console.log("success");
                                console.log(responseData);
                                // localStorage.removeItem("lckey");

                            },
                                function (error) {
                                    console.log(error);
                                }*/
                            //);
                            authService.logOut();
                            $location.path('/login');

                        } else {
                            //Request something to stay logged in
                            Session.extend().get({}, function (response) {
                                console.log(response);
                            });
                        }
                        Idle.watch();

                    }
                });

                setTimeOut(60);


            }

        }


        function setTimeOut(i) {
            $timeout(function () {
                console.log("before : " + i);
                if (i == 0) {
                    //setTimeOut(i);
                    $(".dhtmlx_yes_button").click();
                    $(".dhtmlx_modal_box").css("visibility", "hidden");
                    $('div.gantt_modal_box.dhtmlx_modal_box.gantt-confirm.dhtmlx-confirm').remove();
                    console.log("Signed out after timeout===");
                    //$scope.logout();
                    var getlic_key = localStorage.getItem("lckey").toString();
                    var auth = localStorageService.get("authorizationData");
                    var userName = auth.userName;
                    console.log(getlic_key);
                    authService.releaselicense(userName, getlic_key).then(function (responseData) {
                        console.log("success");
                        console.log(responseData);
                        // localStorage.removeItem("lckey");

                    },
                        function (error) {
                            console.log(error);
                        }
                    );
                    authService.logOut();
                    $location.path('/login');
                    $(".dhx_modal_cover").css("display", "none");
                    Idle.watch();
                }
                var time = $("#time");
                console.log(time.val());
                time.text(i);
                i--;
                console.log("After i : " + i);
                if (i != -1) {
                    if ($(".dhtmlx_modal_box").is(":visible") == true)
                        setTimeOut(i);
                }

            }, 1000);

        }
        /* Display modal warning or sth */
    });
    $rootScope.$on('IdleTimeout', function () {
        //$scope.logOut();
        Idle.watch();
        /* Logout user */
    });

});


//app.run(function($rootScope) {
//	var lastDigestRun = new Date();
//	$rootScope.$watch(function detectIdle() {
//		var now = new Date();
//		if (now - lastDigestRun > 10*60) {
//			// logout here, like delete cookie, navigate to login ...
//			alert();
//		}
//		//lastDigestRun = now;
//	});
//});

//spinner Conifguartion
app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    //usSpinnerConfigProvider.setTheme('black', { color:'black',length:0, radius:42,width:15, lines:13 });
    //usSpinnerConfigProvider.setTheme('white',  { color:'white',length:0, radius:42,width:15, lines : 13 });
}]);

//define a new module to reuse later
angular.module('cpp.controllers', []);

//define a new module to reuse later
angular.module('cpp.services', []);


app.constant('ASSETS', {
    'core': {
        'bootstrap': appHelper.assetPath('js/bootstrap.min.js'), // Some plugins which do not support angular needs this

        'jQueryUI': [
            appHelper.assetPath('js/jquery-ui/jquery-ui.min.js'),
            appHelper.assetPath('js/jquery-ui/jquery-ui.structure.min.css'),
        ],

        'moment': appHelper.assetPath('js/moment.min.js'),

        'googleMapsLoader': appHelper.assetPath('js/google-maps-loader/load-google-maps.js')
    },

    'charts': {

        'dxGlobalize': appHelper.assetPath('js/devexpress-web-14.1/js/globalize.min.js'),
        'dxCharts': appHelper.assetPath('js/devexpress-web-14.1/js/dx.chartjs.js'),
        'dxVMWorld': appHelper.assetPath('js/devexpress-web-14.1/js/vectormap-data/world.js'),
    },

    'xenonLib': {
        notes: appHelper.assetPath('js/xenon-notes.js'),
    },

    'maps': {

        'vectorMaps': [
            appHelper.assetPath('js/jvectormap/jquery-jvectormap-1.2.2.min.js'),
            appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-world-mill-en.js'),
            appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-it-mill-en.js'),
        ],
    },

    'icons': {
        'meteocons': appHelper.assetPath('css/fonts/meteocons/css/meteocons.css'),
        'elusive': appHelper.assetPath('css/fonts/elusive/css/elusive.css'),
    },

    'tables': {
        'rwd': appHelper.assetPath('js/rwd-table/js/rwd-table.min.js'),

        'datatables': [
            appHelper.assetPath('js/datatables/dataTables.bootstrap.css'),
            appHelper.assetPath('js/datatables/datatables-angular.js'),
        ],

    },

    'forms': {

        'select2': [
            appHelper.assetPath('js/select2/select2.css'),
            appHelper.assetPath('js/select2/select2-bootstrap.css'),

            appHelper.assetPath('js/select2/select2.min.js'),
        ],

        'daterangepicker': [
            appHelper.assetPath('js/daterangepicker/daterangepicker-bs3.css'),
            appHelper.assetPath('js/daterangepicker/daterangepicker.js'),
        ],

        'colorpicker': appHelper.assetPath('js/colorpicker/bootstrap-colorpicker.min.js'),

        'selectboxit': appHelper.assetPath('js/selectboxit/jquery.selectBoxIt.js'),

        'tagsinput': appHelper.assetPath('js/tagsinput/bootstrap-tagsinput.min.js'),

        'datepicker': appHelper.assetPath('js/datepicker/bootstrap-datepicker.js'),

        'timepicker': appHelper.assetPath('js/timepicker/bootstrap-timepicker.min.js'),

        'inputmask': appHelper.assetPath('js/inputmask/jquery.inputmask.bundle.js'),

        'formWizard': appHelper.assetPath('js/formwizard/jquery.bootstrap.wizard.min.js'),

        'jQueryValidate': appHelper.assetPath('js/jquery-validate/jquery.validate.min.js'),

        'dropzone': [
            appHelper.assetPath('js/dropzone/css/dropzone.css'),
            appHelper.assetPath('js/dropzone/dropzone.min.js'),
        ],

        'typeahead': [
            appHelper.assetPath('js/typeahead.bundle.js'),
            appHelper.assetPath('js/handlebars.min.js'),
        ],

        'multiSelect': [
            appHelper.assetPath('js/multiselect/css/multi-select.css'),
            appHelper.assetPath('js/multiselect/js/jquery.multi-select.js'),
        ],

        'icheck': [
            appHelper.assetPath('js/icheck/skins/all.css'),
            appHelper.assetPath('js/icheck/icheck.min.js'),
        ],

        'bootstrapWysihtml5': [
            appHelper.assetPath('js/wysihtml5/src/bootstrap-wysihtml5.css'),
            appHelper.assetPath('js/wysihtml5/wysihtml5-angular.js')
        ],
    },

    'uikit': {
        'base': [
            appHelper.assetPath('js/uikit/uikit.css'),
            appHelper.assetPath('js/uikit/css/addons/uikit.almost-flat.addons.min.css'),
            appHelper.assetPath('js/uikit/js/uikit.min.js'),
        ],

        'codemirror': [
            appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.js'),
            appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.css'),
        ],

        'marked': appHelper.assetPath('js/uikit/vendor/marked.js'),
        'htmleditor': appHelper.assetPath('js/uikit/js/addons/htmleditor.min.js'),
        'nestable': appHelper.assetPath('js/uikit/js/addons/nestable.min.js'),
    },

    'extra': {
        'tocify': appHelper.assetPath('js/tocify/jquery.tocify.min.js'),

        'toastr': appHelper.assetPath('js/toastr/toastr.min.js'),

        'fullCalendar': [
            appHelper.assetPath('js/fullcalendar/fullcalendar.min.css'),
            appHelper.assetPath('js/fullcalendar/fullcalendar.min.js'),
        ],

        'cropper': [
            appHelper.assetPath('js/cropper/cropper.min.js'),
            appHelper.assetPath('js/cropper/cropper.min.css'),
        ]
    },

    'wbs': {
        'dndTree': appHelper.assetPath('js/wbs-tree/dndTree.js'),
        'dagre': appHelper.assetPath('js/wbs-tree/dagre-d3.js'),
        'trendGraph': appHelper.assetPath('js/wbs-tree/trendGraph.js'),
        'mxn': appHelper.assetPath('js/gis/lib/mxn/mxn.js'),
        'mxnCore': appHelper.assetPath('js/gis/lib/mxn/mxn.core.js'),
        'mxnGoogleCore': appHelper.assetPath('js/gis/lib/mxn/mxn.googlev3.core.js'),
        'timeline': appHelper.assetPath('js/gis/lib/timeline-1.2.js'),
        'timemap': appHelper.assetPath('js/gis/src/timemap.js'),
        'jsonLoader': appHelper.assetPath('js/gis/src/loaders/json.js'),
        'data': appHelper.assetPath('js/wbs-tree/data.json'),
        'css': appHelper.assetPath('js/wbs-tree/wbs.css'),
        'example': appHelper.assetPath('js/wbs-tree/examples.css')
    },
    'projectgis': {
        'customcolorpicker': appHelper.assetPath('js/project-gis/customcolorpicker.css'),
        'customColorPicker': appHelper.assetPath('js/project-gis/customColorPicker.js'),
        'project_gis': appHelper.assetPath('js/project-gis/project-gis.css')
    },
    'timemap': {
        'mxn': appHelper.assetPath('js/timemap/lib/mxn/mxn.js'),
        'mxnCore': appHelper.assetPath('js/timemap/lib/mxn/mxn.core.js'),
        'mxnGoogleCore': appHelper.assetPath('js/timemap/lib/mxn/mxn.googlev3.core.js'),
        'timeline': appHelper.assetPath('js/timemap/lib/timeline-1.2.js'),
        'timemap': appHelper.assetPath('js/timemap/src/timemap.js'),
        'jsonLoader': appHelper.assetPath('js/timemap/src/loaders/json.js'),
        'example': appHelper.assetPath('js/timemap/examples.css')
    },
    'gantt': {
        'js': appHelper.assetPath('js/dhtmlxGantt/codebase/dhtmlxgantt.js'),
        'gant_export': appHelper.assetPath('js/dhtmlxGantt/gantt_export.js'),
        'css': appHelper.assetPath('js/dhtmlxGantt/codebase/dhtmlxgantt.css')
        //'skin': appHelper.assetPath('js/dhtmlxGantt/codebase/skins/dhtmlxgantt_meadow.css')
    },

    'chartjs': {
        'lib': appHelper.assetPath('js/chartjs/Chart.js'),
        'doughnut': appHelper.assetPath('js/chartjs/src/Chart.Doughnut.js'),
        'pie': appHelper.assetPath('js/chartjs/src/Chart.Pie.js'),
        'bar': appHelper.assetPath('js/chartjs/src/Chart.Bar.js'),
    },

    'spinner': {
        'js': appHelper.assetPath('js/spinner/spin.js')
    },

    'angular-spinner': {
        'js': appHelper.assetPath(('js/spinner/angular-spinner.js'))
    },

    'gantt_export': {
        'js': appHelper.assetPath('js/dhtmlxGantt/gantt_export.js')
    },

    'jspdf': {
        'js': appHelper.assetPath('js/jsPDF-1.2.60/dist/jspdf.debug.js'),
        'png': appHelper.assetPath('js/jsPDF-1.2.60/libs/png_support/png.js'),
        'z': appHelper.assetPath('js/jsPDF-1.2.60/libs/png_support/zlib.js'),
        'filesaver': appHelper.assetPath('js/jsPDF-1.2.60/libs/FileSaver/fileSaver.js')
    }
});