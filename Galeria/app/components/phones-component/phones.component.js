(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("phones", {
        templateUrl: "/components/phones-component/phones.component.html",
        controllerAs: "model",
        controller: ["arrayService", phonesController],
        bindings: {
            "phones": "="
        }
    });

    function phonesController(arrayService) {
        var model = this;

        model.$onInit = function () {
            // Whenever the phones binding is not present, it will create an array with an empty phone.
            if ((!model.phones) || (model.phones.length === 0)) {
                model.phones = [""];
            }
        };

        // Updates the value for a specific phone in the array.
        model.savePhone = function (index, phone) {
            model.phones[index] = phone;
        };

        // Removes the selected phone from the array, the display is updated by removing an input.
        model.removeNewClientPhone = function (index) {
            if (model.phones.length === 1) {
                arrayService.pop("error",
                    true,
                    "Debe ingresar al menos un numero de telefono...",
                    // Sets the custom action to perform when deleting phone numbers.
                    function () { },
                    function () { },
                    model);
                $('#myPhonesModal').modal('show');
            }
            else {
                model.phones.splice(index, 1);
            }
        };

        // Adds a new empty string to the phones array in order to display a new input.
        model.addNewClientPhone = function () {
            if (model.phones[model.phones.length - 1] === "") {
                arrayService.pop("error",
                    true,
                    "Debe proveer primero el telefono anterior.",
                    function () { },
                    function () { },
                    model);
            }
            else {
                model.phones.push("");
            }
        };

        model.format = function (index) {
            if (model.phones[index]) {
                var phone = model.phones[index];
                phone = phone.split("-").join("");

                phone = String(phone).replace(/(\d)(?=(\d\d\d\d)+(?!\d))/g, "$1-");
                model.phones[index] = phone;
            }
        };

        model.supressKeys = function ($event, index) {
            if (model.phones[index] && model.phones[index].length > 8) {
                // Backspace and Delete keys.
                if ($event.keyCode !== 8 && $event.keyCode !== 46) {
                    $event.preventDefault();
                }
            }
            else {
                // Number keys.
                if (($event.keyCode < 48) || ($event.keyCode > 57)) {
                    // Backspace and Delete keys.
                    if ($event.keyCode !== 8 && $event.keyCode !== 46) {
                        $event.preventDefault();
                    }
                }
            }
        };

    }
}());