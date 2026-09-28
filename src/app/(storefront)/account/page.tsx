import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/account/ProfileForm";

export default async function AccountProfilePage() {
  const session = await auth();
  
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="bg-background border rounded-3xl p-6 md:p-8">
        <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone }} />
      </div>
    </div>
  );
}
