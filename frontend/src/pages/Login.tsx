import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from '@react-oauth/google'
import api from '@/lib/api'


const Login = () => {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed', err);
      alert(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/api/auth/register', { email, password, name });
      const { token, user } = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed', err);
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential

      const res = await api.post('/api/auth/google', { idToken })

      // Backend wraps response in ApiResponse: { data: { user, token }, message, statusCode, success }
      const { token, user } = res.data.data

      // store JWT
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // redirect
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Login failed', err)
      alert(err.response?.data?.message || 'Google login failed. Please try again.')
    }
  }

  const handleGoogleError = () => {
    console.error('Google Sign-In failed')
    alert('Google login failed. Please try again.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          {isRegisterMode ? 'Create Account' : 'Login'}
        </h1>
        
        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleError}
            size="large"
            text="signin_with"
            width="384"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">
              or {isRegisterMode ? 'sign up' : 'sign in'} with email
            </span>
          </div>
        </div>

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
          {isRegisterMode && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-gray-50 border-0 placeholder:text-gray-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-gray-50 border-0 placeholder:text-gray-500"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>{isRegisterMode ? 'Creating account...' : 'Signing in...'}</span>
              </div>
            ) : (
              isRegisterMode ? 'Create Account' : 'Login'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            {isRegisterMode 
              ? 'Already have an account? Login' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;