import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { ApiError } from './utility/apiError.js';
import authRoutes from './routes/auth/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.send('the server is running just fine');
});

// Mount routes
app.use('/api/auth', authRoutes);

// Global error handling middleware (must be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle ApiError instances
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
            statusCode: err.statusCode
        });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', err);
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: [],
        data: null,
        statusCode: 500
    });
});

export default app;

