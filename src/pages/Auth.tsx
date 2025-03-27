import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Lock, User, LogIn, UserPlus, ArrowRight, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/utils/languageUtils";
import { supabase } from "@/integrations/supabase/client";
const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  })
});
const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters"
  }),
  email: z.string().email({
    message: "Invalid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirm Password must be at least 6 characters"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    signIn,
    signUp
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({
        title: t('loginSuccess'),
        description: t('welcomeBack')
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, values.username);
      toast({
        title: t('registrationSuccess'),
        description: t('accountCreated')
      });
      await signIn(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center">
            <img src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" alt="Pinterest Grab" className="h-8" />
            <span className="ml-2 font-bold text-2xl glow-text text-white">Pinterest Grab</span>
          </Link>
          
        </div>

        <Card className="border-gray-200 dark:border-gray-800 shadow-[0_0_20px_rgba(230,0,35,0.2)] dark:shadow-[0_0_20px_rgba(230,0,35,0.3)]">
          <CardHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="hover:glow-red">{t('login')}</TabsTrigger>
                <TabsTrigger value="register" id="register-tab" className="hover:glow-red">{t('signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="pt-4">
                <CardTitle className="text-2xl glow-text">Welcome Back</CardTitle>
                <CardDescription className="text-white">
                  {t('loginToAccount')}
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="register" className="pt-4">
                <CardTitle className="text-2xl glow-text">{t('createAccount')}</CardTitle>
                <CardDescription>
                  {t('fillDetails')}
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login" className="pt-0">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField control={loginForm.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>{t('email')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input placeholder="you@example.com" className="pl-10 focus:shadow-[0_0_10px_rgba(230,0,35,0.3)]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={loginForm.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>{t('password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input type="password" placeholder="••••••••" className="pl-10 focus:shadow-[0_0_10px_rgba(230,0,35,0.3)]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </CardContent>
                  
                  <CardFooter className="flex-col space-y-4">
                    <Button type="submit" className="w-full bg-pinterest-red hover:bg-pinterest-dark gap-2 animate-glow-pulse" disabled={isLoading}>
                      {isLoading ? t('loggingIn') : t('login')} 
                      {!isLoading && <LogIn className="h-4 w-4" />}
                    </Button>
                    
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-700"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-950 px-2 text-gray-500 dark:text-gray-400">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 w-full">
                      <Button type="button" variant="outline" className="w-full gap-2 hover:shadow-[0_0_15px_rgba(230,0,35,0.5)]" onClick={handleGoogleSignIn}>
                        <Globe className="h-4 w-4" />
                        Google
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register" className="pt-0">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField control={registerForm.control} name="username" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>{t('username')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input placeholder="johndoe" className="pl-10 focus:shadow-[0_0_10px_rgba(230,0,35,0.3)]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={registerForm.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>{t('email')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input placeholder="you@example.com" className="pl-10 focus:shadow-[0_0_10px_rgba(230,0,35,0.3)]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={registerForm.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>{t('password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input type="password" placeholder="••••••••" className="pl-10 focus:shadow-[0_0_10px_rgba(230,0,35,0.3)]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={registerForm.control} name="confirmPassword" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>{t('confirmPassword')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input type="password" placeholder="••••••••" className="pl-10 focus:shadow-[0_0_10px_rgba(230,0,35,0.3)]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </CardContent>
                  
                  <CardFooter className="flex-col space-y-4">
                    <Button type="submit" className="w-full bg-pinterest-red hover:bg-pinterest-dark gap-2 animate-glow-pulse" disabled={isLoading}>
                      {isLoading ? t('signingUp') : t('signup')} 
                      {!isLoading && <UserPlus className="h-4 w-4" />}
                    </Button>
                    
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300 dark:border-gray-700"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-950 px-2 text-gray-500 dark:text-gray-400">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 w-full">
                      <Button type="button" variant="outline" className="w-full gap-2 hover:shadow-[0_0_15px_rgba(230,0,35,0.5)]" onClick={handleGoogleSignIn}>
                        <Globe className="h-4 w-4" />
                        Google
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex-col space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="text-sm text-center">
              <span className="text-gray-600 dark:text-gray-400">Don't have an account? Sign up now!</span>{" "}
              <Link to="/" className="text-pinterest-red hover:underline hover:glow-red">
                {t('backToHome')} <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default Auth;