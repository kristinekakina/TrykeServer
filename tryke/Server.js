const http = require('http');

const server = http.createServer((req, res) => {
    // Set the response headers

    // this header shows the type of content that will be allowed in the server.
    res.setHeader('Content-Type', 'text/plain');

    // Access-Control-Allow-Origin allows to control which origins can access the server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // printing to console when request is recieved
    console.log('Request Received');

    // request method
    if (req.method === 'POST') {
        let body = '';

        // To process the data as a whole we group the data into grouped_data
        req.on('data', grouped_data => {
            body += grouped_data.toString();
        });

        // Process the accumulated data when the request ends
        req.on('end', () => {
            // Checking the token header
            const authToken = req.headers['auth-token'];
            if (authToken === 'tumaAuthToken') {
                // Parse the request body as JSON
                const data = JSON.parse(body);

                // Check the 'stringArray' in the request body
                const stringArray = data.stringArray;
                if (
                    Array.isArray(stringArray) &&
                    stringArray.includes('tuma') &&
                    stringArray.includes('delivery') &&
                    stringArray.includes('services')
                ) {
                    res.statusCode = 200;
                    res.end('Criteria Passed');
                } else {
                    // Failed response when the string arrays in the body are correct
                    res.statusCode = 400;
                    res.end('Criteria Failed');
                }
            } else {
                // Failed response for tokens
                res.statusCode = 400;
                res.end('Criteria Failed');
            }
        });
    } else {
        // Error when the method is not POST
        res.statusCode = 405;
        res.end('Method Used Is Not Allowed');
    }
});

// Start the server on port 3000

server.listen(3000, () => {
    console.log('Server started on port 3000');
});

