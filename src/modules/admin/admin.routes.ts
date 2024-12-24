import { Router } from 'express';
import { register, verifyRegistration, login, forgetPassword, resetPassword, createAdminProfile, } from './admin.controller';
import { registerSchema, loginSchema, verifyEmailSchema, forgetPasswordSchema, resetPasswordSchema, } from './validationSchemas';
import multer from 'multer';
import path from 'path';
import { validate } from './validationMiddleware';
const router = Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.fields([
    { name: 'whitePaper', maxCount: 1 },
    { name: 'footerAddress', maxCount: 2 }
]);

// Swagger documentation setup
/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin registration, authentication, and profile management
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Admin]
 *     description: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered, please verify your email
 *       400:
 *         description: Email already registered
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /verify:
 *   get:
 *     tags: [Admin]
 *     description: Verify admin email address
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify', validate(verifyEmailSchema), verifyRegistration);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Admin]
 *     description: Login an admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns the token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /forget-password:
 *   post:
 *     tags: [Admin]
 *     description: Send password reset link to admin's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent to email
 *       400:
 *         description: Email not registered
 */
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     tags: [Admin]
 *     description: Reset admin password using reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /profile:
 *   post:
 *     tags: [Admin]
 *     description: Create or update the admin profile with files (whitePaper and footerAddress)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               socials:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                   twitter:
 *                     type: string
 *               whitePaper:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               footerAddress:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Admin profile created successfully
 *       400:
 *         description: Invalid file format or missing required fields
 */
router.post('/profile', uploadMultiple, createAdminProfile);

export default router;
