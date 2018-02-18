var app = angular.module('app', []);
app.service("inputRequest", ["$window", function($window) {
    //	sonarQube fixes
    //	var requestObj = {
    //			
    //	};
    // var requestObjects = {
    // 	"RequestInformation" : {
    // 		"RCR_ID":"",
    // 		"reviewType":"",
    // 		"otherSubtype":"",
    // 		"requestNo":"",
    // 		"submittedDate":null,
    // 		"dueDate":null,
    // 		"isRnD":"",
    // 		"projectName":"",
    // 		"projectStatus":"",
    // 		"region":"",
    // 		"leadRegion":"",
    // 		"additionalRegion":[],
    // 		"directImport":"",
    // 		"productDevelopment":"",
    // 		"franchise":"",
    // 		"Brand":[],
    // 		"isFavorite":"",
    // 		"createdDate":""
    // 	},		
    // 	"AssessmentInformation" : {
    // 		"assessmentType":"",
    // 		"assessmentSubType":"",
    // 		"generalClinicalSafety":{
    // 			"RCR_ID":"",
    // 			"GeneralClinicalSafetyID":"",
    // 			"RequestInformtionID":"",
    // 			"formulationReviewType":"",
    // 			"humanTesting":"",
    // 			"lengthOfStudy":"",
    // 			"formulaIDNumber":"",
    // 			"labNotebookNumber":"",
    // 			"productName":"",
    // 			"preAssessment":"",
    // 			"productType":"",
    // 			"endUser":"",
    // 			"safetyRelatedClaims":[],
    // 			"otherSafetyRelatedClaims":"",
    // 			"similarProducts":"",
    // 			"associatedChassis":"",
    // 			"associatedAPR":"",
    // 			"newINCItoJnJ":"",
    // 			"tradeName":"",
    // 			"safetyTesting":"",
    // 			"fragrance":"",
    // 			"rtrNumber":[],
    // 			"concentrationTested":"",
    // 			"safetyReports":{},
    // 			"attachments":[],
    // 		}
    // 	},
    // 	"AcknowledgeInfoCA":{
    // 		"commitmentDate":"",
    // 		"comment":"",
    // 		"isACKCA":"",
    // 		"typeOfTests":[],
    // 		"bigDataComplaint":"",
    // 		"escalationRequired":"",
    // 		"reasonsForEscalation":"",
    // 		"safetyBackground":"",
    // 		"commentBackground":""
    // 	},
    // 	"AcknowledgeInfoLR":{
    // 		"commitmentDate":"",
    // 		"comment":"",
    // 		"isACKLR":"",
    // 		"commentBackground":""
    // 	},
    // 	"Requestor" : {
    //    		 "displayName" : "",
    // 	     "userId" : "",
    // 	     "email" : "",
    // 	     "firstName" :"",
    // 	     "lastName" : "",
    // 	     "ntId" : "",
    // 	     "region":"",
    // 	     "roles" : []
    //    	},
    //    	"ClinicalAssessor":{
    // 		"displayName" : "",
    // 	    "userId" : "",
    // 	    "email" : "",
    // 	    "firstName" : "",
    // 	    "lastName" : "",
    // 	    "ntId" : "",
    // 	    "region":"",
    // 	    "roles" : []
    // 	},
    // 	"ClinicalCoordinator" : {
    //    		 "displayName" : "",
    // 	     "userId" : "",
    // 	     "email" : "",
    // 	     "firstName" :"",
    // 	     "lastName" : "",
    // 	     "ntId" : "",
    // 	     "region":"",
    // 	     "roles" : []
    // 	},
    // 	"ClinicalLeadReviewer": {
    // 		"displayName" : "",
    // 		"userId" : "",
    // 	    "email" : "",
    // 	    "firstName" : "",
    // 	    "lastName" : "",
    // 	    "ntId" : "",
    // 	    "region":"",
    // 	    "roles" : []
    // 	}
    // 	};
    var requestObjects = {
        "RequestInformation": {
            "RCR_ID": "",
            "reviewType": "",
            "otherSubtype": "",
            "requestNo": "",
            "submittedDate": null,
            "dueDate": null,
            "isRnD": "",
            "projectName": "",
            "previousStatus": "",
            "projectStatus": "",
            "region": "",
            "leadRegion": "",
            "additionalRegion": [],
            "directImport": "",
            "productDevelopment": "",
            "franchise": "",
            "Brand": [],
            "isFavorite": "",
            "createdDate": ""
        },
        "AssessmentInformation": {
            "assessmentType": "",
            "assessmentSubType": "",
            "generalClinicalSafety": {
                "RCR_ID": "",
                "GeneralClinicalSafetyID": "",
                "RequestInformtionID": "",
                "formulationReviewType": "",
                "humanTesting": "",
                "lengthOfStudy": "",
                "formulaIDNumber": "",
                "labNotebookNumber": "",
                "productName": "",
                "preAssessment": "",
                "productType": "",
                "endUser": "",
                "safetyRelatedClaims": [],
                "otherSafetyRelatedClaims": "",
                "similarProducts": "",
                "associatedChassis": "",
                "associatedAPR": "",
                "newINCItoJnJ": "",
                "tradeName": "",
                "safetyTesting": "",
                "fragrance": "",
                "rtrNumber": [],
                "concentrationTested": "",
                "safetyReports": {},
                "attachments": [],
                "sofiaTestFlag": '',
                "formulaExtract": null,
                "formulaStatus": ''
            },
            "earlyClinicalSafety": {
                "RCR_ID": "",
                "RequestInformtionID": "",
                "EarlyClinicalSafetyID": "",
                "formulationReviewType": "",
                "humanTesting": "",
                "lengthOfStudy": "",
                "formulaIDNumber": "",
                "labNotebookNumber": "",
                "productName": "",
                "preAssessment": "",
                "productType": "",
                "endUser": "",
                "safetyRelatedClaims": [],
                "otherSafetyRelatedClaims": "",
                "similarProducts": "",
                "associatedChassis": "",
                "associatedAPR": "",
                "newINCItoJnJ": "",
                "tradeName": "",
                "fragrance": "",
                "rtrNumber": [],
                "safetyTesting": "",
                "concentrationTested": "",
                "safetyReports": {},
                "sofiaTestFlag": '',
                "formulaExtract": null,
                "formulaStatus": ''
            },
        },
        "AcknowledgeInfoCA": {
            "commitmentDate": "",
            "comment": "",
            "isACKCA": "",
            "typeOfTests": [],
            "bigDataComplaint": "",
            "escalationRequired": "",
            "reasonsForEscalation": "",
            "safetyBackground": "",
            "commentBackground": ""
        },
        "AcknowledgeInfoLR": {
            "commitmentDate": "",
            "comment": "",
            "isACKLR": "",
            "commentBackground": ""
        },
        "Requestor": {
            "displayName": "",
            "userId": "",
            "email": "",
            "firstName": "",
            "lastName": "",
            "ntId": "",
            "region": "",
            "roles": []
        },
        "ClinicalAssessor": "",
        "ClinicalCoordinator": "",
        "ClinicalLeadReviewer": ""
    };
    var resetRCRRequest = angular.copy(requestObjects);

    this.resetRCRRequest = function() {
        return requestObjects = angular.copy(resetRCRRequest);
    };
    this.getRequest = function() {
        return requestObjects;
    };
    this.setRequest = function(value) {
        return (requestObjects = value);
    };
}]);