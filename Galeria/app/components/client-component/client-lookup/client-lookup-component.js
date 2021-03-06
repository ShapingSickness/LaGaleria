(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("clientLookupComponent", {
        templateUrl: "/components/client-component/client-lookup/client-lookup-component.html",
        controllerAs: "model",
        controller: ["clientService", clientLookupController],
        bindings: {
            "clientId": "="
        }
    });

    function clientLookupController(clientService) {

        var model = this;

        model.$onInit = function () {  
            //model.clientFound = false;
        };

        // When the user starts typing in the Client field, 
        // the search triggers to show matching results by name.
        model.beginClientSearch = function () {
            if (model.client !== "") {
                // Queries the client service for matching clients by name.
                clientService.find(model.client).$promise
                    .then(function (result) {
                        model.lookupClients = result.results;
                    });

                // Shows the search option for clients.
                model.lookupClient = true;
            } else {
                // If the search box is empty do not show any search options.
                model.endClientSearch();
            }
        };

        // Asigns a client when an option is clicked on the autocomplete search options.
        model.selectClient = function (id) {
            model.clientId = id;
            model.client = "";
            //model.clientFound = true;
            model.endClientSearch();
        };

        // Disable search options for clients.
        model.endClientSearch = function () {
            model.lookupClient = false;
        };
    }
} ());