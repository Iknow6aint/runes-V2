import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from './admin.schema';
import { uploadToCloudinary } from '../../utils/cloudinaryUtils';
import { sendEmail } from '../../utils/mailer';
import { sanitize } from '../../utils/sanitize';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRATION = '1h';

interface MulterRequest extends Request {
    files?: {
        [fieldname: string]: Express.Multer.File[]; // General structure for dynamic fields
    } & {
        whitePaper?: Express.Multer.File[]; // Explicitly include specific fields
        footerAddress?: Express.Multer.File[];
    };
}
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = sanitize(req.body);

        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        const verificationLink = `http://localhost:3000/api/admin/verify?token=${verificationToken}`;

        await sendEmail(email, 'Verify your email', `Please click the link to verify your email: ${verificationLink}`);

        const newAdmin = new AdminModel({
            name,
            email,
            password: hashedPassword,
            verificationToken,
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registered, please verify your email',
            user: newAdmin,
            success: true,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Failed to register admin, please try again later' });
    }
};

export const verifyRegistration = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    try {
        const decoded: any = jwt.verify(token as string, JWT_SECRET);
        const admin = await AdminModel.findOne({ email: decoded.email });

        if (!admin) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }

        admin.isVerified = true;
        admin.verificationToken = '';
        await admin.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = sanitize(req.body);

    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({ token, success: true, admin });
    } catch (error) {
        res.status(500).json({ message: 'Error during login' });
    }
};

export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = sanitize(req.body);

    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            res.status(400).json({ message: 'Email not registered' });
            return;
        }

        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        admin.resetPasswordToken = resetToken;
        admin.resetPasswordTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await admin.save();

        const resetLink = `http://www.temperamentals.xyz/api/admin/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Reset Password', `Please click the link to reset your password: ${resetLink}`);

        res.status(200).json({ message: 'Password reset link sent to your email', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error sending password reset link' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, password } = sanitize(req.body);

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const admin = await AdminModel.findOne({ email: decoded.email });

        if (!admin) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }

        if (
            !admin.resetPasswordTokenExpiry ||
            admin.resetPasswordToken !== token ||
            admin.resetPasswordTokenExpiry < new Date()
        ) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }

        admin.password = await bcrypt.hash(password, 12);
        admin.resetPasswordToken = '';
        admin.resetPasswordTokenExpiry = undefined;
        await admin.save();

        res.status(200).json({ message: 'Password reset successfully', success: true });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export const createAdminProfile = async (req: Request, res: Response): Promise<void> => {
    const sanitizedBody = sanitize(req.body);
    const { userId, name, email, password, socials } = sanitizedBody;

    try {
        const admin = new AdminModel({
            userId,
            name,
            email,
            password,
            socials,
        });

        const multerReq = req as MulterRequest; // Explicitly cast the request to MulterRequest

        if (multerReq.files?.whitePaper?.length) {
            const whitePaperUrl = await uploadToCloudinary(multerReq.files.whitePaper[0].path, 'white_papers');
            admin.whitePaper = whitePaperUrl;
        }

        if (multerReq.files?.footerAddress?.length) {
            const footerAddressUrls = await Promise.all(
                multerReq.files.footerAddress.map((file) => uploadToCloudinary(file.path, 'footer_address'))
            );
            admin.footerAddress = footerAddressUrls;
        }

        await admin.save();
        res.status(201).json({ message: 'Admin profile created successfully', success: true, admin });
    } catch (error) {
        console.error('Error creating admin profile:', error);
        res.status(500).json({ message: 'Failed to create admin profile', success: false });
    }
};
