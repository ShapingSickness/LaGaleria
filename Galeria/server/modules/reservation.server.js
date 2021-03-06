// References the schema for reservation
var ReservationSchema = require("../schemas/reservation.schema.js");

var newReservation = function (req, res) {

    // Creates an instance of the reservation schema with the data from the request body.
    var reservation = new ReservationSchema({
        client: req.body.client,
        invoice: req.body.invoice,
        date: req.body.date,
        delivery: req.body.delivery,
        price: req.body.price,
        articles: req.body.articles,
        advances: req.body.advances,
        orders: req.body.orders,
        description: req.body.description,
        complete: req.body.complete
    });

    // Executes the save command to Mongo.
    reservation.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

var updateReservation = function (req, res) {
    // Query to select the appropriate provider by id.
    var query = {
        _id: req.body._id
    };

    // New data to be updated.
    var newData = {
        client: req.body.client,
        invoice: req.body.invoice,
        date: req.body.date,
        delivery: req.body.delivery,
        price: req.body.price,
        description: req.body.description,
        complete: req.body.complete,
        articles: req.body.articles,
        advances: req.body.advances,
        orders: req.body.orders
    };

    // Update executed according to query, new data, only one row.
    ReservationSchema.update(query, newData, { multi: false },
        function (err, numAffected) {
            res.send({ results: req.body, errors: err });
            res.end();
        });
};


module.exports.save = function (req, res) {
    // If the id parameter exists in the body, call update, else create a new record.
    if (req.body._id) {
        updateReservation(req, res);
    } else {
        newReservation(req, res);
    }
};

var nextOrders = function (req, res) {
    // Creates a new query to find all reservations and sort them ascendingly.
    // The $not operator selects the opposite of the following expression. 
    // The $size operator applies to the array length.
    var query = ReservationSchema.find({
        orders: { $ne: null, $not: { $size: 0 } }
    });

    query.sort({ delivery: "ascending" });

    // Executes the find query.
    query.exec(function (err, results) {

        var filteredResults = [];
        results.forEach(function (reservation) {
            reservation.advances.forEach(function (advance) {
                reservation.price -= advance.amount;
            });

            if (reservation.price > 0) {
                reservation.price = reservation.price.toFixed(2);
                filteredResults.push(reservation);
            }
        });
        res.send({ results: filteredResults, errors: err });
        res.end();
    });
};

var pendingRemaining = function (req, res) {
    // Creates a new query to find all reservations and sort them ascendingly.
    var query = ReservationSchema.find();

    query.sort({ date: "ascending" });

    // Executes the find query.
    query.exec(function (err, results) {

        var filteredResults = [];
        results.forEach(function (reservation) {
            // Filters out reservations without advances, but this will also filter out orders, 
            // and orders might not have advances and still have remaining.
            if ((reservation.advances && reservation.advances.length > 0) || (reservation.orders && reservation.orders.length > 0)) {
                reservation.advances.forEach(function (advance) {
                    reservation.price -= advance.amount;
                });

                if (reservation.price > 0) {
                    reservation.price = reservation.price.toFixed(2);
                    filteredResults.push(reservation);
                }
            }
        });
        res.send({ results: filteredResults, errors: err });
        res.end();
    });

};

var list = function (req, res) {
    // Creates a new query to find all reservations and sort them ascendingly.
    var query = ReservationSchema.find();

    // If the reservations have to be filtered by client id.
    if (req.query._id) {
        query.where('client').equals(req.query._id);
    }

    query.sort({ date: "ascending" });

    // Executes the find query.
    query.exec(function (err, results) {
        results.forEach(function (reservation) {
            reservation.advances.forEach(function (advance) {
                reservation.price -= advance.amount;
            });
            reservation.price = reservation.price.toFixed(2);
        });
        res.send({ results: results, errors: err });
        res.end();
    });
};

module.exports.list = function (req, res) {
    if (req.query.remaining) {
        pendingRemaining(req, res);
        return;
    }

    if (req.query.next) {
        nextOrders(req, res);
        return;
    }

    list(req, res);
};

module.exports.get = function (req, res) {
    //Creates a new query to find a single reservation by _id taken from the request parameters.
    var query = ReservationSchema.findById(req.params.id);

    // Executes the findById query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};