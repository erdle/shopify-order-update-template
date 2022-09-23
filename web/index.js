// @ts-check
import { join } from "path";
import fs from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import 'dotenv/config'
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import { setupGDPRWebHooks } from "./gdpr.js";
import productCreator from "./helpers/product-creator.js";
import { BillingInterval } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";
import connectDatabase from './mongoDB/database.js'
import WidgitModel from "./mongoDB/Models/widgitModel.js";
import cors from "cors";

const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

console.log("SCOPES:", process.env.SCOPES);
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()
    }/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()
    }/frontend/dist/`;

const DB_PATH = `${process.cwd()
    }/database.sqlite`;


Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SCOPES.split(","),
    HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
    HOST_SCHEME: process.env.HOST.split("://")[0],
    API_VERSION: LATEST_API_VERSION,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH)
});

console.log("HOST:-", process.env.HOST.replace(/https?:\/\//, ""))
console.log("SHOPIFY_API_KEY :-", process.env.SHOPIFY_API_KEY)
console.log("API_SECRET_KEY :-", process.env.SHOPIFY_API_KEY);
console.log("HOST_SCHEME :-", process.env.HOST.split("://")[0])
console.log("PORT :-", PORT)
connectDatabase();

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/api/webhooks",
    webhookHandler: async (topic, shop, body) => delete ACTIVE_SHOPIFY_SHOPS[shop]
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
    required: false,
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    // chargeName: "My Shopify One-Time Charge",
    // amount: 5.0,
    // currencyCode: "USD",
    // interval: BillingInterval.OneTime,
};

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks("/api/webhooks");

// export for test use only
export async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === "production", billingSettings = BILLING_SETTINGS) {
    const app = express();
    app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
    app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
    app.set("use-online-tokens", USE_ONLINE_TOKENS);
    app.use(cors())
    app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
    app.use(express.urlencoded({ extended: false }));
    applyAuthMiddleware(app, { billing: billingSettings });

    // Do not call app.use(express.json()) before processing webhooks with
    // Shopify.Webhooks.Registry.process().
    // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
    // for more details.

    app.use(express.json());
    //widgit starts

    app.get(`/api/widgit`,  async (req, res) =>{

        console.log("dddddddddddddddddddddddddddddddd");
        try {
          
            const data = await WidgitModel.find();
            console.log("data",data)
    
            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false })
        }
        
    })
  
    app.post(`/api/widgit`,  async (req, res) =>{


        try {
            let settings = {
                top: 0,
                img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9iaWxlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
            }
            const data = await WidgitModel.create({position:settings.top, imageUrl: settings.img})
    
            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false })
        }
        
    })
  
    app.get(`/api/widgit/:id`,  async (req, res) =>{


        try {
          const id = req.params.id 
            const data = await WidgitModel.findById(id);
    
            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false })
        }
        
    })
    app.put(`/api/widgit/:id`,  async (req, res, next) =>{


        try {
let position = req.body.data
console.log(position);
   
//    const wid = await WidgitModel.updateOne({_id:req.params.id}, {$set:{pos2}}, {$currentDate: { lastModified: true }});
   const wid = await WidgitModel.findByIdAndUpdate(req.params.id,req.body.data,{ new:true,useFindAndModify: false, runValidators:true });
      console.log("wid", wid);
            res.status(200).json({ success: true, wid })
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false })
        }
        
    })


      //widgit ends
    app.post("/api/webhooks", async (req, res) => {
        try {
            await Shopify.Webhooks.Registry.process(req, res);
            console.log(`Webhook processed, returned status code 200`);
        } catch (e) {
            console.log(`Failed to process webhook: ${e.message
                }`);
            if (!res.headersSent) {
                res.status(500).send(e.message);
            }
        }
    });

    // All endpoints after this point will require an active session
    app.use("/api/*", verifyRequest(app, { billing: billingSettings }));


    // Products API calls starts from here
    app.get("/api/products/count", async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        const countData = await Product.count({ session });
        res.status(200).send(countData);
    });


    app.get("/api/product/:id", verifyRequest(app), async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        try {
            let id = req.params.id
            const singleProduct = await Product.find({ session, id });
            // console.log(singleProduct);
            res.status(200).send(singleProduct);
        } catch (error) {
            console.log(error);

        }
    })

    app.put("/api/product/update/:id", verifyRequest(app), async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);
        try {

            const id = req.params.id;

            const product = new Product({ session });
            product.id = id;
            console.log(req.body);
            product.handle = req.body.name;
            product.title = req.body.name;
            product.body_html = req.body.description
            product.product_type = req.body.category
            product.variants = [{
                "price": req.body.price
            },]
            product.images = [{
                "src": req.body.url

            }]

            const updatedProd = await product.save({ update: true });
            console.log(updatedProd);
            res.status(200).json({ success: true, message: "Product Updated", updatedProd });
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    })


    app.delete("/api/product/delete/:id", async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        try {
            let id = req.params.id
            const deletedProduct = await Product.delete({ session, id });
            console.log(deletedProduct);
            res.status(200).json({ success: true, message: "Product deleted successfully" })
        } catch (error) {
            console.log(error);

        }
    })


    app.get("/api/products/all", verifyRequest(app), async (req, res, next) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));


        const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        try {
            const products = await Product.all({ session });

            // console.log("allProducts", products);
            res.status(200).send(products);
        } catch (error) {
            console.log(error);
        }
    })
    app.get("/api/products/create", async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        let status = 200;
        let error = null;

        try {
            await productCreator(session);
        } catch (e) {
            console.log(`Failed to process products/create: ${e.message
                }`);
            status = 500;
            error = e.message;
        }
        res.status(status).send({
            success: status === 200,
            error
        });
    });
    app.post("/api/product/create", verifyRequest(app), async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);
        let status = 200;
        let error = null;

        try { // await productCreator(session);
            const product = new Product({ session });

            const {
                name,
                description,
                price,
                category,
                hexColor,
                url
            } = req.body;

            product.title = name;
            product.handle = name;
            product.body_html = description;
            product.product_type = category;
            product.images = [{
                "src": url
            }]
            product.variants = [{
                "price": price,
                "option1": hexColor,
                "inventory_quantity": req.body.stocks
            },]


            const productCreated = await product.save({ update: true });
            console.log(productCreated);
            res.status(200).json({ success: true, message: "Product created successfully", product: productCreated })
        } catch (e) {
            console.log(`Failed to process products/create: ${e
                }`);

        }

    });
    // Products API calls ends here


    // Orders API calls starts from here
    app.get("/api/orders/all", verifyRequest(app), async (req, res, next) => {

        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Order } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        try {
            const orders = await Order.all({ session, status: "any" });

            // console.log("allProducts", products);
            res.status(200).send(orders);
        } catch (error) {
            console.log(error);
        }
    })

    app.delete("/api/order/delete/:id", async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Order } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        try {
            let id = req.params.id
            console.log("OrderID", id);
            const deletedOrder = await Order.delete({ session, id });
            console.log(deletedOrder);
            res.status(200).json({ success: true, message: "Order deleted successfully" })
        } catch (error) {
            console.log(error);

        }
    })
    app.get("/api/order/:id", verifyRequest(app), async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Order } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);

        try {
            let id = req.params.id
            const singleOrder = await Order.find({ session, id });
            // console.log(singleProduct);
            res.status(200).json({ success: true, message: "Order found successfully", order: singleOrder });
        } catch (error) {
            console.log(error);

        }
    })


    app.put("/api/order/update/:id", verifyRequest(app), async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const { Order } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION
            }/index.js`);
        try {

            const id = req.params.id;
            const order = new Order({ session });
            order.id = id;
            order.note = req.body.note;
            order.email = req.body.email;
            order.phone = req.body.phone;


            const updatedOrder = await order.save({ update: true });
            console.log(updatedOrder);
            res.status(200).send(updatedOrder);
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    })


    // Orders API calls ends here


    // GraphQL API calls starts here


    // query
    app.get("/api/mutation/graphql/:mutation", async (req, res, next) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

        try {
            const dataQuery = req.params.mutation
            const product = await client.query({ data: dataQuery })
            console.log(product);
            res.status(200).json({ success: true, product })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error })
        }
    })

    // Get all products
    app.post("/api/graphql/new/:query", verifyRequest(app), async (req, res, next) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

        try {
            const searchData = req.params.query

            const { reverseValue, searchCategory, forwardCursor, backwardCursor, firstNumProd, lastNumProd } = req.body
            const variables = {
                "numProds": 7,
                "ForwardCursor": forwardCursor,
                "BackwardCursor": backwardCursor
            }

            console.log("FirstNumProd: " + firstNumProd);
            console.log("searchData: " + searchData);
            const product = await client.query({
                data: {
                    query: `query($numProds: Int!, $ForwardCursor: String, $BackwardCursor: String  ){
                        products(reverse:${reverseValue}, first: ${firstNumProd}, after: $ForwardCursor, last: ${lastNumProd}, before: $BackwardCursor, sortKey:${searchCategory}, ${searchData !== 'null' ? `query:"title:${searchData}"` : `query:"title:"`}){
                          edges{
                            cursor
                            node{
                                id
                                title
                                publishedAt
                                images(first: 10) {
                                    nodes {
                                      src
                                    }
                                  }
                                variants(first:3){
                                    nodes{
                                      price
                                    }
                                  }
                            }
                          }
                          pageInfo{
                            hasNextPage
                            endCursor
                            hasPreviousPage
                            startCursor
                          }
                        }
                      }`,
                    variables: variables
                }
            })

            // console.log(product.body.data.products.edges);
            res.status(200).json({ success: true, product })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error });
        }
    })

    app.get("/api/graphql/create/:id", async (req, res) => {

        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

        try {
            const id = req.params.id
            const dataQuery = `mutation {
                productCreate(input: {${id} }) {
                  product {
                    id
                  }
                }
              }`;

            const createProduct = await client.query({ data: dataQuery });

            console.log(createProduct);
            res.status(200).json({ success: true, createProduct })
        } catch (error) {
            res.status(500).json({ success: false, error })
        }
    })
    // Delete Product
    app.get("/api/graphql/delete/:id", async (req, res) => {

        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

        try {
            const id = req.params.id
            const dataQuery = `mutation {
     productDelete(input: {id: "gid://shopify/Product/${id}"})
    {
        deletedProductId
    }
    }`;

            const deleteProduct = await client.query({ data: dataQuery });

            console.log(deleteProduct);
            res.status(200).json({ success: true, deleteProduct })
        } catch (error) {
            res.status(500).json({ success: false, error })
        }

    })
    app.put("/api/graphql/update/:id", verifyRequest(app), async (req, res) => {

        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

        try {
            const id = req.params.id
            const {
                description,
                category,
                price,
                url
            } = req.body
            console.log(req.body.name)
            console.log("ID", [id, req.body.name, description, category, price, url]);
            const dataQuery = `mutation {
                productUpdate(input: {id: "gid://shopify/Product/${id}", 
                title:"${req.body.name}", 
                bodyHtml: "${description}",
                 productType: "${category}",
                 images:{src: "${url}"}, variants: {price: "${price}"}}) {
                  product {
                    id
                    title
                    bodyHtml
                    productType
                    variants(first : 10){
                        nodes{
                            price
                        }
                    }
                  }
                }
              }`;

            const updateProduct = await client.query({ data: dataQuery });

            console.log("updateProduct", updateProduct);
            res.status(200).json({ success: true, updateProduct })
        } catch (error) {
            res.status(500).json({ success: false, error })
        }

    })

    // get single product
    app.get("/api/graphql2/:id", verifyRequest(app), async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        try {
            const id = req.params.id
            const product = await client.query({
                data: `{
                product(id: "gid://shopify/Product/${id}") {
                  id
                  description
                  bodyHtml
                  productType
                  title
                    images(first: 10) {
                    nodes {
                      src
                    }
                  }
                  variants(first: 10) {
                    nodes {
                   price
                    }
                  }
                }
              }`})
            console.log(product);
            res.status(200).json({ success: true, product })

        } catch (error) {
            console.log(error);
            res.status(400).json({ success: true, error })
        }
    })


    app.get("/api/graphql", async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        try {
            const dataQuery = `{
                products (first: 10, reverse: true) {
                edges {
                    node {
                    id
                    title
                    }
                }
                }
            }`
            console.log("All products");
            const products = await client.query({ data: dataQuery })
            console.log(products);
            res.status(200).json({ success: true, products })
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: true, error })
        }
    })





    // GraphQL API calls ends here

    //GQL ORDER API starts here
    app.get('/api/graphql/orders', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));

        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        try {
            const query = `{
        orders(first: 10) {
          nodes {
            id
            name
            lineItems(first: 10) {
              nodes {
                name
                id
                fulfillmentStatus
              }
            }
            totalPrice
            fullyPaid
          }
        }
      }`
            const allOrders = await client.query({ data: query })
            res.status(200).json({ success: true, allOrders })
            console.log("Orders", allOrders.body.data.orders.nodes);
        } catch (error) {
            console.log(error);
        }
    })
    app.get('/api/graphql/orders/delete/:id', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));

        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        try {
            const id = req.params.id
            const query = `	mutation orderClose {
            orderClose(input: { id: "gid://shopify/Order/${id}"}) {
              order {
          id
              }
              userErrors {
                field
                message
              }
            }
          }`
            const allOrders = await client.query({ data: query })
            res.status(200).json({ success: true, allOrders })
            console.log("Orders", allOrders.body.data.orders.nodes);
        } catch (error) {
            console.log(error);
        }
    })
    app.get('/api/graphql/orders/:id', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));

        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        try {
            const id = req.params.id
            const query = `	{
            order(id: "gid://shopify/Order/${id}") {
              id
              closedAt
              closed
              createdAt
              lineItems(first: 10) {
                nodes {
                  name
                }
              }
            }
          }
          `
            const Order = await client.query({ data: query })
            res.status(200).json({ success: true, Order })
            console.log("Orders", Order);
        } catch (error) {
            console.log(error);
        }
    })
    //GQL ORDER API ends here

    // GraphQL Customers API starts here


    //All customers
    app.post('/api/customers/all', async (req, res, next) => {

        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        const {reverseValue,forwardCursor, searchCategory,backwardCursor, nextPage, prevPage, firstNumProd, lastNumProd} = req.body
        try {
              const variables = {
                "numProds": 6,
                "ForwardCursor": forwardCursor,
                "BackwardCursor": backwardCursor
            }
            const dataQuery = `query ($numProds: Int!, $ForwardCursor: String, $BackwardCursor: String) {
                customers(reverse: ${reverseValue},first: ${firstNumProd}, after: $ForwardCursor, last: ${lastNumProd}, before: $BackwardCursor, sortKey:${searchCategory}) {
                  edges {
                    node {
                      id
                      lastName
                      firstName
                      email
                      phone
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                    hasPreviousPage
                    startCursor
                  }
                }
              }`
            
            const data = await client.query({
                data: {
                    query: dataQuery, variables: variables
                }
            })

            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error })
            next;
        }


    })

    //customer details API
    app.get('/api/customer/:id', async (req, res, next) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session?.accessToken);
        try {
            const id = req.params.id
            const dataQuery = `{
                customer(id:"gid://shopify/Customer/${id}"){
                    id
                    firstName
                    lastName
                }
            }`
            const data = await client.query({ data: dataQuery })
            console.log(data);
            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error });
            next;
        }
    })

    // Delete customer API
    app.get('/api/customer/delete/:id', async (req, res, next) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        const id = req.params.id
        try {
            const dataQuery = `	mutation customerDelete($id: ID!) {
                customerDelete(
                  input: {
                    id: $id
                  }) {
                    shop {
                      id
                    }
                    userErrors {
                      field
                      message
                    }
                    deletedCustomerId
                    
                }
              }`;
            const variables = {
                "id": `gid://shopify/Customer/${id}`

            }
            const data = await client.query({ data: { query: dataQuery, variables: variables } })
            console.log(data);
            res.status(200).json({ success: true, data });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error });
        }
    })

    //Update customer API
    app.put(`/api/customer/update/:id`, async (req, res, next) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        try {
            const id = req.params.id
            const { firstName, lastName } = req.body;
            // console.log("deleteProdId");
            const dataQuery = `mutation customerUpdate($input: CustomerInput!){
                customerUpdate(input: $input){
                  customer{
                    id
                    firstName
                    lastName
                  }
                }
              }`
            const variables = {
                "input": {
                    "id": `gid://shopify/Customer/${id}`,
                    "firstName": `${firstName}`,
                    "lastName": `${lastName}`
                }
            }
            const data = await client.query({ data: { query: dataQuery, variables: variables } })
            console.log(data);
            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error })
            next;
        }
    })

    // GraphQL Customers API ends here

//widgit starts



//widgit ends



    // All endpoints after this point will have access to a request.body
    // attribute, as a result of the express.json() middleware
    app.use(express.json());

    app.use((req, res, next) => {
        const shop = req.query.shop;
        if (Shopify.Context.IS_EMBEDDED_APP && shop) {
            res.setHeader("Content-Security-Policy", `frame-ancestors https://${shop} https://admin.shopify.com;`);
        } else {
            res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
        }
        next();
    });

    if (isProd) {
        const compression = await import("compression").then(({ default: fn }) => fn);
        const serveStatic = await import("serve-static").then(({ default: fn }) => fn);
        app.use(compression());
        app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
    }

    app.use("/*", async (req, res, next) => {
        const shop = req.query.shop;

        // Detect whether we need to reinstall the app, any request from Shopify will
        // include a shop in the query parameters.
        if (app.get("active-shopify-shops")[shop] === undefined && shop) {
            res.redirect(`/api/auth?shop=${shop}`);
        } else { // res.set('X-Shopify-App-Nothing-To-See-Here', '1');
            const fs = await import("fs");
            const fallbackFile = join(isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH, "index.html");
            res.status(200).set("Content-Type", "text/html").send(fs.readFileSync(fallbackFile));
        }
    });

    return { app };
}
if (!isTest) {

    createServer().then(({ app }) => app.listen(PORT));
}
