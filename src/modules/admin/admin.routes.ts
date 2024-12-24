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

router.post('/register', validate(registerSchema), register);
router.get('/verify', validate(verifyEmailSchema), verifyRegistration);
router.post('/login', validate(loginSchema), login);
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/profile', uploadMultiple, createAdminProfile);

// router.post('/verify-user', validate(verifyUserSchema), verifyUser);

export default router;
