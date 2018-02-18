var app = angular.module('app', []);
app.controller("createrequestController", ["$scope", "$rootScope", "$state", "$stateParams", "$window", "inputRequest", "$timeout", "appMessages", "appConstants", "commonUtils", "createRequestService", "messageService",
    function($scope, $rootScope, $state, $stateParams, $window, inputRequest, $timeout, appMessages, appConstants, commonUtils, createRequestService, messageService) {


        /* ========================================= Common Info ========================================= */
        var requestObjCopy = {};
        $scope.clinicalAssessorValue;
        var vm = this;
        $scope.disableAIFields = false;

        this.loggedInUser = $rootScope.loggedInUser;
        /*{
        		 "displayName" : $window.fullName,
        	     "userId" : $window.loggedinUserId,
        	     "email" : $window.emailId,
        	     "firstName" :$window.firstName,
        	     "lastName" :$window.lastName,
        	     "ntId" : $window.loggedinUserId,
        	     "region":$window.region,
        	     "roles" : $window.roles
        	};*/
        this.init = function() {
            vm.rtrList = [];
            createRequestService.getRTRList().then(function(response) {
                if (response.status.code == 0) {
                    vm.rtrList = response.RequestNos;
                }
            }); // Get the list of RTR Numbers
            this.brandList = createRequestService.getBrand();
            this.studyList = createRequestService.getLengthOfStudy();
            this.caList = createRequestService.getCAList();
            this.leadReviewer = createRequestService.getLeadReviewer();
            this.regList = createRequestService.getRegion();
            this.productTypeList = createRequestService.getProductType();
            this.endUserList = createRequestService.getEndUser();
            this.franchiseList = createRequestService.getFranchiseUser();
            this.maxInputlength = createRequestService.getTextFieldMaxLength();
            this.maxInputArealength = createRequestService.getTextAreaMaxLength();
            this.dueDateInfoMsg = createRequestService.getDueDateInfo();
            this.safetyClaimsList = createRequestService.getsafetyClaims();
            this.RCRRequest = inputRequest.getRequest();
            if (inputRequest.getRequest().RequestInformation.isRnD == "true") { this.RCRRequest.RequestInformation.isRnD = true; } else {
                this.RCRRequest.RequestInformation.isRnD = false;
            } //move it to differrent function			
            if (inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.humanTesting == "true") { this.RCRRequest.AssessmentInformation.generalClinicalSafety.humanTesting = true; };
            if (inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.formulaIDNumber != '' && inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.formulaIDNumber != null) {
                $scope.formulaRelatedFlag = true;
            } else {
                $scope.formulaRelatedFlag = false;
            }
            this.tempAckCoordinatorObject.coordinator = this.RCRRequest.ClinicalCoordinator;
            this.tempAckCoordinatorObject.assessor = this.RCRRequest.ClinicalAssessor;
            setViewOnRequestStatus(this.RCRRequest);
            requestObjCopy = angular.copy(inputRequest.getRequest());
            this.projectNameList1 = createRequestService.getRnDProjectName();
            this.buttonsection = createRequestService.getButtonsectionFromProvider();
            $scope.rcr = this.RCRRequest; //		getProjectName();//function call to get Project Name
            setViewFlag();
            if (inputRequest.getRequest().AssessmentInformation.assessmentSubType == 'General Clinical Safety') {
                this.checkListSearch(inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.safetyRelatedClaims);
            } else if (inputRequest.getRequest().AssessmentInformation.assessmentSubType == 'Early Clinical Safety') {
                this.checkListSearch(inputRequest.getRequest().AssessmentInformation.earlyClinicalSafety.safetyRelatedClaims);
            }
            this.sendToFunction();
        };

        this.sendToFunction = function() {
            $scope.sendTo = [];
            if (this.RCRRequest.RequestInformation.projectStatus == "Submitted") {
                $scope.sendTo.push(this.RCRRequest.Requestor);
            } else if (this.RCRRequest.RequestInformation.projectStatus == "In Review" || this.RCRRequest.RequestInformation.projectStatus == "Accepted") {
                $scope.sendTo.push(this.RCRRequest.Requestor);
                $scope.sendTo.push(this.RCRRequest.ClinicalCoordinator);
            } else {
                $scope.sendTo.push(this.RCRRequest.Requestor);
                $scope.sendTo.push(this.RCRRequest.ClinicalCoordinator);
                $scope.sendTo.push(this.RCRRequest.ClinicalAssessor);
            }
        };
        this.spliceUser = function(userList) {
            var array = userList.filter(function(value) {
                return value.displayName !== $window.fullName;
            });
            return array;
        };

        this.disableDate = function(status, event) {
            if (status !== "New") {
                return event.stopPropagation();
            } else {
                return "";
            }
        };

        /* Function places Others to last index */
        this.safetyChangeIndex = function(data) {
            var first = "Others";
            data.sort(function(x, y) { return x == first ? y == first ? 0 : 1 : -1; });
            return (this.convertToString(data));
        };

        this.setViewOnRole = function() {
            if ($rootScope.userAccessRole == appConstants.REQUESTOR_ROLE) {
                this.setAccessFlag = "requestor";
                $scope.disableAIFields = false;
            } else if ($rootScope.userAccessRole == appConstants.CLINICALACCESSOR_ROLE) {
                this.setAccessFlag = "clinicalAssessor";
                $scope.disableAIFields = true;
            } else if ($rootScope.userAccessRole == appConstants.COORDINATOR_ROLE) {
                this.setAccessFlag = "coordinator";
                //$scope.disableAIFields = true;
            } else if ($rootScope.userAccessRole == appConstants.LEADREVIEWER_ROLE) {
                this.setAccessFlag = "leadReviewer";
                //$scope.disableAIFields = true;
            }
        };

        $scope.approvedFlag = true;
        $scope.hideButtons = true;
        $scope.leadReviewerFlag = false;

        function setViewOnRequestStatus(request) {
            if (request.RequestInformation.projectStatus == "New") {
                $scope.coordinatorFlag = false;
                $scope.clinicalAssessorFlag = false;
                $scope.leadReviewerFlag = false;
                $scope.CACommentBackgroundView = true;
                $scope.assessorReqInf = false; //to disable CA in request information
            } else if (request.RequestInformation.projectStatus == "Submitted") {
                $scope.coordinatorFlag = true;
                $scope.clinicalAssessorFlag = false;
                $scope.leadReviewerFlag = false;
                $scope.CACommentBackgroundView = true;
                $scope.assessorReqInf = false; //to disable CA in request information
            } else if (request.RequestInformation.projectStatus == "In Review") {
                $scope.coordinatorFlag = true;
                $scope.clinicalAssessorFlag = true;
                $scope.leadReviewerFlag = false;
                //$scope.disableAIFields = true;
                $scope.CACommentBackgroundView = true;
                $scope.assessorReqInf = false; //to disable CA in request information
                $scope.changeAcknowledgeCAView = false; //To show/hide CA Acknowledge View/Edit Page
            } else if (request.RequestInformation.projectStatus == "Accepted") {
                $scope.coordinatorFlag = true;
                $scope.clinicalAssessorFlag = true;
                $scope.leadReviewerFlag = false;
                //$scope.disableAIFields = true;
                $scope.CACommentBackgroundView = false;
                $scope.assessorReqInf = true; //to disable CA in request information
                $scope.changeAcknowledgeCAView = true; //To show/hide CA Acknowledge View/Edit Page
            } else if (request.RequestInformation.projectStatus == "Draft") {
                // $scope.coordinatorFlag = false;
                // $scope.clinicalAssessorFlag = true;
                // $scope.leadReviewerFlag = true;
                // $scope.CACommentBackgroundView = true;
                // $scope.assessorReqInf = true;//to disable CA in request information
                // $scope.changeAcknowledgeCAView = true;//To show/hide CA Acknowledge View/Edit Page
                // $scope.approvedFlag = false;
                setFlag();
            } else if (request.RequestInformation.projectStatus == "Approved") {
                // $scope.coordinatorFlag = false;
                // $scope.clinicalAssessorFlag = true;
                // $scope.leadReviewerFlag = true;
                // $scope.CACommentBackgroundView = true;
                // $scope.assessorReqInf = true;//to disable CA in request information
                // $scope.changeAcknowledgeCAView = true;//To show/hide CA Acknowledge View/Edit Page
                // $scope.approvedFlag = false;
                setFlag();
            } else if (request.RequestInformation.projectStatus == "Cancelled") {
                //$scope.hideAllButtons = true;
                $scope.approvedFlag = false;
            } else if (request.RequestInformation.projectStatus == "Under Revision") {
                //$scope.approvedFlag = false;
                $scope.hideButtons = false;
            }
        };

        function setFlag() {
            $scope.coordinatorFlag = false;
            $scope.clinicalAssessorFlag = true;
            $scope.leadReviewerFlag = true;
            $scope.CACommentBackgroundView = true;
            $scope.assessorReqInf = true; //to disable CA in request information
            $scope.changeAcknowledgeCAView = true; //To show/hide CA Acknowledge View/Edit Page
            $scope.approvedFlag = false;
        }

        /*function to convert string to boolean for CA and LR*/
        this.getBoolean = function(value) {
            if (value == "true") {
                return true;
            } else {
                return false;
            };
        };

        function setViewFlag() {
            if (inputRequest.getRequest().RequestInformation.RCR_ID != "" && inputRequest.getRequest().RequestInformation.RCR_ID != null) {
                $scope.viewFlag = true;
            } else {
                $scope.viewFlag = false;
            }
        }

        $scope.changeView = function() {
            $scope.viewFlag = !$scope.viewFlag;
            setViewOnRequestStatus(requestObjCopy);
        };



        this.reassignToGroup = function(reqObj, value) {
            if (reqObj.RequestInformation.isRnD == true) { reqObj.RequestInformation.isRnD = "true"; } else {
                reqObj.RequestInformation.isRnD = "false";
            }
            if (reqObj.AssessmentInformation.generalClinicalSafety.humanTesting == true) {
                reqObj.AssessmentInformation.generalClinicalSafety.humanTesting = "true";
            }
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.REASSIGN_GROUP, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                createRequestService.reassignToGroup(reqObj, value).then(function(response) {
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.REASSIGN_GROUP_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        $scope.changeAcknowledgeCAView = false;
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.REASSIGN_GROUP_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };

        /* ------------------ Save RCR ------------------ */
        this.saveRCR = function(request) {
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.SAVE_MSG, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                    request.RequestInformation.isRnD = "false";
                }
                if (request.AssessmentInformation.generalClinicalSafety.humanTesting == true) { request.AssessmentInformation.generalClinicalSafety.humanTesting = "true"; };
                createRequestService.saveRCR(request).then(function(response) {
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.SAVE_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        $scope.changeView();
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.SAVE_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };

        /* ------------------ Submit RCR ------------------ */
        this.submitRCR = function(request, type) {
            var SUBMIT_ERROR = '';
            var SUBMIT_SUCCESS = '';
            var SUBMIT_MSG = '';
            if (type == "request") {
                SUBMIT_MSG = appMessages.SUBMIT_MSG + "submit the Request ?";
                SUBMIT_SUCCESS = appMessages.SUBMIT_SUCCESS + "submitted successfully";
                SUBMIT_ERROR = appMessages.SUBMIT_ERROR + "submmiting the Request";
            } else {
                SUBMIT_MSG = appMessages.SUBMIT_MSG + "approve the Request ?";
                SUBMIT_SUCCESS = appMessages.SUBMIT_SUCCESS + "approved successfully";
                SUBMIT_ERROR = appMessages.SUBMIT_ERROR + "approving the Request";
            }
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, SUBMIT_MSG, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                    request.RequestInformation.isRnD = "false";
                }
                if (request.AssessmentInformation.generalClinicalSafety.humanTesting == true) { request.AssessmentInformation.generalClinicalSafety.humanTesting = "true"; };

                createRequestService.submitRCR(request).then(function(response) {
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, SUBMIT_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        $scope.changeView();
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, SUBMIT_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };

        /* ------------------ Cancel RCR ------------------ */
        this.cancel = function(request) {
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.CANCEL_MSG, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                    request.RequestInformation.isRnD = "false";
                }
                createRequestService.cancelRCR(request).then(function(response) {
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.CANCEL_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.CANCEL_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };

        $scope.info = {
            to: "",
            from: "",
            comment: ""
        };
        this.requestInfo = function(request) {
            if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                request.RequestInformation.isRnD = "false";
            }
            $scope.info.from = this.loggedInUser;
            createRequestService.requestInfo(request, $scope.info).then(function(response) {
                if (response.Status.code == appConstants.SUCCESS_CODE) {
                    inputRequest.setRequest(response);
                    if ($state.current.name == 'viewRequest.tabSection') {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
                }
            });
        };


        this.convertToString = function(data) {
            return commonUtils.convertToString(data);
        };

        this.emptyAdditionalRegion = function() {
            this.RCRRequest.RequestInformation.additionalRegion = [];
        };


        /* ------------------ Date Picker ------------------ */
        function datePickerInit(request) {
            request.RequestInformation.dueDate = (request.RequestInformation.dueDate != null && request.RequestInformation.dueDate != "") ? commonUtils.formatDate(request.RequestInformation.dueDate) : "";


            var date = new Date();
            $scope.today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return request;
        };
        /* ================================================================================================== */


        /* ========================================= Request Info ========================================= */

        /* ------------------ Button Values ------------------ */
        this.regionList = ["Global", "Regional"];
        this.productDevelopment = ["SMP", "NPD", "Platform"];
        this.directImportList = ["Yes", "No"];
        this.required = true;
        this.maxInputlengthCheck = true;
        /* ================================================================================================== */

        /* ========================================= Assessment Info ========================================= */

        /* ------------------ Button Values ------------------ */
        this.humanTestList = ["Controlled", "Uncontrolled"];
        this.yesNoList = ["Yes", "No"];
        this.fragnanceList = ["Modified", "Novel", "Existing"];
        var productType = [{
                key: "0 - RINSE OFF",
                value: "Rinse Off"
            },
            {
                key: "1 - LEAVE ON",
                value: "Leave On"
            }
        ];
        var endUSer = [{
                key: ">12 YEARS",
                value: ">12 Years"
            },
            {
                key: "0-3 YEARS",
                value: "0-3 Years"
            },
            {
                key: "4-12 YEARS",
                value: "4-12 Years"
            }
        ];

        /* ------------------ Extract Formula ------------------ */
        this.extractFormula = function(value) {
            var tempProductType = "";
            var endUser = "";
            // this.viewPageValidation();
            createRequestService.getFormulaDetails(value).then(function(response) {
                if (response.status.statusCode == appConstants.SUCCESS_CODE) {
                    $scope.formulaRelatedFlag = true;
                    if (response.formulaCanonical.FormulaProducts.hasOwnProperty("ProductType")) {
                        for (var i = 0; productType.length > i; i++) {
                            if (response.formulaCanonical.FormulaProducts.ProductType[0] == productType[i].key) {
                                tempProductType = productType[i].value;
                            }
                        }
                        for (var j = 0; endUSer.length > j; j++) {
                            if (response.formulaCanonical.FormulaProducts.EndUser[0] == endUSer[j].key) {
                                endUser = endUSer[j].value;
                            }
                        }
                        inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.productType = tempProductType;
                        inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.endUser = endUser;
                    }
                    if (response.formulaCanonical.FormulaProducts.hasOwnProperty("AssociatedProducts")) {
                        inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.productName = response.formulaCanonical.FormulaProducts.AssociatedProducts[0].ProductName;
                    }
                    inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.labNotebookNumber = response.formulaCanonical.FormulaDetails.labBookCode;
                } else {
                    commonUtils.showModal(appConstants.ERR_MESSAGE, appMessages.FORMULA_ERROR, "", appConstants.OK, appConstants.CODE_2);
                    messageService.showModal({}, modalOptions);
                }
            });
            /*createRequestService.getFormulaDetails(value).then(function(response){
            	this.formulaList = response;
            });*/
        };

        /* ------------------ Clear Formula Details ------------------ */
        this.clearFormulaDetails = function(type) {
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.FORMULA_CLEAR, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                $scope.formulaRelatedFlag = false;

                if (type == "generalClinicalSafety") {
                    inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.formulaIDNumber = "";
                    inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.labNotebookNumber = "";
                    inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.productType = "";
                    inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.endUser = "";
                    inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.productName = "";
                    $scope.AIFlag = false;
                } else {
                    inputRequest.getRequest().AssessmentInformation.earlyClinicalSafety.formulaIDNumber = "";
                    inputRequest.getRequest().AssessmentInformation.earlyClinicalSafety.labNotebookNumber = "";
                    inputRequest.getRequest().AssessmentInformation.earlyClinicalSafety.productType = "";
                    inputRequest.getRequest().AssessmentInformation.earlyClinicalSafety.endUser = "";
                    inputRequest.getRequest().AssessmentInformation.earlyClinicalSafety.productName = "";
                    $scope.AIFlag = false;
                }

            });
        };

        /* ------------------ Reset Formula Details ------------------ */
        this.resetFormulaDetails = function() {
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.FORMULA_RESET, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                //this.RCRRequest = this.requestObjCopy;
                //inputRequest.setRequest(this.requestObjCopy);
                $scope.formulaRelatedFlag = true;
                inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.formulaIDNumber = requestObjCopy.AssessmentInformation.generalClinicalSafety.formulaIDNumber;
                inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.labNotebookNumber = requestObjCopy.AssessmentInformation.generalClinicalSafety.labNotebookNumber;
                inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.productType = requestObjCopy.AssessmentInformation.generalClinicalSafety.productType;
                inputRequest.getRequest().AssessmentInformation.generalClinicalSafety.endUser = requestObjCopy.AssessmentInformation.generalClinicalSafety.endUser;

            });
        };


        var safetyClaimsFlag, associatedChassisFlag, associatedAPRFlag, concTestingFlag, prodNameFlag, projNameFlag, labNotebookFlag, tradeNameFlag;
        this.validateMaxLengthCheck = function(value, formId) {
            if (formId == 'safetyClaims') {
                safetyClaimsFlag = value;
            } else if (formId == 'associatedChassis') {
                associatedChassisFlag = value;
            } else if (formId == 'associatedAPR') {
                associatedAPRFlag = value;
            } else if (formId == 'concentrationTesting') {
                concTestingFlag = value;
            } else if (formId == 'projectName') {
                projNameFlag = value;
            } else if (formId == 'labNotebookNumber') {
                labNotebookFlag = value;
            } else if (formId == 'tradeName') {
                tradeNameFlag = value;
            } else if (formId == 'productName') {
                prodNameFlag = value;
            }

            if ((safetyClaimsFlag === undefined) && (associatedChassisFlag === undefined) && (associatedAPRFlag === undefined) && (concTestingFlag === undefined) && (projNameFlag === undefined) && (labNotebookFlag === undefined) && (tradeNameFlag === undefined) && (prodNameFlag === undefined)) {
                this.maxInputlengthCheck = true;

            } else {
                this.maxInputlengthCheck = false;
            }
        };

        /* ------------ To check Safety Related Claims is having Others field in General clinical safety ------------ */

        // $scope.status;
        this.checkListSearch = function(value) {
            if (this.RCRRequest.AssessmentInformation.assessmentSubType == 'General Clinical Safety') {
                $scope.status = $.inArray('Others', value) > -1;
                if ($.inArray('None', value) > -1) {
                    this.RCRRequest.AssessmentInformation.generalClinicalSafety.safetyRelatedClaims = ["None"];
                    this.RCRRequest.AssessmentInformation.generalClinicalSafety.otherSafetyRelatedClaims = "";
                    $scope.status = false;
                }
            } else if (this.RCRRequest.AssessmentInformation.assessmentSubType == 'Early Clinical Safety') {
                $scope.status = $.inArray('Others', value) > -1;
                if ($.inArray('None', value) > -1) {
                    this.RCRRequest.AssessmentInformation.earlyClinicalSafety.safetyRelatedClaims = ["None"];
                    this.RCRRequest.AssessmentInformation.earlyClinicalSafety.otherSafetyRelatedClaims = "";
                    $scope.status = false;
                }

            }
            if (!$scope.status) {
                if (this.RCRRequest.AssessmentInformation.assessmentSubType == 'General Clinical Safety') {
                    this.RCRRequest.AssessmentInformation.generalClinicalSafety.otherSafetyRelatedClaims = "";
                } else if (this.RCRRequest.AssessmentInformation.assessmentSubType == 'Early Clinical Safety') {
                    this.RCRRequest.AssessmentInformation.earlyClinicalSafety.otherSafetyRelatedClaims = "";
                }
            }
        };
        this.humanTesting = function(value) {
            if (value == false) {
                this.RCRRequest.AssessmentInformation.generalClinicalSafety.humanTesting = "";
            }
        };

        /* ================================================================================================== */

        /* ========================================= Acknowledge Request Info CA ========================================= */

        /* ------------------ Button Values ------------------ */
        this.CAYesNoButtons = ["Yes", "No"];
        this.acknowledgeBtnList = ["Acknowledge Request", "Reassign"];
        this.reassignList = [{ "id": "0", "name": "Reassign Clinical Assessor" },
            { "id": "1", "name": "Release to Group" }
        ];
        this.safetyAssessmentList = ["Accepted for Commercialization"];
        this.testTypes = ["CIT", "PFA", "Cumulative Imt", "Epi-Derm", "HRIPT", "Epi-Ocular", "Human Ocular", "Facial Sting"];

        $scope.changeAcknowledgeCAView = false;
        /* ------------------ Acknowledge Request Section ------------------ */
        this.acknowledgeRequest = function(request) {
            if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                request.RequestInformation.isRnD = "false";
            }
            createRequestService.acknowledgeCA(request).then(function(response) {
                if (response.Status.code == appConstants.SUCCESS_CODE) {
                    commonUtils.showModal(appConstants.MESSAGE, appMessages.ACKNOWLEDGE_CA, "", appConstants.OK, appConstants.CODE_2);
                    messageService.showModal({}, modalOptions);

                    inputRequest.setRequest(response);
                    if ($state.current.name == 'viewRequest.tabSection') {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
                    $scope.changeAcknowledgeCAView = true;
                    //this.RCRRequest.AcknowledgeInfoCA = response.AcknowledgeInfoCA;
                    //inputRequest.setRequest(response);
                } else {
                    commonUtils.showModal(appConstants.MESSAGE, appMessages.ACKNOWLEDGE_CA_ERROR, "", appConstants.OK, appConstants.CODE_2);
                    messageService.showModal({}, modalOptions);
                }
            });
        };

        this.completeAssessmentCA = function(request) {
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.COMPLETE_ASSESSMENT_CA, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                    request.RequestInformation.isRnD = "false";
                }
                createRequestService.completeAssessmentCA(request).then(function(response) {
                    // if(request.AssessmentInformation.generalClinicalSafety.humanTesting == true){request.AssessmentInformation.generalClinicalSafety.humanTesting = "true";};
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.COMPLETE_ASSESSMENT_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        $scope.CACommentBackgroundView = true;
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.COMPLETE_ASSESSMENT_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };
        this.CAAckValue = "";
        this.clearAcknowledgeSection = function(ackRequest) {
            ackRequest.AcknowledgeInfoCA.commitmentDate = "";
            ackRequest.AcknowledgeInfoCA.comment = "";
            $scope.acknowledgeView = true;
        };

        /*---------------------------------------------------- Submit RCR By CA ----------------------------------------------------------*/
        this.submitForSofhiaInfo = function(request) {
            if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                request.RequestInformation.isRnD = "false";
            }
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.SOFIA_INFO_REQUEST, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {

                createRequestService.submitForSofhiaInfo(request).then(function(response) {
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.SOFIA_INFO_REQUEST_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        $scope.CACommentBackgroundView = true;
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        $scope.changeView();
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.SOFIA_INFO_REQUEST_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };

        /* ================================================================================================== */

        /* ========================================= Acknowledge Request LR ========================================= */

        /* ------------------ Button Values ------------------ */
        this.acknowledgeBtnList = ["Acknowledge Request", "Reassign"];
        $scope.changeAcknowledgeLRView = false;
        /* ------------------ Acknowledge Request Section ------------------ */
        this.acknowledgeRequestLR = function(request) {
            if (request.RequestInformation.isRnD == true) { request.RequestInformation.isRnD = "true"; } else {
                request.RequestInformation.isRnD = "false";
            }
            createRequestService.acknowledgeLR(request).then(function(response) {
                if (response.Status.code == appConstants.SUCCESS_CODE) {
                    commonUtils.showModal(appConstants.MESSAGE, appMessages.ACKNOWLEDGE_CA, "", appConstants.OK, appConstants.CODE_2);
                    messageService.showModal({}, modalOptions);
                    inputRequest.setRequest(response);
                    if ($state.current.name == 'viewRequest.tabSection') {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
                    $scope.changeAcknowledgeLRView = true;
                    //this.RCRRequest.AcknowledgeInfoLR = response.AcknowledgeInfoLR;
                } else {
                    commonUtils.showModal(appConstants.MESSAGE, appMessages.ACKNOWLEDGE_CA_ERROR, "", appConstants.OK, appConstants.CODE_2);
                    messageService.showModal({}, modalOptions);
                }
            });
        };

        this.clearAcknowledgeSectionLR = function(ackRequest) {
            ackRequest.AcknowledgeInfoLR.comment = "";
            $scope.acknowledgeView = true;
        };

        /* ================================================================================================== */

        /******************************************* Re-Assign CA AND LEAD REVIEWER STARTS **********************************/
        $('.dropdown-menu').find('input').click(function(e) {
            e.stopPropagation();
        });

        this.reAssignClinical = function(value, type) {
            var request, reassign /*reassignSuccess*/ ;
            if (type == "reviewer") {
                this.RCRRequest.ClinicalLeadReviewer = value;
                reassign = appMessages.REASSIGN + value.displayName + " as Clinical Lead Reviewer ?";
            } else {
                this.RCRRequest.ClinicalAssessor = value;
                reassign = appMessages.REASSIGN + value.displayName + " as Clinical Assessor ?";
            }
            request = this.RCRRequest;
            commonUtils.showModal(appConstants.CONFIRMATION_MSG, reassign, appConstants.YES, appConstants.NO, appConstants.CODE_1);
            messageService.showModal({}, modalOptions).then(function(result) {
                createRequestService.reAssignClinicalAssessor(request, type).then(function(response) {
                    if (response.Status.code == appConstants.SUCCESS_CODE) {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.REASSIGN_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                        inputRequest.setRequest(response);
                        if ($state.current.name == 'viewRequest.tabSection') {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        $scope.changeAcknowledgeCAView = false;
                    } else {
                        commonUtils.showModal(appConstants.MESSAGE, appMessages.REASSIGN_ERROR, "", appConstants.OK, appConstants.CODE_2);
                        messageService.showModal({}, modalOptions);
                    }
                });
            });
        };

        this.closeRequestInfo = function() {
            $scope.info = {
                to: "",
                from: "",
                comment: ""
            };
        };
        /******************************************* Re-Assign CA AND LEAD REVIEWER ENDS **************************************/

        /* ========================================= Acknowledge Coordinator ========================================= */
        this.tempAckCoordinatorObject = { "coordinator": "", "assessor": "" };

        /* ------------------ Acknowledge Request Section ------------------ */
        this.acknowledgeCoordinator = function(request) {
            var tempObj = this.RCRRequest;
            if (this.RCRRequest.RequestInformation.isRnD == true) { this.RCRRequest.RequestInformation.isRnD = "true"; } else {
                this.RCRRequest.RequestInformation.isRnD = "false";
            }
            if (request.assessor == this.RCRRequest.ClinicalAssessor && request.coordinator == this.RCRRequest.ClinicalCoordinator) {
                commonUtils.showModal(appConstants.MESSAGE, "No changes to submit", "", appConstants.OK, appConstants.CODE_2);
                messageService.showModal({}, modalOptions);
            } else {
                if (request.assessor != "" && request.assessor != undefined && request.assessor != null) {
                    //request.clinicalAssessor = $scope.clinicalAssessorValue;
                    commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.ASSIGN + tempObj.ClinicalAssessor.displayName + " as Clinical Assessor ?", appConstants.YES, appConstants.NO, appConstants.CODE_1);
                    messageService.showModal({}, modalOptions).then(function(result) {
                        tempObj.ClinicalCoordinator = request.coordinator;
                        tempObj.ClinicalAssessor = request.assessor;
                        createRequestService.acknowledgeCoordinator(tempObj).then(function(response) {
                            if (response.Status.code == appConstants.SUCCESS_CODE) {
                                inputRequest.setRequest(response);
                                if ($state.current.name == 'viewRequest.tabSection') {
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                }
                                commonUtils.showModal(appConstants.MESSAGE, 'Clinical Assessor ' + appMessages.ASSIGN_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                                messageService.showModal({}, modalOptions);
                            } else {
                                commonUtils.showModal(appConstants.MESSAGE, appMessages.ASSIGN_ERROR + ' Clinical Assessor', "", appConstants.OK, appConstants.CODE_2);
                                messageService.showModal({}, modalOptions);
                            }
                        });
                    });
                } else if (request.coordinator != this.RCRRequest.ClinicalCoordinator) {
                    commonUtils.showModal(appConstants.CONFIRMATION_MSG, appMessages.REASSIGN + tempObj.ClinicalCoordinator.displayName + " as Clinical Coordinator ?", appConstants.YES, appConstants.NO, appConstants.CODE_1);
                    messageService.showModal({}, modalOptions).then(function(result) {
                        tempObj.ClinicalCoordinator = request.coordinator;
                        createRequestService.acknowledgeCoordinator(tempObj).then(function(response) {
                            if (response.Status.code == appConstants.SUCCESS_CODE) {
                                if ($state.current.name == 'viewRequest.tabSection') {
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                }
                                commonUtils.showModal(appConstants.MESSAGE, 'Coordinator ' + appMessages.REASSIGN_SUCCESS, "", appConstants.OK, appConstants.CODE_2);
                                messageService.showModal({}, modalOptions);
                            } else {
                                commonUtils.showModal(appConstants.MESSAGE, appMessages.REASSIGN_ERROR + ' Coordinator', "", appConstants.OK, appConstants.CODE_2);
                                messageService.showModal({}, modalOptions);
                            }
                        });
                    });
                }
            }


        };

        /* ================================================================================================== */


        /******************************* SCROLL FUCNTIONS STARTS **********************************/
        // Defines the element to scroll and speed
        jQuery.fn.scrollTo = function(elem, speed) {
            $(this).animate({
                scrollTop: $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
            }, speed == undefined ? 1000 : speed);
            return this;
        };

        // Used by the right section of the page to scroll to the respective page on click
        $scope.scroll = function(value) {
            $("#parentDiv").scrollTo(value, 500);
            $scope.activeTab = value;
        };

        // This will be trigged by the left pane scroll to highlights the right page respective section
        $("#parentDiv").on('scroll', function() {
            $('.target').each(function() {
                if ($("#parentDiv").scrollTop() >= $(this).position().top) {
                    var id = $(this).attr('id');
                    $('.rightSection').find("*").removeClass("active-status");
                    $('li[class=' + id + ']').addClass('active-status');
                }
            });
        });
        /******************************* SCROLL FUCNTIONS ENDS **********************************/


        /******************************** VALIDATION*********************************************/

        function checkForRequiredFields(form_classNames_arr) {
            if ($('form[name=' + form_classNames_arr + ']').hasClass('ng-valid-required')) {
                return true;
            }
            return false;
        }


        $scope.AIFlag = false;
        $scope.RIFlag = false;
        $scope.flag = !($scope.AIFlag && $scope.RIFlag);

        /* ------------------ Common Watcher ------------------ */

        $scope.$watch('rcr', function(newVal, oldVal) {
            if (newVal != '' && newVal != undefined) {
                //form validation request info 
                // console.log('angular.isUndefined(newVal.RequestInformation.productDevelopment) = ', angular.isUndefined(newVal.RequestInformation.productDevelopment));
                // angular.isUndefined(newVal.RequestInformation.productDevelopment)
                if (newVal.RequestInformation.productDevelopment == "" || newVal.RequestInformation.productDevelopment == null || newVal.RequestInformation.productDevelopment == undefined) {
                    $scope.RIFlag = false;
                }
                // angular.isUndefined(newVal.RequestInformation.directImport
                else if (newVal.RequestInformation.directImport == "" || newVal.RequestInformation.directImport == null || newVal.RequestInformation.directImport == undefined) {
                    $scope.RIFlag = false;
                }
                //angular.isUndefined(newVal.RequestInformation.franchise)
                else if (newVal.RequestInformation.franchise == "" || newVal.RequestInformation.franchise == null || newVal.RequestInformation.franchise == undefined) {
                    $scope.RIFlag = false;
                }
                // angular.isUndefined(newVal.RequestInformation.region)
                else if (newVal.RequestInformation.region == "" || newVal.RequestInformation.region == null || newVal.RequestInformation.region == undefined) {
                    $scope.RIFlag = false;
                } else {
                    if (newVal.RequestInformation.region == 'Global') {
                        $scope.RIFlag = true;
                    } else if (newVal.RequestInformation.region == 'Regional') {
                        if (newVal.RequestInformation.leadRegion !== "" && !(angular.isUndefined(newVal.RequestInformation.leadRegion))) {
                            $scope.RIFlag = true;
                        } else {
                            $scope.RIFlag = false;
                        }
                    } else {
                        $scope.RIFlag = false;
                    }
                }
                /************************************FOR CA************************************/
                if ((newVal.AcknowledgeInfoCA.bigDataComplaint != "" && newVal.AcknowledgeInfoCA.bigDataComplaint != null) || (newVal.AcknowledgeInfoCA.bigDataComplaint)) {
                    if ((newVal.AcknowledgeInfoCA.escalationRequired != "" && newVal.AcknowledgeInfoCA.escalationRequired != null) || (newVal.AcknowledgeInfoCA.escalationRequired)) {
                        $scope.AICAFlag = true;
                        if (newVal.AcknowledgeInfoCA.escalationRequired == 'Yes') {
                            if (newVal.AcknowledgeInfoCA.reasonsForEscalation != "" && newVal.AcknowledgeInfoCA.reasonsForEscalation != undefined) {
                                if (newVal.ClinicalLeadReviewer != undefined && newVal.ClinicalLeadReviewer != null && newVal.ClinicalLeadReviewer != "") {
                                    $scope.AICAFlag = true;
                                } else {
                                    $scope.AICAFlag = false;
                                }
                            } else {
                                $scope.AICAFlag = false;
                            }
                        } else if (newVal.AcknowledgeInfoCA.escalationRequired == 'No' || newVal.AcknowledgeInfoCA.escalationRequired) {
                            if (newVal.ClinicalLeadReviewer != undefined && newVal.ClinicalLeadReviewer != null && newVal.ClinicalLeadReviewer != "") {
                                $scope.AICAFlag = true;
                            } else {
                                $scope.AICAFlag = false;
                            }
                        }
                    } else {
                        $scope.AICAFlag = false;
                    };
                } else {
                    $scope.AICAFlag = false;
                }
                if ((newVal.AssessmentInformation.generalClinicalSafety.safetyTesting != '' && newVal.AssessmentInformation.generalClinicalSafety.safetyTesting != null) || (newVal.AssessmentInformation.earlyClinicalSafety.safetyTesting != '' && newVal.AssessmentInformation.earlyClinicalSafety.safetyTesting != null)) {
                    if (newVal.AssessmentInformation.generalClinicalSafety.safetyTesting == "Yes" || newVal.AssessmentInformation.earlyClinicalSafety.safetyTesting == "Yes") {
                        if (newVal.AcknowledgeInfoCA.typeOfTests != "" && newVal.AcknowledgeInfoCA.typeOfTests.length != 0) {
                            $scope.RICAFlag = true;
                        } else {
                            $scope.RICAFlag = false;
                        }
                    } else {
                        $scope.RICAFlag = true;
                    }
                } else {
                    $scope.RICAFlag = false;
                }

                if (newVal.AcknowledgeInfoCA.safetyBackground != '' && newVal.AcknowledgeInfoCA.safetyBackground != null && (newVal.AcknowledgeInfoCA.commentBackground != '' && newVal.AcknowledgeInfoCA.commentBackground != undefined)) {
                    $scope.caCommentBackgroundFlag = true;
                } else {
                    $scope.caCommentBackgroundFlag = false;
                }
                /***********************************CA Ends*************************************/

                /************************************FOR General Clinical Safety************************************/
                if (newVal.AssessmentInformation.assessmentSubType == 'General Clinical Safety') {
                    if (newVal.AssessmentInformation.generalClinicalSafety.formulaIDNumber == "" || newVal.AssessmentInformation.generalClinicalSafety.formulaIDNumber == null || newVal.AssessmentInformation.generalClinicalSafety.formulaIDNumber == undefined) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.generalClinicalSafety.productType == "" || newVal.AssessmentInformation.generalClinicalSafety.productType == null || newVal.AssessmentInformation.generalClinicalSafety.productType == undefined) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.generalClinicalSafety.endUser == "" || newVal.AssessmentInformation.generalClinicalSafety.endUser == null || newVal.AssessmentInformation.generalClinicalSafety.endUser == undefined) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.generalClinicalSafety.newINCItoJnJ == "" || newVal.AssessmentInformation.generalClinicalSafety.newINCItoJnJ == undefined || newVal.AssessmentInformation.generalClinicalSafety.newINCItoJnJ == null) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.generalClinicalSafety.tradeName == "" || newVal.AssessmentInformation.generalClinicalSafety.tradeName == null || newVal.AssessmentInformation.generalClinicalSafety.tradeName == undefined) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.generalClinicalSafety.fragrance == "" || newVal.AssessmentInformation.generalClinicalSafety.fragrance == null || newVal.AssessmentInformation.generalClinicalSafety.fragrance == undefined) {
                        $scope.AIFlag = false;
                    } else {
                        if ((newVal.AssessmentInformation.generalClinicalSafety.fragrance == 'Existing' && newVal.AssessmentInformation.generalClinicalSafety.concentrationTested !== '' && !(angular.isUndefined(newVal.AssessmentInformation.generalClinicalSafety.concentrationTested))) || (newVal.AssessmentInformation.generalClinicalSafety.fragrance == 'Modified') || (newVal.AssessmentInformation.generalClinicalSafety.fragrance == 'Novel')) {
                            $scope.AIFlag = true;
                        } else {
                            $scope.AIFlag = false;
                        }
                    }

                }
                /***********************************General Clinical Safety Ends*************************************/

                /************************************FOR Early Clinical Safety************************************/
                else if (newVal.AssessmentInformation.assessmentSubType == 'Early Clinical Safety') {
                    if (newVal.AssessmentInformation.earlyClinicalSafety.formulaIDNumber == "" || angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.formulaIDNumber)) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.earlyClinicalSafety.productType == "" || angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.productType)) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.earlyClinicalSafety.endUser == "" || angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.endUser)) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.earlyClinicalSafety.newINCItoJnJ == "" || angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.newINCItoJnJ)) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.earlyClinicalSafety.tradeName == "" || angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.tradeName)) {
                        $scope.AIFlag = false;
                    } else if (newVal.AssessmentInformation.earlyClinicalSafety.fragrance == "" || angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.fragrance)) {
                        $scope.AIFlag = false;
                    } else {
                        if ((newVal.AssessmentInformation.earlyClinicalSafety.fragrance == 'Existing' && newVal.AssessmentInformation.earlyClinicalSafety.concentrationTested !== '' && !(angular.isUndefined(newVal.AssessmentInformation.earlyClinicalSafety.concentrationTested))) || (newVal.AssessmentInformation.earlyClinicalSafety.fragrance == 'Modified') || (newVal.AssessmentInformation.earlyClinicalSafety.fragrance == 'Novel')) {
                            $scope.AIFlag = true;
                        } else {
                            $scope.AIFlag = false;
                        }
                        // $scope.AIFlag = true;

                    }

                }
                /***********************************Early Clinical Safety Ends*************************************/

            }
        }, true);

        /*"viewPage" used in conterto call, will be removed once concerto starts working, and we can confirm the current validation logic is working*/
        $scope.viewPage = function() {
            /*validation for request info view page*/
            if ($scope.rcr.Requestor.displayName === null || $scope.rcr.Requestor.displayName === "") {
                $scope.RIFlag = false;
            } else if ($scope.rcr.Requestor.email === null || $scope.rcr.Requestor.email === "") {
                $scope.RIFlag = false;
            }
            //  else if ($scope.rcr.ClinicalAssessor.displayName === null || $scope.rcr.ClinicalAssessor.displayName === "") {
            //     $scope.RIFlag = false;
            // } 
            else if ($scope.rcr.RequestInformation.region === null || $scope.rcr.RequestInformation.region === "") {
                $scope.RIFlag = false;
            } else if ($scope.rcr.RequestInformation.directImport === null || $scope.rcr.RequestInformation.directImport === "") {
                $scope.RIFlag = false;
            } else if ($scope.rcr.RequestInformation.productDevelopment === null || $scope.rcr.RequestInformation.productDevelopment === "") {
                $scope.RIFlag = false;
            } else if ($scope.rcr.RequestInformation.franchise === null || $scope.rcr.RequestInformation.franchise === "") {
                $scope.RIFlag = false;
            } else {
                if ($scope.rcr.RequestInformation.region.toUpperCase() === "GLOBAL") {
                    // if($scope.rcr.RequestInformation.additionalRegion.length===0||($scope.rcr.RequestInformation.leadRegion===null||$scope.rcr.RequestInformation.leadRegion==="")){
                    //  $scope.RIFlag = false;
                    // }
                    // else {
                    //  $scope.RIFlag = true;
                    // }
                    $scope.RIFlag = true;
                } else if ($scope.rcr.RequestInformation.region.toUpperCase() === "REGIONAL") {
                    if ($scope.rcr.RequestInformation.leadRegion === null || $scope.rcr.RequestInformation.leadRegion === "") {
                        $scope.RIFlag = false;
                    } else {
                        $scope.RIFlag = true;
                    }
                }
                //$scope.RIFlag = true;
            }

            /*validation for Assement info view page*/
            if ($scope.rcr.AssessmentInformation.assessmentType === null || $scope.rcr.AssessmentInformation.assessmentType === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.assessmentSubType === null || $scope.rcr.AssessmentInformation.assessmentSubType === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.generalClinicalSafety.formulaIDNumber === null || $scope.rcr.AssessmentInformation.generalClinicalSafety.formulaIDNumber === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.generalClinicalSafety.productTyp === null || $scope.rcr.AssessmentInformation.generalClinicalSafety.productType === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.generalClinicalSafety.endUser === null || $scope.rcr.AssessmentInformation.generalClinicalSafety.endUser === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.generalClinicalSafety.newINCItoJnJ === null || $scope.rcr.AssessmentInformation.generalClinicalSafety.newINCItoJnJ === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.generalClinicalSafety.tradeName === null || $scope.rcr.AssessmentInformation.generalClinicalSafety.tradeName === "") {
                $scope.AIFlag = false;
            } else if ($scope.rcr.AssessmentInformation.generalClinicalSafety.fragrance === null || $scope.rcr.AssessmentInformation.generalClinicalSafety.fragrance === "") {
                $scope.AIFlag = false;
            } else {
                if (this.RCRRequest.AssessmentInformation.generalClinicalSafety.fragrance.toUpperCase() === "EXISTING") {
                    if (this.RCRRequest.AssessmentInformation.generalClinicalSafety.concentrationTested === "" || this.RCRRequest.AssessmentInformation.generalClinicalSafety.concentrationTested === null || this.RCRRequest.AssessmentInformation.generalClinicalSafety.concentrationTested === undefined) {
                        $scope.AIFlag = false;
                    } else {
                        $scope.AIFlag = true;
                    }
                } else if (this.RCRRequest.AssessmentInformation.generalClinicalSafety.fragrance.toUpperCase() === "MODIFIED" || this.RCRRequest.AssessmentInformation.generalClinicalSafety.fragrance.toUpperCase() === "NOVEL") {
                    $scope.AIFlag = true;
                } else {
                    $scope.AIFlag = false;
                }
                //$scope.AIFlag = true;
            }
        };
        /*******************************************************************Validation Ends*****************************************************************************/
        $scope.startDateBeforeRender = function($dates) {
            const todaySinceMidnight = new Date();
            todaySinceMidnight.setUTCHours(0, 0, 0, 0);
            $dates.filter(function(date) {
                return date.utcDateValue < todaySinceMidnight.getTime();
            }).forEach(function(date) {
                date.selectable = false;
            });
        };
    }
]);


app.directive("createrequestSection", ["$templateCache",
    function($templateCache) {
        return {
            scope: false,
            templateUrl: "/cg510_rcr_createrequest/Core/html/createRequest.xhtml"
        };
    }
]);