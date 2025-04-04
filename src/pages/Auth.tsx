import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAuthForm } from "@/components/auth/UserAuthForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupForm } from "@/components/auth/SignupForm";
import { useState } from "react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/hr-team-building-recruitment-concept-blurred-background-human-resource-management_161452-2293.jpg?w=2000')" }} // Replace with your image path
    >
      <div className="w-full max-w-md animate-fade-in bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <Card className="border-accent/20 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-bold">
                LP
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Payroll Management</CardTitle>
            <CardDescription>
              Payroll & HR Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <UserAuthForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
