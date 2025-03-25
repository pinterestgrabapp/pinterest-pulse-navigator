
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/utils/languageUtils';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'login') {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        if (password.length < 6) {
          toast({
            title: "Password too short",
            description: "Password must be at least 6 characters",
            variant: "destructive",
          });
          return;
        }
        await signUp(email, password, username);
        setActiveTab('login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="glass-card border-none shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'login' 
                  ? 'Enter your email and password to sign in' 
                  : 'Enter your details to create an account'}
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-pinterest-red hover:bg-pinterest-dark text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('loading')}
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="johndoe" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input 
                        id="email-register" 
                        type="email" 
                        placeholder="email@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Password</Label>
                      <Input 
                        id="password-register" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-pinterest-red hover:bg-pinterest-dark text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('loading')}
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
