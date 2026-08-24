import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import LogoutButton from "../logout/logout";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function ConnectedAccountsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
  });

  const connectedProviders = new Set(accounts.map((a: { provider: string }) => a.provider.toLowerCase()));

  const platforms = [
    {
      id: "google",
      name: "Google",
      description: "Sign in and account management with Google",
      connected: connectedProviders.has("google"),
      connectUrl: "/api/auth/google",
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Auto-publish posts and stories to Instagram",
      connected: connectedProviders.has("instagram"),
      connectUrl: "#",
    },
    {
      id: "facebook",
      name: "Facebook",
      description: "Publish updates and media to your Facebook Page",
      connected: connectedProviders.has("facebook"),
      connectUrl: "#",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Share updates with your professional network",
      connected: connectedProviders.has("linkedin"),
      connectUrl: "#",
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Connected Accounts</h1>
          <p className="text-muted-foreground text-sm">
            Manage your connected social accounts and OAuth integrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/automation">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {platforms.map((platform) => (
          <Card key={platform.id} className="bg-card/50 backdrop-blur border border-border">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    platform.connected
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {platform.connected ? "Connected" : "Not Connected"}
                </span>
              </div>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {platform.connected ? (
                <Button variant="outline" size="sm" disabled className="w-full">
                  Connected
                </Button>
              ) : platform.connectUrl === "#" ? (
                <Button variant="outline" size="sm" disabled className="w-full">
                  Coming Soon
                </Button>
              ) : (
                <Link
                  href={platform.connectUrl}
                  className={buttonVariants({ variant: "default", size: "sm", className: "w-full text-center" })}
                >
                  Connect {platform.name}
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
