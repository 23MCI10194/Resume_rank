import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-28 w-28 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-28 w-28 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="animate-pulse">
        <CardHeader>
          <Skeleton className="h-7 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>

      <Card className="animate-pulse">
        <CardHeader>
          <Skeleton className="h-7 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
