import { Card,CardHeader,CardContent,CardDescription, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '../logout/logout'

const stats = [
  {
    title:"Total",
    value: "5",
    description:"Total Automations Created"
  },
  {
    title:"Published",
    value: "0",
    description:"Total Automations Created"
  },
  {
    title:"Scheduled",
    value: "0",
    description:"Total Automations Created"
  },
  {
    title:"Failed",
    value: "0",
    description:"Total Automations Created"
  }
]

export default async function Automation() {

  const user = await getCurrentUser();
  if(!user){
    redirect("/login");
  }
  if(!user){
    redirect("/login");
  }
  return (
    <div className='space-y-8'>
      <LogoutButton/>
      <div>
        <h1 className='text-4xl'>Dashboard</h1>
        <p>Manage your company's Social media publishing</p>
      </div>
      <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
        {stats.map((stat) =>(
          <Card key={stat.title} className='bg-grey/10'>
            <CardHeader className='pb-2'>
              <CardTitle>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {stat.value}
              </CardDescription>
            </CardContent>
          </Card>
        ))}

      </div>
      <div className="">
        <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No posts yet. Create your first social media post.
          </p>
        </CardContent>
      </Card>
      </div>

    </div>
  )
}

