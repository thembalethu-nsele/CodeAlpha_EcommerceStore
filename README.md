CodeAlpha_EcommerceStore

A full-stack e-commerce web application built for the CodeAlpha Full Stack Development Internship (Task 1). Customers can browse products, add them to a cart, place orders and track their order history. An admin can manage products and update order statuses.

Live demo: [https://codealpha-ecommercestore.onrender.com](https://codealpha-ecommercestore-35lm.onrender.com) (The site is on a free plan and goes to sleep when unused, so the first load can take about a minute.)

Features

Customer

Register and log in (JWT authentication, hashed passwords)
Browse products, search by name and filter by category
View a product details page
Shopping cart: add items, change quantities, remove items
Checkout with a shipping address (stock is checked and reduced on every order)
View order history and order status

Admin

Add, edit and delete products
View all customer orders
Update order status (Pending, Shipped, Delivered, Cancelled)
Tech stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express
Database	MongoDB Atlas (Mongoose)
Authentication	JSON Web Tokens (JWT), bcrypt
Hosting	Render (server), MongoDB Atlas (database)
Option A: Use the live site (nothing to install)
Open the live demo link above.
Browse the products, or click Register to create a customer account.
Add products to your cart, open Cart, enter a shipping address and click Place order.
Open My Orders to see your order.

Demo admin account

Email	Password
admin@store.com	Admin123

Log in with it and open Admin in the menu to manage products and orders.
_________________________________________________________________________________________________________________________________________
_________________________________________________________________________________________________________________________________________

Option B: Clone it and run your own copy

The repository does not include a database or any passwords. To run your own copy you must create your own free MongoDB Atlas database and connect it through a .env file.

1. Install the requirements
Node.js (LTS version)
Git

Check that both are installed:

bash
node -v
npm -v
git --version
2. Clone the repository
bash
git clone https://github.com/thembalethu-nsele/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
npm install
3. Create your own database (MongoDB Atlas, free)
Go to mongodb.com/atlas and sign up.
Create a free M0 cluster.
Open Database Access, click Add New Database User, and choose a username and a password. Use only letters and numbers in the password, and write it down.
Open Network Access, click Add IP Address, and choose Allow Access From Anywhere (0.0.0.0/0). Click Confirm.
Open your cluster, click Connect, choose Drivers, and copy the connection string. It looks like this:
mongodb+srv://USERNAME:<db_password>@yourcluster.xxxxx.mongodb.net/

You do not need to create any tables or collections. MongoDB creates them automatically when the app saves data.

4. Create the .env file

In the project's main folder, copy .env.example to a new file named .env:

bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac / Linux
cp .env.example .env

Open .env and fill in your values:

MONGO_URI=mongodb+srv://USERNAME:YOUR_PASSWORD@yourcluster.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=any_long_random_text
PORT=5000
Replace USERNAME and YOUR_PASSWORD with your database user's details (no < or > characters).
/ecommerce after the host name is the database name.
JWT_SECRET can be any long random text.
Never commit your .env file. It is already listed in .gitignore.
5. Add the sample data

This creates the admin account and 8 sample products in your database. Run it once:

bash
node server/seed.js

You should see Admin created: admin@store.com / Admin123 and Sample products added.

(Optional) To connect the product photos in client/images to the products, run:

bash
node server/setImages.js

Products without a matching photo get a coloured placeholder with their name on it.

6. Start the server
bash
npm run dev

Wait for these two lines:

MongoDB connected
Server running on http://localhost:5000

Then open http://localhost:5000 in your browser. Log in as admin@store.com / Admin123 to see the admin pages.

The use case diagram and class diagram are in the  folder.

The shopping cart is stored in the browser (localStorage) until checkout. Orders are saved in MongoDB, with the product name and price recorded at the time of purchase.

Thembalethu Nsele Built as part of the CodeAlpha Full Stack Development Internship.
