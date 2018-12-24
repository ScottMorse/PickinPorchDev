# <a target="_blank" href="https://pickinporch.herokuapp.com">Pickin' Porch</a>

## A Full Stack React / GraphQL ECommerce App
<img src="https://pngimage.net/wp-content/uploads/2018/06/react-png-1.png" alt="react.js" width="75"/>  <img src="https://seeklogo.com/images/N/next-js-logo-7929BCD36F-seeklogo.com.png" alt="next.js" width="100"/>  <img src="https://seeklogo.com/images/A/apollo-logo-DC7DD3C444-seeklogo.com.png" alt="apollo" width="70"/><img src="https://montykamath.files.wordpress.com/2018/02/graphql.png" alt="graphql" width="75"/><img src="https://camo.githubusercontent.com/389368863d9b9df25acd07644bad7642459c3533/68747470733a2f2f696d6775722e636f6d2f5376366a3042362e706e67" alt="graphql-yoga" width="75"/><img src="https://software.intel.com/sites/default/files/managed/fa/a0/Runtime-logo-Node.jpg" alt="node.js" width="75"/><img src="https://camo.githubusercontent.com/c7f49c483a3c5a145ff55c7331520a65e12abff2/68747470733a2f2f692e696d6775722e636f6d2f774434725674342e706e67" alt="prisma" width="150"/>

### Frontend: 
* React, Next.js, ApolloClient, Styled Components

The front end is based in React entirely.  Next.js is a popular framework for server-side rendering React, and it allows for efficient navigation within the site, and includes features such as a router and links which can over-eagerly load pages.  The Apollo Client allows for both local state/cache management and communicating queries and mutations to the GraphQL Yoga backend.  The Styled Components libary is the primary tool for styling.

### Backend: 
* GraphQL Yoga, Prisma

The Prisma service is the home of the database for the app, which is based in PostgreSQL, but is handled by the GraphQL language.  Prisma allows for basic CRUD operations in GraphQL on each type defined in the datamodel supplied for the DB.  GraphQL Yoga then is used to run an Express-based server which can communicate with the Prisma endpoint.  

While Prisma defines basic database operations, a schema has to be written in GraphQL for the Yoga server, along with "resolvers", to fully define the queries and mutations that will be used by the application.  This is done by creating a named operation in a GraphQL Schema, which identifies any required/optional arguments and the type that can be returned, and a resolver must be written which will often combine a Prisma operation with the arguments supplied, and return a result to the client.

**This website is themed as a guitarist/musician's equipment website.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/Shop.gif)

**Users can sign up to sell (vendor option) or buy products.  They must enter a secure password and username. I made sure to check this on both client and server side with regular expressions.  They then need to verify their account with an email that uses a JWT in order to access the permissions to sell or buy.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/SignUp.gif)

**A User can check out using the Stripe API.  This would charge a credit card, and the order is placed on the server.  The user can both see all their orders, and they receive an order confirmation email.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/Checkout.gif)

**Any user can also request to reset their password via email.  Both verification and reset emails can be resent if needed.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/Reset.gif)

**Vendors can add a product with an image, which they can then keep track of.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/AddProduct.gif)

**Vendors can see their total revenue of the past year by the month, and on the item page for any item which they specifically put up for sale, they can see sales data on that particular product.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/SalesData.gif)

**This website is mobile responsive.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/Mobile.gif)

*I need to give a shout out to Wes Bos for his information on how to set up a project with these technologies.  This was the springboard for this application.*
