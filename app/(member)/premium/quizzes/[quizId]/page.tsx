import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getImages, getQuizzes } from "@/lib/db";
import { QuizPlayer } from "@/components/premium/quiz-player";

export default async function QuizDetailPage({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;
  const [quizzes, images, user] = await Promise.all([getQuizzes(), getImages(), getCurrentUser()]);
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return notFound();

  if (!user?.isPremium) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTitle>Premium required</AlertTitle>
          <AlertDescription>
            This quiz is gated. Ask an admin to enable your premium flag on the Users page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {quiz.title} <Badge>Premium</Badge>
          </CardTitle>
          <p className="text-muted-foreground">{quiz.description}</p>
        </CardHeader>
        <CardContent>
          <QuizPlayer quiz={quiz} images={images} />
        </CardContent>
      </Card>
    </div>
  );
}

