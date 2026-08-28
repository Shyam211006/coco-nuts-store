# Coco Nuts — Complete Project (Frontend + Backend + MongoDB)

This is your complete, working project: the front-end you built, plus a real
Node.js/Express backend, plus a MongoDB database. Everything runs from one
folder with one command.

```
coconut-mongo/
├── server.js              # starts everything
├── seed.js                # loads your 9 products into MongoDB
├── .env.example            # copy to .env and fill in your MongoDB connection string
├── package.json
├── config/
│   └── db.js               # connects to MongoDB
├── models/                 # MongoDB schemas (Product, CartItem, Order, Contact)
├── routes/                 # API endpoints (products, cart, orders, contact)
└── public/                 # your actual front-end — HTML, CSS, JS, images
    ├── index.html, product.html, cont.html, cart.html, checkout.html, ...
    ├── style.css, style3.css
    ├── collection.js, index.js, cart.js
    └── images/              # placeholder images — swap in your real ones
```

---

## Step 1 — Install Node.js
Download the LTS version from https://nodejs.org, then confirm it's installed:
```bash
node -v
npm -v
```

---

## Step 2 — Get a MongoDB connection string ("API key")
MongoDB doesn't use an API key exactly — it uses a **connection string** (a URL
with your credentials baked in). You have two options:

### Option A — MongoDB Atlas (cloud, free, recommended if you don't want to install anything)
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0 cluster** (takes ~2 minutes to spin up).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, click **Add IP Address** → **Allow Access from
   Anywhere** (fine for development).
5. Click **Connect** on your cluster → **Drivers** → copy the connection
   string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. Replace `<username>` and `<password>` with the database user you made, and
   add `coconuts` as the database name at the end:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/coconuts
   ```

### Option B — Local MongoDB (runs on your own machine, no internet needed after setup)
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start it (it usually runs automatically as a service after install; if not,
   run `mongod` in a terminal).
3. Your connection string is simply:
   ```
   mongodb://127.0.0.1:27017/coconuts
   ```

---

## Step 3 — Configure your `.env` file
In the project folder, copy the example file:
```bash
cp .env.example .env
```
Open `.env` and paste in your real MongoDB connection string from Step 2:
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/coconuts
PORT=3000
SESSION_SECRET=any-random-long-string-you-make-up
```
Leave the `RAZORPAY_*` / `STRIPE_SECRET_KEY` lines blank for now — those are
only needed later if you connect a real payment provider (see "Next steps"
below).

**Never commit your real `.env` file to GitHub** — it contains your database
password. The `.gitignore` already excludes it.

---

## Step 4 — Install dependencies
```bash
npm install
```
This installs Express, Mongoose (MongoDB driver), express-session,
connect-mongo, and dotenv.

---

## Step 5 — Add your product images
Right now `public/images/` has placeholder images so the site works out of
the box. Swap in your real photos using the same filenames:
```
public/images/pic1.png   (Fresh Coconut)
public/images/pic2.png   (Coconut Water)
public/images/pic3.png   (Coconut Oil)
public/images/pic4.png   (Coconut Chocolate)
public/images/pic5.png   (Coconut Soap)
public/images/pic6.png   (Shell Product)
public/images/pic7.png   (Coconut Fiber)
public/images/pic8.png   (Coconut Milk & Cream)
public/images/pic9.png   (Desiccated Coconut)
public/images/image.png  (homepage hero image)
```

---

## Step 6 — Seed the database
This loads your 9 products into MongoDB (run once, or again anytime you want
to reset the product catalog):
```bash
npm run seed
```
You should see:
```
MongoDB connected: coconuts
Seeded 9 products.
```

---

## Step 7 — Run the server
```bash
npm start
```
You should see:
```
MongoDB connected: coconuts
Coco Nuts server running at http://localhost:3000
```

---

## Step 8 — Open the site
Go to **http://localhost:3000**. Everything is live:
- **Home / Products** — browse products
- **Add to Cart / Buy Now** — actually saves to MongoDB, tied to your browser session
- **Cart page** (`cart.html`) — view and remove items
- **Checkout** (`checkout.html`) — places a real order in the `orders` collection
- **Contact page** — messages are saved to the `contacts` collection

Each visitor gets a session cookie so their cart persists across page loads
and even server restarts (sessions are stored in MongoDB too).

---

## Viewing your data
Use **MongoDB Compass** (free GUI, https://www.mongodb.com/products/compass)
and paste in the same connection string from your `.env` to browse the
`products`, `cartitems`, `orders`, and `contacts` collections visually.

---

## Next steps you might want
- **Admin page** to add/edit/delete products instead of editing `seed.js`
- **User accounts / login** — add a `User` model + password hashing (bcrypt) + JWT or sessions
- **Real payments** — wire in the Razorpay or Stripe keys from `.env` at checkout instead of the demo order flow
- **Deploying it live** — Render, Railway, or Vercel (backend) + MongoDB Atlas (already cloud-hosted) is a common free-tier combo
