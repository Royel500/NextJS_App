<!-- https://nextjs-flax-nine-40.vercel.app -->
Live Link : 
[Next.js Product Add & Selling Website](https://nextjs-flax-nine-40.vercel.app)

 Product Add & Selling Website

A full-stack **product listing and selling website** built with **Next.js**, **MongoDB**, and **React**. This platform allows users to browse products, search for items, view product details, and manage their listings. Admins can add, update, or remove products.

---

## 🔹 Features

### User Features:

* **Browse Products:** View all available products with images, prices, and descriptions.
* **Search Products:** Search for products using keywords.
* **Product Details:** Click on a product to view detailed information.
* **Favorite Products:** Mark products as favorite for easy access.
* **Responsive UI:** Fully responsive design for mobile, tablet, and desktop.
* **Language Selector:** Multilingual support for better accessibility.

### Admin Features:

* **Add Products:** Admin can add new product listings with images, price, description, and category.
* **Update & Delete Products:** Edit or remove existing products.
* **Dashboard:** Admin can manage all products and view user activity.

### Additional Features:

* **Dynamic Routing:** Each product has its own details page using dynamic Next.js routes.
* **Search Functionality:** Backend search API to fetch filtered results.
* **Dark & Light Mode Support:** Seamless theme switching for better UX.
* **Animations & Interactive UI:** Smooth transitions and animations for better engagement.

---

## 🔹 Technologies Used

* **Frontend:**

  * [Next.js](https://nextjs.org/) – React framework for server-side rendering and routing.
  * [React Icons](https://react-icons.github.io/react-icons/) – For modern UI icons.
  * [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling.
  * [Framer Motion](https://www.framer.com/motion/) – Animations and interactive UI effects.

* **Backend:**

  * [Node.js](https://nodejs.org/) – JavaScript runtime.
  * [Express.js](https://expressjs.com/) – Server-side framework for API endpoints.
  * [MongoDB](https://www.mongodb.com/) – NoSQL database for storing products and user data.
  * [Mongoose](https://mongoosejs.com/) – ODM for MongoDB.

* **Authentication & Security:**

  * [JWT](https://jwt.io/) – JSON Web Tokens for secure authentication.
  * [dotenv](https://www.npmjs.com/package/dotenv) – For environment variables.

* **Others:**

  * Axios – For HTTP requests.
  * Nodemon – For auto-restarting the server during development.



## 🔹 API Endpoints

* **GET /packages** – Fetch all products.
* **GET /packages/\:id** – Fetch details of a specific product.
* **POST /addpackage** – Add a new product (admin only).
* **PATCH /packages/\:id** – Update a product (admin only).
* **DELETE /packages/\:id** – Delete a product (admin only).
* **GET /packages?search=keyword** – Search products by keyword.

---

---

## 🔹 Future Enhancements

* Add **user authentication** with role-based access.
* Enable **shopping cart** functionality.
* Implement **payment gateway** for product purchases.
* Add **review and rating** system.
* Deploy the website on **Vercel** or **Netlify** with a cloud MongoDB instance.

---

## 🔹 Author

**Md. Royel Ali**
Full-stack Developer | [Portfolio](https://gentle-bonbon-835bcf.netlify.app/)

