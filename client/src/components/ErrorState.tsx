import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  WifiOff,
  Server,
  Database,
  XCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  error?: string | Error;
  title?: string;
  description?: string;
  variant?: "default" | "network" | "server" | "database" | "notFound" | "unauthorized";
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
  showDetails?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title,
  description,
  variant = "default",
  showRetry = true,
  showHome = true,
  showBack = false,
  onRetry,
  onHome,
  onBack,
  actions,
  className,
  showDetails = false,
}) => {
  const errorMessage = error instanceof Error ? error.message : error || "An unexpected error occurred";
  
  const errorDetails = error instanceof Error ? error.stack : null;

  const getVariantConfig = () => {
    switch (variant) {
      case "network":
        return {
          icon: WifiOff,
          title: title || "Network Error",
          description: description || "Unable to connect to the server. Please check your internet connection and try again.",
          badge: "Network",
          badgeVariant: "destructive" as const,
        };
      case "server":
        return {
          icon: Server,
          title: title || "Server Error",
          description: description || "The server is experiencing issues. Please try again later.",
          badge: "Server",
          badgeVariant: "destructive" as const,
        };
      case "database":
        return {
          icon: Database,
          title: title || "Database Error",
          description: description || "Unable to access the database. Please try again later.",
          badge: "Database",
          badgeVariant: "destructive" as const,
        };
      case "notFound":
        return {
          icon: XCircle,
          title: title || "Not Found",
          description: description || "The requested resource could not be found.",
          badge: "404",
          badgeVariant: "secondary" as const,
        };
      case "unauthorized":
        return {
          icon: AlertTriangle,
          title: title || "Unauthorized",
          description: description || "You don't have permission to access this resource.",
          badge: "401",
          badgeVariant: "destructive" as const,
        };
      default:
        return {
          icon: AlertTriangle,
          title: title || "Something went wrong",
          description: description || "An unexpected error occurred. Please try again.",
          badge: "Error",
          badgeVariant: "destructive" as const,
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn("flex items-center justify-center min-h-[400px] p-4", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-destructive" />
              </div>
              <Badge 
                variant={config.badgeVariant} 
                className="absolute -top-2 -right-2 text-xs"
              >
                {config.badge}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold">
            {config.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {config.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Error Details:</p>
                  <p className="text-muted-foreground break-words">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {showDetails && errorDetails && (
            <details className="bg-muted/30 rounded-lg p-3">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                Technical Details
              </summary>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                {errorDetails}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {showRetry && (
              <Button 
                onClick={onRetry} 
                variant="default" 
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            
            {showBack && (
              <Button 
                onClick={onBack} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            )}
            
            {showHome && (
              <Button 
                onClick={onHome} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            )}
          </div>

          {actions && (
            <div className="pt-2">
              {actions}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;