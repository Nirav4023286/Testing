describe('createrequest', function() {
    var result, $state, $stateParams;
    beforeEach(module('app'));
    beforeEach(module('app.createRequestController'));
    beforeEach(module('app.createRequestService'));
    beforeEach(module('app.formulationReviewController'));
    beforeEach(function() {
        Dependency = {
            getSomething: function() {
                return 'mockReturnValue';
            }
        };
        module(function($provide) {
            $provide.value('breadcrumbProvider', Dependency);
            $provide.value('$http', Dependency);
            $provide.value('$window', Dependency);
            $provide.value('$rootScope', Dependency);
            $provide.value('commonUtils', Dependency);
            $provide.value('filterProvider', Dependency);
            $provide.value('createRequestProvider', Dependency);
            $provide.value('tileProvider', Dependency);

        });
    });
    beforeEach(inject(function(_$state_, _$stateParams_) {
        $state = _$state_;
        $stateParams = _$stateParams_;

        result = {
            reload: true,
            inherit: false,
            notify: true
        };
    }));
    it('service to be executed', inject(function(createRequestService) {
        expect(createRequestService.useDependency()).toBe('mockReturnValue');
    }));

    it('code should get executed', function() {
        expect($state).toBe(result);
    });
});