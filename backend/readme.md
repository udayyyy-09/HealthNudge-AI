HOW EMAIL VERIFICATION IS DONE
1st I will register user mail and pass that email to sendVerification function and crypto token with it crypto token generate for one-one email like papa ki id verify hui through verification token.

Comming to verify-email part
I created a function verify-email in which I verify email using cypto verification token and pass that token to url 

Now During login I am not sending token to json format because in previous project I store token in json and access in frontend and save them in localStorage which is vulnerable to XSS attacks. Now I used HTTP Only Cookies to store token in cookies which are very secure and authmiddleware access token now form req.cookies.token

| Feature          | Tool                        |
| ---------------- | --------------------------- |
| Password hashing | `bcryptjs`                  |
| Email sending    | `nodemailer`                |
| Token creation   | `jsonwebtoken`              |
| Cookie handling  | `cookie-parser`             |
| Database         | `MongoDB + Mongoose`        |
| Security         | `httpOnly + secure cookies` |
| Auth middleware  | Custom `authMiddleware`     |

🧠 “Built a full-stack wellness platform using GenAI (Gemini API) to generate real-time personalized health suggestions based on user habits and medical data.”

cb in multer is a callback fn used to define a file will be upload or rejected

Created a Pipeline of upload report from pdf/scannedpdf/images on figma