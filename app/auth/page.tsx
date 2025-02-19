import AuthForm from '../components/Auth/AuthForm';
import { AuthProvider } from '../context/AuthContext';

export default function AuthPage() {
    return (
        <AuthProvider>
            <AuthForm />
        </AuthProvider>
    );
} 