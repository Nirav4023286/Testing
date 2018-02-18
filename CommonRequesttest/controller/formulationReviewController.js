var app = angular.module('app', []);
app.controller("formulationReviewController", ["$scope", "$rootScope", "$state", "$window", "inputRequest",
    function($scope, $rootScope, $state, $window, inputRequest) {



        this.humanTestList = ["Controlled", "Uncontrolled"];
        this.safetyClaimsList = ["None", "Hypoallergenic", "Non-irritating", "NMT", "Developed for / deisgned for / suitable for new born across the regions", "others"];
        this.similarProList = ["Yes", "No"];
        this.fragnanceList = ["Modified", "Novel", "Existing"];
    }
]);


app.directive("formulationreviewSection", ["$templateCache",
    function($templateCache) {
        return {
            scope: false,
            templateUrl: "/cg510_rcr_createrequest/Core/html/formulationReview/formulationReview.xhtml"
        };
    }
]);