var app = angular.module('app', []);
app.controller("requestInformationController", ["$scope", "$rootScope", "$state", "$window", "inputRequest",
    function($scope, $rootScope, $state, $window, inputRequest) {


        this.regionList = ["Global", "Regional"];
        this.productDevelopment = ["SMP", "NPD", "Platform"];
        this.directImportList = ["Yes", "No"];
        this.RCRRequest = inputRequest.getRequest()[0];
        this.gloabalRegionsList = ["ASPAC", "EMEA", "LATAM", "NA"];

        this.checkLength = function(el) {
            if (el.value.length != 6) {
                alert("length must be exactly 6 characters");
            }
        };
    }
]);


app.directive("requestinformationSection", ["$templateCache",
    function($templateCache) {
        return {
            scope: false,
            templateUrl: "/cg510_rcr_createrequest/Core/html/requestInformation.xhtml"
        };
    }
]);

app.directive('maxlen', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $uiSelect = angular.element(element[0].querySelector('.ui-select-search'));
            console.log("$uiSelect = ", $uiSelect);
            $uiSelect.attr("maxlength", attr.maxlen);
        }
    };
});