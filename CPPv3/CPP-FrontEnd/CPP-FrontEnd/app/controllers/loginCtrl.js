angular.module('cpp.controllers').
    controller('LoginCtrl', ['UserName', 'authService', '$scope', '$rootScope', '$location', 'localStorageService', '$menuItems', '$state', '$window', '$uibModal', 'UserLicenseKey',
        function (UserName, authService, $scope, $rootScope, $location, localStorageService, $menuItems, $state, $window, $uibModal, UserLicenseKey) {

            console.log(localStorage.getItem('directUrlPath'));

            $rootScope.isLoginPage = true;
            $rootScope.isLightLoginPage = false;
            $rootScope.isLockscreenPage = false;
            $rootScope.isMainPage = false;
            $scope.modalShown = false;
            console.log($rootScope);
            // Reveal Login form
            setTimeout(function () { $(".fade-in-effect").addClass('in'); }, 1);
            $scope.loginData = {
                userName: "",
                password: ""
            };
            $scope.register = function () {
                console.log("Succesfully");
                $location.path('/signup');
            };
            $scope.recoverPassword = function () {
                console.log("recover password");
                $location.path('/password-recovery');
            }
            $scope.changePassword = function () {
                console.log("change password");
                $location.path('/change-password');
            }

            $scope.flag = false;

            function saveLicense(licresponse, licenseKeyTxt) {
                debugger;
                console.log(licresponse);
                var licensedata = {
                    "Operation": "1",
                    "userId": 68,
                    "licenseKey": licenseKeyTxt,
                    "productId": licresponse.productId,
                    "expirationDate": licresponse.expiredDate,
                    "licenseStatus": licresponse.validationStatus
                }

                console.log(licensedata);
                UserLicenseKey.persist().save(licensedata, function (responseData) {
                    console.log("success");
                    console.log(responseData);
                    /*dhtmlx.alert('Purchase Order :' + ' ' + response.result + '\n' + 'has been Approved.');*/

                    //  $location.path('/app/po-Approval/');
                });
            }

            $scope.verifyLicense = function (licenseKeyTxt, flag) {
                console.log("Verified");
                console.log(licenseKeyTxt);
                console.log(flag);
                //"ZILJL-YQI27-MB6YW-7S3KC-9E22T"

                $scope.licensedataForSave = {};

                //if (licenseKeyTxt == null)
                  //  licenseKeyTxt = "";
                var licenseData = {
                    userName : $scope.loginData.userName,
                    licenseKey : licenseKeyTxt
                };
                console.log("Licensedataa::");
                console.log(licenseData);
                authService.checklicense($scope.loginData.userName, licenseKeyTxt).then(function (response) {
                    console.log(". Checklicense verification returns successfully in login controller");
                    console.log(response);
                    var licresponse = response.data;
                    console.log(licresponse);
                    if (licresponse != null) {
                        if (licresponse.validationStatus == 'LICENSE_VALID') {
                            if (flag) {
                                $scope.loginData = $scope.param.loginData;

                                console.log(licresponse);
                                var licensedata = {
                                    "Operation": "1",
                                    "userName": $scope.loginData.userName,
                                    "licenseKey": licenseKeyTxt,
                                    "productId": licresponse.productId,
                                    "expirationDate": licresponse.expiredDate,
                                    "licenseStatus": licresponse.validationStatus
                                }

                                $scope.licensedataForSave = licensedata;

                                console.log(licensedata);

                                $scope.loginData = $scope.param.loginData;
                                $scope.$close('close');


                                // saveLicense(licresponse, licenseKeyTxt);


                            }
                            console.log("DIrect login Path");
                            console.log($scope.loginData);

                            authService.login($scope.loginData).then(function (response) {
                                // check for concurrency
                                // if success then execute following code to proceed
                                console.log("2. Check login from db");
                                console.log(response);
                                ///luan here - change password
                                console.log(response.data.passwordChangeRequired);
                                if (response.data.passwordChangeRequired == "True") {
                                    document.getElementById("loading").style.display = "none";
                                    $scope.changePassword();
                                    return;
                                }

                                authService.checklicenseconcurrency($scope.loginData.userName, licenseKeyTxt).then(function (concurrencyresponse) {

                                    console.log("3. Check Concurrency!!!");
                                    console.log(concurrencyresponse);
                                    var licconcurrencyresponse = concurrencyresponse.data;
                                    console.log(licconcurrencyresponse);


                                    if (licconcurrencyresponse != null) {
                                        if (licconcurrencyresponse.validationStatus == 'FLOATING_LICENSE_OVERUSED') {
                                            console.log("Error");
                                            console.log(licconcurrencyresponse);
                                            document.getElementById("loading").style.display = "none";
                                            // debugger;
                                            if (licconcurrencyresponse.validationMessage != undefined)
                                                dhtmlx.alert(licconcurrencyresponse.validationMessage);
                                            else
                                                dhtmlx.alert("Error connecting server!!");

                                        } else {

                                            console.log("4. on success proceed")
                                            UserName.addUser($scope.loginData.userName);
                                            console.log(UserName.getUser());
                                            $rootScope.user = $scope.loginData.userName;
                                            $scope.$emit('user', { userName: $scope.loginData.userName });
                                            localStorage.setItem("lckey", licenseKeyTxt);

                                            //luan here
                                            var directUrl = localStorageService.get("directUrlPath");
                                            console.log(directUrl);

                                            //$rootScope.$broadcast('USERNAME', { any: userName });
                                            var auth = localStorageService.get("authorizationData");
                                            console.log(auth);

                                            if (directUrl && directUrl.indexOf("cost-gantt") >= 0) {
                                                document.getElementById("loading").style.display = "none";
                                                var urlArray = directUrl.split("cost-gantt/")[1].split("/");
                                                window.location.hash = '#/app/cost-gantt/' + urlArray[0] + "/" + urlArray[1] + "/" + urlArray[2];
                                            }
                                            //debugger
                                            else if (directUrl && directUrl.indexOf("po-Approval") >= 0 && auth.role == "Accounting") {
                                                document.getElementById("loading").style.display = "none";
                                                var urlArray = directUrl.split("po-Approval/")[1].split("/");
                                                window.location.hash = '#/app/po-Approval/' + urlArray[0];
                                            }
                                            else {

                                                document.getElementById("loading").style.display = "none";
                                                window.location.hash = '#/app/wbs';
                                            }




                                            $location.path('/layout/user-info-navbar.html');
                                         

                                        }
                                    } else {
                                        dhtmlx.alert("Failed to connect server. Please try again later!!");
                                    }

                                    console.log("Flag truee==");
                                    console.log($scope.licensedataForSave);
                                    UserLicenseKey.persist().save($scope.licensedataForSave, function (responseData) {
                                        console.log("success");
                                        console.log(responseData);

                                    });
                                   
                                },
                                    function (err) {
                                        console.log("Error");
                                        console.log(concurrencyresponse);
                                        document.getElementById("loading").style.display = "none";
                                        if (licresponse.validationMessage != undefined)
                                            dhtmlx.alert(licresponse.validationMessage);
                                        else
                                            dhtmlx.alert("Error connecting server!!");
                                    });
                                //$state.reload();
                                //$window.location.reload();
                                //if(auth.userName === 'rmani'){
                                //
                                //    $scope.menuItems.splice(5,1);
                                //}
                            },
                                function (err) {
                                    console.log(err);
                                    document.getElementById("loading").style.display = "none";
                                    if (err && err.data)
                                        $scope.message = err.data.error_description;
                                });
                        } else {
                            console.log("Error");
                            console.log(licresponse);
                            document.getElementById("loading").style.display = "none";
                           // debugger;
                            if (licresponse.validationMessage != undefined)
                                dhtmlx.alert(licresponse.validationMessage);
                            else
                                dhtmlx.alert("Error connecting server!!");

                            // $scope.message = licresponse;
                        }
                    } else {
                        dhtmlx.alert("Failed to connect server. Please try again later!!");
                    }
                },
                    function (err) {
                        console.log("Checklicense returns error in login controller");
                        dhtmlx.alert("Error connecting server!!!");
                    });

                /*                if (flag) {
                                    debugger;
                                    console.log("Flag truee==");
                                    console.log($scope.licensedataForSave);
                                    UserLicenseKey.persist().save($scope.licensedataForSave, function (responseData) {
                                        console.log("success");
                                        console.log(responseData);
                                        *//*dhtmlx.alert('Purchase Order :' + ' ' + response.result + '\n' + 'has been Approved.');*//*

                //  $location.path('/app/po-Approval/');
            });
        }*/
                //$scope.$close('close');
            }

            $scope.closeModal = function () {
                $scope.$close('close');
            }

            $scope.message = "";
            var $sidebarMenuItems = $menuItems.instantiate();
            $scope.menuItems = $sidebarMenuItems.prepareSidebarMenu().getAll();
            console.log($scope.menuItems[5]);


            $scope.login = function () {
                document.getElementById("loading").style.display = "block";
                if ($scope.loginData.userName == "") {
                    dhtmlx.alert("Please enter username.");
                    document.getElementById("loading").style.display = "none";
                    return;
                }
                else if ($scope.loginData.password == "") {
                    dhtmlx.alert("Please enter password.");
                    document.getElementById("loading").style.display = "none";
                    return;
                }
                else {
                    if (premiseActivation) {
                        $scope.loginData = $scope.loginData;
                       
                        $scope.verifyLicense(null, false);
                    }
                    else {
                        UserLicenseKey.getLicenseForUser().get({ userName: $scope.loginData.userName }, function success(response) {
                            console.log("Checklicense for user returns successfully in login controller");
                            var licresponse = response.result;
                            console.log(licresponse);

                            if (licresponse.length > 0) {
                                debugger;
                                localStorage.setItem("lckey", licresponse[0].licenseKey);
                               // sessionStorage.setItem("username", $scope.loginData.userName);
                                sessionStorage.setItem("lckey", licresponse[0].licenseKey);
                                angular.forEach(licresponse, function (item, index) {
                                    console.log(item, index);
                                    if (item.licenseKey != null) {

                                        $scope.verifyLicense(item.licenseKey, false);

                                    }

                                });
                            }
                            else {
                                var scope = $rootScope.$new();
                                scope.param = {
                                    loginData: $scope.loginData
                                }
                                document.getElementById("loading").style.display = "none";
                                $rootScope.modalInstance = $uibModal.open({
                                    backdrop: 'static',
                                    keyboard: false,
                                    scope: scope,
                                    templateUrl: "app/views/licenseKeyModal.html",
                                    windowClass: "loginAlertModal",
                                    controller: "LoginCtrl"
                                });
                            }

                        },
                            function error(response) {

                            });
                    
                    /*if (true) {
                        console.log("testt==");
                        // $scope.modalShown = true;
                        // $scope.modalTitle = "License Key";
                        var scope = $rootScope.$new();
                        document.getElementById("loading").style.display = "none";
                        $rootScope.modalInstance = $uibModal.open({
                            backdrop: 'static',
                            keyboard: false,
                            scope: scope,
                            templateUrl: "app/views/licenseKeyModal.html",
                            windowClass: "loginAlertModal",
                            controller: "LoginCtrl"
                        });
                    }*/ /*else {
                        console.log("DIrect login Path");
                        console.log($scope.loginData);
                        debugger;
                        authService.login($scope.loginData).then(function (response) {

                            console.log(response);
                            ///luan here - change password
                            console.log(response.data.passwordChangeRequired);
                            if (response.data.passwordChangeRequired == "True") {
                                document.getElementById("loading").style.display = "none";
                                $scope.changePassword();
                                return;
                            }

                            UserName.addUser($scope.loginData.userName);
                            console.log(UserName.getUser());
                            $rootScope.user = $scope.loginData.userName;
                            $scope.$emit('user', { userName: $scope.loginData.userName });

                            debugger;
                            //luan here
                            var directUrl = localStorageService.get("directUrlPath");
                            console.log(directUrl);

                            //$rootScope.$broadcast('USERNAME', { any: userName });
                            var auth = localStorageService.get("authorizationData");
                            console.log(auth);

                            if (directUrl && directUrl.indexOf("cost-gantt") >= 0) {
                                document.getElementById("loading").style.display = "none";
                                var urlArray = directUrl.split("cost-gantt/")[1].split("/");
                                window.location.hash = '#/app/cost-gantt/' + urlArray[0] + "/" + urlArray[1] + "/" + urlArray[2];
                            }
                            //debugger
                            else if (directUrl && directUrl.indexOf("po-Approval") >= 0 && auth.role == "Accounting") {
                                document.getElementById("loading").style.display = "none";
                                var urlArray = directUrl.split("po-Approval/")[1].split("/");
                                window.location.hash = '#/app/po-Approval/' + urlArray[0];
                            }
                            else {

                                document.getElementById("loading").style.display = "none";
                                window.location.hash = '#/app/wbs';
                            }




                            $location.path('/layout/user-info-navbar.html');
                            //$state.reload();
                            //$window.location.reload();
                            //if(auth.userName === 'rmani'){
                            //
                            //    $scope.menuItems.splice(5,1);
                            //}
                        },
                            function (err) {
                                console.log(err);
                                document.getElementById("loading").style.display = "none";
                                if (err && err.data)
                                    $scope.message = err.data.error_description;
                            });
                    }*/
                }
                }
            };

            /* $scope.login = function () {
                 document.getElementById("loading").style.display = "block";
                 if ($scope.loginData.userName == "") {
                     dhtmlx.alert("Please enter username.");
                     document.getElementById("loading").style.display = "none";
                     return;
                 }
                 else if ($scope.loginData.password == "") {
                     dhtmlx.alert("Please enter password.");
                     document.getElementById("loading").style.display = "none";
                     return;
                 }
                 else {
                     debugger;
                     UserLicenseKey.getLicenseForUser().get({userId : 72}, function success(response) {
                         console.log("Checklicense for user returns successfully in login controller");
                         var licresponse = response.result;
                         console.log(licresponse);
 
                         if (licresponse != null) {
                             if (licresponse.licenseKey != null) {
                                 $scope.verifyLicense(licresponse.licenseKey)
                             }
                         } else {
                             var scope = $rootScope.$new();
                             document.getElementById("loading").style.display = "none";
                             $rootScope.modalInstance = $uibModal.open({
                                 backdrop: 'static',
                                 keyboard: false,
                                 scope: scope,
                                 templateUrl: "app/views/licenseKeyModal.html",
                                 windowClass: "loginAlertModal",
                                 controller: "LoginCtrl"
                             });
                         }
                         
                     },
                         function error(response) {
 
                         });
                     if (true) {
                         console.log("testt==");
                        // $scope.modalShown = true;
                        // $scope.modalTitle = "License Key";
                      var scope = $rootScope.$new();
                         document.getElementById("loading").style.display = "none";
                         $rootScope.modalInstance = $uibModal.open({
                             backdrop: 'static',
                             keyboard: false,
                             scope: scope,
                             templateUrl: "app/views/licenseKeyModal.html",
                             windowClass: "loginAlertModal",
                             controller: "LoginCtrl"
                         });
                     } else {
                     console.log("DIrect login Path");
                     console.log($scope.loginData);
                     debugger;
                     authService.login($scope.loginData).then(function (response) {
 
                         console.log(response);
                         ///luan here - change password
                         console.log(response.data.passwordChangeRequired);
                         if (response.data.passwordChangeRequired == "True") {
                             document.getElementById("loading").style.display = "none";
                             $scope.changePassword();
                             return;
                         }
 
                         UserName.addUser($scope.loginData.userName);
                         console.log(UserName.getUser());
                         $rootScope.user = $scope.loginData.userName;
                         $scope.$emit('user', { userName: $scope.loginData.userName });
 
 
                         //luan here
                         var directUrl = localStorageService.get("directUrlPath");
                         console.log(directUrl);
 
                         //$rootScope.$broadcast('USERNAME', { any: userName });
                         var auth = localStorageService.get("authorizationData");
                         console.log(auth);
 
                         if (directUrl && directUrl.indexOf("cost-gantt") >= 0) {
                             document.getElementById("loading").style.display = "none";
                             var urlArray = directUrl.split("cost-gantt/")[1].split("/");
                             window.location.hash = '#/app/cost-gantt/' + urlArray[0] + "/" + urlArray[1] + "/" + urlArray[2];
                         }
                         //debugger
                         else if (directUrl && directUrl.indexOf("po-Approval") >= 0 && auth.role == "Accounting") {
                             document.getElementById("loading").style.display = "none";
                             var urlArray = directUrl.split("po-Approval/")[1].split("/");
                             window.location.hash = '#/app/po-Approval/' + urlArray[0];
                         }
                         else {
 
                             document.getElementById("loading").style.display = "none";
                             window.location.hash = '#/app/wbs';
                         }
 
 
 
 
                         $location.path('/layout/user-info-navbar.html');
                         //$state.reload();
                         //$window.location.reload();
                         //if(auth.userName === 'rmani'){
                         //
                         //    $scope.menuItems.splice(5,1);
                         //}
                     },
                         function (err) {
                             console.log(err);
                             document.getElementById("loading").style.display = "none";
                             if (err && err.data)
                                 $scope.message = err.data.error_description;
                         });
                 }
             }
             };*/

            // Set Form focus
            $("form#login .form-group:has(.form-control):first .form-control").focus();
        }]);