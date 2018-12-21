# Pickin' Porch
## A Full Stack React / GraphQL ECommerce App
<img src="https://pngimage.net/wp-content/uploads/2018/06/react-png-1.png" alt="react.js" width="75"/>  <img src="https://seeklogo.com/images/N/next-js-logo-7929BCD36F-seeklogo.com.png" alt="next.js" width="100"/>  <img src="https://seeklogo.com/images/A/apollo-logo-DC7DD3C444-seeklogo.com.png" alt="apollo" width="70"/><img src="https://montykamath.files.wordpress.com/2018/02/graphql.png" alt="graphql" width="75"/><img src="https://camo.githubusercontent.com/389368863d9b9df25acd07644bad7642459c3533/68747470733a2f2f696d6775722e636f6d2f5376366a3042362e706e67" alt="graphql-yoga" width="75"/><img src="https://software.intel.com/sites/default/files/managed/fa/a0/Runtime-logo-Node.jpg" alt="node.js" width="75"/><img src="https://camo.githubusercontent.com/c7f49c483a3c5a145ff55c7331520a65e12abff2/68747470733a2f2f692e696d6775722e636f6d2f774434725674342e706e67" alt="prisma" width="150"/>

### Frontend: 
* React, Next.js, ApolloClient, Styled Components
### Backend: 
* GraphQL Yoga (An Express-based server for GraphQL), Prisma (database server)

**This website is themed as a guitarist/musician's equipment website.**

![](https://github.com/ScottMorse/PickinPorchDev/blob/master/gifs/Shop.gif)

**Users can sign up to sell (vendor option) or buy products.  They must enter a secure password and username. I made sure to check this on both client and server side with regular expressions.  They then need to verify their account with an email that uses a JWT in order to access unlock the permissions to sell or buy.**

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
