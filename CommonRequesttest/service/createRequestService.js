/*
 * ========================================================================
 * createRequestService    		Added by Reeth with ref to IS Integration for RTR  29-03-2017   
 * ========================================================================
 */
var app = angular.module('app', []);
app.service("createRequestService", function($http, $window, $rootScope, commonUtils, filterProvider, createRequestProvider, tileProvider, breadcrumbProvider) {

    this.getCompleteRCR = function() {
        return createRequestProvider.callCompleteRCRRestQuery;
    };

    this.getCAList = function() {
        return createRequestProvider.getCAList();
    };

    this.getLeadReviewer = function() {
        return createRequestProvider.getLeadReviewer();
    };

    /* -------------------- Get Brand List -------------------- */
    this.getBrand = function() {
        return commonUtils.convertListToArray(commonUtils.getTmfConstants().generic.brand1_multiline, commonUtils.getTmfConstants().generic.brand_multiline);
    };

    /* -------------------- Get Region List -------------------- */
    this.getRegion = function() {
        return commonUtils.convertToArray(commonUtils.getTmfConstants().generic.leadRegion_multiline);
    };

    /* -------------------- Get Product Type List -------------------- */
    this.getProductType = function() {
        return commonUtils.convertToArray(commonUtils.getTmfConstants().generic.productType_multiline);
    };

    /* -------------------- Get Study Length List -------------------- */
    this.getLengthOfStudy = function() {
        return commonUtils.convertToArray(commonUtils.getTmfConstants().generic.lengthOfStudy_multiline);
    };

    /* -------------------- Get End User List -------------------- */
    this.getEndUser = function() {
        return commonUtils.convertToArray(commonUtils.getTmfConstants().generic.endUser_multiline);
    };

    /* -------------------- Get End User List -------------------- */
    this.getFranchiseUser = function() {
        return commonUtils.convertToArray(commonUtils.getTmfConstants().generic.franchise_multiline);
    };

    /* -------------------- Safety Related Claims List -------------------- */
    this.getsafetyClaims = function() {
        return commonUtils.convertToArray(commonUtils.getTmfConstants().generic.safetyClaims_multiline);
    };

    /* -------------------- Get Max and Min Length -------------------- */
    this.getTextFieldMaxLength = function() {
        return commonUtils.getTmfConstants().generic.maxInputlength;
    };

    this.getTextAreaMaxLength = function() {
        return commonUtils.getTmfConstants().generic.maxTextlength;
    };

    /* -------------------- Get Due date information message -------------------- */
    this.getDueDateInfo = function() {
        return commonUtils.getTmfConstants().generic.dueDateInfo;
    };

    /* -------------------- Get Formula Details -------------------- */
    this.getFormulaDetails = function(value) {
        return createRequestProvider.callRestQueryForFormula(value);
    };

    /* -------------------- Get Project Name List -------------------- */
    this.getRnDProjectName = function() {
        return breadcrumbProvider.getRnDProjectName();
    };

    /* -------------------- Save RCR -------------------- */
    this.saveRCR = function(request) {
        return createRequestProvider.callRestQueryForSaveRCR(request);
    };

    /*--------------------- Submit RCR ------------------*/
    this.submitRCR = function(request) {
        return createRequestProvider.callRestQueryForSubmitRCR(request);
    };

    this.cancelRCR = function(request) {
        return createRequestProvider.callRestQueryForCancelRCR(request);
    };

    this.acknowledgeCA = function(request) {
        return createRequestProvider.callacknowledgeCARestQuery(request);
    };

    this.acknowledgeLR = function(request) {
        return createRequestProvider.callacknowledgeLRRestQuery(request);
    };

    this.acknowledgeCoordinator = function(request) {
        return createRequestProvider.callacknowledgeCoordinatorQuery(request);
    };

    this.getButtonsectionFromProvider = function() {
        return breadcrumbProvider.getButtonsectionFromTmf();
    };

    this.reAssignClinicalAssessor = function(request, type) {
        return createRequestProvider.reAssignClinicalAssessor(request, type);
    };

    this.reassignToGroup = function(object, value) {
        return createRequestProvider.callReassignToGroup(object, value);
    };
    this.getRTRList = function() {
        return tileProvider.getListOfRTR();
    };

    this.completeAssessmentCA = function(request) {
        return createRequestProvider.callCompleteAssessmentCARest(request);
    };

    this.requestInfo = function(request, info) {
        return createRequestProvider.callRequestInfo(request, info);
    };

    /*--------------------------- Submit RCR By CA --------------------------------*/
    this.submitForSofhiaInfo = function(request) {
        return createRequestProvider.callSubmitForSofhiaInfo(request);
    };
    return {
        useDependency: function() {
            return filterProvider.getSomething();
            return $window.getSomething();
            return $http.getSomething();
            return $rootScope.getSomething();
            return createRequestProvider.getSomething();
            return commonUtils.getSomething();
            return tileProvider.getSomething();
            return breadcrumbProvider.getSomething();
        }
    };
});