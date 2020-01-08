let express = require('express');
// Create router
let router = express.Router();
// Create jsonwebtoken
const jwt = require('jsonwebtoken');

// Checks server api token.
let checkApiToken = (request, response, next) => {
    // Get apiServerToken from request
    let apiServerToken = request.params.apiServerToken;
    // Response object
    let responseObject = {
        response: request.statusCodes.error
    }
    // If apiServerToken isn't correct
    if (apiServerToken != request.config.serverAPIToken) {
        // Send unauthorized status and the responseObject
        return response.status(request.statusCodes.http.Unauthorized).send(responseObject);
    }
    next();
}

// Not ideal because of exact repeat of /routes/admin.js code for checking admin.
let checkIsAdmin = async (request, response, next) => {
    let token = request.cookies['token'];

    if (!token) {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }
    let decoded;
    try {
        decoded = await jwt.verify(token, request.config.jwtkey);
    } catch (error) {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }

    if (decoded.role != 'admin') {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }
    next();
};

// Not ideal because of exact repeat of /routes/admin.js code for checking admin.
let checkIsUser = async (request, response, next) => {
    let token = request.cookies['token'];

    if (!token) {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }
    let decoded;
    try {
        decoded = await jwt.verify(token, request.config.jwtkey);
    } catch (error) {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }
    request.userData = decoded;
    next();
};

// Root route
router.get('/', (request, response, next) => {

    // Get database pool
    let pool = request.db;
    // create response object
    let responseObject = {
        response: request.statusCodes.ok
    };
    // query all restaurants
    let sql = `SELECT r.id, r.address, r.city, r.country, r.avatar, r.restaurantsName as restaurantName, SUM(re.rating)/count(re.rating) as TotalRating, 
    (SELECT GROUP_CONCAT(g.genreName SEPARATOR ', ')
    FROM generRestaurant gr
    LEFT JOIN genres g ON g.id = gr.gener_id
    WHERE  gr.restaurants_id = r.id
    ) as genre
    FROM restaurants r
    Left join reviews re ON re.restaurant_id = r.id
    GROUP By r.id
    ORDER BY TotalRating DESC `;
    pool.query(sql, (error, results, fields) => {
        // if we got an error
        if (error) {
            // set error code as response
            responseObject.response = request.statusCodes.error;
            // set result to error
            results = error;
        }
        // set results to the responseObject
        responseObject.result = results
        // send responseObject to client.
        return response.status(request.statusCodes.http.Ok).send(responseObject);
    });
});

router.get('/emailExist/:emailToCehck', (request, response) => {
    let emailToCehck = request.params.emailToCehck;

    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.ok
    };

    pool.query(`
    SELECT 1
    FROM users 
    WHERE users.email = ?`,
        [emailToCehck],
        (error, results) => {
            if (error) {
                responseObject.response = request.statusCodes.error;
                responseObject.result = error;
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }

            if (results.length == 0) {
                responseObject.result = {
                    exist: false
                };
            } else {
                responseObject.result = {
                    exist: true
                };
            }

            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

// get reviews
router.get('/getReviews/:id', (request, response) => {
    let id = request.params.id;

    let responseObject = {
        response: request.statusCodes.error
    };
    // make sure it's an number we are dealing with.
    if (!Number(id)) {
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }

    let pool = request.db;

    pool.query(`
    SELECT rv.id,rv.user_id, rv.text, rv.rating, r.restaurantsName 
    FROM restaurants r 
    LEFT JOIN reviews rv ON r.id = rv.restaurant_id 
    WHERE r.id = ?;`, [id], (error, results) => {
        if (error) {
            responseObject.result = error;
            return response.status(request.statusCodes.http.BadRequest).send(responseObject);
        }
        if (results.length == 0) {
            responseObject.result = "No object found";
            return response.status(request.statusCodes.http.BadRequest).send(responseObject);
        }
        responseObject.response = request.statusCodes.ok
        responseObject.result = {
            reviews: results,
            restaurantName: results[0].restaurantsName
        }
        return response.status(request.statusCodes.http.Ok).send(responseObject);
    });

});

// Create a new account
router.post('/createNewAccount/:apiServerToken', checkApiToken, (request, response) => {
    let {
        email,
        password
    } = request.body;

    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    pool.query(`
    INSERT INTO users (email,password)
    VALUES (?,?)
    `, [email, password],
        (error, results) => {
            if (error) {
                responseObject.result = error;
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            responseObject.response = request.statusCodes.ok;
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

// Token Refresh route.
router.get('/tokenRefresh', (request, response, next) => {
    let token = request.cookies['token'];
    jwt.verify(token, request.config.jwtkey, (err, decoded) => {
        // if we got an error
        if (err) {
            response.status(request.statusCodes.http.Unauthorized).send({
                response: request.config.error,
                result: "Not allowed!"
            });
            return;
        }
        console.log(decoded);
        let tokenData = decoded.tokenData
        const token = jwt.sign({
            tokenData
        }, request.config.jwtkey, {
            algorithm: 'HS256',
            // expires require data to be number and not string.
            expiresIn: request.config.jwtexpirySeconds
        });

        response.cookie('token', token, {
            maxAge: request.config.jwtexpirySeconds * 1000,
            httpOnly: true
        });

        return response.status(request.statusCodes.http.Ok).send({
            response: request.statusCodes.ok
        });
    });
});

router.get('/verifyToken', async (request, response) => {
    let token = request.cookies['token'];

    let responseObject = {
        response: request.statusCodes.error
    }
    if (!token) {
        return response.status(request.statusCodes.http.Unauthorized).send(responseObject);
    }
    let decoded;
    try {
        decoded = await jwt.verify(token, request.config.jwtkey);
    } catch (error) {
        responseObject.result = error.message;
        return response.status(request.statusCodes.http.Unauthorized).send(responseObject);
    }
    responseObject.response = request.statusCodes.ok;
    if (decoded.role == 'admin') {
        responseObject.result = {
            isAdmin: true
        };
    }
    response.status(200).send(responseObject);
});

router.get('/logout', (request, response) => {
    response.cookie('token', '', {
        maxAge: Date.now(0)
    });
    response.status(request.statusCodes.http.Ok).send({
        response: request.statusCodes.ok
    });
});

// Send password requirements.
router.get('/passwordRequirements', (request, response) => {
    let responseObject = {
        passwordComplexity: request.config.passwordComplexity.source,
        passwordMinimumLength: request.config.passwordMinimumLength,
        passwordComplexityMessage: request.config.passwordComplexityMessage
    };

    response.status(request.statusCodes.http.Ok).send(responseObject);
});

// get password hash from email
router.get('/getPasswordHash/:apiServerToken/:email', checkApiToken, (request, response) => {
    // Get email from uri
    let email = request.params.email;
    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find user email
    pool.query(`
    SELECT password
    FROM users 
    WHERE users.email = ?`,
        [email],
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    password: false
                }
            } else {
                // Change response to OK.
                responseObject.response = request.statusCodes.ok;
                // Respond the password hash.
                responseObject.result = {
                    password: results[0].password
                };
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

router.get('/getUserData/:apiServerToken/:email', checkApiToken, (request, response) => {
    let email = request.params.email;

    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find user email
    pool.query(`
    SELECT u.id,r.role
    FROM users u
    LEFT JOIN userRole ur ON u.id = ur.user_id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE u.email = ?`,
        [email],
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    found: false
                }
            } else {
                // Change response to OK.
                responseObject.response = request.statusCodes.ok;
                // Respond the password hash.
                responseObject.result = {
                    found: true,
                    id: results[0].id,
                    role: results[0].role
                };
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

router.get('/restaurantById/:id', (request, response) => {
    let id = request.params.id;

    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find user email
    pool.query(`
    SELECT *
    FROM restaurants r
    WHERE r.id = ?`,
        [id],
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    found: false
                }
            } else {
                // Change response to OK.
                responseObject.response = request.statusCodes.ok;

                let data = results[0];
                responseObject.result = {
                    found: true,
                    restaurantName: data.restaurantsName,
                    country: data.country,
                    city: data.city,
                    address: data.address
                };
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});


router.get('/genersById/:id', (request, response) => {
    let id = request.params.id;

    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find gener based of restaurant id
    pool.query(`
    SELECT gr.gener_id, g.genreName
    FROM generRestaurant gr
    LEFT JOIN genres g ON g.id = gr.gener_id
    WHERE gr.restaurants_id = ?`,
        [id],
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    found: false
                }
            } else {
                // Change response to OK.
                responseObject.response = request.statusCodes.ok;

                responseObject.result = {
                    found: true,
                    geners: []
                };
                for (let index in results) {
                    responseObject.result.geners.push(results[index]);
                }
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

router.get('/allGeners', (request, response) => {

    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find all genres
    pool.query(`
    SELECT *
    FROM genres g`,
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    found: false
                }
            } else {
                // Change response to OK.
                responseObject.response = request.statusCodes.ok;

                responseObject.result = {
                    found: true,
                    geners: []
                };
                for (let index in results) {
                    responseObject.result.geners.push(results[index]);
                }
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});


router.put('/updateRestaurant/:id', checkIsAdmin, async (request, response) => {
    let restaurantId = request.params.id;

    let responseObject = {
        response: request.statusCodes.error
    };

    if (!Number(restaurantId)) {
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }
    let data = request.body;

    for (let index in data) {
        if (data[index].length == 0) {
            responseObject.result = {
                message: "You can't post empty data!"
            };
            return response.status(request.statusCodes.http.BadRequest).send(responseObject);
        }
    }

    let pool = request.db;

    // Delete geners from restaurant id
    pool.query(`
    DELETE FROM generRestaurant
    WHERE restaurants_id = ?;
    `, [restaurantId]);

    pool.query(`
    UPDATE restaurants
    SET restaurantsName = ?, country = ?, city = ?, address = ?
    WHERE id = ?
    `, [data.restaurantName, data.country, data.city, data.address, restaurantId]);
    let sqlData = [];
    for (let generId of data.geners) {
        sqlData.push([Number(generId), Number(restaurantId)]);
    }


    pool.query(`
    INSERT INTO generRestaurant (
        gener_id,
        restaurants_id
    )
    VALUES ?
    `, [sqlData], (error, resutls) => {
        if (error) {
            responseObject.error = "SQL-Error!";
            return response.status(request.statusCodes.http.BadRequest).send(responseObject)
        }
        responseObject.response = request.statusCodes.ok;
        responseObject.result = "Successfully updated restaurant.";


        return response.status(request.statusCodes.http.Ok).send(responseObject);
    });

});

router.delete('/deleteRestaurant/:id', checkIsAdmin, async (request, response) => {
    let restaurantId = request.params.id;

    let responseObject = {
        response: request.statusCodes.error
    };

    if (!Number(restaurantId)) {
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }

    let pool = request.db;

    pool.query(`
    DELETE r, gr,re
    FROM restaurants r
    left JOIN generRestaurant gr ON gr.restaurants_id = r.id
    left JOIN reviews re ON re.restaurant_id = r.id
    WHERE r.id = ?;
    `, [restaurantId], (error, result) => {
        if (error) {
            responseObject.error = "SQL-Error!";
            return response.status(request.statusCodes.http.BadRequest).send(responseObject)
        }
        console.log(result);
        responseObject.response = request.statusCodes.ok;
        responseObject.result = "Successfully removed restaurant.";

        return response.status(request.statusCodes.http.Ok).send(responseObject);
    })
});


router.post('/addRestaurant', checkIsAdmin, async (request, response) => {

    let responseObject = {
        response: request.statusCodes.error
    };

    let data = request.body;

    for (let index in data) {
        if (data[index].length == 0) {
            responseObject.result = {
                message: "You can't post empty data!"
            };
            return response.status(request.statusCodes.http.BadRequest).send(responseObject);
        }
    }

    let pool = request.db;

    pool.query(`
    INSERT INTO restaurants (restaurantsName,country,city,address,avatar)
    VALUES (?, ?, ?, ?, ?);
    `, [data.addRestaurantName2, data.addCountry2, data.addCity2, data.addAddress2,'/images/default_avatar.png'],
        (error, result) => {
            if (error) {
                responseObject.error = "SQL-Error!";
                responseObject.errorMessage = error;
                return response.status(request.statusCodes.http.BadRequest).send(responseObject)
            }

            let restaurantId = result.insertId;

            let sqlData = [];
            for (let generId of data.geners) {
                sqlData.push([Number(generId), Number(restaurantId)]);
            }

            pool.query(`
                INSERT INTO generRestaurant (
                gener_id,
                restaurants_id
                )
                VALUES ?
                `, [sqlData], (error, resutls) => {
                if (error) {
                    responseObject.error = "SQL-Error!";
                    responseObject.errorMessage = error;
                    return response.status(request.statusCodes.http.BadRequest).send(responseObject)
                }
                responseObject.response = request.statusCodes.ok;
                responseObject.result = "Successfully added restaurant.";
                return response.status(request.statusCodes.http.Ok).send(responseObject);
            });

        });
});

// Post user rating
router.post('/postRating/:restaurantId', checkIsUser, (request, response) => {
    let restaurantId = request.params.restaurantId;

    let responseObject = {
        response: request.statusCodes.error
    };

    if (!Number(restaurantId)) {
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }

    let data = request.body;

    for (let index in data) {
        if (data[index].length == 0) {
            responseObject.result = {
                message: "You can't post empty data!"
            };
            return response.status(request.statusCodes.http.BadRequest).send(responseObject);
        }
    }

    let pool = request.db;

    pool.query(`
    INSERT INTO reviews
    (text, user_id,restaurant_id,rating)
    VALUES (?, ?, ?, ?)
    `, [data.reviewText, request.userData.id, Number(restaurantId), data.rating], (error, result) => {
        if (error) {
            responseObject.error = "SQL-Error!";
            responseObject.errorMessage = error;
            return response.status(request.statusCodes.http.BadRequest).send(responseObject)
        }
        responseObject.response = request.statusCodes.ok;
        responseObject.result = "Successfully added review.";
        return response.status(request.statusCodes.http.Ok).send(responseObject);
    })
});

// Get top 10 restaurants
router.get('/top10', (request, response) => {

    let responseObject = {
        response: request.statusCodes.error
    };

    let pool = request.db;
    pool.query(`
    SELECT r.id, r.address, r.city, r.country, r.avatar, r.restaurantsName as restaurantName, SUM(re.rating)/count(re.rating) as TotalRating, 
    (SELECT GROUP_CONCAT(g.genreName SEPARATOR ', ')
    FROM generRestaurant gr
    LEFT JOIN genres g ON g.id = gr.gener_id
    WHERE  gr.restaurants_id = r.id
    ) as genre
    FROM restaurants r
    Left join reviews re ON re.restaurant_id = r.id
    GROUP By r.id
    ORDER BY TotalRating DESC 
    LIMIT 10;
    `, (error, result) => {
        if (error) {
            responseObject.error = "SQL-Error!";
            responseObject.errorMessage = error;
            return response.status(request.statusCodes.http.BadRequest).send(responseObject)
        }
        responseObject.response = request.statusCodes.ok;
        // set results to the responseObject
        responseObject.result = result
        // send responseObject to client.
        return response.status(request.statusCodes.http.Ok).send(responseObject);

    });

});

router.get('/restaurantsByGener/:id', (request, response) => {
    let generId = request.params.id;

    let responseObject = {
        response: request.statusCodes.error
    };

    let pool = request.db;

    pool.query(`
    SELECT r.id, r.address, r.city, r.country, r.avatar, r.restaurantsName as restaurantName, SUM(re.rating)/count(re.rating) as TotalRating, 
    (SELECT GROUP_CONCAT(g.genreName SEPARATOR ', ')
    FROM generRestaurant gr
    LEFT JOIN genres g ON g.id = gr.gener_id
    WHERE  gr.restaurants_id = r.id
    ) as genre
    FROM generRestaurant gr
    LEFT join reviews re ON re.restaurant_id = gr.restaurants_id
    LEFT JOIN restaurants r ON r.id = gr.restaurants_id
    WHERE gr.gener_id = ?
    GROUP By r.id
    `,[generId], (error,result) => {
        if (error) {
            responseObject.error = "SQL-Error!";
            responseObject.errorMessage = error;
            return response.status(request.statusCodes.http.BadRequest).send(responseObject)
        }

        responseObject.response = request.statusCodes.ok;
        // set results to the responseObject
        responseObject.result = result
        // send responseObject to client.
        return response.status(request.statusCodes.http.Ok).send(responseObject);

    });

});

module.exports = router;