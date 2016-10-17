(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating art-calculator component...");
    module.component("artCalculator", {
        templateUrl: "/components/calculator/art-calculator.component.html",
        controllerAs: "model",
        controller: ["calculator", artCalculatorController]
    });

    function artCalculatorController(calculator) {

        var model = this;

        model.$onInit = function () {
            model.arts = ["Bastidor", "Corriente", "Oleo"];

            model.selectedArt = "Bastidor";

            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            model.products = calculator.generateCalculators(model.selectedArt);
        };

        // Whenever a new type is selected the calculator set must be refreshed.
        model.renderCalculators = function () {
            model.products = calculator.generateCalculators(model.selectedArt);
        };

        model.totals = function () {
            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            model.products.forEach(function(product){
                model.subtotal += product.total;
                model.others = model.subtotal * 0.1;
                model.productTotal = model.subtotal + model.others; 
            });
        };
    }

} ());