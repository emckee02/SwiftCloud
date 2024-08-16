# SwiftCloud API
This REST API has been developed using Node.js, Express and MongoDB. It has been hosted through the Google Cloud Platform.  

## Documentation
API documentation accessible at https://documenter.getpostman.com/view/30249532/2sA3s7kV55

## Installing and Running Locally
1. Clone this repository into your local machine
2. Install dependencies 

`npm install or npm i`

3. Run the development server

`npm run dev`

## Next Steps
1. Enable users to create a user account so they can login and add reviews to specific songs. Store user data in a different MongoDB collection called 'users'. Users would have to send JWT along with requests to endpoints that require authentication. 
2. Allow users to fetch songs that have the best reviews.
3. Allow users to create a playlist of their favourite songs (add and delete functionality).

## Author
Elliott McKee